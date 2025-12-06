import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MessageCircle,
  Eye,
  Phone,
  Mail,
  Calendar,
  User,
  TrendingUp,
  MapPin
} from "lucide-react";

// Mock data for inquiries
const mockInquiries = [
  {
    id: "I001",
    customer: "Global Traders",
    customerId: "CT001",
    product: "Organic Cotton Textiles",
    productId: "P001",
    seller: "Green Textiles Co.",
    sellerId: "ST001",
    message: "Interested in bulk order. Please share pricing details for quantities above 500 units.",
    date: "2024-01-12",
    status: "new",
    email: "contact@globaltraders.com",
    phone: "+91 98765 43210",
    companyName: "Global Traders Pvt. Ltd.",
    quantity: 500,
    location: "Mumbai, Maharashtra"
  },
  {
    id: "I002",
    customer: "Fashion Hub",
    customerId: "CT002",
    product: "Handcrafted Pottery",
    productId: "P002",
    seller: "Artisan Pottery Studio",
    sellerId: "ST002",
    message: "Do you offer customization options? We need specific designs for our premium collection.",
    date: "2024-01-10",
    status: "responded",
    email: "info@fashionhub.in",
    phone: "+91 87654 32109",
    companyName: "Fashion Hub India",
    quantity: 100,
    location: "Delhi, NCR"
  },
  {
    id: "I003",
    customer: "Spice World",
    customerId: "CT003",
    product: "Spices Collection",
    productId: "P003",
    seller: "Heritage Spices Ltd",
    sellerId: "ST003",
    message: "Looking for regular supply partnership. Interested in monthly bulk orders.",
    date: "2024-01-08",
    status: "new",
    email: "orders@spiceworld.co.in",
    phone: "+91 76543 21098",
    companyName: "Spice World Distributors",
    quantity: 1000,
    location: "Kochi, Kerala"
  },
  {
    id: "I004",
    customer: "Textile Exports Ltd",
    customerId: "CT004",
    product: "Organic Cotton Textiles",
    productId: "P001",
    seller: "Green Textiles Co.",
    sellerId: "ST001",
    message: "Need samples for quality checking before placing international orders.",
    date: "2024-01-05",
    status: "closed",
    email: "exports@textilexports.com",
    phone: "+91 65432 10987",
    companyName: "Textile Exports Ltd",
    quantity: 50,
    location: "Chennai, Tamil Nadu"
  },
  {
    id: "I005",
    customer: "Home Decor Co",
    customerId: "CT005",
    product: "Bamboo Furniture",
    productId: "P005",
    seller: "Eco Furniture Makers",
    sellerId: "ST005",
    message: "Interested in wholesale pricing for hotel contracts.",
    date: "2024-01-03",
    status: "new",
    email: "procurement@homedecor.com",
    phone: "+91 54321 09876",
    companyName: "Home Decor Co",
    quantity: 200,
    location: "Bangalore, Karnataka"
  }
];

const LeadsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sellerFilter, setSellerFilter] = useState("all");

  // Get unique sellers for filter
  const sellers = Array.from(new Set(mockInquiries.map(inquiry => inquiry.seller)))
    .map(seller => ({
      name: seller,
      id: mockInquiries.find(i => i.seller === seller)?.sellerId || ""
    }));

  const filteredInquiries = mockInquiries
    .filter(inquiry => 
      inquiry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(inquiry => 
      statusFilter === "all" || inquiry.status === statusFilter
    )
    .filter(inquiry => 
      sellerFilter === "all" || inquiry.sellerId === sellerFilter
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "responded": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-muted";
    }
  };

  // Calculate statistics
  const totalLeads = mockInquiries.length;
  const newLeads = mockInquiries.filter(i => i.status === "new").length;
  const conversionRate = Math.round((mockInquiries.filter(i => i.status === "closed").length / totalLeads) * 100);
  const activeSellers = new Set(mockInquiries.map(i => i.sellerId)).size;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Leads Management</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{totalLeads}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Leads</p>
                  <p className="text-2xl font-bold">{newLeads}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Sellers</p>
                  <p className="text-2xl font-bold">{activeSellers}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">{conversionRate}%</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads, products, sellers..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Status Filter */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
              
              {/* Seller Filter */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={sellerFilter}
                onChange={(e) => setSellerFilter(e.target.value)}
              >
                <option value="all">All Sellers</option>
                {sellers.map(seller => (
                  <option key={seller.id} value={seller.id}>{seller.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lead Inquiries</CardTitle>
                <CardDescription>Manage all customer inquiries across the platform</CardDescription>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{inquiry.customer}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">Interested in: {inquiry.product}</p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">Seller: {inquiry.seller}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="mt-3 text-muted-foreground line-clamp-2">{inquiry.message}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{inquiry.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>Qty: {inquiry.quantity}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{inquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{inquiry.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No leads found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadsManagement;