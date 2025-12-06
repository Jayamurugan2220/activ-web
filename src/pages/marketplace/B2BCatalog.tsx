import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ShoppingCart,
  Building,
  Package,
  IndianRupee,
  Star,
  MapPin,
  SlidersHorizontal,
  X
} from "lucide-react";
import { sampleB2BProducts as products } from "@/data/products";
import { b2bCategories as categories } from "@/data/categories";

// Extended filter options
const certifications = ["GOTS", "ISO 9001", "Organic India", "FSSAI", "Handloom Mark"];
const locations = ["All Locations", "Tamil Nadu", "Rajasthan", "Kerala", "Uttar Pradesh", "Karnataka", "Bangalore"];
const ratings = ["Any Rating", "4+ Stars", "3+ Stars", "2+ Stars"];

interface PriceRange {
  min?: number;
  max?: number;
}

interface Filters {
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  selectedLocations: string[];
  selectedCertifications: string[];
  selectedRatings: string[];
  priceRange: PriceRange;
  inStockOnly: boolean;
  minOrderQuantity: number;
}

const B2BCatalog = () => {
  const navigate = useNavigate();
  
  // Basic filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("rating");
  
  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    selectedCategory: "All Categories",
    sortBy: "rating",
    selectedLocations: [],
    selectedCertifications: [],
    selectedRatings: [],
    priceRange: {},
    inStockOnly: false,
    minOrderQuantity: 0
  });
  
  // Filter handlers
  const toggleLocation = (location: string) => {
    setFilters(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.includes(location)
        ? prev.selectedLocations.filter(l => l !== location)
        : [...prev.selectedLocations, location]
    }));
  };
  
  const toggleCertification = (cert: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCertifications: prev.selectedCertifications.includes(cert)
        ? prev.selectedCertifications.filter(c => c !== cert)
        : [...prev.selectedCertifications, cert]
    }));
  };
  
  const toggleRating = (rating: string) => {
    setFilters(prev => ({
      ...prev,
      selectedRatings: prev.selectedRatings.includes(rating)
        ? prev.selectedRatings.filter(r => r !== rating)
        : [...prev.selectedRatings, rating]
    }));
  };
  
  const setPriceRange = (min?: number, max?: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };
  
  const toggleInStock = () => {
    setFilters(prev => ({
      ...prev,
      inStockOnly: !prev.inStockOnly
    }));
  };
  
  const setMinOrderQuantity = (qty: number) => {
    setFilters(prev => ({
      ...prev,
      minOrderQuantity: qty
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCategory: "All Categories",
      sortBy: "rating",
      selectedLocations: [],
      selectedCertifications: [],
      selectedRatings: [],
      priceRange: {},
      inStockOnly: false,
      minOrderQuantity: 0
    });
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSortBy("rating");
  };

  const filteredProducts = products
    .filter(product => {
      // Search term filter
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = 
        selectedCategory === "All Categories" || product.category === selectedCategory;
      
      // Location filter
      const matchesLocation = 
        filters.selectedLocations.length === 0 || 
        filters.selectedLocations.some(loc => product.seller.location.includes(loc));
      
      // Certification filter
      const matchesCertification = 
        filters.selectedCertifications.length === 0 || 
        (product.certifications && filters.selectedCertifications.some(cert => 
          product.certifications?.includes(cert)));
      
      // Rating filter
      const matchesRating = 
        filters.selectedRatings.length === 0 || 
        filters.selectedRatings.some(rating => {
          if (rating === "4+ Stars") return product.rating >= 4;
          if (rating === "3+ Stars") return product.rating >= 3;
          if (rating === "2+ Stars") return product.rating >= 2;
          return true;
        });
      
      // Price range filter
      const getPrice = (product: any) => {
        if (product.pricing.type === "fixed") {
          return product.pricing.basePrice || 0;
        } else if (product.pricing.type === "bulk" && product.pricing.bulkPrices) {
          return product.pricing.bulkPrices[0]?.price || 0;
        }
        return 0;
      };
      
      const productPrice = getPrice(product);
      const matchesPriceRange = 
        (!filters.priceRange.min || productPrice >= filters.priceRange.min) &&
        (!filters.priceRange.max || productPrice <= filters.priceRange.max);
      
      // Stock filter
      const matchesStock = 
        !filters.inStockOnly || product.inStock;
      
      // Min order quantity filter
      const matchesMinOrder = 
        product.minOrderQuantity >= filters.minOrderQuantity;
      
      return matchesSearch && matchesCategory && matchesLocation && 
             matchesCertification && matchesRating && matchesPriceRange && 
             matchesStock && matchesMinOrder;
    })
    .sort((a, b) => {
      // For fixed pricing, use basePrice; for bulk, use the first bulk price
      const getPrice = (product: any) => {
        if (product.pricing.type === "fixed") {
          return product.pricing.basePrice || 0;
        } else if (product.pricing.type === "bulk" && product.pricing.bulkPrices) {
          return product.pricing.bulkPrices[0]?.price || 0;
        }
        return 0;
      };
      
      const priceA = getPrice(a);
      const priceB = getPrice(b);
      
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleInquiry = (productId: string) => {
    navigate(`/marketplace/inquiry/${productId}`);
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
          <h1 className="text-2xl font-bold">B2B Product Catalog</h1>
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
                    placeholder="Search products, suppliers, or tags..."
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
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
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
              
              {/* Advanced Filters Toggle */}
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? "Hide Filters" : "Show Advanced Filters"}
                  {filters.selectedLocations.length + filters.selectedCertifications.length + 
                   filters.selectedRatings.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.selectedLocations.length + filters.selectedCertifications.length + 
                       filters.selectedRatings.length}
                    </Badge>
                  )}
                </Button>
                
                {(filters.selectedLocations.length > 0 || filters.selectedCertifications.length > 0 || 
                  filters.selectedRatings.length > 0 || filters.priceRange.min || filters.priceRange.max || 
                  filters.inStockOnly || filters.minOrderQuantity > 0) && (
                  <Button 
                    variant="ghost" 
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
              
              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t">
                  {/* Location Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Location</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {locations.slice(1).map(location => (
                        <div key={location} className="flex items-center gap-2">
                          <Checkbox 
                            id={`loc-${location}`}
                            checked={filters.selectedLocations.includes(location)}
                            onCheckedChange={() => toggleLocation(location)}
                          />
                          <label 
                            htmlFor={`loc-${location}`}
                            className="text-sm cursor-pointer"
                          >
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Certifications Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Certifications</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {certifications.map(cert => (
                        <div key={cert} className="flex items-center gap-2">
                          <Checkbox 
                            id={`cert-${cert}`}
                            checked={filters.selectedCertifications.includes(cert)}
                            onCheckedChange={() => toggleCertification(cert)}
                          />
                          <label 
                            htmlFor={`cert-${cert}`}
                            className="text-sm cursor-pointer"
                          >
                            {cert}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Ratings Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Ratings</h4>
                    <div className="space-y-2">
                      {ratings.slice(1).map(rating => (
                        <div key={rating} className="flex items-center gap-2">
                          <Checkbox 
                            id={`rating-${rating}`}
                            checked={filters.selectedRatings.includes(rating)}
                            onCheckedChange={() => toggleRating(rating)}
                          />
                          <label 
                            htmlFor={`rating-${rating}`}
                            className="text-sm cursor-pointer"
                          >
                            {rating}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Filters */}
                  <div>
                    <h4 className="font-medium mb-3">Additional Filters</h4>
                    <div className="space-y-4">
                      {/* Price Range */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Price Range</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            type="number" 
                            placeholder="Min" 
                            value={filters.priceRange.min || ''}
                            onChange={(e) => setPriceRange(e.target.value ? Number(e.target.value) : undefined, filters.priceRange.max)}
                          />
                          <Input 
                            type="number" 
                            placeholder="Max" 
                            value={filters.priceRange.max || ''}
                            onChange={(e) => setPriceRange(filters.priceRange.min, e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                      </div>
                      
                      {/* In Stock Only */}
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="in-stock"
                          checked={filters.inStockOnly}
                          onCheckedChange={toggleInStock}
                        />
                        <label 
                          htmlFor="in-stock"
                          className="text-sm cursor-pointer"
                        >
                          In Stock Only
                        </label>
                      </div>
                      
                      {/* Min Order Quantity */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Min Order Qty</label>
                        <Input 
                          type="number" 
                          placeholder="Minimum order quantity" 
                          value={filters.minOrderQuantity || ''}
                          onChange={(e) => setMinOrderQuantity(e.target.value ? Number(e.target.value) : 0)}
                        />
                      </div>
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
                    src={product.images[0]?.url || "/placeholder.svg"} 
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
                        {product.seller.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{product.seller.name}</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{product.seller.location}</span>
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
                        <span className="text-xl font-bold">
                          {product.pricing.type === 'fixed' 
                            ? product.pricing.basePrice 
                            : product.pricing.bulkPrices?.[0]?.price || 0}
                        </span>
                        <span className="text-sm text-muted-foreground">/ unit</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Min. order: {product.minOrderQuantity} units</p>
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
                      onClick={() => handleInquiry(product.id)}
                    >
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