import formal1 from '@/assets/formals/formal-1.jpeg';
import formal2 from '@/assets/formals/formal-2.jpeg';
import formal3 from '@/assets/formals/formal-3.jpeg';
import formal4 from '@/assets/formals/formal-4.jpeg';
import formal5 from '@/assets/formals/formal-5.jpeg';
import formal6 from '@/assets/formals/formal-6.jpeg';
import formal7 from '@/assets/formals/formal-7.jpeg';
import formal8 from '@/assets/formals/formal-8.jpeg';
import jeans1 from '@/assets/products/jeans-1.jpg';
import jeans2 from '@/assets/products/jeans-2.jpg';
import jeans3 from '@/assets/products/jeans-3.jpg';
import track1 from '@/assets/products/track-1.jpg';
import track2 from '@/assets/products/track-2.jpg';
import track3 from '@/assets/products/track-3.jpg';
import formalPants1 from "@/assets/formals/formal-pants-1.jpg";
import formalPants2 from "@/assets/formals/formal-pants-2.jpg";
import formalPants3 from "@/assets/formals/formal-pants-3.jpg";
import jeans6 from "@/assets/products/jeans-22.jpg";
import jeans7 from "@/assets/products/jeans-8.jpg";
import jeans8  from "@/assets/products/jeans-33.jpg";

// Track pants from Tracks folder
import trackPants1 from "@/assets/Tracks/track-pants-1.jpg";
import trackPants2 from "@/assets/Tracks/track-pants-2.jpg";
import greenpants from "@/assets/Tracks/greenpants.jpeg";
import blankpants from "@/assets/Tracks/blankpants.jpeg";
import cargo from "@/assets/Tracks/cargo.png";
import cargoblack from "@/assets/Tracks/cargoblack.png";
import cargofront from "@/assets/Tracks/cargofront.png";
import blackcargo1 from "@/assets/Tracks/blackcargo1.png";
import blackcargo2 from "@/assets/Tracks/blackcargo2.png";
import slimfit from "@/assets/Tracks/slimfit.png";
import trousers from "@/assets/Tracks/trousers.png";
import trousersgrey from "@/assets/Tracks/trousersgrey.png";

// Formal pants from formals folder
import beigeFormal from "@/assets/formals/beige-formal.jpeg";
import beltFormalBlack from "@/assets/formals/belt-formal-balck.jpeg";
import beltFormalBeige from "@/assets/formals/belt-formal-beige.jpeg";
import beltFormalBeige1 from "@/assets/formals/belt-formal-beige1.jpeg";
import beltFormalBeige2 from "@/assets/formals/belt-formal-beige2.jpeg";
import beltImported from "@/assets/formals/belt-imported.jpeg";
import bothImported from "@/assets/formals/both-imported.jpeg";
import bothOliveFormal from "@/assets/formals/both-olive,-formal-belt.jpeg";
import brownFormal from "@/assets/formals/brown-formal.jpeg";
import brown from "@/assets/formals/brown.jpeg";
import brown1Formal from "@/assets/formals/brown1-formal.jpeg";
import brownbelt1 from "@/assets/formals/brownbelt1.png";
import brownbelt2 from "@/assets/formals/brownbelt2.png";
import brownbelt3 from "@/assets/formals/brownbelt3.png";
import brownbelt4 from "@/assets/formals/brownbelt4.png";
import importedBeggyBlackFormal from "@/assets/formals/imported-beggy-black-formal.jpeg";
import importedBeggyBlack from "@/assets/formals/imported-beggy-black.jpeg";
import importedBeggyGrayFormal from "@/assets/formals/imported-beggy-gray-formal.jpeg";
import importedBeggyGray from "@/assets/formals/imported-beggy-gray.jpeg";
import oliveFormalBelt from "@/assets/formals/olive-fomral-belt.jpeg";
import oliveFormalBelt2 from "@/assets/formals/olive-formal-belt.jpeg";
import premiumBlack from "@/assets/formals/preuim-black.jpeg";
import premiumDarkBrown from "@/assets/formals/preuim-dark-brown.jpeg";
import premiumGray from "@/assets/formals/preuim-gray.jpeg";
import slimfitFormalBlackGrey from "@/assets/formals/slimfit-formal-pants-black,grey.jpeg";
import whiteFormalBelt from "@/assets/formals/white-formal-belt.jpeg";
export interface Product {
  id: string;
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
}

export const products: Product[] = [
  {

  id: "pt-004",

  name: "Relaxed Fit Elastic Waist Trousers",

  category: "track",

  price: 1899,

  image: greenpants,

  images: [greenpants],

  description:

    "Minimalist relaxed-fit trousers featuring an elastic waistband for all-day comfort. Designed with a straight wide-leg silhouette, these trousers offer a clean, effortless look suitable for casual and semi-formal wear.",

  sizes: ["S", "M", "L", "XL", "XXL"],

  colors: ["Olive Green", "Khaki"],

  material: "Cotton Blend Fabric",







  inStock: true,

},
{
  id: "pt-005",
  name: "Drawstring Relaxed Fit Pants",
  category: "track",
  price: 1999,
  image: blankpants,
  images: [blankpants],
  description:
    "Comfort-first relaxed fit pants featuring an elastic waistband with contrast drawstring detailing. Designed with a straight-leg silhouette and soft fabric for effortless everyday styling and maximum comfort.",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["Black", "Charcoal"],
  material: "Soft Cotton Blend",
  inStock: true,
},


  {
    id: "fp-001",
    name: "Elegance Wide-Leg Trousers",
    category: "formal",
    price: 2499,
    originalPrice: 3499,
    image: formal6,
    images: [formal6],
    description: "Sophisticated charcoal grey wide-leg trousers crafted from premium fabric. Features high-waist design with elegant pleats for a refined silhouette. Perfect for office wear and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal Grey", "Black", "Navy"],
    material: "Premium Polyester Blend",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-002",
    name: "Camel Classic Palazzo",
    category: "formal",
    price: 2799,
    image: formalPants2,
    images: [formalPants2],
    description: "Timeless camel-toned palazzo pants with a flattering high-waist cut. The flowing silhouette and premium fabric make this piece a wardrobe essential for the modern woman.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Camel", "Beige", "Cream"],
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
    image: formalPants3,
    images: [formalPants3],
    description: "Commanding navy blue executive trousers with impeccable tailoring. Features crisp pleats and a sleek wide-leg design that transitions effortlessly from boardroom to evening.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Navy Blue", "Black"],
    material: "Wool Blend",
    inStock: true,
  },
 
  {
    id: "jn-002",
    name: "Noir Straight-Leg Jeans",
    category: "jeans",
    price: 2399,
    originalPrice: 2999,
    image: jeans2,
    images: [jeans2],
    description: "Sleek black straight-leg jeans featuring contrast stitching details. High-waisted fit with a classic cut that pairs perfectly with any top. A must-have staple.",
    sizes: ["26", "28", "30", "32"],
    colors: ["Black", "Charcoal"],
    material: "Stretch Denim",
    inStock: true,
    isNew: true,
  },
  {
    id: "jn-003",
    name: "Vintage Wash Flare Jeans",
    category: "jeans",
    price: 2599,
    image: jeans3,
    images: [jeans3],
    description: "Retro-inspired light wash flare jeans with a flattering high-rise fit. The subtle flare creates an elongating effect while the soft denim ensures all-day comfort.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Light Wash", "Medium Wash"],
    material: "Premium Cotton Denim",
    inStock: true,
  },
  {
    id: "jn-004",
    name: "Classic Blue Wide-Leg Jeans",
    category: "jeans",
    price: 2499,
    image: jeans7,
    images: [jeans7],
    description: "Timeless blue wide-leg jeans with a modern silhouette. Features high-waist design with premium denim fabric for comfortable all-day wear and effortless style.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Classic Blue", "Medium Wash"],
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
    image: jeans8,
    images: [jeans8],
    description: "Comfortable relaxed fit straight jeans with vintage-inspired wash. Perfect blend of classic styling and contemporary comfort for everyday casual wear.",
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Wash", "Stone Wash"],
    material: "100% Cotton Denim",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "tp-001",
    name: "Luxe Black Joggers",
    category: "track",
    price: 1799,
    originalPrice: 2299,
    image: track2,
    images: [track2],
    description: "Elevated black joggers that blend comfort with style. Features tapered legs with cuffed ankles, elastic waist with drawstring, and premium soft fabric perfect for casual outings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Charcoal"],
    material: "French Terry Cotton",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "tp-002",
    name: "Cloud Grey Comfort Joggers",
    category: "track",
    price: 1699,
    image: trackPants2,
    images: [trackPants2],
    description: "Ultra-soft grey joggers designed for maximum comfort without compromising on style. Perfect for lounging at home or running errands in effortless elegance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Grey", "Navy", "Black"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "tp-005",
    name: "Slim Fit Ankle Joggers",
    category: "track",
    price: 1899,
    image: slimfit,
    images: [slimfit],
    description: "Modern slim-fit joggers with ankle-length design. Features elastic waistband with contrast drawstring and side pockets. Perfect for athleisure and casual styling.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy"],
    material: "Performance Stretch Fabric",
    inStock: true,
    isNew: true,
  },
  {
    id: "tp-006",
    name: "Classic Grey Trousers",
    category: "track",
    price: 1799,
    image: trousersgrey,
    images: [trousersgrey],
    description: "Comfortable grey trousers with relaxed fit. Features elastic waistband and side pockets. Perfect for loungewear and casual everyday comfort.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey", "Charcoal"],
    material: "Soft Cotton Blend",
    inStock: true,
  },
  {
    id: "tp-007",
    name: "Classic Beige Trousers",
    category: "track",
    price: 1799,
    image: trousers,
    images: [trousers],
    description: "Versatile beige trousers with comfortable fit. Features elastic waistband and practical pocket design. Ideal for casual wear and relaxed styling.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Sand", "Cream"],
    material: "Soft Cotton Blend",
    inStock: true,
  },
  
  {
    id: "fp-004",
    name: "Black Premium Trousers",
    category: "formal",
    price: 2899,
    originalPrice: 3799,
    image: formal4,
    images: [formal4],
    description: "Sophisticated black formal trousers with a sleek silhouette and premium finish. Features a modern flat-front design with perfect tailoring for contemporary business wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-005",
    name: "Olive Sophisticated Pants",
    category: "formal",
    price: 2599,
    image: oliveFormalBelt,
    images: [oliveFormalBelt],
    description: "Elegant olive green trousers perfect for creating a statement at work or formal events. Crafted with premium fabric and impeccable seams for lasting quality.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green", "Sage", "Forest"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-006",
    name: "Graphite Executive Fit",
    category: "formal",
    price: 3099,
    originalPrice: 4199,
    image: premiumGray,
    images: [premiumGray],
    description: "Sophisticated graphite pants designed for the modern professional woman. Features a slim fit with subtle sheen, perfect for boardroom to dinner transitions.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Graphite", "Slate Grey", "Dark Silver"],
    material: "Wool Blend",
    inStock: true,
  },
  {
    id: "fp-007",
    name: "Rose Gold Formal Pants",
    category: "formal",
    price: 2699,
    image: formal1,
    images: [formal1],
    description: "Luxurious rose gold-toned formal pants with a subtle shimmer. High-waisted design with elegant draping for an effortlessly chic appearance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Gold", "Mauve", "Blush"],
    material: "Premium Cotton Blend",
    inStock: true,
  },
  {
    id: "fp-008",
    name: "Teal Statement Trousers",
    category: "formal",
    price: 2799,
    originalPrice: 3599,
    image: formal2,
    images: [formal2],
    description: "Bold teal formal trousers that make an elegant statement. Perfect for creative professionals who want sophistication with a twist of personality.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Teal", "Peacock", "Turquoise"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-009",
    name: "Premium Beige Formal Pants",
    category: "formal",
    price: 2699,
    image: beigeFormal,
    images: [beigeFormal],
    description: "Classic beige formal pants with elegant design. Perfect for professional settings with comfortable fit and premium fabric quality.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Cream"],
    material: "Premium Polyester Blend",
    inStock: true,
  },
  {
    id: "fp-010",
    name: "Belt Formal Pants - Black",
    category: "formal",
    price: 2899,
    image: beltFormalBlack,
    images: [beltFormalBlack],
    description: "Sleek black formal pants with belt loops and tailored fit. Features side pockets and premium finish for office and formal occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Cotton Blend",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-011",
    name: "Belt Formal Pants - Beige",
    category: "formal",
    price: 2799,
    image: beltFormalBeige,
    images: [beltFormalBeige],
    description: "Elegant beige formal pants with belt design. Tailored cut with comfortable waistband and sophisticated styling for business wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Sand", "Cream"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-012",
    name: "Imported Belt Formal Pants",
    category: "formal",
    price: 3299,
    originalPrice: 4199,
    image: beltImported,
    images: [beltImported],
    description: "Premium imported formal pants with belt styling. Features superior fabric quality and impeccable tailoring for the modern professional.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Multiple"],
    material: "Imported Premium Fabric",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-013",
    name: "Olive Formal Belt Pants",
    category: "formal",
    price: 2899,
    image: oliveFormalBelt2,
    images: [oliveFormalBelt2],
    description: "Sophisticated olive formal pants with belt design. Perfect blend of style and comfort for executive and professional settings.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green", "Sage"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-014",
    name: "Brown Formal Pants",
    category: "formal",
    price: 2699,
    image: brownFormal,
    images: [brownFormal],
    description: "Classic brown formal pants with refined tailoring. Features comfortable fit and timeless design for versatile professional styling.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Brown", "Dark Brown", "Tan"],
    material: "Premium Polyester Blend",
    inStock: true,
  },
  {
    id: "fp-015",
    name: "Imported Baggy Formal - Black",
    category: "formal",
    price: 3099,
    originalPrice: 3899,
    image: importedBeggyBlackFormal,
    images: [importedBeggyBlackFormal],
    description: "Trendy imported baggy formal pants in black. Modern relaxed fit with premium fabric and contemporary styling for fashion-forward professionals.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Imported Premium Fabric",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-016",
    name: "Imported Baggy Formal - Gray",
    category: "formal",
    price: 3099,
    originalPrice: 3899,
    image: importedBeggyGrayFormal,
    images: [importedBeggyGrayFormal],
    description: "Stylish imported baggy formal pants in gray. Features relaxed comfortable fit with premium quality fabric for modern business casual wear.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Charcoal"],
    material: "Imported Premium Fabric",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-017",
    name: "Premium Black Formal Pants",
    category: "formal",
    price: 2999,
    image: premiumBlack,
    images: [premiumBlack],
    description: "Premium black formal pants with superior tailoring. Classic design with modern fit for ultimate professional elegance.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Wool Blend",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-018",
    name: "Premium Dark Brown Formal Pants",
    category: "formal",
    price: 2999,
    image: premiumDarkBrown,
    images: [premiumDarkBrown],
    description: "Luxurious dark brown formal pants with premium finish. Sophisticated styling perfect for executive meetings and formal events.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Dark Brown", "Chocolate"],
    material: "Premium Wool Blend",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "fp-019",
    name: "Premium Gray Formal Pants",
    category: "formal",
    price: 2999,
    image: formal3,
    images: [formal3],
    description: "Elegant gray formal pants with premium quality fabric. Features refined tailoring and comfortable fit for sophisticated business attire.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Gray", "Silver"],
    material: "Premium Wool Blend",
    inStock: true,
  },
  {
    id: "fp-020",
    name: "Slim Fit Formal Pants - Black/Grey",
    category: "formal",
    price: 2799,
    image: slimfitFormalBlackGrey,
    images: [slimfitFormalBlackGrey],
    description: "Modern slim fit formal pants available in black and grey. Tailored cut with stretch fabric for comfort and sophisticated professional styling.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey"],
    material: "Stretch Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-021",
    name: "White Formal Belt Pants",
    category: "formal",
    price: 2799,
    image: whiteFormalBelt,
    images: [whiteFormalBelt],
    description: "Crisp white formal pants with belt design. Fresh, elegant styling perfect for summer business wear and formal occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Off-White"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "tp-009",
    name: "Black Cargo Pants",
    category: "track",
    price: 2199,
    image: cargoblack,
    images: [cargoblack],
    description: "Modern black cargo pants with multiple utility pockets. Features relaxed fit with adjustable waist and durable fabric perfect for casual wear and outdoor activities.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Olive"],
    material: "Cotton Twill Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-022",
    name: "Brown Belt Premium Formal Pants",
    category: "formal",
    price: 3299,
    originalPrice: 4199,
    image: brownbelt1,
    images: [brownbelt1, brownbelt2, brownbelt3, brownbelt4],
    description: "Exclusive brown belt formal pants from our premium collection. Features superior fabric quality, refined tailoring, and elegant belt detailing for executive styling. This set includes multiple variations of the classic brown belt design.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Brown", "Chocolate", "Tan", "Dark Brown"],
    material: "Imported Premium Wool Blend",
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "tp-010",
    name: "Black Cargo Pants - Style 1",
    category: "track",
    price: 2299,
    image: blackcargo1,
    images: [blackcargo1],
    description: "Premium black cargo pants with utility pockets and modern fit. Features adjustable waist with belt loops and reinforced stitching for durability.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    material: "Premium Cotton Twill",
    inStock: true,
    isNew: true,
  },
];

export const categories = [
  { id: 'formal', name: 'Formal Pants', description: 'Elegant office & occasion wear' },
  { id: 'jeans', name: 'Jeans', description: 'Classic denim styles' },
  { id: 'track', name: 'Track Pants', description: 'Athleisure comfort' },
] as const;

export const getProductsByCategory = (category: Product['category']) => 
  products.filter(p => p.category === category);

export const getProductById = (id: string) => 
  products.find(p => p.id === id);

export const getBestSellers = () => 
  products.filter(p => p.isBestSeller);

export const getNewArrivals = () => 
  products.filter(p => p.isNew);
