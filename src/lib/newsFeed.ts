import { getPodcastList } from './microcms';
import { getNoteArticles } from './note';

export interface FeedItem {
  date: string;
  category: string;
  title: string;
  href?: string;
}

export async function getNewsFeed(limit = 30): Promise<FeedItem[]> {
  const [podcastData, blogPosts] = await Promise.all([
    getPodcastList(20),
    getNoteArticles(20),
  ]);

  const items: FeedItem[] = [];

  for (const ep of podcastData.contents) {
    items.push({
      date: ep.publishedAt,
      category: 'ポッドキャスト',
      title: `「${ep.episodeTitle}」を公開しました`,
      href: `/podcast/${ep.id}`,
    });
  }

  for (const post of blogPosts) {
    items.push({
      date: post.publishedAt,
      category: 'ブログ',
      title: post.title,
      href: post.link,
    });
  }

  items.sort((a, b) => b.date.localeCompare(a.date));
  return items.slice(0, limit);
}

export const CATEGORY_COLOR: Record<string, string> = {
  'お知らせ':     'bg-soil-100 text-soil-600',
  'ブログ更新':   'bg-green-100 text-green-700',
  'ブログ':       'bg-green-100 text-green-700',
  'ポッドキャスト': 'bg-blue-100 text-blue-700',
  '研修情報':     'bg-terracotta-100 text-terracotta-700',
};

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}
