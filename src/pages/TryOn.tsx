import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AIVirtualTryOn from '@/components/AIVirtualTryOn';

const TryOn = () => {
  return (
    <>
      <SEO
        title="AI Virtual Try-On | Tubhyam - See How Pants Look On You"
        description="Try Tubhyam pants virtually using AI. Upload your photo and see how our formal pants, jeans, and track pants look on your body before you buy."
        keywords="virtual try on, AI try on, tubhyam try on, online fitting room, virtual fitting, try pants online, AI fashion, tubhyam virtual try-on"
        url="https://www.tubhyam.in/try-on"
        breadcrumbItems={[{ name: 'AI Try-On', url: 'https://www.tubhyam.in/try-on' }]}
      />
      <Navbar />
      <AIVirtualTryOn standalone open />
      <Footer />
    </>
  );
};

export default TryOn;
