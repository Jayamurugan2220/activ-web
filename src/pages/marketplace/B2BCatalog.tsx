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
  Building,
  Package,
  IndianRupee,
  Star,
  MapPin
} from "lucide-react";

// Mock product data
const products = [
  {
    id: "P001",
    name: "Organic Cotton Textiles",
    seller: "Green Textiles Co.",
    sellerId: "ST001",
    price: 1200,
    minOrder: 50,
    category: "Textiles",
    rating: 4.8,
    reviews: 24,
    image: "/placeholder.svg",
    location: "Coimbatore, Tamil Nadu",
    description: "Premium organic cotton textiles for sustainable fashion brands",
    tags: ["Organic", "Sustainable", "Wholesale"]
  },
  {
    id: "P002",
    name: "Handcrafted Pottery",
    seller: "Artisan Pottery Studio",
    sellerId: "ST002",
    price: 800,
    minOrder: 20,
    category: "Handicrafts",
    rating: 4.6,
    reviews: 18,
    image: "/placeholder.svg",
    location: "Jaipur, Rajasthan",
    description: "Traditional handcrafted pottery with modern designs",
    tags: ["Handmade", "Traditional", "Artisan"]
  },
  {
    id: "P003",
    name: "Spices Collection",
    seller: "Heritage Spices Ltd",
    sellerId: "ST003",
    price: 1500,
    minOrder: 100,
    category: "Food Products",
    rating: 4.9,
    reviews: 42,
    image: "/placeholder.svg",
    location: "Kochi, Kerala",
    description: "Premium quality spices sourced directly from farmers",
    tags: ["Organic", "Fresh", "Wholesale"]
  },
  {
    id: "P004",
    name: "Handloom Sarees",
    seller: "Traditional Weavers",
    sellerId: "ST004",
    price: 2500,
    minOrder: 10,
    category: "Textiles",
    rating: 4.7,
    reviews: 31,
    image: "/placeholder.svg",
    location: "Varanasi, Uttar Pradesh",
    description: "Authentic handloom silk sarees with traditional designs",
    tags: ["Handloom", "Silk", "Traditional"]
  },
  {
    id: "P005",
    name: "Bamboo Furniture",
    seller: "Eco Furniture Makers",
    sellerId: "ST005",
    price: 3500,
    minOrder: 5,
    category: "Furniture",
    rating: 4.5,
    reviews: 15,
    image: "/placeholder.svg",
    location: "Mysore, Karnataka",
    description: "Sustainable bamboo furniture for eco-friendly homes",
    tags: ["Eco-friendly", "Sustainable", "Handcrafted"]
  },
  {
    id: "P006",
    name: "Ayurvedic Products",
    seller: "Natural Wellness Co",
    sellerId: "ST006",
    price: 950,
    minOrder: 50,
    category: "Health & Wellness",
    rating: 4.8,
    reviews: 28,
    image: "/placeholder.svg",
    location: "Bangalore, Karnataka",
    description: "Pure Ayurvedic products for health and wellness",
    tags: ["Natural", "Ayurvedic", "Organic"]
  }
];

const categories = [
  "All Categories",
  "Textiles",
  "Handicrafts",
  "Food Products",
  "Furniture",
  "Health & Wellness",
  "Electronics",
  "Agricultural Products"
];

const B2BCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("rating");

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
          <h1 className="text-2xl font-bold">B2B Product Catalog</h1>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or suppliers..."
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
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified Suppliers</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-success" />
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
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-medium border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {product.seller.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{product.seller}</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{product.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Pricing and Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xl font-bold">{product.price}</span>
                        <span className="text-sm text-muted-foreground">/ unit</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Min. order: {product.minOrder} units</p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Inquiry
                    </Button>
                    <Button className="flex-1">
                      View Details
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
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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

export default B2BCatalog;