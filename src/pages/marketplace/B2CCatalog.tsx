import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ShoppingCart,
  Heart,
  Star,
  IndianRupee,
  MapPin
} from "lucide-react";

// Mock product data
const products = [
  {
    id: "C001",
    name: "Handwoven Cotton Saree",
    seller: "Traditional Weavers",
    sellerId: "ST004",
    price: 2500,
    originalPrice: 3000,
    discount: 17,
    category: "Clothing",
    rating: 4.7,
    reviews: 124,
    image: "/placeholder.svg",
    location: "Varanasi, Uttar Pradesh",
    description: "Beautiful handwoven cotton saree with traditional designs",
    tags: ["Handloom", "Cotton", "Traditional"],
    inStock: true
  },
  {
    id: "C002",
    name: "Organic Turmeric Powder",
    seller: "Heritage Spices Ltd",
    sellerId: "ST003",
    price: 150,
    originalPrice: 200,
    discount: 25,
    category: "Groceries",
    rating: 4.9,
    reviews: 87,
    image: "/placeholder.svg",
    location: "Kochi, Kerala",
    description: "100% pure organic turmeric powder with high curcumin content",
    tags: ["Organic", "Spices", "Healthy"],
    inStock: true
  },
  {
    id: "C003",
    name: "Handcrafted Wooden Jewelry Box",
    seller: "Artisan Crafts",
    sellerId: "ST006",
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    category: "Jewelry",
    rating: 4.6,
    reviews: 56,
    image: "/placeholder.svg",
    location: "Jaipur, Rajasthan",
    description: "Beautiful wooden jewelry box with intricate hand-carved designs",
    tags: ["Handcrafted", "Wooden", "Gift"],
    inStock: true
  },
  {
    id: "C004",
    name: "Organic Face Cream",
    seller: "Natural Beauty Co",
    sellerId: "ST007",
    price: 450,
    originalPrice: 600,
    discount: 25,
    category: "Beauty",
    rating: 4.8,
    reviews: 78,
    image: "/placeholder.svg",
    location: "Bangalore, Karnataka",
    description: "Nourishing face cream made with organic ingredients",
    tags: ["Organic", "Natural", "Skincare"],
    inStock: true
  },
  {
    id: "C005",
    name: "Bamboo Cutting Board",
    seller: "Eco Furniture Makers",
    sellerId: "ST005",
    price: 450,
    originalPrice: 600,
    discount: 25,
    category: "Kitchen",
    rating: 4.5,
    reviews: 43,
    image: "/placeholder.svg",
    location: "Mysore, Karnataka",
    description: "Durable bamboo cutting board, eco-friendly and sustainable",
    tags: ["Eco-friendly", "Bamboo", "Sustainable"],
    inStock: true
  },
  {
    id: "C006",
    name: "Handloom Cotton Cushion Covers",
    seller: "Traditional Weavers",
    sellerId: "ST004",
    price: 600,
    originalPrice: 800,
    discount: 25,
    category: "Home Decor",
    rating: 4.7,
    reviews: 67,
    image: "/placeholder.svg",
    location: "Varanasi, Uttar Pradesh",
    description: "Set of 2 handloom cotton cushion covers with traditional patterns",
    tags: ["Handloom", "Cotton", "Traditional"],
    inStock: false
  }
];

const categories = [
  "All Categories",
  "Clothing",
  "Groceries",
  "Home Decor",
  "Beauty",
  "Kitchen",
  "Electronics",
  "Jewelry"
];

const B2CCatalog = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === "All Categories" || product.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      seller: product.seller,
      price: product.price,
      quantity: 1,
      image: product.image,
      inStock: product.inStock
    });
    
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">B2C Product Marketplace</h1>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {/* Sort */}
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-medium border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      {product.discount}% OFF
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart 
                      className={`w-5 h-5 ${favorites.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-white drop-shadow'}`} 
                    />
                  </Button>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.seller}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold">{product.price}</span>
                    </div>
                    {product.originalPrice > product.price && (
                      <>
                        <IndianRupee className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{product.location.split(',')[0]}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      disabled={!product.inStock}
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button 
                      className="flex-1"
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default B2CCatalog;