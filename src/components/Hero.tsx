import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Instagram } from 'lucide-react';
import heroVideo from '@/assets/video.mp4';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/config/api';

/* ─── Static fallback images ─── */
import img1 from '@/assets/formals/beggyplatedkoreanfront.png';
import img2 from '@/assets/formals/blackstraight.png';
import img3 from '@/assets/formals/brownbelt.png';
import img4 from '@/assets/products/frontdenim.png';
import img5 from '@/assets/Tracks/cargo.png';
import img6 from '@/assets/formals/blackmom.png';

const FALLBACK_REELS = [
  { id: '1', src: img1, videoUrl: '', label: 'Formal', isVideo: false },
  { id: '2', src: img2, videoUrl: '', label: 'Classic', isVideo: false },
  { id: '3', src: img4, videoUrl: '', label: 'Denim', isVideo: false },
  { id: '4', src: img3, videoUrl: '', label: 'Elegant', isVideo: false },
  { id: '5', src: img5, videoUrl: '', label: 'Cargo', isVideo: false },
  { id: '6', src: img6, videoUrl: '', label: 'Mom Fit', isVideo: false },
];

interface ReelItem {
  id: string;
  src: string;         // thumbnail / static image
  videoUrl: string;    // real video URL (empty for static)
  label: string;
  isVideo: boolean;
  permalink?: string;
}

const Hero = () => {
  const { isLight } = useTheme();
  const [activeReel, setActiveReel] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reels, setReels] = useState<ReelItem[]>(FALLBACK_REELS);
  const [loaded, setLoaded] = useState(false);
  const fetchedRef = useRef(false);

  // Fetch live Instagram reels from backend
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchReels = async () => {
      try {
        const data = await api.get<{
          success: boolean;
          posts: Array<{
            postId: string;
            caption: string;
            mediaUrl: string;
            permalink: string;
            mediaType: string;
            thumbnailUrl: string;
            timestamp: string;
          }>;
        }>('/instagram/posts?limit=12');

        if (data.success && data.posts.length > 0) {
          // Prioritize VIDEO/REEL types
          const videoPosts = data.posts.filter(
            p => p.mediaType === 'VIDEO' || p.mediaType === 'REEL'
          );
          const allPosts = videoPosts.length >= 3 ? videoPosts : data.posts;

          const liveReels: ReelItem[] = allPosts.slice(0, 6).map((post, i) => ({
            id: post.postId,
            src: post.thumbnailUrl || post.mediaUrl,
            videoUrl: (post.mediaType === 'VIDEO' || post.mediaType === 'REEL') ? post.mediaUrl : '',
            label: post.caption?.split('\n')[0]?.slice(0, 20) || `Reel ${i + 1}`,
            isVideo: post.mediaType === 'VIDEO' || post.mediaType === 'REEL',
            permalink: post.permalink,
          }));

          if (liveReels.length > 0) {
            setReels(liveReels);
          }
        }
      } catch (err) {
        console.log('Instagram reels fetch skipped, using fallback images');
      } finally {
        setLoaded(true);
      }
    };

    fetchReels();
  }, []);

  // Auto-rotate reels every 3s
  useEffect(() => {
    if (!isLight || paused) return;
    const timer = setInterval(() => {
      setActiveReel(prev => (prev + 1) % reels.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isLight, paused, reels.length]);

  /* ─── LIGHT THEME: Split layout with Instagram Reels ─── */
  if (isLight) {
    return (
      <section className="relative min-h-[85vh] flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Text Panel */}
        <div className="relative w-full lg:w-1/2 bg-[#FAF5EF] flex items-center z-10 py-12 lg:py-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8652B]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4A853]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative w-full px-6 sm:px-12 lg:px-16 xl:px-24">
            <div className="max-w-lg mx-auto mt-10 lg:mx-0 space-y-6 lg:space-y-8">
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8b5e3c] to-[#A0714A] animate-fade-in-up shadow-md shadow-[#8b5e3c]/20">
                  <Sparkles size={12} className="text-[#ffd3ac]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ffd3ac]">
                    New Collection 2026
                  </span>
                </div>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-medium leading-[1.15] text-[#2A1A0E] animate-fade-in-up text-center lg:text-left tracking-tight" style={{ animationDelay: '0.1s' }}>
                <span className="font-semibold bg-gradient-to-r from-[#8b5e3c] to-[#C4813A] bg-clip-text text-transparent">Premium</span>
                <br />
                <span className="font-light tracking-normal">Women&apos;s Pants</span>
              </h1>

              <p className="text-[13px] sm:text-sm lg:text-[15px] text-[#6B5544] leading-relaxed max-w-md mx-auto lg:mx-0 text-center lg:text-left animate-fade-in-up font-light" style={{ animationDelay: '0.2s' }}>
                Discover our exclusive collection of elegant, comfortable, and stylish pants.
                From formal office wear to casual weekend comfort — crafted for the modern woman.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link
                  to="/shop"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-medium text-sm text-white overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#8b5e3c]/25 w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#8b5e3c] via-[#A0714A] to-[#C4813A] transition-opacity duration-500" />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#C4813A] via-[#A0714A] to-[#8b5e3c] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-2.5">
                    Shop Collection
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm text-[#5A4433] border border-[#8b5e3c]/25 bg-[#8b5e3c]/5 backdrop-blur-sm hover:bg-[#8b5e3c]/10 hover:border-[#8b5e3c]/40 transition-all duration-300 w-full sm:w-auto"
                >
                  Contact Us
                </Link>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 pt-4 lg:pt-6 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div>
                  <p className="font-heading text-xl sm:text-2xl lg:text-3xl font-semibold text-[#8b5e3c]">50+</p>
                  <p className="text-[10px] sm:text-xs font-medium text-[#8B7355] mt-0.5">Products</p>
                </div>
                <div className="w-px h-8 sm:h-10 bg-[#3B2A1A]/10" />
                <div>
                  <p className="font-heading text-xl sm:text-2xl lg:text-3xl font-semibold text-[#8b5e3c]">1000+</p>
                  <p className="text-[10px] sm:text-xs font-medium text-[#8B7355] mt-0.5">Happy Customers</p>
                </div>
                <div className="w-px h-8 sm:h-10 bg-[#3B2A1A]/10" />
                <div>
                  <p className="font-heading text-xl sm:text-2xl lg:text-3xl font-semibold text-[#8b5e3c]">4.9★</p>
                  <p className="text-[10px] sm:text-xs font-medium text-[#8B7355] mt-0.5">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Instagram Reels Carousel */}
        <div
          className="w-full lg:w-1/2 relative bg-[#F0E8DF] flex items-center justify-center overflow-hidden min-h-[400px] lg:min-h-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Soft edge blend - desktop only */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FAF5EF] to-transparent z-20 pointer-events-none" />

          {/* Instagram branding badge */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm">
            <Instagram size={14} className="text-[#E1306C]" />
            <span className="text-[10px] font-bold text-[#3B2A1A]">@tubhyamofficial</span>
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            {reels.map((reel, index) => {
              const diff = index - activeReel;
              const total = reels.length;
              let pos = diff;
              if (diff > total / 2) pos = diff - total;
              if (diff < -total / 2) pos = diff + total;

              const isActive = pos === 0;
              const isAdjacent = Math.abs(pos) === 1;
              const isVisible = Math.abs(pos) <= 2;

              if (!isVisible) return null;

              return (
                <div
                  key={reel.id}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    transform: `translateX(${pos * (window.innerWidth < 640 ? 140 : window.innerWidth < 1024 ? 170 : 200)}px) scale(${isActive ? 1 : isAdjacent ? 0.82 : 0.65})`,
                    zIndex: isActive ? 30 : isAdjacent ? 20 : 10,
                    opacity: isActive ? 1 : isAdjacent ? 0.6 : 0.3,
                  }}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-700 ${
                      isActive
                        ? 'w-[180px] h-[320px] sm:w-[200px] sm:h-[360px] lg:w-[220px] lg:h-[380px] xl:w-[260px] xl:h-[440px]'
                        : 'w-[140px] h-[250px] sm:w-[160px] sm:h-[280px] lg:w-[180px] lg:h-[310px] xl:w-[210px] xl:h-[360px]'
                    }`}
                  >
                    {/* Active card: Real video or local fallback */}
                    {isActive && reel.isVideo && reel.videoUrl ? (
                      <video
                        key={`video-${activeReel}-${reel.id}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        poster={reel.src}
                      >
                        <source src={reel.videoUrl} type="video/mp4" />
                      </video>
                    ) : isActive && !reel.isVideo ? (
                      // Active but no video — use local hero video as fallback
                      <video
                        key={`fallback-video-${activeReel}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        <source src={heroVideo} type="video/mp4" />
                      </video>
                    ) : (
                      // Inactive cards: show thumbnail image
                      <img
                        src={reel.src}
                        alt={reel.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}

                    {/* Bottom gradient with label */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider line-clamp-1">
                        {reel.label}
                      </span>
                    </div>

                    {/* Active ring */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#E8652B]/50 pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {reels.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveReel(i)}
                className={`transition-all duration-500 rounded-full ${
                  i === activeReel
                    ? 'w-6 h-2 bg-[#E8652B]'
                    : 'w-2 h-2 bg-[#3B2A1A]/25 hover:bg-[#3B2A1A]/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ─── DARK THEME: Full-screen centered layout ─── */
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 flex justify-center">
        <div className="max-w-4xl space-y-7 text-center">
          <div className="inline-flex mt-16 sm:mt-20 items-center gap-2 px-5 py-2 rounded-full animate-fade-in-up mx-auto bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 backdrop-blur-xl shadow-lg shadow-primary/5">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/90">New Collection 2026</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.12] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="font-semibold text-gradient-gold">Premium</span>
            <br />
            <span className="font-light tracking-normal">Women&apos;s Pants</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg max-w-xl mx-auto animate-fade-in-up text-muted-foreground/80 font-light leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Discover our exclusive collection of elegant, comfortable, and stylish pants.
            From formal office wear to casual weekend comfort — crafted for the modern woman.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center gap-2.5 px-9 py-3.5 rounded-full font-medium text-sm overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/25 w-full sm:w-auto"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary transition-opacity duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2.5 text-primary-foreground">
                Shop Collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full font-medium text-sm text-foreground/80 border border-primary/20 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 hover:text-foreground transition-all duration-300 w-full sm:w-auto"
            >
              Contact Us
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-8 pt-6 animate-fade-in-up flex-wrap" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="font-heading text-2xl sm:text-3xl font-semibold text-primary">50+</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Products</p>
            </div>
            <div className="w-px h-10 bg-border/50 hidden sm:block" />
            <div className="text-center">
              <p className="font-heading text-2xl sm:text-3xl font-semibold text-primary">1000+</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Happy Customers</p>
            </div>
            <div className="w-px h-10 bg-border/50 hidden sm:block" />
            <div className="text-center">
              <p className="font-heading text-2xl sm:text-3xl font-semibold text-primary">4.9★</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
