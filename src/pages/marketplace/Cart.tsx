import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ShoppingCart,
  IndianRupee,
  Plus,
  Minus,
  X,
  Truck,
  Shield
} from "lucide-react";

// Mock cart data
const cartItems = [
  {
    id: "CART001",
    productId: "P001",
    name: "Organic Cotton Textiles",
    seller: "Green Textiles Co.",
    price: 1200,
    quantity: 2,
    image: "/placeholder.svg",
    inStock: true
  },
  {
    id: "CART002",
    productId: "P002",
    name: "Handcrafted Pottery",
    seller: "Artisan Pottery Studio",
    price: 800,
    quantity: 1,
    image: "/placeholder.svg",
    inStock: true
  },
  {
    id: "CART003",
    productId: "P003",
    name: "Spices Collection",
    seller: "Heritage Spices Ltd",
    price: 1500,
    quantity: 3,
    image: "/placeholder.svg",
    inStock: false
  }
];

const Cart = () => {
  const [items, setItems] = useState(cartItems);
  const [coupon, setCoupon] = useState("");

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 100;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    // In a real app, this would redirect to checkout
    alert("Proceeding to checkout...");
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/marketplace/b2c">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added anything to your cart yet
              </p>
              <Link to="/marketplace/b2c">
                <Button size="lg">Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="shadow-medium border-0">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.seller}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={!item.inStock}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input 
                              type="number" 
                              min="1" 
                              value={item.quantity} 
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              disabled={!item.inStock}
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={!item.inStock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-baseline gap-1">
                              <IndianRupee className="w-4 h-4 text-muted-foreground" />
                              <span className="text-lg font-bold">{item.price * item.quantity}</span>
                            </div>
                            {!item.inStock && (
                              <Badge variant="destructive" className="mt-1">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-between">
                <Link to="/marketplace/b2c">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setItems([])}>
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="shadow-medium border-0 sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
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
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <div className="flex items-baseline gap-1">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xl">{total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coupon */}
                  <div>
                    <label htmlFor="coupon" className="text-sm font-medium">Coupon Code</label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        id="coupon" 
                        placeholder="Enter coupon code" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Free Shipping</p>
                        <p className="text-xs text-muted-foreground">On orders over ₹500</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Secure Payment</p>
                        <p className="text-xs text-muted-foreground">100% secure payment processing</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={items.some(item => !item.inStock)}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;