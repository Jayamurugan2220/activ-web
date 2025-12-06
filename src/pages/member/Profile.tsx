import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, Save, Edit2, X, Camera, User } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import { INDIA_DISTRICTS } from "@/data/india-districts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import notificationService from "@/services/notificationService"; // Import notification service

type ProfileData = {
  firstName: string;
  middleName?: string;
  lastName?: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  state?: string;
  district?: string;
  block?: string;
  address?: string;
  profileImage?: string; // Add profile image field
};

const defaultProfile: ProfileData = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  state: "",
  district: "",
  block: "",
  address: "",
  profileImage: "", // Initialize profile image
};

export default function MemberProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(""); // For image preview

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileData>({ defaultValues: defaultProfile });

  // initialize form (load from localStorage if exists)
  useEffect(() => {
    const saved = localStorage.getItem("userProfile") || localStorage.getItem("registrationData");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        reset({ ...defaultProfile, ...obj });
        // Set profile image preview if exists
        if (obj.profileImage) {
          setProfileImagePreview(obj.profileImage);
        }
      } catch (e) {
        reset(defaultProfile);
      }
    } else {
      reset(defaultProfile);
    }
  }, [reset]);

  const selectedState = watch("state");
  useEffect(() => {
    if (selectedState) setDistricts(INDIA_DISTRICTS[selectedState] ?? []);
    else setDistricts([]);
  }, [selectedState]);

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setProfileImagePreview(imageDataUrl);
        // Update form data with image
        reset({ ...watch(), profileImage: imageDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCompletionPercentage = (values: ProfileData) => {
    // Define all fields that contribute to profile completion
    const fields = [
      values.firstName,
      values.lastName,
      values.email,
      values.phone,
      values.dateOfBirth,
      values.gender,
      values.state,
      values.district,
      values.block,
      values.address,
      values.profileImage, // Include profile image in completion calculation
    ];
    
    // Count filled fields (non-empty and not just whitespace)
    const filled = fields.filter((v) => !!v && `${v}`.trim() !== "").length;
    
    // Calculate percentage (0-100)
    return Math.round((filled / fields.length) * 100) || 0;
  };

  const onSave = async (data: ProfileData) => { // Make onSave async
    if (!data.firstName || !data.email || !data.phone || !data.state || !data.district) {
      toast.error("Please fill in required fields before saving.");
      return;
    }

    localStorage.setItem("userProfile", JSON.stringify(data));
    localStorage.setItem("userName", `${data.firstName} ${data.lastName ?? ""}`.trim());
    localStorage.setItem("registrationData", JSON.stringify(data));

    // Send notification to admins about profile update
    try {
      const memberId = localStorage.getItem("memberId") || "Unknown";
      await notificationService.sendProfileUpdateNotification(
        `${data.firstName} ${data.lastName ?? ""}`.trim(),
        memberId
      );
    } catch (error) {
      console.error("Failed to send profile update notification:", error);
    }

    setIsEditing(false);
    toast.success("Profile saved successfully");
  };

  const onCancel = () => {
    const saved = localStorage.getItem("userProfile") || localStorage.getItem("registrationData");
    if (saved) reset(JSON.parse(saved));
    else reset(defaultProfile);
    setIsEditing(false);
  };

  const currentValues = watch();
  const completion = getCompletionPercentage(currentValues);

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block w-16 lg:w-56">
        <Sidebar />
      </div>

      <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">My Profile</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal information</p>
              </div>

              <div className="hidden md:block">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSubmit(onSave)} className="bg-blue-600 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Image Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a profile picture to personalize your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-primary">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer">
                        <Camera className="w-4 h-4 text-white" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                  {isEditing && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setProfileImagePreview("");
                          reset({ ...watch(), profileImage: "" });
                        }}
                      >
                        Remove Photo
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Profile Completion</p>
                    <p className="text-sm font-semibold text-blue-600">{completion}%</p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${completion}%` }} />
                  </div>
                  
                  {completion < 100 && (
                    <p className="text-xs text-muted-foreground">
                      Complete your profile to unlock all features. {100 - completion}% remaining.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic details and contact information</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSave)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name*</Label>
                      <Input id="firstName" {...register("firstName", { required: "First name required" })} disabled={!isEditing} />
                      {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input id="middleName" {...register("middleName")} disabled={!isEditing} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...register("lastName")} disabled={!isEditing} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address*</Label>
                      <Input id="email" type="email" {...register("email", { required: "Email required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} disabled={!isEditing} />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number*</Label>
                      <Input id="phone" {...register("phone", { required: "Phone required", pattern: { value: /^\+?\d{10,15}$/, message: "Invalid phone" } })} disabled={!isEditing} />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} disabled={!isEditing} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <Select value={field.value || ""} onValueChange={(v: string) => field.onChange(v)} disabled={!isEditing}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Location Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State*</Label>
                        <Controller
                          control={control}
                          name="state"
                          render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={(v: string) => field.onChange(v)} disabled={!isEditing}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(INDIA_DISTRICTS).map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">District*</Label>
                        <Controller
                          control={control}
                          name="district"
                          render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={(v: string) => field.onChange(v)} disabled={!isEditing || !selectedState}>
                              <SelectTrigger>
                                <SelectValue placeholder={districts.length ? "Select district" : "No districts available"} />
                              </SelectTrigger>
                              <SelectContent>
                                {districts.length > 0 ? (
                                  districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)
                                ) : (
                                  <>
                                    <SelectItem value="district1">District 1</SelectItem>
                                    <SelectItem value="district2">District 2</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="block">Block</Label>
                        <Input id="block" {...register("block")} disabled={!isEditing} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...register("address")} disabled={!isEditing} />
                      </div>
                    </div>

                    {/* Mobile action buttons: when editing use Save/Cancel */}
                    <div className="md:hidden flex gap-2 pt-6 border-t">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={onCancel} className="flex-1">
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSubmit(onSave)} className="flex-1 bg-blue-600 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} className="w-full">
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}