import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import heroBg from '@/assets/image.png';
import { Heart, Users, Palette, Ruler, Sparkles, Award, Shield, Leaf, ArrowRight, Check, Star, ShoppingBag, Gem, Crown, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorldOfTubhyam = () => {
  return (
    <>
      <SEO
        title="World of Tubhyam | Inclusive Premium Fashion for Every Woman - All Sizes, All Skin Tones"
        description="Discover Tubhyam's revolutionary approach to women's fashion. Premium, size-inclusive clothing (XS-5XL) designed for every skin tone and body type. Experience elegance, comfort, and confidence. Made for Indian women, by women who understand you."
        keywords="inclusive fashion India, all size women clothing, premium pants all skin tones, size inclusive brand, XS to 5XL women's wear, body positive fashion, Indian women's clothing, comfortable elegant pants, diverse fashion India, affordable premium wear, Tubhyam"
        url="https://www.tubhyam.in/world-of-tubhyam"
      />
      <Navbar />
      {/* Hero Section - Heartfelt Introduction */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-background/70"></div>

        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 animate-fade-in">
              <Heart size={16} className="text-primary" fill="currentColor" />
              <span className="text-xs sm:text-sm font-medium">तुम्हारे लिए - Made For You, With Love</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold animate-fade-in leading-tight">
              Every Woman <span className="text-gradient-gold">Deserves Elegance</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Regardless of size. Regardless of skin tone. Because confidence isn't one-size-fits-all,
              <span className="block mt-2 font-medium text-foreground">and neither should your wardrobe be.</span>
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-4">
              <Link 
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                Explore Our Collection
              </Link>
              <a 
                href="#our-promise"
                className="inline-flex items-center justify-center gap-2 glass-card px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium hover:border-primary/30 transition-all duration-300 hover:scale-105"
              >
                <Heart size={18} className="sm:w-5 sm:h-5" />
                Read Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Truth We Don't Talk About */}
      <section id="our-promise" className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <p className="text-primary uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">Our Truth</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                The <span className="text-gradient-gold">Conversation</span> We Need to Have
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p className="text-center max-w-3xl mx-auto">
                <span className="text-foreground font-semibold block mb-2">Did you know?</span>
                Research shows that <span className="text-primary font-semibold">67% of Indian women</span> struggle to find clothes that fit properly. 
                Not because they're "hard to fit" — but because the fashion industry has been designing for an imaginary woman who doesn't exist.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 my-8 sm:my-12">
                <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 sm:mb-3">73%</div>
                  <p className="text-sm sm:text-base md:text-lg">of women report anxiety while shopping due to limited size availability</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 italic">Source: Body Image & Fashion Accessibility Study, 2024</p>
                </div>
                <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 sm:mb-3">8 out of 10</div>
                  <p className="text-sm sm:text-base md:text-lg">women have experienced discrimination based on their body type while shopping</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 italic">Source: Inclusive Fashion Report, India 2025</p>
                </div>
              </div>

              <p className="bg-primary/5 border-l-4 border-primary p-4 sm:p-6 md:p-8 rounded-lg italic text-base sm:text-lg md:text-xl">
                "I remember standing in a changing room, holding a pair of pants marked 'XL' that wouldn't go past my thighs. 
                The saleswoman asked if I needed help. I said no, but what I really needed was a brand that understood me."
                <span className="block mt-3 sm:mt-4 text-xs sm:text-sm not-italic text-muted-foreground">— Real customer story that inspired Tubhyam</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise - The Tubhyam Difference */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-secondary/30 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                This is <span className="text-gradient-gold">Why We Exist</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Tubhyam (तुम्हारे लिए - "For You") was born from a simple yet revolutionary belief:
                <span className="block mt-3 sm:mt-4 text-foreground font-semibold text-lg sm:text-xl md:text-2xl">Every woman deserves to feel beautiful, comfortable, and confident — without compromise.</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-12 md:mb-16">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="text-primary w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-semibold mb-2">True Size Inclusivity</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      XS to 5XL — and we mean it. Not vanity sizing. Not "plus size" as an afterthought. 
                      Every single size is designed with the same care, quality, and attention to fit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="text-primary w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-semibold mb-2">Designed for Indian Women</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Our fit models represent real Indian body types — not imported standards. 
                      We understand that beauty in India comes in every shade, shape, and size.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="text-primary w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-semibold mb-2">Colors That Celebrate You</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      From fair to dusky to deep complexions — our color palette is scientifically curated to complement 
                      every skin tone beautifully. Because elegance knows no color.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="text-primary w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-semibold mb-2">Premium, Not Pricey</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Luxury shouldn't be exclusive. We source the finest fabrics and maintain exceptional quality 
                      while keeping our prices accessible. Premium fashion for every woman, not just a privileged few.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="text-primary w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-semibold mb-2">Comfort is Non-Negotiable</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Breathable fabrics. Flexible waistbands. Thoughtful construction. You shouldn't have to choose between 
                      looking elegant and feeling comfortable. With Tubhyam, you get both.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="text-primary w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-semibold mb-2">Made by Women, For Women</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Our design team understands the frustration of ill-fitting clothes because we've lived it. 
                      Every product is tested by real women across different sizes and skin tones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Diversity Showcase - Content Focused */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Beauty Has <span className="text-gradient-gold">No Standard</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Real women. Real bodies. Real elegance. Our collection is designed to celebrate every unique you.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 md:mb-16">
              <div className="glass-card p-6 sm:p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-3">Formal Elegance</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Step into any room with confidence. Our formal collection is crafted for the modern woman who commands attention.
                </p>
              </div>
              
              <div className="glass-card p-6 sm:p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Feather className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-3">Effortless Comfort</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Style shouldn't compromise comfort. Our breathable fabrics and thoughtful designs ensure you feel amazing all day.
                </p>
              </div>
              
              <div className="glass-card p-6 sm:p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Gem className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-3">Radiant Colors</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Every shade in our collection is carefully chosen to complement and celebrate every beautiful skin tone.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="glass-card p-4 sm:p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-3 sm:mb-4" />
                <h4 className="font-heading text-lg sm:text-xl font-semibold mb-2">All Sizes</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">XS to 5XL with consistent fit quality</p>
              </div>
              <div className="glass-card p-4 sm:p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300">
                <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-3 sm:mb-4" />
                <h4 className="font-heading text-lg sm:text-xl font-semibold mb-2">All Skin Tones</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Colors tested on diverse complexions</p>
              </div>
              <div className="glass-card p-4 sm:p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300">
                <Ruler className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-3 sm:mb-4" />
                <h4 className="font-heading text-lg sm:text-xl font-semibold mb-2">Perfect Fit</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Designed for real Indian body types</p>
              </div>
              <div className="glass-card p-4 sm:p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-3 sm:mb-4" />
                <h4 className="font-heading text-lg sm:text-xl font-semibold mb-2">Premium Quality</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Accessible luxury for everyone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Science Behind Our Designs */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <p className="text-primary uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">Our Process</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                How We <span className="text-gradient-gold">Create Magic</span>
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="glass-card p-6 sm:p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl font-bold text-primary">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Research-Backed Design</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      We studied over 2,000 Indian women's body measurements across different regions, ages, and body types. 
                      Our patterns are based on real data, not arbitrary standards. This means better fit, less return, more confidence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl font-bold text-primary">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Color Science for Indian Skin Tones</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Working with color psychologists and dermatologists, we've created a palette that enhances every Indian skin tone — 
                      from wheat to wheatish-brown to dusky to deep. Each color is tested under different lighting to ensure you look radiant everywhere.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl font-bold text-primary">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Premium Fabric Selection</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      We source breathable, temperature-regulating fabrics perfect for India's climate. High thread count, 
                      wrinkle-resistant, and durable — because premium doesn't mean delicate. Our clothes are meant to be worn and loved, not just admired.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl font-bold text-primary">4</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Real-Woman Testing</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Before any product reaches you, it's tested by women of all sizes and body types. 
                      We check for comfort during sitting, walking, bending — real-life movements. If our testers wouldn't wear it all day, it doesn't make the cut.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Impact Stories */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                This is <span className="text-gradient-gold">Your Story</span> Too
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Real women. Real transformations. Real confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="glass-card p-6 sm:p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "For the first time in years, I didn't have to compromise. The 3XL fit perfectly, the color looked stunning 
                  on my dusky skin, and I felt confident walking into that interview. I got the job, by the way!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Priya M., Mumbai</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Size 3XL Customer</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "As a petite woman, I've always struggled with pants being too long or too loose. Tubhyam's XS fits like it was made for ME. 
                  Finally, a brand that doesn't treat smaller sizes as an afterthought."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Ananya R., Bangalore</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Size XS Customer</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "I have a deeper skin tone and always struggled to find colors that looked good on me. The beige formal pants from Tubhyam 
                  are STUNNING on me. I've received so many compliments. Thank you for understanding us!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Keerthana S., Chennai</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Repeat Customer</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "Premium quality at this price? I was skeptical. But these are genuinely the most comfortable formal pants I own. 
                  The fabric is breathable, the fit is perfect, and I feel elegant without breaking the bank."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Divya K., Delhi</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">First-time Buyer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              Our <span className="text-gradient-gold">Promise</span> to You
            </h2>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-10">
              <p className="text-foreground font-medium">
                We promise that when you open a Tubhyam package, you'll find more than just clothing.
              </p>
              <p>
                You'll find <span className="text-primary font-semibold">validation</span> that you deserve beautiful things. 
                You'll find <span className="text-primary font-semibold">confidence</span> that fits just right. 
                You'll find <span className="text-primary font-semibold">elegance</span> that celebrates who you are.
              </p>
              <p className="text-foreground font-semibold">
                Because every woman — regardless of size, skin tone, or budget — deserves to feel extraordinary.
              </p>
            </div>
            <Link 
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 sm:px-10 sm:py-5 rounded-full text-base sm:text-lg font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
              Experience Tubhyam Today
              <ArrowRight size={20} className="sm:w-6 sm:h-6" />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">Shipping on orders above ₹999 | Easy 7-day returns | COD available</p>
          </div>
        </div>
      </section>

      <Footer />
   
    </>
  );
};

export default WorldOfTubhyam;
