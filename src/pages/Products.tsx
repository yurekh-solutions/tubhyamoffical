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
import { categories, dressSubcategories, topsSubcategories } from '@/data/products';
import { useTheme } from '@/context/ThemeContext';
import { ChevronDown } from 'lucide-react';

const bannerHeadings: Record<string, string> = {
  all:     'Shop All',
  formal:  'Formal Pants',
  jeans:   'Jeans',
  track:   'Track Pants',
  dresses: 'Dresses',
  coords:  'Co-ord Sets',
  tops:    'Tops',
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLight } = useTheme();
  
  const categoryParam = searchParams.get('category') as 'formal' | 'jeans' | 'track' | 'dresses' | 'coords' | 'tops' | null;
  const subParam = searchParams.get('sub');
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'formal' | 'jeans' | 'track' | 'dresses' | 'coords' | 'tops'>(categoryParam || 'all');
  const [selectedSub, setSelectedSub] = useState<string | null>(subParam);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const { products, totalCount, isLoading, error } = useProducts({
    category: selectedCategory,
    subcategory: selectedSub || undefined,
    searchQuery,
    sortBy,
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

  useEffect(() => {
    setSelectedSub(subParam);
  }, [subParam]);

  const handleCategoryChange = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    // Subcategory chips apply to dresses & tops — reset when leaving those categories
    if (category !== 'dresses' && category !== 'tops') {
      searchParams.delete('sub');
      setSelectedSub(null);
    }
    setSearchParams(searchParams);
  };

  const handleSubChange = (sub: string | null) => {
    setSelectedSub(sub);
    if (sub) {
      searchParams.set('sub', sub);
    } else {
      searchParams.delete('sub');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSub(null);
    setSortBy('featured');
    setSearchParams({});
  };

  const categoryTitle = selectedCategory === 'all'
    ? 'All Products'
    : categories.find(c => c.id === selectedCategory)?.name || 'All Products';

  // Style sub-navigation source for the current category (chips row under the tabs)
  const activeSubcats: readonly { id: string; name: string }[] | null =
    selectedCategory === 'dresses' ? dressSubcategories
      : selectedCategory === 'tops' ? topsSubcategories
        : null;

  return (
    <div className="min-h-screen">
      <SEO
        title={`Shop ${categoryTitle} | Tubhyam - Premium Women's Fashion`}
        description={`Browse Tubhyam's ${categoryTitle.toLowerCase()} collection. Premium quality formal trousers, wide-leg pants, baggy pleated pants, belt formal pants, cargo pants, jeans, track pants, women's dresses and co-ord sets. Complimentary shipping on orders ₹2000+. Shop now at tubhyam.in!`}
        keywords={`shop ${categoryTitle.toLowerCase()}, buy ${categoryTitle.toLowerCase()} online, ${categoryTitle.toLowerCase()} for women, women's ${categoryTitle.toLowerCase()} India, best ${categoryTitle.toLowerCase()} brand, premium ${categoryTitle.toLowerCase()} online, cheap ${categoryTitle.toLowerCase()} India, ${categoryTitle.toLowerCase()} online shopping`}
        url="https://www.tubhyam.in/shop"
        breadcrumbItems={[
          { name: 'Shop', url: 'https://www.tubhyam.in/shop' },
          ...(categoryParam ? [{ name: categoryTitle, url: `https://www.tubhyam.in/shop?category=${categoryParam}` }] : [])
        ]}
      />
      <Navbar />

      {/* Clean minimal hero — no bulky image cover */}
      <section className={`w-full py-10 sm:py-14 md:py-16 ${isLight ? 'bg-[#FAF5EF]' : 'bg-[#0F0D0B]'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-[10px] md:text-[11px] uppercase tracking-[0.35em] mb-3 ${isLight ? 'text-[#9B8E82]' : 'text-white/40'}`}>
            The Collection
          </p>
          <h1 className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.02em] ${isLight ? 'text-[#2E241F]' : 'text-white/90'}`}>
            {bannerHeadings[selectedCategory] || 'Shop All'}
          </h1>
          <div className={`flex items-center justify-center gap-3 mt-4 ${isLight ? 'text-[#C9A882]' : 'text-white/25'}`}>
            <span className="w-8 h-px bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-8 h-px bg-current" />
          </div>
          <p className={`text-xs md:text-sm mt-3 max-w-md mx-auto tracking-wide ${isLight ? 'text-[#9B8E82]' : 'text-white/40'}`}>
            Crafted for comfort, designed for elegance.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-8 md:pt-10 pb-8 md:pb-12">

        {/* Category navigation — editorial underline tabs */}
        <nav className={`flex items-center gap-5 md:gap-7 overflow-x-auto scrollbar-hide pb-px border-b ${
          isLight ? 'border-gray-200/70' : 'border-white/10'
        }`}>
          <button
            onClick={() => handleCategoryChange('all')}
            className={`relative pb-3 text-[13px] md:text-sm tracking-[0.03em] whitespace-nowrap transition-colors flex-shrink-0 ${
              selectedCategory === 'all'
                ? `font-medium ${isLight ? 'text-[#2E241F]' : 'text-white/90'}`
                : `font-normal ${isLight ? 'text-[#9B8E82] hover:text-[#5A4E42]' : 'text-white/40 hover:text-white/70'}`
            }`}
          >
            All
            {selectedCategory === 'all' && (
              <span className={`absolute left-0 right-0 bottom-0 h-[1.5px] ${isLight ? 'bg-[#2E241F]' : 'bg-white/60'}`} />
            )}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`relative pb-3 text-[13px] md:text-sm tracking-[0.03em] whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCategory === cat.id
                  ? `font-medium ${isLight ? 'text-[#2E241F]' : 'text-white/90'}`
                  : `font-normal ${isLight ? 'text-[#9B8E82] hover:text-[#5A4E42]' : 'text-white/40 hover:text-white/70'}`
              }`}
            >
              {cat.name}
              {selectedCategory === cat.id && (
                <span className={`absolute left-0 right-0 bottom-0 h-[1.5px] ${isLight ? 'bg-[#2E241F]' : 'bg-white/60'}`} />
              )}
            </button>
          ))}
        </nav>

        {/* Dresses / Tops — style sub-navigation */}
        {activeSubcats && (
          <div className="flex items-center gap-5 md:gap-6 overflow-x-auto scrollbar-hide pt-3">
            <button
              onClick={() => handleSubChange(null)}
              className={`relative pb-2 text-[11px] md:text-xs tracking-[0.05em] uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                !selectedSub
                  ? `font-medium ${isLight ? 'text-[#2E241F]' : 'text-white/90'}`
                  : `font-normal ${isLight ? 'text-[#9B8E82] hover:text-[#5A4E42]' : 'text-white/40 hover:text-white/70'}`
              }`}
            >
              All {selectedCategory === 'dresses' ? 'Dresses' : 'Tops'}
              {!selectedSub && (
                <span className={`absolute left-0 right-0 bottom-0 h-[1px] ${isLight ? 'bg-[#2E241F]/60' : 'bg-white/30'}`} />
              )}
            </button>
            {activeSubcats.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubChange(sub.id)}
                className={`relative pb-2 text-[11px] md:text-xs tracking-[0.05em] uppercase whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedSub === sub.id
                    ? `font-medium ${isLight ? 'text-[#2E241F]' : 'text-white/90'}`
                    : `font-normal ${isLight ? 'text-[#9B8E82] hover:text-[#5A4E42]' : 'text-white/40 hover:text-white/70'}`
                }`}
              >
                {sub.name}
                {selectedSub === sub.id && (
                  <span className={`absolute left-0 right-0 bottom-0 h-[1px] ${isLight ? 'bg-[#2E241F]/60' : 'bg-white/30'}`} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Count + Sort */}
        <div className="flex items-center justify-between gap-4 mt-5 md:mt-7 mb-5 md:mb-7">
          <div className="min-w-0">
            <p className={`text-[10px] md:text-[11px] uppercase tracking-[0.3em] ${
              isLight ? 'text-[#9B8E82]' : 'text-white/35'
            }`}>
              {totalCount} {totalCount === 1 ? 'Product' : 'Products'}
            </p>
            {searchQuery && (
              <p className={`text-xs md:text-sm mt-1 ${isLight ? 'text-[#7A6E62]' : 'text-white/45'}`}>Search results for "{searchQuery}"</p>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={`appearance-none bg-transparent pr-5 text-[11px] md:text-xs tracking-[0.05em] cursor-pointer focus:outline-none ${
                isLight ? 'text-[#5A4E42]' : 'text-white/60'
              }`}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low – High</option>
              <option value="price-desc">Price: High – Low</option>
              <option value="name-asc">Name: A – Z</option>
            </select>
            <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-5 md:gap-y-8">
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
      </div>

      <Footer />
    </div>
  );
};

export default Products;
