import { Instagram } from 'lucide-react';

const instagramPosts = [
  {
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&h=400&q=80",
    likes: 1247
  },
  {
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&h=400&q=80",
    likes: 892
  },
  {
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&h=400&q=80",
    likes: 1536
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&h=400&q=80",
    likes: 2103
  },
  {
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=400&h=400&q=80",
    likes: 756
  },
  {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&h=400&q=80",
    likes: 1892
  }
];

const InstagramFeed = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary uppercase tracking-widest text-sm mb-4">Follow Us</p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-4">
            <span className="text-gradient-gold">@tubhyamofficial</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join our community of fashion lovers and get inspired by the latest trends
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <a
              key={index}
              href="https://www.instagram.com/tubhyamofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2">
                    <Instagram size={16} />
                    <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/tubhyamofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 glass-card rounded-full font-medium hover:border-primary/30 transition-all duration-300 hover:scale-105"
          >
            <Instagram size={20} className="text-primary" />
            Follow @tubhyamofficial
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
