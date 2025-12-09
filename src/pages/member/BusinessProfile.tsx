import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type BusinessProfileData = {
  businessName: string;
  description: string;
  businessType: string;
  mobileNumber: string;
  area: string;
  location: string;
};

type SavedBusiness = BusinessProfileData & {
  id: string;
  createdAt: string;
};

const BusinessProfile = () => {
  const [formData, setFormData] = useState<BusinessProfileData>({
    businessName: "",
    description: "",
    businessType: "",
    mobileNumber: "",
    area: "",
    location: ""
  });
  
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      businessType: value
    }));
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSave = () => {
    if (!formData.businessName || !formData.businessType || !formData.mobileNumber) {
      alert("Please fill in all required fields");
      return;
    }
    
    const newBusiness: SavedBusiness = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setSavedBusinesses(prev => [...prev, newBusiness]);
    
    // Reset form
    setFormData({
      businessName: "",
      description: "",
      businessType: "",
      mobileNumber: "",
      area: "",
      location: ""
    });
    
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    alert("Business profile saved successfully!");
  };
  
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      setFormData({
        businessName: "",
        description: "",
        businessType: "",
        mobileNumber: "",
        area: "",
        location: ""
      });
      setLogoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Business Profile</h1>
          <p className="text-gray-600 mt-2">Manage your business presence</p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Logo Upload Section */}
            <div className="flex flex-col items-center mb-8">
              <div 
                className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={triggerFileInput}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Business logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <div className="text-2xl mb-2">+</div>
                    <span className="text-sm text-gray-500">Upload Logo</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Tap to upload business logo</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div>
            
            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your business..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.description.length}/500
                </div>
              </div>
              
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={formData.businessType} onValueChange={handleSelectChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Trader">Trader</SelectItem>
                    <SelectItem value="Service Provider">Service Provider</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  name="area"
                  placeholder="Enter area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white" onClick={handleSave}>
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Display Saved Businesses */}
        {savedBusinesses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Manage My Companies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedBusinesses.map((business) => (
                <Card key={business.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                          {logoPreview ? (
                            <img src={logoPreview} alt="Business logo" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="text-xl">🏢</div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{business.businessName}</h3>
                          <p className="text-gray-600">{business.businessType}</p>
                          <p className="text-gray-600">{business.mobileNumber}</p>
                          
                          <Badge className="mt-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            Under Review
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-4 pt-4 border-t">
                        <div className="flex space-x-4 text-sm">
                          <span>Products: 0</span>
                          <span>Views: 0</span>
                          <span>Connections: 0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 flex justify-between">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button className="bg-blue-600 text-white" size="sm">
                        Set as Active
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessProfile;