import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Heart, Users, Palette, Ruler, Sparkles, Award, Shield, Leaf, ArrowRight, Check, Star, ShoppingBag, Gem, Crown, Feather, Quote, TrendingUp, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const heroBg = '/images/products/image.jpg';

/* ------------------------------------------------------------------ */
/*  Scroll-triggered animation hook                                    */
/* ------------------------------------------------------------------ */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ------------------------------------------------------------------ */
/*  Animated Section Wrapper                                           */
/* ------------------------------------------------------------------ */
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView(0.12);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Schema Data                                                    */
/* ------------------------------------------------------------------ */
const FAQ_DATA = [
  {
    question: 'What makes Tubhyam different from other women\'s fashion brands in India?',
    answer: 'Tubhyam is India\'s first size-inclusive premium fashion brand designed specifically for Indian body types and skin tones. We offer XS to 5XL with the same quality and attention to fit across every size. Our colors are scientifically curated to complement every Indian complexion — from fair to dusky to deep.',
  },
  {
    question: 'What sizes does Tubhyam offer?',
    answer: 'Tubhyam offers a true size range from XS to 5XL. Every size is designed with the same care, quality, and attention to fit — not vanity sizing, not "plus size" as an afterthought. We studied over 2,000 Indian women\'s body measurements to create patterns that actually fit.',
  },
  {
    question: 'How does Tubhyam ensure colors look good on all skin tones?',
    answer: 'We work with color psychologists and dermatologists to create a palette that enhances every Indian skin tone. Each color is tested under different lighting conditions — natural sunlight, office lighting, evening events — to ensure you look radiant everywhere.',
  },
  {
    question: 'What is Tubhyam\'s return and exchange policy?',
    answer: 'Tubhyam offers a hassle-free 7-day return policy. If the fit isn\'t perfect, we\'ll exchange it. We believe every woman deserves clothes that fit right, and we stand behind our sizing with confidence.',
  },
  {
    question: 'Does Tubhyam ship across India?',
    answer: 'Yes! Tubhyam ships pan-India with free shipping on orders above ₹999. We accept all major payment methods including UPI, credit/debit cards, and net banking.',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const WorldOfTubhyam = () => {
  const { isLight } = useTheme();

  const T = {
    bg:          isLight ? '#FAF5EF' : '#0F0D0B',
    surface:     isLight ? '#FFFFFF' : '#1C1714',
    surfaceAlt:  isLight ? '#F5EDE4' : '#241E18',
    border:      isLight ? '#E0D5C8' : 'rgba(255,211,172,0.08)',
    text:        isLight ? '#1A1410' : '#FFF5EB',
    textSec:     isLight ? '#6B5E52' : 'rgba(255,211,172,0.7)',
    textMuted:   isLight ? '#9B8E82' : 'rgba(255,211,172,0.35)',
    accent:      '#8B5E3C',
    gradient:    'linear-gradient(135deg, #8B5E3C 0%, #A0714D 40%, #C9A882 100%)',
  };

  return (
    <>
      <SEO
        title="World of Tubhyam | India's Most Inclusive Premium Fashion Brand — XS to 5XL, All Skin Tones"
        description="Discover why thousands of Indian women trust Tubhyam for premium, size-inclusive fashion. From XS to 5XL, every shade, every body type. Research-backed design, color science for Indian skin tones, and real-woman tested comfort. Shop formal pants, jeans, track pants & more."
        keywords="inclusive fashion India, all size women clothing XS to 5XL, premium pants all skin tones, size inclusive brand India, body positive fashion Indian women, Tubhyam brand story, women's fashion for every body type, comfortable elegant pants India, diverse fashion brand, affordable premium fashion India, Tubhyam inclusive sizing, fashion for dusky skin tone, plus size fashion India, petite women fashion India"
        url="https://www.tubhyam.in/world-of-tubhyam"
        type="website"
        breadcrumbItems={[
          { name: 'World of Tubhyam', url: 'https://www.tubhyam.in/world-of-tubhyam' },
        ]}
      />

      {/* FAQ Schema for AEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://www.schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ_DATA.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      })}} />

      <Navbar />

      {/* ================================================================ */}
      {/*  HERO SECTION                                                    */}
      {/* ================================================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax-like feel */}
        <div className="absolute inset-0" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className={`absolute inset-0 ${isLight ? 'bg-gradient-to-b from-black/70 via-black/50 to-black/80' : 'bg-gradient-to-b from-black/60 to-black/70'}`} />

        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-4 animate-fade-in-down ${isLight ? 'bg-white/10 backdrop-blur-md border border-white/25 text-white' : 'glass-card'}`}>
              <Heart size={15} className={isLight ? 'text-[#E8B882]' : 'text-primary'} fill="currentColor" />
              <span className="text-xs sm:text-sm font-medium tracking-wide">तुम्हारे लिए — Made For You, With Love</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold animate-fade-in-up leading-[1.1]">
              <span className={isLight ? 'text-white' : ''}>Every Woman</span>
              <br />
              <span className="text-gradient-animated">Deserves Elegance</span>
            </h1>

            {/* Subheadline */}
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-4 animate-fade-in-up ${isLight ? 'text-white/85' : 'text-muted-foreground'}`} style={{ animationDelay: '200ms' }}>
              Regardless of size. Regardless of skin tone. Because confidence isn't one-size-fits-all,
              <span className={`block mt-2 font-medium ${isLight ? 'text-white' : 'text-foreground'}`}>and neither should your wardrobe be.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ background: T.gradient }}
              >
                <ShoppingBag size={18} />
                Explore Our Collection
              </Link>
              <a
                href="#our-promise"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 ${
                  isLight
                    ? 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20'
                    : 'glass-card hover:border-primary/30'
                }`}
              >
                <Heart size={18} />
                Read Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  THE TRUTH SECTION                                               */}
      {/* ================================================================ */}
      <section id="our-promise" className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12 md:mb-16">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>Our Truth</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: T.text }}>
                  The <span className="text-gradient-animated">Conversation</span> We Need to Have
                </h2>
                <div className="section-divider mt-6" />
              </div>
            </AnimatedSection>

            <div className="space-y-8 text-base sm:text-lg md:text-xl leading-relaxed" style={{ color: T.textSec }}>
              <AnimatedSection>
                <p className="text-center max-w-3xl mx-auto">
                  <span className="font-semibold block mb-2" style={{ color: T.text }}>Did you know?</span>
                  Research shows that <span className="font-semibold" style={{ color: T.accent }}>67% of Indian women</span> struggle to find clothes that fit properly.
                  Not because they're "hard to fit" — but because the fashion industry has been designing for an imaginary woman who doesn't exist.
                </p>
              </AnimatedSection>

              {/* Stats */}
              <div className="grid sm:grid-cols-2 gap-6 my-10 sm:my-14">
                <AnimatedSection delay={100}>
                  <div className="premium-card p-6 sm:p-8 md:p-10 text-center">
                    <div className="stat-number text-5xl sm:text-6xl md:text-7xl mb-3">73%</div>
                    <p className="text-sm sm:text-base md:text-lg mb-3" style={{ color: T.textSec }}>
                      of women report anxiety while shopping due to limited size availability
                    </p>
                    <p className="text-xs sm:text-sm italic" style={{ color: T.textMuted }}>
                      Source: Body Image & Fashion Accessibility Study, 2024
                    </p>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={250}>
                  <div className="premium-card p-6 sm:p-8 md:p-10 text-center">
                    <div className="stat-number text-5xl sm:text-6xl md:text-7xl mb-3">8/10</div>
                    <p className="text-sm sm:text-base md:text-lg mb-3" style={{ color: T.textSec }}>
                      women have experienced discrimination based on their body type while shopping
                    </p>
                    <p className="text-xs sm:text-sm italic" style={{ color: T.textMuted }}>
                      Source: Inclusive Fashion Report, India 2025
                    </p>
                  </div>
                </AnimatedSection>
              </div>

              {/* Quote */}
              <AnimatedSection>
                <div className="quote-accent rounded-xl p-6 sm:p-8 md:p-10 italic text-base sm:text-lg md:text-xl" style={{ color: T.textSec }}>
                  "I remember standing in a changing room, holding a pair of pants marked 'XL' that wouldn't go past my thighs.
                  The saleswoman asked if I needed help. I said no, but what I really needed was a brand that understood me."
                  <span className="block mt-4 text-xs sm:text-sm not-italic font-medium" style={{ color: T.textMuted }}>
                    — Real customer story that inspired Tubhyam
                  </span>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  WHY WE EXIST — 6 PILLARS                                        */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28" style={{ background: isLight ? '#F5EDE4' : 'rgba(36,30,24,0.5)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12 md:mb-16">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>Our Promise</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: T.text }}>
                  This is <span className="text-gradient-animated">Why We Exist</span>
                </h2>
                <div className="section-divider mt-6 mb-6" />
                <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: T.textSec }}>
                  Tubhyam (तुम्हारे लिए — "For You") was born from a simple yet revolutionary belief:
                  <span className="block mt-3 font-semibold text-lg sm:text-xl md:text-2xl" style={{ color: T.text }}>
                    Every woman deserves to feel beautiful, comfortable, and confident — without compromise.
                  </span>
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {[
                { icon: <Ruler className="w-7 h-7" />, title: 'True Size Inclusivity', desc: 'XS to 5XL — and we mean it. Not vanity sizing. Not "plus size" as an afterthought. Every single size is designed with the same care, quality, and attention to fit.' },
                { icon: <Users className="w-7 h-7" />, title: 'Designed for Indian Women', desc: 'Our fit models represent real Indian body types — not imported standards. We understand that beauty in India comes in every shade, shape, and size.' },
                { icon: <Palette className="w-7 h-7" />, title: 'Colors That Celebrate You', desc: 'From fair to dusky to deep complexions — our color palette is scientifically curated to complement every skin tone beautifully. Because elegance knows no color.' },
                { icon: <Gem className="w-7 h-7" />, title: 'Premium, Not Pricey', desc: 'Luxury shouldn\'t be exclusive. We source the finest fabrics and maintain exceptional quality while keeping our prices accessible. Premium fashion for every woman.' },
                { icon: <Feather className="w-7 h-7" />, title: 'Comfort is Non-Negotiable', desc: 'Breathable fabrics. Flexible waistbands. Thoughtful construction. You shouldn\'t have to choose between looking elegant and feeling comfortable.' },
                { icon: <Heart className="w-7 h-7" />, title: 'Made by Women, For Women', desc: 'Our design team understands the frustration of ill-fitting clothes because we\'ve lived it. Every product is tested by real women across different sizes and skin tones.' },
              ].map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 100}>
                  <div className="premium-card p-6 sm:p-7 h-full flex items-start gap-4">
                    <div className="icon-circle shrink-0">
                      <span style={{ color: T.accent }}>{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-heading text-lg sm:text-xl font-semibold mb-2" style={{ color: T.text }}>{item.title}</h3>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: T.textSec }}>{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  BEAUTY HAS NO STANDARD — Feature Cards                           */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12 md:mb-16">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>Our Collection</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: T.text }}>
                  Beauty Has <span className="text-gradient-animated">No Standard</span>
                </h2>
                <div className="section-divider mt-6 mb-6" />
                <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto" style={{ color: T.textSec }}>
                  Real women. Real bodies. Real elegance. Our collection is designed to celebrate every unique you.
                </p>
              </div>
            </AnimatedSection>

            {/* 3 Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-14">
              {[
                { icon: <Crown className="w-8 h-8" />, title: 'Formal Elegance', desc: 'Step into any room with confidence. Our formal collection is crafted for the modern woman who commands attention.' },
                { icon: <Feather className="w-8 h-8" />, title: 'Effortless Comfort', desc: 'Style shouldn\'t compromise comfort. Our breathable fabrics and thoughtful designs ensure you feel amazing all day.' },
                { icon: <Gem className="w-8 h-8" />, title: 'Radiant Colors', desc: 'Every shade in our collection is carefully chosen to complement and celebrate every beautiful skin tone.' },
              ].map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 150}>
                  <div className="premium-card p-8 sm:p-10 text-center h-full">
                    <div className="icon-circle mx-auto mb-6">
                      <span style={{ color: T.accent }}>{item.icon}</span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-3" style={{ color: T.text }}>{item.title}</h3>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: T.textSec }}>{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* 4 Mini Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: <Users className="w-6 h-6" />, title: 'All Sizes', desc: 'XS to 5XL with consistent fit quality' },
                { icon: <Palette className="w-6 h-6" />, title: 'All Skin Tones', desc: 'Colors tested on diverse complexions' },
                { icon: <Ruler className="w-6 h-6" />, title: 'Perfect Fit', desc: 'Designed for real Indian body types' },
                { icon: <Award className="w-6 h-6" />, title: 'Premium Quality', desc: 'Accessible luxury for everyone' },
              ].map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 100}>
                  <div className="premium-card p-5 sm:p-6 text-center h-full">
                    <div className="icon-circle mx-auto mb-3" style={{ width: 48, height: 48 }}>
                      <span style={{ color: T.accent }}>{item.icon}</span>
                    </div>
                    <h4 className="font-heading text-base sm:text-lg font-semibold mb-1" style={{ color: T.text }}>{item.title}</h4>
                    <p className="text-xs sm:text-sm" style={{ color: T.textMuted }}>{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  HOW WE CREATE MAGIC — Process Steps                              */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28" style={{ background: isLight ? '#F5EDE4' : 'rgba(36,30,24,0.5)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12 md:mb-16">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>Our Process</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: T.text }}>
                  How We <span className="text-gradient-animated">Create Magic</span>
                </h2>
                <div className="section-divider mt-6" />
              </div>
            </AnimatedSection>

            <div className="space-y-5 sm:space-y-6">
              {[
                { num: '1', title: 'Research-Backed Design', desc: 'We studied over 2,000 Indian women\'s body measurements across different regions, ages, and body types. Our patterns are based on real data, not arbitrary standards. This means better fit, less return, more confidence.' },
                { num: '2', title: 'Color Science for Indian Skin Tones', desc: 'Working with color psychologists and dermatologists, we\'ve created a palette that enhances every Indian skin tone — from wheat to wheatish-brown to dusky to deep. Each color is tested under different lighting to ensure you look radiant everywhere.' },
                { num: '3', title: 'Premium Fabric Selection', desc: 'We source breathable, temperature-regulating fabrics perfect for India\'s climate. High thread count, wrinkle-resistant, and durable — because premium doesn\'t mean delicate. Our clothes are meant to be worn and loved, not just admired.' },
                { num: '4', title: 'Real-Woman Testing', desc: 'Before any product reaches you, it\'s tested by women of all sizes and body types. We check for comfort during sitting, walking, bending — real-life movements. If our testers wouldn\'t wear it all day, it doesn\'t make the cut.' },
              ].map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 120}>
                  <div className="premium-card p-5 sm:p-7 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                    <div className="step-badge">{step.num}</div>
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-2" style={{ color: T.text }}>{step.title}</h3>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: T.textSec }}>{step.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  TESTIMONIALS                                                     */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12 md:mb-16">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>Love Letters</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: T.text }}>
                  This is <span className="text-gradient-animated">Your Story</span> Too
                </h2>
                <div className="section-divider mt-6 mb-6" />
                <p className="text-base sm:text-lg md:text-xl" style={{ color: T.textSec }}>
                  Real women. Real transformations. Real confidence.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {[
                { name: 'Priya M.', city: 'Mumbai', tag: 'Size 3XL Customer', text: 'For the first time in years, I didn\'t have to compromise. The 3XL fit perfectly, the color looked stunning on my dusky skin, and I felt confident walking into that interview. I got the job, by the way!' },
                { name: 'Ananya R.', city: 'Bangalore', tag: 'Size XS Customer', text: 'As a petite woman, I\'ve always struggled with pants being too long or too loose. Tubhyam\'s XS fits like it was made for ME. Finally, a brand that doesn\'t treat smaller sizes as an afterthought.' },
                { name: 'Keerthana S.', city: 'Chennai', tag: 'Repeat Customer', text: 'I have a deeper skin tone and always struggled to find colors that looked good on me. The beige formal pants from Tubhyam are STUNNING on me. I\'ve received so many compliments. Thank you for understanding us!' },
                { name: 'Divya K.', city: 'Delhi', tag: 'First-time Buyer', text: 'Premium quality at this price? I was skeptical. But these are genuinely the most comfortable formal pants I own. The fabric is breathable, the fit is perfect, and I feel elegant without breaking the bank.' },
              ].map((t, i) => (
                <AnimatedSection key={t.name} delay={i * 120}>
                  <div className="testimonial-card premium-card p-6 sm:p-8 h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-current" style={{ color: T.accent }} />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base italic mb-5 leading-relaxed flex-1" style={{ color: T.textSec }}>
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${T.accent}15` }}>
                        <Heart className="w-5 h-5" style={{ color: T.accent }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: T.text }}>{t.name}, {t.city}</p>
                        <p className="text-xs" style={{ color: T.textMuted }}>{t.tag}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  FAQ SECTION (AEO Boost)                                         */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28" style={{ background: isLight ? '#F5EDE4' : 'rgba(36,30,24,0.5)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>FAQ</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: T.text }}>
                  Frequently Asked <span className="text-gradient-animated">Questions</span>
                </h2>
                <div className="section-divider mt-6" />
              </div>
            </AnimatedSection>

            <div className="space-y-4">
              {FAQ_DATA.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} delay={i * 100} T={T} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  OUR PROMISE — CTA (Dark Rich Background)                        */}
      {/* ================================================================ */}
      <section className="relative py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden" style={{ background: isLight ? 'linear-gradient(135deg, #2A1A0E 0%, #3A241A 40%, #1A0F08 100%)' : 'linear-gradient(135deg, #0F0D0B 0%, #1C1714 40%, #0F0D0B 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,211,172,0.3), transparent)' }} />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #FFD3AC, transparent)' }} />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #C9A882, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #FFD3AC, transparent)' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              {/* Decorative top element */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,211,172,0.5))' }} />
                <Sparkles className="w-5 h-5" style={{ color: '#FFD3AC' }} />
                <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,211,172,0.5), transparent)' }} />
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8" style={{ color: '#FFF5EB' }}>
                Our <span className="text-gradient-animated">Promise</span> to You
              </h2>
            </AnimatedSection>

            <div className="space-y-5 text-base sm:text-lg md:text-xl leading-relaxed mb-12">
              <AnimatedSection>
                <p className="font-medium text-lg sm:text-xl" style={{ color: 'rgba(255,245,235,0.9)' }}>
                  We promise that when you open a Tubhyam package, you'll find more than just clothing.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={150}>
                <p style={{ color: 'rgba(255,211,172,0.75)' }}>
                  You'll find <span className="font-semibold" style={{ color: '#FFD3AC' }}>validation</span> that you deserve beautiful things.
                  You'll find <span className="font-semibold" style={{ color: '#FFD3AC' }}>confidence</span> that fits just right.
                  You'll find <span className="font-semibold" style={{ color: '#FFD3AC' }}>elegance</span> that celebrates who you are.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <p className="font-semibold text-lg sm:text-xl" style={{ color: '#FFF5EB' }}>
                  Because every woman — regardless of size, skin tone, or budget — deserves to feel extraordinary.
                </p>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={400}>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 sm:px-12 sm:py-5 rounded-full text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:scale-105 group"
                style={{ background: 'linear-gradient(135deg, #8B5E3C 0%, #A0714D 40%, #C9A882 100%)', boxShadow: '0 8px 32px rgba(139,94,60,0.3)' }}
              >
                <ShoppingBag size={20} />
                Experience Tubhyam Today
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="flex items-center justify-center gap-6 mt-8">
                {[
                  { icon: <Shield className="w-4 h-4" />, text: '7-Day Returns' },
                  { icon: <Zap className="w-4 h-4" />, text: 'Pan-India Delivery' },
                  { icon: <Heart className="w-4 h-4" />, text: 'Made in India' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-1.5" style={{ color: 'rgba(255,211,172,0.5)' }}>
                    {item.icon}
                    <span className="text-xs font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Item                                                 */
/* ------------------------------------------------------------------ */
function FAQItem({ question, answer, delay, T }: { question: string; answer: string; delay: number; T: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const { ref, isVisible } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`premium-card transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
      >
        <span className="font-heading text-base sm:text-lg font-semibold pr-4" style={{ color: T.text }}>{question}</span>
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
          style={{
            background: `${T.accent}15`,
            color: T.accent,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-400"
        style={{ maxHeight: open ? '300px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base leading-relaxed" style={{ color: T.textSec }}>
          {answer}
        </div>
      </div>
    </div>
  );
}

export default WorldOfTubhyam;
