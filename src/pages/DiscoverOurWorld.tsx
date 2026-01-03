import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Heart, Users, Globe, Leaf, Award, Zap, ArrowRight } from 'lucide-react';

const DiscoverOurWorld = () => {
  const worldSections = [
    {
      title: "Our Heritage",
      subtitle: "Rooted in Tradition, Modern in Spirit",
      description: "Tubhyam (तुम्हारे लिए - 'For You') was born from a simple belief: every Indian woman deserves premium clothing that celebrates her individuality. Our journey began with a vision to craft pants that go beyond fashion—they're a confidence booster.",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?auto=format&fit=crop&w=1200&q=80",
      points: ["Established with passion", "Crafted with precision", "Inspired by Indian culture"]
    },
    {
      title: "Our Craftsmanship",
      subtitle: "Where Quality Meets Artistry",
      description: "Every Tubhyam piece tells a story of meticulous attention to detail. From handpicking the finest fabrics to ensuring flawless stitching, we maintain the highest standards of craftsmanship. Our artisans work tirelessly to create pants that not only look beautiful but feel luxurious.",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
      points: ["Premium fabric selection", "Expert tailoring", "Quality assurance at every step"]
    },
    {
      title: "Our Sustainability",
      subtitle: "Fashion with a Conscience",
      description: "We believe luxury should never come at the expense of our planet. Tubhyam is committed to sustainable practices throughout our supply chain. We use eco-friendly materials, ethical manufacturing processes, and minimize our environmental footprint.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      points: ["Eco-friendly materials", "Ethical sourcing", "Sustainable packaging"]
    },
    {
      title: "Our Community",
      subtitle: "Empowering Women Worldwide",
      description: "Behind every Tubhyam product is a community of passionate individuals working to empower women. From our talented designers to our dedicated craftspeople, we celebrate diversity and inclusion in everything we do.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      points: ["Women-led team", "Community support", "Social responsibility"]
    }
  ];

  const values = [
    { icon: Heart, title: "Passion", description: "We pour our hearts into every creation" },
    { icon: Users, title: "Inclusivity", description: "Fashion for every body and style" },
    { icon: Globe, title: "Global Reach", description: "Premium quality, locally crafted" },
    { icon: Leaf, title: "Sustainability", description: "Conscious choices for a better tomorrow" },
    { icon: Award, title: "Excellence", description: "Uncompromising quality standards" },
    { icon: Zap, title: "Innovation", description: "Evolving fashion with the times" }
  ];

  return (
    <>
      <SEO
        title="Discover Our World | Tubhyam's Story, Values & Sustainability"
        description="Explore Tubhyam's journey, heritage, and commitment to premium fashion. Discover our craftsmanship, sustainability practices, and the community behind our brand."
        keywords="Tubhyam brand story, premium women's fashion, sustainable clothing, Indian fashion heritage, ethical manufacturing, craftsmanship, brand values"
        url="https://tubhyam.com/discover-our-world"
        type="article"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-background to-accent/15">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center py-24">
          <h1 className="font-heading text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Our <span className="text-gradient-gold">World</span>
          </h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Step into the Tubhyam universe where tradition meets modernity, and every stitch tells a story of passion and purpose
          </p>
        </div>
      </section>

      {/* Our Values Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-widest text-sm font-semibold mb-4">Our Core Values</p>
            <h2 className="font-heading text-5xl font-bold">
              What Drives <span className="text-gradient-gold">Tubhyam</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="group relative overflow-hidden rounded-2xl p-8 glass-card backdrop-blur-xl border border-primary/20 hover:border-primary/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Story Sections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {worldSections.map((section, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
                {/* Content */}
                <div className="flex-1">
                  <p className="text-primary uppercase tracking-widest text-sm font-semibold mb-4">{section.subtitle}</p>
                  <h2 className="font-heading text-5xl font-bold mb-6">
                    {section.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {section.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {section.points.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <p className="text-sm font-medium">{point}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/products"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                  >
                    Explore Collection
                    <ArrowRight size={20} />
                  </Link>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <div className="relative overflow-hidden rounded-3xl h-96 md:h-full md:min-h-96">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/20 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-5xl font-bold mb-6">
              Join Our <span className="text-gradient-gold">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Be part of a movement that celebrates women's confidence, craftsmanship, and conscious fashion. Experience Tubhyam—where premium meets purpose.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/products"
                className="px-10 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 inline-block"
              >
                Shop Now
              </Link>
              <Link
                to="/video-call"
                className="px-10 py-4 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all duration-300 inline-block"
              >
                Book Styling Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default DiscoverOurWorld;
