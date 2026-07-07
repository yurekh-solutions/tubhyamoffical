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
      <div className={`relative py-10 md:py-14 ${isLight ? 'bg-[#2E241F]' : 'bg-[#0f0a07]'}`}>
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#E8652B]/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#D4A853]/15 rounded-full blur-[100px]" />
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={16} className="text-white/40" />
        </button>

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8652B]/20 border border-[#E8652B]/30 mb-5">
            <Sparkles size={14} className="text-[#E8652B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8652B]">
              New Launch Offer
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Flat 20% Off Everything
          </h2>
          <p className="text-white/60 text-sm sm:text-base mb-6 max-w-lg mx-auto">
            Celebrating our launch — use code <span className="text-[#E8652B] font-bold">TUBHYAM20</span> at checkout.
            Limited time only.
          </p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
            {timerBlocks.map((block) => (
              <div key={block.label} className="text-center">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-bold text-xl sm:text-2xl ${
                  isLight ? 'bg-white/10 text-white' : 'bg-white/5 text-white'
                } border border-white/10`}>
                  {String(block.value).padStart(2, '0')}
                </div>
                <span className="text-[10px] sm:text-xs text-white/40 mt-1 block uppercase tracking-wider">
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E8652B] text-white rounded-full font-semibold text-sm hover:bg-[#d45a24] transition-all duration-300 hover:scale-105"
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
