import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import PageLoader from './PageLoader';
import { getBestSellers, getNewArrivals, Product } from '@/data/products';

interface FeaturedProductsProps {
  type?: 'bestsellers' | 'new';
}

const FeaturedProducts = ({ type = 'bestsellers' }: FeaturedProductsProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = type === 'bestsellers'
          ? await getBestSellers()
          : await getNewArrivals();
        if (!cancelled) setAllProducts(data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [type]);
  
  // Filter and prioritize: Formal, Jeans, Track. Exclude Joggers.
  const filteredProducts = allProducts.filter(p => !p.name.toLowerCase().includes('jogger'));

  const prioritizedProducts = [
    ...filteredProducts.filter(p => p.category === 'formal'),
    ...filteredProducts.filter(p => p.category === 'jeans'),
    ...filteredProducts.filter(p => p.category === 'track')
  ];

  // Remove duplicates while maintaining order
  const displayProducts = Array.from(new Set(prioritizedProducts)).slice(0, 4);

  const title = type === 'bestsellers' ? 'Best Sellers' : 'New Arrivals';
  const subtitle = type === 'bestsellers' 
    ? 'Our most loved styles, handpicked for you'
    : 'Discover the latest additions to our collection';

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div className="space-y-2">
            <h2 className="font-heading text-4xl sm:text-5xl font-semibold">
              {title.split(' ')[0]} <span className="text-gradient-gold">{title.split(' ')[1]}</span>
            </h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <Link 
            to="/products"
            className="group inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
          >
            View All
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <PageLoader message={`Loading ${type === 'bestsellers' ? 'best sellers' : 'new arrivals'}`} minHeight="300px" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} priority={index < 2} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
