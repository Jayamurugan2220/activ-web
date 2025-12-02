import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Share2,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  IndianRupee
} from "lucide-react";

// Mock business info
const businessInfo = {
  name: "Green Textiles Co.",
  tagline: "Premium organic cotton textiles for sustainable fashion",
  address: "123 Industrial Area, Block A",
  city: "Coimbatore",
  state: "Tamil Nadu",
  phone: "+91 98765 43210",
  email: "info@greentextiles.com"
};

// Mock product data
const allProducts = [
  {
    id: "P001",
    name: "Organic Cotton Textiles - 54 inches",
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    image: "/placeholder.svg",
    category: "Textiles",
    description: "Premium organic cotton textiles for sustainable fashion brands"
  },
  {
    id: "P002",
    name: "Organic Cotton Textiles - 48 inches",
    price: 1100,
    originalPrice: 1300,
    discount: 15,
    image: "/placeholder.svg",
    category: "Textiles",
    description: "High-quality organic cotton textiles in 48-inch width"
  },
  {
    id: "P003",
    name: "Handcrafted Pottery - Small Bowl",
    price: 800,
    originalPrice: 1000,
    discount: 20,
    image: "/placeholder.svg",
    category: "Handicrafts",
    description: "Beautiful handcrafted pottery bowl made by skilled artisans"
  },
  {
    id: "P004",
    name: "Handcrafted Pottery - Large Vase",
    price: 2500,
    originalPrice: 3000,
    discount: 17,
    image: "/placeholder.svg",
    category: "Handicrafts",
    description: "Large decorative vase with traditional designs"
  },
  {
    id: "P005",
    name: "Spices Collection - 500g Pack",
    price: 1500,
    originalPrice: 2000,
    discount: 25,
    image: "/placeholder.svg",
    category: "Food Products",
    description: "Assorted premium spices collection"
  },
  {
    id: "P006",
    name: "Organic Turmeric Powder - 100g",
    price: 250,
    originalPrice: 300,
    discount: 17,
    image: "/placeholder.svg",
    category: "Food Products",
    description: "100% pure organic turmeric powder"
  }
];

const SharedCatalog = () => {
  const { catalogId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  // Decode the catalog ID to get selected products
  let selectedProductIds: string[] = [];
  if (catalogId) {
    try {
      selectedProductIds = atob(catalogId).split(",");
    } catch (e) {
      console.error("Invalid catalog ID");
    }
  }
  
  // Filter products based on selected IDs or show all if none specified
  const products = selectedProductIds.length > 0
    ? allProducts.filter(product => selectedProductIds.includes(product.id))
    : allProducts;
  
  // Get unique categories
  const categories = ["All Categories", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === "All Categories"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const contactSeller = () => {
    // In a real app, this would open WhatsApp with a pre-filled message
    const message = encodeURIComponent("Hello, I'm interested in your products from the shared catalog.");
    const whatsappUrl = `https://wa.me/${businessInfo.phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Business Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{businessInfo.name}</h1>
              <p className="text-primary-foreground/80">{businessInfo.tagline}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="secondary" 
                className="text-primary"
                onClick={contactSeller}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
              <Button variant="secondary" className="text-primary" asChild>
                <Link to="/">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Catalog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Business Info */}
        <Card className="shadow-medium border-0 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {businessInfo.address}<br />
                    {businessInfo.city}, {businessInfo.state}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{businessInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{businessInfo.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-medium border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    
                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold">{product.price}</span>
                      </div>
                      {product.originalPrice > product.price && (
                        <>
                          <IndianRupee className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                          <Badge className="ml-auto bg-red-500">
                            {product.discount}% OFF
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={contactSeller}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enquire
                      </Button>
                      <Button className="flex-1">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                No products match the selected category
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            This catalog is shared via ACTIV platform. For more information, visit our website.
          </p>
          <Button variant="link" className="mt-2" asChild>
            <Link to="/">Powered by ACTIV</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default SharedCatalog;