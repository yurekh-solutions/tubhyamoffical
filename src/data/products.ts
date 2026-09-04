import { api } from '@/config/api';

export interface Product {
  id: string;
  mongoId?: string; // MongoDB _id for backward-compatible URL resolution
  sku?: string;     // Inventory SKU (often matches id; present on API responses)
  name: string;
  price: number;
  originalPrice?: number;
  category: 'formal' | 'jeans' | 'track';
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  material: string;

  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;

  // Color-to-image mapping for multi-color products
  colorImages?: Record<string, string[]>;

  // Per-image caption shown beneath the main image on the detail page
  imageCaptions?: Record<string, string>;

  // Optional fields populated by API
  fabric?: string;
  rating?: number;
  reviewCount?: number;
  careInstructions?: string[];

  // AI-generated model photos for "Try it on" feature
  tryOnImages?: string[];
}

export const products: Product[] = [
  // BROWN CORD SET - with AI Try-On images
  {
    id: "cord-set-001",
    name: "Brown Contrast Lace-edged 2pc Co-ords",
    category: "formal",
    price: 1197,
    originalPrice: 1699,
    image: '/images/products/brown-cordset-1.jpg',
    images: ['/images/products/brown-cordset-1.jpg', '/images/products/brownlace.jpg', '/images/products/brownlace1.jpg'],
    tryOnImages: [
      '/images/products/brown-cordset-model.jpg',
    ],
    imageCaptions: {
      '/images/products/brown-cordset-1.jpg': 'Full set view - Brown lace top with wide-leg pants.',
      '/images/products/brownlace.jpg': 'Lace top detail.',
      '/images/products/brownlace1.jpg': 'Side view.',
    },
    description: "Elegant brown 2-piece co-ord set featuring a contrast lace-edged corset top and wide-leg trousers with belt. Perfect for evening wear and special occasions. Premium fabric with intricate lace detailing.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown"],
    material: "Premium Polyester Blend with Lace",
    inStock: true,
    isNew: true,
    isBestSeller: false,
  },
  // TEST PRODUCT - ₹1 for payment testing
  {
    id: "test-001",
    name: "Cloud Grey Comfort Joggers (Test)",
    category: "track",
    price: 1,
    originalPrice: 1699,
    image: '/images/products/track-pants-2.jpg',
    images: ['/images/products/track-pants-2.jpg'],
    description: "TEST PRODUCT - ₹1 for payment testing. Same as Cloud Grey Comfort Joggers.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey"],
    material: "Soft Cotton Blend",
    inStock: true,
    isBestSeller: false,
  },
  {
    id: "pt-004",
    name: "Relaxed Fit Elastic Waist Trousers",
    category: "track",
    price: 1899,
    image: '/images/products/olivecomfort.jpg',
    images: ['/images/products/olivecomfort.jpg', '/images/products/olivecomfort1.jpg', '/images/products/olivecomfort2.jpg', '/images/products/olivecomfort3.jpg'],
    imageCaptions: {
      '/images/products/olivecomfort.jpg': 'Front view in Olive Green, comfort-fit.',
      '/images/products/olivecomfort1.jpg': 'Side angle in Olive Green, comfort-fit.',
      '/images/products/olivecomfort2.jpg': 'Back view in Olive Green, comfort-fit.',
      '/images/products/olivecomfort3.jpg': 'Waistband detail in Olive Green.',
    },
    description:
      "Minimalist relaxed-fit trousers featuring an elastic waistband for all-day comfort. Designed with a straight wide-leg silhouette, these trousers offer a clean, effortless look suitable for casual and semi-formal wear. Premium olive tone with versatile styling options shown in multiple views.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Olive Green"],
    material: "Cotton Blend Fabric",
    inStock: true,
  },
{
  id: "pt-005",
  name: "Drawstring Relaxed Fit Pants",
  category: "track",
  price: 1999,
  image: '/images/products/blankpants.jpg',
  images: ['/images/products/blankpants.jpg'],
  description:
    "Comfort-first relaxed fit pants featuring an elastic waistband with contrast drawstring detailing. Designed with a straight-leg silhouette and soft fabric for effortless everyday styling and maximum comfort.",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["Black"],
  material: "Soft Cotton Blend",
  inStock: true,
},


  {
    id: "fp-001",
    name: "Elegance Wide-Leg Trousers",
    category: "formal",
    price: 2499,
    originalPrice: 3499,
    image: '/images/products/formal-6.jpg',
    images: ['/images/products/formal-6.jpg'],
    description: "Sophisticated beige wide-leg trousers crafted from premium fabric. Features high-waist design with elegant pleats for a refined silhouette. Perfect for office wear and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige"],
    material: "Premium Polyester Blend",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-002",
    name: "Camel Classic Palazzo",
    category: "formal",
    price: 2799,
    image: '/images/products/formal-pants-2.jpg',
    images: ['/images/products/formal-pants-2.jpg'],
    description: "Timeless camel-toned palazzo pants with a flattering high-waist cut. The flowing silhouette and premium fabric make this piece a wardrobe essential for the modern woman.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Camel"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-003",
    name: "Navy Executive Trousers",
    category: "formal",
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/formal-pants-3.jpg',
    images: ['/images/products/formal-pants-3.jpg'],
    description: "Commanding navy blue executive trousers with impeccable tailoring. Features crisp pleats and a sleek wide-leg design that transitions effortlessly from boardroom to evening.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Navy Blue"],
    material: "Wool Blend",
    inStock: true,
  },
 
  {
    id: "jn-003",
    name: "Vintage Wash Flare Jeans",
    category: "jeans",
    price: 2599,
    image: '/images/products/jeans-3.jpg',
    images: ['/images/products/jeans-3.jpg'],
    description: "Retro-inspired light wash flare jeans with a flattering high-rise fit. The subtle flare creates an elongating effect while the soft denim ensures all-day comfort.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Light Wash"],
    material: "Premium Cotton Denim",
    inStock: true,
  },
  {
    id: "jn-004",
    name: "Classic Blue Wide-Leg Jeans",
    category: "jeans",
    price: 2499,
    image: '/images/products/jeans-8.jpg',
    images: ['/images/products/jeans-8.jpg'],
    description: "Timeless blue wide-leg jeans with a modern silhouette. Features high-waist design with premium denim fabric for comfortable all-day wear and effortless style.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Classic Blue"],
    material: "Premium Denim",
    inStock: true,
    isNew: true,
  },
  {
    id: "jn-005",
    name: "Relaxed Fit Straight Jeans",
    category: "jeans",
    price: 2699,
    originalPrice: 3299,
    image: '/images/products/jeans-33.jpg',
    images: ['/images/products/jeans-33.jpg'],
    description: "Comfortable relaxed fit straight jeans with vintage-inspired wash. Perfect blend of classic styling and contemporary comfort for everyday casual wear.",
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Wash"],
    material: "100% Cotton Denim",
    inStock: true,
    isBestSeller: true,
  },
 
  {
    id: "tp-002",
    name: "Cloud Grey Comfort Joggers",
    category: "track",
    price: 1699,
    image: '/images/products/track-pants-2.jpg',
    images: ['/images/products/track-pants-2.jpg'],
    description: "Ultra-soft grey joggers designed for maximum comfort without compromising on style. Perfect for lounging at home or running errands in effortless elegance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Grey"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "tp-005",
    name: "Slim Fit Ankle Joggers",
    category: "track",
    price: 1899,
    image: '/images/products/slimfit.jpg',
    images: ['/images/products/slimfit.jpg'],
    description: "Modern slim-fit joggers with ankle-length design. Features elastic waistband with contrast drawstring and side pockets. Perfect for athleisure and casual styling.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Performance Stretch Fabric",
    inStock: true,
    isNew: true,
  },
  {
    id: "tp-006",
    name: "Classic Grey Trousers",
    category: "track",
    price: 1799,
    image: '/images/products/trousersgrey.jpg',
    images: ['/images/products/trousersgrey.jpg'],
    description: "Comfortable grey trousers with relaxed fit. Features elastic waistband and side pockets. Perfect for loungewear and casual everyday comfort.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey"],
    material: "Soft Cotton Blend",
    inStock: true,
  },
  {
    id: "tp-007",
    name: "Classic Beige Trousers",
    category: "track",
    price: 1799,
    image: '/images/products/trousers.jpg',
    images: ['/images/products/trousers.jpg'],
    description: "Versatile beige trousers with comfortable fit. Features elastic waistband and practical pocket design. Ideal for casual wear and relaxed styling.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige"],
    material: "Soft Cotton Blend",
    inStock: true,
  },
  
  {
    id: "fp-005",
    name: "Olive Sophisticated Pants",
    category: "formal",
    price: 2599,
    image: '/images/products/olive-fomral-belt.jpg',
    images: ['/images/products/olive-fomral-belt.jpg'],
    description: "Elegant olive green trousers perfect for creating a statement at work or formal events. Crafted with premium fabric and impeccable seams for lasting quality.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-007",
    name: "Rose Gold Formal Pants",
    category: "formal",
    price: 2699,
    image: '/images/products/formal-1.jpg',
    images: ['/images/products/formal-1.jpg'],
    description: "Luxurious rose gold-toned formal pants with a subtle shimmer. High-waisted design with elegant draping for an effortlessly chic appearance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Gold"],
    material: "Premium Cotton Blend",
    inStock: true,
  },
  {
    id: "fp-008",
    name: "Teal Statement Trousers",
    category: "formal",
    price: 2799,
    originalPrice: 3599,
    image: '/images/products/formal-2.jpg',
    images: ['/images/products/formal-2.jpg'],
    description: "Bold teal formal trousers that make an elegant statement. Perfect for creative professionals who want sophistication with a twist of personality.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Teal"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-009",
    name: "Premium Beige Formal Pants",
    category: "formal",
    price: 2699,
    image: '/images/products/beige-formal.jpg',
    images: ['/images/products/beige-formal.jpg'],
    description: "Classic beige formal pants with elegant design. Perfect for professional settings with comfortable fit and premium fabric quality.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige"],
    material: "Premium Polyester Blend",
    inStock: true,
  },
  {
    id: "fp-010",
    name: "Belt Formal Pants",
    category: "formal",
    price: 2799,
    originalPrice: 3599,
    image: '/images/products/belt-formal-balck.jpg',
    images: ['/images/products/belt-formal-balck.jpg', '/images/products/belt-formal-beige.jpg', '/images/products/belt-formal-beige1.jpg', '/images/products/belt-formal-beige2.jpg'],
    imageCaptions: {
      '/images/products/belt-formal-balck.jpg': 'Front view, with belt detail.',
      '/images/products/belt-formal-beige.jpg': 'Front view in Beige, with belt detail.',
      '/images/products/belt-formal-beige1.jpg': 'Front view in Beige, with belt detail.',
      '/images/products/belt-formal-beige2.jpg': 'Front view in Beige, with belt detail.',
    },
    colorImages: {
      'Black': ['/images/products/belt-formal-balck.jpg'],
      'Beige': ['/images/products/belt-formal-beige.jpg', '/images/products/belt-formal-beige1.jpg', '/images/products/belt-formal-beige2.jpg'],
    },
    description: "Elegant belt formal pants available in classic Black and versatile Beige. Tailored cut with comfortable waistband and belt loops for sophisticated professional styling. Features side pockets and premium finish perfect for office wear, business meetings, and formal occasions. The sleek silhouette pairs beautifully with any formal shirt or blazer.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Beige"],
    material: "Premium Cotton Blend",
    inStock: true,
    isBestSeller: true,
    isNew: true,
  },
  {
    id: "fp-012",
    name: "Imported Belt Formal Pants",
    category: "formal",
    price: 3299,
    originalPrice: 4199,
    image: '/images/products/belt-imported.jpg',
    images: ['/images/products/belt-imported.jpg'],
    description: "Premium imported formal pants with belt styling. Features superior fabric quality and impeccable tailoring for the modern professional.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Gray"],
    material: "Imported Premium Fabric",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-013",
    name: "Olive Formal Belt Pants",
    category: "formal",
    price: 2899,
    image: '/images/products/olive-formal-belt.jpg',
    images: ['/images/products/olive-formal-belt.jpg'],
    description: "Sophisticated olive formal pants with belt design. Perfect blend of style and comfort for executive and professional settings.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-014",
    name: "Brown Formal Pants",
    category: "formal",
    price: 2699,
    image: '/images/products/brown-formal.jpg',
    images: ['/images/products/brown-formal.jpg', '/images/products/brown1-formal.jpg', '/images/products/brown.jpg'],
    imageCaptions: {
      '/images/products/brown-formal.jpg': 'Front view in Brown.',
      '/images/products/brown1-formal.jpg': 'Front view in Brown.',
      '/images/products/brown.jpg': 'Front view in Brown.',
    },
    description: "Classic brown formal pants with refined tailoring and a flattering high-waisted wide-leg silhouette. Features front pleats, belt loops, and a comfortable relaxed fit crafted from premium fabric. Shown from multiple angles for a complete view. Timeless design perfect for office wear, business meetings, and versatile professional styling.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Brown"],
    material: "Premium Polyester Blend",
    inStock: true,
  },
  {
    id: "fp-015",
    name: "Imported Baggy Pleated Pants",
    category: "formal",
    price: 3099,
    originalPrice: 3899,
    image: '/images/products/imported-beggy-black.jpg',
    images: ['/images/products/imported-beggy-black.jpg', '/images/products/imported-beggy-black-formal.jpg', '/images/products/imported-beggy-gray.jpg', '/images/products/imported-beggy-gray-formal.jpg'],
    imageCaptions: {
      '/images/products/imported-beggy-black.jpg': 'Front view in Black, baggy-fit style.',
      '/images/products/imported-beggy-black-formal.jpg': 'Side angle in Black, baggy-fit style.',
      '/images/products/imported-beggy-gray.jpg': 'Front view in Gray, baggy-fit style.',
      '/images/products/imported-beggy-gray-formal.jpg': 'Side angle in Gray, baggy-fit style.',
    },
    colorImages: {
      'Black': ['/images/products/imported-beggy-black.jpg', '/images/products/imported-beggy-black-formal.jpg'],
      'Gray': ['/images/products/imported-beggy-gray.jpg', '/images/products/imported-beggy-gray-formal.jpg'],
    },
    description: "Trendy imported baggy pleated pants available in classic Black and modern Gray. Featuring a dramatic ultra-wide balloon silhouette with deep front pleats, button closure, and belt loops crafted from premium imported fabric. The exaggerated wide-leg cut tapers gently at the hem for a bold, fashion-forward drape. Shown from front and side angles in both colors. Perfect for making a statement at the office, smart-casual events, and contemporary formal occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray"],
    material: "Imported Premium Fabric",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "fp-017",
    name: "Premium Belted Pleated Pants",
    category: "formal",
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/preuim-black.jpg',
    images: ['/images/products/preuim-black.jpg', '/images/products/buttoncargo.jpg', '/images/products/preuim-gray.jpg', '/images/products/preuim-grayy.jpg', '/images/products/preuim-dark-brown.jpg', '/images/products/preuim-dark-brownn.jpg'],
    imageCaptions: {
      '/images/products/preuim-black.jpg': 'Front view in Black, with belt detail.',
      '/images/products/buttoncargo.jpg': 'Side angle in Black, with belt detail.',
      '/images/products/preuim-gray.jpg': 'Front view in Graphite, with belt detail.',
      '/images/products/preuim-grayy.jpg': 'Alternate angle in Graphite, with belt detail.',
      '/images/products/preuim-dark-brown.jpg': 'Front view in Dark Brown, with belt detail.',
      '/images/products/preuim-dark-brownn.jpg': 'Alternate angle in Dark Brown, with belt detail.',
    },
    colorImages: {
      'Black': ['/images/products/preuim-black.jpg', '/images/products/buttoncargo.jpg'],
      'Graphite': ['/images/products/preuim-gray.jpg', '/images/products/preuim-grayy.jpg'],
      'Dark Brown': ['/images/products/preuim-dark-brown.jpg', '/images/products/preuim-dark-brownn.jpg'],
    },
    description: "Premium belted pleated pants with superior tailoring available in three timeless colors — classic Black, sophisticated Graphite, and luxurious Dark Brown. Features a high-waisted pleated silhouette with an integrated wide belt and rectangular buckle that cinches into a dramatic tapered balloon leg. Crafted from premium fabric with a subtle sheen for ultimate professional elegance. Shown from multiple angles in every colour. Perfect for business attire, executive meetings, and formal events.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Graphite", "Dark Brown"],
    material: "Premium Wool Blend",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-020",
    name: "Slim Fit Formal Pants - Black/Grey",
    category: "formal",
    price: 2799,
    image: '/images/products/slimfit-formal-pants-black-grey.jpg',
    images: ['/images/products/slimfit-formal-pants-black-grey.jpg'],
    description: "Modern slim fit formal pants available in black and grey. Tailored cut with stretch fabric for comfort and sophisticated professional styling.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Stretch Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-021",
    name: "White Formal Belt Pants",
    category: "formal",
    price: 2799,
    image: '/images/products/white-formal-belt.jpg',
    images: ['/images/products/white-formal-belt.jpg'],
    description: "Crisp white formal pants with belt design. Fresh, elegant styling perfect for summer business wear and formal occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-022",
    name: "Premium Brown Belt Formal Pants",
    category: "formal",
    price: 3999,
    originalPrice: 4500,
    image: '/images/products/brownbelt1.jpg',
    images: ['/images/products/brownbelt1.jpg', '/images/products/brownbelt2.jpg', '/images/products/brownbelt3.jpg', '/images/products/brownbelt4.jpg'],
    imageCaptions: {
      '/images/products/brownbelt1.jpg': 'Front view in Brown, with belt detail.',
      '/images/products/brownbelt2.jpg': 'Side angle in Brown, with belt detail.',
      '/images/products/brownbelt3.jpg': 'Close-up of belt buckle detail.',
      '/images/products/brownbelt4.jpg': 'Back view in Brown, with belt detail.',
    },
    description: "Luxurious brown formal pants with elegant belt design. Features refined tailoring and premium fabric for sophisticated professional styling. Perfect for executive meetings and formal occasions with impeccable finish.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown"],
    material: "Premium Wool Blend",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "fp-023",
    name: "Grey Lace Formal Pants",
    category: "formal",
    price: 2200,
    originalPrice: 2999,
    image: '/images/products/greylace.jpg',
    images: ['/images/products/greylace.jpg', '/images/products/greylaceback.jpg'],
    imageCaptions: {
      '/images/products/greylace.jpg': 'Front view in Grey, with lace trim.',
      '/images/products/greylaceback.jpg': 'Back view in Grey, with lace trim.',
    },
    description: "Elegant grey lace formal pants featuring delicate lace detailing and premium fabric. Perfect for special occasions and formal events. Crafted with comfort and style in mind for the modern woman.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Grey"],
    material: "Premium Lace Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-024",
    name: "Black Mom Fit Formal Trousers",
    category: "formal",
    price: 2100,
    originalPrice: 2400,
    image: '/images/products/blackmom.jpg',
    images: ['/images/products/blackmom.jpg', '/images/products/blackmom1.jpg'],
    imageCaptions: {
      '/images/products/blackmom.jpg': 'Front view in Black, mom-fit style.',
      '/images/products/blackmom1.jpg': 'Side angle in Black, mom-fit style.',
    },
    description: "Elegant black mom fit formal trousers featuring a comfortable relaxed fit with premium fabric. Perfect for office wear and formal occasions. Designed with a flattering silhouette that offers both style and comfort for the modern woman.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-025",
    name: "Side Snap-Button Wide-Leg Pants",
    category: "formal",
    price: 2399,
    originalPrice: 2999,
    image: '/images/products/buttoncargo1.jpg',
    images: ['/images/products/buttoncargo1.jpg', '/images/products/buttoncargo2.jpg'],
    imageCaptions: {
      '/images/products/buttoncargo1.jpg': 'Front view in Black, with button detailing.',
      '/images/products/buttoncargo2.jpg': 'Side angle in Black, showing snap-button placket.',
    },
    description: "Contemporary black wide-leg pants featuring statement side snap-button plackets that run the full length of each leg for a bold, versatile look. Designed with a comfortable drawstring elastic waist and a relaxed straight silhouette crafted from premium fabric. Shown from front and side angles. Perfect for smart-casual styling, evening outings, and fashion-forward occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-026",
    name: "Lace People Fit Formal Pants",
    category: "formal",
    price: 2399,
    originalPrice: 2999,
    image: '/images/products/blacklace.jpg',
    images: ['/images/products/blacklace.jpg', '/images/products/blacklace1.jpg', '/images/products/brownlace.jpg', '/images/products/brownlace1.jpg'],
    imageCaptions: {
      '/images/products/blacklace.jpg': 'Front view in Black, with lace trim.',
      '/images/products/blacklace1.jpg': 'Side angle in Black, with lace trim.',
      '/images/products/brownlace.jpg': 'Front view in Brown, with lace trim.',
      '/images/products/brownlace1.jpg': 'Side angle in Brown, with lace trim.',
    },
    colorImages: {
      'Black': ['/images/products/blacklace.jpg', '/images/products/blacklace1.jpg'],
      'Brown': ['/images/products/brownlace.jpg', '/images/products/brownlace1.jpg'],
    },
    description: "Elegant lace people fit formal pants available in sophisticated Black and warm Brown. Premium fabric with beautiful lace detailing and a flattering silhouette designed to celebrate all body types. Perfect for office wear, formal events, and special occasions. The delicate lace trim adds feminine charm while maintaining professional elegance.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    material: "Premium Lace Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-028",
    name: "Premium Wide Look Pants",
    category: "formal",
    price: 2100,
    originalPrice: 3000,
    image: '/images/products/widelook.jpg',
    images: ['/images/products/widelook.jpg', '/images/products/widelook1.jpg', '/images/products/widelook-back.jpg'],
    imageCaptions: {
      '/images/products/widelook.jpg': 'Front view in Black, wide-leg style.',
      '/images/products/widelook1.jpg': 'Side angle in Black, wide-leg style.',
      '/images/products/widelook-back.jpg': 'Back view in Black, wide-leg style.',
    },
    description: "Sophisticated premium wide look formal pants with elegant styling and superior fabric quality. Features a flattering wide-leg silhouette perfect for modern professional wear. Designed with impeccable tailoring for boardroom meetings and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-030",
    name: "Button Detail Formal Pants",
    category: "formal",
    price: 1499,
    originalPrice: 1900,
    image: '/images/products/olivedouble-button.jpg',
    images: ['/images/products/olivedouble-button.jpg'],
    description: "Elegant olive button detail formal pants featuring stylish button closures and premium tailored construction. The sophisticated olive tone adds warmth and versatility to any professional wardrobe. Crafted with comfort-focused fabric and a flattering tailored fit perfect for office wear, business meetings, and formal occasions. The contemporary design pairs beautifully with blouses, formal tops, and blazers.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Olive"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "tp-010",
    name: "Premium Black & Grey Track Pants",
    category: "track",
    price: 999,
    originalPrice: 1500,
    image: '/images/products/black.jpg',
    images: ['/images/products/black.jpg', '/images/products/blackback.jpg', '/images/products/grey.jpg', '/images/products/greyback.jpg'],
    imageCaptions: {
      '/images/products/black.jpg': 'Front view in Black.',
      '/images/products/blackback.jpg': 'Back view in Black.',
      '/images/products/grey.jpg': 'Front view in Grey.',
      '/images/products/greyback.jpg': 'Back view in Grey.',
    },
    description: "Elegant premium track pants available in stunning black and grey colors. Features superior fabric quality, comfortable fit, and contemporary design perfect for athleisure and casual wear. Versatile styling for any occasion.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "tp-012",
    name: "Premium Khaki Comfort Track Pants",
    category: "track",
    price: 1200,
    originalPrice: 1800,
    image: '/images/products/khakifront.jpg',
    images: ['/images/products/khakifront.jpg', '/images/products/khakiback.jpg'],
    imageCaptions: {
      '/images/products/khakifront.jpg': 'Front view in Khaki.',
      '/images/products/khakiback.jpg': 'Back view in Khaki.',
    },
    description: "Sophisticated khaki track pants crafted with premium cotton blend fabric for ultimate comfort and style. Features a relaxed fit design with elastic waistband, perfect for casual wear and athleisure styling. The versatile khaki tone pairs effortlessly with any outfit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Khaki"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "tp-013",
    name: "Cargo Pants Collection",
    category: "track",
    price: 999,
    originalPrice: 1499,
    image: '/images/products/greycargo.jpg',
    images: ['/images/products/greycargo.jpg', '/images/products/greycargoback.jpg', '/images/products/blackcargofront.jpg', '/images/products/blackcargoback.jpg', '/images/products/lavendercargofront.jpg', '/images/products/lavendercargofrontback.jpg'],
    imageCaptions: {
      '/images/products/greycargo.jpg': 'Front view in Grey, cargo-pocket design.',
      '/images/products/greycargoback.jpg': 'Back view in Grey, cargo-pocket design.',
      '/images/products/blackcargofront.jpg': 'Front view in Black, cargo-pocket design.',
      '/images/products/blackcargoback.jpg': 'Back view in Black, cargo-pocket design.',
      '/images/products/lavendercargofront.jpg': 'Front view in Lavender, cargo-pocket design.',
      '/images/products/lavendercargofrontback.jpg': 'Back view in Lavender, cargo-pocket design.',
    },
    description: "Versatile cargo pants collection available in three stunning colors - Grey, Black, and Lavender. Features multiple utility pockets, relaxed fit design, and durable premium fabric perfect for everyday comfort and streetwear styling. The modern cargo silhouette offers both functionality and fashion-forward appeal. Click through the gallery to explore alls. Perfect for casual outings and contemporary urban style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey", "Black", "Lavender"],
    material: "Premium Cotton Twill",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "fp-032",
    name: "Wide-Leg Belt Formal Pants",
    category: "formal",
    price: 1199,
    originalPrice: 1800,
    image: '/images/products/blackstraight.jpg',
    images: ['/images/products/blackstraight.jpg', '/images/products/blackstraight1.jpg', '/images/products/blackstraight2.jpg'],
    imageCaptions: {
      '/images/products/blackstraight.jpg': 'Front view in Black, straight-leg style.',
      '/images/products/blackstraight1.jpg': 'Side angle in Black, straight-leg style.',
      '/images/products/blackstraight2.jpg': 'Close-up view of belt detail in Black.',
    },
    description: "Premium black formal belt pants featuring a structured straight-leg silhouette with integrated belt detailing and metallic buckle accents. Crafted with superior quality fabric for a sharp, sophisticated look. The high-waisted design with front pockets and tailored fit pairs perfectly with any formal shirt or blazer. Perfect for office wear, business meetings, and special occasions. The sleek black tone and refined belt detail add timeless elegance to your professional wardrobe.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "fp-034",
    name: "Lace Waist Wide-Leg Formal Pants",
    category: "formal",
    price: 2499,
    originalPrice: 3499,
    image: '/images/products/front.jpg',
    images: ['/images/products/front.jpg', '/images/products/back.jpg', '/images/products/leftpose.jpg', '/images/products/righpose.jpg'],
    imageCaptions: {
      '/images/products/front.jpg': 'Front view.',
      '/images/products/back.jpg': 'Back view.',
      '/images/products/leftpose.jpg': 'Left pose view.',
      '/images/products/righpose.jpg': 'Right pose view.',
    },
    description: "Elegant black wide-leg formal pants featuring a delicate lace-trimmed waistband for a touch of feminine sophistication. Designed with front pleats and a flowing wide-leg silhouette that creates a graceful, elongating effect. The high-waisted fit pairs beautifully with cropped tops and tailored blouses. Crafted from premium fabric with impeccable draping for all-day comfort. Click through the gallery to explore front, back, left, and right pose views.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "fp-035",
    name: "Lace Wide-Leg Statement Pants",
    category: "formal",
    price: 3499,
    originalPrice: 4999,
    image: '/images/products/blacklacepant.jpg',
    images: ['/images/products/blacklacepant.jpg', '/images/products/blacklacepant1.jpg', '/images/products/blacklacepant2.jpg', '/images/products/blacklacepant4.jpg', '/images/products/brownlacepant.jpg', '/images/products/whitelacepant.jpg', '/images/products/whitelacepants1.jpg', '/images/products/whitelacepants2.jpg', '/images/products/whitelacepants3.jpg'],
    imageCaptions: {
      '/images/products/blacklacepant.jpg': 'Full-length view in Black, with lace trim.',
      '/images/products/blacklacepant1.jpg': 'Close-up of floral lace pattern in Black.',
      '/images/products/blacklacepant2.jpg': 'Side angle showing wide-leg drape in Black.',
      '/images/products/blacklacepant4.jpg': 'Waist & drawstring detail in Black.',
      '/images/products/brownlacepant.jpg': 'Full-length view in Brown, with lace trim.',
      '/images/products/whitelacepant.jpg': 'Full-length view in White, with lace trim.',
      '/images/products/whitelacepants1.jpg': 'Close-up of floral lace pattern in White.',
      '/images/products/whitelacepants2.jpg': 'Side angle showing wide-leg drape in White.',
      '/images/products/whitelacepants3.jpg': 'Back view & waist detail in White.',
    },
    colorImages: {
      'Black': ['/images/products/blacklacepant.jpg', '/images/products/blacklacepant1.jpg', '/images/products/blacklacepant2.jpg', '/images/products/blacklacepant4.jpg'],
      'Brown': ['/images/products/brownlacepant.jpg'],
      'White': ['/images/products/whitelacepant.jpg', '/images/products/whitelacepants1.jpg', '/images/products/whitelacepants2.jpg', '/images/products/whitelacepants3.jpg'],
    },
    description: "Show-stopping lace wide-leg statement pants available in three stunning colors — dramatic Black, earthy Brown, and elegant White. Crafted from premium floral lace with an all-over intricate pattern that creates a beautifully sheer effect. The ultra-wide leg silhouette flows with every step, creating mesmerizing movement. A comfortable elastic drawstring waist ensures a perfect fit across all body types, while the soft polyester lining provides coverage. Perfect for cocktail parties, romantic dinners, and nights out. Pair with a sleek bodysuit, statement heels, and minimal jewelry for a look that exudes confidence and glamour.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown", "White"],
    material: "Premium Floral Lace with Polyester Lining",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "fp-038",
    name: "Cord Set Co-Ord",
    category: "formal",
    price: 1499,
    originalPrice: 2499,
    image: '/images/products/black-cordset.jpg',
    images: ['/images/products/black-cordset.jpg', '/images/products/brown-cordset-1.jpg', '/images/products/beige-cordset.jpg'],
    imageCaptions: {
      '/images/products/black-cordset.jpg': 'Front view in Black, corduroy co-ord style.',
      '/images/products/brown-cordset-1.jpg': 'Front view in Brown, corduroy co-ord style.',
      '/images/products/beige-cordset.jpg': 'Front view in Beige, corduroy co-ord style.',
    },
    colorImages: {
      'Black': ['/images/products/black-cordset.jpg'],
      'Brown': ['/images/products/brown-cordset-1.jpg'],
      'Beige': ['/images/products/beige-cordset.jpg'],
    },
    description: "Sophisticated corduroy co-ord set available in three versatile colors — classic Black, rich Brown, and elegant Beige. Premium corduroy fabric with soft-touch ribbed texture combines timeless style with modern sophistication. This elegant co-ord delivers a head-to-toe polished look perfect for office wear, brunches, or weekend outings. The tailored fit flatters every body type while the relaxed silhouette ensures all-day comfort. Wear pieces together for a coordinated power look or mix and match separately for endless styling possibilities.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown", "Beige"],
    material: "Premium Corduroy Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "tp-014",
    name: "Casual Comfort Pants",
    category: "track",
    price: 1299,
    originalPrice: 1999,
    image: '/images/products/greencausal.jpg',
    images: ['/images/products/greencausal.jpg', '/images/products/creamcausal.jpg', '/images/products/greycausal.jpg', '/images/products/lavendercausal.jpg', '/images/products/navybluecausal.jpg', '/images/products/browncausal.jpg'],
    imageCaptions: {
      '/images/products/greencausal.jpg': 'Front view in Green.',
      '/images/products/creamcausal.jpg': 'Front view in Cream.',
      '/images/products/greycausal.jpg': 'Front view in Grey.',
      '/images/products/lavendercausal.jpg': 'Front view in Lavender.',
      '/images/products/navybluecausal.jpg': 'Front view in Navy Blue.',
      '/images/products/browncausal.jpg': 'Front view in Brown.',
    },
    colorImages: {
      'Green': ['/images/products/greencausal.jpg'],
      'Cream': ['/images/products/creamcausal.jpg'],
      'Grey': ['/images/products/greycausal.jpg'],
      'Lavender': ['/images/products/lavendercausal.jpg'],
      'Navy Blue': ['/images/products/navybluecausal.jpg'],
      'Brown': ['/images/products/browncausal.jpg'],
    },
    description: "Effortless everyday comfort in six versatile colors — Green, Cream, Grey, Lavender, Navy Blue, and Brown. Crafted from breathable, lightweight soft cotton blend fabric that keeps you cool and comfortable throughout the day. The relaxed fit and elastic waistband make these your perfect companion for weekend outings, coffee runs, or lounging in style. Each color pairs beautifully with any top in your wardrobe, making outfit selection effortless. Premium fabric ensures all-day comfort with just the right amount of stretch for easy movement.",
    sizes: ["S", "M", "L"],
    colors: ["Green", "Cream", "Grey", "Lavender", "Navy Blue", "Brown"],
    material: "Soft Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-041",
    name: "Pleated Waist Formal Pants",
    category: "formal",
    price: 1999,
    originalPrice: 2999,
    image: '/images/products/blackpalted.jpg',
    images: ['/images/products/blackpalted.jpg', '/images/products/blackbothbackfron.jpg', '/images/products/beigeplated.jpg', '/images/products/beigebothbackfront.jpg', '/images/products/greenpalted.jpg', '/images/products/greenbothfront-back.jpg'],
    imageCaptions: {
      '/images/products/blackpalted.jpg': 'Front view in Black.',
      '/images/products/blackbothbackfron.jpg': 'Back view in Black.',
      '/images/products/beigeplated.jpg': 'Front view in Beige, with pleated detailing.',
      '/images/products/beigebothbackfront.jpg': 'Back & front view in Beige.',
      '/images/products/greenpalted.jpg': 'Front view in Green.',
      '/images/products/greenbothfront-back.jpg': 'Back view in Green.',
    },
    description: "Step into refined elegance with our Pleated Waist Formal Pants. Designed with a sophisticated pleated waistband that adds structure and polish, these pants are perfect for office wear, client meetings, and formal occasions. The tailored straight-leg silhouette offers a flattering fit while maintaining all-day comfort. Available in three timeless colors — classic Black for boardroom authority, warm Beige for versatile daytime elegance, and refreshing Green for a modern statement. Pair with a crisp blouse and heels for a complete power look.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Beige", "Green"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-042",
    name: "Korean Baggy Plated Formal Pants",
    category: "formal",
    price: 2000,
    originalPrice: 2999,
    image: '/images/products/beggyplatedkoreanfront.jpg',
    images: ['/images/products/beggyplatedkoreanfront.jpg', '/images/products/beggyplatedkoreanback.jpg', '/images/products/beggyplatedkoreanbackpose.jpg', '/images/products/beggyplatedkoreanbackfront.jpg'],
    imageCaptions: {
      '/images/products/beggyplatedkoreanfront.jpg': 'Front view in Black, baggy-fit style.',
      '/images/products/beggyplatedkoreanback.jpg': 'Back view in Black, baggy-fit style.',
      '/images/products/beggyplatedkoreanbackpose.jpg': 'Pose shot showing drape in Black.',
      '/images/products/beggyplatedkoreanbackfront.jpg': 'Back & front view comparison in Black.',
    },
    description: "Embrace the Korean fashion trend with our Baggy Plated Formal Pants. Designed with a relaxed, oversized silhouette and elegant plated detailing, these pants bring modern Seoul street style to your formal wardrobe. The wide-leg baggy fit offers effortless comfort while maintaining a polished look suitable for office wear and smart casual occasions. Pair with a fitted top and minimal accessories for that chic Korean-inspired ensemble.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "jn-006",
    name: "Classic Denim Jeans",
    category: "jeans",
    price: 2000,
    originalPrice: 2999,
    image: '/images/products/frontdenim.jpg',
    images: ['/images/products/frontdenim.jpg', '/images/products/backdenim.jpg'],
    imageCaptions: {
      '/images/products/frontdenim.jpg': 'Front view in Blue denim.',
      '/images/products/backdenim.jpg': 'Back view in Blue denim.',
    },
    description: "Timeless denim crafted for the modern wardrobe. Our Classic Denim Jeans feature a flattering mid-rise waist with a comfortable straight-leg silhouette that never goes out of style. Made from premium denim with just the right amount of stretch, these jeans move with you throughout the day. The rich indigo wash pairs effortlessly with everything from casual tees to dressy blouses — a true everyday essential.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue"],
    material: "Premium Stretch Denim",
    inStock: true,
    isNew: true,
  },
];

export const categories = [
  { id: 'formal', name: 'Formal Pants', description: 'Elegant office & occasion wear' },
  { id: 'jeans', name: 'Jeans', description: 'Classic denim styles' },
  { id: 'track', name: 'Track Pants', description: 'Athleisure comfort' },
] as const;

// Synchronous helpers (fallback when API is unavailable)
export const getProductsByCategorySync = (category: Product['category']) =>
  products.filter(p => p.category === category);

export const getProductByIdSync = (id: string) => {
  // Case-insensitive lookup so 'FP-005' from the backend matches 'fp-005'
  // in the static catalog, and stale MongoDB _id URLs (e.g.
  // '6a32e1d68cbf17e83e47f571') still resolve via the alias cache.
  const direct = products.find(p => p.id === id);
  if (direct) return direct;
  const lower = id.toLowerCase();
  return products.find(p => p.id.toLowerCase() === lower) || null;
};

/**
 * Maps removed/merged legacy SKUs to their surviving static product.
 * When a user lands on an old MongoDB URL for a product we've merged
 * away, we transparently show the surviving product instead.
 */
const legacySkuAliases: Record<string, string> = {
  'fp-004': 'fp-015', // Black Premium Trousers merged into Imported Baggy
  'fp-006': 'fp-017', // Graphite Executive Fit merged into Premium Belted
  'tp-009': 'tp-013', // Classic Black Cargo Pants removed — nearest cargo
  'fp-029': 'fp-014', // Brown Sophisticated Formal Wear removed — nearest brown formal
};

/**
 * Resolves either a friendly SKU (e.g. 'fp-017') or a stale MongoDB _id
 * (e.g. '6a32e1d68cbf17e83e47f571') to a curated static product.
 * The mapping is cached in-memory so subsequent lookups are free.
 */
const mongoAliasCache = new Map<string, string>();
export const resolveProductId = async (id: string): Promise<Product | null> => {
  // Fast path — id is a known SKU in the curated catalog (case-insensitive).
  // Returns immediately without touching the network so the page renders in
  // well under 2 seconds even when the backend is cold-starting.
  const direct = getProductByIdSync(id);
  if (direct) return direct;

  // Legacy alias: old SKU that was merged/removed → map to the surviving SKU.
  const lower = id.toLowerCase();
  if (legacySkuAliases[lower]) {
    return getProductByIdSync(legacySkuAliases[lower]);
  }

  // Cached reverse lookup from MongoDB id -> SKU.
  const cached = mongoAliasCache.get(id);
  if (cached) return getProductByIdSync(cached) || null;

  // Ask the backend for the product, then remember its SKU for next time.
  try {
    const data = await api.get<{ success: boolean; product: Product }>(`/products/${id}`);
    if (data.product) {
      const sku = (data.product.sku || data.product.id || '').toLowerCase();
      mongoAliasCache.set(id, sku);

      // Apply legacy alias if backend returned a removed/merged SKU.
      const targetSku = legacySkuAliases[sku] || sku;
      const staticP = getProductByIdSync(targetSku);
      if (staticP) {
        return { ...staticP, inStock: data.product.inStock ?? staticP.inStock };
      }
      return data.product;
    }
  } catch {
    // ignore — the page already rendered the static product above
  }
  return null;
};

export const getBestSellersSync = () =>
  products.filter(p => p.isBestSeller && p.price > 1);

export const getNewArrivalsSync = () =>
  products.filter(p => p.isNew && p.price > 1);

// Async API functions with static fallback
export const getProductsByCategory = async (category: Product['category']) => {
  try {
    const data = await api.get<{ success: boolean; products: Product[]; totalCount: number }>(`/products/category/${category}`);
    return data.products || [];
  } catch {
    return getProductsByCategorySync(category);
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  // Always prefer the curated static product (carries captions, colorImages,
  // full description, badges). The backend is consulted only to refresh the
  // inStock flag. This prevents stale MongoDB data from stripping rich fields.
  const staticP = getProductByIdSync(id);
  try {
    const data = await api.get<{ success: boolean; product: Product }>(`/products/${id}`);
    if (!staticP) return data.product || null;
    if (!data.product) return staticP;
    return {
      ...staticP,
      inStock: data.product.inStock ?? staticP.inStock,
    };
  } catch {
    return staticP || null;
  }
};

export const getBestSellers = async (): Promise<Product[]> => {
  // The curated static catalog is the source of truth for bestsellers.
  // It preserves per-product badges, captions, and descriptions.
  return getBestSellersSync();
};

export const getNewArrivals = async (): Promise<Product[]> => {
  // The curated static catalog is the source of truth for new arrivals.
  return getNewArrivalsSync();
};
