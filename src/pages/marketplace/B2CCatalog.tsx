import { useState } from "react";
import { Link } from "react-router-dom";
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
    description: "100% pure organic turmeric powder, 500g pack",
    tags: ["Organic", "Natural", "Spices"],
    inStock: true
  },
  {
    id: "C003",
    name: "Handcrafted Wooden Bowl Set",
    seller: "Artisan Pottery Studio",
    sellerId: "ST002",
    price: 800,
    originalPrice: 1000,
    discount: 20,
    category: "Home Decor",
    rating: 4.6,
    reviews: 56,
    image: "/placeholder.svg",
    location: "Jaipur, Rajasthan",
    description: "Set of 4 handcrafted wooden bowls with natural finish",
    tags: ["Handmade", "Wooden", "Eco-friendly"],
    inStock: true
  },
  {
    id: "C004",
    name: "Ayurvedic Face Pack",
    seller: "Natural Wellness Co",
    sellerId: "ST006",
    price: 250,
    originalPrice: 300,
    discount: 17,
    category: "Beauty",
    rating: 4.8,
    reviews: 92,
    image: "/placeholder.svg",
    location: "Bangalore, Karnataka",
    description: "Natural Ayurvedic face pack for glowing skin, 100g",
    tags: ["Natural", "Ayurvedic", "Organic"],
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
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {/* Sort */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold">{products.filter(p => p.inStock).length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Filter className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{categories.length - 1}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Filter className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">4.7</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-medium border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  
                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart 
                      className={`w-5 h-5 ${favorites.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} 
                    />
                  </Button>
                  
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      {product.discount}% OFF
                    </Badge>
                  )}
                  
                  {/* Out of Stock Badge */}
                  {!product.inStock && (
                    <Badge variant="destructive" className="absolute bottom-2 left-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                  
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {product.seller.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{product.seller}</span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{product.price}</span>
                    </div>
                    {product.originalPrice > product.price && (
                      <>
                        <IndianRupee className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{product.location.split(',')[0]}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      disabled={!product.inStock}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button 
                      className="flex-1"
                      disabled={!product.inStock}
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