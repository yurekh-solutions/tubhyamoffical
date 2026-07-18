import { useState } from 'react';
import { ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the return policy?",
      answer: "We offer hassle-free returns within 15 days of purchase. Items must be unworn and in original condition with tags attached. Please refer to our Returns page for detailed information."
    },
    {
      question: "How long does shipping take?",
      answer: "Orders are typically processed within 2-3 business days. Shipping takes 3-7 business days depending on your location. We offer free shipping on orders above ₹2000."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, net banking, UPI, and digital wallets like Google Pay, Apple Pay, and Amazon Pay."
    },
    {
      question: "Do you have a size guide?",
      answer: "Yes! Visit our Size Guide page for detailed measurements and fitting tips. We recommend checking the guide before making a purchase to ensure the perfect fit."
    },
    {
      question: "Are your products ethically produced?",
      answer: "Yes, we are committed to ethical and sustainable production practices. We work with manufacturers who follow fair labor practices and use eco-friendly materials."
    },
    {
      question: "Can I exchange a product?",
      answer: "Absolutely! If you need a different size or color, we offer free exchanges within 15 days of purchase. Simply contact our support team to initiate the process."
    },
    {
      question: "What is your warranty on products?",
      answer: "All our products come with quality assurance. If you receive a defective item, we'll replace it free of charge or process a full refund."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship only across India. We're working on expanding to international markets soon. Stay tuned!"
    }
  ];

  return (
    <>
      <SEO
        title="FAQ | Tubhyam - Frequently Asked Questions About Shopping"
        description="Find answers to common questions about Tubhyam — shipping, returns, sizing, payment methods, order tracking, product care, and more. Everything you need to know about shopping at tubhyam.in."
        keywords="tubhyam FAQ, tubhyam questions, tubhyam shipping policy, tubhyam return policy, tubhyam size guide, tubhyam payment methods, tubhyam order tracking, tubhyam customer service, tubhyam contact, women's pants online FAQ, free shipping India, return policy women's clothing"
        url="https://www.tubhyam.in/faq"
        breadcrumbItems={[{ name: 'FAQ', url: 'https://www.tubhyam.in/faq' }]}
      />
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
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg text-foreground/80">
              Find answers to common questions about our products, shipping, returns, and more.
            </p>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card overflow-hidden transition-all duration-300 border border-primary/20 rounded-lg"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <h3 className="text-base md:text-lg font-semibold text-foreground text-left">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      size={20}
                      className={`text-primary flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 py-3 border-t border-primary/20 bg-background/50"
                    >
                      <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="container mx-auto px-4 py-12 border-t border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-10 max-w-2xl mx-auto text-center border border-primary/20 rounded-lg"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 text-foreground">Still have questions?</h2>
            <p className="text-foreground/80 mb-6 text-sm md:text-base">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 md:px-8 py-2 md:py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm md:text-base"
            >
              Get in Touch
            </a>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;
