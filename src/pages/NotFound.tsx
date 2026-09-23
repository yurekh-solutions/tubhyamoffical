import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';

const NotFound = () => {
  const location = useLocation();
  const { isLight } = useTheme();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center py-32 px-4">
        <div className="text-center max-w-md">
          <p className={`text-[10px] uppercase tracking-[0.4em] mb-4 ${isLight ? 'text-[#9B8E82]' : 'text-white/40'}`}>
            Page Not Found
          </p>
          <h1 className={`font-heading text-6xl sm:text-7xl font-light mb-4 ${isLight ? 'text-[#2E241F]' : 'text-white/90'}`}>
            404
          </h1>
          <div className={`flex items-center justify-center gap-3 mb-6 ${isLight ? 'text-[#9B8E82]' : 'text-white/25'}`}>
            <span className="w-8 h-px bg-current opacity-40" />
            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
            <span className="w-8 h-px bg-current opacity-40" />
          </div>
          <p className={`text-sm mb-8 ${isLight ? 'text-[#7A6E62]' : 'text-white/50'}`}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #8B5E3C 0%, #A0714D 40%, #C9A882 100%)' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
