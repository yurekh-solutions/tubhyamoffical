import { ArrowRight, Award, Heart, Zap, Users, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const About = () => {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "100% carefully curated fabrics with expert craftsmanship"
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Quick & reliable shipping across India"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Dedicated customer support team ready to assist"
    },
    {
      icon: Leaf,
      title: "Sustainable",
      description: "Ethical production and eco-conscious practices"
    },
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every piece crafted with passion and care"
    }
  ];

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-gradient-gold mb-6 leading-tight">
              Our Story
            </h1>
            <h2 className="text-3xl md:text-5xl font-heading font-semibold text-foreground/90 mb-8">
              Crafted For The Modern Woman
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
              Tubhyam – meaning "For You" in Sanskrit – was born from a passion for creating clothing that celebrates the modern Indian woman. Every piece in our collection is thoughtfully designed to blend timeless elegance with contemporary style.
            </p>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
              We believe that great fashion should be accessible, comfortable, and empowering. Our premium fabrics and meticulous craftsmanship ensure that every Tubhyam piece becomes a wardrobe essential you'll reach for again and again.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              Read Our Blog <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>

        {/* Mission & Values Section */}
        <section className="container mx-auto px-4 py-20 border-y border-primary/20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-heading font-bold text-center mb-16 text-gradient-gold"
          >
            Our Mission & Values
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="glass-card p-8 border border-primary/30 rounded-xl hover:border-primary/50 transition-colors"
            >
              <h3 className="text-3xl font-heading font-bold mb-4 text-primary flex items-center gap-2">
                <Award size={28} /> Our Mission
              </h3>
              <p className="text-foreground/80 leading-relaxed mb-6">
                We believe that every woman deserves clothing that makes her feel confident and beautiful. Our mission is to provide premium quality pants that blend traditional sensibilities with contemporary fashion.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground/80">Premium quality materials and craftsmanship</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground/80">Inclusive sizing for all body types</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground/80">Sustainable and ethical production</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="glass-card p-8 border border-primary/30 rounded-xl hover:border-primary/50 transition-colors"
            >
              <h3 className="text-3xl font-heading font-bold mb-4 text-primary flex items-center gap-2">
                <Heart size={28} /> Our Values
              </h3>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Quality, authenticity, and customer satisfaction are at the heart of everything we do. We're committed to creating pieces that last, styles that inspire, and experiences that matter.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground/80">Customer-first approach</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground/80">Innovative and trendy designs</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground/80">Commitment to excellence</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us - Enhanced */}
        <section className="container mx-auto px-4 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-heading font-bold text-center mb-16 text-gradient-gold"
          >
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 text-center border border-primary/30 rounded-xl hover:border-primary/60 hover:shadow-elegant transition-all"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                    <IconComponent size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Journey Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-heading font-bold text-center mb-12 text-gradient-gold"
          >
            Our Journey
          </motion.h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { year: "2026", title: "The Beginning", description: "Tubhyam was founded with a vision to bring premium women's fashion to every Indian wardrobe." },
              { year: "2026", title: "First Collection", description: "Launched our inaugural collection of premium pants — formal, jeans, and track pants." },
              { year: "2026", title: "Growing Community", description: "Building a loyal customer base across India with quality, trust, and style." }
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="glass-card p-6 border border-primary/30 rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/30">
                    <span className="text-lg font-bold text-primary">{milestone.year}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{milestone.title}</h3>
                    <p className="text-foreground/70">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center max-w-2xl mx-auto border border-primary/30 rounded-xl"
          >
            <h2 className="text-3xl font-heading font-bold mb-6 text-foreground">Explore Our Collection</h2>
            <p className="text-foreground/80 mb-8 text-lg">
              Discover the perfect pair of pants that celebrates your unique style and personality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Shop Now
              </Link>
              <Link
                to="/blog"
                className="inline-block px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg font-semibold transition-all duration-300"
              >
                Read Our Blog
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
