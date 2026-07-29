import { Helmet } from 'react-helmet-async';
import ogImage from '../assets/images/image.png';

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  keywords?: string;
  noIndex?: boolean;
};

const DEFAULT_TITLE = 'SocialMock';
const DEFAULT_DESCRIPTION = 'No sign up required. Create high-quality mockup images and videos for WhatsApp, Instagram, and other apps to prank your friends.';
const DEFAULT_CANONICAL = 'https://socialmock.app';

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical = '/',
  image = ogImage,
  keywords = 'social media mockups, prank messages, fake chat, social mockups',
  noIndex = false,
}: SEOProps) {
  const resolvedTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const resolvedCanonical = canonical.startsWith('http')
    ? canonical
    : `${DEFAULT_CANONICAL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={resolvedCanonical} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
