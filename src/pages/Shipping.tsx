import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Truck, Clock, MapPin, Package } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-4">
            Shipping <span className="text-gradient-gold">Information</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about our shipping and delivery services
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹2000' },
              { icon: Clock, title: '5-7 Days', desc: 'Standard delivery time' },
              { icon: MapPin, title: 'Pan India', desc: 'We ship across India' },
              { icon: Package, title: 'Secure Packaging', desc: 'Safe & protected' },
            ].map((item, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <item.icon size={32} className="mx-auto text-primary mb-4" />
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="glass-card p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Shipping Rates</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-4 font-medium">Order Value</th>
                      <th className="py-3 font-medium">Shipping Cost</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Below ₹500</td>
                      <td className="py-3">₹99</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">₹500 - ₹999</td>
                      <td className="py-3">₹79</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">₹1000 - ₹1999</td>
                      <td className="py-3">₹49</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">₹2000 and above</td>
                      <td className="py-3 text-primary font-medium">FREE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Delivery Time</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Metro cities (Delhi, Mumbai, Bangalore, etc.): 3-5 business days</li>
                <li>Tier 2 cities: 5-7 business days</li>
                <li>Other locations: 7-10 business days</li>
                <li>Remote areas may require additional time</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Delivery times may vary during 
                festive seasons, sales, or due to unforeseen circumstances.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Shipping Partners</h2>
              <p className="text-muted-foreground leading-relaxed">
                We partner with trusted courier services including Delhivery, BlueDart, and India Post 
                to ensure your orders reach you safely and on time. You'll receive tracking information 
                via WhatsApp once your order is shipped.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Order Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once your order is dispatched, you'll receive a tracking number via WhatsApp/SMS. 
                You can track your order status directly through our courier partner's website or 
                by contacting us on WhatsApp.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold">Cash on Delivery (COD)</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cash on Delivery is available for orders up to ₹5000 in select pin codes. 
                Additional COD charges of ₹50 may apply. Prepaid orders are processed faster 
                and are preferred for quicker delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;
