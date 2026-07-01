import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Loader2, Clock, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { api } from '@/config/api';
import ainosImg from '@/assets/ainos.jpeg';

type ProductImageMap = Record<string, string[]>;

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  image: string;
  readTime: number;
  keywords?: string[];
  focusKeyword?: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [productImages, setProductImages] = useState<ProductImageMap>({});

  useEffect(() => { fetchBlogs(); }, []);

  // Fetch product images once on mount
  useEffect(() => {
    api.get<{ success: boolean; mapping: ProductImageMap }>('/blogs/product-images')
      .then(res => { if (res.success && res.mapping) setProductImages(res.mapping); })
      .catch(() => { /* silent */ });
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get<{ success: boolean; blogs: BlogPost[] }>('/blogs');
      if (response.success) setBlogPosts(response.blogs);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally { setLoading(false); }
  };

  const categories = ['All', ...new Set(blogPosts.map(p => p.category).filter(Boolean))];
  const filteredPosts = blogPosts.filter(post => {
    const matchCat = selectedCategory === 'All' || post.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q) || post.category.toLowerCase().includes(q) || post.keywords?.some((k: string) => k.toLowerCase().includes(q)) || post.focusKeyword?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatShort = (d: string) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  // Smart blog-to-product image matching with comprehensive keyword mapping
  const getProductImage = useMemo(() => {
    // Maps blog content themes to product image category keys
    const THEME_MAP: Record<string, string[]> = {
      'formal': ['formal pants', 'formal'], 'trouser': ['formal pants', 'formal'],
      'office': ['formal pants', 'formal'], 'blazer': ['formal pants', 'formal'],
      'suit': ['formal pants', 'formal'], 'shirt': ['formal pants', 'formal'],
      'jeans': ['jeans'], 'denim': ['jeans'], 'skinny': ['jeans'],
      'cargo': ['cargo'], 'track': ['track'], 'jogger': ['track'],
      'athleisure': ['track'], 'sportswear': ['track'], 'gym': ['track'],
      'cordset': ['cordset'], 'co-ord': ['cordset'], 'matching set': ['cordset'],
      'lace': ['lace'], 'palazzo': ['lace'], 'wide-leg': ['lace'],
      'wedding': ['formal pants', 'formal'], 'party': ['lace', 'formal'],
      'ethnic': ['lace'], 'kurti': ['lace'], 'saree': ['lace'],
      'casual': ['track', 'jeans', 'cargo'], 'weekend': ['track', 'cargo'],
      'summer': ['track', 'cargo', 'jeans'], 'winter': ['formal', 'cordset'],
      'spring': ['track', 'jeans'], 'monsoon': ['track', 'cargo'],
      'accessor': ['lace', 'formal'], 'jewelry': ['lace', 'formal'],
      'bag': ['lace', 'cordset'], 'shoe': ['formal', 'lace'],
      'wardrobe': ['formal', 'jeans', 'cargo', 'lace', 'cordset'],
      'essential': ['formal', 'jeans', 'cargo', 'track'],
      'body type': ['formal', 'jeans', 'lace', 'cargo'],
      'color': ['formal', 'jeans', 'cordset', 'lace'],
      'trend': ['formal', 'jeans', 'cargo', 'cordset'],
      'style': ['formal', 'jeans', 'cargo', 'lace'],
      'fashion': ['formal', 'jeans', 'cargo', 'track', 'cordset'],
      'outfit': ['formal', 'jeans', 'cargo', 'lace'],
      'occasion': ['formal', 'lace', 'cordset'], 'dress code': ['formal', 'lace'],
      'fusion': ['lace', 'formal', 'jeans'], 'western': ['jeans', 'cargo', 'track'],
    };

    return (post: BlogPost, cardIndex: number = 0): string => {
      const isAI = (url: string) => url.includes('pollinations.ai') || url.includes('image.pollinations');
      const fallback = (!post.image || isAI(post.image)) ? '' : post.image;
      if (!productImages || Object.keys(productImages).length === 0) return fallback;

      // Build search terms from title, excerpt, keywords, focusKeyword, category
      const searchTerms = [
        post.title || '', post.excerpt || '',
        post.focusKeyword || '', ...(post.keywords || []), post.category,
      ].map(t => t.toLowerCase().trim()).filter(Boolean);

      // Collect matched category keys from theme map
      const matchedKeys = new Set<string>();
      const combined = searchTerms.join(' ');
      for (const [theme, keys] of Object.entries(THEME_MAP)) {
        if (combined.includes(theme)) {
          keys.forEach(k => matchedKeys.add(k));
        }
      }

      // Also try direct match against product image keys
      const availableKeys = Object.keys(productImages).filter(k => k !== 'all');
      for (const term of searchTerms) {
        for (const key of availableKeys) {
          if (term.includes(key) || key.includes(term)) matchedKeys.add(key);
        }
      }

      // If we matched specific categories, pick image from the best matching pool
      if (matchedKeys.size > 0) {
        const categoryKeys = Array.from(matchedKeys);
        // Round-robin across matched categories so different cards get different product types
        const catKey = categoryKeys[cardIndex % categoryKeys.length];
        const imgs = productImages[catKey];
        if (imgs && imgs.length > 0) {
          return imgs[cardIndex % imgs.length];
        }
      }

      // No match — pick from 'all' pool using spread distribution
      const allImgs = productImages['all'];
      if (allImgs && allImgs.length > 0) {
        // Use prime multiplier to spread across the pool (avoids clustering at start)
        const idx = (cardIndex * 7 + 3) % allImgs.length;
        return allImgs[idx];
      }
      return fallback;
    };
  }, [productImages]);

  const featured = filteredPosts[0];
  const secondary = filteredPosts.slice(1, 3);
  const rest = searchTerm ? filteredPosts : filteredPosts.slice(3);

  return (
    <>
      <Helmet>
        <title>Fashion Blog - Styling Guides, Trends & Tips | Tubhyam</title>
        <meta name="description" content="Expert fashion guides, styling tips, and trend reports for Indian women. Discover how to style formal pants, palazzo, wide-leg jeans, ethnic wear and more. Updated weekly by Tubhyam's style editors." />
        <meta property="og:title" content="Fashion Blog - Styling Guides & Trend Reports | Tubhyam" />
        <meta property="og:description" content="Expert fashion guides, styling tips, and trend reports for Indian women." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://tubhyam.in/blog" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Tubhyam Fashion Blog",
          "description": "Fashion guides, styling tips, and trend reports for Indian women",
          "url": "https://tubhyam.in/blog",
          "publisher": { "@type": "Organization", "name": "Tubhyam", "url": "https://tubhyam.in" }
        })}</script>
      </Helmet>

      <Navbar />
      <ScrollToTop />
      <main style={{ minHeight: '100vh', background: '#0F0B09' }}>

        {/* ═══ HERO BANNER ═══ */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0 60px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(255,211,172,0.08) 0%, transparent 60%)' }} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <img src={ainosImg} alt="AINOS" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 70%', border: '2px solid rgba(255,211,172,0.3)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#FFD3AC', letterSpacing: 2, textTransform: 'uppercase' }}>Powered by AINOS</span>
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, color: '#F0E6DA', lineHeight: 1.15, margin: '0 0 16px' }}>
                The Style <span style={{ color: '#FFD3AC' }}>Journal</span>
              </h1>
              <p style={{ fontSize: 17, color: '#B0A090', lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
                Expert styling guides, trend reports & fashion tips curated for the modern Indian woman
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SEARCH + CATEGORY BAR ═══ */}
        <section style={{ borderBottom: '1px solid rgba(255,211,172,0.1)', padding: '0 0 24px' }}>
          <div className="container mx-auto px-4">
            {/* Search */}
            <div style={{ maxWidth: 560, margin: '0 auto 20px', position: 'relative' }}>
              <input
                type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search guides: baggy jeans, formal pants, palazzo styling..."
                style={{
                  width: '100%', padding: '14px 48px 14px 20px', background: '#1A1410', border: '1px solid rgba(255,211,172,0.15)',
                  borderRadius: 50, fontSize: 14, color: '#F0E6DA', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,211,172,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,211,172,0.15)'}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A7D70', fontSize: 18 }}>×</button>
              )}
            </div>
            {/* Categories */}
            {categories.length > 1 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      background: selectedCategory === cat ? '#FFD3AC' : 'transparent',
                      color: selectedCategory === cat ? '#1A1410' : '#B0A090',
                      border: selectedCategory === cat ? '1px solid #FFD3AC' : '1px solid rgba(255,211,172,0.15)',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══ LOADING ═══ */}
        {loading && (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <Loader2 size={36} className="animate-spin" style={{ color: '#8A7D70', margin: '0 auto' }} />
            <p style={{ color: '#8A7D70', marginTop: 12, fontSize: 14 }}>Loading style guides...</p>
          </div>
        )}

        {/* ═══ NO RESULTS ═══ */}
        {!loading && filteredPosts.length === 0 && (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#F0E6DA', marginBottom: 8 }}>No articles found</h2>
            <p style={{ color: '#8A7D70', fontSize: 15 }}>Try a different search term or browse all categories above.</p>
          </div>
        )}

        {/* ═══ NO POSTS ═══ */}
        {!loading && blogPosts.length === 0 && (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>✨</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#F0E6DA', marginBottom: 8 }}>Coming Soon</h2>
            <p style={{ color: '#8A7D70', fontSize: 15 }}>Our style editors are crafting amazing guides. Check back soon!</p>
          </div>
        )}

        {/* ═══ FEATURED ARTICLE (LEVI'S STYLE) ═══ */}
        {!loading && featured && !searchTerm && (
          <section className="container mx-auto px-4" style={{ padding: '48px 16px 40px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#FFD3AC', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Featured Story</p>
            <Link to={`/blog/${featured.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 0, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,211,172,0.1)', background: '#1A1410', transition: 'border-color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,211,172,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,211,172,0.1)')}>
                {/* Image */}
                <div style={{ position: 'relative', height: '100%', minHeight: 320 }}>
                  <img src={getProductImage(featured, 0) || ''} alt={featured.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', background: '#1A1410', transition: 'opacity 0.4s' }} />
                  <div style={{ position: 'absolute', top: 16, left: 16, background: '#FFD3AC', color: '#1A1410', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 50, letterSpacing: 0.5 }}>
                    {featured.category}
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: 'clamp(24px, 4vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, color: '#F0E6DA', lineHeight: 1.2, margin: '0 0 16px' }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontSize: 15, color: '#B0A090', lineHeight: 1.7, margin: '0 0 20px' }}>
                    {featured.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#8A7D70', marginBottom: 24, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {formatShort(featured.publishedAt)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {featured.readTime} min read</span>
                    {featured.focusKeyword && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={13} /> {featured.focusKeyword}</span>}
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#FFD3AC', fontWeight: 600, fontSize: 14 }}>
                    Read Full Guide <ArrowRight size={16} />
                  </span>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* ═══ SECONDARY FEATURED (2-UP) ═══ */}
        {!loading && secondary.length > 0 && !searchTerm && (
          <section className="container mx-auto px-4" style={{ padding: '0 16px 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 20 }}>
              {secondary.map((post, i) => (
                <Link key={post._id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,211,172,0.1)', background: '#1A1410', transition: 'border-color 0.3s, transform 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,211,172,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,211,172,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ height: 200, overflow: 'hidden' }}>
                      <img src={getProductImage(post, i + 1) || ''} alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', background: '#1A1410', transition: 'transform 0.4s, opacity 0.4s' }} />
                    </div>
                    <div style={{ padding: 20 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#FFD3AC', textTransform: 'uppercase', letterSpacing: 1 }}>{post.category}</span>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#F0E6DA', lineHeight: 1.3, margin: '8px 0 10px' }}>{post.title}</h3>
                      <p style={{ fontSize: 13, color: '#8A7D70', lineHeight: 1.5, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#8A7D70' }}>
                        <span>{formatShort(post.publishedAt)}</span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ ARTICLE GRID (REST / SEARCH RESULTS) ═══ */}
        {!loading && rest.length > 0 && (
          <section className="container mx-auto px-4" style={{ padding: '0 16px 60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#F0E6DA', margin: 0 }}>
                {searchTerm ? `${filteredPosts.length} Results` : 'More Style Guides'}
              </h2>
              {!searchTerm && <div style={{ height: 1, flex: 1, background: 'rgba(255,211,172,0.08)', marginLeft: 20 }} />}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
              {(searchTerm ? filteredPosts : rest).map((post, i) => (
                <Link key={post._id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,211,172,0.08)', background: '#151010', transition: 'all 0.25s', height: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,211,172,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,211,172,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ height: 170, overflow: 'hidden' }}>
                      <img src={getProductImage(post, i + 3) || ''} alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', background: '#1A1410', transition: 'opacity 0.4s' }} />
                    </div>
                    <div style={{ padding: 16 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#FFD3AC', textTransform: 'uppercase', letterSpacing: 1 }}>{post.category}</span>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, color: '#F0E6DA', lineHeight: 1.35, margin: '6px 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: 12, color: '#8A7D70', lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.excerpt}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#8A7D70' }}>
                        <span>{formatShort(post.publishedAt)}</span>
                        <ArrowRight size={14} style={{ color: '#FFD3AC' }} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ SEO CONTENT SECTION ═══ */}
        {!loading && blogPosts.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(255,211,172,0.08)', padding: '48px 0' }}>
            <div className="container mx-auto px-4">
              <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#F0E6DA', marginBottom: 16 }}>
                  Your Complete Fashion Guide
                </h2>
                <p style={{ fontSize: 14, color: '#B0A090', lineHeight: 1.8, marginBottom: 12 }}>
                  Welcome to Tubhyam's Style Journal — your go-to destination for expert fashion advice, styling guides, and trend reports tailored for Indian women. From how to style <strong style={{ color: '#FFD3AC' }}>wide-leg jeans</strong> and <strong style={{ color: '#FFD3AC' }}>formal pants</strong> to mastering the perfect <strong style={{ color: '#FFD3AC' }}>palazzo pairing</strong> and <strong style={{ color: '#FFD3AC' }}>ethnic fusion looks</strong>, our editors break down every trend with practical tips you can use today.
                </p>
                <p style={{ fontSize: 14, color: '#B0A090', lineHeight: 1.8, marginBottom: 12 }}>
                  Each guide covers everything from choosing the right fit for your body type, styling for different occasions — office wear, festive celebrations, casual brunches — to common fashion mistakes and how to avoid them. Our SEO-optimized articles answer the questions Indian women are actually searching on Google.
                </p>
                <p style={{ fontSize: 14, color: '#B0A090', lineHeight: 1.8 }}>
                  Browse by category above or search for your specific style question. New articles are published weekly by our AI-powered editorial team, <strong style={{ color: '#FFD3AC' }}>AINOS</strong>.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ═══ CTA ═══ */}
        <section style={{ borderTop: '1px solid rgba(255,211,172,0.08)', padding: '56px 0' }}>
          <div className="container mx-auto px-4" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#F0E6DA', marginBottom: 8 }}>Ready to Elevate Your Style?</h2>
            <p style={{ color: '#8A7D70', fontSize: 15, marginBottom: 24 }}>Explore Tubhyam's curated collection of premium women's fashion</p>
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
    </>
  );
};

export default Blog;
