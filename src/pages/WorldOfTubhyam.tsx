import { motion } from 'framer-motion';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Award, Heart, Star, Quote, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';

/* ── Images (faceless — clothing/body shots) ── */
const heroImg = '/images/products/brownbelt1.jpg';
const storyImg1 = '/images/products/belt-formal-beige1.jpg';
const storyImg2 = '/images/products/olive-formal-belt.jpg';
const storyImg3 = '/images/products/blackstraight.jpg';

const categoryImages = [
  '/images/products/blackstraight.jpg',
  '/images/products/blacklacepant.jpg',
  '/images/products/brownlacepant.jpg',
  '/images/products/cord-set-002-wine.jpg',
  '/images/products/belt-formal-beige1.jpg',
  '/images/products/beggyplatedkoreanfront.jpg',
];
const categoryNames = ['Wide-Leg Pants', 'Lace Wide-Leg Pants', 'Lace Statement Pants', 'Co-ord Set', 'Formal Pants', 'Baggy Pleated Pants'];

const trendingImages = [
  '/images/products/blackstraight.jpg',
  '/images/products/blacklacepant.jpg',
  '/images/products/belt-imported.jpg',
  '/images/products/beggyplatedkoreanfront.jpg',
  '/images/products/brownbelt1.jpg',
  '/images/products/blacklacepant2.jpg',
];
const trendingNames = ['Wide-Leg Formal Pants', 'Lace Wide-Leg Statement Pants', 'Imported Belt Formal Pants', 'Imported Baggy Pleated Pants', 'Belt Formal Pants', 'Lace Wide-Leg Statement Pants'];
const trendingPrices = ['₹1,499', '₹1,699', '1,899', '₹1,999', '₹1,799', '₹1,599'];
const trendingOldPrices = ['₹2,499', '₹2,699', '₹2,899', '₹2,999', '₹2,799', '₹2,599'];
const trendingBadges = ['Bestseller', 'New', 'Bestseller', 'New', 'Bestseller', '-20% OFF'];
const trendingRatings = [4.8, 4.9, 4.7, 4.6, 4.8, 4.9];
const trendingReviews = [124, 89, 156, 73, 112, 97];

const testimonials = [
  { name: 'Priya Sharma', text: 'Tubhyam finally gave me clothes that fit beautifully and comfortably. The quality is unmatched!', rating: 5, location: 'Mumbai' },
  { name: 'Ananya Reddy', text: 'The quality, fit and design are just perfect. It\'s rare to find a brand that truly understands all body types.', rating: 5, location: 'Hyderabad' },
  { name: 'Aditi Mehta', text: 'Finally, an Indian wear brand that celebrates real women. Tubhyam is a breath of fresh air!', rating: 5, location: 'Delhi' },
];

const ease = [0.16, 1, 0.3, 1] as const;

const WorldOfTubhyam = () => {
  return (
    <>
      <SEO
        title="World of Tubhyam | India's Most Inclusive Premium Fashion Brand"
        description="More than fashion — a movement. XXS to 5XL, every skin tone, premium quality. Tubhyam is designed for every Indian woman."
        url="https://www.tubhyam.in/world-of-tubhyam"
        type="website"
        breadcrumbItems={[{ name: 'World of Tubhyam', url: 'https://www.tubhyam.in/world-of-tubhyam' }]}
      />

      <Navbar />
      <ScrollToTop />

      <main className="bg-white text-[#2E241F]">

        {/* ═══════════════════════════════════════════════════════════
            HERO — Image left + Cream content right
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[85vh]">

            {/* LEFT — Image with overlay text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full md:w-[55%] h-[55vh] md:h-auto overflow-hidden"
            >
              <img
                src={heroImg}
                alt="Tubhyam Fashion"
                className="w-full h-full object-cover object-[center_25%]"
              />
              {/* Overlay text on image */}
              <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-10">
                <p className="text-white text-[10px] sm:text-xs tracking-[0.25em] uppercase leading-[1.8] font-medium">
                  Indian Roots.<br />Modern<br />You.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-black/20 md:via-transparent md:to-transparent" />
            </motion.div>

            {/* RIGHT — Cream bg + Content */}
            <div className="w-full md:w-[45%] flex items-center px-8 sm:px-12 md:px-14 lg:px-16 py-14 md:py-0 relative" style={{ background: '#F5EDE3' }}>
              <div className="max-w-md w-full">
                {/* Label */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2"
                  style={{ color: '#8B5E3C' }}
                >
                  <span className="w-6 h-px" style={{ background: '#8B5E3C' }} />
                  Tubhyam
                </motion.p>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease }}
                  className="font-heading text-4xl sm:text-5xl md:text-[2.8rem] lg:text-[3.2rem] font-bold leading-[1.08] tracking-tight mb-5"
                >
                  More Than<br />Fashion.<br />
                  <span className="text-gradient-gold">A Movement.</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.55 }}
                  className="text-[12px] sm:text-[13px] leading-[1.7] mb-7"
                  style={{ color: '#6B5B4E' }}
                >
                  At Tubhyam, we celebrate every woman — her shape, her skin, her style. Our designs are crafted for real Indian women, from XXS to 5XL, in colors that flatter every tone.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7, ease }}
                >
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white transition-all duration-300 hover:scale-105"
                    style={{ background: '#2E241F' }}
                  >
                    Explore Our Collection
                    <ArrowRight size={13} />
                  </Link>
                </motion.div>
              </div>

              {/* Decorative right edge — numbers + lotus */}
              <div className="hidden lg:flex flex-col items-center absolute right-6 top-1/2 -translate-y-1/2 gap-6">
                <div className="flex flex-col items-center gap-4">
                  {['01', '02', '03'].map((n) => (
                    <span key={n} className="text-[10px] font-medium" style={{ color: 'rgba(139,94,60,0.3)' }}>{n}</span>
                  ))}
                </div>
                <div className="w-px h-8" style={{ background: 'rgba(139,94,60,0.15)' }} />
                <div className="text-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mx-auto mb-1" style={{ color: 'rgba(139,94,60,0.25)' }}>
                    <path d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 14C12 14 6 16 6 20C6 21 8 22 12 22C16 22 18 21 18 20C18 16 12 14 12 14Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <p className="text-[7px] tracking-[0.15em] uppercase" style={{ color: 'rgba(139,94,60,0.3)' }}>Designed<br />for Real<br />Women</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            TRUST BADGES
        ═══════════════════════════════════════════════════════════ */}
        <section className="border-b bg-white" style={{ borderColor: 'rgba(139,94,60,0.08)' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x" style={{ borderColor: 'rgba(139,94,60,0.06)' }}>
              {[
                { icon: Truck, label: 'Complimentary Shipping', sub: 'Above ₹2000' },
                { icon: RotateCcw, label: 'Easy Returns', sub: 'No Questions Asked' },
                { icon: ShieldCheck, label: 'Secure Payments', sub: '100% Safe' },
                { icon: Award, label: 'Premium Quality', sub: 'Fabric & Stitching' },
                { icon: Heart, label: 'Loved by 10K+', sub: 'Happy Customers' },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="py-6 md:py-7 px-3 text-center"
                  >
                    <Icon size={18} className="mx-auto mb-2" style={{ color: '#8B5E3C' }} />
                    <div className="text-[11px] font-semibold tracking-wide" style={{ color: '#2E241F' }}>{b.label}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#999' }}>{b.sub}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SHOP BY CATEGORY — Find Your Perfect Fit
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: '#8B5E3C' }}>Shop by Category</p>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Find Your Perfect Fit</h2>
              </div>
              <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-60" style={{ color: '#8B5E3C' }}>
                Explore All <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {categoryImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-[#f0ebe5]">
                    <img
                      src={img}
                      alt={categoryNames[i]}
                      className="w-full h-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-heading text-[11px] sm:text-xs font-semibold leading-tight mb-1">{categoryNames[i]}</h3>
                  <Link to="/shop" className="text-[10px] font-medium transition-opacity hover:opacity-60" style={{ color: '#8B5E3C' }}>
                    Shop Now <ArrowRight size={9} className="inline" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            OUR STORY — Built on Belief
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24" style={{ background: '#FAF6F1' }}>
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-12 gap-8 md:gap-6 items-center">

              {/* LEFT — 3 overlapping images */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="md:col-span-5 relative"
              >
                <div className="relative h-[320px] sm:h-[380px]">
                  <div className="absolute left-0 top-0 w-[55%] h-[75%] overflow-hidden rounded-lg shadow-lg z-10">
                    <img src={storyImg1} alt="" className="w-full h-full object-cover object-[center_30%]" />
                  </div>
                  <div className="absolute left-[30%] top-[10%] w-[55%] h-[75%] overflow-hidden rounded-lg shadow-lg z-20">
                    <img src={storyImg2} alt="" className="w-full h-full object-cover object-[center_30%]" />
                  </div>
                  <div className="absolute left-[15%] bottom-0 w-[50%] h-[55%] overflow-hidden rounded-lg shadow-lg z-30">
                    <img src={storyImg3} alt="" className="w-full h-full object-cover object-[center_30%]" />
                  </div>
                  {/* Decorative leaf */}
                  <div className="absolute -right-4 -bottom-4 z-0 opacity-20">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <path d="M10 70C10 70 20 30 50 10C50 10 40 50 10 70Z" fill="#8B5E3C" opacity="0.3"/>
                      <path d="M10 70C10 70 30 50 70 40C70 40 50 60 10 70Z" fill="#8B5E3C" opacity="0.2"/>
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* MIDDLE — Text */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="md:col-span-4"
              >
                <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: '#8B5E3C' }}>Our Story</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-4">
                  Built on Belief.<br />Designed for You.
                </h2>
                <p className="text-[12px] sm:text-[13px] leading-[1.7] mb-6" style={{ color: '#6B5B4E' }}>
                  Tubhyam was born from a simple yet powerful belief — that every woman deserves to feel beautiful, confident and comfortable in her own skin. We create contemporary Indian wear that blends tradition with modernity, crafted for real bodies and real lives.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ background: '#2E241F' }}
                >
                  Our Journey <ArrowRight size={12} />
                </Link>
              </motion.div>

              {/* RIGHT — Quote */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="md:col-span-3"
              >
                <div className="relative pl-6 border-l-2" style={{ borderColor: 'rgba(139,94,60,0.3)' }}>
                  <Quote size={20} className="mb-3" style={{ color: 'rgba(139,94,60,0.3)' }} />
                  <p className="font-heading text-base sm:text-lg font-bold italic leading-snug tracking-tight mb-3" style={{ color: '#2E241F' }}>
                    "Fashion should fit your life, not the other way around."
                  </p>
                  <p className="text-[11px]" style={{ color: '#8B5E3C' }}>— Team Tubhyam</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TRENDING NOW
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: '#8B5E3C' }}>New Arrivals</p>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Trending Now</h2>
              </div>
              <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-60" style={{ color: '#8B5E3C' }}>
                View All <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {trendingImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-[#f0ebe5]">
                    <img
                      src={img}
                      alt={trendingNames[i]}
                      className="w-full h-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badge */}
                    <span className="absolute top-2 left-2 text-[9px] font-semibold px-2 py-1 rounded-sm text-white" style={{ background: '#2E241F' }}>
                      {trendingBadges[i]}
                    </span>
                    {/* Heart */}
                    <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart size={12} style={{ color: '#8B5E3C' }} />
                    </button>
                  </div>
                  <h3 className="font-heading text-[11px] sm:text-xs font-semibold leading-tight mb-1 line-clamp-2">{trendingNames[i]}</h3>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-bold" style={{ color: '#2E241F' }}>{trendingPrices[i]}</span>
                    <span className="text-[10px] line-through" style={{ color: '#bbb' }}>{trendingOldPrices[i]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={8} fill={j < Math.round(trendingRatings[i]) ? '#E8652B' : '#ddd'} style={{ color: j < Math.round(trendingRatings[i]) ? '#E8652B' : '#ddd' }} />
                    ))}
                    <span className="text-[9px] ml-1" style={{ color: '#999' }}>({trendingReviews[i]})</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            REAL STORIES — Testimonials
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24" style={{ background: '#FAF6F1' }}>
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-12 gap-10 items-start">

              {/* LEFT — Text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="md:col-span-4"
              >
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                  Real Stories.<br />Real Women.
                </h2>
                <p className="text-[13px] leading-[1.7] mb-6" style={{ color: '#6B5B4E' }}>
                  Real women who found their style, confidence and comfort with Tubhyam.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ background: '#2E241F' }}
                >
                  Read All Reviews <ArrowRight size={12} />
                </Link>
              </motion.div>

              {/* RIGHT — 3 testimonial cards */}
              <div className="md:col-span-8 grid sm:grid-cols-3 gap-4">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white rounded-xl p-5 border" style={{ borderColor: 'rgba(139,94,60,0.08)' }}
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#8B5E3C' }}>
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{t.name}</div>
                        <div className="text-[10px]" style={{ color: '#999' }}>{t.location}</div>
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} size={10} fill="#E8652B" style={{ color: '#E8652B' }} />
                      ))}
                    </div>
                    {/* Text */}
                    <p className="text-[11px] leading-[1.6]" style={{ color: '#6B5B4E' }}>
                      "{t.text}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            NEWSLETTER + CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-white border-t" style={{ borderColor: 'rgba(139,94,60,0.08)' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <Mail size={22} className="mx-auto mb-4" style={{ color: '#8B5E3C' }} />
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3">Stay in the Loop</h2>
              <p className="text-[13px] mb-6" style={{ color: '#6B5B4E' }}>
                Be the first to know about new arrivals, exclusive offers and style inspiration.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 rounded-full text-xs border outline-none focus:border-[#8B5E3C] transition-colors"
                  style={{ borderColor: 'rgba(139,94,60,0.2)', background: '#FAF6F1' }}
                />
                <button className="px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all duration-300 hover:scale-105" style={{ background: '#2E241F' }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default WorldOfTubhyam;
