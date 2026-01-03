import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, Instagram, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import logo from '@/assets/looo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { totalItems } = useCart();

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
    { name: 'Shop', path: '/products' },
    { name: 'Collections', path: '/collections' },
    { name: 'Lookbook', path: '/lookbook' },
    { name: 'World of Tubhyam', path: '/world-of-tubhyam' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-glass' 
            : 'bg-transparent'
        }`}
      >
        {/* Top bar */}
        <div className="hidden md:block border-b border-border/50 bg-secondary/30">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center text-xs">
           
          <div></div>
             <div className="flex  gap-4">
              <a 
                href="https://www.instagram.com/tubhyamofficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={14} />
                <span>@tubhyamofficial</span>
              </a>
              
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 bg-transparent">
              <img src={logo} alt="Tubhyam" className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-md" />
              <div className="hidden xs:block sm:block">
                <h1 className="font-heading text-lg sm:text-2xl font-semibold text-gradient-gold">Tubhyam</h1>
                <p className="text-[8px] sm:text-[10px] text-muted-foreground tracking-widest">तुम्हारे लिए</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
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

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
  {/* Search */}
  <div className="flex items-center gap-2">
    <form
      onSubmit={handleSearch}
      className="w-48 sm:w-64"
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

  {/* Cart */}
  <Link
    to="/cart"
    className="relative p-2 hover:bg-secondary/50 rounded-full transition-colors"
  >
    <ShoppingBag size={20} />
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

      {/* Spacer */}
      <div className="h-24 md:h-32" />
    </>
  );
};

export default Navbar;
