import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Menu, X, Instagram, Phone, MapPin, Sun, Moon, MessageCircle, Heart, ArrowLeft, TrendingUp, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTheme } from '@/context/ThemeContext';
import logo from '@/assets/looo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { theme, toggleTheme, isLight } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'Lookbook', path: '/lookbook' },
    { name: 'World of Tubhyam', path: '/world-of-tubhyam' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Announcement Banner — Marquee Ticker */}
      <div className={`fixed top-0 left-0 right-0 z-[60] overflow-hidden text-white text-[10px] sm:text-xs tracking-wide ${
        isLight ? 'bg-[#2E241F]' : 'bg-[#1A1410]'
      }`}>
        <div className="flex items-center py-1.5 sm:py-2 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {/* Content repeated twice for seamless loop */}
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 sm:gap-8 px-4">
              <span>CASH ON DELIVERY AVAILABLE</span>
              <span className="text-white/30">•</span>
              <span className="font-semibold text-[#FFD3AC]">NEW ARRIVALS EVERY WEEK</span>
              <span className="text-white/30">•</span>
              <a href="https://wa.me/917039382706" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green-300 transition-colors">
                <MessageCircle size={11} className="sm:w-3 sm:h-3" />
                <span>WHATSAPP +91 70393 82706</span>
              </a>
              <span className="text-white/30">•</span>
              <span>FREE SHIPPING ON ALL ORDERS</span>
              <span className="text-white/30">•</span>
              <a href="https://www.instagram.com/tubhyamofficial/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-pink-300 transition-colors">
                <Instagram size={12} />
                <span>@tubhyamofficial</span>
              </a>
              <span className="text-white/30">•</span>
              <span>FLAT 20% OFF — CODE: TUBHYAM20</span>
              <span className="text-white/30">•</span>
            </div>
          ))}
        </div>
      </div>

      <nav 
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? `${isLight ? 'bg-white/95' : 'bg-background/95'} border-b border-border shadow-glass` 
            : isLight ? 'bg-white backdrop-blur-sm' : 'bg-background/90 backdrop-blur-sm'
        }`}
        style={{ top: '28px' }}
      >


        {/* Main nav */}
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile menu button - Left */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-secondary/50 rounded-lg transition-colors flex-shrink-0"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Left side next to hamburger */}
            <Link 
              to="/" 
              className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0"
            >
              <img 
                src={logo} 
                alt="Tubhyam" 
                className={`h-8 w-8 sm:h-12 sm:w-12 object-cover rounded-md ${
                  isLight ? 'brightness-[0.3] sepia' : ''
                }`} 
              />
              <div>
                <h1 className={`font-heading text-sm sm:text-2xl font-semibold whitespace-nowrap leading-tight ${
                  isLight ? 'text-[#2E1A0E]' : 'text-gradient-gold'
                }`}>Tubhyam</h1>
                <p className={`text-[7px] sm:text-[10px] tracking-widest whitespace-nowrap ${
                  isLight ? 'text-[#4A3228]' : 'text-muted-foreground'
                }`}>तुम्हारे लिए</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8 mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`link-underline text-sm font-medium tracking-wide transition-colors ${
                    location.pathname === link.path || location.pathname + location.search === link.path
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions - Right side with margin-left auto to push to right */}
            <div className="flex items-center gap-1 sm:gap-3 ml-auto flex-shrink-0">
              {/* Search - Hidden on mobile, shown on desktop */}
              <div className="hidden md:flex items-center gap-2">
                <form
                  onSubmit={handleSearch}
                  className="w-48 lg:w-64"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-secondary/80 backdrop-blur border border-border rounded-full
                               pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2
                               focus:ring-primary/50 animate-fade-in"
                    autoFocus
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                </form>

                <button
                  onClick={handleSearch}
                  className="p-2 hover:bg-secondary/50 border border-border rounded-full transition-colors flex items-center justify-center"
                  type="submit"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-1.5 sm:p-2 hover:bg-secondary/50 rounded-full transition-colors flex-shrink-0"
              >
                <Search size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 hover:bg-secondary/50 rounded-full transition-all duration-300 flex-shrink-0"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon size={18} className="sm:w-5 sm:h-5 transition-transform duration-300" />
                ) : (
                  <Sun size={18} className="sm:w-5 sm:h-5 transition-transform duration-300" />
                )}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-1.5 sm:p-2 hover:bg-secondary/50 rounded-full transition-colors flex-shrink-0"
              >
                <Heart size={18} className="sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium animate-scale-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-1.5 sm:p-2 hover:bg-secondary/50 rounded-full transition-colors flex-shrink-0"
              >
                <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search - Full Screen Overlay */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 z-[100] animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsSearchOpen(false)} 
          />
          
          {/* Search Panel */}
          <div className={`relative h-full flex flex-col ${
            isLight ? 'bg-white' : 'bg-[#1A1410]'
          } animate-in slide-in-from-top duration-300`}>
            {/* Search Header */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b ${
              isLight ? 'border-gray-200' : 'border-white/10'
            }`}>
              <button
                onClick={() => setIsSearchOpen(false)}
                className={`p-2 rounded-full transition-colors ${
                  isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                }`}
              >
                <ArrowLeft size={22} />
              </button>
              
              <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className={`w-full py-2.5 pl-4 pr-12 rounded-xl text-base focus:outline-none ${
                    isLight 
                      ? 'bg-gray-100 placeholder:text-gray-400' 
                      : 'bg-white/10 placeholder:text-white/40'
                  }`}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              {/* Quick Links */}
              <div className="mb-6">
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                  isLight ? 'text-gray-500' : 'text-white/50'
                }`}>Quick Links</h3>
                <div className="flex flex-wrap gap-2">
                  {['Formal Pants', 'Jeans', 'Track Pants', 'New Arrivals', 'Best Sellers'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        window.location.href = `/shop?search=${encodeURIComponent(term)}`;
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isLight
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-white/10 hover:bg-white/20 text-white/80'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Searches */}
              <div className="mb-6">
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                  isLight ? 'text-gray-500' : 'text-white/50'
                }`}>
                  <TrendingUp size={14} />
                  Trending Searches
                </h3>
                <div className="space-y-1">
                  {['Wide Leg Trousers', 'Cargo Pants', 'Palazzo', 'Belt Formal Pants', 'Vintage Jeans'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        window.location.href = `/shop?search=${encodeURIComponent(term)}`;
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        isLight
                          ? 'hover:bg-gray-100 text-gray-700'
                          : 'hover:bg-white/5 text-white/80'
                      }`}
                    >
                      <Search size={16} className={isLight ? 'text-gray-400' : 'text-white/30'} />
                      <span className="text-sm">{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shop by Category */}
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                  isLight ? 'text-gray-500' : 'text-white/50'
                }`}>Shop by Category</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Formal', emoji: '👔', path: '/shop?category=formal' },
                    { name: 'Jeans', emoji: '👖', path: '/shop?category=jeans' },
                    { name: 'Track Pants', emoji: '🏃', path: '/shop?category=track' },
                    { name: 'All Products', emoji: '🛍️', path: '/shop' },
                  ].map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setIsSearchOpen(false)}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                        isLight
                          ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className={`text-sm font-medium ${
                        isLight ? 'text-gray-700' : 'text-white/80'
                      }`}>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Safe Area */}
            <div className={`px-4 py-3 border-t ${
              isLight ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-black/20'
            }`}>
              <p className={`text-xs text-center ${
                isLight ? 'text-gray-500' : 'text-white/40'
              }`}>
                Press enter to search • Tap outside to close
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-20 left-0 right-0 bg-card border-b border-border p-6 transition-transform duration-500 ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-heading py-2 border-b border-border/50 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/track-order"
              className="text-lg font-heading py-2 border-b border-border/50 hover:text-primary transition-colors flex items-center gap-2"
            >
              <MapPin size={16} />
              Track Order
            </Link>
            <div className="flex items-center gap-4 pt-4">
              <a 
                href="https://www.instagram.com/tubhyamofficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={18} />
                <span className="text-sm">@tubhyamofficial</span>
              </a>
            </div>
            <a 
              href="tel:+917039382706" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone size={18} />
              <span className="text-sm">+91 70393 82706</span>
            </a>
          </div>
        </div>
      </div>

      {/* Spacer for announcement banner + navbar */}
      <div className="h-[64px] sm:h-[72px] md:h-[80px]" />
    </>
  );
};

export default Navbar;
