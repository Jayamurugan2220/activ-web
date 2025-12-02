import { useState } from "react";
import { Link } from "react-router-dom";
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

  const cartItems = [
    {
      id: "CART001",
      productId: "P001",
      name: "Organic Cotton Textiles",
      seller: "Green Textiles Co.",
      price: 1200,
      quantity: 2,
      image: "/placeholder.svg"
    },
    {
      id: "CART002",
      productId: "P002",
      name: "Handcrafted Pottery",
      seller: "Artisan Pottery Studio",
      price: 800,
      quantity: 1,
      image: "/placeholder.svg"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 100;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = () => {
    // In a real app, this would process the payment
    alert("Order placed successfully!");
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/marketplace/cart">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <Card className="shadow-medium border-0">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activeStep === step 
                          ? "bg-primary text-primary-foreground" 
                          : activeStep > step 
                            ? "bg-success text-success-foreground" 
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {step}
                      </div>
                      <span className="text-sm mt-2">
                        {step === 1 ? "Shipping" : step === 2 ? "Payment" : "Review"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            {activeStep === 1 && (
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>Enter your shipping details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          name="phone" 
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
                      placeholder="Enter landmark for easy delivery" 
                      value={shippingInfo.landmark}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => setActiveStep(2)}
                    disabled={!shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode}
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            {activeStep === 2 && (
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Select your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === "card" ? "border-primary" : "border-muted"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "card" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {paymentMethod === "card" && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <span className="font-medium">Credit/Debit Card</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === "upi" ? "border-primary" : "border-muted"
                      }`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "upi" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {paymentMethod === "upi" && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <span className="font-medium">UPI</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === "netbanking" ? "border-primary" : "border-muted"
                      }`}
                      onClick={() => setPaymentMethod("netbanking")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "netbanking" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {paymentMethod === "netbanking" && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <span className="font-medium">Net Banking</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === "cod" ? "border-primary" : "border-muted"
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "cod" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {paymentMethod === "cod" && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>
                  
                  {paymentMethod === "card" && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="Enter name as on card" />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={() => setActiveStep(3)}>
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Review */}
            {activeStep === 3 && (
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Review Your Order
                  </CardTitle>
                  <CardDescription>Review and confirm your order details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
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
                        {paymentMethod === "cod" && "Cash on Delivery"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
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
                  {cartItems.map((item) => (
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
                      <span>{shipping}</span>
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