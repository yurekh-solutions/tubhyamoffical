import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
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

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s*-\s*(pose|front|back|side|detail|view|closeup|close-up|model|flatlay|flat-lay)\s*$/i, '')
    .replace(/\s*\(\d+\)\s*$/i, '')
    .replace(/\s+v\d+\s*$/i, '')
    .trim();
}

function deduplicatePosts(posts: BlogPost[]): BlogPost[] {
  const seen = new Set<string>();
  return posts.filter(post => {
    const key = normalizeTitle(post.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [productImages, setProductImages] = useState<ProductImageMap>({});
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const POLL_INTERVAL = 3000;
  const MAX_POLLS = 40; // 40 × 3s = 120s = 2 minutes
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchBlogs = useCallback(async (isRetry = false) => {
    if (isRetry) setRetrying(true);
    try {
      const response = await api.get<{ success: boolean; blogs: BlogPost[] }>('/blogs');
      if (response.success && response.blogs) {
        const unique = deduplicatePosts(response.blogs);
        setBlogPosts(unique);
        setApiError(false);
        setPollCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setApiError(true);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  // Auto-poll when API fails (Render free tier sleep)
  useEffect(() => {
    if (!apiError || blogPosts.length > 0) return;

    pollTimerRef.current = setTimeout(() => {
      if (pollCount >= MAX_POLLS) return;
      setPollCount(prev => prev + 1);
      fetchBlogs(true);
    }, POLL_INTERVAL);

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [apiError, pollCount, blogPosts.length, fetchBlogs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  useEffect(() => {
    const CACHE_KEY = 'tubhyam_product_images';
    const CACHE_TTL = 5 * 60 * 1000;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && data && Object.keys(data).length > 0) {
          setProductImages(data);
          return;
        }
      }
    } catch { /* ignore */ }
    api.get<{ success: boolean; mapping: ProductImageMap }>('/blogs/product-images')
      .then(res => {
        if (res.success && res.mapping) {
          setProductImages(res.mapping);
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: res.mapping, ts: Date.now() })); } catch { /* ignore */ }
        }
      })
      .catch(() => { /* silent */ });
  }, []);

  const categories = useMemo(() => ['All', ...new Set(blogPosts.map(p => p.category).filter(Boolean))], [blogPosts]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchCat = selectedCategory === 'All' || post.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q) || post.category.toLowerCase().includes(q) || post.keywords?.some((k: string) => k.toLowerCase().includes(q)) || post.focusKeyword?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [blogPosts, selectedCategory, searchTerm]);

  const formatShort = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return ''; }
  };

  const getProductImage = useMemo(() => {
    const THEME_MAP: Record<string, string[]> = {
      'formal': ['formal pants', 'formal'], 'trouser': ['formal pants', 'formal'],
      'office': ['formal pants', 'formal'], 'blazer': ['formal pants', 'formal'],
      'suit': ['formal pants', 'formal'], 'shirt': ['formal pants', 'formal'],
      'jeans': ['jeans'], 'denim': ['jeans'], 'skinny': ['jeans'], 'baggy': ['jeans'],
      'cargo': ['cargo'], 'track': ['track'], 'jogger': ['track'],
      'athleisure': ['track'], 'sportswear': ['track'], 'gym': ['track'],
      'cordset': ['cordset'], 'co-ord': ['cordset'], 'matching set': ['cordset'],
      'lace': ['lace'], 'palazzo': ['lace'], 'wide-leg': ['lace'], 'wide leg': ['lace'],
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
      'korean': ['formal pants', 'formal'], 'plated': ['formal pants', 'formal'],
    };

    return (post: BlogPost, cardIndex: number = 0): string => {
      const isAI = (url: string) => url.includes('pollinations.ai') || url.includes('image.pollinations');
      const fallback = (!post.image || isAI(post.image)) ? '' : post.image;
      if (!productImages || Object.keys(productImages).length === 0) return fallback;

      const searchTerms = [post.title || '', post.excerpt || '', post.focusKeyword || '', ...(post.keywords || []), post.category]
        .map(t => t.toLowerCase().trim()).filter(Boolean);

      const matchedKeys = new Set<string>();
      const combined = searchTerms.join(' ');
      for (const [theme, keys] of Object.entries(THEME_MAP)) {
        if (combined.includes(theme)) keys.forEach(k => matchedKeys.add(k));
      }

      const availableKeys = Object.keys(productImages).filter(k => k !== 'all');
      for (const term of searchTerms) {
        for (const key of availableKeys) {
          if (term.includes(key) || key.includes(term)) matchedKeys.add(key);
        }
      }

      if (matchedKeys.size > 0) {
        const categoryKeys = Array.from(matchedKeys);
        const catKey = categoryKeys[cardIndex % categoryKeys.length];
        const imgs = productImages[catKey];
        if (imgs && imgs.length > 0) return imgs[cardIndex % imgs.length];
      }

      const allImgs = productImages['all'];
      if (allImgs && allImgs.length > 0) {
        const idx = (cardIndex * 7 + 3) % allImgs.length;
        return allImgs[idx];
      }
      return fallback;
    };
  }, [productImages]);

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => { const next = new Set(prev); next.add(src); return next; });
  };

  return (
    <>
      <Helmet>
        <title>Fashion Blog - Styling Guides, Trends & Tips | Tubhyam</title>
        <meta name="description" content="Expert fashion guides, styling tips, and trend reports for Indian women." />
        <meta property="og:title" content="Fashion Blog - Styling Guides & Trend Reports | Tubhyam" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://tubhyam.in/blog" />
      </Helmet>

      <Navbar />
      <ScrollToTop />
      <main style={{ minHeight: '100vh', background: '#0F0B09' }}>

        {/* HERO */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0 36px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(255,211,172,0.06) 0%, transparent 60%)' }} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <img src={ainosImg} alt="AINOS" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 70%', border: '2px solid rgba(255,211,172,0.3)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#FFD3AC', letterSpacing: 2, textTransform: 'uppercase' }}>Powered by AINOS</span>
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 700, color: '#F0E6DA', lineHeight: 1.15, margin: '0 0 10px' }}>
                The Style <span style={{ color: '#FFD3AC' }}>Journal</span>
              </h1>
              <p style={{ fontSize: 15, color: '#B0A090', lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>
                Styling guides, trend reports & fashion tips for the modern Indian woman
              </p>
            </div>
          </div>
        </section>

        {/* SEARCH + CATEGORIES */}
        <section style={{ borderBottom: '1px solid rgba(255,211,172,0.08)', padding: '0 0 18px' }}>
          <div className="container mx-auto px-4">
            <div style={{ maxWidth: 460, margin: '0 auto 14px', position: 'relative' }}>
              <input
                type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search: baggy jeans, formal pants, palazzo..."
                style={{
                  width: '100%', padding: '11px 42px 11px 16px', background: '#1A1410', border: '1px solid rgba(255,211,172,0.12)',
                  borderRadius: 50, fontSize: 13, color: '#F0E6DA', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,211,172,0.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,211,172,0.12)'}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A7D70', fontSize: 18 }}>x</button>
              )}
            </div>
            {categories.length > 1 && (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '5px 14px', borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      background: selectedCategory === cat ? '#FFD3AC' : 'transparent',
                      color: selectedCategory === cat ? '#1A1410' : '#B0A090',
                      border: selectedCategory === cat ? '1px solid #FFD3AC' : '1px solid rgba(255,211,172,0.12)',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* LOADING SKELETON */}
        {loading && (
          <section className="container mx-auto px-4" style={{ padding: '28px 16px 50px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', gap: 18 }}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', background: '#1A1410', border: '1px solid rgba(255,211,172,0.06)' }}>
                  <div className="shimmer-bg" style={{ height: 200 }} />
                  <div style={{ padding: 14 }}>
                    <div style={{ height: 13, width: '55%', background: '#241e18', borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 9, width: '85%', background: '#1e1a16', borderRadius: 4, marginBottom: 5 }} />
                    <div style={{ height: 9, width: '70%', background: '#1e1a16', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AUTO-POLLING: Server waking up */}
        {!loading && apiError && blogPosts.length === 0 && pollCount < MAX_POLLS && (
          <div style={{ padding: '50px 24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,211,172,0.1)', marginBottom: 16 }}>
              <Loader2 size={22} className="animate-spin" style={{ color: '#FFD3AC' }} />
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#F0E6DA', marginBottom: 6 }}>Server is waking up</h2>
            <p style={{ color: '#8A7D70', fontSize: 13, marginBottom: 4, maxWidth: 380, margin: '0 auto' }}>Our backend is starting from sleep. Automatically retrying...</p>
            <p style={{ color: '#5A5048', fontSize: 11, marginBottom: 18 }}>Attempt {pollCount + 1} of {MAX_POLLS} · ~{Math.max(0, (MAX_POLLS - pollCount) * 3)}s remaining</p>
            <div style={{ width: 200, height: 4, background: '#1A1410', borderRadius: 2, margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ width: `${((pollCount + 1) / MAX_POLLS) * 100}%`, height: '100%', background: '#FFD3AC', borderRadius: 2, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}

        {/* GAVE UP after 2 minutes */}
        {!loading && apiError && blogPosts.length === 0 && pollCount >= MAX_POLLS && (
          <div style={{ padding: '50px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}></p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#F0E6DA', marginBottom: 6 }}>Still can't reach server</h2>
            <p style={{ color: '#8A7D70', fontSize: 13, marginBottom: 18, maxWidth: 380, margin: '0 auto 18px' }}>We tried for 2 minutes but the server hasn't responded. You can retry manually.</p>
            <button onClick={() => { setPollCount(0); fetchBlogs(true); }} disabled={retrying}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 50,
                background: '#FFD3AC', color: '#1A1410', fontWeight: 700, fontSize: 13, border: 'none', cursor: retrying ? 'wait' : 'pointer',
              }}>
              {retrying ? <><Loader2 size={13} className="animate-spin" /> Retrying...</> : <><RefreshCw size={13} /> Retry</>}
            </button>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !apiError && filteredPosts.length === 0 && blogPosts.length > 0 && (
          <div style={{ padding: '50px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}>🔍</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#F0E6DA', marginBottom: 6 }}>No articles found</h2>
            <p style={{ color: '#8A7D70', fontSize: 13 }}>Try a different search or browse categories above.</p>
          </div>
        )}

        {/* NO POSTS AT ALL */}
        {!loading && !apiError && blogPosts.length === 0 && (
          <div style={{ padding: '50px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}>✨</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#F0E6DA', marginBottom: 6 }}>Coming Soon</h2>
            <p style={{ color: '#8A7D70', fontSize: 13 }}>Our style editors are crafting amazing guides. Check back soon!</p>
          </div>
        )}

        {/* CARD GRID */}
        {!loading && filteredPosts.length > 0 && (
          <section className="container mx-auto px-4" style={{ padding: '28px 16px 50px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', gap: 18 }}>
              {filteredPosts.map((post, i) => {
                const imgSrc = getProductImage(post, i);
                const isLoaded = loadedImages.has(imgSrc);
                return (
                  <Link key={post._id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <article style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,211,172,0.06)', background: '#1A1410', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,211,172,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,211,172,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#151010' }}>
                        {!isLoaded && <div className="shimmer-bg" style={{ position: 'absolute', inset: 0 }} />}
                        <img
                          src={imgSrc || ''}
                          alt={post.title}
                          loading="lazy"
                          onLoad={() => handleImageLoad(imgSrc)}
                          style={{
                            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block',
                            transition: 'transform 0.5s ease, opacity 0.3s ease',
                            opacity: isLoaded || !imgSrc ? 1 : 0,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        {post.category && (
                          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(26,20,16,0.8)', backdropFilter: 'blur(6px)', color: '#FFD3AC', fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 50, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                            {post.category}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, color: '#F0E6DA', lineHeight: 1.35, margin: '0 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.title}
                        </h3>
                        <p style={{ fontSize: 12, color: '#8A7D70', lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                          {post.excerpt}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,211,172,0.05)', paddingTop: 10 }}>
                          <span style={{ fontSize: 10, color: '#8A7D70', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Calendar size={10} /> {formatShort(post.publishedAt)}
                          </span>
                          <span style={{ fontSize: 11, color: '#FFD3AC', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                            Read <ArrowRight size={11} />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* SEO CONTENT */}
        {!loading && blogPosts.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(255,211,172,0.06)', padding: '36px 0' }}>
            <div className="container mx-auto px-4">
              <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 700, color: '#F0E6DA', marginBottom: 12 }}>Your Complete Fashion Guide</h2>
                <p style={{ fontSize: 13, color: '#B0A090', lineHeight: 1.7, marginBottom: 8 }}>
                  Welcome to Tubhyam's Style Journal — expert fashion advice, styling guides, and trend reports for Indian women. From <strong style={{ color: '#FFD3AC' }}>wide-leg jeans</strong> and <strong style={{ color: '#FFD3AC' }}>formal pants</strong> to <strong style={{ color: '#FFD3AC' }}>palazzo styling</strong> and <strong style={{ color: '#FFD3AC' }}>ethnic fusion looks</strong>.
                </p>
                <p style={{ fontSize: 13, color: '#B0A090', lineHeight: 1.7 }}>
                  New articles published weekly by <strong style={{ color: '#FFD3AC' }}>AINOS</strong>.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ borderTop: '1px solid rgba(255,211,172,0.06)', padding: '42px 0' }}>
          <div className="container mx-auto px-4" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#F0E6DA', marginBottom: 6 }}>Ready to Elevate Your Style?</h2>
            <p style={{ color: '#8A7D70', fontSize: 13, marginBottom: 18 }}>Explore Tubhyam's curated collection of premium women's fashion</p>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 26px', borderRadius: 50,
              background: '#FFD3AC', color: '#1A1410', fontWeight: 700, fontSize: 13, textDecoration: 'none',
            }}>
              Shop the Collection <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .shimmer-bg {
          background: linear-gradient(90deg, #1A1410 25%, #241e18 50%, #1A1410 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};

export default Blog;
