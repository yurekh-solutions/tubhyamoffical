import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/looo.png';
import { useTheme } from '@/context/ThemeContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isLight } = useTheme();

  return (
    <footer className={`border-t mt-2 md:mt-4 ${isLight ? 'bg-[hsla(30, 65%, 64%, 1.00)] border-gray-200' : 'bg-card/50 border-border'}`}>
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Brand + Contact */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Tubhyam" className={`h-10 w-10 object-cover rounded-md ${isLight ? 'brightness-[0.3] sepia' : ''}`} />
              <div>
                <h2 className={`font-heading text-xl font-semibold leading-tight ${isLight ? 'text-[#2E1A0E]' : 'text-gradient-gold'}`}>Tubhyam</h2>
                <p className={`text-[9px] tracking-widest ${isLight ? 'text-[#4A3228]' : 'text-muted-foreground'}`}>तुम्हारे लिए</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Premium women's clothing — elegant, comfortable, and stylish pants for every occasion.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="https://www.instagram.com/tubhyamofficial/" target="_blank" rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${isLight ? 'bg-white border border-gray-200 text-primary' : 'glass-card text-primary'}`}>
                <Instagram size={16} />
              </a>
              <a href="https://wa.me/917039382706" target="_blank" rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${isLight ? 'bg-white border border-gray-200 text-primary' : 'glass-card text-primary'}`}>
                <Phone size={16} />
              </a>
              <a href="mailto:contact@tubhyam.in"
                className={`p-2 rounded-lg transition-all ${isLight ? 'bg-white border border-gray-200 text-primary' : 'glass-card text-primary'}`}>
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-heading text-base font-semibold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {[
                { name: 'Shop', path: '/shop' },
                { name: 'Collections', path: '/collections' },
                { name: 'About Us', path: '/about' },
                { name: 'Blog', path: '/blog' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact', path: '/contact' },
                { name: 'Size Guide', path: '/size-guide' },
                { name: 'Lookbook', path: '/lookbook' },
              ].map((link) => (
                <Link key={link.path} to={link.path}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm py-0.5">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact + WhatsApp */}
          <div className="space-y-3">
            <h3 className="font-heading text-base font-semibold">Get in Touch</h3>
            <div className="space-y-2">
              <a href="tel:+917039382706" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                <Phone size={14} className="text-primary" />
                +91 70393 82706
              </a>
              <a href="mailto:contact@tubhyam.in" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                <Mail size={14} className="text-primary" />
                contact@tubhyam.in
              </a>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin size={14} className="text-primary" />
                India
              </div>
            </div>
            <a href="https://wa.me/917039382706?text=Hi! I'm interested in Tubhyam products."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-xs font-medium transition-colors">
              <Phone size={14} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${isLight ? 'border-gray-200' : 'border-border'}`}>
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
            <p>© {currentYear} Tubhyam. All rights reserved.</p>
            <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <a
                href="https://yurekh.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all hover:scale-105 ${
                  isLight
                    ? 'bg-[#2E1A0E] text-[#F5F0E8] hover:bg-[#4A3228] shadow-sm'
                    : 'bg-gradient-to-r from-[#8B5E3C] to-[#D4A373] text-[#1A0F08] shadow-md'
                }`}
                title="Built by Yurekh Solutions"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#D4A373]' : 'bg-[#1A0F08]'}`} />
                by Yurekh Solutions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
