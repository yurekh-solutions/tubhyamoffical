import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RefreshCw, Package, Phone } from 'lucide-react';

const Returns = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-4">
            Returns & <span className="text-gradient-gold">Exchanges</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We want you to love your purchase. Here's our hassle-free return policy.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <RefreshCw size={32} className="mx-auto text-primary mb-4" />
              <h3 className="font-medium mb-1">7 Day Returns</h3>
              <p className="text-sm text-muted-foreground">Easy return window</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Package size={32} className="mx-auto text-primary mb-4" />
              <h3 className="font-medium mb-1">Free Exchanges</h3>
              <p className="text-sm text-muted-foreground">Size not right? We'll swap it</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Phone size={32} className="mx-auto text-primary mb-4" />
              <h3 className="font-medium mb-1">WhatsApp Support</h3>
              <p className="text-sm text-muted-foreground">Quick assistance</p>
            </div>
          </div>

          {/* Details */}
          <div className="glass-card p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Return Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We accept returns within 7 days of delivery. To be eligible for a return, your item 
                must be unused, unworn, and in the same condition that you received it. It must also 
                be in the original packaging with all tags attached.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Eligible for Return</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Products with manufacturing defects</li>
                <li>Wrong size delivered</li>
                <li>Wrong product delivered</li>
                <li>Damaged during transit</li>
                <li>Size exchange (subject to availability)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Not Eligible for Return</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Products that have been worn, washed, or altered</li>
                <li>Products without original tags or packaging</li>
                <li>Products marked as "Final Sale" or "Non-Returnable"</li>
                <li>Products damaged due to misuse</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">How to Initiate a Return</h2>
              <ol className="list-decimal list-inside text-muted-foreground space-y-3 ml-4">
                <li>
                  <strong className="text-foreground">Contact Us:</strong> Reach out via WhatsApp at 
                  +91 70393 82706 within 7 days of receiving your order
                </li>
                <li>
                  <strong className="text-foreground">Share Details:</strong> Provide your order number, 
                  reason for return, and photos of the product
                </li>
                <li>
                  <strong className="text-foreground">Approval:</strong> Our team will review and approve 
                  your return request within 24-48 hours
                </li>
                <li>
                  <strong className="text-foreground">Ship the Item:</strong> Pack the item securely and 
                  ship it to the address provided
                </li>
                <li>
                  <strong className="text-foreground">Refund Processing:</strong> Once we receive and 
                  inspect the item, your refund will be processed within 7-10 business days
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once your return is received and inspected, we will notify you of the approval or 
                rejection of your refund. If approved, your refund will be processed and credited 
                to the original method of payment within 7-10 business days.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> Original shipping charges are 
                non-refundable. Return shipping costs are the responsibility of the customer unless 
                the return is due to our error (wrong item, defective product, etc.).
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Exchanges</h2>
              <p className="text-muted-foreground leading-relaxed">
                We offer free size exchanges! If you need a different size, simply contact us on 
                WhatsApp with your order details. Exchange is subject to product availability. 
                If the desired size is unavailable, a full refund will be processed.
              </p>
            </div>

            <div className="bg-primary/10 p-6 rounded-xl">
              <h3 className="font-heading text-xl font-semibold mb-4">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                For any questions about returns or exchanges, please don't hesitate to reach out:
              </p>
              <a
                href="https://wa.me/917039382706?text=Hi! I need help with a return/exchange."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Phone size={18} />
                Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Returns;
