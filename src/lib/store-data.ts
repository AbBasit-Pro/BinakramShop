export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  transactionId?: string;
}

export const categories = [
  'Kurta',
  'Shalwar Kameez',
  'Unstitched',
  'Formal',
  'Casual',
  'Eid Collection',
  'Sale'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton Kurta',
    price: 2500,
    originalPrice: 3200,
    image: 'https://images.unsplash.com/photo-1618354691321-e851c56960d1?w=400',
    category: 'Men Kurta',
    description: 'Soft cotton kurta perfect for daily and casual wear.',
    inStock: true,
    rating: 4.6,
    reviews: 120
  },
  {
    id: '2',
    name: 'Classic Shalwar Kameez',
    price: 3500,
    originalPrice: 4200,
    image: 'https://images.unsplash.com/photo-1622473590773-f588134b6ce7?w=400',
    category: 'Shalwar Kameez',
    description: 'Traditional Pakistani shalwar kameez with premium stitching.',
    inStock: true,
    rating: 4.8,
    reviews: 210
  },
  {
    id: '3',
    name: 'Luxury Embroidered Kurta',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400',
    category: 'Festive Wear',
    description: 'Elegant embroidered kurta for weddings and events.',
    inStock: true,
    rating: 4.7,
    reviews: 95
  },
  {
    id: '4',
    name: 'Eid Special Kurta Set',
    price: 4200,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
    category: 'Eid Collection',
    description: 'Perfect Eid outfit with premium finishing.',
    inStock: true,
    rating: 4.9,
    reviews: 300
  },
  {
    id: '5',
    name: 'Casual Cotton Kurta',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400',
    category: 'Casual Wear',
    description: 'Lightweight kurta for everyday comfort.',
    inStock: true,
    rating: 4.3,
    reviews: 75
  },
  {
    id: '6',
    name: 'Formal Dress Suit Fabric',
    price: 3000,
    originalPrice: 3800,
    image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?w=400',
    category: 'Formal Wear',
    description: 'High-quality fabric for formal stitched suits.',
    inStock: true,
    rating: 4.5,
    reviews: 60
  },
  {
    id: '7',
    name: 'Winter Wool Kurta',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1602810318383-74e2f1c1f1c5?w=400',
    category: 'Winter Collection',
    description: 'Warm wool kurta perfect for cold weather.',
    inStock: true,
    rating: 4.4,
    reviews: 88
  },
  {
    id: '8',
    name: 'Designer Party Kurta',
    price: 5000,
    originalPrice: 6500,
    image: 'https://images.unsplash.com/photo-1602810318358-5c1c1c1c1c1c?w=400',
    category: 'Festive Wear',
    description: 'Stylish designer kurta for parties and weddings.',
    inStock: true,
    rating: 4.8,
    reviews: 150
  }
];
