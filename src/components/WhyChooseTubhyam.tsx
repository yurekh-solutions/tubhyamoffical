import { useState, useEffect } from 'react';

const WhyChooseTubhyam = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Rotate through features every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Custom SVG Icons matching brand aesthetic
  const CustomIcons = {
    Premium: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 fill-current">
        <path d="M32 8L42 18V50C42 54.4 38.4 58 34 58H30C25.6 58 22 54.4 22 50V18L32 8Z" />
        <path d="M32 8L22 18L28 24L32 20L36 24L42 18L32 8Z" />
        <circle cx="32" cy="35" r="4" className="fill-white opacity-50" />
      </svg>
    ),
    Comfort: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 fill-current">
        <path d="M20 28C20 20.3 26.3 14 34 14C41.7 14 48 20.3 48 28V52H20V28Z" />
        <path d="M24 28C24 23.6 27.6 20 32 20C36.4 20 40 23.6 40 28" />
        <circle cx="32" cy="40" r="3" className="fill-white opacity-60" />
      </svg>
    ),
    Delivery: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 fill-current">
        <path d="M12 34H52V48C52 50.2 50.2 52 48 52H16C13.8 52 12 50.2 12 48V34Z" />
        <path d="M12 28H18L24 16H44L50 28H52" />
        <circle cx="20" cy="46" r="4" />
        <circle cx="44" cy="46" r="4" />
      </svg>
    ),
    Security: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 fill-current">
        <path d="M32 10L16 18V34C16 46 32 56 32 56C32 56 48 46 48 34V18L32 10Z" />
        <path d="M28 36L24 32L22 34L28 40L42 26L40 24L28 36Z" />
      </svg>
    ),
    Styling: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 fill-current">
        <circle cx="32" cy="18" r="6" />
        <path d="M24 26H40L36 44H28L24 26Z" />
        <path d="M20 44L18 56H46L44 44" />
      </svg>
    ),
    Exclusive: (
      <svg viewBox="0 0 64 64" className="w-8 h-8 fill-current">
        <path d="M32 10L38 26H55L42 35L48 51L32 42L16 51L22 35L9 26H26L32 10Z" />
        <circle cx="48" cy="20" r="3" className="fill-white opacity-60" />
      </svg>
    )
  };

  const features = [
    {
      icon: "Premium",
      title: "Premium Quality",
      description: "Handpicked fabrics and meticulous craftsmanship in every piece",
      gradient: "from-amber-500 to-orange-500",
      lightGradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: "Comfort",
      title: "Comfort First",
      description: "Designed for all-day wear without compromising on style",
      gradient: "from-rose-500 to-pink-500",
      lightGradient: "from-rose-500/20 to-pink-500/20"
    },
    {
      icon: "Delivery",
      title: "Fast Delivery",
      description: "Quick shipping with real-time tracking to your doorstep",
      gradient: "from-blue-500 to-cyan-500",
      lightGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: "Security",
      title: "Secure Shopping",
      description: "Safe payments and hassle-free returns within 30 days",
      gradient: "from-green-500 to-emerald-500",
      lightGradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: "Styling",
      title: "Personal Styling",
      description: "Video consultation with our style experts for perfect fit",
      gradient: "from-purple-500 to-violet-500",
      lightGradient: "from-purple-500/20 to-violet-500/20"
    },
    {
      icon: "Exclusive",
      title: "Exclusive Collection",
      description: "Limited edition pieces not available anywhere else",
      gradient: "from-indigo-500 to-blue-500",
      lightGradient: "from-indigo-500/20 to-blue-500/20"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-primary uppercase tracking-widest text-sm mb-4 font-semibold">Why Tubhyam</p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            The <span className="text-gradient-gold">Tubhyam Promise</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            More than just premium pants – we deliver an experience of confidence, comfort, and elegance tailored to your unique lifestyle.
          </p>
        </div>

        {/* Features Grid with Sync Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = CustomIcons[feature.icon as keyof typeof CustomIcons];
            const isActive = index === activeIndex;
            
            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  isActive ? 'lg:scale-105' : ''
                }`}
              >
                {/* Animated glow background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur`}></div>

                {/* Active indicator ring */}
                {isActive && (
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-30 animate-pulse`}></div>
                )}

                {/* Glass Card */}
                <div className={`relative backdrop-blur-xl border rounded-2xl p-8 h-full flex flex-col transition-all duration-500 ${
                  isActive
                    ? `bg-gradient-to-br ${feature.lightGradient} border-primary/40`
                    : 'bg-background/40 border-primary/10 hover:border-primary/30 group-hover:bg-background/60'
                }`}>
                  {/* Icon Container with sync animation */}
                  <div className={`relative mb-8 flex items-center justify-center`}>
                    <div className={`inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} items-center justify-center transition-all duration-500 ${
                      isActive ? 'shadow-2xl shadow-current/50 scale-110' : 'group-hover:scale-110'
                    }`}>
                      <div className="text-white drop-shadow-lg">
                        {IconComponent}
                      </div>
                    </div>
                    
                    {/* Sync pulse animation for active */}
                    {isActive && (
                      <>
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} animate-ping opacity-30`}></div>
                        <div className={`absolute inset-4 rounded-xl bg-gradient-to-br ${feature.gradient} animate-pulse opacity-20`}></div>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`font-heading text-2xl font-bold mb-3 transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'
                  }`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed flex-1 transition-colors duration-300 ${
                    isActive ? 'text-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {feature.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-6 flex gap-2">
                    <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${feature.gradient} transition-all duration-500 ${
                      isActive ? 'opacity-100 w-full' : 'opacity-0 w-0'
                    }`}></div>
                    <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${feature.gradient} opacity-30`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mb-16">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === activeIndex
                  ? 'w-8 h-2 bg-gradient-to-r from-primary to-primary/70'
                  : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
              }`}
              aria-label={`Feature ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-3xl blur-2xl opacity-50"></div>
          
          <div className="relative glass-card border border-primary/30 p-12 md:p-16 rounded-3xl backdrop-blur-xl bg-gradient-to-r from-background/50 via-background/40 to-background/50 text-center">
            <h3 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Join <span className="text-gradient-gold">Thousands</span> of Satisfied Customers
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Experience the Tubhyam difference today. Premium quality, exceptional service, and your satisfaction guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="group px-10 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 inline-block"
              >
                Shop Collection
              </a>
              <a
                href="/video-call"
                className="px-10 py-4 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all duration-300 inline-block"
              >
                Free Styling Session
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTubhyam;
