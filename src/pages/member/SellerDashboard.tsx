import { useState } from "react";
import { Link } from "react-router-dom";
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
  BarChart3
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

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-success";
      case "draft": return "bg-amber-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-indigo-500";
      case "delivered": return "bg-success";
      default: return "bg-muted";
    }
  };

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
                  <p className="text-3xl font-bold">₹1.2L</p>
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
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-3xl font-bold">4.7</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
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
      </div>
    </div>
  );
};

export default SellerDashboard;