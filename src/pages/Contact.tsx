import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Instagram } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 70393 82706",
      link: "tel:+917039382706"
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@tubhyam.in",
      link: "mailto:contact@tubhyam.in"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "India",
      link: "#"
    }
  ];

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-b border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-4">
              Get in Touch
            </h1>
            <p className="text-base md:text-lg text-foreground/80">
              Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </section>

        {/* Contact Info Cards */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <motion.a
                  key={index}
                  href={info.link}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 text-center border border-primary/20 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-primary/30">
                    <IconComponent size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{info.label}</h3>
                  <p className="text-sm text-foreground/80">{info.value}</p>
                </motion.a>
              );
            })}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container mx-auto px-4 py-12 border-t border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto glass-card p-8 md:p-10 border border-primary/20 rounded-lg"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-foreground">Send us a Message</h2>
            
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
              >
                <p className="text-green-700 font-semibold">Thank you! Your message has been sent successfully.</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/50 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="How can we help?"
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/50 text-sm"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Your message here..."
                  rows={5}
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/50 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>
        </section>

        {/* WhatsApp CTA */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-10 max-w-2xl mx-auto text-center border border-primary/20 rounded-lg"
          >
            <h3 className="text-2xl font-heading font-bold mb-3 text-foreground">Prefer WhatsApp?</h3>
            <p className="text-foreground/80 mb-6 text-sm md:text-base">
              Chat with us directly on WhatsApp for faster responses
            </p>
            <a
              href="https://wa.me/917039382706?text=Hi! I'm interested in Tubhyam products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 md:px-8 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm"
            >
              Chat on WhatsApp
            </a>
          </motion.div>
        </section>

        {/* Instagram Follow Section */}
            <section className="container mx-auto px-4 py-12 border-t border-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 md:p-10 max-w-3xl mx-auto text-center border border-primary/20 rounded-lg"
      >
        {/* Instagram Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30">
          <Instagram size={32} className="text-white" />
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-heading font-bold mb-2 text-foreground">
          Follow Us on Instagram
        </h3>

        <p className="text-primary font-semibold mb-3 text-lg">
          @tubhyamofficial
        </p>

        <p className="text-foreground/80 mb-6 text-sm md:text-base">
          Stay updated with the latest styles, fashion tips, and exclusive offers
        </p>

        {/* Visit Instagram Button */}
        <a
          href="https://www.instagram.com/tubhyamofficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 md:px-8 py-2 md:py-3 mb-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm"
        >
          Visit Our Instagram
        </a>

       
      </motion.div>
    </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
