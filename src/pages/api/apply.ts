export const prerender = false;

import type { APIContext } from 'astro';
import { Resend } from 'resend';

const SERVICE_LABELS: Record<string, string> = {
  cucurbit: 'AI研修「ククルビット」',
  'service-planning': 'サービス・商品企画',
  other: 'その他',
};

// ── バリデーション ────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface FormData {
  company: string;
  name: string;
  email: string;
  tel: string;
  service: string;
  participants: string;
  message: string;
  honeypot: string;
  turnstileToken: string;
}

function parseFormData(fd: globalThis.FormData): FormData {
  return {
    company: String(fd.get('company') ?? '').trim(),
    name: String(fd.get('name') ?? '').trim(),
    email: String(fd.get('email') ?? '').trim(),
    tel: String(fd.get('tel') ?? '').trim(),
    service: String(fd.get('service') ?? '').trim(),
    participants: String(fd.get('participants') ?? '').trim(),
    message: String(fd.get('message') ?? '').trim(),
    honeypot: String(fd.get('phone_number_confirm') ?? ''),
    turnstileToken: String(fd.get('cf-turnstile-response') ?? ''),
  };
}

function validate(data: FormData): string | null {
  if (!data.company) return '会社名は必須です。';
  if (!data.name) return 'お名前は必須です。';
  if (!data.email) return 'メールアドレスは必須です。';
  if (!isValidEmail(data.email)) return '有効なメールアドレスを入力してください。';
  if (data.company.length > 200) return '会社名が長すぎます。';
  if (data.name.length > 100) return 'お名前が長すぎます。';
  if (data.message.length > 5000) return 'メッセージが長すぎます。';
  return null;
}

// ── Turnstile 検証 ────────────────────────────────────────

async function verifyTurnstile(token: string, secretKey: string, ip: string): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
    remoteip: ip,
  });
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const data = await res.json() as { success: boolean };
  return data.success === true;
}

// ── メール本文 ────────────────────────────────────────────

function buildNotifyHtml(data: FormData): string {
  const serviceLabel = (SERVICE_LABELS[data.service] ?? data.service) || '未選択';
  return `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #3b261a;">
  <h2 style="border-bottom: 2px solid #d0b090; padding-bottom: 8px; color: #6e4830;">
    【ハニヤス】新しいお申し込みがありました
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb; width: 30%;"><strong>会社名</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(data.company)}</td></tr>
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>お名前</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>メール</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>電話番号</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(data.tel) || '未入力'}</td></tr>
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>希望サービス</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(serviceLabel)}</td></tr>
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>想定参加人数</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(data.participants) || '未入力'}</td></tr>
    <tr><td style="padding: 8px; background: #faf6f1;"><strong>ご質問・ご要望</strong></td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.message) || '未入力'}</td></tr>
  </table>
  <p style="margin-top: 24px; font-size: 12px; color: #8a5c3d;">このメールはハニヤス合同会社 お問い合わせフォームより自動送信されました。</p>
</div>
  `.trim();
}

function buildAutoReplyHtml(data: FormData): string {
  const serviceLabel = (SERVICE_LABELS[data.service] ?? data.service) || '未選択';
  return `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #3b261a;">
  <h2 style="border-bottom: 2px solid #d0b090; padding-bottom: 8px; color: #6e4830;">
    お申し込みありがとうございます
  </h2>
  <p>${escapeHtml(data.name)} 様</p>
  <p>このたびはハニヤス合同会社へのお申し込みありがとうございます。<br />
  下記の内容で受け付けました。担当者より3営業日以内にご連絡いたします。</p>

  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb; width: 35%;"><strong>会社名</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(data.company)}</td></tr>
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>お名前</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>メール</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(data.email)}</td></tr>
    <tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>希望サービス</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(serviceLabel)}</td></tr>
    ${data.participants ? `<tr><td style="padding: 8px; background: #faf6f1; border-bottom: 1px solid #e4d0bb;"><strong>想定参加人数</strong></td><td style="padding: 8px; border-bottom: 1px solid #e4d0bb;">${escapeHtml(data.participants)}</td></tr>` : ''}
    ${data.message ? `<tr><td style="padding: 8px; background: #faf6f1;"><strong>ご質問・ご要望</strong></td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.message)}</td></tr>` : ''}
  </table>

  <hr style="margin: 24px 0; border: none; border-top: 1px solid #e4d0bb;" />
  <p style="font-size: 14px; color: #6e4830;"><strong>ハニヤス合同会社</strong></p>
  <p style="font-size: 12px; color: #8a5c3d;">
    このメールは自動送信です。返信されても対応できない場合があります。<br />
    直接のご連絡は <a href="mailto:info@haniyasu.com">info@haniyasu.com</a> までお願いします。
  </p>
</div>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── ハンドラー ────────────────────────────────────────────

export async function POST(ctx: APIContext): Promise<Response> {
  const json = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  let rawForm: globalThis.FormData;
  try {
    rawForm = await ctx.request.formData();
  } catch {
    return json({ ok: false, error: 'リクエストの形式が正しくありません。' }, 400);
  }

  const data = parseFormData(rawForm);

  // ハニーポットチェック
  if (data.honeypot) {
    return json({ ok: true }); // bot には成功を返す
  }

  // バリデーション
  const validationError = validate(data);
  if (validationError) {
    return json({ ok: false, error: validationError }, 400);
  }

  // Cloudflare Pages ランタイムの環境変数（import.meta.env はビルド時のみ）
  type CfEnv = Record<string, string | undefined>;
  const cfEnv: CfEnv =
    (ctx.locals as { runtime?: { env?: CfEnv } }).runtime?.env ?? {};
  const getEnv = (key: string) => cfEnv[key] ?? import.meta.env[key as keyof ImportMetaEnv];

  // Turnstile 検証（シークレットキーがある場合のみ）
  const turnstileSecret = getEnv('TURNSTILE_SECRET_KEY');
  if (turnstileSecret) {
    const ip = ctx.request.headers.get('CF-Connecting-IP') ?? '';
    const passed = await verifyTurnstile(data.turnstileToken, turnstileSecret, ip);
    if (!passed) {
      return json({ ok: false, error: 'ボット確認に失敗しました。再度お試しください。' }, 400);
    }
  }

  // Resend でメール送信
  const resendKey = getEnv('RESEND_API_KEY');
  if (!resendKey) {
    console.log('[apply] RESEND_API_KEY 未設定 - 送信内容:', data);
    return json({ ok: true });
  }

  const resend = new Resend(resendKey);
  const notifyTo = getEnv('CONTACT_NOTIFY_TO') || 'aoyama.masashi@haniyasu.com';

  const fromAddress = 'ハニヤス合同会社 <info@haniyasu.com>';

  const serviceLabel = (SERVICE_LABELS[data.service] ?? data.service) || '';

  const [notifyResult, replyResult] = await Promise.allSettled([
    // 1. 青山宛 通知メール
    resend.emails.send({
      from: fromAddress,
      to: notifyTo,
      replyTo: data.email,
      subject: `【申込】${data.company} ${data.name} 様 / ${serviceLabel || 'お問い合わせ'}`,
      html: buildNotifyHtml(data),
    }),
    // 2. 申込者宛 自動返信
    resend.emails.send({
      from: fromAddress,
      to: data.email,
      subject: '【ハニヤス合同会社】お申し込みありがとうございます',
      html: buildAutoReplyHtml(data),
    }),
  ]);

  if (notifyResult.status === 'rejected') {
    console.error('[apply] 通知メール送信失敗:', notifyResult.reason);
    return json({ ok: false, error: 'メール送信中にエラーが発生しました。しばらく経ってから再度お試しください。' }, 500);
  }
  if (replyResult.status === 'rejected') {
    // 自動返信失敗はログのみ（通知が届いていれば運用は可能）
    console.error('[apply] 自動返信メール送信失敗:', replyResult.reason);
  }

  return json({ ok: true });
}
