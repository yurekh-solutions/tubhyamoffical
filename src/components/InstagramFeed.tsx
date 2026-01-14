import { Helmet } from "react-helmet-async";
import { Instagram } from "lucide-react";
import logo from "@/assets/looo.png";

const InstagramFeed = () => {
  return (
    <>
      {/* SEO */}
      <Helmet>
        <link rel="me" href="https://www.instagram.com/tubhyamofficial/" />
      </Helmet>

      <section className="py-14 md:py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="container mx-auto px-4">

          {/* SECTION HEADER */}
          <div className="text-center mb-8 md:mb-12">
            <p className="text-primary uppercase tracking-widest text-xs md:text-sm font-semibold mb-2">
              Follow Us on Instagram
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              @tubhyamofficial
            </h2>
          </div>

          {/* 🔹 PROFILE CARD (Website Look) */}
          <div className="max-w-4xl mx-auto mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
              
              {/* Profile Image */}
              <img
                src={logo}
                alt="Tubhyam"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-primary shadow-lg ring-2 ring-primary/20"
              />

              {/* Name + Verified + Description */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h3 className="font-bold text-xl md:text-2xl">
                    tubhyamofficial
                  </h3>

                  {/* ✅ Enhanced Blue Tick - More Visible */}
                  <svg
                    className="w-6 h-6 md:w-7 md:h-7 text-[#1DA1F2] drop-shadow-[0_2px_8px_rgba(29,161,242,0.5)]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-label="Verified Badge"
                  >
                    <path d="M22.5 12l-2.3-2.6.3-3.4-3.3-.8-1.7-3-3 1.6-3-1.6-1.7 3-3.3.8.3 3.4L1.5 12l2.3 2.6-.3 3.4 3.3.8 1.7 3 3-1.6 3 1.6 1.7-3 3.3-.8-.3-3.4L22.5 12zM10.7 15.3l-3-3 1.4-1.4 1.6 1.6 4-4 1.4 1.4-5.4 5.4z" />
                  </svg>
                </div>

                <p className="text-sm md:text-base text-muted-foreground mb-1">
                  Official Verified Instagram Account
                </p>
                <p className="text-xs md:text-sm text-muted-foreground/80">
                  Tubhyam • 30.1K followers
                </p>
              </div>

              {/* Follow Button */}
              <a
                href="https://www.instagram.com/tubhyamofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0095F6] to-[#1877F2] text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <Instagram className="w-5 h-5" />
                Follow
              </a>
            </div>
          </div>

          {/* 🔥 INSTAGRAM EMBED - Fixed Height & No Scrolling */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="relative w-full" 
                style={{ 
                  height: '600px',
                  maxHeight: '80vh'
                }}
              >
                <iframe 
                  src="https://www.instagram.com/tubhyamofficial/embed" 
                  className="absolute top-0 left-0 w-full h-full border-0"
                  scrolling="no"
                  frameBorder="0"
                  allowTransparency={true}
                  loading="lazy"
                  title="Instagram Feed"
                  style={{
                    overflow: 'hidden',
                    display: 'block',
                    pointerEvents: 'auto'
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default InstagramFeed;
