import { createClient } from 'microcms-js-sdk';
import type { BlogPost, PodcastEpisode, Service, Member, About } from './types';
import {
  mockServices,
  mockBlogPosts,
  mockPodcastEpisodes,
  mockMembers,
  mockAbout,
} from './mockData';

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

const client =
  serviceDomain && apiKey ? createClient({ serviceDomain, apiKey }) : null;

const PER_PAGE = 12;

// ── ブログ ──────────────────────────────────────────────

export async function getBlogList(page = 1, limit = PER_PAGE) {
  if (!client) {
    const start = (page - 1) * limit;
    const slice = mockBlogPosts.slice(start, start + limit);
    return { contents: slice, totalCount: mockBlogPosts.length, offset: start, limit };
  }
  return client.getList<BlogPost>({
    endpoint: 'blog',
    queries: { limit, offset: (page - 1) * limit, orders: '-publishedAt' },
  });
}

export async function getBlogPost(contentId: string) {
  if (!client) return mockBlogPosts.find((p) => p.id === contentId) ?? null;
  return client.getListDetail<BlogPost>({ endpoint: 'blog', contentId });
}

export async function getAllBlogIds() {
  if (!client) return mockBlogPosts.map((p) => p.id);
  return client.getAllContentIds({ endpoint: 'blog' });
}

// ── ポッドキャスト ────────────────────────────────────────

export async function getPodcastList(limit = PER_PAGE, offset = 0) {
  if (!client) {
    const slice = mockPodcastEpisodes.slice(offset, offset + limit);
    return { contents: slice, totalCount: mockPodcastEpisodes.length, offset, limit };
  }
  return client.getList<PodcastEpisode>({
    endpoint: 'podcast',
    queries: { limit, offset, orders: '-publishedAt', depth: 2 },
  });
}

export async function getPodcastEpisode(contentId: string) {
  if (!client) return mockPodcastEpisodes.find((e) => e.id === contentId) ?? null;
  return client.getListDetail<PodcastEpisode>({
    endpoint: 'podcast',
    contentId,
    queries: { depth: 2 },
  });
}

export async function getAllPodcastIds() {
  if (!client) return mockPodcastEpisodes.map((e) => e.id);
  return client.getAllContentIds({ endpoint: 'podcast' });
}

// ── サービス ──────────────────────────────────────────────

export async function getServiceList() {
  if (!client) {
    return { contents: mockServices, totalCount: mockServices.length, offset: 0, limit: 100 };
  }
  return client.getList<Service>({
    endpoint: 'service',
    queries: { limit: 100, orders: 'order' },
  });
}

export async function getService(contentId: string) {
  if (!client) return mockServices.find((s) => s.id === contentId) ?? null;
  return client.getListDetail<Service>({ endpoint: 'service', contentId });
}

export async function getAllServiceIds() {
  if (!client) return mockServices.map((s) => s.id);
  return client.getAllContentIds({ endpoint: 'service' });
}

// ── メンバー ──────────────────────────────────────────────

export async function getMemberList() {
  if (!client) {
    return { contents: mockMembers, totalCount: mockMembers.length, offset: 0, limit: 100 };
  }
  return client.getList<Member>({
    endpoint: 'member',
    queries: { limit: 100, orders: 'order' },
  });
}

// ── About（単一コンテンツ / オブジェクト形式） ────────────

export async function getAbout() {
  if (!client) return mockAbout;
  return client.getObject<About>({ endpoint: 'about' });
}
