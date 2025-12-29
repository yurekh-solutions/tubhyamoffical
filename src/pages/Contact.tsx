import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Instagram, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to WhatsApp with form data
    const message = `Hi! I'm ${formData.name}.\n\nSubject: ${formData.subject}\n\nMessage: ${formData.message}\n\nContact: ${formData.email} | ${formData.phone}`;
    window.open(`https://wa.me/917039382706?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Redirecting to WhatsApp...');
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-4">
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have questions about our products or need assistance? We're here to help!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you. Whether you have a question about our products, sizing, 
                or anything else, our team is ready to answer all your questions.
              </p>
            </div>

            <div className="space-y-6">
              <a 
                href="tel:+917039382706"
                className="flex items-center gap-4 glass-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Phone size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+91 70393 82706</p>
                </div>
              </a>

              <a 
                href="https://wa.me/917039382706"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass-card p-4 hover:border-green-500/30 transition-colors"
              >
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Phone size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-muted-foreground">Chat with us directly</p>
                </div>
              </a>

              <a 
                href="mailto:contact@tubhyam.com"
                className="flex items-center gap-4 glass-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">contact@tubhyam.com</p>
                </div>
              </a>

              <a 
                href="https://www.instagram.com/tubhyamofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass-card p-4 hover:border-pink-500/30 transition-colors"
              >
                <div className="p-3 bg-pink-500/10 rounded-xl">
                  <Instagram size={24} className="text-pink-500" />
                </div>
                <div>
                  <p className="font-medium">Instagram</p>
                  <p className="text-muted-foreground">@tubhyamofficial</p>
                </div>
              </a>

              <div className="flex items-center gap-4 glass-card p-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8">
            <h2 className="font-heading text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-lg font-medium hover:shadow-elegant transition-all"
              >
                <Send size={18} />
                Send Message via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
