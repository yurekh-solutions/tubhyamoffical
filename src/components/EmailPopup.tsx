import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const EmailPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [closed, setClosed] = useState(false);
  const { isLight } = useTheme();

  useEffect(() => {
    // Only show if user hasn't seen it before
    const seen = localStorage.getItem('tubhyam-email-popup-dismissed');
    if (seen) return;

    // Show after 5 seconds
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Store email locally
    const existing = JSON.parse(localStorage.getItem('tubhyam-subscribers') || '[]');
    existing.push({ email: email.trim(), date: new Date().toISOString() });
    localStorage.setItem('tubhyam-subscribers', JSON.stringify(existing));
    setSubmitted(true);
    setTimeout(() => {
      setShow(false);
      localStorage.setItem('tubhyam-email-popup-dismissed', 'true');
    }, 3000);
  };

  const handleClose = () => {
    setShow(false);
    setClosed(true);
    localStorage.setItem('tubhyam-email-popup-dismissed', 'true');
  };

  if (!show || closed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 ${
          isLight
            ? 'bg-white'
            : 'bg-[#1a1410] border border-white/10'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X size={18} className={isLight ? 'text-gray-500' : 'text-white/60'} />
        </button>

        {/* Top accent */}
        <div className="h-2 bg-gradient-to-r from-[#E8652B] via-[#D4A853] to-[#E8652B]" />

        <div className="p-8 text-center">
          {submitted ? (
            <div className="py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift size={32} className="text-green-400" />
              </div>
              <h3 className={`text-2xl font-heading font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                You're In!
              </h3>
              <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
                Check your inbox for your 10% discount code.
              </p>
            </div>
          ) : (
            <>
              {/* Gift icon */}
              <div className="w-16 h-16 bg-[#E8652B]/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <Gift size={32} className="text-[#E8652B]" />
              </div>

              <h3 className={`text-2xl font-heading font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Get 10% Off
              </h3>
              <p className={`text-sm mb-1 ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
                Your First Order
              </p>
              <p className={`text-sm mb-6 max-w-xs mx-auto ${isLight ? 'text-gray-600' : 'text-white/50'}`}>
                Subscribe to get exclusive deals, new arrivals & style tips delivered to your inbox.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#E8652B]/50 ${
                    isLight
                      ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      : 'bg-white/5 border-white/10 text-white placeholder-white/40'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E8652B] text-white rounded-xl font-semibold text-sm hover:bg-[#d45a24] transition-all duration-300 hover:scale-[1.02]"
                >
                  Claim My 10% Off
                  <ArrowRight size={16} />
                </button>
              </form>

              <p className={`text-xs mt-4 ${isLight ? 'text-gray-400' : 'text-white/30'}`}>
                No spam, ever. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPopup;
