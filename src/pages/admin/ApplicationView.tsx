import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, MapPin, Building, Calendar, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

const ApplicationView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState("pending");
  const [currentLevel, setCurrentLevel] = useState("block");

  const handleApprove = () => {
    // Move to next approval level
    if (currentLevel === "block") {
      setCurrentLevel("district");
      toast.success("Application forwarded to District Admin for review");
    } else if (currentLevel === "district") {
      setCurrentLevel("state");
      toast.success("Application forwarded to State Admin for review");
    } else if (currentLevel === "state") {
      setCurrentLevel("super");
      toast.success("Application forwarded to Super Admin for review");
    } else {
      setStatus("approved");
      toast.success("Application approved successfully");
    }
  };

  const handleReject = () => {
    setStatus("rejected");
    toast.error("Application rejected");
  };

  const handleEscalate = () => {
    // Determine next escalation level
    let nextLevel = "";
    if (currentLevel === "block") {
      nextLevel = "district";
    } else if (currentLevel === "district") {
      nextLevel = "state";
    } else if (currentLevel === "state") {
      nextLevel = "super";
    }
    
    if (nextLevel) {
      setCurrentLevel(nextLevel);
      toast.info(`Application escalated to ${nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1)} Admin`);
    }
  };

  // Get level display name
  const getLevelDisplayName = (level: string) => {
    switch (level) {
      case "block": return "Block Admin";
      case "district": return "District Admin";
      case "state": return "State Admin";
      case "super": return "Super Admin";
      default: return level;
    }
  };

  // Get member type display name
  const getMemberTypeDisplayName = (type: string) => {
    switch (type) {
      case "individual": return "Individual";
      case "shg": return "SHG (Self Help Group)";
      case "fpo": return "FPO (Farmer Producer Organization)";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Member Application Details</h1>
        </div>

        {/* Action Card */}
        <Card className="shadow-medium border-0 gradient-card">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-muted-foreground">ID: {id || "ACTIV2024001"}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className={
                  status === "approved" ? "bg-success text-success-foreground" : 
                  status === "rejected" ? "bg-destructive text-destructive-foreground" : 
                  "bg-amber-500 text-white"
                }>
                  {status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Pending"}
                </Badge>
                <Badge variant="default">
                  {getLevelDisplayName(currentLevel)}
                </Badge>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleReject} 
                variant="destructive" 
                className="flex-1"
                disabled={status === "rejected"}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              
              <Button 
                onClick={handleEscalate} 
                variant="outline" 
                className="flex-1"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Escalate
              </Button>
              
              <Button 
                onClick={handleApprove} 
                className="flex-1 bg-success hover:bg-success/90"
                disabled={status === "approved"}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {currentLevel === "super" ? "Approve" : "Forward"}
              </Button>
            </div>

            <Button variant="link" onClick={() => navigate(-1)} className="w-full">
              Back To List
            </Button>
          </CardContent>
        </Card>

        {/* Application Details - Accordion */}
        <Card className="shadow-medium border-0">
          <CardContent className="pt-6">
            <Accordion type="multiple" className="w-full" defaultValue={["personal", "business"]}>
              <AccordionItem value="personal">
                <AccordionTrigger className="text-lg font-semibold">
                  Personal & Demographic Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">John Doe</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">15-Jan-1990</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium">Male</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium">+91 98765 43210</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">john.doe@email.com</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Member Type</p>
                        <p className="font-medium">Individual</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="business">
                <AccordionTrigger className="text-lg font-semibold">
                  Business Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Business Name</p>
                        <p className="font-medium">Doe Enterprises</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business Type</p>
                        <p className="font-medium">Manufacturing</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Udyam Number</p>
                        <p className="font-medium">UDYAM12345678901</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business Phone</p>
                        <p className="font-medium">+91 98765 43211</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business Email</p>
                        <p className="font-medium">info@doeenterprises.com</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium text-primary">www.doeenterprises.com</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Business Address</p>
                      <p className="font-medium">123 Industrial Area, Block A</p>
                      <p className="font-medium">Chennai, Tamil Nadu - 600001</p>
                      <p className="font-medium">India</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Business Description</p>
                      <p className="font-medium">Specialized in manufacturing high-quality electronic components for automotive industry with over 10 years of experience.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="address">
                <AccordionTrigger className="text-lg font-semibold">
                  Communication Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Permanent Address</p>
                      <p className="font-medium">456 Residential Street, Block B</p>
                      <p className="font-medium">Chennai, Tamil Nadu - 600002</p>
                      <p className="font-medium">India</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Correspondence Address</p>
                      <p className="font-medium text-primary">Same as Permanent Address</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="documents">
                <AccordionTrigger className="text-lg font-semibold">
                  Documents Upload
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Photo</p>
                        <p className="font-medium text-primary">✓ Uploaded</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Signature</p>
                        <p className="font-medium text-primary">✓ Uploaded</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Aadhar Card</p>
                        <p className="font-medium text-primary">✓ Uploaded</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">PAN Card</p>
                        <p className="font-medium text-primary">✓ Uploaded</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Business Registration</p>
                        <p className="font-medium text-primary">✓ Uploaded</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Udyam Certificate</p>
                        <p className="font-medium text-primary">✓ Uploaded</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationView;