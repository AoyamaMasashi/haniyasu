import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getNoteArticles } from '@/lib/note';

export async function GET(context: APIContext) {
  const posts = await getNoteArticles(50);

  return rss({
    title: 'ハニヤス合同会社 ブログ',
    description: '人材育成・経営支援・AI活用などのテーマで発信しています。',
    site: context.site ?? 'https://haniyasu.com',
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      description: post.description,
      link: post.link,
    })),
    customData: '<language>ja</language>',
  });
}
