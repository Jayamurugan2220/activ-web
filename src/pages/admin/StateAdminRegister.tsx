import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { INDIA_DISTRICTS } from "@/data/india-districts";

const StateAdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "",
    organization: "",
    position: "",
    reason: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.state || !formData.organization || !formData.position || !formData.reason) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Send registration request to backend
      const response = await fetch("http://localhost:4000/api/admin/register-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "state_admin",
          requestDate: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit registration request");
      }
      
      toast.success("Registration request submitted successfully! Awaiting super admin approval.");
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        state: "",
        organization: "",
        position: "",
        reason: ""
      });
      
      // Navigate to a confirmation page or back to login
      navigate("/admin/state-login");
    } catch (err) {
      toast.error("Failed to submit registration request. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-strong gradient-card border-0">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">State Admin Registration</CardTitle>
          <CardDescription>Request registration for State Administrator access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select name="state" value={formData.state} onValueChange={(value) => handleSelectChange("state", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(INDIA_DISTRICTS).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">Organization *</Label>
                <Input
                  id="organization"
                  name="organization"
                  placeholder="Enter your organization name"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position/Title *</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Enter your position/title"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Request *</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Please explain why you need State Admin access..."
                value={formData.reason}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Important Notice:</h3>
              <p className="text-xs text-muted-foreground">
                Your registration request will be reviewed by a Super Admin. 
                You will receive an email notification once your request has been approved or rejected.
                Please ensure all information provided is accurate and official.
              </p>
            </div>
            
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Registration Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateAdminRegister;