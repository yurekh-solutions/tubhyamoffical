import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  price?: number;
  originalPrice?: number;
  availability?: string;
  brand?: string;
  productName?: string;
}

const SEO = ({
  title = 'Tubhyam | Premium Women\'s Fashion - Formal Pants, Track Pants & Jeans',
  description = 'Discover Tubhyam\'s premium collection of women\'s pants - jeans, formal wear, and track pants crafted for the modern Indian woman. Sustainable, high-quality, elegant fashion.',
  keywords = 'women\'s pants, premium fashion, jeans, formal trousers, Indian fashion, sustainable clothing, luxury women\'s wear, designer pants, Tubhyam, buy formal pants online, women\'s track pants, casual wear India',
  image = 'https://tubhyam.com/og-image.jpg',
  url = 'https://tubhyam.com',
  type = 'website',
  price,
  originalPrice,
  availability = 'in stock',
  brand = 'Tubhyam',
  productName,
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

      {/* Product Schema.org Structured Data for SEO */}
      {productName && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productName,
            "image": image,
            "description": description,
            "brand": {
              "@type": "Brand",
              "name": brand
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": price,
              "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "availability": `https://schema.org/${availability === 'in stock' ? 'InStock' : 'OutOfStock'}`,
              "url": url
            }
          })}
        </script>
      )}

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Tubhyam",
          "url": "https://tubhyam.com",
          "logo": "https://tubhyam.com/logo.png",
          "description": "Premium women's fashion brand specializing in formal pants, track pants, and jeans for the modern Indian woman.",
          "sameAs": [
            "https://www.instagram.com/tubhyamofficial",
            "https://www.facebook.com/tubhyam",
            "https://twitter.com/tubhyamofficial"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7039382706",
            "contactType": "customer service",
            "availableLanguage": ["English", "Hindi"]
          }
        })}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://tubhyam.com"
          }, {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://tubhyam.com/products"
          }]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
