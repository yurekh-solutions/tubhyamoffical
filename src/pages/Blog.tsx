import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { api } from '@/config/api';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  image: string;
  readTime: number;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get<{ success: boolean; blogs: BlogPost[] }>('/blogs');
      if (response.success) {
        setBlogPosts(response.blogs);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog - Fashion Tips & Styling Guides | Tubhyam</title>
        <meta name="description" content="Explore fashion tips, styling guides, and stories from the Tubhyam community. Discover the latest trends in women's formal wear." />
      </Helmet>
      
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
        {categories.length > 1 && (
          <section className="container mx-auto px-4 py-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all border ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/10'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="container mx-auto px-4 py-20">
            <div className="flex flex-col items-center justify-center">
              <Loader2 size={48} className="animate-spin text-primary" />
              <p className="text-foreground/60 mt-4">Loading articles...</p>
            </div>
          </section>
        )}

        {/* No Posts State */}
        {!loading && blogPosts.length === 0 && (
          <section className="container mx-auto px-4 py-20">
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                No articles yet
              </h2>
              <p className="text-foreground/60">
                Check back soon for fashion tips and styling guides!
              </p>
            </div>
          </section>
        )}

        {/* Featured Post */}
        {!loading && filteredPosts.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden rounded-xl border border-primary/30 grid md:grid-cols-3 gap-6 items-start mb-16 p-6"
            >
              <Link to={`/blog/${filteredPosts[0].slug}`} className="md:col-span-1 h-64 overflow-hidden rounded-lg flex-shrink-0 block">
                <img
                  src={filteredPosts[0].image || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover object-bottom hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="inline-block mb-4 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-semibold text-primary w-fit">
                  {filteredPosts[0].category}
                </div>
                <Link to={`/blog/${filteredPosts[0].slug}`}>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 text-foreground hover:text-primary transition-colors">
                    {filteredPosts[0].title}
                  </h2>
                </Link>
                <p className="text-foreground/70 mb-4 leading-relaxed text-sm md:text-base">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex flex-wrap gap-4 text-xs md:text-sm text-foreground/60 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(filteredPosts[0].publishedAt)}</span>
                  </div>
                  <span>{filteredPosts[0].readTime} min read</span>
                </div>
                <Link 
                  to={`/blog/${filteredPosts[0].slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
                >
                  Read More <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          </section>
        )}

        {/* Blog Grid */}
        {!loading && filteredPosts.length > 1 && (
          <section className="container mx-auto px-4 py-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-heading font-bold mb-12 text-gradient-gold"
            >
              Latest Articles
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(1).map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card overflow-hidden rounded-lg border border-primary/30 hover:border-primary/60 transition-all group flex flex-col"
                >
                  <Link to={`/blog/${post.slug}`} className="h-40 overflow-hidden rounded-t-lg flex-shrink-0 block">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'}
                      alt={post.title}
                      className="w-full h-full object-cover object-bottom group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="inline-block mb-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-semibold text-primary w-fit">
                      {post.category}
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-base md:text-lg font-heading font-bold mb-2 text-foreground line-clamp-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-foreground/70 text-xs md:text-sm mb-3 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-foreground/60 mb-3 pb-3 border-b border-primary/20">
                      <span className="flex-shrink-0">{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground/60">{post.readTime} min read</span>
                      <Link to={`/blog/${post.slug}`} className="text-primary hover:text-primary/80 transition-colors">
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

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
