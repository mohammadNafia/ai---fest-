import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event';
  lang?: 'en' | 'ar';
  eventDate?: string;
  eventLocation?: string;
}

/**
 * SEO Component - Handles meta tags, OpenGraph, Twitter Cards, and JSON-LD
 */
export const SEO: React.FC<SEOProps> = ({
  title = 'Baghdad AI Summit 2026',
  description = 'The largest gathering of AI professionals, researchers, and enthusiasts in Iraq. Join us for cutting-edge talks, workshops, and networking opportunities.',
  image = '/Summit-Logo.png',
  url = 'https://baghdad-ai-summit.com',
  type = 'event',
  lang = 'en',
  eventDate = '2026-03-15',
  eventLocation = 'Baghdad, Iraq',
}) => {
  const fullTitle = title.includes('Baghdad AI Summit') ? title : `${title} | Baghdad AI Summit 2026`;
  const fullUrl = url.startsWith('http') ? url : `https://baghdad-ai-summit.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://baghdad-ai-summit.com${image}`;

  // JSON-LD Schema for Event
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Baghdad AI Summit 2026',
    description: description,
    startDate: eventDate,
    endDate: eventDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: eventLocation,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Baghdad',
        addressCountry: 'IQ',
      },
    },
    image: fullImage,
    organizer: {
      '@type': 'Organization',
      name: 'Baghdad AI Summit',
      url: 'https://baghdad-ai-summit.com',
    },
    offers: {
      '@type': 'Offer',
      url: `${fullUrl}/register`,
      price: '0',
      priceCurrency: 'IQD',
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="AI, Artificial Intelligence, Baghdad, Iraq, Summit, Conference, Technology, Machine Learning" />
      <meta name="author" content="Baghdad AI Summit" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="language" content={lang} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:locale" content={lang === 'ar' ? 'ar_IQ' : 'en_US'} />
      <meta property="og:site_name" content="Baghdad AI Summit 2026" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@BaghdadAISummit" />
      <meta name="twitter:creator" content="@BaghdadAISummit" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Baghdad AI Summit" />

      {/* Alternate Languages */}
      <link rel="alternate" hreflang="en" href={`${fullUrl}?lang=en`} />
      <link rel="alternate" hreflang="ar" href={`${fullUrl}?lang=ar`} />
      <link rel="alternate" hreflang="x-default" href={fullUrl} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

