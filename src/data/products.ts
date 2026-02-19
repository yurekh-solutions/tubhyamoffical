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
import blackcar1 from "@/assets/Tracks/blackcar1.png";
import balckcar2 from "@/assets/Tracks/balckcar2.png";
import slimfit from "@/assets/Tracks/slimfit.png";
import trousers from "@/assets/Tracks/trousers.png";
import trousersgrey from "@/assets/Tracks/trousersgrey.png";
import black from "@/assets/Tracks/black.png";
import blackback from "@/assets/Tracks/blackback.png";
import grey from "@/assets/Tracks/grey.png";
import greyback from "@/assets/Tracks/greyback.png";
import olivecomfort from "@/assets/Tracks/olivecomfort.png";
import olivecomfort1 from "@/assets/Tracks/olivecomfort1.png";
import olivecomfort2 from "@/assets/Tracks/olivecomfort2.png";
import olivecomfort3 from "@/assets/Tracks/olivecomfort3.png";
import khakifront from "@/assets/Tracks/khakifront.png";
import khakiback from "@/assets/Tracks/khakiback.png";
import belt from "@/assets/formals/belt.png";
import beltbeige from "@/assets/formals/beltbeige.png";
import blackstraight from "@/assets/formals/blackstraight.png";
import blackstraight1 from "@/assets/formals/blackstraight1.png";
import blackstraight2 from "@/assets/formals/blackstraight2.png";

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
import greylace from "@/assets/formals/greylace.png";
import greylaceback from "@/assets/formals/greylaceback.png";
import blackmom from "@/assets/formals/blackmom.png";
import blackmom1 from "@/assets/formals/blackmom1.png";
import buttoncargo from "@/assets/formals/buttoncargo.png";
import buttoncargo1 from "@/assets/formals/buttoncargo1.png";
import blacklace from "@/assets/formals/blacklace.png";
import blacklace1 from "@/assets/formals/blacklace1.png";
import brownlace from "@/assets/formals/brownlace.png";
import brownlace1 from "@/assets/formals/brownlace1.png";
import widelook from "@/assets/formals/widelook.jpeg";
import widelook1 from "@/assets/formals/widelook1.jpeg";
import widelookback from "@/assets/formals/widelook back.jpeg";
import brownbelt from "@/assets/formals/brownbelt.png";
import brownback from "@/assets/formals/brownback.png";
import brownside from "@/assets/formals/brownside.png";
import blackbutton from "@/assets/formals/blackbutton.png";
import olivedoublebutton from "@/assets/formals/olivedouble button.png";

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
    image: olivecomfort,
    images: [olivecomfort, olivecomfort1, olivecomfort2, olivecomfort3],
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
    image: importedBeggyBlack,
    images: [importedBeggyBlack, slimfitFormalBlackGrey, beltFormalBlack],
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
    name: "Classic Black Cargo Pants",
    category: "track",
    price: 1200,
    originalPrice: 1499,
    image: blackcar1,
    images: [blackcar1, balckcar2, blackcargo1, blackcargo2],
    description: "Modern black cargo pants featuring multiple utility pockets and relaxed fit. Crafted with durable fabric for everyday comfort and versatile styling. Perfect for casual outings and streetwear looks.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    material: "Premium Cotton Twill",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-022",
    name: "Premium Brown Belt Formal Pants",
    category: "formal",
    price: 3999,
    originalPrice: 4500,
    image: brownbelt1,
    images: [brownbelt1, brownbelt2, brownbelt3, brownbelt4],
    description: "Luxurious brown formal pants with elegant belt design. Features refined tailoring and premium fabric for sophisticated professional styling. Perfect for executive meetings and formal occasions with impeccable finish.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown", "Dark Brown", "Tan"],
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
    image: greylace,
    images: [greylace, greylaceback],
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
    image: blackmom,
    images: [blackmom, blackmom1],
    description: "Elegant black mom fit formal trousers featuring a comfortable relaxed fit with premium fabric. Perfect for office wear and formal occasions. Designed with a flattering silhouette that offers both style and comfort for the modern woman.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-025",
    name: "Button Detail Formal Cargo Pants",
    category: "track",
    price: 2399,
    originalPrice: 2999,
    image: buttoncargo,
    images: [buttoncargo, buttoncargo1],
    description: "Elegant formal cargo pants featuring stylish button details and premium fabric. Perfect blend of formal and casual styling. Designed for the modern woman who wants sophistication with a contemporary edge.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-026",
    name: "Black Lace People Fit Formal Pants",
    category: "formal",
    price: 2399,
    originalPrice: 2999,
    image: blacklace,
    images: [blacklace, blacklace1],
    description: "Elegant black lace people fit formal pants featuring a flattering silhouette for everyone. Premium fabric with beautiful lace detailing. Perfect for office wear, formal events, and special occasions. Designed to celebrate all body types.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Lace Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-027",
    name: "Brown Lace People Fit Formal Pants",
    category: "formal",
    price: 2399,
    originalPrice: 2999,
    image: brownlace,
    images: [brownlace, brownlace1],
    description: "Elegant brown lace people fit formal pants featuring a flattering silhouette for everyone. Premium fabric with beautiful lace detailing. Perfect for office wear, formal events, and special occasions. Designed to celebrate all body types.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown"],
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
    image: widelook,
    images: [widelook, widelook1, widelookback],
    description: "Sophisticated premium wide look formal pants with elegant styling and superior fabric quality. Features a flattering wide-leg silhouette perfect for modern professional wear. Designed with impeccable tailoring for boardroom meetings and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-029",
    name: "Brown Sophisticated Formal Wear",
    category: "formal",
    price: 2100,
    originalPrice: 3000,
    image: brownbelt,
    images: [brownbelt, brownback, brownside],
    description: "Exquisite brown formal pants with sophisticated styling and premium craftsmanship. Features elegant belt design with refined tailoring. Perfect for professional settings and formal occasions. The rich brown tone adds warmth and elegance to any formal wardrobe.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-030",
    name: "Button Detail Formal Pants - Black",
    category: "formal",
    price: 1499,
    originalPrice: 1900,
    image: blackbutton,
    images: [blackbutton],
    description: "Elegant black formal pants featuring stylish button details and premium fabric. Perfect for office wear and formal occasions. Crafted with comfort and sophisticated styling for the modern professional woman.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-031",
    name: "Button Detail Formal Pants - Olive",
    category: "formal",
    price: 1499,
    originalPrice: 1900,
    image: olivedoublebutton,
    images: [olivedoublebutton],
    description: "Elegant olive formal pants featuring stylish button details and premium fabric. Perfect for office wear and formal occasions. Crafted with comfort and sophisticated styling for the modern professional woman.",
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
    image: black,
    images: [black, blackback, grey, greyback],
    description: "Elegant premium track pants available in stunning black and grey colors. Features superior fabric quality, comfortable fit, and contemporary design perfect for athleisure and casual wear. Click through the gallery to see both color options with front and back views. Versatile styling for any occasion.",
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
    image: khakifront,
    images: [khakifront, khakiback],
    description: "Sophisticated khaki track pants crafted with premium cotton blend fabric for ultimate comfort and style. Features a relaxed fit design with elastic waistband, perfect for casual wear and athleisure styling. The versatile khaki tone pairs effortlessly with any outfit. Click through to view front and back details.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Khaki"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "acc-001",
    name: "Premium Formal Belt Collection",
    category: "formal",
    price: 1199,
    originalPrice: 1500,
    image: belt,
    images: [belt, beltbeige],
    description: "Elevate your formal wear with our premium belt collection. Featuring two stunning color options - classic black and versatile beige - these belts are crafted with premium materials and exquisite detailing. Perfect for completing any formal outfit, from office wear to special occasions. The sleek designs complement both formal pants and trousers beautifully. Available in multiple sizes (M, XL, XXL) for the perfect fit. Click through the gallery to view both full-length belt variations and choose the perfect match for your style.",
    sizes: ["M", "XL", "XXL"],
    colors: ["Black", "Beige"],
    material: "Premium Leather Blend",
    inStock: true,
    isNew: true,
  },
  {
    id: "fp-032",
    name: "Premium Straight Fit Formal Pants - Black",
    category: "formal",
    price: 1199,
    originalPrice: 1500,
    image: blackstraight,
    images: [blackstraight, blackstraight1, blackstraight2],
    description: "Elevate your formal wardrobe with our premium straight fit formal pants. Crafted with superior quality fabric for a sharp, sophisticated look. Features a modern straight-leg silhouette that pairs perfectly with any formal shirt or blazer. Perfect for office wear, business meetings, and special occasions. The sleek black finish adds elegance to your professional look. Click through to view all angle details.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
  }
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
