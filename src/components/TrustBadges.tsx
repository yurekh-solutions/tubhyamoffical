import { Truck, Shield, RefreshCw, CreditCard, Phone, Lock, Package, BadgeCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const TrustBadges = () => {
  const { isLight } = useTheme();

  const badges = [
    {
      icon: CreditCard,
      title: 'Cash on Delivery',
      subtitle: 'Pay when you receive',
      accent: '#E8652B',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'On all orders across India',
      accent: '#3B82F6',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      subtitle: '7-day hassle-free returns',
      accent: '#10B981',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      subtitle: 'UPI, Cards & Net Banking',
      accent: '#8B5CF6',
    },
  ];

  return (
    <section className={`py-8 ${isLight ? 'bg-white border-y border-gray-100' : 'bg-[#0f0a07] border-y border-white/5'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  isLight
                    ? 'bg-gray-50 hover:bg-gray-100'
                    : 'bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${badge.accent}15` }}
                >
                  <Icon size={20} style={{ color: badge.accent }} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    {badge.title}
                  </p>
                  <p className={`text-xs truncate ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
