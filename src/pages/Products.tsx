import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { useProducts, SortOption } from '@/hooks/useProducts';
import { usePagination } from '@/hooks/usePagination';
import { categories } from '@/data/products';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const categoryParam = searchParams.get('category') as 'formal' | 'jeans' | 'track' | null;
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'formal' | 'jeans' | 'track'>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const { products, totalCount } = useProducts({
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

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="py-8 md:py-12 border-b border-border">
        <div className="container mx-auto px-2 md:px-4">
          <div className="max-w-2xl">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-4">
              {selectedCategory === 'all' ? (
                <>Our <span className="text-gradient-gold">Collection</span></>
              ) : (
                <><span className="text-gradient-gold capitalize">{selectedCategory}</span> Pants</>
              )}
            </h1>
            {searchQuery && (
              <p className="text-muted-foreground">
                Search results for "{searchQuery}"
              </p>
            )}
            <p className="text-muted-foreground mt-2">
              Showing {(currentPage - 1) * 15 + 1} to {Math.min(currentPage * 15, totalCount)} of {totalCount} {totalCount === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-2 md:px-4 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass-card p-6 sticky top-32 space-y-6">
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
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 glass-card px-4 py-2 rounded-lg text-sm font-medium"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="relative ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-secondary/50 border border-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>

            {/* Products Grid */}
            {paginatedItems.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
                  {paginatedItems.map((product, index) => (
                    <div 
                      key={product.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
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
