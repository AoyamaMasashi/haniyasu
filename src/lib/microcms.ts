import { createClient } from 'microcms-js-sdk';
import type { PodcastEpisode, Service, Member, About, News } from './types';
import {
  mockServices,
  mockPodcastEpisodes,
  mockMembers,
  mockAbout,
  mockNews,
} from './mockData';

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

const client =
  serviceDomain && apiKey ? createClient({ serviceDomain, apiKey }) : null;

const PER_PAGE = 12;

// ── ポッドキャスト ────────────────────────────────────────

export async function getPodcastList(limit = PER_PAGE, offset = 0) {
  if (!client) {
    const slice = mockPodcastEpisodes.slice(offset, offset + limit);
    return { contents: slice, totalCount: mockPodcastEpisodes.length, offset, limit };
  }
  try {
    return await client.getList<PodcastEpisode>({
      endpoint: 'podcast',
      queries: { limit, offset, orders: '-publishedAt' },
    });
  } catch {
    const slice = mockPodcastEpisodes.slice(offset, offset + limit);
    return { contents: slice, totalCount: mockPodcastEpisodes.length, offset, limit };
  }
}

export async function getPodcastEpisode(contentId: string) {
  if (!client) return mockPodcastEpisodes.find((e) => e.id === contentId) ?? null;
  try {
    return await client.getListDetail<PodcastEpisode>({ endpoint: 'podcast', contentId });
  } catch {
    return null;
  }
}

export async function getAllPodcastIds() {
  if (!client) return mockPodcastEpisodes.map((e) => e.id);
  try {
    return await client.getAllContentIds({ endpoint: 'podcast' });
  } catch {
    return mockPodcastEpisodes.map((e) => e.id);
  }
}

// ── サービス ──────────────────────────────────────────────

export async function getServiceList() {
  if (!client) {
    return { contents: mockServices, totalCount: mockServices.length, offset: 0, limit: 100 };
  }
  try {
    return await client.getList<Service>({
      endpoint: 'service',
      queries: { limit: 100, orders: 'order' },
    });
  } catch {
    return { contents: mockServices, totalCount: mockServices.length, offset: 0, limit: 100 };
  }
}

export async function getService(contentId: string) {
  if (!client) return mockServices.find((s) => s.id === contentId) ?? null;
  try {
    return await client.getListDetail<Service>({ endpoint: 'service', contentId });
  } catch {
    return null;
  }
}

export async function getAllServiceIds() {
  if (!client) return mockServices.map((s) => s.id);
  try {
    return await client.getAllContentIds({ endpoint: 'service' });
  } catch {
    return mockServices.map((s) => s.id);
  }
}

// ── メンバー ──────────────────────────────────────────────

export async function getMemberList() {
  if (!client) {
    return { contents: mockMembers, totalCount: mockMembers.length, offset: 0, limit: 100 };
  }
  try {
    return await client.getList<Member>({
      endpoint: 'member',
      queries: { limit: 100, orders: 'order' },
    });
  } catch {
    return { contents: mockMembers, totalCount: mockMembers.length, offset: 0, limit: 100 };
  }
}

// ── お知らせ ──────────────────────────────────────────────

export async function getNewsList(limit = PER_PAGE, offset = 0) {
  if (!client) {
    const slice = mockNews.slice(offset, offset + limit);
    return { contents: slice, totalCount: mockNews.length, offset, limit };
  }
  try {
    return await client.getList<News>({
      endpoint: 'news',
      queries: { limit, offset, orders: '-publishedAt' },
    });
  } catch {
    const slice = mockNews.slice(offset, offset + limit);
    return { contents: slice, totalCount: mockNews.length, offset, limit };
  }
}

export async function getNewsItem(contentId: string) {
  if (!client) return mockNews.find((n) => n.id === contentId) ?? null;
  try {
    return await client.getListDetail<News>({ endpoint: 'news', contentId });
  } catch {
    return null;
  }
}

export async function getAllNewsIds() {
  if (!client) return mockNews.map((n) => n.id);
  try {
    return await client.getAllContentIds({ endpoint: 'news' });
  } catch {
    return mockNews.map((n) => n.id);
  }
}

// ── About（単一コンテンツ / オブジェクト形式） ────────────

export async function getAbout() {
  if (!client) return mockAbout;
  try {
    return await client.getObject<About>({ endpoint: 'about' });
  } catch {
    return mockAbout;
  }
}
