import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories, getProductsByCategory } from '@/data/products';

const Categories = () => {
  const categoryImages = {
    formal: getProductsByCategory('formal')[0]?.image,
    jeans: getProductsByCategory('jeans')[0]?.image,
    track: getProductsByCategory('track')[0]?.image,
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-heading text-4xl sm:text-5xl font-semibold">
            Shop by <span className="text-gradient-gold">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our curated collection of women's pants designed for every occasion
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative h-96 overflow-hidden rounded-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="absolute inset-0 product-image-zoom">
                <img
                  src={categoryImages[category.id as keyof typeof categoryImages]}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent group-hover:from-background/90 transition-all duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm text-primary uppercase tracking-widest mb-2">{category.description}</p>
                <h3 className="font-heading text-3xl font-semibold mb-4">{category.name}</h3>
                <div className="flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Shop Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Glass Border Effect */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/30 transition-colors duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
