import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Package,
  ShoppingCart,
  IndianRupee,
  Star,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  BarChart3,
  MessageCircle,
  Upload,
  TrendingDown
} from "lucide-react";

// Mock data
const products = [
  {
    id: "P001",
    name: "Organic Cotton Textiles",
    price: 1200,
    category: "Textiles",
    rating: 4.8,
    reviews: 24,
    image: "/placeholder.svg",
    status: "published",
    stock: 150,
    sales: 42
  },
  {
    id: "P002",
    name: "Handcrafted Pottery",
    price: 800,
    category: "Handicrafts",
    rating: 4.6,
    reviews: 18,
    image: "/placeholder.svg",
    status: "published",
    stock: 75,
    sales: 28
  },
  {
    id: "P003",
    name: "Spices Collection",
    price: 1500,
    category: "Food Products",
    rating: 4.9,
    reviews: 42,
    image: "/placeholder.svg",
    status: "draft",
    stock: 200,
    sales: 65
  }
];

const orders = [
  { id: "O001", customer: "ABC Fashion Co.", amount: 24000, status: "processing", date: "2024-01-15" },
  { id: "O002", customer: "XYZ Retail", amount: 12000, status: "shipped", date: "2024-01-14" },
  { id: "O003", customer: "Global Traders", amount: 18000, status: "delivered", date: "2024-01-12" }
];

const reviews = [
  { id: 1, customer: "Priya Sharma", rating: 5, comment: "Excellent quality products! Will definitely order again.", date: "2024-01-10" },
  { id: 2, customer: "Rajesh Kumar", rating: 4, comment: "Good products, delivery was on time.", date: "2024-01-08" },
  { id: 3, customer: "Anita Desai", rating: 5, comment: "Amazing craftsmanship. Highly recommended!", date: "2024-01-05" }
];

const inquiries = [
  { id: "I001", customer: "Global Traders", product: "Organic Cotton Textiles", message: "Interested in bulk order. Please share pricing details.", date: "2024-01-12", status: "new" },
  { id: "I002", customer: "Fashion Hub", product: "Handcrafted Pottery", message: "Do you offer customization options?", date: "2024-01-10", status: "responded" },
  { id: "I003", customer: "Spice World", product: "Spices Collection", message: "Looking for regular supply partnership.", date: "2024-01-08", status: "new" }
];

const salesData = [
  { month: "Jan", sales: 40000, orders: 12 },
  { month: "Feb", sales: 30000, orders: 8 },
  { month: "Mar", sales: 50000, orders: 15 },
  { month: "Apr", sales: 45000, orders: 14 },
  { month: "May", sales: 60000, orders: 18 },
  { month: "Jun", sales: 55000, orders: 16 }
];

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-success";
      case "draft": return "bg-amber-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-indigo-500";
      case "delivered": return "bg-success";
      case "new": return "bg-blue-500";
      case "responded": return "bg-green-500";
      default: return "bg-muted";
    }
  };

  // Calculate total sales
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  
  // Calculate average order value
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        </div>

        {/* Business Info */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    GT
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">Green Textiles Co.</h2>
                  <p className="text-muted-foreground">Textile Manufacturer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">4.7 (128 reviews)</span>
                  </div>
                </div>
              </div>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
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
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-3xl font-bold">₹{totalSales.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                  <p className="text-3xl font-bold">₹{avgOrderValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeTab === "overview" ? "default" : "outline"} 
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button 
            variant={activeTab === "products" ? "default" : "outline"} 
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-4 h-4 mr-2" />
            My Products
          </Button>
          <Button 
            variant={activeTab === "orders" ? "default" : "outline"} 
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Orders
          </Button>
          <Button 
            variant={activeTab === "reviews" ? "default" : "outline"} 
            onClick={() => setActiveTab("reviews")}
          >
            <Star className="w-4 h-4 mr-2" />
            Reviews
          </Button>
          <Button 
            variant={activeTab === "inventory" ? "default" : "outline"} 
            onClick={() => setActiveTab("inventory")}
          >
            <Upload className="w-4 h-4 mr-2" />
            Inventory
          </Button>
          <Button 
            variant={activeTab === "inquiries" ? "default" : "outline"} 
            onClick={() => navigate("/member/seller/leads")}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            B2B Inquiries
          </Button>
          <Button 
            variant={activeTab === "analytics" ? "default" : "outline"} 
            onClick={() => setActiveTab("analytics")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Sales Analytics
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Products */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Products</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                <CardDescription>Your latest product listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{product.price}</span>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <h3 className="font-medium">{order.customer}</h3>
                        <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{order.amount}</span>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} mt-1`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "products" && (
          <Card className="shadow-medium border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Products</CardTitle>
                  <CardDescription>Manage your product listings</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Product</th>
                      <th className="text-left py-3">Price</th>
                      <th className="text-left py-3">Stock</th>
                      <th className="text-left py-3">Sales</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-muted-foreground" />
                            <span>{product.price}</span>
                          </div>
                        </td>
                        <td className="py-4">{product.stock}</td>
                        <td className="py-4">{product.sales}</td>
                        <td className="py-4">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
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
            </CardContent>
          </Card>
        )}

        {activeTab === "orders" && (
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Track and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Order ID</th>
                      <th className="text-left py-3">Customer</th>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Amount</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-4 font-medium">#{order.id}</td>
                        <td className="py-4">{order.customer}</td>
                        <td className="py-4">{order.date}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-muted-foreground" />
                            <span>{order.amount}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className={`${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reviews" && (
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>Manage and respond to customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{review.customer}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                            />
                          ))}
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Respond
                      </Button>
                    </div>
                    <p className="mt-3 text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "inventory" && (
          <Card className="shadow-medium border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Update stock levels and manage inventory</CardDescription>
                </div>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Inventory
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Product</th>
                      <th className="text-left py-3">Current Stock</th>
                      <th className="text-left py-3">Low Stock Alert</th>
                      <th className="text-left py-3">Last Updated</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span>{product.stock}</span>
                            {product.stock < 50 && (
                              <Badge variant="destructive">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                Low Stock
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <input 
                            type="number" 
                            defaultValue={product.stock}
                            className="border rounded px-2 py-1 w-20"
                          />
                        </td>
                        <td className="py-4">2024-01-15</td>
                        <td className="py-4">
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "inquiries" && (
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle>B2B Inquiries</CardTitle>
              <CardDescription>View and respond to business inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{inquiry.customer}</h3>
                        <p className="text-sm text-muted-foreground">Interested in: {inquiry.product}</p>
                      </div>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="mt-3 text-muted-foreground">{inquiry.message}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-muted-foreground">{inquiry.date}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Respond
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-medium border-0 lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>Track your sales performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Sales chart visualization would appear here</p>
                    <p className="text-sm text-muted-foreground mt-1">(Chart implementation would require additional libraries)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle>Sales Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sales</span>
                      <span className="font-medium">₹{totalSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Order Value</span>
                      <span className="font-medium">₹{avgOrderValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Top Selling Product</span>
                      <span className="font-medium">Spices Collection</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {salesData.slice(-3).reverse().map((data, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{data.month}</span>
                        <div className="text-right">
                          <p className="font-medium">₹{data.sales.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{data.orders} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;