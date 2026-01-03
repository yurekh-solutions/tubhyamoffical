import { Award, Heart, Truck, Shield, Users, Sparkles } from 'lucide-react';

const WhyChooseTubhyam = () => {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Handpicked fabrics and meticulous craftsmanship in every piece",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Heart,
      title: "Comfort First",
      description: "Designed for all-day wear without compromising on style",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick shipping with real-time tracking to your doorstep",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Safe payments and hassle-free returns within 30 days",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Personal Styling",
      description: "Video consultation with our style experts for perfect fit",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Sparkles,
      title: "Exclusive Collection",
      description: "Limited edition pieces not available anywhere else",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-widest text-sm mb-4 font-semibold">Why Choose Us</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-gradient-gold">Tubhyam Difference</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We believe in delivering more than just clothing. We deliver confidence, comfort, and elegance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Glass card */}
                <div className="relative backdrop-blur-xl bg-background/40 border border-primary/10 p-8 h-full flex flex-col group-hover:bg-background/60 transition-all duration-500">
                  {/* Icon */}
                  <div className={`inline-flex w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  {/* Decorative line */}
                  <div className="mt-6 w-0 h-1 bg-gradient-to-r from-primary to-primary/30 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="glass-card border border-primary/20 p-8 md:p-12 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-background/50 to-background/30">
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Join the Tubhyam Community
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Experience premium fashion that makes you feel confident, comfortable, and absolutely beautiful every single day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                Shop Now
              </a>
              <a
                href="/video-call"
                className="px-8 py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all duration-300"
              >
                Book Styling Session
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTubhyam;
