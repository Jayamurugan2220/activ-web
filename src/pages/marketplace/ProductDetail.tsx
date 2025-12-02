import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  ShoppingCart,
  Heart,
  Share2,
  Star,
  IndianRupee,
  MapPin,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle
} from "lucide-react";

// Mock product data
const product = {
  id: "P001",
  name: "Organic Cotton Textiles",
  seller: "Green Textiles Co.",
  sellerId: "ST001",
  price: 1200,
  originalPrice: 1500,
  discount: 20,
  minOrder: 50,
  category: "Textiles",
  rating: 4.8,
  reviews: 24,
  image: "/placeholder.svg",
  location: "Coimbatore, Tamil Nadu",
  description: "Premium organic cotton textiles for sustainable fashion brands. Our textiles are made from 100% organic cotton, ethically sourced and produced with eco-friendly processes. Perfect for fashion brands looking to offer sustainable clothing options.",
  tags: ["Organic", "Sustainable", "Wholesale", "Eco-friendly"],
  inStock: true,
  specifications: [
    { name: "Material", value: "100% Organic Cotton" },
    { name: "Thread Count", value: "200 TC" },
    { name: "Width", value: "54 inches" },
    { name: "Weight", value: "150 GSM" },
    { name: "Color", value: "Natural White" },
    { name: "Certification", value: "GOTS Certified" }
  ],
  sellerInfo: {
    name: "Green Textiles Co.",
    rating: 4.7,
    reviews: 128,
    since: "2018",
    products: 42,
    responseTime: "2 hrs"
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => q > 1 ? q - 1 : 1);

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link to="/marketplace/b2b">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <nav className="text-sm text-muted-foreground">
            <Link to="/marketplace/b2b" className="hover:underline">B2B Catalog</Link>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={`${product.name} ${item}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  <p className="text-muted-foreground">{product.seller}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFavorited(!favorited)}
                >
                  <Heart 
                    className={`w-6 h-6 ${favorited ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} 
                  />
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-baseline gap-2">
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="w-5 h-5 text-muted-foreground" />
                  <span className="text-3xl font-bold">{product.price}</span>
                  <span className="text-muted-foreground">/ unit</span>
                </div>
                {product.originalPrice > product.price && (
                  <>
                    <IndianRupee className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                    <Badge className="ml-2 bg-red-500">
                      {product.discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Minimum order quantity: {product.minOrder} units
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={decreaseQuantity}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={increaseQuantity}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Inquiry
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Seller Info */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="text-lg">Sold by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {product.seller.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{product.seller}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{product.sellerInfo.rating} ({product.sellerInfo.reviews} reviews)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Member since {product.sellerInfo.since}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Products</p>
                    <p className="font-medium">{product.sellerInfo.products}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Response Time</p>
                    <p className="font-medium">{product.sellerInfo.responseTime}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View Seller Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-0">
            {/* Tab Headers */}
            <div className="flex border-b">
              <button
                className={`px-6 py-4 font-medium ${activeTab === "description" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-6 py-4 font-medium ${activeTab === "specifications" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>
              <button
                className={`px-6 py-4 font-medium ${activeTab === "reviews" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviews})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Truck className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">Fast Delivery</p>
                        <p className="text-sm text-muted-foreground">Delivered within 5-7 business days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Shield className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">Secure Payment</p>
                        <p className="text-sm text-muted-foreground">100% secure payment processing</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <RotateCcw className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">Easy Returns</p>
                        <p className="text-sm text-muted-foreground">30-day return policy</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Star className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">Quality Assured</p>
                        <p className="text-sm text-muted-foreground">Premium quality guaranteed</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">{spec.name}</span>
                        <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                  
                  <div className="space-y-6">
                    {/* Review Summary */}
                    <div className="flex flex-col md:flex-row gap-6 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{product.rating}</div>
                        <div className="flex justify-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{product.reviews} reviews</p>
                      </div>
                      
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-sm w-8">{stars}★</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-yellow-500 rounded-full" 
                                  style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground w-8">
                                {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '5%' : stars === 2 ? '3%' : '2%'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Review Form */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-3">Write a Review</h4>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-6 h-6 text-gray-300 hover:text-yellow-500 cursor-pointer" 
                          />
                        ))}
                      </div>
                      <Textarea placeholder="Share your experience with this product..." className="mb-3" />
                      <Button>Submit Review</Button>
                    </div>
                    
                    {/* Reviews List */}
                    <div className="space-y-6">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center gap-4 mb-3">
                            <Avatar>
                              <AvatarFallback>U{review}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">User {review}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < (review === 1 ? 5 : review === 2 ? 4 : 3) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                  />
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {review === 1 ? '5 months' : review === 2 ? '3 months' : '1 month'} ago
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            {review === 1 
                              ? "Excellent quality textiles! The organic cotton feels amazing and the colors are vibrant. Will definitely order again."
                              : review === 2 
                              ? "Good product overall. The material is soft and comfortable. Shipping was fast too."
                              : "Decent quality for the price. Would recommend for small businesses looking for affordable organic textiles."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;