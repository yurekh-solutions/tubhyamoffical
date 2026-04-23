const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

// All products data from the frontend
const productsData = [
  {
    id: "pt-004",
    name: "Relaxed Fit Elastic Waist Trousers",
    category: "track",
    price: 1899,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/olivecomfort.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/olivecomfort.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/olivecomfort1.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/olivecomfort2.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/olivecomfort3.png"
    ],
    description: "Minimalist relaxed-fit trousers featuring an elastic waistband for all-day comfort. Designed with a straight wide-leg silhouette, these trousers offer a clean, effortless look suitable for casual and semi-formal wear. Premium olive tone with versatile styling options shown in multiple views.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Olive Green"],
    material: "Cotton Blend Fabric",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "pt-005",
    name: "Drawstring Relaxed Fit Pants",
    category: "track",
    price: 1999,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blankpants.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blankpants.jpeg"],
    description: "Comfort-first relaxed fit pants featuring an elastic waistband with contrast drawstring detailing. Designed with a straight-leg silhouette and soft fabric for effortless everyday styling and maximum comfort.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    material: "Soft Cotton Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "fp-001",
    name: "Elegance Wide-Leg Trousers",
    category: "formal",
    price: 2499,
    originalPrice: 3499,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-6.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-6.jpeg"],
    description: "Sophisticated charcoal grey wide-leg trousers crafted from premium fabric. Features high-waist design with elegant pleats for a refined silhouette. Perfect for office wear and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal Grey", "Black", "Navy"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: "fp-002",
    name: "Camel Classic Palazzo",
    category: "formal",
    price: 2799,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-pants-2.jpg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-pants-2.jpg"],
    description: "Timeless camel-toned palazzo pants with a flattering high-waist cut. The flowing silhouette and premium fabric make this piece a wardrobe essential for the modern woman.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Camel", "Beige", "Cream"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-003",
    name: "Navy Executive Trousers",
    category: "formal",
    price: 2999,
    originalPrice: 3999,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-pants-3.jpg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-pants-3.jpg"],
    description: "Commanding navy blue executive trousers with impeccable tailoring. Features crisp pleats and a sleek wide-leg design that transitions effortlessly from boardroom to evening.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Navy Blue", "Black"],
    material: "Wool Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "jn-003",
    name: "Vintage Wash Flare Jeans",
    category: "jeans",
    price: 2599,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/products/jeans-3.jpg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/products/jeans-3.jpg"],
    description: "Retro-inspired light wash flare jeans with a flattering high-rise fit. The subtle flare creates an elongating effect while the soft denim ensures all-day comfort.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Light Wash", "Medium Wash"],
    material: "Premium Cotton Denim",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "jn-004",
    name: "Classic Blue Wide-Leg Jeans",
    category: "jeans",
    price: 2499,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/products/jeans-8.jpg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/products/jeans-8.jpg"],
    description: "Timeless blue wide-leg jeans with a modern silhouette. Features high-waist design with premium denim fabric for comfortable all-day wear and effortless style.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Classic Blue", "Medium Wash"],
    material: "Premium Denim",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "jn-005",
    name: "Relaxed Fit Straight Jeans",
    category: "jeans",
    price: 2699,
    originalPrice: 3299,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/products/jeans-33.jpg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/products/jeans-33.jpg"],
    description: "Comfortable relaxed fit straight jeans with vintage-inspired wash. Perfect blend of classic styling and contemporary comfort for everyday casual wear.",
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Wash", "Stone Wash"],
    material: "100% Cotton Denim",
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: "tp-002",
    name: "Cloud Grey Comfort Joggers",
    category: "track",
    price: 1699,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/track-pants-2.jpg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/track-pants-2.jpg"],
    description: "Ultra-soft grey joggers designed for maximum comfort without compromising on style. Perfect for lounging at home or running errands in effortless elegance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Grey", "Navy", "Black"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "tp-005",
    name: "Slim Fit Ankle Joggers",
    category: "track",
    price: 1899,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/slimfit.png",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/slimfit.png"],
    description: "Modern slim-fit joggers with ankle-length design. Features elastic waistband with contrast drawstring and side pockets. Perfect for athleisure and casual styling.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy"],
    material: "Performance Stretch Fabric",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "tp-006",
    name: "Classic Grey Trousers",
    category: "track",
    price: 1799,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/trousersgrey.png",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/trousersgrey.png"],
    description: "Comfortable grey trousers with relaxed fit. Features elastic waistband and side pockets. Perfect for loungewear and casual everyday comfort.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey", "Charcoal"],
    material: "Soft Cotton Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "tp-007",
    name: "Classic Beige Trousers",
    category: "track",
    price: 1799,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/trousers.png",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/trousers.png"],
    description: "Versatile beige trousers with comfortable fit. Features elastic waistband and practical pocket design. Ideal for casual wear and relaxed styling.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Sand", "Cream"],
    material: "Soft Cotton Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "tp-009",
    name: "Classic Black Cargo Pants",
    category: "track",
    price: 1200,
    originalPrice: 1499,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blackcar1.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blackcar1.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/balckcar2.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blackcargo1.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blackcargo2.png"
    ],
    description: "Modern black cargo pants featuring multiple utility pockets and relaxed fit. Crafted with durable fabric for everyday comfort and versatile styling. Perfect for casual outings and streetwear looks.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    material: "Premium Cotton Twill",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "tp-010",
    name: "Premium Black & Grey Track Pants",
    category: "track",
    price: 999,
    originalPrice: 1500,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/black.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/black.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blackback.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/grey.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/greyback.png"
    ],
    description: "Elegant premium track pants available in stunning black and grey colors. Features superior fabric quality, comfortable fit, and contemporary design perfect for athleisure and casual wear. Click through the gallery to see both color options with front and back views. Versatile styling for any occasion.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "tp-012",
    name: "Premium Khaki Comfort Track Pants",
    category: "track",
    price: 1200,
    originalPrice: 1800,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/khakifront.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/khakifront.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/khakiback.png"
    ],
    description: "Sophisticated khaki track pants crafted with premium cotton blend fabric for ultimate comfort and style. Features a relaxed fit design with elastic waistband, perfect for casual wear and athleisure styling. The versatile khaki tone pairs effortlessly with any outfit. Click through to view front and back details.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Khaki"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "tp-013",
    name: "Cargo Pants Collection",
    category: "track",
    price: 999,
    originalPrice: 1499,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/greycargo.jpeg",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/greycargo.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/greycargoback.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blackcargofront.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/blackcargoback.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/lavendercargofront.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/tracks/lavendercargofrontback.jpeg"
    ],
    description: "Versatile cargo pants collection available in three stunning colors - Grey, Black, and Lavender. Features multiple utility pockets, relaxed fit design, and durable premium fabric perfect for everyday comfort and streetwear styling. The modern cargo silhouette offers both functionality and fashion-forward appeal. Click through the gallery to explore all. Perfect for casual outings and contemporary urban style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey", "Black", "Lavender"],
    material: "Premium Cotton Twill",
    inStock: true,
    isNew: true,
    isBestSeller: true
  },
  {
    id: "acc-001",
    name: "Premium Formal Belt Collection",
    category: "formal",
    price: 1199,
    originalPrice: 1500,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/beltbeige.png"
    ],
    description: "Elevate your formal wear with our premium belt collection. Featuring two stunning color options - classic black and versatile beige - these belts are crafted with premium materials and exquisite detailing. Perfect for completing any formal outfit, from office wear to special occasions. The sleek designs complement both formal pants and trousers beautifully. Available in multiple sizes (M, XL, XXL) for the perfect fit. Click through the gallery to view both full-length belt variations and choose the perfect match for your style.",
    sizes: ["M", "XL", "XXL"],
    colors: ["Black", "Beige"],
    material: "Premium Leather Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-004",
    name: "Black Premium Trousers",
    category: "formal",
    price: 2899,
    originalPrice: 3799,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/imported-beggy-black.jpeg",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/imported-beggy-black.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/slimfit-formal-pants-black,grey.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt-formal-balck.jpeg"
    ],
    description: "Sophisticated black formal trousers with a sleek silhouette and premium finish. Features a modern flat-front design with perfect tailoring for contemporary business wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: "fp-005",
    name: "Olive Sophisticated Pants",
    category: "formal",
    price: 2599,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/olive-fomral-belt.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/olive-fomral-belt.jpeg"],
    description: "Elegant olive green trousers perfect for creating a statement at work or formal events. Crafted with premium fabric and impeccable seams for lasting quality.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green", "Sage", "Forest"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-006",
    name: "Graphite Executive Fit",
    category: "formal",
    price: 3099,
    originalPrice: 4199,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/preuim-gray.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/preuim-gray.jpeg"],
    description: "Sophisticated graphite pants designed for the modern professional woman. Features a slim fit with subtle sheen, perfect for boardroom to dinner transitions.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Graphite", "Slate Grey", "Dark Silver"],
    material: "Wool Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "fp-007",
    name: "Rose Gold Formal Pants",
    category: "formal",
    price: 2699,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-1.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-1.jpeg"],
    description: "Luxurious rose gold-toned formal pants with a subtle shimmer. High-waisted design with elegant draping for an effortlessly chic appearance.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Gold", "Mauve", "Blush"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "fp-008",
    name: "Teal Statement Trousers",
    category: "formal",
    price: 2799,
    originalPrice: 3599,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-2.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-2.jpeg"],
    description: "Bold teal formal trousers that make an elegant statement. Perfect for creative professionals who want sophistication with a twist of personality.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Teal", "Peacock", "Turquoise"],
    material: "Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-009",
    name: "Premium Beige Formal Pants",
    category: "formal",
    price: 2699,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/beige-formal.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/beige-formal.jpeg"],
    description: "Classic beige formal pants with elegant design. Perfect for professional settings with comfortable fit and premium fabric quality.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Cream"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "fp-010",
    name: "Belt Formal Pants - Black",
    category: "formal",
    price: 2899,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt-formal-balck.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt-formal-balck.jpeg"],
    description: "Sleek black formal pants with belt loops and tailored fit. Features side pockets and premium finish for office and formal occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: "fp-011",
    name: "Belt Formal Pants - Beige",
    category: "formal",
    price: 2799,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt-formal-beige.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt-formal-beige.jpeg"],
    description: "Elegant beige formal pants with belt design. Tailored cut with comfortable waistband and sophisticated styling for business wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Sand", "Cream"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-012",
    name: "Imported Belt Formal Pants",
    category: "formal",
    price: 3299,
    originalPrice: 4199,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt-imported.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/belt-imported.jpeg"],
    description: "Premium imported formal pants with belt styling. Features superior fabric quality and impeccable tailoring for the modern professional.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Multiple"],
    material: "Imported Premium Fabric",
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: "fp-013",
    name: "Olive Formal Belt Pants",
    category: "formal",
    price: 2899,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/olive-formal-belt.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/olive-formal-belt.jpeg"],
    description: "Sophisticated olive formal pants with belt design. Perfect blend of style and comfort for executive and professional settings.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green", "Sage"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-014",
    name: "Brown Formal Pants",
    category: "formal",
    price: 2699,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brown-formal.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brown-formal.jpeg"],
    description: "Classic brown formal pants with refined tailoring. Features comfortable fit and timeless design for versatile professional styling.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Brown", "Dark Brown", "Tan"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "fp-015",
    name: "Imported Baggy Formal - Black",
    category: "formal",
    price: 3099,
    originalPrice: 3899,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/imported-beggy-black-formal.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/imported-beggy-black-formal.jpeg"],
    description: "Trendy imported baggy formal pants in black. Modern relaxed fit with premium fabric and contemporary styling for fashion-forward professionals.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Imported Premium Fabric",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-016",
    name: "Imported Baggy Formal - Gray",
    category: "formal",
    price: 3099,
    originalPrice: 3899,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/imported-beggy-gray-formal.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/imported-beggy-gray-formal.jpeg"],
    description: "Stylish imported baggy formal pants in gray. Features relaxed comfortable fit with premium quality fabric for modern business casual wear.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Charcoal"],
    material: "Imported Premium Fabric",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-017",
    name: "Premium Black Formal Pants",
    category: "formal",
    price: 2999,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/preuim-black.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/preuim-black.jpeg"],
    description: "Premium black formal pants with superior tailoring. Classic design with modern fit for ultimate professional elegance.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Wool Blend",
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: "fp-018",
    name: "Premium Dark Brown Formal Pants",
    category: "formal",
    price: 2999,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/preuim-dark-brown.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/preuim-dark-brown.jpeg"],
    description: "Luxurious dark brown formal pants with premium finish. Sophisticated styling perfect for executive meetings and formal events.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Dark Brown", "Chocolate"],
    material: "Premium Wool Blend",
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: "fp-019",
    name: "Premium Gray Formal Pants",
    category: "formal",
    price: 2999,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-3.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/formal-3.jpeg"],
    description: "Elegant gray formal pants with premium quality fabric. Features refined tailoring and comfortable fit for sophisticated business attire.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Gray", "Silver"],
    material: "Premium Wool Blend",
    inStock: true,
    isNew: false,
    isBestSeller: false
  },
  {
    id: "fp-020",
    name: "Slim Fit Formal Pants - Black/Grey",
    category: "formal",
    price: 2799,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/slimfit-formal-pants-black,grey.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/slimfit-formal-pants-black,grey.jpeg"],
    description: "Modern slim fit formal pants available in black and grey. Tailored cut with stretch fabric for comfort and sophisticated professional styling.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey"],
    material: "Stretch Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-021",
    name: "White Formal Belt Pants",
    category: "formal",
    price: 2799,
    originalPrice: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/white-formal-belt.jpeg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/white-formal-belt.jpeg"],
    description: "Crisp white formal pants with belt design. Fresh, elegant styling perfect for summer business wear and formal occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Off-White"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-022",
    name: "Premium Brown Belt Formal Pants",
    category: "formal",
    price: 3999,
    originalPrice: 4500,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownbelt1.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownbelt1.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownbelt2.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownbelt3.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownbelt4.png"
    ],
    description: "Luxurious brown formal pants with elegant belt design. Features refined tailoring and premium fabric for sophisticated professional styling. Perfect for executive meetings and formal occasions with impeccable finish.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown", "Dark Brown", "Tan"],
    material: "Premium Wool Blend",
    inStock: true,
    isNew: true,
    isBestSeller: true
  },
  {
    id: "fp-023",
    name: "Grey Lace Formal Pants",
    category: "formal",
    price: 2200,
    originalPrice: 2999,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/greylace.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/greylace.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/greylaceback.png"
    ],
    description: "Elegant grey lace formal pants featuring delicate lace detailing and premium fabric. Perfect for special occasions and formal events. Crafted with comfort and style in mind for the modern woman.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Grey"],
    material: "Premium Lace Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-024",
    name: "Black Mom Fit Formal Trousers",
    category: "formal",
    price: 2100,
    originalPrice: 2400,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackmom.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackmom.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackmom1.png"
    ],
    description: "Elegant black mom fit formal trousers featuring a comfortable relaxed fit with premium fabric. Perfect for office wear and formal occasions. Designed with a flattering silhouette that offers both style and comfort for the modern woman.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-026",
    name: "Black Lace People Fit Formal Pants",
    category: "formal",
    price: 2399,
    originalPrice: 2999,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blacklace.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blacklace.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blacklace1.png"
    ],
    description: "Elegant black lace people fit formal pants featuring a flattering silhouette for everyone. Premium fabric with beautiful lace detailing. Perfect for office wear, formal events, and special occasions. Designed to celebrate all body types.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Lace Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-027",
    name: "Brown Lace People Fit Formal Pants",
    category: "formal",
    price: 2399,
    originalPrice: 2999,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownlace.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownlace.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownlace1.png"
    ],
    description: "Elegant brown lace people fit formal pants featuring a flattering silhouette for everyone. Premium fabric with beautiful lace detailing. Perfect for office wear, formal events, and special occasions. Designed to celebrate all body types.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown"],
    material: "Premium Lace Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-028",
    name: "Premium Wide Look Pants",
    category: "formal",
    price: 2100,
    originalPrice: 3000,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/widelook.jpeg",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/widelook.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/widelook1.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/widelook%20back.jpeg"
    ],
    description: "Sophisticated premium wide look formal pants with elegant styling and superior fabric quality. Features a flattering wide-leg silhouette perfect for modern professional wear. Designed with impeccable tailoring for boardroom meetings and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-029",
    name: "Brown Sophisticated Formal Wear",
    category: "formal",
    price: 2100,
    originalPrice: 3000,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownbelt.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownbelt.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownback.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/brownside.png"
    ],
    description: "Exquisite brown formal pants with sophisticated styling and premium craftsmanship. Features elegant belt design with refined tailoring. Perfect for professional settings and formal occasions. The rich brown tone adds warmth and elegance to any formal wardrobe.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-030",
    name: "Button Detail Formal Pants - Black",
    category: "formal",
    price: 1499,
    originalPrice: 1900,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackbutton.png",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackbutton.png"],
    description: "Elegant black formal pants featuring stylish button details and premium fabric. Perfect for office wear and formal occasions. Crafted with comfort and sophisticated styling for the modern professional woman.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-031",
    name: "Button Detail Formal Pants - Olive",
    category: "formal",
    price: 1499,
    originalPrice: 1900,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/olivedouble%20button.png",
    images: ["https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/olivedouble%20button.png"],
    description: "Elegant olive formal pants featuring stylish button details and premium fabric. Perfect for office wear and formal occasions. Crafted with comfort and sophisticated styling for the modern professional woman.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Olive"],
    material: "Premium Cotton Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-032",
    name: "Premium Straight Fit Formal Pants - Black",
    category: "formal",
    price: 1199,
    originalPrice: 1500,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackstraight.png",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackstraight.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackstraight1.png",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/blackstraight2.png"
    ],
    description: "Elevate your formal wardrobe with our premium straight fit formal pants. Crafted with superior quality fabric for a sharp, sophisticated look. Features a modern straight-leg silhouette that pairs perfectly with any formal shirt or blazer. Perfect for office wear, business meetings, and special occasions. The sleek black finish adds elegance to your professional look. Click through to view all angle details.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: "fp-033",
    name: "Premium Beige Formal Pants",
    category: "formal",
    price: 1299,
    originalPrice: 1800,
    image: "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/beige%20formal.jpeg",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/beige%20formal.jpeg",
      "https://res.cloudinary.com/demo/image/upload/v1700000000/tubhyam/formals/beige%20back%20formal.jpeg"
    ],
    description: "Sophisticated beige formal pants crafted with premium fabric for ultimate comfort and professional elegance. Features a refined straight-leg silhouette with impeccable tailoring perfect for office wear, business meetings, and formal occasions. The versatile beige tone pairs effortlessly with any formal shirt or blazer. Designed with a comfortable waistband and practical pocket details.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Beige"],
    material: "Premium Polyester Blend",
    inStock: true,
    isNew: true,
    isBestSeller: true
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(productsData);
    console.log(`Successfully seeded ${productsData.length} products`);

    // Show summary
    const formalCount = productsData.filter(p => p.category === 'formal').length;
    const jeansCount = productsData.filter(p => p.category === 'jeans').length;
    const trackCount = productsData.filter(p => p.category === 'track').length;
    
    console.log('\nProduct Summary:');
    console.log(`- Formal: ${formalCount}`);
    console.log(`- Jeans: ${jeansCount}`);
    console.log(`- Track: ${trackCount}`);
    console.log(`- Total: ${productsData.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run if executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, productsData };
