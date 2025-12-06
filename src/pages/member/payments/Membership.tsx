import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  IndianRupee, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Trophy,
  Star
} from "lucide-react";
import notificationService from "@/services/notificationService";
import reminderService from "@/services/reminderService";
import instamojoService from "@/services/instamojoService";
import receiptService from "@/services/receiptService";
import certificateService from "@/services/certificateService";

const MembershipRenewal = () => {
  const [plan, setPlan] = useState("annual");
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();

  const plans = {
    annual: {
      name: "Annual Membership",
      price: 1500,
      period: "per year",
      benefits: [
        "Full access to all platform features",
        "Priority customer support",
        "Business showcase listing",
        "Unlimited product listings",
        "Advanced analytics dashboard"
      ]
    },
    lifetime: {
      name: "Lifetime Membership",
      price: 10000,
      period: "one-time",
      benefits: [
        "All Annual Membership benefits",
        "Exclusive events access",
        "Premium support hotline",
        "VIP member directory listing",
        "Lifetime platform access"
      ]
    }
  };

  const selectedPlan = plans[plan as keyof typeof plans];

  const handlePayment = async () => {
    try {
      const userName = localStorage.getItem('userName') || 'Member';
      const memberId = localStorage.getItem('memberId') || 'MEMBER001';
      const email = localStorage.getItem('userEmail') || '';
      const phone = localStorage.getItem('userPhone') || '';
      
      // Process payment through Instamojo
      const paymentLink = await instamojoService.processMembershipPayment(
        selectedPlan.price,
        { name: userName, email, phone },
        plan as 'annual' | 'lifetime',
        `${window.location.origin}/member/payments/history`
      );
      
      // In a real app, this would redirect to the payment gateway
      alert(`Redirecting to Instamojo payment gateway...\n\nIn a real application, you would be redirected to: ${paymentLink}`);
      
      // Simulate successful payment for demo purposes
      setTimeout(async () => {
        // Generate and save receipt
        const receiptId = `RCT-${Date.now()}`;
        const receiptData = {
          receiptId,
          paymentId: `PAY-${Date.now()}`,
          memberId,
          memberName: userName,
          email,
          phone,
          paymentType: plan === 'annual' ? 'membership' : 'lifetime_membership' as 'membership' | 'lifetime_membership',
          amount: selectedPlan.price,
          paymentDate: new Date().toISOString(),
          validity: plan === 'annual' ? '1 Year' : 'Lifetime'
        };
        
        const receiptContent = await receiptService.generateReceipt(receiptData);
        receiptService.saveReceipt(receiptId, receiptContent);
        
        // Send email receipt if email is available
        if (email) {
          await notificationService.sendReceiptEmail(
            email,
            userName,
            receiptContent,
            selectedPlan.name
          );
        }
        
        // Send SMS receipt if phone is available
        if (phone) {
          await notificationService.sendReceiptSMS(
            phone,
            userName,
            receiptData.paymentId,
            selectedPlan.price
          );
        }
        
        // For lifetime membership, generate certificate
        if (plan === 'lifetime') {
          const certificateId = `CERT-${Date.now()}`;
          const qrCodeData = certificateService.generateQRCodeData(certificateId, memberId);
          const certificateData = {
            certificateId,
            memberId,
            memberName: userName,
            membershipId: memberId,
            issueDate: new Date().toISOString(),
            validity: 'Lifetime',
            qrCodeData
          };
          
          const certificateContent = await certificateService.generateCertificate(certificateData);
          certificateService.saveCertificate(certificateId, certificateContent);
          
          // Save certificate to user's certificates
          const userCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]');
          userCertificates.push({
            id: certificateId,
            title: "Lifetime Membership Certificate",
            issueDate: new Date().toISOString(),
            expiryDate: "2099-12-31",
            certificateNumber: certificateId,
            status: "valid",
            downloadUrl: "#"
          });
          localStorage.setItem('userCertificates', JSON.stringify(userCertificates));
        }
        
        // Send payment success notification
        await notificationService.sendPaymentSuccessNotification(
          userName,
          email,
          phone,
          receiptData.paymentId,
          selectedPlan.price,
          selectedPlan.name
        );
        
        // Schedule a reminder for membership renewal before expiry
        // For annual plan, remind 1 month before expiry
        // For lifetime plan, no reminder needed
        if (plan === "annual") {
          const dueDate = new Date();
          dueDate.setFullYear(dueDate.getFullYear() + 1); // 1 year from now
          dueDate.setMonth(dueDate.getMonth() - 1); // 1 month before expiry
          
          reminderService.scheduleReminder(
            memberId,
            "membership",
            "Membership Renewal Due Soon",
            "Your annual membership will expire soon. Renew now to continue enjoying all benefits.",
            dueDate.toISOString()
          );
        }
        
        // Navigate to payment history
        navigate("/member/payments/history");
      }, 2000);
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert("Payment processing failed. Please try again.");
    }
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
          <h1 className="text-2xl font-bold">Membership Renewal</h1>
        </div>

        {/* Current Membership Status */}
        <Card className="shadow-medium border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Current Membership</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="default">Active</Badge>
                  <span className="text-sm text-muted-foreground">Expires on 15 Jan 2025</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Renew before expiration to maintain uninterrupted access</p>
              </div>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                <span>345 days remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Annual Plan */}
          <Card 
            className={`shadow-medium border-2 cursor-pointer transition-all ${
              plan === "annual" ? "border-primary" : "border-muted"
            }`}
            onClick={() => setPlan("annual")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Annual Membership</CardTitle>
                {plan === "annual" && (
                  <Badge variant="default">Recommended</Badge>
                )}
              </div>
              <CardDescription>Renew for one year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">₹1,500</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                
                <ul className="space-y-2">
                  {plans.annual.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-4" 
                  variant={plan === "annual" ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlan("annual");
                  }}
                >
                  {plan === "annual" ? "Selected" : "Choose Plan"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
          <Card 
            className={`shadow-medium border-2 cursor-pointer transition-all ${
              plan === "lifetime" ? "border-primary" : "border-muted"
            }`}
            onClick={() => setPlan("lifetime")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lifetime Membership</CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Premium
                </Badge>
              </div>
              <CardDescription>One-time payment for lifetime access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">₹10,000</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
                
                <ul className="space-y-2">
                  {plans.lifetime.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-4" 
                  variant={plan === "lifetime" ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlan("lifetime");
                  }}
                >
                  {plan === "lifetime" ? "Selected" : "Choose Plan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupon Section */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Discount Coupon</CardTitle>
            <CardDescription>Apply a coupon code for discount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="coupon" className="sr-only">Coupon Code</Label>
                <Input 
                  id="coupon" 
                  placeholder="Enter coupon code" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
              </div>
              <Button variant="outline">Apply</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>{selectedPlan.name}</span>
                <span>₹{selectedPlan.price}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>₹{Math.round(selectedPlan.price * 0.02)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{selectedPlan.price + Math.round(selectedPlan.price * 0.02)}</span>
                </div>
              </div>
              
              <Button className="w-full mt-6" onClick={handlePayment}>
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Payment
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipRenewal;