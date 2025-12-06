import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import notificationService from "@/services/notificationService";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MessageCircle,
  Eye,
  Reply,
  Phone,
  Mail,
  Calendar,
  User
} from "lucide-react";

// Mock data for inquiries
const mockInquiries = [
  {
    id: "I001",
    customer: "Global Traders",
    customerId: "CT001",
    product: "Organic Cotton Textiles",
    productId: "P001",
    message: "Interested in bulk order. Please share pricing details for quantities above 500 units.",
    date: "2024-01-12",
    status: "new",
    email: "contact@globaltraders.com",
    phone: "+91 98765 43210",
    companyName: "Global Traders Pvt. Ltd.",
    quantity: 500
  },
  {
    id: "I002",
    customer: "Fashion Hub",
    customerId: "CT002",
    product: "Handcrafted Pottery",
    productId: "P002",
    message: "Do you offer customization options? We need specific designs for our premium collection.",
    date: "2024-01-10",
    status: "responded",
    email: "info@fashionhub.in",
    phone: "+91 87654 32109",
    companyName: "Fashion Hub India",
    quantity: 100
  },
  {
    id: "I003",
    customer: "Spice World",
    customerId: "CT003",
    product: "Spices Collection",
    productId: "P003",
    message: "Looking for regular supply partnership. Interested in monthly bulk orders.",
    date: "2024-01-08",
    status: "new",
    email: "orders@spiceworld.co.in",
    phone: "+91 76543 21098",
    companyName: "Spice World Distributors",
    quantity: 1000
  },
  {
    id: "I004",
    customer: "Textile Exports Ltd",
    customerId: "CT004",
    product: "Organic Cotton Textiles",
    productId: "P001",
    message: "Need samples for quality checking before placing international orders.",
    date: "2024-01-05",
    status: "closed",
    email: "exports@textilexports.com",
    phone: "+91 65432 10987",
    companyName: "Textile Exports Ltd",
    quantity: 50
  }
];

const SellerLeadsInbox = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const filteredInquiries = mockInquiries
    .filter(inquiry => 
      inquiry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(inquiry => 
      statusFilter === "all" || inquiry.status === statusFilter
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "responded": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-muted";
    }
  };

  const handleReply = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setIsReplying(true);
  };

  const sendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;
    
    try {
      // Send notification to buyer
      await notificationService.sendInquiryResponseNotification(
        selectedInquiry.customer,
        selectedInquiry.email,
        selectedInquiry.phone,
        selectedInquiry.product,
        "Seller", // In a real app, this would be the actual seller name
        replyMessage
      );
      
      // Reset form
      setReplyMessage("");
      setIsReplying(false);
      setSelectedInquiry(null);
      
      toast({
        title: "Reply Sent",
        description: "Your response has been sent to the customer."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/seller/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Leads Inbox</h1>
        </div>

        {!isReplying ? (
          <>
            {/* Search and Filters */}
            <Card className="shadow-medium border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
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
                  
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="shadow-medium border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Leads</p>
                      <p className="text-2xl font-bold">{mockInquiries.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-medium border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New Leads</p>
                      <p className="text-2xl font-bold">{mockInquiries.filter(i => i.status === "new").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-medium border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Responded</p>
                      <p className="text-2xl font-bold">{mockInquiries.filter(i => i.status === "responded").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-medium border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">25%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leads List */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Lead Inquiries</CardTitle>
                <CardDescription>Manage customer inquiries for your products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{inquiry.customer}</h3>
                            <p className="text-sm text-muted-foreground">Interested in: {inquiry.product}</p>
                          </div>
                          <Badge className={getStatusColor(inquiry.status)}>
                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="mt-3 text-muted-foreground line-clamp-2">{inquiry.message}</p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
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
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReply(inquiry)}
                            >
                              <Reply className="w-4 h-4 mr-2" />
                              Reply
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
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
          </>
        ) : (
          /* Reply Form */
          <Card className="shadow-medium border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reply to Inquiry</CardTitle>
                  <CardDescription>
                    Respond to {selectedInquiry?.customer} about {selectedInquiry?.product}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsReplying(false);
                    setSelectedInquiry(null);
                  }}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Inquiry Details */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{selectedInquiry?.customer}</h3>
                        <p className="text-sm text-muted-foreground">{selectedInquiry?.companyName}</p>
                      </div>
                      <Badge className={getStatusColor(selectedInquiry?.status)}>
                        {selectedInquiry?.status.charAt(0).toUpperCase() + selectedInquiry?.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedInquiry?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedInquiry?.phone}</span>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-muted-foreground">{selectedInquiry?.message}</p>
                  </CardContent>
                </Card>
                
                {/* Reply Form */}
                <div className="space-y-2">
                  <label htmlFor="replyMessage" className="text-sm font-medium">Your Response</label>
                  <Textarea
                    id="replyMessage"
                    placeholder="Write your response here..."
                    rows={6}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={sendReply}
                    disabled={!replyMessage.trim()}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsReplying(false);
                      setSelectedInquiry(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellerLeadsInbox;