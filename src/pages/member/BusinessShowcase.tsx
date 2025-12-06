import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Edit,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Camera,
  Plus,
  Star,
  Package,
  Users
} from "lucide-react";

const BusinessShowcase = () => {
  const [editing, setEditing] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    name: "Green Textiles Co.",
    tagline: "Premium organic cotton textiles for sustainable fashion",
    description: "We are a leading manufacturer of premium organic cotton textiles, committed to sustainability and ethical production practices. Our products are made from 100% organic cotton, ethically sourced and produced with eco-friendly processes.",
    category: "Textiles",
    subCategories: ["Organic", "Sustainable", "Wholesale"],
    established: "2018",
    employees: "50-100",
    address: "123 Industrial Area, Block A",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641001",
    phone: "+91 98765 43210",
    email: "info@greentextiles.com",
    website: "www.greentextiles.com",
    mapLink: "https://maps.google.com/?q=123+Industrial+Area,+Coimbatore",
    socialLinks: {
      instagram: "greentextiles",
      facebook: "greentextiles",
      twitter: "greentextiles",
      linkedin: "greentextiles"
    }
  });

  const [galleryImages, setGalleryImages] = useState([
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const openMap = () => {
    window.open(businessInfo.mapLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <Link to="/member/dashboard">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Business Showcase</h1>
          <Button 
            variant="outline" 
            className="ml-auto rounded-full"
            onClick={() => setEditing(!editing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {editing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        {/* Cover Photo */}
        <div className="relative h-64 rounded-xl overflow-hidden bg-muted">
          {editing ? (
            <div className="w-full h-full flex items-center justify-center bg-muted/50">
              <Button variant="secondary" className="rounded-full">
                <Camera className="w-5 h-5 mr-2" />
                Change Cover Photo
              </Button>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500"></div>
          )}
          
          {/* Business Logo */}
          <div className="absolute bottom-4 left-4">
            <Avatar className="w-24 h-24 border-4 border-white rounded-full">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl rounded-full">
                GT
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Business Info */}
        <Card className="shadow-lg border-0 -mt-12 relative z-10 rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                {editing ? (
                  <div className="space-y-2">
                    <Input 
                      name="name" 
                      value={businessInfo.name} 
                      onChange={handleInputChange}
                      className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0"
                    />
                    <Input 
                      name="tagline" 
                      value={businessInfo.tagline} 
                      onChange={handleInputChange}
                      className="text-muted-foreground border-none p-0 h-auto focus-visible:ring-0"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-foreground">{businessInfo.name}</h2>
                    <p className="text-muted-foreground">{businessInfo.tagline}</p>
                  </>
                )}
                
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="default" className="rounded-full px-3 py-1">{businessInfo.category}</Badge>
                  {businessInfo.subCategories.map((subCat, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full px-3 py-1">{subCat}</Badge>
                  ))}
                  <Badge variant="outline" className="rounded-full px-3 py-1">Established {businessInfo.established}</Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1">{businessInfo.employees} Employees</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-foreground">4.7 (128 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full">
                  <Package className="w-4 h-4 mr-2" />
                  View Products
                </Button>
                <Button className="rounded-full bg-primary hover:bg-primary/90">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Business
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Business Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Business */}
            <Card className="shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-foreground">About Business</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Textarea 
                    name="description" 
                    value={businessInfo.description} 
                    onChange={handleInputChange}
                    rows={6}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-muted-foreground">{businessInfo.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="shadow-lg border-0 rounded-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Business Gallery</CardTitle>
                  {editing && (
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Photos
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden bg-muted relative group">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      {editing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="sm" className="rounded-full">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Products Showcase */}
            <Card className="shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-foreground">Featured Products</CardTitle>
                <CardDescription>Our popular products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        <img 
                          src="/placeholder.svg" 
                          alt={`Product ${item}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-foreground">Organic Cotton Product {item}</h4>
                        <p className="text-sm text-muted-foreground mt-1">₹{1200 + (item * 100)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Address</p>
                    {editing ? (
                      <div className="space-y-2 mt-1">
                        <Input 
                          name="address" 
                          value={businessInfo.address} 
                          onChange={handleInputChange}
                          placeholder="Street address"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            name="city" 
                            value={businessInfo.city} 
                            onChange={handleInputChange}
                            placeholder="City"
                          />
                          <Input 
                            name="state" 
                            value={businessInfo.state} 
                            onChange={handleInputChange}
                            placeholder="State"
                          />
                        </div>
                        <Input 
                          name="pincode" 
                          value={businessInfo.pincode} 
                          onChange={handleInputChange}
                          placeholder="Pincode"
                        />
                        <Input 
                          name="mapLink" 
                          value={businessInfo.mapLink} 
                          onChange={handleInputChange}
                          placeholder="Map link URL"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {businessInfo.address}<br />
                          {businessInfo.city}, {businessInfo.state} - {businessInfo.pincode}
                        </p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto mt-2 text-primary hover:underline"
                          onClick={openMap}
                        >
                          View on map
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    {editing ? (
                      <Input 
                        name="phone" 
                        value={businessInfo.phone} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{businessInfo.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    {editing ? (
                      <Input 
                        name="email" 
                        value={businessInfo.email} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{businessInfo.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Website</p>
                    {editing ? (
                      <Input 
                        name="website" 
                        value={businessInfo.website} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <a 
                        href={`http://${businessInfo.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {businessInfo.website}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-foreground">Social Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    {editing ? (
                      <Input 
                        value={businessInfo.socialLinks.instagram} 
                        onChange={(e) => handleSocialChange("instagram", e.target.value)}
                        placeholder="Instagram username"
                      />
                    ) : (
                      <a 
                        href={`https://instagram.com/${businessInfo.socialLinks.instagram}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        @{businessInfo.socialLinks.instagram}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    {editing ? (
                      <Input 
                        value={businessInfo.socialLinks.facebook} 
                        onChange={(e) => handleSocialChange("facebook", e.target.value)}
                        placeholder="Facebook page"
                      />
                    ) : (
                      <a 
                        href={`https://facebook.com/${businessInfo.socialLinks.facebook}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        @{businessInfo.socialLinks.facebook}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    {editing ? (
                      <Input 
                        value={businessInfo.socialLinks.twitter} 
                        onChange={(e) => handleSocialChange("twitter", e.target.value)}
                        placeholder="Twitter handle"
                      />
                    ) : (
                      <a 
                        href={`https://twitter.com/${businessInfo.socialLinks.twitter}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        @{businessInfo.socialLinks.twitter}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    {editing ? (
                      <Input 
                        value={businessInfo.socialLinks.linkedin} 
                        onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                        placeholder="LinkedIn profile"
                      />
                    ) : (
                      <a 
                        href={`https://linkedin.com/company/${businessInfo.socialLinks.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        @{businessInfo.socialLinks.linkedin}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-foreground">Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">Monday - Friday</span>
                    <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">Saturday</span>
                    <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
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

export default BusinessShowcase;