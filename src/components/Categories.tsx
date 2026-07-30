import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categories, products } from '@/data/products';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import jeans1 from '@/assets/products/jeans-8.jpg';
import trousers from '@/assets/Tracks/trousers.png';

const Categories = () => {
  const { isLight } = useTheme();
  const categoryImages = {
    formal: products.filter(p => p.category === 'formal')[0]?.image,
    jeans: jeans1,
    track: trousers,
  };

  const categoryGradients = {
    formal: 'from-amber-500/20 via-orange-500/10 to-transparent',
    jeans: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    track: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4 border border-primary/20">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Shop by Style</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold">
            Discover Your <span className="text-gradient-gold">Perfect Style</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium women's pants designed for every occasion and lifestyle
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link
                to={`/products?category=${category.id}`}
                className="group relative block h-[450px] sm:h-[500px] overflow-hidden rounded-3xl"
              >
                {/* Image Container with Zoom Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 product-image-zoom transition-transform duration-700 group-hover:scale-110">
                    <img
                      src={categoryImages[category.id as keyof typeof categoryImages]}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Gradient Overlay with Color Coding */}
                <div className={`absolute inset-0 bg-gradient-to-t ${categoryGradients[category.id as keyof typeof categoryGradients]} group-hover:opacity-80 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-500" />

                {/* Glass Card Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 backdrop-blur-[2px]" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 border border-white/20" style={{ background: 'linear-gradient(135deg, hsl(25 15% 12% / 0.8) 0%, hsl(25 15% 12% / 0.4) 100%)', backdropFilter: 'blur(20px)' }}>
                      <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                        {category.description}
                      </span>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    
                    {/* Product Count */}
                    <p className="text-sm text-white/70 mb-6">
                      {products.filter(p => p.category === category.id).length} styles available
                    </p>
                    
                    {/* CTA Button */}
                    <div className="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <span className="text-base">Explore Collection</span>
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Decorative Corner Accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/40 transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Link
            to="/shop"
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 ${
              isLight
                ? 'bg-[#E8652B]/20 backdrop-blur-xl border border-[#E8652B]/30 text-[#3B2A1A] hover:bg-[#E8652B]/30 hover:border-[#E8652B]/50 shadow-lg shadow-[#E8652B]/10'
                : 'glass-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
