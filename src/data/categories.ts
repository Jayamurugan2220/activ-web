// Category data structure for the product catalog
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  children?: Category[];
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

// B2B Categories
export const b2bCategories: Category[] = [
  {
    id: "b2b-textiles",
    name: "Textiles",
    slug: "textiles",
    description: "Organic cotton textiles, handloom fabrics, and sustainable materials",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "b2b-handicrafts",
    name: "Handicrafts",
    slug: "handicrafts",
    description: "Traditional handmade products including pottery, woodwork, and metal crafts",
    isActive: true,
    sortOrder: 2
  },
  {
    id: "b2b-food-products",
    name: "Food Products",
    slug: "food-products",
    description: "Organic spices, grains, and processed food items",
    isActive: true,
    sortOrder: 3
  },
  {
    id: "b2b-furniture",
    name: "Furniture",
    slug: "furniture",
    description: "Handcrafted and sustainable furniture solutions",
    isActive: true,
    sortOrder: 4
  },
  {
    id: "b2b-health-wellness",
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Ayurvedic products, herbal remedies, and wellness items",
    isActive: true,
    sortOrder: 5
  },
  {
    id: "b2b-electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Consumer electronics and accessories",
    isActive: true,
    sortOrder: 6
  },
  {
    id: "b2b-agricultural",
    name: "Agricultural Products",
    slug: "agricultural-products",
    description: "Seeds, fertilizers, and farming equipment",
    isActive: true,
    sortOrder: 7
  }
];

// B2C Categories
export const b2cCategories: Category[] = [
  {
    id: "b2c-clothing",
    name: "Clothing",
    slug: "clothing",
    description: "Traditional and modern apparel for men, women, and children",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "b2c-groceries",
    name: "Groceries",
    slug: "groceries",
    description: "Daily essentials, organic products, and packaged foods",
    isActive: true,
    sortOrder: 2
  },
  {
    id: "b2c-home-decor",
    name: "Home Decor",
    slug: "home-decor",
    description: "Interior decoration items, lighting, and household accessories",
    isActive: true,
    sortOrder: 3
  },
  {
    id: "b2c-beauty",
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, cosmetics, and personal care products",
    isActive: true,
    sortOrder: 4
  },
  {
    id: "b2c-kitchen",
    name: "Kitchen",
    slug: "kitchen",
    description: "Cookware, utensils, and kitchen accessories",
    isActive: true,
    sortOrder: 5
  },
  {
    id: "b2c-electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Consumer electronics and gadgets",
    isActive: true,
    sortOrder: 6
  },
  {
    id: "b2c-jewelry",
    name: "Jewelry",
    slug: "jewelry",
    description: "Traditional and contemporary jewelry pieces",
    isActive: true,
    sortOrder: 7
  }
];

// Unified category structure for admin management
export const allCategories: Category[] = [
  ...b2bCategories.map(cat => ({ ...cat, id: `b2b-${cat.id}` })),
  ...b2cCategories.map(cat => ({ ...cat, id: `b2c-${cat.id}` }))
];

// Function to get categories by type
export const getCategoriesByType = (type: "b2b" | "b2c"): Category[] => {
  return type === "b2b" ? b2bCategories : b2cCategories;
};

// Function to get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return allCategories.find(category => category.id === id);
};

// Function to get child categories
export const getChildCategories = (parentId: string): Category[] => {
  return allCategories.filter(category => category.parentId === parentId);
};

export default {
  b2bCategories,
  b2cCategories,
  allCategories,
  getCategoriesByType,
  getCategoryById,
  getChildCategories
};