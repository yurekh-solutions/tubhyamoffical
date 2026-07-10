import { useState } from 'react';
import { Mail, Sparkles, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Please enter your email address');
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError('Please enter a valid email (e.g. name@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setIsSubscribed(true);
    toast.success('Welcome to Tubhyam!', {
      description: 'You\'ve been added to our exclusive list.',
    });
    setEmail('');
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Luxury Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-8 animate-pulse">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-4">
            Join the <span className="text-gradient-gold">Exclusive Circle</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive offers, and styling tips from our fashion experts.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  emailError ? 'text-red-400' : 'text-muted-foreground'
                }`} size={20} />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => email && validateEmail(email)}
                  placeholder="Enter your email"
                  required
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  className={`w-full pl-12 pr-4 py-4 bg-card/80 backdrop-blur border rounded-full focus:outline-none focus:ring-2 transition-all ${
                    emailError
                      ? 'border-red-400 focus:ring-red-400/50'
                      : 'border-border/50 focus:ring-primary/50'
                  }`}
                />
                {emailError && (
                  <div className="absolute left-4 -bottom-6 flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-red-400" />
                    <span className="text-xs text-red-400">{emailError}</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 py-4 px-8 bg-green-500/10 border border-green-500/30 rounded-full max-w-md mx-auto">
              <Check className="text-green-500" size={24} />
              <span className="text-green-500 font-medium">You're on the list!</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-4">
            No spam, unsubscribe anytime. Join 10,000+ fashion lovers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
