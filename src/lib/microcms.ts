import { createClient } from 'microcms-js-sdk';
import type { PodcastEpisode, Service, Member, About } from './types';
import {
  mockServices,
  mockPodcastEpisodes,
  mockMembers,
  mockAbout,
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
  return client.getList<PodcastEpisode>({
    endpoint: 'podcast',
    queries: { limit, offset, orders: '-publishedAt' },
  });
}

export async function getPodcastEpisode(contentId: string) {
  if (!client) return mockPodcastEpisodes.find((e) => e.id === contentId) ?? null;
  return client.getListDetail<PodcastEpisode>({
    endpoint: 'podcast',
    contentId,
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
