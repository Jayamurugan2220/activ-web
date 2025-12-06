import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  IndianRupee, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle 
} from "lucide-react";
import receiptService from "@/services/receiptService";

// Mock payment data
const paymentHistory = [
  {
    id: "PAY2024001",
    date: "2024-01-15",
    amount: 1500,
    type: "membership",
    status: "completed",
    description: "Annual Membership Fee",
    receiptUrl: "#"
  },
  {
    id: "PAY2024002",
    date: "2024-01-10",
    amount: 500,
    type: "donation",
    status: "completed",
    description: "General Donation",
    receiptUrl: "#"
  },
  {
    id: "PAY2024003",
    date: "2023-12-20",
    amount: 1500,
    type: "membership",
    status: "pending",
    description: "Annual Membership Fee",
    receiptUrl: "#"
  },
  {
    id: "PAY2023015",
    date: "2023-01-15",
    amount: 1500,
    type: "membership",
    status: "completed",
    description: "Annual Membership Fee",
    receiptUrl: "#"
  },
  {
    id: "PAY2023012",
    date: "2023-01-10",
    amount: 300,
    type: "donation",
    status: "failed",
    description: "Event Sponsorship",
    receiptUrl: "#"
  }
];

const PaymentHistory = () => {
  const [filter, setFilter] = useState("all");

  const filteredPayments = filter === "all" 
    ? paymentHistory 
    : paymentHistory.filter(payment => payment.type === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success";
      case "pending": return "bg-amber-500";
      case "failed": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case "membership": return "Membership";
      case "lifetime_membership": return "Lifetime Membership";
      case "donation": return "Donation";
      default: return type;
    }
  };

  const handleDownloadReceipt = (paymentId: string) => {
    // In a real app, this would fetch the actual receipt
    // For demo purposes, we'll generate a mock receipt
    const receiptContent = `ACTIV Organization
Payment Receipt
----------------------------------------
Receipt ID: RCT-${paymentId}
Payment ID: ${paymentId}
Date: ${new Date().toLocaleDateString()}

Member Information:
Name: ${localStorage.getItem('userName') || 'Member'}
Member ID: ${localStorage.getItem('memberId') || 'MEMBER001'}

Payment Details:
Type: ${filteredPayments.find(p => p.id === paymentId)?.type}
Amount: ₹${filteredPayments.find(p => p.id === paymentId)?.amount}

Thank you for your payment. This serves as your official receipt.
For any queries, contact support@activ.org`;
    
    receiptService.downloadReceipt(receiptContent, `receipt-${paymentId}.txt`);
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Payment History</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">₹3,000</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Membership Fees</p>
                  <p className="text-2xl font-bold">₹3,000</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Donations</p>
                  <p className="text-2xl font-bold">₹800</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Payments
          </Button>
          <Button 
            variant={filter === "membership" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("membership")}
          >
            Membership
          </Button>
          <Button 
            variant={filter === "lifetime_membership" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("lifetime_membership")}
          >
            Lifetime Membership
          </Button>
          <Button 
            variant={filter === "donation" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("donation")}
          >
            Donations
          </Button>
        </div>

        {/* Payment History List */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All your payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {payment.type === "membership" || payment.type === "lifetime_membership" ? "M" : "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{payment.id}</p>
                        <Badge variant="outline">{getTypeDisplay(payment.type)}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{payment.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">₹{payment.amount}</p>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownloadReceipt(payment.id)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentHistory;