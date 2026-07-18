import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4 pb-8 border-b border-border/30 last:border-0">
    <h2 className="font-heading text-2xl md:text-3xl font-semibold text-primary">{title}</h2>
    <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3 pl-4 border-l-2 border-primary/30">
    <h3 className="font-heading text-xl font-semibold">{title}</h3>
    <div className="space-y-2 text-muted-foreground">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  const { isLight } = useTheme();

  return (
    <div className="min-h-screen">
      <SEO
        title="Privacy Policy | Tubhyam - Data Protection & Privacy Rights"
        description="Tubhyam's privacy policy — learn how we collect, use, and protect your personal data. Compliant with DPDP Act. Contact our grievance officer for data concerns. Your privacy is our priority."
        keywords="tubhyam privacy policy, data protection India, DPDP Act compliance, online shopping privacy, women's clothing store privacy, tubhyam data policy, grievance officer tubhyam, personal data protection"
        url="https://www.tubhyam.in/privacy-policy"
        breadcrumbItems={[{ name: 'Privacy Policy', url: 'https://www.tubhyam.in/privacy-policy' }]}
      />
      <Navbar />

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-4">
            Privacy & <span className="text-gradient-gold">Policies</span>
          </h1>
          <p className="text-muted-foreground">Last Updated / Effective Date: July 16, 2026</p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 space-y-12">
          
          {/* Introduction */}
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-semibold text-primary">
              PRIVACY POLICY FOR TUBHYAM.IN
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to tubhyam.in (the "Platform"). The Platform is owned and operated by Tubhyam 
              (hereinafter referred to as the "Company", "we", "us", or "our"). We are committed to 
              protecting your privacy and handling your personal data in a transparent, secure manner.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, process, and safeguard your 
              information when you visit our website, utilize our services, or make purchases from us. 
              By accessing or using the Platform, you explicitly agree to the collection and use of your 
              data in accordance with this policy.
            </p>
          </div>

          {/* Article I */}
          <Section title="ARTICLE I: INFORMATION WE COLLECT">
            <p>
              We collect information across three primary categories to provide a seamless, personalized experience:
            </p>

            <SubSection title="1.1 Personal Data (Information You Provide)">
              <p>
                We collect personally identifiable information that you voluntarily submit to us when 
                registering, placing an order, subscribing to newsletters, or contacting customer support. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Identity Data:</strong> Full name, age, gender, and profile details.</li>
                <li><strong>Contact Data:</strong> Delivery address, billing address, active email address, and mobile phone number.</li>
                <li><strong>Financial Data:</strong> Credit card, debit card, UPI handles, or net banking details used to complete transactions (note: all financial transactions are processed securely via external PCI-DSS compliant payment gateways, and we do not store raw card pins or passwords).</li>
              </ul>
            </SubSection>

            <SubSection title="1.2 Automated Data (Technical & Usage Metadata)">
              <p>
                When you navigate the Platform, our servers automatically log technical details about your device and interaction:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Device Metrics:</strong> IP address, browser type, operating system, hardware model, and unique device identifiers.</li>
                <li><strong>Behavioral Tracking:</strong> Pages viewed, products clicked, time spent on specific modules, search queries, and referring URL paths.</li>
              </ul>
            </SubSection>

            <SubSection title="1.3 Cookies and Tracking Technologies">
              <p>
                We utilize cookies, pixel tags, and web beacons to recognize your browser, remember items 
                in your shopping cart, and analyze web traffic patterns. You can manage your cookie 
                preferences through your individual browser settings; however, disabling cookies may 
                limit certain e-commerce functionalities on the Platform.
              </p>
            </SubSection>
          </Section>

          {/* Article II */}
          <Section title="ARTICLE II: HOW WE PROCESS YOUR DATA">
            <p>
              We process your data strictly on legitimate legal grounds, including performance of a contract, 
              statutory compliance, or with your explicit consent. Your data is used to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Fulfill Orders:</strong> Process transactions, manage inventory allocation, prepare tax invoices, and hand over details to third-party shipping partners for home delivery.</li>
              <li><strong>Enhance Platform UX:</strong> Personalize your product feed, fix code crashes, optimize page loading speeds, and conduct internal market research.</li>
              <li><strong>Communication:</strong> Send transactional updates (order confirmations, dispatch alerts via SMS/WhatsApp/Email) and marketing communications (promotional codes, new launches) if you have opted in to receive them.</li>
              <li><strong>Fraud Prevention:</strong> Identify and block suspicious logins, malicious bot activities, and unauthorized financial transactions.</li>
            </ul>
          </Section>

          {/* Article III */}
          <Section title="ARTICLE III: DATA SHARING AND DISCLOSURES">
            <p>
              We do not sell, rent, or trade your personal data to external third parties for marketing purposes. 
              We share your information only under the following strictly defined conditions:
            </p>

            <SubSection title="3.1 Third-Party Service Providers (Operational Vendors)">
              <p>
                We share core pieces of your information with trusted vendors who perform operational functions on our behalf:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Logistics Partners:</strong> Sharing names, phone numbers, and physical addresses to enable package deliveries.</li>
                <li><strong>Payment Gateways:</strong> Securely handing over transactional parameters to complete financial clearings.</li>
                <li><strong>Cloud Infrastructure:</strong> Hosting data on secure cloud servers.</li>
              </ul>
            </SubSection>

            <SubSection title="3.2 Statutory and Legal Mandates">
              <p>
                We will disclose your data if required to do so by applicable Indian laws, judicial court 
                warrants, or formal directives from government authorities (such as law enforcement or tax offices).
              </p>
            </SubSection>

            <SubSection title="3.3 Corporate Restructuring">
              <p>
                If the Company undergoes a corporate merger, acquisition, asset sale, or structural reorganization, 
                your user data may be transferred as part of the business assets to the succeeding entity, 
                subject to this identical Privacy Policy.
              </p>
            </SubSection>
          </Section>

          {/* Article IV */}
          <Section title="ARTICLE IV: DATA PROTECTION & STORAGE MATRIX">
            <SubSection title="4.1 Security Measures">
              <p>
                We deploy administrative, technical, and physical security parameters (including Secure Socket 
                Layer [SSL] encryption protocols) designed to protect your data from accidental loss, 
                unauthorized access, or digital breach.
              </p>
            </SubSection>

            <SubSection title="4.2 Data Retention Windows">
              <p>
                We retain your personal data only as long as necessary to fulfill the operational business 
                purposes outlined in this policy, or to fulfill statutory taxation, legal auditing, and 
                accounting requirements under Indian law.
              </p>
            </SubSection>
          </Section>

          {/* Article V */}
          <Section title="ARTICLE V: YOUR CONSUMER RIGHTS (DPDP Act Compliance)">
            <p>
              Under the Digital Personal Data Protection framework, you hold distinct rights regarding your data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Right to Access & Rectification:</strong> You can request a summary of your personal data processed by us and request immediate updates to incorrect or outdated information.</li>
              <li><strong>Right to Erasure (Right to be Forgotten):</strong> You may request that we completely erase your personal profile data from our servers, provided the data is no longer necessary for an active transaction or legal compliance.</li>
              <li><strong>Right to Withdraw Consent:</strong> You can opt-out of promotional marketing tracks at any point by clicking the "Unsubscribe" link at the bottom of our emails or modifying your account preferences.</li>
            </ul>
          </Section>

          {/* Article VI */}
          <Section title="ARTICLE VI: GRIEVANCE REDRESSAL OFFICER">
            <p>
              If you have questions regarding this Privacy Policy, wish to exercise your data rights, or file 
              a complaint regarding a suspected data breach, please contact our designated Grievance Officer:
            </p>
            <div className={`p-6 rounded-lg border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
              <p className="font-semibold mb-2">Attn: Data Grievance Cell, Tubhyam</p>
              <p className="text-sm mb-1"><strong>Corporate Address:</strong> 304, BN02 Shalibhadranagar, Block A, BP Road, Thane, Maharashtra, India.</p>
              <p className="text-sm mb-1"><strong>Email Contact:</strong> tubhyamofficial@gmail.com</p>
              <p className="text-sm"><strong>Contact Number:</strong> +91 7039382706</p>
            </div>
          </Section>

          {/* Divider */}
          <div className="border-t-2 border-primary/20 my-12"></div>

          {/* Cancellation & Refund Policy */}
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-semibold text-primary">
              CANCELLATION, RETURN, AND REFUND POLICY FOR TUBHYAM.IN
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Thank you for choosing tubhyam.in. We strive to provide standard consumer satisfaction with our products. 
              This Policy outlines the exact rules, hard ceilings, timelines, and evidentiary requirements governing 
              order cancellations, product returns, and financial reversals.
            </p>
          </div>

          {/* Cancellation Article I */}
          <Section title="ARTICLE I: CANCELLATION MATRIX">
            <SubSection title="1.1 Pre-Shipment Cancellation">
              <p>
                You can cancel an order free of cost at any time before it transitions to the "Shipped" or 
                "Dispatched" status. To cancel, navigate to your "Order History" panel on the Platform or 
                instantly email our support desk. A full refund will be processed immediately upon verification.
              </p>
            </SubSection>

            <SubSection title="1.2 Post-Shipment Cancellations (In-Transit)">
              <p>
                Once an order has been handed over to our third-party logistics partners and a tracking ID has 
                been generated, the order cannot be cancelled or modified. If you no longer want the product, 
                you must wait for the package to arrive and follow the standard Return parameters outlined below, 
                or refuse the package at the time of delivery (only applicable to certain non-perishable categories).
              </p>
            </SubSection>
          </Section>

          {/* Returns Article II */}
          <Section title="ARTICLE II: ELIGIBILITY CRITERIA FOR RETURNS">
            <p>
              To maintain hygiene standards and track product authenticity, items are eligible for a return or 
              replacement only if they meet the following restrictive conditions:
            </p>

            <SubSection title="2.1 Valid Scenarios for Return Intake">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Defective or Damaged Arrival:</strong> The product is received with open, ruptured, or broken commercial sealing, structural leakage, or clear damage inflicted during transit.</li>
                <li><strong>Mismatched Fulfillment:</strong> The product variant, size, fragrance, color, or net weight delivered does not match the items listed on your retail tax invoice.</li>
                <li><strong>Expired Batches:</strong> The item delivered has already passed its printed "Expiry Date" or "Best Before" threshold prior to the delivery timestamp.</li>
              </ul>
            </SubSection>

            <SubSection title="2.2 Items Categorized as Non-Returnable">
              <p>The Company does not accept returns under the following conditions:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Perishable items, customized/personalized goods, or personal hygiene products where the inner protective seal has been unsealed post-delivery.</li>
                <li>Products showing signs of clear usage, alterations, or damage arising from consumer handling or improper storage.</li>
                <li>Any item returned without its original outer boxes, price tags, brand packaging, user manuals, and free promotional items included in the initial box.</li>
              </ul>
            </SubSection>
          </Section>

          {/* Reporting Article III */}
          <Section title="ARTICLE III: MANDATORY 48-HOUR REPORTING & EVIDENCE">
            <SubSection title="3.1 Strict Claim Reporting Window">
              <p>
                Any claim preferred under Clause 2.1 must be officially reported to our customer support desk 
                within <strong>48 hours</strong> from the exact delivery timestamp recorded by the logistics provider. 
                Claims submitted after 48 hours will be automatically rejected.
              </p>
            </SubSection>

            <SubSection title="3.2 Compulsory Unboxing Video Evidence">
              <p>
                To validate a claim regarding transit damage, leaking, or missing items, the consumer must provide 
                a continuous, unedited, high-resolution unboxing video sent via email to tubhyamofficial@gmail.com.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The video must start by showing the outer parcel package in its completely sealed state, with the shipping label clearly legible.</li>
                <li>The recording must capture the actual cutting of the tape and the immediate extraction of the damaged or incorrect item without any camera cuts, pauses, or post-production edits.</li>
                <li><strong>Failure to present a valid, unedited unboxing video constitutes a complete waiver of the right to claim a return, exchange, or financial refund.</strong></li>
              </ul>
            </SubSection>
          </Section>

          {/* Verification Article IV */}
          <Section title="ARTICLE IV: VERIFICATION AND COMPLIANCE PROCESS">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Review Stage:</strong> Our Quality Assurance (QA) team will review the submitted video and photographic evidence within 3 to 5 business days of receiving your complaint email.</li>
              <li><strong>Reverse Pickup:</strong> If the claim is initially validated, we will organize a reverse pickup from your delivery address via our logistics partners at no extra cost to you.</li>
              <li><strong>Inspection Stage:</strong> Once the item reaches our warehouse facility located at 304, BN02 Shalibhadranagar, Block A, BP Road, Thane, Maharashtra, it will undergo a physical evaluation. If it passes inspection, we will initiate either a free product replacement or a financial refund, depending on your choice and stock availability.</li>
            </ul>
          </Section>

          {/* Refund Article V */}
          <Section title="ARTICLE V: REFUND PROCESSING AND TIMELINES">
            <p>
              All approved financial refunds are transferred back through the original digital payment gateway 
              utilized at checkout.
            </p>

            <div className={`overflow-x-auto rounded-lg border ${isLight ? 'border-gray-300' : 'border-white/20'}`}>
              <table className="w-full text-sm">
                <thead className={isLight ? 'bg-gray-100' : 'bg-white/10'}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Checkout Payment Mode</th>
                    <th className="px-4 py-3 text-left font-semibold">Processing Timeframe</th>
                    <th className="px-4 py-3 text-left font-semibold">Statement Reflection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr>
                    <td className="px-4 py-3">UPI / Digital Wallets</td>
                    <td className="px-4 py-3">2 - 3 Business Days</td>
                    <td className="px-4 py-3">Instant Wallet Balance</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Net Banking Portals</td>
                    <td className="px-4 py-3">3 - 5 Business Days</td>
                    <td className="px-4 py-3">Bank Passbook Entry</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Credit / Debit Cards</td>
                    <td className="px-4 py-3">5 - 7 Business Days</td>
                    <td className="px-4 py-3">Next Billing Cycle</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Cash on Delivery (COD)*</td>
                    <td className="px-4 py-3">5 - 7 Business Days</td>
                    <td className="px-4 py-3">Direct Bank Transfer</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm italic mt-4">
              *Note: For Cash on Delivery (COD) refunds, you must provide a copy of a cancelled cheque or valid 
              bank account details matching the customer billing profile. We do not issue cash refunds by post.
            </p>
          </Section>

          {/* Support Article VI */}
          <Section title="ARTICLE VI: CUSTOMER SUPPORT ESCALATIONS">
            <p>
              For any issues regarding your cancellation state, delayed refunds, or return processing, 
              please connect with our care desk directly:
            </p>
            <div className={`p-6 rounded-lg border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
              <p className="text-sm mb-2"><strong>Dedicated Help Mailbox:</strong> tubhyamofficial@gmail.com</p>
              <p className="text-sm mb-2"><strong>Customer Help Support Line:</strong> +91 7039382706</p>
              <p className="text-sm"><strong>Physical Grievance Desk Address:</strong> 304, BN02 Shalibhadranagar, Block A, BP Road, Thane, Maharashtra, India.</p>
            </div>
          </Section>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
