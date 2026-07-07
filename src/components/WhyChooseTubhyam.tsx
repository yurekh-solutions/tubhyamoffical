import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WhyChooseTubhyam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const features = [
    {
      title: "Premium Quality",
      description: "Handpicked fabrics and meticulous craftsmanship in every piece",
      icon: "👑",
      gradient: "from-amber-600 via-amber-500 to-orange-500",
      bgGradient: "from-amber-900/20 to-orange-900/20",
      accentColor: "bg-amber-500"
    },
    {
      title: "Comfort First",
      description: "Designed for all-day wear without compromising on style and elegance",
      icon: "💝",
      gradient: "from-rose-600 via-rose-500 to-pink-500",
      bgGradient: "from-rose-900/20 to-pink-900/20",
      accentColor: "bg-rose-500"
    },
    {
      title: "Fast Delivery",
      description: "Quick shipping with real-time tracking to your doorstep",
      icon: "🚀",
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      bgGradient: "from-blue-900/20 to-cyan-900/20",
      accentColor: "bg-blue-500"
    },
    {
      title: "Secure Shopping",
      description: "Safe payments and hassle-free returns within 30 days",
      icon: "🛡️",
      gradient: "from-green-600 via-green-500 to-emerald-500",
      bgGradient: "from-green-900/20 to-emerald-900/20",
      accentColor: "bg-green-500"
    },
    {
      title: "Personal Styling",
      description: "Video consultation with our style experts for perfect fit",
      icon: "✨",
      gradient: "from-purple-600 via-purple-500 to-violet-500",
      bgGradient: "from-purple-900/20 to-violet-900/20",
      accentColor: "bg-purple-500"
    },
    {
      title: "Exclusive Collection",
      description: "Limited edition pieces not available anywhere else",
      icon: "💎",
      gradient: "from-indigo-600 via-indigo-500 to-blue-500",
      bgGradient: "from-indigo-900/20 to-blue-900/20",
      accentColor: "bg-indigo-500"
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const next = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % features.length);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const visibleCards = [
    features[(currentIndex - 1 + features.length) % features.length],
    features[currentIndex],
    features[(currentIndex + 1) % features.length]
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background to-background/80 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-primary uppercase tracking-widest text-sm font-bold mb-4 text-lg">Why Tubhyam</p>
          <h2 className="font-heading text-6xl md:text-7xl font-black mb-6 leading-tight">
            The <span className="text-gradient-gold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-600">
              Tubhyam
            </span>
            <br />
            <span className="text-5xl md:text-6xl">Promise</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            More than premium pants – an experience of elegance, confidence, and comfort
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto mb-12">
          {/* Cards Container */}
          <div className="flex items-center justify-center gap-6 perspective">
            {/* Left Card */}
            <div className="hidden lg:block w-1/4 opacity-40 scale-75">
              <div className={`relative h-80 rounded-3xl p-8 border-2 border-primary/20 bg-background/30 backdrop-blur-sm overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${visibleCards[0].bgGradient}`}></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-5xl mb-4">{visibleCards[0].icon}</div>
                  <h3 className="font-heading text-2xl font-bold text-foreground/50 mb-2">{visibleCards[0].title}</h3>
                  <p className="text-sm text-foreground/40 line-clamp-2">{visibleCards[0].description}</p>
                </div>
              </div>
            </div>

            {/* Center Card - Main Active */}
            <div className="w-full lg:w-1/2">
              <div className={`relative h-96 rounded-3xl p-10 border-0 overflow-hidden group cursor-pointer transition-all duration-500`}>
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${features[currentIndex].gradient} opacity-100 rounded-3xl`}></div>
                
                {/* Inner Content */}
                <div className="relative z-10 bg-background rounded-3xl h-full p-10 flex flex-col justify-between">
                  <div>
                    <div className="text-7xl mb-6">{features[currentIndex].icon}</div>
                    <h3 className="font-heading text-5xl font-black mb-4 text-foreground">
                      {features[currentIndex].title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {features[currentIndex].description}
                    </p>
                  </div>

                  {/* Accent Bar */}
                  <div className={`h-2 w-24 rounded-full ${features[currentIndex].accentColor}`}></div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white via-white to-transparent transition-opacity duration-500 rounded-3xl"></div>
              </div>
            </div>

            {/* Right Card */}
            <div className="hidden lg:block w-1/4 opacity-40 scale-75">
              <div className={`relative h-80 rounded-3xl p-8 border-2 border-primary/20 bg-background/30 backdrop-blur-sm overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${visibleCards[2].bgGradient}`}></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-5xl mb-4">{visibleCards[2].icon}</div>
                  <h3 className="font-heading text-2xl font-bold text-foreground/50 mb-2">{visibleCards[2].title}</h3>
                  <p className="text-sm text-foreground/40 line-clamp-2">{visibleCards[2].description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 lg:-translate-x-8 z-20 p-4 rounded-full glass-card hover:bg-primary/20 transition-all duration-300 hover:scale-110 group"
          >
            <ChevronLeft className="w-6 h-6 text-primary group-hover:scale-125 transition-transform" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 lg:translate-x-8 z-20 p-4 rounded-full glass-card hover:bg-primary/20 transition-all duration-300 hover:scale-110 group"
          >
            <ChevronRight className="w-6 h-6 text-primary group-hover:scale-125 transition-transform" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mb-16">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-500 rounded-full ${
                idx === currentIndex
                  ? `h-3 w-12 ${features[idx].accentColor} shadow-lg`
                  : 'h-3 w-3 bg-muted-foreground/40 hover:bg-muted-foreground/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative max-w-5xl mx-auto">
          {/* Gradient Border Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 rounded-3xl blur-2xl opacity-50"></div>

          <div className="relative bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border-2 border-primary/30 p-16 rounded-3xl text-center">
            <h3 className="font-heading text-5xl font-black mb-6 leading-tight">
              Experience <span className="text-gradient-gold">Tubhyam</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Premium quality, exceptional service, and your satisfaction guaranteed. Shop with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/shop"
                className="group px-12 py-4 bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 inline-block"
              >
                Explore Now
              </a>
              <a
                href="/video-call"
                className="px-12 py-4 border-2 border-primary text-primary rounded-full font-bold text-lg hover:bg-primary/10 transition-all duration-300 inline-block"
              >
                Free Styling
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTubhyam;
