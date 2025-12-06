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
  Plus,
  Edit,
  Eye,
  IndianRupee,
  Star,
  Package,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

import { sampleB2BProducts } from "@/data/products";
import { b2bCategories } from "@/data/categories";

const AdminProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    status: "all",
    verificationStatus: "all"
  });

  const filteredProducts = sampleB2BProducts
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
      if (filters.status !== "all" && product.status !== filters.status) {
        return false;
      }
      if (filters.verificationStatus !== "all" && product.seller.verificationStatus !== filters.verificationStatus) {
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

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      status: "all",
      verificationStatus: "all"
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

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <Clock className="w-4 h-4 text-amber-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  // Calculate stats
  const totalProducts = sampleB2BProducts.length;
  const pendingVerification = sampleB2BProducts.filter(p => p.seller.verificationStatus === "pending").length;
  const verifiedProducts = sampleB2BProducts.filter(p => p.seller.verificationStatus === "verified").length;
  const rejectedProducts = sampleB2BProducts.filter(p => p.seller.verificationStatus === "rejected").length;

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Admin Product Catalog</h1>
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
                  <p className="text-sm text-muted-foreground">Pending Verification</p>
                  <p className="text-3xl font-bold text-amber-600">{pendingVerification}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified Products</p>
                  <p className="text-3xl font-bold text-green-600">{verifiedProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected Products</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
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
                    placeholder="Search products, sellers, or categories..."
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
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                  {(filters.minRating > 0 || filters.status !== "all" || filters.verificationStatus !== "all") && (
                    <Badge variant="secondary" className="ml-2">
                      {[
                        filters.status !== "all" ? 1 : 0,
                        filters.verificationStatus !== "all" ? 1 : 0
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  {(filters.minRating > 0 || filters.status !== "all" || filters.verificationStatus !== "all") && (
                    <Button 
                      variant="ghost" 
                      onClick={resetFilters}
                      className="flex items-center gap-2 text-destructive"
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button>
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
                  
                  {/* Verification Status Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Verification Status</h4>
                    <div className="space-y-2">
                      {["all", "verified", "pending", "rejected"].map(status => (
                        <div key={status} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`verification-${status}`}
                            name="verification-status"
                            checked={filters.verificationStatus === status}
                            onChange={() => setFilters({...filters, verificationStatus: status})}
                            className="w-4 h-4"
                          />
                          <label 
                            htmlFor={`verification-${status}`}
                            className="text-sm cursor-pointer capitalize flex items-center gap-2"
                          >
                            {getVerificationStatusIcon(status)}
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
                <CardTitle>All Products</CardTitle>
                <CardDescription>Manage and verify products across the platform</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Product</th>
                    <th className="text-left py-3">Seller</th>
                    <th className="text-left py-3">Category</th>
                    <th className="text-left py-3">Price</th>
                    <th className="text-left py-3">Rating</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Verification</th>
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
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {product.seller.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{product.seller.name}</p>
                            <div className="flex items-center gap-1">
                              {getVerificationStatusIcon(product.seller.verificationStatus)}
                              <span className="text-xs capitalize">{product.seller.verificationStatus}</span>
                            </div>
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
                        <div className="flex items-center gap-1">
                          {getVerificationStatusIcon(product.seller.verificationStatus)}
                          <span className="capitalize">{product.seller.verificationStatus}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

export default AdminProductCatalog;