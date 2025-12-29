import formal1 from '@/assets/products/formal-1.jpeg';
import formal2 from '@/assets/products/formal-2.jpeg';
import formal3 from '@/assets/products/formal-3.jpeg';
import formal4 from '@/assets/products/formal-4.jpeg';
import formal5 from '@/assets/products/formal-5.jpeg';
import formal6 from '@/assets/products/formal-6.jpeg';
import formal7 from '@/assets/products/formal-7.jpeg';
import formal8 from '@/assets/products/formal-8.jpeg';
import jeans1 from '@/assets/products/jeans-1.jpg';
import jeans2 from '@/assets/products/jeans-2.jpg';
import jeans3 from '@/assets/products/jeans-3.jpg';
import track1 from '@/assets/products/track-1.jpg';
import track2 from '@/assets/products/track-2.jpg';
import track3 from '@/assets/products/track-3.jpg';

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
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  // Formal Pants
  {
    id: 'formal-1',
    name: 'Classic Black Wide Leg Trousers',
    price: 2999,
    originalPrice: 3999,
    category: 'formal',
    image: formal1,
    images: [formal1],
    description: 'Elegant high-waisted wide leg trousers in premium black fabric. Perfect for office wear and formal occasions. Features pleated front and comfortable fit.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black'],
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 'formal-2',
    name: 'Grey Tailored Palazzo Pants',
    price: 2799,
    category: 'formal',
    image: formal2,
    images: [formal2, formal3],
    description: 'Sophisticated grey palazzo pants with matching vest set. Premium cotton blend fabric with elegant drape and comfortable waistband.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey'],
    inStock: true,
    isBestSeller: true,
  },
  {
    id: 'formal-3',
    name: 'Premium Suit Pants Set',
    price: 4999,
    originalPrice: 5999,
    category: 'formal',
    image: formal4,
    images: [formal4],
    description: 'Luxurious black formal suit pants with cropped blazer coordination. High-rise design with pleated waist for a flattering silhouette.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black'],
    inStock: true,
    isNew: true,
  },
  {
    id: 'formal-4',
    name: 'Chocolate Wide Leg Trousers',
    price: 2599,
    category: 'formal',
    image: formal5,
    images: [formal5],
    description: 'Rich chocolate brown wide leg pants with premium button detailing. High-waisted design with flowing silhouette perfect for any occasion.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Brown'],
    inStock: true,
  },
  {
    id: 'formal-5',
    name: 'Cream Pleated Wide Pants',
    price: 2899,
    category: 'formal',
    image: formal6,
    images: [formal6],
    description: 'Elegant cream colored wide leg pants with pleated front. Premium fabric with comfortable fit, perfect for summer formal wear.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Beige'],
    inStock: true,
    isNew: true,
  },
  {
    id: 'formal-6',
    name: 'Charcoal Tie-Waist Trousers',
    price: 2699,
    category: 'formal',
    image: formal7,
    images: [formal7, formal8],
    description: 'Stylish charcoal grey trousers with paper bag waist and tie belt. Premium cashmere blend fabric for ultimate comfort and elegance.',
    sizes: ['S', 'M', 'L'],
    colors: ['Charcoal Grey'],
    inStock: true,
    isBestSeller: true,
  },
  // Jeans
  {
    id: 'jeans-1',
    name: 'Classic Blue Skinny Jeans',
    price: 1999,
    category: 'jeans',
    image: jeans1,
    images: [jeans1],
    description: 'Premium dark blue skinny jeans with perfect stretch. High-rise design with flattering fit for all body types.',
    sizes: ['26', '28', '30', '32', '34'],
    colors: ['Dark Blue'],
    inStock: true,
    isBestSeller: true,
  },
  {
    id: 'jeans-2',
    name: 'Light Wash Boyfriend Jeans',
    price: 2199,
    category: 'jeans',
    image: jeans2,
    images: [jeans2],
    description: 'Relaxed fit light wash boyfriend jeans. Comfortable cotton denim with vintage-inspired wash and rolled cuff styling.',
    sizes: ['26', '28', '30', '32', '34'],
    colors: ['Light Blue'],
    inStock: true,
    isNew: true,
  },
  {
    id: 'jeans-3',
    name: 'Black Straight Leg Jeans',
    price: 2399,
    originalPrice: 2999,
    category: 'jeans',
    image: jeans3,
    images: [jeans3],
    description: 'Classic black straight leg jeans in premium denim. High-rise design with timeless silhouette perfect for any occasion.',
    sizes: ['26', '28', '30', '32'],
    colors: ['Black'],
    inStock: true,
  },
  // Track Pants
  {
    id: 'track-1',
    name: 'Grey Athletic Joggers',
    price: 1799,
    category: 'track',
    image: track1,
    images: [track1],
    description: 'Comfortable grey athletic joggers with tapered fit. Premium cotton blend fabric with moisture-wicking properties.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Grey'],
    inStock: true,
  },
  {
    id: 'track-2',
    name: 'Black Performance Track Pants',
    price: 1999,
    originalPrice: 2499,
    category: 'track',
    image: track2,
    images: [track2],
    description: 'Sleek black performance track pants with elasticated waist. Perfect for workouts and casual everyday wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    inStock: true,
    isBestSeller: true,
  },
  {
    id: 'track-3',
    name: 'Beige Cargo Joggers',
    price: 2199,
    category: 'track',
    image: track3,
    images: [track3],
    description: 'Trendy beige cargo joggers with utility pockets. Comfortable drawstring waist and tapered leg for a modern athleisure look.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Beige'],
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
