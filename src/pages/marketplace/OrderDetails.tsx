import { useParams } from "react-router-dom";
import { useOrder } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  IndianRupee,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Download,
  ShoppingCart
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const { getOrderById } = useOrder();
  const order = id ? getOrderById(id) : null;

  if (!order) {
    return (
      <div className="min-h-screen p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-medium mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-6">
                The order you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-success";
      case "shipped": return "bg-blue-500";
      case "processing": return "bg-amber-500";
      case "ordered": return "bg-primary";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "processing": return <Clock className="w-4 h-4" />;
      case "ordered": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Generate timeline based on order status
  const generateTimeline = () => {
    const timeline = [
      {
        status: "ordered",
        date: order.date,
        time: "10:30 AM",
        description: "Order placed successfully"
      }
    ];

    if (order.status === "processing" || order.status === "shipped" || order.status === "delivered") {
      timeline.push({
        status: "processing",
        date: order.date,
        time: "02:15 PM",
        description: "Order is being processed by the seller"
      });
    }

    if (order.status === "shipped" || order.status === "delivered") {
      timeline.push({
        status: "shipped",
        date: order.date,
        time: "09:45 AM",
        description: "Order has been shipped"
      });
    }

    if (order.status === "delivered") {
      timeline.push({
        status: "delivered",
        date: order.date,
        time: "04:20 PM",
        description: "Order delivered successfully"
      });
    }

    return timeline;
  };

  const timeline = generateTimeline();

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">Order #{id}</p>
          </div>
        </div>

        {/* Order Status */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Your order is {order.status}</CardDescription>
              </div>
              <Badge className={getStatusColor(order.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Timeline */}
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === order.status || 
                      (order.status === "delivered" && event.status === "delivered") ||
                      (order.status === "delivered" && event.status === "shipped") ||
                      (order.status === "delivered" && event.status === "processing") ||
                      (order.status === "delivered" && event.status === "ordered") ||
                      (order.status === "shipped" && event.status === "shipped") ||
                      (order.status === "shipped" && event.status === "processing") ||
                      (order.status === "shipped" && event.status === "ordered") ||
                      (order.status === "processing" && event.status === "processing") ||
                      (order.status === "processing" && event.status === "ordered")
                        ? getStatusColor(event.status) 
                        : "bg-muted"
                    }`}>
                      {getStatusIcon(event.status)}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 h-full ${
                        event.status === order.status || 
                        (order.status === "delivered" && event.status === "delivered") ||
                        (order.status === "delivered" && event.status === "shipped") ||
                        (order.status === "delivered" && event.status === "processing") ||
                        (order.status === "delivered" && event.status === "ordered") ||
                        (order.status === "shipped" && event.status === "shipped") ||
                        (order.status === "shipped" && event.status === "processing") ||
                        (order.status === "shipped" && event.status === "ordered") ||
                        (order.status === "processing" && event.status === "processing") ||
                        (order.status === "processing" && event.status === "ordered")
                          ? "bg-primary" 
                          : "bg-muted"
                      }`}></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <h3 className="font-medium">{event.description}</h3>
                    <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Sold by {item.seller}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        <span>{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{order.shipping.name}</p>
                  <p className="text-sm text-muted-foreground">{order.shipping.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">Phone: {order.shipping.phone}</p>
                  <p className="text-sm text-muted-foreground">Email: {order.shipping.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="w-4 h-4 text-muted-foreground" />
                  <span>{order.total - 100}</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="w-4 h-4 text-muted-foreground" />
                  <span>100</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg">{order.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          <Button variant="outline">Contact Seller</Button>
          <Button variant="outline">Return Item</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;