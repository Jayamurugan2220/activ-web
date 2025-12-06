import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle,
  IndianRupee,
  MapPin,
  Truck,
  Calendar,
  Download
} from "lucide-react";

const OrderConfirmation = () => {
  const { orders } = useOrder();
  const [latestOrder, setLatestOrder] = useState<any>(null);

  useEffect(() => {
    // Get the latest order
    if (orders.length > 0) {
      const latest = orders[orders.length - 1];
      setLatestOrder(latest);
    }
  }, [orders]);

  if (!latestOrder) {
    return (
      <div className="min-h-screen p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-medium mb-2">No order found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find your order information
              </p>
              <Button asChild>
                <Link to="/marketplace/b2c">
                  Continue Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Summary */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Order #{latestOrder.id}</CardTitle>
                <CardDescription>Placed on {latestOrder.date}</CardDescription>
              </div>
              <Badge variant="default" className="w-fit">
                Processing
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-4">
                  {latestOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
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
              </div>
              
              {/* Shipping Information */}
              <div>
                <h3 className="font-semibold mb-3">Shipping Information</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{latestOrder.shipping.name}</p>
                      <p className="text-sm text-muted-foreground">{latestOrder.shipping.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {latestOrder.shipping.city}, {latestOrder.shipping.state} - {latestOrder.shipping.pincode}
                      </p>
                      <p className="text-sm text-muted-foreground">Phone: {latestOrder.shipping.phone}</p>
                      <p className="text-sm text-muted-foreground">Email: {latestOrder.shipping.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="w-5 h-5 text-muted-foreground" />
                    <span className="text-2xl">{latestOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">Order Processing</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your order is being processed by the seller
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">Shipment</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your order will be shipped within 2-3 business days
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">Delivery</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Estimated delivery within 5-7 business days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to="/member/dashboard">
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          <Button asChild>
            <Link to="/marketplace/orders">
              View Order Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;