const SITE_NAME = 'ハニヤス合同会社';
const SITE_URL = 'https://haniyasu.com';
const DEFAULT_DESCRIPTION =
  '企業の人材育成・経営支援を通じて、人と組織の豊かな未来をつくる。AI研修「ククルビット」はじめ、サービス・商品企画支援などを提供しています。';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.png`;

export function buildSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  canonical,
  type = 'website',
}: {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
}) {
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    image,
    canonical,
    type,
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
  };
}
