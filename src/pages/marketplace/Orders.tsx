import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  ShoppingCart,
  IndianRupee,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

const orders = [
  {
    id: "ORD2024001",
    date: "2024-01-15",
    status: "delivered",
    total: 3500,
    items: 2,
    seller: "Green Textiles Co.",
    image: "/placeholder.svg"
  },
  {
    id: "ORD2024002",
    date: "2024-01-10",
    status: "shipped",
    total: 1200,
    items: 1,
    seller: "Artisan Pottery Studio",
    image: "/placeholder.svg"
  },
  {
    id: "ORD2024003",
    date: "2024-01-05",
    status: "processing",
    total: 4500,
    items: 3,
    seller: "Heritage Spices Ltd",
    image: "/placeholder.svg"
  },
  {
    id: "ORD2023125",
    date: "2023-12-20",
    status: "cancelled",
    total: 2800,
    items: 2,
    seller: "Traditional Weavers",
    image: "/placeholder.svg"
  }
];

const Orders = () => {
  const [filter, setFilter] = useState("all");

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-success";
      case "shipped": return "bg-blue-500";
      case "processing": return "bg-amber-500";
      case "cancelled": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "processing": return <Clock className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === "processing").length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shipped</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === "shipped").length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === "delivered").length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === "cancelled").length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Orders
          </Button>
          <Button 
            variant={filter === "processing" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("processing")}
          >
            Processing
          </Button>
          <Button 
            variant={filter === "shipped" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("shipped")}
          >
            Shipped
          </Button>
          <Button 
            variant={filter === "delivered" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("delivered")}
          >
            Delivered
          </Button>
          <Button 
            variant={filter === "cancelled" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="shadow-medium border-0">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <img 
                    src={order.image} 
                    alt={order.seller} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {order.seller.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{order.seller}</p>
                          <p className="text-xs text-muted-foreground">{order.items} items</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold">{order.total}</span>
                        </div>
                        
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/marketplace/order/${order.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredOrders.length === 0 && (
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "You haven't placed any orders yet" 
                  : `You don't have any ${filter} orders`}
              </p>
              <Button className="mt-4" asChild>
                <Link to="/marketplace/b2c">
                  Start Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;