import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border mt-20">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Tubhyam" className="h-16 w-auto" />
              <div>
                <h2 className="font-heading text-3xl font-semibold text-gradient-gold">Tubhyam</h2>
                <p className="text-sm text-muted-foreground">तुम्हारे लिए</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium women's clothing brand dedicated to crafting elegant, comfortable, and stylish pants for every occasion. From formal wear to casual comfort - we've got you covered.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://www.instagram.com/tubhyamofficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 glass-card hover:border-primary/30 transition-all duration-300"
              >
                <Instagram size={20} className="text-primary" />
              </a>
              <a 
                href="https://wa.me/917039382706"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-card hover:border-primary/30 transition-all duration-300"
              >
                <Phone size={20} className="text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'All Products', path: '/products' },
                { name: 'Size Guide', path: '/size-guide' },
                { name: 'About Us', path: '/about' },
                { name: 'Blog', path: '/blog' },
                { name: 'FAQ', path: '/faq' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold">Customer Service</h3>
            <ul className="space-y-3">
              {[
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Size Guide', path: '/size-guide' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms & Conditions', path: '/terms' },
                { name: 'Shipping Information', path: '/shipping' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold">Contact Us</h3>
            <div className="space-y-4">
              <a 
                href="tel:+917039382706"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone size={18} className="text-primary" />
                <span className="text-sm">+91 70393 82706</span>
              </a>
              <a 
                href="mailto:contact@tubhyam.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={18} className="text-primary" />
                <span className="text-sm">contact@tubhyam.com</span>
              </a>
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-sm">India</span>
              </div>
            </div>
            
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/917039382706?text=Hi! I'm interested in Tubhyam products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors mt-4"
            >
              <Phone size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Tubhyam. All rights reserved.</p>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="flex items-center gap-6">
                <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>Designed & Developed by</span>
                <a 
                  href="https://yurekh.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 rounded-full font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105"
                >
                  <span className="font-semibold">Yurekh Solutions</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
