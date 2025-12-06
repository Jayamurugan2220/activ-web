import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus,
  Edit,
  Eye,
  IndianRupee,
  Star,
  Package,
  TrendingUp
} from "lucide-react";

import { sampleB2BProducts } from "@/data/products";
import { b2bCategories } from "@/data/categories";

const SellerProductCatalog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    minStock: 0,
    status: "all"
  });

  // Filter products to show only those belonging to the current seller
  // For demo purposes, we'll show all products but in a real app this would be filtered by seller ID
  const sellerProducts = sampleB2BProducts;

  const filteredProducts = sellerProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      if (filters.minStock > 0 && product.inventory.quantity < filters.minStock) {
        return false;
      }
      if (filters.status !== "all" && product.status !== filters.status) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricing.basePrice - b.pricing.basePrice;
      if (sortBy === "price-high") return b.pricing.basePrice - a.pricing.basePrice;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "stock-low") return a.inventory.quantity - b.inventory.quantity;
      if (sortBy === "stock-high") return b.inventory.quantity - a.inventory.quantity;
      return 0;
    });

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      minStock: 0,
      status: "all"
    });
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSortBy("rating");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-success";
      case "draft": return "bg-amber-500";
      case "archived": return "bg-gray-500";
      default: return "bg-muted";
    }
  };

  // Calculate stats
  const totalProducts = sellerProducts.length;
  const publishedProducts = sellerProducts.filter(p => p.status === "published").length;
  const lowStockProducts = sellerProducts.filter(p => p.inventory.quantity <= p.inventory.lowStockThreshold).length;
  const totalValue = sellerProducts.reduce((sum, product) => sum + (product.inventory.quantity * product.pricing.basePrice), 0);

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/seller/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">My Product Catalog</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold">{totalProducts}</p>
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
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-3xl font-bold text-success">{publishedProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-3xl font-bold text-amber-600">{lowStockProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                  <p className="text-3xl font-bold">₹{totalValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                  <option value="All Categories">All Categories</option>
                  {b2bCategories.map(category => (
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
                  <option value="stock-low">Stock: Low to High</option>
                  <option value="stock-high">Stock: High to Low</option>
                </select>
              </div>
              
              {/* Advanced Filters Toggle */}
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                  {(filters.minRating > 0 || filters.minStock > 0 || filters.status !== "all") && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.status !== "all" ? 1 : 0}
                    </Badge>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  {(filters.minRating > 0 || filters.minStock > 0 || filters.status !== "all") && (
                    <Button 
                      variant="ghost" 
                      onClick={resetFilters}
                      className="flex items-center gap-2 text-destructive"
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button onClick={() => navigate("/member/seller/add-product")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
              
              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
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
                  
                  {/* Stock Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Minimum Stock</h4>
                    <div className="space-y-2">
                      {[100, 50, 10].map(stock => (
                        <div key={stock} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`stock-${stock}`}
                            name="min-stock"
                            checked={filters.minStock === stock}
                            onChange={() => setFilters({...filters, minStock: stock})}
                            className="w-4 h-4"
                          />
                          <label 
                            htmlFor={`stock-${stock}`}
                            className="text-sm cursor-pointer"
                          >
                            {stock} units or less
                          </label>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="radio"
                          id="stock-custom"
                          name="min-stock"
                          checked={filters.minStock > 0 && ![100, 50, 10].includes(filters.minStock)}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        <Input 
                          type="number" 
                          placeholder="Custom stock level" 
                          value={filters.minStock > 0 && ![100, 50, 10].includes(filters.minStock) ? filters.minStock : ''}
                          onChange={(e) => setFilters({...filters, minStock: Number(e.target.value)})}
                          className="text-sm h-8"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Product Status</h4>
                    <div className="space-y-2">
                      {["all", "published", "draft", "archived"].map(status => (
                        <div key={status} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`status-${status}`}
                            name="status"
                            checked={filters.status === status}
                            onChange={() => setFilters({...filters, status: status})}
                            className="w-4 h-4"
                          />
                          <label 
                            htmlFor={`status-${status}`}
                            className="text-sm cursor-pointer capitalize"
                          >
                            {status === "all" ? "All Statuses" : status}
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

        {/* Products Table */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Listings</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Product</th>
                    <th className="text-left py-3">Category</th>
                    <th className="text-left py-3">Price</th>
                    <th className="text-left py-3">Stock</th>
                    <th className="text-left py-3">Rating</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.images[0]?.url || "/placeholder.svg"} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{product.category}</Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-baseline gap-1">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          <span>{product.pricing.basePrice.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className={`font-medium ${product.inventory.quantity <= product.inventory.lowStockThreshold ? 'text-amber-600' : ''}`}>
                          {product.inventory.quantity} units
                        </div>
                        {product.inventory.quantity <= product.inventory.lowStockThreshold && (
                          <div className="text-xs text-amber-600">Low stock</div>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{product.rating}</span>
                          <span className="text-muted-foreground">({product.reviewCount})</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/member/seller/edit-product/${product.id}`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/marketplace/product/${product.id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerProductCatalog;