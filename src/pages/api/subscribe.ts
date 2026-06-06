export const prerender = false;

import type { APIContext } from 'astro';
import { Resend } from 'resend';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(ctx: APIContext): Promise<Response> {
  const json = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  let fd: globalThis.FormData;
  try {
    fd = await ctx.request.formData();
  } catch {
    return json({ ok: false, error: 'リクエストの形式が正しくありません。' }, 400);
  }

  const email = String(fd.get('email') ?? '').trim();
  const honeypot = String(fd.get('hp') ?? '');

  if (honeypot) return json({ ok: true });
  if (!email || !isValidEmail(email)) {
    return json({ ok: false, error: '有効なメールアドレスを入力してください。' }, 400);
  }

  type CfEnv = Record<string, string | undefined>;
  const cfEnv: CfEnv =
    (ctx.locals as { runtime?: { env?: CfEnv } }).runtime?.env ?? {};
  const getEnv = (key: string) => cfEnv[key] ?? import.meta.env[key as keyof ImportMetaEnv];

  const resendKey = getEnv('RESEND_API_KEY');
  const audienceId = getEnv('RESEND_AUDIENCE_ID');

  if (!resendKey || !audienceId) {
    console.log('[subscribe] 環境変数未設定 - email:', email);
    return json({ ok: true });
  }

  try {
    const resend = new Resend(resendKey);
    await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('[subscribe] Resend エラー:', err);
    return json({ ok: false, error: '登録中にエラーが発生しました。しばらく経ってから再度お試しください。' }, 500);
  }
}
