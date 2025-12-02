import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Mail, Phone, User, VenetianMask, AlertTriangle, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define TypeScript interfaces
interface MemberDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  sector: string;
  phone: string;
  currentLevel: "block" | "district" | "state" | "super";
  memberType: "individual" | "shg" | "fpo";
  businessName?: string;
  district: string;
  state: string;
}

interface ApprovalCardProps {
  member: MemberDetails;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEscalate?: (id: string) => void;
}

const ApprovalCard = ({ member, onApprove, onReject, onEscalate }: ApprovalCardProps) => {
  const { toast } = useToast();

  const handleApprove = () => {
    onApprove(member.id);
    toast({
      title: "Member Approved",
      description: `${member.name} has been approved successfully.`,
    });
  };

  const handleReject = () => {
    onReject(member.id);
    toast({
      title: "Member Rejected",
      description: `${member.name} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleEscalate = () => {
    if (onEscalate) {
      onEscalate(member.id);
      toast({
        title: "Application Escalated",
        description: `${member.name}'s application has been escalated to the next level.`,
      });
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
      case "shg": return "SHG";
      case "fpo": return "FPO";
      default: return type;
    }
  };

  return (
    <Card className="shadow-medium border-0">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {member.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-bold">{member.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{member.email}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Role:</span>
          <Badge variant="secondary">{member.role}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <VenetianMask className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Gender:</span>
          <span>{member.gender}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Member Type:</span>
          <Badge variant="outline">{getMemberTypeDisplayName(member.memberType)}</Badge>
        </div>
        
        {member.businessName && (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Business:</span>
            <span>{member.businessName}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Location:</span>
          <span>{member.district}, {member.state}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Current Level:</span>
          <Badge variant="default">{getLevelDisplayName(member.currentLevel)}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Phone:</span>
          <span>{member.phone}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="destructive" 
          onClick={handleReject}
          className="flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </Button>
        
        {onEscalate && (
          <Button 
            variant="outline" 
            onClick={handleEscalate}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Escalate
          </Button>
        )}
        
        <Button 
          variant="default" 
          onClick={handleApprove}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApprovalCard;