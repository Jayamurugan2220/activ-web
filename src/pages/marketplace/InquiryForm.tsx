import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import notificationService from "@/services/notificationService";
import { 
  ArrowLeft, 
  ShoppingCart,
  User,
  Phone,
  Mail,
  MessageSquare,
  Package
} from "lucide-react";

// Mock product data - in a real app this would come from an API
const mockProducts = [
  {
    id: "P001",
    name: "Organic Cotton Textiles",
    seller: "Green Textiles Co.",
    sellerId: "ST001",
    price: 1200,
    minOrder: 50,
    category: "Textiles",
    rating: 4.8,
    reviews: 24,
    image: "/placeholder.svg",
    location: "Coimbatore, Tamil Nadu",
    description: "Premium organic cotton textiles for sustainable fashion brands"
  },
  {
    id: "P002",
    name: "Handcrafted Pottery",
    seller: "Artisan Pottery Studio",
    sellerId: "ST002",
    price: 800,
    minOrder: 20,
    category: "Handicrafts",
    rating: 4.6,
    reviews: 18,
    image: "/placeholder.svg",
    location: "Jaipur, Rajasthan",
    description: "Traditional handcrafted pottery with modern designs"
  }
];

const InquiryForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the product based on ID
  const product = mockProducts.find(p => p.id === productId) || mockProducts[0];
  
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    quantity: product.minOrder || 1,
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send notification to seller
      await notificationService.sendInquiryNotification(
        product.seller,
        undefined, // In a real app, we would have the seller's email
        undefined, // In a real app, we would have the seller's phone
        product.name,
        formData.fullName,
        formData.quantity,
        formData.message
      );
      
      toast({
        title: "Inquiry Submitted",
        description: "Your inquiry has been sent to the seller. They will contact you shortly.",
      });
      
      // Navigate back to the product or catalog
      navigate("/marketplace/b2b");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/marketplace/b2b">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Product Inquiry</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.seller}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-bold">₹{product.price}</span>
                      <span className="text-sm text-muted-foreground">/ unit</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      Min. order: {product.minOrder} units
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
                <CardDescription>
                  Fill out this form to inquire about {product.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="Enter your company name"
                          className="pl-10"
                          value={formData.companyName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-10"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min={product.minOrder}
                        placeholder={`Minimum ${product.minOrder}`}
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Minimum order quantity: {product.minOrder} units
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell the seller about your requirements..."
                        className="pl-10"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending Inquiry..."
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Send Inquiry
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate("/marketplace/b2b")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;