import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  CreditCard, 
  IndianRupee, 
  Heart,
  Gift,
  Users,
  BookOpen,
  Home,
  Leaf
} from "lucide-react";
import instamojoService from "@/services/instamojoService";
import receiptService from "@/services/receiptService";
import notificationService from "@/services/notificationService";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("general");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const presetAmounts = [500, 1000, 2000, 5000];

  const donationTypes = [
    { id: "general", name: "General Support", icon: Heart, description: "Support our general operations" },
    { id: "education", name: "Education Fund", icon: BookOpen, description: "Support educational initiatives" },
    { id: "community", name: "Community Development", icon: Users, description: "Community upliftment programs" },
    { id: "housing", name: "Housing Projects", icon: Home, description: "Affordable housing initiatives" },
    { id: "environment", name: "Environmental Causes", icon: Leaf, description: "Environmental conservation efforts" }
  ];

  const handlePayment = async () => {
    const totalAmount = customAmount || amount;
    if (!totalAmount) {
      alert("Please select or enter a donation amount");
      return;
    }
    
    try {
      const userName = localStorage.getItem('userName') || 'Donor';
      const memberId = localStorage.getItem('memberId') || 'DONOR001';
      const email = localStorage.getItem('userEmail') || '';
      const phone = localStorage.getItem('userPhone') || '';
      
      // Get donation purpose
      const selectedDonationType = donationTypes.find(t => t.id === donationType);
      const donationPurpose = selectedDonationType ? selectedDonationType.name : "General Donation";
      
      // Process payment through Instamojo
      const paymentLink = await instamojoService.processDonationPayment(
        parseInt(totalAmount),
        { name: userName, email, phone },
        donationPurpose,
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
          paymentType: 'donation' as 'donation',
          amount: parseInt(totalAmount),
          paymentDate: new Date().toISOString(),
          purpose: donationPurpose
        };
        
        const receiptContent = await receiptService.generateReceipt(receiptData);
        receiptService.saveReceipt(receiptId, receiptContent);
        
        // Send email receipt if email is available
        if (email) {
          await notificationService.sendReceiptEmail(
            email,
            userName,
            receiptContent,
            `Donation - ${donationPurpose}`
          );
        }
        
        // Send SMS receipt if phone is available
        if (phone) {
          await notificationService.sendReceiptSMS(
            phone,
            userName,
            receiptData.paymentId,
            parseInt(totalAmount)
          );
        }
        
        // Navigate to payment history
        navigate("/member/payments/history");
      }, 2000);
    } catch (error) {
      console.error('Donation processing failed:', error);
      alert("Donation processing failed. Please try again.");
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
          <h1 className="text-2xl font-bold">Make a Donation</h1>
        </div>

        {/* Donation Impact Message */}
        <Card className="shadow-medium border-0 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Your Support Makes a Difference</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Every contribution helps us empower communities and create sustainable change. 
                  Thank you for your generosity!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Donation Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donation Type Selection */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Donation Purpose</CardTitle>
                <CardDescription>Choose where your donation will go</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {donationTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div 
                        key={type.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          donationType === type.id 
                            ? "border-primary bg-primary/5" 
                            : "border-muted hover:border-primary/30"
                        }`}
                        onClick={() => setDonationType(type.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Amount Selection */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Donation Amount</CardTitle>
                <CardDescription>Select or enter your donation amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {presetAmounts.map((amt) => (
                    <Button
                      key={amt}
                      variant={amount === amt.toString() ? "default" : "outline"}
                      className="h-16 flex flex-col gap-1"
                      onClick={() => {
                        setAmount(amt.toString());
                        setCustomAmount("");
                      }}
                    >
                      <IndianRupee className="w-4 h-4" />
                      <span className="text-lg font-bold">{amt}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="custom-amount">Custom Amount</Label>
                    <div className="relative mt-2">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter custom amount"
                        className="pl-10"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount("");
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {(amount || customAmount) && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Selected Amount:</span>
                      <span className="text-2xl font-bold">
                        ₹{customAmount || amount}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal Message */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Your Message</CardTitle>
                <CardDescription>Add a personal note with your donation (optional)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write a message to accompany your donation..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div>
            <Card className="shadow-medium border-0 sticky top-6">
              <CardHeader>
                <CardTitle>Donation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-medium">
                      {donationTypes.find(t => t.id === donationType)?.name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold">
                      ₹{customAmount || amount || "0"}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{customAmount || amount || "0"}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    disabled={!amount && !customAmount}
                    onClick={handlePayment}
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Donate Now
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Your donation is tax deductible. You will receive a receipt via email.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;