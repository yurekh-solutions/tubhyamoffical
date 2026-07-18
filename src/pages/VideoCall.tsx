import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Video, Zap, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { sendOtpViaSms } from '@/lib/freeSms';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';

const VideoCall = () => {
  const [formStep, setFormStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [verifiedNumber, setVerifiedNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    setPhoneNumber(value);
    setError('');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Send OTP via SMS to user's phone
      const result = await sendOtpViaSms(phoneNumber);
      
      if (result.success && result.otp) {
        setGeneratedOtp(result.otp);
        setFormStep('otp');
        
        // Show user-friendly message
        if (result.message.includes('Demo mode')) {
          // Demo mode - show OTP in toast for testing
          toast.success(`OTP Sent to Your Phone!`, {
            description: `Check your phone +91${phoneNumber} for the OTP. (Demo: ${result.otp})`,
            duration: 10000,
          });
        } else {
          // Real SMS sent
          toast.success(`OTP Sent Successfully!`, {
            description: `Please check your phone +91${phoneNumber} for the verification code.`,
            duration: 8000,
          });
        }
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleSendOtp:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate OTP verification delay
    setTimeout(() => {
      if (otp === generatedOtp) {
        setVerifiedNumber(phoneNumber);
        setFormStep('success');
        setLoading(false);
        
        // Send WhatsApp notification
        const message = `Hi! I've booked a free video styling session with Tubhyam. Please confirm the appointment details with me.`;
        window.open(
          `https://wa.me/917039382706?text=${encodeURIComponent(message)}`,
          '_blank'
        );
      } else {
        setError('Invalid OTP. Please check the console for the correct OTP.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <>
      <SEO
        title="Video Call Shopping | Tubhyam - See Products Live Before Buying"
        description="Book a video call shopping session with Tubhyam — see products live, get styling advice, and shop with confidence. Personal shopping experience for women's pants, jeans, and formal wear."
        keywords="tubhyam video call shopping, live shopping India, virtual try-on, personal shopping experience, video call buy clothes, online video shopping, see products live, tubhyam live shopping, women's clothing video call"
        url="https://tubhyam.in/video-call"
        breadcrumbItems={[{ name: 'Video Call Shopping', url: 'https://tubhyam.in/video-call' }]}
      />
      <Navbar />
      <ScrollToTop />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20 border-b border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30">
                <Video size={32} className="text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient-gold mb-4">
              Shop via Video Call
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-6">
              Get a free virtual styling session with our fashion experts
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 text-foreground/70">
                <Zap size={20} className="text-primary" />
                <span>Personalized styling</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Clock size={20} className="text-primary" />
                <span>Book your preferred time</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Phone size={20} className="text-primary" />
                <span>One-on-one consultation</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Appointment Booking Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-12 border border-primary/20 rounded-2xl"
            >
              {formStep === 'phone' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                      Book Your Appointment
                    </h2>
                    <p className="text-foreground/70 mb-2">
                      Enter your phone number to receive an OTP for verification
                    </p>
                    <p className="text-sm text-primary/80 bg-primary/10 border border-primary/20 rounded-lg p-3">
                      📱 <strong>SMS Delivery:</strong> OTP will be sent to your phone via SMS. Make sure your number is correct!
                    </p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 py-3 bg-background border border-primary/30 rounded-lg text-foreground">
                          +91
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="Enter 10-digit number"
                          maxLength={10}
                          required
                          className="flex-1 px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/50"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
                      >
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || phoneNumber.length !== 10}
                      className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </form>
                </motion.div>
              )}

              {formStep === 'otp' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                      Verify OTP
                    </h2>
                    <p className="text-foreground/80 mb-4">
                      Enter the OTP sent to:
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      +91 {phoneNumber}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ''));
                          setError('');
                        }}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                        className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/50 text-center text-2xl tracking-widest"
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
                      >
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || otp.length < 4}
                      className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormStep('phone');
                        setOtp('');
                        setError('');
                      }}
                      className="w-full px-6 py-2 border border-primary/30 hover:border-primary/50 text-primary rounded-lg font-medium transition-colors text-sm"
                    >
                      Change Phone Number
                    </button>
                  </form>
                </motion.div>
              )}

              {formStep === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50"
                    >
                      <CheckCircle size={40} className="text-green-500" />
                    </motion.div>
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient-gold mb-2">
                      Booking Confirmed!
                    </h2>
                    <p className="text-foreground/80 mb-4">
                      Your appointment has been successfully booked
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      +91 {verifiedNumber}
                    </p>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 text-left space-y-3">
                    <h3 className="font-semibold text-foreground">What's Next?</h3>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">1</span>
                        <span>You'll receive appointment details on WhatsApp</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">2</span>
                        <span>Our styling expert will contact you to confirm the time</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">3</span>
                        <span>Join the video call at the scheduled time for personalized styling</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setFormStep('phone');
                      setPhoneNumber('');
                      setOtp('');
                      setVerifiedNumber('');
                      setError('');
                    }}
                    className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm"
                  >
                    Book Another Appointment
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default VideoCall;
