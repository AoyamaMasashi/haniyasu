import type { PodcastEpisode, Service, Member, About, News } from './types';

export const mockServices: Service[] = [
  {
    id: 'cucurbit',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    publishedAt: '2025-01-01T00:00:00.000Z',
    revisedAt: '2025-01-01T00:00:00.000Z',
    serviceName: 'AI研修「ククルビット」',
    lead: '生成AIを実務で使いこなすための実践型研修',
    body: '<p>ChatGPTをはじめとする生成AIを、貴社の業務に即した形で活用するための実践研修です。</p>',
    order: 1,
  },
  {
    id: 'service-planning',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    publishedAt: '2025-01-01T00:00:00.000Z',
    revisedAt: '2025-01-01T00:00:00.000Z',
    serviceName: 'サービス・商品企画支援',
    lead: '新規事業・商品開発のアイデア創出から事業化まで伴走支援',
    body: '<p>新規事業・商品開発のアイデア創出から、事業化・市場投入まで一貫してサポートします。</p>',
    order: 2,
  },
];

export const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: 'podcast-ep1',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
    publishedAt: '2025-06-01T00:00:00.000Z',
    revisedAt: '2025-06-01T00:00:00.000Z',
    episodeTitle: 'Episode 1: ハニヤスが目指すもの',
    description: '<p>第1回は青山と中村が、ハニヤスのミッションとこれからやりたいことを語ります。</p>',
    platformLinks: [],
  },
  {
    id: 'podcast-ep2',
    createdAt: '2025-05-15T00:00:00.000Z',
    updatedAt: '2025-05-15T00:00:00.000Z',
    publishedAt: '2025-05-15T00:00:00.000Z',
    revisedAt: '2025-05-15T00:00:00.000Z',
    episodeTitle: 'Episode 2: AI研修「ククルビット」の裏側',
    description: '<p>受講者から好評の AI 研修がどのように生まれたか、その舞台裏をお話しします。</p>',
    platformLinks: [],
  },
];

export const mockMembers: Member[] = [
  {
    id: 'aoyama',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    publishedAt: '2025-01-01T00:00:00.000Z',
    revisedAt: '2025-01-01T00:00:00.000Z',
    name: '青山 雅志',
    role: '代表 / ファシリテーター',
    profile: '<p>人材育成・組織開発の領域で20年以上の経験を持つ。AI研修「ククルビット」の開発者。</p>',
    order: 1,
  },
  {
    id: 'nakamura',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    publishedAt: '2025-01-01T00:00:00.000Z',
    revisedAt: '2025-01-01T00:00:00.000Z',
    name: '中村 （協力者）',
    role: 'コンテンツ・ポッドキャスト担当',
    profile: '<p>ポッドキャストの企画・制作・配信を担当。各種コンテンツの発信も行う。</p>',
    order: 2,
  },
];

export const mockNews: News[] = [
  {
    id: 'news-1',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
    publishedAt: '2025-06-01T00:00:00.000Z',
    revisedAt: '2025-06-01T00:00:00.000Z',
    title: 'ウェブサイトをリニューアルしました',
    category: 'お知らせ',
    body: '<p>ハニヤス合同会社の公式ウェブサイトをリニューアルしました。</p>',
  },
];

export const mockAbout: About = {
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  mission: '「人創り」が、すべての原点',
  body: '<p>ハニヤス合同会社は、企業の人材育成・経営支援を通じて、人と組織の豊かな未来をつくります。</p><p>教育・研修の設計から実施、経営課題の整理・解決まで、幅広い支援を行っています。</p>',
  originStory: '<p>「ハニヤス（Haniyasu）」という社名は、古来より日本で「大地・土」を象徴する言葉に由来します。土が種を育み、やがて豊かな実りをもたらすように、私たちは「人を育てること」を通じて、組織と社会の実りをつくります。</p>',
};
