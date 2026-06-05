const NOTE_RSS_URL = 'https://note.com/henyohaniyasu/rss';
export const NOTE_PROFILE_URL = 'https://note.com/henyohaniyasu';

export interface NoteArticle {
  id: string;
  title: string;
  link: string;
  description: string;
  publishedAt: string;
  thumbnail?: string;
}

function extractCdata(str: string): string {
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function parseRssItems(xml: string): NoteArticle[] {
  const items: NoteArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;

  while ((m = itemRegex.exec(xml)) !== null) {
    const item = m[1];
    const title = extractCdata(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
    const link =
      item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ??
      item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1]?.trim() ??
      '';
    const description = extractCdata(
      item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? ''
    ).replace(/<[^>]+>/g, '').slice(0, 200);
    const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';
    const thumbnail =
      item.match(/<enclosure[^>]*url="([^"]*)"[^>]*\/?>/)?.[1] ??
      item.match(/<media:thumbnail[^>]*url="([^"]*)"[^>]*\/?>/)?.[1];

    if (title && link) {
      items.push({
        id: link.split('/').pop() ?? String(items.length),
        title,
        link,
        description,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : '',
        thumbnail,
      });
    }
  }
  return items;
}

function mockArticles(): NoteArticle[] {
  return [
    {
      id: 'note-1',
      title: 'AIを活用した研修設計のポイント',
      link: NOTE_PROFILE_URL,
      description: '生成AIを研修設計に取り入れることで、受講者一人ひとりに最適化された学習体験を提供できます。',
      publishedAt: '2025-06-01T00:00:00.000Z',
    },
    {
      id: 'note-2',
      title: '「人創り」が企業成長の原動力になる理由',
      link: NOTE_PROFILE_URL,
      description: '人材育成への投資が、長期的な企業成長に直結する理由を事例とともに解説します。',
      publishedAt: '2025-05-15T00:00:00.000Z',
    },
    {
      id: 'note-3',
      title: 'ポッドキャスト第1回：ハニヤスが目指すもの',
      link: NOTE_PROFILE_URL,
      description: 'ハニヤスのミッションとこれからのビジョンについて話しました。',
      publishedAt: '2025-05-01T00:00:00.000Z',
    },
  ];
}

export async function getNoteArticles(limit = 50): Promise<NoteArticle[]> {
  try {
    const res = await fetch(NOTE_RSS_URL, {
      headers: { 'User-Agent': 'haniyasu-site/1.0' },
    });
    if (!res.ok) return mockArticles();
    const xml = await res.text();
    const items = parseRssItems(xml).slice(0, limit);
    return items.length > 0 ? items : mockArticles();
  } catch {
    return mockArticles();
  }
}
