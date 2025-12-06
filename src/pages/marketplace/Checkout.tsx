import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import instamojoService from "@/services/instamojoService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  CreditCard,
  IndianRupee,
  MapPin,
  User,
  Phone,
  Mail,
  Truck
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { addOrder } = useOrder();
  const [activeStep, setActiveStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 100; // Free shipping over ₹500
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    // In a real app, this would process the payment
    if (paymentMethod === "instamojo") {
      // Redirect to Instamojo payment gateway
      await initiateInstamojoPayment();
    } else {
      // For other payment methods, simulate success
      alert("Order placed successfully!");
      
      // Save order data
      const orderId = addOrder({
        total,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          seller: item.seller,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shipping: shippingInfo
      });
      
      clearCart();
      navigate("/marketplace/order-confirmation");
    }
  };

  const initiateInstamojoPayment = async () => {
    try {
      // Save order data before payment
      const orderId = addOrder({
        total,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          seller: item.seller,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shipping: shippingInfo
      });
      
      // Create payment data
      const paymentData = {
        amount: total,
        currency: "INR",
        buyer_name: shippingInfo.name,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        purpose: "Product Purchase",
        redirect_url: `${window.location.origin}/marketplace/order-confirmation`
      };

      // Generate payment link
      const paymentLink = await instamojoService.generatePaymentLink(paymentData);
      
      // Redirect to payment gateway
      alert(`Redirecting to Instamojo payment gateway...\n\nIn a real application, you would be redirected to: ${paymentLink}`);
      
      // In a real application, you would redirect the user:
      // window.location.href = paymentLink;
      
      // For demo purposes, we'll simulate the payment success
      setTimeout(() => {
        clearCart();
        navigate("/marketplace/order-confirmation");
      }, 2000);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen p-4 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Please add items to your cart before proceeding to checkout
              </p>
              <Button onClick={() => navigate("/marketplace/b2c")}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/marketplace/cart")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <Card className="shadow-medium border-0">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      1
                    </div>
                    <span className="text-sm">Shipping</span>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      2
                    </div>
                    <span className="text-sm">Payment</span>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      3
                    </div>
                    <span className="text-sm">Review</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Shipping Information */}
            {activeStep === 1 && (
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>
                    Please enter your shipping details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={shippingInfo.name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-10"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        placeholder="Enter pincode"
                        value={shippingInfo.pincode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your complete address"
                      rows={3}
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Enter city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="Enter state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      placeholder="Enter nearby landmark"
                      value={shippingInfo.landmark}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Button className="w-full mt-4" onClick={() => setActiveStep(2)}>
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {activeStep === 2 && (
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Select your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className={`border-2 cursor-pointer ${paymentMethod === "card" ? "border-primary" : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "card" ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {paymentMethod === "card" && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-sm text-muted-foreground">Pay with your card</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`border-2 cursor-pointer ${paymentMethod === "upi" ? "border-primary" : ""}`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "upi" ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {paymentMethod === "upi" && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">UPI</p>
                          <p className="text-sm text-muted-foreground">Pay with UPI apps</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`border-2 cursor-pointer ${paymentMethod === "netbanking" ? "border-primary" : ""}`}
                      onClick={() => setPaymentMethod("netbanking")}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "netbanking" ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {paymentMethod === "netbanking" && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Net Banking</p>
                          <p className="text-sm text-muted-foreground">Pay directly from your bank</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`border-2 cursor-pointer ${paymentMethod === "instamojo" ? "border-primary" : ""}`}
                      onClick={() => setPaymentMethod("instamojo")}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "instamojo" ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {paymentMethod === "instamojo" && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Instamojo</p>
                          <p className="text-sm text-muted-foreground">Secure online payment</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={() => setActiveStep(3)}>
                      Continue to Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {activeStep === 3 && (
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                  <CardDescription>
                    Please review your order details before placing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Information */}
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Information</h3>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-medium">{shippingInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{shippingInfo.address}</p>
                      <p className="text-sm text-muted-foreground">{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                      <p className="text-sm text-muted-foreground">Phone: {shippingInfo.phone}</p>
                      <p className="text-sm text-muted-foreground">Email: {shippingInfo.email}</p>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-medium">
                        {paymentMethod === "card" && "Credit/Debit Card"}
                        {paymentMethod === "upi" && "UPI"}
                        {paymentMethod === "netbanking" && "Net Banking"}
                        {paymentMethod === "instamojo" && "Instamojo"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
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
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setActiveStep(2)}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={handlePlaceOrder}>
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="shadow-medium border-0 sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="text-sm">{item.name} x {item.quantity}</p>
                        <p className="text-xs text-muted-foreground">{item.seller}</p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span>{subtotal}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span>{shipping === 0 ? "FREE" : shipping}</span>
                    </div>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-4 h-4 text-success" />
                        <span>-{discount}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold pt-2">
                    <span>Total</span>
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg">{total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;