import { useEffect } from "react";
import { motion } from "framer-motion";
import { Ruler, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import Cart from "@/components/Cart";
import ScrollToTop from "@/components/ScrollToTop";

const sizeCharts = {
  jeans: {
    title: "Jeans",
    description: "Denim sizes are based on waist measurement in inches",
    sizes: [
      { size: "26", waist: "66 cm / 26\"", hip: "86 cm / 34\"", inseam: "76 cm / 30\"", rise: "25 cm / 10\"" },
      { size: "28", waist: "71 cm / 28\"", hip: "91 cm / 36\"", inseam: "76 cm / 30\"", rise: "26 cm / 10.5\"" },
      { size: "30", waist: "76 cm / 30\"", hip: "96 cm / 38\"", inseam: "76 cm / 30\"", rise: "27 cm / 10.5\"" },
      { size: "32", waist: "81 cm / 32\"", hip: "101 cm / 40\"", inseam: "76 cm / 30\"", rise: "28 cm / 11\"" },
      { size: "34", waist: "86 cm / 34\"", hip: "106 cm / 42\"", inseam: "76 cm / 30\"", rise: "29 cm / 11.5\"" },
    ],
  },
  formal: {
    title: "Formal Pants",
    description: "Standard sizing for professional wear",
    sizes: [
      { size: "XS", waist: "64-66 cm / 25-26\"", hip: "84-87 cm / 33-34\"", inseam: "76 cm / 30\"", length: "100 cm / 39\"" },
      { size: "S", waist: "68-71 cm / 27-28\"", hip: "89-92 cm / 35-36\"", inseam: "76 cm / 30\"", length: "101 cm / 40\"" },
      { size: "M", waist: "74-76 cm / 29-30\"", hip: "94-97 cm / 37-38\"", inseam: "76 cm / 30\"", length: "102 cm / 40\"" },
      { size: "L", waist: "79-81 cm / 31-32\"", hip: "99-102 cm / 39-40\"", inseam: "76 cm / 30\"", length: "103 cm / 40.5\"" },
      { size: "XL", waist: "84-87 cm / 33-34\"", hip: "104-107 cm / 41-42\"", inseam: "76 cm / 30\"", length: "104 cm / 41\"" },
    ],
  },
  track: {
    title: "Track Pants",
    description: "Relaxed fit with elastic waistband",
    sizes: [
      { size: "XS", waist: "62-68 cm / 24-27\"", hip: "84-89 cm / 33-35\"", inseam: "71 cm / 28\"", length: "96 cm / 38\"" },
      { size: "S", waist: "66-74 cm / 26-29\"", hip: "89-94 cm / 35-37\"", inseam: "73 cm / 29\"", length: "98 cm / 38.5\"" },
      { size: "M", waist: "71-79 cm / 28-31\"", hip: "94-99 cm / 37-39\"", inseam: "74 cm / 29\"", length: "100 cm / 39\"" },
      { size: "L", waist: "76-84 cm / 30-33\"", hip: "99-104 cm / 39-41\"", inseam: "76 cm / 30\"", length: "102 cm / 40\"" },
      { size: "XL", waist: "81-89 cm / 32-35\"", hip: "104-109 cm / 41-43\"", inseam: "76 cm / 30\"", length: "104 cm / 41\"" },
    ],
  },
};

const measurementGuide = [
  {
    name: "Waist",
    description: "Measure around your natural waistline, keeping the tape comfortably loose.",
  },
  {
    name: "Hip",
    description: "Measure around the fullest part of your hips, about 20 cm below your waist.",
  },
  {
    name: "Inseam",
    description: "Measure from the crotch seam to the bottom of the leg along the inner seam.",
  },
  {
    name: "Rise",
    description: "Measure from the crotch seam to the top of the waistband.",
  },
];

export default function SizeGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      
      <Navbar />
      <ScrollToTop />

      <main className="min-h-screen pt-4 pb-16">
        {/* Header */}
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <Ruler className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-medium">
                Size Guide
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Find your perfect fit with our comprehensive measurement charts.
                All measurements are in centimeters and inches.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* How to Measure */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="font-display text-2xl md:text-3xl font-medium text-center mb-8">
              How to Measure
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {measurementGuide.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-strong p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 border border-primary/30">
                    <span className="font-display font-semibold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-medium text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Size Charts */}
          <div className="space-y-16">
            {Object.entries(sizeCharts).map(([key, chart], chartIndex) => (
              <motion.section
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: chartIndex * 0.1 }}
              >
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl md:text-3xl font-medium">
                    {chart.title}
                  </h2>
                  <p className="text-muted-foreground mt-2">{chart.description}</p>
                </div>

                <div className="glass-strong rounded-lg overflow-hidden border border-primary/20">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-primary/30 bg-primary/5">
                          <th className="px-6 py-4 text-left font-display font-medium text-foreground">
                            Size
                          </th>
                          <th className="px-6 py-4 text-left font-display font-medium text-foreground">
                            Waist
                          </th>
                          <th className="px-6 py-4 text-left font-display font-medium text-foreground">
                            Hip
                          </th>
                          <th className="px-6 py-4 text-left font-display font-medium text-foreground">
                            Inseam
                          </th>
                          <th className="px-6 py-4 text-left font-display font-medium text-foreground">
                            {key === "jeans" ? "Rise" : "Length"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chart.sizes.map((row, index) => (
                          <tr
                            key={row.size}
                            className={`border-b border-primary/20 transition-colors hover:bg-primary/5 ${
                              index % 2 === 0 ? "bg-secondary/20" : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm border border-primary/40">
                                {row.size}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {row.waist}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {row.hip}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {row.inseam}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {"rise" in row ? row.rise : row.length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* Tips Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="glass-strong p-8 rounded-lg border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    Sizing Tips
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        If you are between sizes, we recommend sizing up for a
                        more comfortable fit.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        Our formal pants run true to size with a regular fit.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        Track pants have an elastic waistband for a flexible fit
                        within the size range.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        Denim may stretch slightly with wear. Consider this when
                        choosing your jeans size.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        For personalized sizing help, contact us on WhatsApp and
                        we will be happy to assist!
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </>
  );
}
