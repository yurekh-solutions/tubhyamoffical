import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import PageLoader from '@/components/PageLoader';
import { useProducts, SortOption } from '@/hooks/useProducts';
import { usePagination } from '@/hooks/usePagination';
import { categories } from '@/data/products';
import { useTheme } from '@/context/ThemeContext';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isLight } = useTheme();
  
  const categoryParam = searchParams.get('category') as 'formal' | 'jeans' | 'track' | null;
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'formal' | 'jeans' | 'track'>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const { products, totalCount, isLoading, error } = useProducts({
    category: selectedCategory,
    searchQuery,
    sortBy,
    priceRange,
  });

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    canGoPrev,
    canGoNext,
  } = usePagination({
    items: products,
    itemsPerPage: 15,
  });

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('featured');
    setPriceRange([0, 10000]);
    setSearchParams({});
  };

  const categoryTitle = categoryParam 
    ? categories.find(c => c.id === categoryParam)?.name || 'All Products'
    : 'All Products';

  return (
    <div className="min-h-screen">
      <SEO
        title={`Shop ${categoryTitle} | Tubhyam - Premium Women's Fashion`}
        description={`Browse Tubhyam's ${categoryTitle.toLowerCase()} collection. Premium quality formal trousers, wide-leg pants, baggy pleated pants, belt formal pants, cargo pants, jeans, and track pants. Free shipping on orders ₹2000+. Shop now at tubhyam.in!`}
        keywords={`shop ${categoryTitle.toLowerCase()}, buy ${categoryTitle.toLowerCase()} online, ${categoryTitle.toLowerCase()} for women, women's ${categoryTitle.toLowerCase()} India, best ${categoryTitle.toLowerCase()} brand, premium ${categoryTitle.toLowerCase()} online, cheap ${categoryTitle.toLowerCase()} India, ${categoryTitle.toLowerCase()} online shopping`}
        url="https://www.tubhyam.in/shop"
        breadcrumbItems={[
          { name: 'Shop', url: 'https://www.tubhyam.in/shop' },
          ...(categoryParam ? [{ name: categoryTitle, url: `https://www.tubhyam.in/shop?category=${categoryParam}` }] : [])
        ]}
      />
      <Navbar />

      {/* Page Header */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4 mt-6 text-center">
          <p className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2 font-medium">The Collection</p>
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold mb-2">
            {selectedCategory === 'all' ? 'Shop All Pants' : (
              <>{selectedCategory === 'formal' ? 'Formal Pants' : selectedCategory === 'jeans' ? 'Jeans Collection' : 'Track Pants'}</>
            )}
          </h1>
          <div className={`w-12 h-0.5 mx-auto mb-3 ${isLight ? 'bg-[#BA7336]' : 'bg-primary'}`} />
          <p className="text-muted-foreground text-xs md:text-base max-w-lg mx-auto">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : 'Premium women\'s pants — crafted for comfort, designed for elegance.'
            }
          </p>
        </div>
      </section>

      <div className="container mx-auto px-2 md:px-4 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className={`p-6 sticky top-32 space-y-6 rounded-xl border ${
              isLight ? 'bg-white border-gray-200 shadow-sm' : 'glass-card'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Category</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${
                      selectedCategory === 'all' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Price Range</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar: Filter Pills + Sort */}
            <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 ${
                  isLight ? 'bg-white border border-gray-200' : 'glass-card'
                }`}
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>

              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? isLight ? 'bg-[#2E241F] text-white' : 'bg-primary text-primary-foreground'
                    : isLight ? 'bg-white text-[#2E241F] border border-gray-200' : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? isLight ? 'bg-[#2E241F] text-white' : 'bg-primary text-primary-foreground'
                      : isLight ? 'bg-white text-[#2E241F] border border-gray-200' : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {cat.name}
                </button>
              ))}

              {/* Spacer + Sort */}
              <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">{totalCount} items</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className={`appearance-none rounded-full px-3 py-1.5 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      isLight ? 'bg-white border border-gray-200 text-[#2E241F]' : 'bg-secondary/50 border border-border'
                    }`}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low-High</option>
                    <option value="price-desc">Price: High-Low</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <PageLoader message="Loading collection" />
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive text-lg mb-4">{error}</p>
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : paginatedItems.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                  {paginatedItems.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <ProductCard product={product} priority={index < 4} />
                    </div>
                  ))}
                </div>

                {/* Pagination Component */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-4">No products found</p>
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
        <div className={`absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto transition-transform duration-500 ${
          isFilterOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-xl font-semibold">Filters</h3>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-4 mb-6">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Category</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { handleCategoryChange('all'); setIsFilterOpen(false); }}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { handleCategoryChange(cat.id); setIsFilterOpen(false); }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Price Range</h4>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>

          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
