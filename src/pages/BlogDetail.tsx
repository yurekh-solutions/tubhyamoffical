import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader2, ArrowRight, Share2, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { api } from '@/config/api';
import ainosImg from '@/assets/ainos.jpeg';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  keywords: string[];
  image: string;
  author: string;
  readTime: number;
  publishedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  tags?: string[];
  inlineImages?: { url: string; altText: string; role: string }[];
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  readTime: number;
  category: string;
  publishedAt?: string;
}

type ProductImageMap = Record<string, string[]>;

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [productImages, setProductImages] = useState<ProductImageMap>({});

  useEffect(() => { window.scrollTo(0, 0); fetchBlog(); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch product images once on mount
  useEffect(() => {
    api.get<{ success: boolean; mapping: ProductImageMap }>('/blogs/product-images')
      .then(res => { if (res.success && res.mapping) setProductImages(res.mapping); })
      .catch(() => { /* silent */ });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; blog: BlogPost }>(`/blogs/${slug}`);
      if (response.success && response.blog) {
        setBlog(response.blog);
        // Fetch related posts
        try {
          const allBlogs = await api.get<{ success: boolean; blogs: RelatedPost[] }>('/blogs');
          if (allBlogs.success) {
            const relatedPosts = allBlogs.blogs
              .filter((b: RelatedPost) => b._id !== response.blog._id && b.category === response.blog.category)
              .slice(0, 3);
            setRelated(relatedPosts);
          }
        } catch { /* silent */ }
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      console.error('Failed to fetch blog:', err);
      setError('Failed to load blog post');
    } finally { setLoading(false); }
  };

  // Find best product images for a blog's keywords
  const getBestImages = useMemo(() => {
    return (b: BlogPost | null): string[] => {
      if (!b || !productImages || Object.keys(productImages).length === 0) return [];
      const searchTerms = [
        b.focusKeyword || '',
        ...(b.keywords || []),
        ...(b.tags || []),
        b.category,
      ].map(t => t.toLowerCase().trim()).filter(Boolean);
      for (const term of searchTerms) {
        for (const [key, imgs] of Object.entries(productImages)) {
          if (key === 'all') continue;
          if (term.includes(key) || key.includes(term)) return imgs;
        }
      }
      return productImages['all'] || [];
    };
  }, [productImages]);

  // Process blog content: replace AI images with real product photos
  const processedContent = useMemo(() => {
    if (!blog) return { content: '', heroImage: '' };
    const bestImages = getBestImages(blog);

    // Always strip AI-generated images from content (Pollinations.ai)
    let html = blog.content;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove all figure tags containing Pollinations URLs
    const figures = doc.querySelectorAll('figure');
    figures.forEach(fig => {
      const img = fig.querySelector('img');
      if (img) {
        const src = img.getAttribute('src') || '';
        if (src.includes('pollinations.ai') || src.includes('image.pollinations')) {
          fig.remove();
        }
      }
    });

    // Replace remaining Pollinations img tags with product photos or remove them
    const imgElements = doc.querySelectorAll('img');
    let productIdx = 1;
    imgElements.forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('pollinations.ai') || src.includes('image.pollinations')) {
        if (bestImages.length > 0) {
          const realImg = bestImages[productIdx % bestImages.length];
          if (realImg) {
            img.setAttribute('src', realImg);
            img.setAttribute('alt', `${blog.focusKeyword || blog.category} - Tubhyam Collection`);
          }
          productIdx++;
        } else {
          // No product images — remove the AI image entirely
          const parentFigure = img.closest('figure');
          if (parentFigure) { parentFigure.remove(); } else { img.remove(); }
        }
      }
    });
    html = doc.body.innerHTML;

    // Hero image: use product photo if available, otherwise hide AI hero
    const heroImage = bestImages.length > 0 ? bestImages[0] : '';

    return { content: html, heroImage };
  }, [blog, getBestImages]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatShort = (d: string) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleShare = async () => {
    const url = `https://tubhyam.in/blog/${blog?.slug}`;
    if (navigator.share) {
      try { await navigator.share({ title: blog?.title, text: blog?.excerpt, url }); } catch { /* silent */ }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  // Extract H2 headings for TOC
  const extractTOC = (html: string) => {
    const matches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi);
    if (!matches) return [];
    return matches.map((m, i) => ({
      id: `section-${i}`,
      text: m.replace(/<[^>]*>/g, ''),
    }));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#0F0B09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <img src={ainosImg} alt="AINOS" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 70%', margin: '0 auto 12px', border: '2px solid rgba(255,211,172,0.2)' }} />
            <Loader2 size={28} className="animate-spin" style={{ color: '#8A7D70' }} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#0F0B09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📄</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#F0E6DA', marginBottom: 12 }}>{error || 'Article Not Found'}</h2>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#FFD3AC', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to Style Journal
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const toc = extractTOC(processedContent.content);
  const canonicalUrl = `https://tubhyam.in/blog/${blog.slug}`;
  const pageTitle = blog.metaTitle || blog.title;
  const pageDesc = blog.metaDescription || blog.excerpt;
  const displayImage = processedContent.heroImage || blog.image;

  // Structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": pageDesc,
    "image": displayImage,
    "datePublished": blog.publishedAt,
    "author": { "@type": "Organization", "name": "Tubhyam" },
    "publisher": { "@type": "Organization", "name": "Tubhyam", "logo": { "@type": "ImageObject", "url": "https://tubhyam.in/logo.png" } },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
    "keywords": [...(blog.keywords || []), ...(blog.tags || [])].join(', '),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tubhyam.in" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tubhyam.in/blog" },
      { "@type": "ListItem", "position": 3, "name": blog.title, "item": canonicalUrl },
    ]
  };

  // Inject IDs into H2 tags for TOC scrolling
  const contentWithIds = processedContent.content.replace(/<h2([^>]*)>/gi, (_: string, attrs: string, offset: number) => {
    const idx = (processedContent.content.substring(0, offset).match(/<h2/gi) || []).length;
    return `<h2${attrs} id="section-${idx}">`;
  });

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Tubhyam</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={[...(blog.keywords || []), ...(blog.tags || []), blog.focusKeyword || ''].filter(Boolean).join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        {displayImage && <meta property="og:image" content={displayImage} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Tubhyam" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        {displayImage && <meta name="twitter:image" content={displayImage} />}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Navbar />
      <ScrollToTop />

      {/* ═══ READING PROGRESS BAR ═══ */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 999, background: 'transparent' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #FFD3AC, #F5C49C)', transition: 'width 0.1s' }} />
      </div>

      <main style={{ minHeight: '100vh', background: '#0F0B09' }}>

        {/* ═══ BREADCRUMB ═══ */}
        <div className="container mx-auto px-4" style={{ padding: '20px 16px 0' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8A7D70', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#8A7D70', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/blog" style={{ color: '#8A7D70', textDecoration: 'none' }}>Style Journal</Link>
            <span>/</span>
            <span style={{ color: '#B0A090', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{blog.title}</span>
          </nav>
        </div>

        {/* ═══ ARTICLE HEADER ═══ */}
        <article className="container mx-auto px-4" style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>

          {/* Category + Meta */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ display: 'inline-block', background: '#FFD3AC', color: '#1A1410', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 50, letterSpacing: 0.5, marginBottom: 16 }}>
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: '#F0E6DA', lineHeight: 1.2, margin: '0 0 16px' }}>
            {blog.title}
          </h1>

          {/* Excerpt / Subtitle */}
          <p style={{ fontSize: 17, color: '#B0A090', lineHeight: 1.7, margin: '0 0 24px', fontWeight: 400 }}>
            {blog.excerpt}
          </p>

          {/* Meta bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#8A7D70', marginBottom: 32, flexWrap: 'wrap', paddingBottom: 24, borderBottom: '1px solid rgba(255,211,172,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={ainosImg} alt="AINOS" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 70%', border: '1.5px solid rgba(255,211,172,0.2)' }} />
              <span style={{ fontWeight: 600, color: '#B0A090' }}>AINOS</span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {formatDate(blog.publishedAt)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {blog.readTime} min read</span>
            <button onClick={handleShare} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid rgba(255,211,172,0.15)', borderRadius: 50, padding: '6px 14px', color: '#8A7D70', cursor: 'pointer', fontSize: 12, transition: 'border-color 0.2s' }}>
              <Share2 size={13} /> Share
            </button>
          </div>

          {/* ═══ HERO IMAGE (FULL WIDTH) ═══ */}
          {displayImage && (
            <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 48, border: '1px solid rgba(255,211,172,0.06)', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
              <img src={displayImage} alt={blog.title} style={{ width: '100%', height: 'auto', maxHeight: 520, objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            </div>
          )}

          {/* ═══ TABLE OF CONTENTS ═══ */}
          {toc.length >= 3 && (
            <div style={{ background: '#1A1410', border: '1px solid rgba(255,211,172,0.1)', borderRadius: 10, padding: '20px 24px', marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <BookOpen size={15} style={{ color: '#FFD3AC' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#FFD3AC', letterSpacing: 1, textTransform: 'uppercase' }}>In This Guide</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {toc.map((item) => (
                  <li key={item.id} style={{ marginBottom: 8 }}>
                    <a href={`#${item.id}`} onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                      style={{ color: '#B0A090', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#FFD3AC')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#B0A090')}>
                      <ArrowRight size={12} style={{ color: '#FFD3AC', flexShrink: 0 }} />
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ═══ ARTICLE CONTENT ═══ */}
          <div
            className="tubhyam-article"
            style={{ fontSize: 16, lineHeight: 1.85, color: '#C4B5A6' }}
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {/* ═══ TAGS / KEYWORDS ═══ */}
          {((blog.tags && blog.tags.length > 0) || (blog.keywords && blog.keywords.length > 0)) && (
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,211,172,0.1)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8A7D70', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Related Topics</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[...(blog.tags || []), ...(blog.keywords || [])].filter((v, i, a) => a.indexOf(v) === i).map((tag, idx) => (
                  <span key={idx} style={{ fontSize: 12, color: '#B0A090', background: '#1A1410', border: '1px solid rgba(255,211,172,0.1)', borderRadius: 50, padding: '5px 14px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ═══ BACK TO BLOG ═══ */}
          <div style={{ marginTop: 32 }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#FFD3AC', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to Style Journal
            </Link>
          </div>
        </article>

        {/* ═══ RELATED ARTICLES ═══ */}
        {related.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(255,211,172,0.08)', padding: '48px 0' }}>
            <div className="container mx-auto px-4">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#F0E6DA', marginBottom: 24 }}>
                More in {blog.category}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
                {related.map(post => (
                  <Link key={post._id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <article style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,211,172,0.08)', background: '#151010', transition: 'all 0.25s', height: '100%' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,211,172,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,211,172,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <div style={{ height: 160, overflow: 'hidden' }}>
                        <img src={post.image || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'} alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                      </div>
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, color: '#F0E6DA', lineHeight: 1.35, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#8A7D70' }}>
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ CTA ═══ */}
        <section style={{ borderTop: '1px solid rgba(255,211,172,0.08)', padding: '56px 0' }}>
          <div className="container mx-auto px-4" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#F0E6DA', marginBottom: 8 }}>
              Love This Guide?
            </h2>
            <p style={{ color: '#8A7D70', fontSize: 15, marginBottom: 24 }}>
              Discover the perfect pieces to bring these styling tips to life
            </p>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 50,
              background: '#FFD3AC', color: '#1A1410', fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'all 0.2s'
            }}>
              Shop the Collection <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      {/* ═══ ARTICLE STYLES ═══ */}
      <style>{`
        .tubhyam-article h2 {
          font-family: Georgia, serif;
          font-size: clamp(22px, 3.5vw, 28px);
          font-weight: 700;
          color: #F0E6DA;
          margin: 48px 0 16px;
          line-height: 1.3;
          scroll-margin-top: 80px;
        }
        .tubhyam-article h3 {
          font-family: Georgia, serif;
          font-size: clamp(18px, 2.5vw, 22px);
          font-weight: 700;
          color: #E0D4C8;
          margin: 32px 0 12px;
          line-height: 1.35;
        }
        .tubhyam-article p {
          margin: 0 0 20px;
          color: #C4B5A6;
          line-height: 1.85;
        }
        .tubhyam-article a {
          color: #FFD3AC;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: opacity 0.2s;
        }
        .tubhyam-article a:hover {
          opacity: 0.8;
        }
        .tubhyam-article ul, .tubhyam-article ol {
          padding-left: 24px;
          margin: 0 0 24px;
        }
        .tubhyam-article li {
          margin-bottom: 10px;
          color: #C4B5A6;
          line-height: 1.7;
        }
        .tubhyam-article strong {
          color: #F0E6DA;
          font-weight: 700;
        }
        .tubhyam-article em {
          color: #D4C8BA;
          font-style: italic;
        }
        .tubhyam-article figure {
          margin: 40px 0;
          text-align: center;
          position: relative;
        }
        .tubhyam-article figure img {
          width: 100%;
          height: auto;
          border-radius: 12px;
          border: 1px solid rgba(255,211,172,0.05);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          object-fit: cover;
          object-position: center;
          display: block;
          transition: opacity 0.3s ease;
        }
        .tubhyam-article figcaption {
          text-align: center;
          font-size: 13px;
          color: #8A7D70;
          margin-top: 12px;
          font-style: italic;
          letter-spacing: 0.3px;
        }
        .tubhyam-article blockquote {
          border-left: 3px solid #FFD3AC;
          padding: 12px 20px;
          margin: 24px 0;
          background: rgba(255,211,172,0.04);
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #B0A090;
        }
      `}</style>
    </>
  );
};

export default BlogDetail;
