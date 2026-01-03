import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = 'Tubhyam | Premium Women\'s Fashion',
  description = 'Discover Tubhyam\'s premium collection of women\'s pants - jeans, formal wear, and track pants crafted for the modern Indian woman. Sustainable, high-quality, elegant fashion.',
  keywords = 'women\'s pants, premium fashion, jeans, formal trousers, Indian fashion, sustainable clothing, luxury women\'s wear, designer pants, Tubhyam',
  image = 'https://tubhyam.com/og-image.jpg',
  url = 'https://tubhyam.com',
  type = 'website',
}: SEOProps) => {
  const fullTitle = title.includes('Tubhyam') ? title : `${title} | Tubhyam`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Tubhyam" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@tubhyamofficial" />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
