import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award,
  Phone,
  Mail,
  Globe
} from "lucide-react";

interface SellerInfo {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  since: string;
  verified: boolean;
  location: string;
  responseTime: string;
  badges?: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  performance?: {
    productsSold?: number;
    onTimeDelivery?: number;
    qualityScore?: number;
  };
}

interface SellerProfileCardProps {
  seller: SellerInfo;
  onContact?: () => void;
  onViewProfile?: () => void;
}

const SellerProfileCard = ({ 
  seller,
  onContact,
  onViewProfile
}: SellerProfileCardProps) => {
  // Function to render star ratings
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* Seller Header */}
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {seller.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{seller.name}</h3>
              {seller.verified && (
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Verified Seller</span>
                </div>
              )}
            </div>
            
            {seller.badges && seller.badges.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {seller.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-2">
            {renderRating(seller.rating)}
            <p className="text-sm text-muted-foreground">
              ({seller.reviewCount} reviews)
            </p>
          </div>
        </div>
      </div>
      
      {/* Seller Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground">Member since</p>
            <p className="font-medium">{seller.since}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{seller.location}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground">Response Time</p>
            <p className="font-medium">{seller.responseTime}</p>
          </div>
        </div>
        
        {seller.performance && (
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">On-Time Delivery</p>
              <p className="font-medium">{seller.performance.onTimeDelivery}%</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Contact Information */}
      {(seller.contact?.phone || seller.contact?.email || seller.contact?.website) && (
        <div className="pt-2 border-t">
          <h4 className="font-medium text-sm mb-2">Contact Information</h4>
          <div className="space-y-2">
            {seller.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{seller.contact.phone}</span>
              </div>
            )}
            
            {seller.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{seller.contact.email}</span>
              </div>
            )}
            
            {seller.contact.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {seller.contact.website}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onViewProfile}
        >
          View Profile
        </Button>
        <Button 
          className="flex-1"
          onClick={onContact}
        >
          Contact Seller
        </Button>
      </div>
    </div>
  );
};

export default SellerProfileCard;