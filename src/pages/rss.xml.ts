import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getBlogList } from '@/lib/microcms';

export async function GET(context: APIContext) {
  const { contents: posts } = await getBlogList(1, 50);

  return rss({
    title: 'ハニヤス合同会社 ブログ',
    description: '人材育成・経営支援・AI活用などのテーマで発信しています。',
    site: context.site ?? 'https://haniyasu.com',
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      description: post.body?.replace(/<[^>]+>/g, '').slice(0, 200),
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>ja</language>',
  });
}
