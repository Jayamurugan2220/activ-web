import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Share2,
  MessageSquare,
  QrCode,
  Copy,
  Check,
  User,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

// Mock product data
const products = [
  {
    id: "P001",
    name: "Organic Cotton Textiles",
    price: 1200,
    image: "/placeholder.svg",
    category: "Textiles"
  },
  {
    id: "P002",
    name: "Handcrafted Pottery",
    price: 800,
    image: "/placeholder.svg",
    category: "Handicrafts"
  },
  {
    id: "P003",
    name: "Spices Collection",
    price: 1500,
    image: "/placeholder.svg",
    category: "Food Products"
  }
];

const WhatsAppSharing = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [message, setMessage] = useState("Check out our latest products!");
  const [recipient, setRecipient] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState("");

  // Generate shareable link
  const shareableLink = `${window.location.origin}/catalog/${btoa(selectedProducts.join(","))}`;

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRCode = () => {
    setQrCode(shareableLink);
    toast.success("QR code generated!");
  };

  const shareViaWhatsApp = () => {
    if (!recipient) {
      toast.error("Please enter a recipient");
      return;
    }
    
    const phoneNumber = recipient.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(`${message}\n\n${shareableLink}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const shareCatalog = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }
    
    const productList = selectedProducts
      .map(id => {
        const product = products.find(p => p.id === id);
        return product ? `- ${product.name}: ₹${product.price}` : '';
      })
      .filter(Boolean)
      .join('\n');
    
    const fullMessage = `${message}

Products:
${productList}

View full catalog: ${shareableLink}`;
    
    // For demo purposes, we'll just show the message that would be sent
    toast.success("Catalog shared successfully!");
    console.log("WhatsApp message:", fullMessage);
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
          <h1 className="text-2xl font-bold">Share Catalog via WhatsApp</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>How to Share</CardTitle>
                <CardDescription>Share your product catalog with customers via WhatsApp</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Select products you want to share</li>
                  <li>Customize your message</li>
                  <li>Enter recipient's phone number</li>
                  <li>Click "Share via WhatsApp"</li>
                </ol>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Select Products</CardTitle>
                <CardDescription>Choose products to include in your catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div 
                      key={product.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedProducts.includes(product.id) 
                          ? "border-primary bg-primary/5" 
                          : "border-muted hover:border-primary/30"
                      }`}
                      onClick={() => toggleProductSelection(product.id)}
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-lg font-bold mt-1">₹{product.price}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedProducts.includes(product.id) 
                            ? "border-primary bg-primary" 
                            : "border-muted"
                        }`}>
                          {selectedProducts.includes(product.id) && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Customization */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Customize Message</CardTitle>
                <CardDescription>Personalize your WhatsApp message</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your message here..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Selected {selectedProducts.length} products
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sharing Options */}
          <div className="space-y-6">
            {/* Recipient */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Send to Recipient</CardTitle>
                <CardDescription>Enter recipient's phone number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Phone Number</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="recipient"
                      placeholder="Enter phone number with country code"
                      className="pl-10"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={shareViaWhatsApp}
                  disabled={!recipient || selectedProducts.length === 0}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send via WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Shareable Link */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Shareable Link</CardTitle>
                <CardDescription>Share this link with anyone</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={shareableLink} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={copyLink}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={generateQRCode}
                  disabled={selectedProducts.length === 0}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
                
                {qrCode && (
                  <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                    <QRCodeSVG value={qrCode} size={128} />
                    <p className="text-sm text-muted-foreground">Scan to view catalog</p>
                    <Button variant="outline" size="sm" onClick={() => setQrCode("")}>
                      Close
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bulk Sharing */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Bulk Sharing</CardTitle>
                <CardDescription>Share with multiple contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Contacts</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter phone numbers (comma separated)" />
                      <Button variant="outline" size="icon">
                        <User className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={shareCatalog}
                    disabled={selectedProducts.length === 0}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Catalog
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Sharing Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Links Generated</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Messages Sent</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Products Shared</span>
                    <span className="font-medium">42</span>
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

export default WhatsAppSharing;