// Product data structure for the catalog
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface SellerInfo {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  since: string;
  verified: boolean;
  location: string;
  responseTime: string;
}

export interface PricingModel {
  type: "fixed" | "bulk" | "tiered" | "subscription";
  basePrice?: number;
  originalPrice?: number;
  bulkPrices?: Array<{ minQty: number; price: number }>;
  tieredPrices?: Array<{ tier: string; price: number }>;
  subscriptionDetails?: {
    interval: "day" | "week" | "month" | "year";
    price: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  tags: string[];
  images: ProductImage[];
  variants?: ProductVariant[];
  specifications: ProductSpecification[];
  pricing: PricingModel;
  seller: SellerInfo;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  certifications?: string[];
  shippingInfo?: {
    freeShipping: boolean;
    estimatedDelivery: string;
    shippingCost?: number;
  };
}

// Sample B2B Products
export const sampleB2BProducts: Product[] = [
  {
    id: "b2b-001",
    name: "Organic Cotton Textiles - 54 inches",
    slug: "organic-cotton-textiles-54-inches",
    description: "Premium organic cotton textiles for sustainable fashion brands. Our textiles are made from 100% organic cotton, ethically sourced and produced with eco-friendly processes. Perfect for fashion brands looking to offer sustainable clothing options.",
    shortDescription: "High-quality organic cotton textiles in 54-inch width",
    category: "b2b-textiles",
    tags: ["Organic", "Sustainable", "Wholesale", "Eco-friendly"],
    images: [
      {
        id: "img-001",
        url: "/placeholder.svg",
        alt: "Organic Cotton Textiles",
        isPrimary: true
      }
    ],
    specifications: [
      { name: "Material", value: "100% Organic Cotton" },
      { name: "Thread Count", value: "200 TC" },
      { name: "Width", value: "54 inches" },
      { name: "Weight", value: "150 GSM" },
      { name: "Color", value: "Natural White" },
      { name: "Certification", value: "GOTS Certified" }
    ],
    pricing: {
      type: "bulk",
      bulkPrices: [
        { minQty: 1, price: 1200 },
        { minQty: 50, price: 1100 },
        { minQty: 100, price: 1000 },
        { minQty: 500, price: 900 }
      ]
    },
    seller: {
      id: "seller-001",
      name: "Green Textiles Co.",
      rating: 4.8,
      reviewCount: 128,
      since: "2018",
      verified: true,
      location: "Coimbatore, Tamil Nadu",
      responseTime: "2 hrs"
    },
    rating: 4.8,
    reviewCount: 24,
    inStock: true,
    stockCount: 1000,
    minOrderQuantity: 50,
    maxOrderQuantity: 10000,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    status: "published",
    featured: true,
    certifications: ["GOTS", "ISO 9001"],
    shippingInfo: {
      freeShipping: false,
      estimatedDelivery: "5-7 business days",
      shippingCost: 500
    }
  },
  {
    id: "b2b-002",
    name: "Handcrafted Pottery - Large Vase",
    slug: "handcrafted-pottery-large-vase",
    description: "Beautiful handcrafted pottery vase made by skilled artisans using traditional techniques. Each piece is unique and showcases the rich heritage of Indian pottery.",
    shortDescription: "Traditional handcrafted pottery vase with intricate designs",
    category: "b2b-handicrafts",
    tags: ["Handmade", "Traditional", "Artisan", "Decorative"],
    images: [
      {
        id: "img-002",
        url: "/placeholder.svg",
        alt: "Handcrafted Pottery Vase",
        isPrimary: true
      }
    ],
    specifications: [
      { name: "Material", value: "Terracotta Clay" },
      { name: "Height", value: "30 cm" },
      { name: "Diameter", value: "20 cm" },
      { name: "Weight", value: "1.2 kg" },
      { name: "Finish", value: "Glazed" },
      { name: "Care Instructions", value: "Hand wash recommended" }
    ],
    pricing: {
      type: "fixed",
      basePrice: 2500
    },
    seller: {
      id: "seller-002",
      name: "Artisan Pottery Studio",
      rating: 4.6,
      reviewCount: 87,
      since: "2019",
      verified: true,
      location: "Jaipur, Rajasthan",
      responseTime: "4 hrs"
    },
    rating: 4.6,
    reviewCount: 18,
    inStock: true,
    stockCount: 50,
    minOrderQuantity: 10,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    status: "published",
    featured: false,
    shippingInfo: {
      freeShipping: false,
      estimatedDelivery: "7-10 business days",
      shippingCost: 300
    }
  }
];

// Sample B2C Products
export const sampleB2CProducts: Product[] = [
  {
    id: "b2c-001",
    name: "Handwoven Cotton Saree",
    slug: "handwoven-cotton-saree",
    description: "Beautiful handwoven cotton saree with traditional designs. Made with pure cotton and dyed with natural dyes, this saree is perfect for daily wear and special occasions.",
    shortDescription: "Traditional handwoven cotton saree with elegant design",
    category: "b2c-clothing",
    tags: ["Handloom", "Cotton", "Traditional", "Eco-friendly"],
    images: [
      {
        id: "img-003",
        url: "/placeholder.svg",
        alt: "Handwoven Cotton Saree",
        isPrimary: true
      },
      {
        id: "img-004",
        url: "/placeholder.svg",
        alt: "Handwoven Cotton Saree - Back View",
        isPrimary: false
      }
    ],
    specifications: [
      { name: "Fabric", value: "100% Cotton" },
      { name: "Length", value: "5.5 meters" },
      { name: "Width", value: "1.2 meters" },
      { name: "Blouse Piece", value: "0.8 meters" },
      { name: "Pattern", value: "Traditional Weave" },
      { name: "Care Instructions", value: "Machine wash cold, tumble dry low" }
    ],
    pricing: {
      type: "fixed",
      basePrice: 2500,
      originalPrice: 3000
    },
    seller: {
      id: "seller-001",
      name: "Traditional Weavers",
      rating: 4.7,
      reviewCount: 156,
      since: "2015",
      verified: true,
      location: "Varanasi, Uttar Pradesh",
      responseTime: "3 hrs"
    },
    rating: 4.7,
    reviewCount: 124,
    inStock: true,
    stockCount: 25,
    minOrderQuantity: 1,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
    status: "published",
    featured: true,
    certifications: ["Handloom Mark"],
    shippingInfo: {
      freeShipping: true,
      estimatedDelivery: "3-5 business days"
    }
  },
  {
    id: "b2c-002",
    name: "Organic Turmeric Powder",
    slug: "organic-turmeric-powder",
    description: "100% pure organic turmeric powder with high curcumin content. Sourced directly from farmers and processed without any additives or preservatives.",
    shortDescription: "Premium quality organic turmeric powder - 100g pack",
    category: "b2c-groceries",
    tags: ["Organic", "Spices", "Healthy", "Natural"],
    images: [
      {
        id: "img-005",
        url: "/placeholder.svg",
        alt: "Organic Turmeric Powder",
        isPrimary: true
      }
    ],
    specifications: [
      { name: "Net Weight", value: "100g" },
      { name: "Ingredients", value: "100% Organic Turmeric" },
      { name: "Curcumin Content", value: "3-5%" },
      { name: "Shelf Life", value: "18 months" },
      { name: "Storage", value: "Store in cool, dry place" },
      { name: "Certification", value: "Organic India Certified" }
    ],
    pricing: {
      type: "fixed",
      basePrice: 150,
      originalPrice: 200
    },
    seller: {
      id: "seller-003",
      name: "Heritage Spices Ltd",
      rating: 4.9,
      reviewCount: 203,
      since: "2017",
      verified: true,
      location: "Kochi, Kerala",
      responseTime: "1 hr"
    },
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    stockCount: 500,
    minOrderQuantity: 1,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
    status: "published",
    featured: true,
    certifications: ["Organic India", "FSSAI"],
    shippingInfo: {
      freeShipping: true,
      estimatedDelivery: "2-4 business days"
    }
  }
];

// Combined product list
export const allProducts = [...sampleB2BProducts, ...sampleB2CProducts];

// Function to get products by category
export const getProductsByCategory = (categoryId: string): Product[] => {
  return allProducts.filter(product => product.category === categoryId);
};

// Function to get featured products
export const getFeaturedProducts = (): Product[] => {
  return allProducts.filter(product => product.featured);
};

// Function to get products by seller
export const getProductsBySeller = (sellerId: string): Product[] => {
  return allProducts.filter(product => product.seller.id === sellerId);
};

export default {
  sampleB2BProducts,
  sampleB2CProducts,
  allProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getProductsBySeller
};