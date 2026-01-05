import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import formal1 from '@/assets/formals/formal-7.jpeg';
import formal2 from '@/assets/formals/formal-8.jpeg';
import formal3 from '@/assets/formals/formal-pants-1.jpg';
import formal4 from '@/assets/formals/formal-pants-2.jpg';
import formal5 from '@/assets/formals/formal-pants-3.jpg';
import jeans1 from '@/assets/products/jeans-1.jpg';
import jeans2 from '@/assets/products/jeans-2.jpg';
import jeans3 from '@/assets/products/jeans-3.jpg';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Choosing the Perfect Pair of Pants",
      excerpt: "Discover how to find pants that complement your body type and personal style perfectly.",
      category: "Fashion Tips",
      author: "Priya Sharma",
      date: "Dec 20, 2024",
      image: formal1,
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Sustainable Fashion: Why It Matters",
      excerpt: "Learn about our commitment to ethical production and eco-conscious practices in the fashion industry.",
      category: "Sustainability",
      author: "Ananya Patel",
      date: "Dec 15, 2024",
      image: formal2,
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Styling Tips: From Office to Evening",
      excerpt: "Transform your Tubhyam pants for every occasion with these styling inspiration ideas.",
      category: "Styling",
      author: "Rahul Verma",
      date: "Dec 10, 2024",
      image: formal3,
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "The Journey of Premium Fabric Selection",
      excerpt: "Behind the scenes: How we carefully curate the finest fabrics for our collections.",
      category: "Craftsmanship",
      author: "Priya Sharma",
      date: "Dec 5, 2024",
      image: formal4,
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Size Guide Essentials: Finding Your Perfect Fit",
      excerpt: "Everything you need to know about sizing and getting the perfect fit for your body.",
      category: "Fashion Tips",
      author: "Ananya Patel",
      date: "Nov 28, 2024",
      image: formal5,
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "Trending Colors & Styles This Season",
      excerpt: "Explore the hottest colors and silhouettes dominating the fashion world right now.",
      category: "Trends",
      author: "Rahul Verma",
      date: "Nov 20, 2024",
      image: jeans1,
      readTime: "6 min read"
    }
  ];

  const categories = ["All", "Fashion Tips", "Sustainability", "Styling", "Craftsmanship", "Trends"];

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 border-b border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gradient-gold mb-6">
              Our Blog
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              Fashion tips, styling guides, and stories from the Tubhyam community
            </p>
          </motion.div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-6 py-2 rounded-full font-medium transition-all border ${
                  index === 0
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/10'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Featured Post */}
        <section className="container mx-auto px-4 py-12">
          {blogPosts.length > 0 && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden rounded-xl border border-primary/30 grid md:grid-cols-3 gap-6 items-start mb-16 p-6"
            >
              <div className="md:col-span-1 h-64 overflow-hidden rounded-lg flex-shrink-0">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="inline-block mb-4 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-semibold text-primary w-fit">
                  {blogPosts[0].category}
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 text-foreground">
                  {blogPosts[0].title}
                </h2>
                <p className="text-foreground/70 mb-4 leading-relaxed text-sm md:text-base">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex flex-wrap gap-4 text-xs md:text-sm text-foreground/60 mb-4">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>{blogPosts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{blogPosts[0].date}</span>
                  </div>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm">
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          )}
        </section>

        {/* Blog Grid */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-heading font-bold mb-12 text-gradient-gold"
          >
            Latest Articles
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden rounded-lg border border-primary/30 hover:border-primary/60 transition-all group flex flex-col"
              >
                <div className="h-40 overflow-hidden rounded-t-lg flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="inline-block mb-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-semibold text-primary w-fit">
                    {post.category}
                  </div>
                  <h3 className="text-base md:text-lg font-heading font-bold mb-2 text-foreground line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-foreground/70 text-xs md:text-sm mb-3 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-foreground/60 mb-3 pb-3 border-b border-primary/20">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span className="line-clamp-1">{post.author}</span>
                    </div>
                    <span className="flex-shrink-0">{post.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/60">{post.readTime}</span>
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="container mx-auto px-4 py-20 border-y border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto border border-primary/30 rounded-xl"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-foreground">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-foreground/80 mb-6 text-sm md:text-base">
              Get the latest fashion tips, styling ideas, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/50 text-sm"
              />
              <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm">
                Subscribe
              </button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
