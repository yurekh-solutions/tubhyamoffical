import { api } from '@/config/api';

export interface Product {
  id: string;
  mongoId?: string; // MongoDB _id for backward-compatible URL resolution
  sku?: string;     // Inventory SKU (often matches id; present on API responses)
  name: string;
  price: number;
  originalPrice?: number;
  category: 'formal' | 'jeans' | 'track' | 'dresses' | 'coords' | 'tops';
  // Shop-page subcategory — dresses (maxi / midi / short / chiffon), tops (full-sleeve / half-sleeve / polo / sleeveless)
  subcategory?: 'maxi' | 'midi' | 'short' | 'chiffon' | 'full-sleeve' | 'half-sleeve' | 'polo' | 'sleeveless';
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

  // Body type variants for try-on (slim, average, plus-size)
  tryOnBodyVariants?: {
    bodyType: 'slim' | 'average' | 'plus-size';
    images: string[];
  }[];
}

/** Subcategory chips shown when browsing the Dresses category on the shop page. */
export const dressSubcategories = [
  { id: 'maxi', name: 'Maxi' },
  { id: 'midi', name: 'Midi' },
  { id: 'short', name: 'Short' },
  { id: 'chiffon', name: 'Chiffon' },
] as const;

/** Subcategory chips shown when browsing the Tops category on the shop page. */
export const topsSubcategories = [
  { id: 'full-sleeve', name: 'Full Sleeve' },
  { id: 'half-sleeve', name: 'Half Sleeve' },
  { id: 'polo', name: 'Polo' },
  { id: 'sleeveless', name: 'Sleeveless' },
] as const;

export const products: Product[] = [
  // BROWN CORD SET - with AI Try-On images
  {
    id: "cord-set-001",
    name: "Brown Contrast Lace-edged 2pc Co-ords",
    category: "coords",
    price: 2197,
    originalPrice: 2999,
    image: '/images/products/brown-cordset-1.jpg',
    images: ['/images/products/brown-cordset-1.jpg', '/images/products/brownlace.jpg', '/images/products/brownlace1.jpg'],
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/cord-set-001-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/cord-set-001-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/cord-set-001-plus-size.jpg']
      }
    ],
    imageCaptions: {
      '/images/products/brown-cordset-1.jpg': 'Full set view - knit crop top with wide-leg pants.',
      '/images/products/brownlace.jpg': 'Lace-trimmed wide-leg trousers, styled.',
      '/images/products/brownlace1.jpg': 'Back view with lace waistband detail.',
    },
    description: "Elegant brown 2-piece co-ord set featuring a button-front knit crop top and wide-leg trousers with contrast lace trim at the waist. Perfect for evening wear and special occasions. Premium fabric with intricate lace detailing.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown"],
    material: "Premium Polyester Blend with Lace",
    inStock: true,
    isNew: true,
    isBestSeller: false,
  },
  // GOLD-BUCKLE BELTED VEST SUIT - editorial shoot, 9 colourways
  {
    id: "cord-set-002",
    name: "Gold-Buckle Belted Vest & Wide-Leg Pants 2pc Co-ord",
    category: "coords",
    price: 3999,
    originalPrice: 5399,
    image: '/images/products/cord-set-002-wine.jpg',
    images: [
      '/images/products/cord-set-002-wine.jpg',
      '/images/products/cord-set-002-navy.jpg',
      '/images/products/cord-set-002-white.jpg',
      '/images/products/cord-set-002-mint.jpg',
      '/images/products/cord-set-002-lemon.jpg',
      '/images/products/cord-set-002-red.jpg',
      '/images/products/cord-set-002-fuchsia.jpg',
      '/images/products/cord-set-002-pink.jpg',
      '/images/products/cord-set-002-black.jpg',
    ],
    colorImages: {
      'Wine': ['/images/products/cord-set-002-wine.jpg'],
      'Navy': ['/images/products/cord-set-002-navy.jpg'],
      'White': ['/images/products/cord-set-002-white.jpg'],
      'Mint Green': ['/images/products/cord-set-002-mint.jpg'],
      'Lemon Yellow': ['/images/products/cord-set-002-lemon.jpg'],
      'Red': ['/images/products/cord-set-002-red.jpg'],
      'Fuchsia': ['/images/products/cord-set-002-fuchsia.jpg'],
      'Pastel Pink': ['/images/products/cord-set-002-pink.jpg'],
      'Black': ['/images/products/cord-set-002-black.jpg'],
    },
    imageCaptions: {
      '/images/products/cord-set-002-wine.jpg': 'Wine - sleeveless wrap vest cinched with a gold buckle belt.',
      '/images/products/cord-set-002-navy.jpg': 'Navy - gold buckle defining the waisted vest.',
      '/images/products/cord-set-002-white.jpg': 'White - clean tonal tailoring, desk to dinner.',
      '/images/products/cord-set-002-mint.jpg': 'Mint Green - soft pastel suiting.',
      '/images/products/cord-set-002-lemon.jpg': 'Lemon Yellow - fresh statement hue.',
      '/images/products/cord-set-002-red.jpg': 'Red - bold wrap-front vest with flowing pants.',
      '/images/products/cord-set-002-fuchsia.jpg': 'Fuchsia - vivid pop of colour.',
      '/images/products/cord-set-002-pink.jpg': 'Pastel Pink - a soft feminine take on suiting.',
      '/images/products/cord-set-002-black.jpg': 'Black - timeless evening tailoring.',
    },
    description: "Two-piece co-ord set in structured crepe — a sleeveless wrap-front vest with notch lapels, cinched by a gold-tone buckle belt, paired with matching high-rise wide-leg pants with pressed pleats. The asymmetric peplum hem adds movement. A finished look for workdays, dinners and celebrations.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Wine", "Navy", "White", "Mint Green", "Lemon Yellow", "Red", "Fuchsia", "Pastel Pink", "Black"],
    material: "Structured Poly-Crepe",
    inStock: true,
    isNew: true,
    isBestSeller: false,
  },
  // PEPLUM BUTTON-BELT VEST SUIT - studio shoot, 7 colourways
  {
    id: "cord-set-003",
    name: "Peplum Button-Belt Vest & Wide-Leg Pants 2pc Co-ord",
    category: "coords",
    price: 3799,
    originalPrice: 5199,
    image: '/images/products/cord-set-003-black.jpg',
    images: [
      '/images/products/cord-set-003-black.jpg',
      '/images/products/cord-set-003-wine.jpg',
      '/images/products/cord-set-003-olive.jpg',
      '/images/products/cord-set-003-teal.jpg',
      '/images/products/cord-set-003-chocolate.jpg',
      '/images/products/cord-set-003-skyblue.jpg',
      '/images/products/cord-set-003-blush.jpg',
    ],
    colorImages: {
      'Black': ['/images/products/cord-set-003-black.jpg'],
      'Wine': ['/images/products/cord-set-003-wine.jpg'],
      'Olive': ['/images/products/cord-set-003-olive.jpg'],
      'Teal': ['/images/products/cord-set-003-teal.jpg'],
      'Chocolate Brown': ['/images/products/cord-set-003-chocolate.jpg'],
      'Sky Blue': ['/images/products/cord-set-003-skyblue.jpg'],
      'Blush Pink': ['/images/products/cord-set-003-blush.jpg'],
    },
    imageCaptions: {
      '/images/products/cord-set-003-black.jpg': 'Black - button-belt peplum vest with wide-leg pants.',
      '/images/products/cord-set-003-wine.jpg': 'Wine - fitted peplum waist, fluid wide legs.',
      '/images/products/cord-set-003-olive.jpg': 'Olive - earthy tonal two-piece.',
      '/images/products/cord-set-003-teal.jpg': 'Teal - rich jewel-tone co-ord.',
      '/images/products/cord-set-003-chocolate.jpg': 'Chocolate Brown - warm everyday tailoring.',
      '/images/products/cord-set-003-skyblue.jpg': 'Sky Blue - breezy pastel set.',
      '/images/products/cord-set-003-blush.jpg': 'Blush Pink - soft feminine co-ord.',
    },
    description: "Sleeveless peplum vest with a button-loop belt and matching wide-leg trousers. A clean V-neckline with relaxed lapel, fitted waist and fluid wide legs in soft woven fabric — the easy co-ord that moves from brunches to workdays and back.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Wine", "Olive", "Teal", "Chocolate Brown", "Sky Blue", "Blush Pink"],
    material: "Soft Woven Poly-Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false,
  },
  // TAILORED SINGLE-BUTTON BLAZER SUIT - editorial shoot, 7 colourways
  {
    id: "cord-set-004",
    name: "Tailored Single-Button Blazer & Wide-Leg Pants 2pc Suit",
    category: "coords",
    price: 5499,
    originalPrice: 5999,
    image: '/images/products/cord-set-004-red.jpg',
    images: [
      '/images/products/cord-set-004-red.jpg',
      '/images/products/cord-set-004-black.jpg',
      '/images/products/cord-set-004-white.jpg',
      '/images/products/cord-set-004-royalblue.jpg',
      '/images/products/cord-set-004-yellow.jpg',
      '/images/products/cord-set-004-powderblue.jpg',
      '/images/products/cord-set-004-chocbrown.jpg',
    ],
    colorImages: {
      'Red': ['/images/products/cord-set-004-red.jpg'],
      'Black': ['/images/products/cord-set-004-black.jpg'],
      'White': ['/images/products/cord-set-004-white.jpg'],
      'Royal Blue': ['/images/products/cord-set-004-royalblue.jpg'],
      'Yellow': ['/images/products/cord-set-004-yellow.jpg'],
      'Powder Blue': ['/images/products/cord-set-004-powderblue.jpg'],
      'Chocolate Brown': ['/images/products/cord-set-004-chocbrown.jpg'],
    },
    imageCaptions: {
      '/images/products/cord-set-004-red.jpg': 'Red - sharp single-breasted blazer with fluid wide-leg pants.',
      '/images/products/cord-set-004-black.jpg': 'Black - timeless boardroom-to-dinner tailoring.',
      '/images/products/cord-set-004-white.jpg': 'White - clean tonal suit with a deep V neckline.',
      '/images/products/cord-set-004-royalblue.jpg': 'Royal Blue - statement cobalt suiting.',
      '/images/products/cord-set-004-yellow.jpg': 'Yellow - bright statement set for sunny occasions.',
      '/images/products/cord-set-004-powderblue.jpg': 'Powder Blue - soft pastel tailoring.',
      '/images/products/cord-set-004-chocbrown.jpg': 'Chocolate Brown - warm neutral office suit.',
    },
    description: "Classic two-piece suit in soft structured suiting — a tailored single-button blazer with notch lapels and flap pockets, paired with matching high-rise wide-leg pants finished with pressed pleats. The sharp shoulder line, deep V styling and fluid drape make it the polished anchor of a work-to-evening wardrobe. Shown in seven colourways.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Red", "Black", "White", "Royal Blue", "Yellow", "Powder Blue", "Chocolate Brown"],
    material: "Structured Poly-Suiting",
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
    price: 2899,
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
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/pt-004-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/pt-004-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/pt-004-plus-size.jpg']
      },
    ]
  },
{
  id: "pt-005",
  name: "Drawstring Relaxed Fit Pants",
  category: "track",
  price: 2999,
  image: '/images/products/blankpants.jpg',
  images: ['/images/products/blankpants.jpg'],
  description:
    "Comfort-first relaxed fit pants featuring an elastic waistband with contrast drawstring detailing. Designed with a straight-leg silhouette and soft fabric for effortless everyday styling and maximum comfort.",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["Black"],
  material: "Soft Cotton Blend",
  inStock: true,
  tryOnBodyVariants: [
    {
      bodyType: 'slim',
      images: ['/images/products/pt-005-slim.jpg']
    },
    {
      bodyType: 'average',
      images: ['/images/products/pt-005-average.jpg']
    },
    {
      bodyType: 'plus-size',
      images: ['/images/products/pt-005-plus-size.jpg']
    },
  ]
  },


  {
    id: "fp-001",
    name: "Elegance Wide-Leg Trousers",
    category: "formal",
    price: 4499,
    originalPrice: 6099,
    image: '/images/products/formal-6.jpg',
    images: ['/images/products/formal-6.jpg'],
    description: "Sophisticated beige wide-leg trousers crafted from premium fabric. Features high-waist design with elegant pleats for a refined silhouette. Perfect for office wear and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige"],
    material: "Premium Polyester Blend",
    inStock: true,
    isBestSeller: true,
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/fp-001-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/fp-001-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/fp-001-plus-size.jpg']
      },
    ]
  },
  {
    id: "fp-002",
    name: "Camel Classic Palazzo",
    category: "formal",
    price: 4799,
    image: '/images/products/formal-pants-2.jpg',
    images: ['/images/products/formal-pants-2.jpg'],
    description: "Timeless camel-toned palazzo pants with a flattering high-waist cut. The flowing silhouette and premium fabric make this piece a wardrobe essential for the modern woman.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Camel"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/fp-002-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/fp-002-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/fp-002-plus-size.jpg']
      },
    ]
  },
  {
    id: "fp-003",
    name: "Navy Executive Trousers",
    category: "formal",
    price: 4999,
    originalPrice: 6799,
    image: '/images/products/formal-pants-3.jpg',
    images: ['/images/products/formal-pants-3.jpg'],
    description: "Commanding navy blue executive trousers with impeccable tailoring. Features crisp pleats and a sleek wide-leg design that transitions effortlessly from boardroom to evening.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Navy Blue"],
    material: "Wool Blend",
    inStock: true,
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/fp-003-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/fp-003-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/fp-003-plus-size.jpg']
      },
    ]
  },
 
  {
    id: "jn-003",
    name: "Vintage Wash Flare Jeans",
    category: "jeans",
    price: 3599,
    image: '/images/products/jeans-3.jpg',
    images: ['/images/products/jeans-3.jpg'],
    description: "Retro-inspired light wash flare jeans with a flattering high-rise fit. The subtle flare creates an elongating effect while the soft denim ensures all-day comfort.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Light Wash"],
    material: "Premium Cotton Denim",
    inStock: true,
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/jn-003-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/jn-003-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/jn-003-plus-size.jpg']
      },
    ]
  },
  {
    id: "jn-004",
    name: "Classic Blue Wide-Leg Jeans",
    category: "jeans",
    price: 3499,
    image: '/images/products/jeans-8.jpg',
    images: ['/images/products/jeans-8.jpg'],
    description: "Timeless blue wide-leg jeans with a modern silhouette. Features high-waist design with premium denim fabric for comfortable all-day wear and effortless style.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Classic Blue"],
    material: "Premium Denim",
    inStock: true,
    isNew: true,
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/jn-004-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/jn-004-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/jn-004-plus-size.jpg']
      },
    ]
  },
  {
    id: "jn-005",
    name: "Relaxed Fit Straight Jeans",
    category: "jeans",
    price: 3699,
    originalPrice: 4999,
    image: '/images/products/jeans-33.jpg',
    images: ['/images/products/jeans-33.jpg'],
    description: "Comfortable relaxed fit straight jeans with vintage-inspired wash. Perfect blend of classic styling and contemporary comfort for everyday casual wear.",
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Wash"],
    material: "100% Cotton Denim",
    inStock: true,
    isBestSeller: true,
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/jn-005-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/jn-005-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/jn-005-plus-size.jpg']
      },
    ]
  },
 
  {
    id: "tp-002",
    name: "Cloud Grey Comfort Joggers",
    category: "track",
    price: 2699,
    image: '/images/products/track-pants-2.jpg',
    images: ['/images/products/track-pants-2.jpg'],
    description: "Ultra-soft grey joggers designed for maximum comfort without compromising on style. Perfect for lounging at home or running errands in effortless elegance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Grey"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
    tryOnBodyVariants: [
      {
        bodyType: 'slim',
        images: ['/images/products/tp-002-slim.jpg']
      },
      {
        bodyType: 'average',
        images: ['/images/products/tp-002-average.jpg']
      },
      {
        bodyType: 'plus-size',
        images: ['/images/products/tp-002-plus-size.jpg']
      },
    ]
  },
  {
    id: "tp-005",
    name: "Slim Fit Ankle Joggers",
    category: "track",
    price: 2899,
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
    price: 2799,
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
    price: 2799,
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
    price: 4599,
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
    price: 4699,
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
    price: 4799,
    originalPrice: 6499,
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
    price: 4699,
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
    price: 4799,
    originalPrice: 6499,
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
    price: 5299,
    originalPrice: 7199,
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
    price: 4899,
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
    price: 4699,
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
    price: 5099,
    originalPrice: 6899,
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
    price: 4999,
    originalPrice: 6799,
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
    price: 4799,
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
    price: 4799,
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
    price: 5999,
    originalPrice: 8099,
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
    price: 4200,
    originalPrice: 5699,
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
    price: 4100,
    originalPrice: 5599,
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
    price: 4399,
    originalPrice: 5999,
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
    price: 4399,
    originalPrice: 5999,
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
    price: 4100,
    originalPrice: 5599,
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
    price: 3499,
    originalPrice: 4799,
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
    price: 1999,
    originalPrice: 2699,
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
    price: 2200,
    originalPrice: 2999,
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
    price: 1999,
    originalPrice: 2699,
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
    price: 3199,
    originalPrice: 4399,
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
    price: 4499,
    originalPrice: 6099,
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
    price: 5499,
    originalPrice: 7499,
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
    price: 3499,
    originalPrice: 4799,
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
    price: 2299,
    originalPrice: 3199,
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
    price: 3999,
    originalPrice: 5399,
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
    price: 4000,
    originalPrice: 5399,
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
    price: 3000,
    originalPrice: 4099,
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

  // ===================== DRESSES COLLECTION =====================
  {
    id: "dr-001",
    name: "Midnight Black Bodycon Maxi Dress",
    category: "dresses",
    subcategory: "maxi",
    price: 5499,
    originalPrice: 7499,
    image: '/images/products/dr-001.jpg',
    images: ['/images/products/dr-001.jpg'],
    imageCaptions: {
      '/images/products/dr-001.jpg': 'Front view - sleek black halter bodycon maxi.',
    },
    description: "Sleek black bodycon maxi dress with a figure-hugging silhouette. Features a flattering halter V-neckline and floor-length hem. Perfect for evening events and special occasions. Premium stretch fabric ensures comfort all night long.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Stretch Jersey",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "dr-002",
    name: "Sky Blue Tiered Ruffle Maxi Dress",
    category: "dresses",
    subcategory: "maxi",
    price: 5299,
    originalPrice: 7199,
    image: '/images/products/dr-002.jpg',
    images: ['/images/products/dr-002.jpg'],
    imageCaptions: {
      '/images/products/dr-002.jpg': 'Front and back view - sky blue tiered maxi.',
    },
    description: "Dreamy sky blue maxi dress with tiered ruffle layers and a romantic back bow tie. Spaghetti straps and smocked bodice create a flattering fit. Perfect for summer outings, beach vacations, and garden parties.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Sky Blue"],
    material: "Lightweight Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-003",
    name: "Black Cutout Halter Mini Dress",
    category: "dresses",
    subcategory: "short",
    price: 4799,
    originalPrice: 6499,
    image: '/images/products/dr-003.jpg',
    images: ['/images/products/dr-003.jpg'],
    description: "Bold black halter mini dress with a daring cutout detail at the bust and ruffle hem. Bodycon fit that celebrates your curves. Perfect for night outs, parties, and making a statement.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    material: "Stretch Ribbed Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-004",
    name: "Butter Yellow Slim Fit Maxi Dress",
    category: "dresses",
    subcategory: "maxi",
    price: 4999,
    originalPrice: 6799,
    image: '/images/products/dr-004.jpg',
    images: ['/images/products/dr-004.jpg'],
    description: "Elegant butter yellow maxi dress with a slim fitted silhouette. Straight neckline with delicate spaghetti straps and a clean floor-length cut. A sunshine hue that brightens any occasion.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Butter Yellow"],
    material: "Premium Stretch Crepe",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-005",
    name: "Hot Pink One-Shoulder Cutout Mini Dress",
    category: "dresses",
    subcategory: "short",
    price: 4799,
    originalPrice: 6499,
    image: '/images/products/dr-005.jpg',
    images: ['/images/products/dr-005.jpg'],
    imageCaptions: {
      '/images/products/dr-005.jpg': 'Front view - hot pink one-shoulder cutout mini.',
    },
    description: "Bold hot pink one-shoulder mini dress with a keyhole cutout at the neckline and a daring midriff cutout. Features a ruched bodycon skirt that hugs every curve. Perfect for club nights, parties, and making a statement.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Hot Pink"],
    material: "Stretch Scuba Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-006",
    name: "Black Satin Cowl Neck Slip Dress",
    category: "dresses",
    subcategory: "midi",
    price: 5499,
    originalPrice: 7499,
    image: '/images/products/dr-006.jpg',
    images: ['/images/products/dr-006.jpg', '/images/products/dr-006-back.jpg'],
    imageCaptions: {
      '/images/products/dr-006.jpg': 'Front view - black satin cowl neck slip midi.',
      '/images/products/dr-006-back.jpg': 'Alternate angle - satin drape on the staircase.',
    },
    description: "Luxurious black satin slip dress with an elegant cowl neckline and delicate thin spaghetti straps. The bias-cut midi length drapes beautifully over the body. Perfect for cocktail parties, date nights, and evening events.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    material: "Satin Finish Fabric",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-007",
    name: "Coral Pink Sleeveless Bodycon Midi",
    category: "dresses",
    subcategory: "midi",
    price: 4999,
    originalPrice: 6799,
    image: '/images/products/dr-007.jpg',
    images: ['/images/products/dr-007.jpg'],
    imageCaptions: {
      '/images/products/dr-007.jpg': 'Front view - coral bodycon midi.',
    },
    description: "Sleek coral pink sleeveless bodycon midi dress with a figure-hugging silhouette. The clean lines and vibrant hue make it a summer staple. Perfect for brunch dates, garden parties, and daytime events.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Coral Pink"],
    material: "Stretch Jersey Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-008",
    name: "Burgundy Velvet Square Neck Mini Dress",
    category: "dresses",
    subcategory: "short",
    price: 4999,
    originalPrice: 6799,
    image: '/images/products/dr-008.jpg',
    images: ['/images/products/dr-008.jpg'],
    imageCaptions: {
      '/images/products/dr-008.jpg': 'Front view - burgundy velvet square neck mini.',
    },
    description: "Rich burgundy velvet mini dress with a flattering square neckline and thick shoulder straps. The A-line flared skirt adds playful movement. Perfect for winter parties, holiday events, and festive occasions.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Burgundy"],
    material: "Premium Velvet",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-009",
    name: "Navy Glitter Velvet Bishop Sleeve Mini",
    category: "dresses",
    subcategory: "short",
    price: 5299,
    originalPrice: 7199,
    image: '/images/products/dr-009.jpg',
    images: ['/images/products/dr-009.jpg'],
    imageCaptions: {
      '/images/products/dr-009.jpg': 'Front view - navy glitter velvet bishop sleeve mini.',
    },
    description: "Stunning navy blue velvet mini dress with subtle glitter sparkle throughout. Features a cowl neckline and dramatic long bishop sleeves with an A-line flare skirt. Perfect for New Year parties, cocktail events, and festive nights.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Navy Blue"],
    material: "Glitter Velvet",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-010",
    name: "Grey Ribbed Off-Shoulder Mini Dress",
    category: "dresses",
    subcategory: "short",
    price: 4499,
    originalPrice: 6099,
    image: '/images/products/dr-010.jpg',
    images: ['/images/products/dr-010.jpg'],
    imageCaptions: {
      '/images/products/dr-010.jpg': 'Front view - grey ribbed off-shoulder mini.',
    },
    description: "Chic grey ribbed knit mini dress with an off-shoulder neckline and long fitted sleeves. The bodycon silhouette hugs your curves perfectly. A versatile piece for casual outings, date nights, and everyday style.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Grey"],
    material: "Ribbed Stretch Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-011",
    name: "Black Asymmetric Sleeve Ruched Mini",
    category: "dresses",
    subcategory: "short",
    price: 4799,
    originalPrice: 6499,
    image: '/images/products/dr-011.jpg',
    images: ['/images/products/dr-011.jpg'],
    imageCaptions: {
      '/images/products/dr-011.jpg': 'Front view - black ruched asymmetric sleeve mini.',
    },
    description: "Edgy black mini dress with an asymmetric design featuring one long sleeve and one short sleeve. The ruched side detail creates a flattering silhouette. Perfect for night outs, parties, and bold fashion statements.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    material: "Stretch Jersey Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-012",
    name: "Navy Ribbed Bell Sleeve Maxi with Slit",
    category: "dresses",
    subcategory: "maxi",
    price: 5499,
    originalPrice: 7499,
    image: '/images/products/dr-012.jpg',
    images: ['/images/products/dr-012.jpg'],
    imageCaptions: {
      '/images/products/dr-012.jpg': 'Front view - navy ribbed maxi with bell sleeves.',
    },
    description: "Elegant navy blue ribbed knit maxi dress with dramatic bell sleeves and a deep V-neckline. Features a self-tie waist belt and a daring front thigh slit. Perfect for evening events, cocktail parties, and date nights.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Navy Blue"],
    material: "Ribbed Stretch Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-013",
    name: "Burgundy Cutout Two-Piece Midi Set",
    category: "dresses",
    subcategory: "midi",
    price: 4999,
    originalPrice: 6799,
    image: '/images/products/dr-013.jpg',
    images: ['/images/products/dr-013.jpg'],
    imageCaptions: {
      '/images/products/dr-013.jpg': 'Front view - burgundy cutout two-piece set.',
    },
    description: "Bold burgundy two-piece set pairing a fitted long-sleeve crop top with shoulder cutouts and a matching high-waisted midi pencil skirt with a front slit. The midriff-baring design creates a sleek, confident silhouette. Perfect for cocktail parties, night outs, and making a statement.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Burgundy"],
    material: "Stretch Jersey Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-014",
    name: "Burgundy Velvet Bishop Sleeve Mini",
    category: "dresses",
    subcategory: "short",
    price: 4799,
    originalPrice: 6499,
    image: '/images/products/dr-014.jpg',
    images: ['/images/products/dr-014.jpg'],
    imageCaptions: {
      '/images/products/dr-014.jpg': 'Front view - burgundy velvet bishop sleeve mini.',
    },
    description: "Romantic burgundy velvet mini dress with long bishop sleeves and a smocked elastic waist. The tiered ruffle hem adds playful movement. Perfect for holiday parties, festive events, and winter celebrations.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Burgundy"],
    material: "Premium Velvet",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-015",
    name: "Rust Ribbed Knit Ruffle Hem Maxi",
    category: "dresses",
    subcategory: "maxi",
    price: 5299,
    originalPrice: 7199,
    image: '/images/products/dr-015.jpg',
    images: ['/images/products/dr-015.jpg'],
    imageCaptions: {
      '/images/products/dr-015.jpg': 'Front view - rust ribbed knit maxi with ruffle hem.',
    },
    description: "Stunning rust-toned ribbed knit maxi dress with a square neckline and long fitted sleeves. Features a dramatic ruffled high-low hem with a side slit for effortless movement. Perfect for autumn events, date nights, and stylish outings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Rust"],
    material: "Ribbed Stretch Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-017",
    name: "Royal Blue Velvet Bodycon Midi",
    category: "dresses",
    subcategory: "midi",
    price: 3299,
    originalPrice: 4499,
    image: '/images/products/dr-017.jpg',
    images: ['/images/products/dr-017.jpg'],
    imageCaptions: {
      '/images/products/dr-017.jpg': 'Front view - royal blue velvet bodycon midi.',
    },
    description: "Regal royal blue velvet bodycon midi dress with long sleeves and a figure-hugging silhouette. The rich velvet fabric catches light beautifully. Perfect for cocktail parties, evening events, and special occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Royal Blue"],
    material: "Premium Stretch Velvet",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-018",
    name: "Black Velvet Ruched Pencil Midi",
    category: "dresses",
    subcategory: "midi",
    price: 3299,
    originalPrice: 4499,
    image: '/images/products/dr-018.jpg',
    images: ['/images/products/dr-018.jpg'],
    imageCaptions: {
      '/images/products/dr-018.jpg': 'Front view - black velvet ruched pencil midi.',
    },
    description: "Sophisticated black velvet midi dress with long sleeves and elegant ruched side detailing. The pencil skirt silhouette creates a sleek, elongated look. Perfect for evening events, cocktail parties, and formal dinners.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Stretch Velvet",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-019",
    name: "Ivory Ribbed Knit Midi Dress",
    category: "dresses",
    subcategory: "midi",
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/dr-019.jpg',
    images: ['/images/products/dr-019.jpg'],
    imageCaptions: {
      '/images/products/dr-019.jpg': 'Front view - ivory ribbed knit midi.',
    },
    description: "Minimalist ivory ribbed knit midi dress with long sleeves and a softly fitted silhouette. The clean neutral tone and subtle side slit make it a versatile wardrobe essential. Perfect for everyday elegance, brunch dates, and casual outings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory"],
    material: "Ribbed Stretch Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-020",
    name: "Burgundy Off-Shoulder Ruched Mini",
    category: "dresses",
    subcategory: "short",
    price: 2799,
    originalPrice: 3799,
    image: '/images/products/dr-020.jpg',
    images: ['/images/products/dr-020.jpg'],
    imageCaptions: {
      '/images/products/dr-020.jpg': 'Front view - burgundy off-shoulder ruched mini.',
    },
    description: "Daring burgundy ribbed knit mini dress with an off-shoulder neckline and long fitted sleeves. The heavily ruched bodycon skirt sculpts your silhouette. Perfect for night outs, parties, and bold fashion moments.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Burgundy"],
    material: "Ribbed Stretch Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-021",
    name: "Black Twist Cutout Long Sleeve Mini",
    category: "dresses",
    subcategory: "short",
    price: 2799,
    originalPrice: 3799,
    image: '/images/products/dr-021.jpg',
    images: ['/images/products/dr-021.jpg'],
    imageCaptions: {
      '/images/products/dr-021.jpg': 'Front view - black twist cutout long sleeve mini.',
    },
    description: "Sleek black long sleeve mini dress with a dramatic twist and cross cutout at the bust. The ruched bodycon fit hugs every curve. Perfect for night outs, cocktail parties, and making a statement.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    material: "Stretch Jersey Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-022",
    name: "Burgundy Velvet Keyhole Bell Sleeve Mini",
    category: "dresses",
    subcategory: "short",
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/dr-022.jpg',
    images: ['/images/products/dr-022.jpg'],
    imageCaptions: {
      '/images/products/dr-022.jpg': 'Front view - burgundy velvet bell sleeve mini.',
    },
    description: "Luxurious burgundy velvet mini dress with a soft draped V-neckline and dramatic long bell sleeves. Features ruched side detailing and a subtle side slit. Perfect for winter parties, holiday events, and festive occasions.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Burgundy"],
    material: "Premium Stretch Velvet",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-023",
    name: "Beige Wrap Bishop Sleeve Maxi",
    category: "dresses",
    subcategory: "maxi",
    price: 3499,
    originalPrice: 4799,
    image: '/images/products/dr-023.jpg',
    images: ['/images/products/dr-023.jpg'],
    imageCaptions: {
      '/images/products/dr-023.jpg': 'Front view - beige wrap bishop sleeve midi.',
    },
    description: "Elegant beige wrap maxi dress with a V-neckline and long bishop sleeves with ruffle cuffs. Features a cutout waist detail and a flowing A-line skirt. Perfect for beach vacations, garden parties, and summer events.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige"],
    material: "Lightweight Chiffon Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-024",
    name: "Pink Square Neck Bell Sleeve Skater",
    category: "dresses",
    subcategory: "short",
    price: 2799,
    originalPrice: 3799,
    image: '/images/products/dr-024.jpg',
    images: ['/images/products/dr-024.jpg'],
    imageCaptions: {
      '/images/products/dr-024.jpg': 'Front view - pink bell sleeve skater mini.',
    },
    description: "Feminine pink mini dress with a sweetheart neckline and gathered bodice detail. Long bell sleeves and a flared skater skirt create a playful, romantic silhouette. Perfect for date nights, brunches, and spring events.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Pink"],
    material: "Stretch Crepe Knit",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-025",
    name: "Black Off-Shoulder Asymmetric Hem Midi",
    category: "dresses",
    subcategory: "midi",
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/dr-025.jpg',
    images: ['/images/products/dr-025.jpg'],
    imageCaptions: {
      '/images/products/dr-025.jpg': 'Front view - black off-shoulder asymmetric midi.',
    },
    description: "Chic black long sleeve midi dress with an off-shoulder neckline and a dramatic asymmetric high-low hem. The flowing skirt adds movement and elegance. Perfect for evening events, cocktail parties, and stylish outings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Stretch Crepe Knit",
    inStock: true,
    isNew: true,
  },

  // ===================== CHIFFON DRESSES =====================
  {
    id: "dr-026",
    name: "White Floral Pleated Chiffon Midi Dress",
    category: "dresses",
    subcategory: "chiffon",
    price: 3499,
    originalPrice: 4499,
    image: '/images/products/dr-026-white.jpg',
    images: ['/images/products/dr-026-white.jpg'],
    imageCaptions: {
      '/images/products/dr-026-white.jpg': 'White - botanical print chiffon with lace-trimmed ruffle sleeves.',
    },
    description: "Elegant white chiffon midi dress printed with a delicate slate botanical motif. Features lace-trimmed ruffle sleeves, a softly pleated bodice with stand collar and a flowing accordion-pleated skirt that catches the light. A graceful choice for brunches, day events and festive gatherings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White"],
    material: "Premium Chiffon",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-028",
    name: "Black Blossom Pleated Chiffon Maxi Dress",
    category: "dresses",
    subcategory: "chiffon",
    price: 3799,
    originalPrice: 4999,
    image: '/images/products/dr-028-black.jpg',
    images: ['/images/products/dr-028-black.jpg'],
    imageCaptions: {
      '/images/products/dr-028-black.jpg': 'Black - blossom-print chiffon maxi with tiered pleated skirt.',
    },
    description: "Dramatic black chiffon maxi dress printed with soft cream blossoms. Long sheer sleeves with ruffled cuffs, a tie-neck V and a shirred waist give way to a sweeping tiered pleated skirt that moves beautifully. An evening-ready statement piece.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Chiffon",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-029",
    name: "Blue Floral Tiered Chiffon Midi with Lace Hem",
    category: "dresses",
    subcategory: "chiffon",
    price: 3399,
    originalPrice: 4399,
    image: '/images/products/dr-029-skyblue.jpg',
    images: ['/images/products/dr-029-skyblue.jpg'],
    imageCaptions: {
      '/images/products/dr-029-skyblue.jpg': 'Sky Blue - tiered floral chiffon with white lace collar and hem.',
    },
    description: "Sweet sky-blue chiffon midi dress scattered with deep-red florals. A white lace-trimmed collar and lace hem overlay frame the tiered ruffle silhouette, with puff sleeves and a gathered waist. Romantic and light — made for daytime celebrations.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Sky Blue"],
    material: "Premium Chiffon",
    inStock: true,
    isNew: true,
  },
  {
    id: "dr-030",
    name: "Blue Ditsy Pleated Chiffon Mini Dress",
    category: "dresses",
    subcategory: "chiffon",
    price: 2999,
    originalPrice: 3899,
    image: '/images/products/dr-030-powderblue.jpg',
    images: ['/images/products/dr-030-powderblue.jpg'],
    imageCaptions: {
      '/images/products/dr-030-powderblue.jpg': 'Powder Blue - ditsy-print chiffon mini with pleated flare.',
    },
    description: "Fresh powder-blue chiffon mini dress with a playful navy ditsy print. Ruffled high neck, sheer flutter sleeves and a shirred waist flow into a pleated flared skirt that swings with every step. A charming pick for daytime outings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Powder Blue"],
    material: "Premium Chiffon",
    inStock: true,
    isNew: true,
  },

  // ===================== PREMIUM BOTTOMS COLLECTION =====================
  {
    id: "fp-043",
    name: "Champagne Wide-Leg Trousers",
    category: "formal",
    price: 3499,
    originalPrice: 4999,
    image: '/images/products/fp-043.jpg',
    images: ['/images/products/fp-043.jpg'],
    description: "Luxurious champagne gold wide-leg trousers with high waist and flowing silhouette. The metallic sheen adds elegance to any formal ensemble. Perfect for boardrooms, dinners, and special occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Champagne"],
    material: "Premium Satin Blend",
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "fp-044",
    name: "Ivory Pleated Palazzo Pants",
    category: "formal",
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/fp-044.jpg',
    images: ['/images/products/fp-044.jpg'],
    description: "Elegant ivory white palazzo pants with fine pleats and elastic waistband. The wide flowing legs create a graceful silhouette. Perfect for office wear, parties, and festive occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory"],
    material: "Crepe with Pleats",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-045",
    name: "Noir High-Waisted Cigarette Pants",
    category: "formal",
    price: 3299,
    originalPrice: 4499,
    image: '/images/products/fp-045.jpg',
    images: ['/images/products/fp-045.jpg'],
    description: "Sleek black high-waisted cigarette pants with a tailored ankle-length fit. The classic silhouette flatters every body type. A wardrobe essential for the modern professional.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Stretch Twill",
    inStock: true,
  },
  {
    id: "fp-046",
    name: "Dusty Rose Tailored Trousers",
    category: "formal",
    price: 2799,
    originalPrice: 3799,
    image: '/images/products/fp-046.jpg',
    images: ['/images/products/fp-046.jpg'],
    description: "Sophisticated dusty rose tailored trousers with high waist and straight leg. The muted pink tone is versatile and flattering. Perfect for semi-formal events and office wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Dusty Rose"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-047",
    name: "Espresso Linen Wide-Leg Pants",
    category: "formal",
    price: 3999,
    originalPrice: 5499,
    image: '/images/products/fp-047.jpg',
    images: ['/images/products/fp-047.jpg'],
    description: "Premium espresso brown linen wide-leg pants with natural texture and breathable comfort. The relaxed wide-leg silhouette is perfect for summer office wear and casual elegance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Espresso Brown"],
    material: "Pure Linen",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "jn-010",
    name: "Vintage Wash Mom Jeans",
    category: "jeans",
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/jn-010.jpg',
    images: ['/images/products/jn-010.jpg'],
    description: "Classic vintage wash mom jeans with high waist and relaxed fit through the hip, tapering to the ankle. The perfect retro-inspired denim for everyday style.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Vintage Blue"],
    material: "Premium Stretch Denim",
    inStock: true,
    isNew: true,
  },
  {
    id: "jn-011",
    name: "Black High-Rise Straight Jeans",
    category: "jeans",
    price: 3299,
    originalPrice: 4299,
    image: '/images/products/jn-011.jpg',
    images: ['/images/products/jn-011.jpg'],
    description: "Sleek black high-rise straight leg jeans with a classic silhouette. The dark wash is versatile for day-to-night styling. A denim essential for every wardrobe.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Stretch Denim",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "jn-012",
    name: "Indigo Wide-Leg Denim",
    category: "jeans",
    price: 3499,
    originalPrice: 4799,
    image: '/images/products/jn-012.jpg',
    images: ['/images/products/jn-012.jpg'],
    description: "Trendy indigo wide-leg denim jeans with high waist and flowing silhouette. The rich indigo wash and wide leg create a fashion-forward look. Perfect for casual and semi-formal styling.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Indigo"],
    material: "Premium Denim",
    inStock: true,
    isNew: true,
  },
  {
    id: "jn-013",
    name: "Cream Cropped Flare Jeans",
    category: "jeans",
    price: 2799,
    originalPrice: 3799,
    image: '/images/products/jn-013.jpg',
    images: ['/images/products/jn-013.jpg'],
    description: "Chic cream white cropped flare jeans with high waist and ankle-length flared leg. The light wash and flare silhouette are perfect for summer styling and boho-chic looks.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cream"],
    material: "Stretch Denim",
    inStock: true,
  },
  {
    id: "jn-014",
    name: "Grey Relaxed Baggy Jeans",
    category: "jeans",
    price: 2499,
    originalPrice: 3499,
    image: '/images/products/jn-014.jpg',
    images: ['/images/products/jn-014.jpg'],
    description: "On-trend grey relaxed baggy jeans with mid-rise waist and loose fit through the leg. The washed grey denim offers effortless street style. Perfect for casual everyday wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Grey"],
    material: "Relaxed Fit Denim",
    inStock: true,
    isNew: true,
  },
  {
    id: "pt-006",
    name: "Silk Touch Side-Stripe Track Pants",
    category: "track",
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/pt-006.jpg',
    images: ['/images/products/pt-006.jpg'],
    description: "Premium black track pants with contrasting white side stripe and silk-touch fabric. Elastic waistband with drawstring and tapered leg. Perfect for athleisure styling and weekend comfort.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Silk-Touch Polyester",
    inStock: true,
    isNew: true,
  },
  {
    id: "pt-007",
    name: "Velvet Jogger Luxe Pants",
    category: "track",
    price: 3499,
    originalPrice: 4799,
    image: '/images/products/pt-007.jpg',
    images: ['/images/products/pt-007.jpg'],
    description: "Luxurious burgundy velvet jogger pants with elastic waistband and cuffed ankles. The rich velvet texture elevates casual wear to luxury loungewear. Perfect for travel and relaxed elegance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy"],
    material: "Stretch Velvet",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "pt-008",
    name: "Ivory Ribbed Knit Flares",
    category: "track",
    price: 2299,
    originalPrice: 3199,
    image: '/images/products/pt-008.jpg',
    images: ['/images/products/pt-008.jpg'],
    description: "Comfortable ivory ribbed knit flare pants with high elastic waistband and flared leg opening. The soft ribbed texture and flare silhouette blend comfort with style. Perfect for lounging and casual outings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory"],
    material: "Ribbed Knit Cotton",
    inStock: true,
  },
  {
    id: "pt-009",
    name: "Navy Tech-Fabric Cargo Pants",
    category: "track",
    price: 3299,
    originalPrice: 4499,
    image: '/images/products/pt-009.jpg',
    images: ['/images/products/pt-009.jpg'],
    description: "Modern navy cargo pants in technical fabric with utility pockets and tapered leg. The tech-fabric offers durability and comfort. Perfect for street style and active lifestyles.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy"],
    material: "Technical Nylon Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "pt-010",
    name: "Olive Drawstring Tailored Joggers",
    category: "track",
    price: 2799,
    originalPrice: 3799,
    image: '/images/products/pt-010.jpg',
    images: ['/images/products/pt-010.jpg'],
    description: "Versatile olive green tailored joggers with contrast drawstring and tapered leg. The structured yet comfortable design bridges casual and smart-casual. Perfect for work-from-home and weekend outings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Olive Green"],
    material: "Cotton Blend Twill",
    inStock: true,
    isNew: true,
  },

  // ===================== TOPS COLLECTION =====================
  {
    id: "tops-001",
    name: "Ribbed Fitted Knit Top - Full & Half Sleeve",
    category: "tops",
    subcategory: "full-sleeve",
    price: 2899,
    originalPrice: 3999,
    image: '/images/products/tops-001-a.jpg',
    images: [
      '/images/products/tops-001-a.jpg',
      '/images/products/tops-002-a.jpg',
      '/images/products/tops-002-b.jpg',
      '/images/products/tops-004-a.jpg',
      '/images/products/tops-006-a.jpg',
      '/images/products/tops-005-a.jpg',
      '/images/products/tops-007-a.jpg',
    ],
    colorImages: {
      'Black (Full Sleeve)': ['/images/products/tops-001-a.jpg'],
      'Black (Half Sleeve)': ['/images/products/tops-002-a.jpg', '/images/products/tops-002-b.jpg'],
'Ivory (Full Sleeve)': ['/images/products/tops-004-a.jpg'],
'Sage Grey (Full Sleeve)': ['/images/products/tops-006-a.jpg'],
'Olive (Half Sleeve)': ['/images/products/tops-005-a.jpg'],
'Chocolate Brown (Full Sleeve)': ['/images/products/tops-007-a.jpg'],
},
imageCaptions: {
'/images/products/tops-001-a.jpg': 'Black (Full Sleeve) - fitted ribbed square-neck top, styled with olive cargos.',
'/images/products/tops-002-a.jpg': 'Black (Half Sleeve) - crew-neck cropped tee with wide-leg cargos.',
'/images/products/tops-002-b.jpg': 'Black (Half Sleeve) - alternate styling of the same crop tee.',
'/images/products/tops-004-a.jpg': 'Ivory (Full Sleeve) - square-neck long-sleeve top with a clean slim fit.',
'/images/products/tops-006-a.jpg': 'Sage Grey (Full Sleeve) - long-sleeve fitted top with soft stretch comfort.',
'/images/products/tops-005-a.jpg': 'Olive (Half Sleeve) - crew-neck cropped tee, styled with matching cargos.',
'/images/products/tops-007-a.jpg': 'Chocolate Brown (Full Sleeve) - boat-neck long-sleeve top with pleated trousers.',
},
description: "One top, endless ways to wear it. This fitted stretch-knit essential comes in five colourways - Black, Ivory, Sage Grey, Olive and Chocolate Brown - with a choice of full sleeves or a half-sleeve cropped fit. The soft rib knit hugs the body beautifully and pairs effortlessly with cargos, denim and pleated trousers.",
sizes: ["XS", "S", "M", "L", "XL"],
colors: ["Black (Full Sleeve)", "Black (Half Sleeve)", "Ivory (Full Sleeve)", "Sage Grey (Full Sleeve)", "Olive (Half Sleeve)", "Chocolate Brown (Full Sleeve)"],
material: "Ribbed Stretch Knit",
inStock: true,
isNew: true,
},
{
id: "tops-003",
name: "Navy Bandeau Tube Top",
category: "tops",
subcategory: "sleeveless",
price: 2499,
originalPrice: 3399,
image: '/images/products/tops-003-a.jpg',
images: ['/images/products/tops-003-a.jpg'],
imageCaptions: {
'/images/products/tops-003-a.jpg': 'Navy - sleek bandeau tube top with a smooth stretch fit.',
},
description: "Minimal navy bandeau top with a smooth second-skin fit. The strapless silhouette sits securely and pairs effortlessly with cargos, denim and open shirts for an easy street-style look.",
sizes: ["XS", "S", "M", "L", "XL"],
colors: ["Navy"],
material: "Stretch Jersey",
inStock: true,
isNew: true,
},
{
id: "tops-008",
name: "Navy Polo Crop T-Shirt",
category: "tops",
subcategory: "polo",
price: 2599,
originalPrice: 3599,
image: '/images/products/tops-008-a.jpg',
images: ['/images/products/tops-008-a.jpg'],
imageCaptions: {
'/images/products/tops-008-a.jpg': 'Navy - collared polo crop t-shirt with short sleeves, styled with cargos.',
},
description: "Sporty-meets-chic navy polo crop tee with a classic collar, buttoned placket and short sleeves. The cropped fit sits perfectly with wide-leg cargos and denim for an easy street-style look.",
sizes: ["XS", "S", "M", "L", "XL"],
colors: ["Navy"],
material: "Pique Cotton Knit",
inStock: true,
isNew: true,
},
];

export const categories = [
{ id: 'formal', name: 'Formal Pants', description: 'Elegant office & occasion wear' },
{ id: 'jeans', name: 'Jeans', description: 'Classic denim styles' },
{ id: 'track', name: 'Track Pants', description: 'Athleisure comfort' },
{ id: 'dresses', name: 'Dresses', description: 'Elegant dresses for every occasion' },
{ id: 'coords', name: 'Co-ord Sets', description: 'Polished matching two-piece sets' },
{ id: 'tops', name: 'Tops', description: 'Everyday essential tees, knits & polos' },
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
