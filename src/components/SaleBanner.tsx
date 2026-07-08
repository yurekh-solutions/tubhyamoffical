import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

function getTimeRemaining(endDate: Date) {
  const total = endDate.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

const SaleBanner = () => {
  const { isLight } = useTheme();
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem('tubhyam-sale-dismissed') === 'true'
  );
  
  // Sale ends in 3 days from first visit (stored in localStorage)
  const [endDate] = useState(() => {
    const stored = localStorage.getItem('tubhyam-sale-end');
    if (stored) return new Date(stored);
    const end = new Date();
    end.setDate(end.getDate() + 3);
    localStorage.setItem('tubhyam-sale-end', end.toISOString());
    return end;
  });

  const [time, setTime] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('tubhyam-sale-dismissed', 'true');
  };

  if (dismissed) return null;

  const timerBlocks = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hrs' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className={`relative py-12 md:py-16 ${
        isLight
          ? 'bg-gradient-to-br from-[#FFF8F2] via-[#FFF3E8] to-[#FFF8F2] border-y border-[#E8652B]/15'
          : 'bg-gradient-to-br from-[#1a1210] via-[#15100d] to-[#1a1210] border-y border-white/10'
      }`}>
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          {isLight ? (
            <>
              <div className="absolute -top-32 left-1/4 w-[500px] h-[400px] bg-[#E8652B]/8 rounded-full blur-[120px]" />
              <div className="absolute -bottom-32 right-1/4 w-[500px] h-[400px] bg-[#D4A853]/6 rounded-full blur-[120px]" />
            </>
          ) : (
            <>
              <div className="absolute -top-32 left-1/4 w-[500px] h-[400px] bg-white/[0.03] rounded-full blur-[120px]" />
              <div className="absolute -bottom-32 right-1/4 w-[500px] h-[400px] bg-[#FFD3AC]/[0.03] rounded-full blur-[120px]" />
            </>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className={`absolute top-4 right-4 z-10 p-1.5 rounded-full transition-colors ${
            isLight ? 'hover:bg-black/10' : 'hover:bg-white/10'
          }`}
        >
          <X size={16} className={isLight ? 'text-gray-400' : 'text-white/50'} />
        </button>

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 ${
            isLight
              ? 'bg-[#E8652B] border border-[#E8652B] shadow-lg shadow-[#E8652B]/20'
              : 'bg-white/10 backdrop-blur-md border border-white/15'
          }`}>
            <Sparkles size={14} className={isLight ? 'text-white' : 'text-[#FFD3AC]'} />
            <span className={`text-xs font-bold uppercase tracking-widest ${
              isLight ? 'text-white' : 'text-[#FFD3AC]'
            }`}>
              New Launch Offer
            </span>
          </div>

          {/* Headline */}
          <h2 className={`font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3 ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>
            Flat <span className={isLight ? 'text-[#E8652B]' : 'text-[#FFD3AC]'}>20% Off</span> Everything
          </h2>
          <p className={`text-sm sm:text-base mb-8 max-w-lg mx-auto ${
            isLight ? 'text-gray-500' : 'text-white/50'
          }`}>
            Celebrating our launch — use code{" "}
            <span className={`inline-block px-2 py-0.5 font-bold rounded text-sm ${
              isLight
                ? 'bg-[#E8652B]/15 text-[#E8652B] border border-[#E8652B]/30'
                : 'bg-white/10 text-[#FFD3AC] border border-white/15 backdrop-blur-sm'
            }`}>
              TUBHYAM20
            </span>{" "}
            at checkout. Limited time only.
          </p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8">
            {timerBlocks.map((block) => (
              <div key={block.label} className="text-center">
                <div className={`w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-inner ${
                  isLight
                    ? 'bg-[#E8652B]/10 border border-[#E8652B]/20 text-gray-900'
                    : 'text-white bg-white/[0.06] border border-white/10'
                }`}>
                  {String(block.value).padStart(2, '0')}
                </div>
                <span className={`text-[10px] sm:text-xs mt-2 block uppercase tracking-wider font-medium ${
                  isLight ? 'text-gray-400' : 'text-white/40'
                }`}>
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            to="/shop"
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 ${
              isLight
                ? 'bg-[#E8652B] text-white hover:bg-[#d45a24] shadow-lg shadow-[#E8652B]/30'
                : 'bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white/15'
            }`}
          >
            Shop the Sale
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SaleBanner;
