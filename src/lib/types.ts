import type { MicroCMSImage, MicroCMSListContent, MicroCMSObjectContent } from 'microcms-js-sdk';

export interface PlatformLink {
  fieldId: string;
  platform: 'spotify' | 'apple' | 'amazon' | 'youtube' | 'other';
  url: string;
}

export interface PodcastEpisode extends MicroCMSListContent {
  episodeTitle: string;
  description: string;
  embedUrl?: string;
  platformLinks?: PlatformLink[];
  relatedBlogUrl?: string;
}

export interface Service extends MicroCMSListContent {
  serviceName: string;
  lead: string;
  body: string;
  image?: MicroCMSImage;
  order?: number;
}

export interface Member extends MicroCMSListContent {
  name: string;
  role: string;
  photo?: MicroCMSImage;
  profile?: string;
  order?: number;
}

export interface About extends MicroCMSObjectContent {
  mission: string;
  body: string;
  originStory?: string;
  image?: MicroCMSImage;
}

export interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
}
