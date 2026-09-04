import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AIVirtualTryOn from '@/components/AIVirtualTryOn';
import { getProductById } from '@/data/products';

const TryOn = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const product = productId ? getProductById(productId) : null;

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
      {product && product.tryOnImages && product.tryOnImages.length > 0 ? (
        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Try it on: {product.name}</h1>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.tryOnImages.map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden shadow-lg">
                    <img src={img} alt={`${product.name} - AI Model ${idx + 1}`} className="w-full h-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AIVirtualTryOn standalone open />
      )}
      <Footer />
    </>
  );
};

export default TryOn;
