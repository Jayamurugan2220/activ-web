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
  MapPin,
  SlidersHorizontal
} from "lucide-react";

import { sampleB2CProducts } from "@/data/products";
import { b2cCategories } from "@/data/categories";

const B2CCatalog = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 0,
    inStockOnly: false,
    selectedBrands: [] as string[]
  });

  const filteredProducts = sampleB2CProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === "All Categories" || product.category === selectedCategory
    )
    .filter(product => {
      // Apply advanced filters
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }
      if (filters.maxPrice > 0 && product.pricing.basePrice > filters.maxPrice) {
        return false;
      }
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricing.basePrice - b.pricing.basePrice;
      if (sortBy === "price-high") return b.pricing.basePrice - a.pricing.basePrice;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleAddToCart = (product: typeof sampleB2CProducts[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      seller: product.seller.name,
      price: product.pricing.basePrice,
      quantity: 1,
      image: product.images[0]?.url || "/placeholder.svg",
      inStock: product.inStock
    });
    
    alert(`${product.name} added to cart!`);
  };

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      maxPrice: 0,
      inStockOnly: false,
      selectedBrands: []
    });
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSortBy("rating");
  };

  // Get unique brands from products
  const brands = Array.from(new Set(sampleB2CProducts.map(p => p.seller.name)));

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
            <div className="space-y-4">
              {/* Main Search Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products, brands, or categories..."
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
                  <option value="All Categories">All Categories</option>
                  {b2cCategories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
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
                  <option value="newest">Newest First</option>
                </select>
              </div>
              
              {/* Advanced Filters Toggle */}
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                  {(filters.minRating > 0 || filters.maxPrice > 0 || filters.inStockOnly || filters.selectedBrands.length > 0) && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.selectedBrands.length + (filters.minRating > 0 ? 1 : 0) + (filters.maxPrice > 0 ? 1 : 0) + (filters.inStockOnly ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                
                {(filters.minRating > 0 || filters.maxPrice > 0 || filters.inStockOnly || filters.selectedBrands.length > 0) && (
                  <Button 
                    variant="ghost" 
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-destructive"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              
              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t">
                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Minimum Rating</h4>
                    <div className="space-y-2">
                      {[4, 3, 2].map(rating => (
                        <div key={rating} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`rating-${rating}`}
                            name="min-rating"
                            checked={filters.minRating === rating}
                            onChange={() => setFilters({...filters, minRating: rating})}
                            className="w-4 h-4"
                          />
                          <label 
                            htmlFor={`rating-${rating}`}
                            className="text-sm cursor-pointer flex items-center gap-1"
                          >
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span>& Up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Max Price</h4>
                    <div className="space-y-2">
                      {[500, 1000, 2000, 5000].map(price => (
                        <div key={price} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`price-${price}`}
                            name="max-price"
                            checked={filters.maxPrice === price}
                            onChange={() => setFilters({...filters, maxPrice: price})}
                            className="w-4 h-4"
                          />
                          <label 
                            htmlFor={`price-${price}`}
                            className="text-sm cursor-pointer"
                          >
                            Under ₹{price.toLocaleString()}
                          </label>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="radio"
                          id="price-custom"
                          name="max-price"
                          checked={filters.maxPrice > 0 && ![500, 1000, 2000, 5000].includes(filters.maxPrice)}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        <Input 
                          type="number" 
                          placeholder="Custom max price" 
                          value={filters.maxPrice > 0 && ![500, 1000, 2000, 5000].includes(filters.maxPrice) ? filters.maxPrice : ''}
                          onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                          className="text-sm h-8"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div>
                    <h4 className="font-medium mb-3">Availability</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="in-stock"
                          checked={filters.inStockOnly}
                          onChange={(e) => setFilters({...filters, inStockOnly: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <label 
                          htmlFor="in-stock"
                          className="text-sm cursor-pointer"
                        >
                          In Stock Only
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Brands */}
                  <div>
                    <h4 className="font-medium mb-3">Brands</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {brands.map(brand => (
                        <div key={brand} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`brand-${brand}`}
                            checked={filters.selectedBrands.includes(brand)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({...filters, selectedBrands: [...filters.selectedBrands, brand]});
                              } else {
                                setFilters({...filters, selectedBrands: filters.selectedBrands.filter(b => b !== brand)});
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <label 
                            htmlFor={`brand-${brand}`}
                            className="text-sm cursor-pointer"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                  <p className="text-2xl font-bold">{sampleB2CProducts.length}</p>
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
                  <p className="text-sm text-muted-foreground">Top Rated</p>
                  <p className="text-2xl font-bold">{sampleB2CProducts.filter(p => p.rating >= 4.5).length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{b2cCategories.length - 1}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Filter className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-medium border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center relative">
                  <img 
                    src={product.images[0]?.url || "/placeholder.svg"} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  {product.pricing.originalPrice && product.pricing.originalPrice > product.pricing.basePrice && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      {Math.round((product.pricing.originalPrice - product.pricing.basePrice) / product.pricing.originalPrice * 100)}% OFF
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart 
                      className={`w-5 h-5 ${favorites.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} 
                    />
                  </Button>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-primary text-primary-foreground text-[8px]">
                        {product.seller.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{product.seller.name}</span>
                  </div>
                  
                  {/* Pricing and Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xl font-bold">{product.pricing.basePrice}</span>
                      </div>
                      {product.pricing.originalPrice && product.pricing.originalPrice > product.pricing.basePrice && (
                        <div className="flex items-baseline gap-1">
                          <IndianRupee className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground line-through">{product.pricing.originalPrice}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                    </div>
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