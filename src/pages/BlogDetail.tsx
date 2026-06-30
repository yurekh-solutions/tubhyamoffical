import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { api } from '@/config/api';
import ainosImg from '@/assets/ainos.jpeg';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  keywords: string[];
  image: string;
  author: string;
  readTime: number;
  publishedAt: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; blog: Blog }>(`/blogs/${slug}`);
      
      if (response.success && response.blog) {
        setBlog(response.blog);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      console.error('Failed to fetch blog:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              {error || 'Blog post not found'}
            </h2>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              <ArrowLeft size={18} />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Tubhyam Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta name="keywords" content={blog.keywords.join(', ')} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        {blog.image && <meta property="og:image" content={blog.image} />}
        <meta property="og:type" content="article" />
      </Helmet>
      
      <Navbar />
      <ScrollToTop />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>

          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <img src={ainosImg} alt="AINOS" className="w-12 h-12 rounded-full object-cover border-2 border-primary/30 p-0.5" />
                <span className="text-sm font-semibold text-primary/80">Powered by AINOS</span>
              </div>
              <div className="inline-block mb-4 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-semibold text-primary">
                {blog.category}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6">
                {blog.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {blog.image && (
              <div className="mb-8 rounded-xl overflow-hidden border border-primary/20 h-64 md:h-80">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-invert prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-foreground/80 prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Keywords */}
            {blog.keywords.length > 0 && (
              <div className="mt-12 pt-8 border-t border-primary/20">
                <h3 className="text-sm font-semibold text-foreground/60 mb-3">Related Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 border-t border-primary/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-foreground">
              Enjoyed this article?
            </h2>
            <p className="text-foreground/80 mb-6">
              Explore our collection of premium women's fashion
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogDetail;
