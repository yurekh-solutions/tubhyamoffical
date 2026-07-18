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
  category?: string;
  breadcrumbItems?: { name: string; url: string }[];
}

const BASE_KEYWORDS = "tubhyam, tubhyam.in, women's pants, women's jeans, formal trousers, formal pants for women, wide leg pants, baggy pleated pants, belt formal pants, imported formal pants, cargo pants, track pants, cord set co-ord, lace pants, korean baggy pants, slim fit formal pants, pleated waist pants, mom fit trousers, premium women's clothing, Indian fashion, sustainable fashion, comfortable pants, online shopping India, women's fashion store, office wear women, business attire women, buy formal pants online, women's track pants, casual wear India, wide-leg belt formal pants, lace waist pants, lace wide-leg statement pants, corduroy co-ord set, button detail formal pants, side snap-button pants, premium wide look pants, denim jeans women, classic denim jeans, casual comfort pants, khaki track pants, women's clothing online India, fashion for women India, affordable premium fashion, designer pants women, professional wear women, executive formal wear, office formal pants women, high waisted pants women, wide leg trousers women, straight leg pants women, balloon pants women, pleated pants women, belted pants women, co-ord set women, corduroy pants women, lace detail pants women, slim fit pants women, relaxed fit pants women, streetwear women India, athleisure women India, smart casual women, sustainable fashion India, ethical fashion brand India, best women's pants brand India";

const SEO = ({
  title = 'Tubhyam | Premium Women\'s Fashion - Formal Pants, Track Pants & Jeans | Shop Online India',
  description = 'Discover Tubhyam\'s premium collection of women\'s pants — formal trousers, wide-leg pants, baggy pleated pants, belt formal pants, cargo pants, track pants, cord sets, lace pants, Korean baggy pants, and classic denim jeans. Crafted for the modern Indian woman. Sustainable, high-quality, elegant fashion. Free shipping on orders ₹2000+.',
  keywords = BASE_KEYWORDS,
  image = 'https://www.tubhyam.in/images/og-image.jpg',
  url = 'https://www.tubhyam.in',
  type = 'website',
  price,
  originalPrice,
  availability = 'in stock',
  brand = 'Tubhyam',
  productName,
  category,
  breadcrumbItems,
}: SEOProps) => {
  const fullTitle = title.includes('Tubhyam') ? title : `${title} | Tubhyam`;
  const fullKeywords = keywords === BASE_KEYWORDS ? keywords : `${keywords}, ${BASE_KEYWORDS}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={productName || 'Tubhyam - Premium Women\'s Fashion'} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Tubhyam" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={productName || 'Tubhyam - Premium Women\'s Fashion'} />
      <meta name="twitter:site" content="@tubhyamofficial" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="geo.region" content="IN" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

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
            ...(category && {
              "category": category
            }),
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": price,
              "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "availability": `https://schema.org/${availability === 'in stock' ? 'InStock' : 'OutOfStock'}`,
              "url": url,
              "seller": {
                "@type": "Organization",
                "name": "Tubhyam"
              },
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "INR"
                },
                "shippingDestination": [
                  {
                    "@type": "DefinedRegion",
                    "addressCountry": "IN"
                  }
                ]
              },
              ...(originalPrice && originalPrice > (price || 0) && {
                "hasMerchantReturnPolicy": {
                  "@type": "MerchantReturnPolicy",
                  "applicableCountry": "IN",
                  "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                  "merchantReturnDays": 15,
                  "returnMethod": "https://schema.org/ReturnByMail",
                  "returnFees": "https://schema.org/FreeReturn"
                }
              })
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": "24"
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
          "url": "https://www.tubhyam.in",
          "logo": "https://www.tubhyam.in/src/assets/logo.png",
          "image": "https://www.tubhyam.in/images/og-image.jpg",
          "description": "Tubhyam is India's premium online destination for women's pants, jeans, formal trousers, wide-leg pants, baggy pleated pants, cargo pants, track pants, cord sets, lace pants, Korean baggy pants, and classic denim jeans.",
          "foundingDate": "2024",
          "slogan": "Premium Women's Fashion",
          "sameAs": [
            "https://www.instagram.com/tubhyamofficial",
            "https://www.whatsapp.com"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7039382706",
            "contactType": "customer service",
            "email": "tubhyamofficial@gmail.com",
            "availableLanguage": ["English", "Hindi"],
            "areaServed": "IN"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "304, BN02 Shalibhadranagar, Block A, BP Road",
            "addressLocality": "Thane",
            "addressRegion": "Maharashtra",
            "addressCountry": "IN"
          }
        })}
      </script>

      {/* WebSite Schema for Google Sitelinks Search Box */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Tubhyam",
          "url": "https://www.tubhyam.in",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.tubhyam.in/shop?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.tubhyam.in"
            },
            ...(breadcrumbItems || [{ name: "Shop", item: "https://www.tubhyam.in/shop" }]).map((item, index) => ({
              "@type": "ListItem",
              "position": index + 2,
              "name": item.name,
              "item": item.url
            }))
          ]
        })}
      </script>

      {/* FAQ Schema for FAQ Page */}
      {url.includes('/faq') && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What types of pants does Tubhyam sell?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Tubhyam offers a wide range of premium women's pants including formal trousers, wide-leg pants, baggy pleated pants, belt formal pants, imported formal pants, cargo pants, track pants, cord set co-ords, lace pants, Korean baggy pants, slim fit formal pants, mom fit trousers, and classic denim jeans."
                }
              },
              {
                "@type": "Question",
                "name": "Does Tubhyam offer free shipping?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Tubhyam offers free shipping on all orders above ₹2000 within India."
                }
              },
              {
                "@type": "Question",
                "name": "What is Tubhyam's return policy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Tubhyam offers a 15-day easy return policy. Products must be unused, with original tags intact. Report any damaged or wrong products within 48 hours of delivery with an unboxing video."
                }
              },
              {
                "@type": "Question",
                "name": "What sizes are available at Tubhyam?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Tubhyam offers sizes ranging from XS to XXL across different products. Please refer to our size guide for detailed measurements."
                }
              },
              {
                "@type": "Question",
                "name": "Does Tubhyam offer video call shopping?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Tubhyam offers video call shopping where you can see products live before purchasing. Book a session through our video call page."
                }
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
