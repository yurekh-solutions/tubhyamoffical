import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Terms = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Terms & Conditions | Tubhyam - Online Shopping Terms of Service"
        description="Read Tubhyam's terms and conditions — usage guidelines, payment terms, intellectual property rights, and legal information for shopping at tubhyam.in."
        keywords="tubhyam terms and conditions, tubhyam terms of service, online shopping terms India, women's clothing store terms, tubhyam legal, tubhyam usage policy"
        url="https://www.tubhyam.in/terms"
        breadcrumbItems={[{ name: 'Terms & Conditions', url: 'https://www.tubhyam.in/terms' }]}
      />
      <Navbar />

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-4">
            Terms & <span className="text-gradient-gold">Conditions</span>
          </h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the Tubhyam website, you accept and agree to be bound by these 
              Terms and Conditions. If you do not agree with any part of these terms, please do not 
              use our website.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">2. Products & Pricing</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes</li>
              <li>We reserve the right to modify prices without prior notice</li>
              <li>Product images are representative; actual colors may vary slightly due to screen settings</li>
              <li>We strive to maintain accurate product descriptions, but minor variations may occur</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">3. Orders & Payment</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Orders are confirmed only after successful payment or confirmation via WhatsApp</li>
              <li>We accept payments through secure payment gateways and Cash on Delivery (where available)</li>
              <li>Order cancellation is subject to order processing status</li>
              <li>We reserve the right to refuse or cancel orders at our discretion</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">4. Shipping & Delivery</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Free shipping on orders above ₹2000</li>
              <li>Standard delivery time is 5-7 business days across India</li>
              <li>Express delivery options may be available at additional cost</li>
              <li>Delivery times may vary during peak seasons or due to unforeseen circumstances</li>
              <li>Risk of loss passes to you upon delivery to the carrier</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">5. Returns & Exchanges</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Returns accepted within 7 days of delivery</li>
              <li>Products must be unworn, unwashed, and in original condition with tags attached</li>
              <li>Return shipping costs are borne by the customer unless the product is defective</li>
              <li>Refunds will be processed within 7-10 business days after receiving the returned item</li>
              <li>Exchange is subject to product availability</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including but not limited to text, images, graphics, logos, 
              and software, is the property of Tubhyam and is protected by intellectual property laws. 
              Unauthorized use, reproduction, or distribution is strictly prohibited.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tubhyam shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages arising from your use of our website or products. Our total liability 
              shall not exceed the amount paid by you for the product in question.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">8. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the 
              laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts 
              in India.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">9. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to update these Terms and Conditions at any time. Changes will be 
              effective immediately upon posting on the website. Your continued use of the website 
              constitutes acceptance of the updated terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any questions regarding these Terms and Conditions, please contact us:
            </p>
            <ul className="text-muted-foreground space-y-2 ml-4">
              <li>WhatsApp: +91 70393 82706</li>
              <li>Email: contact@tubhyam.in</li>
              <li>Instagram: @tubhyamofficial</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
