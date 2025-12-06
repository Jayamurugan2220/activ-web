import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, ArrowRight, Upload, Building, MapPin, User, ArrowLeft, FileText, IdCard } from "lucide-react";
import { toast } from "sonner";
import { INDIA_DISTRICTS } from "@/data/india-districts";
import notificationService from "@/services/notificationService";
import reminderService from "@/services/reminderService";

const MemberRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [idProof, setIdProof] = useState<File | null>(null);
  const [businessDocuments, setBusinessDocuments] = useState<File[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [partialData, setPartialData] = useState<any>({});
  const idProofRef = useRef<HTMLInputElement>(null);
  const businessDocsRef = useRef<HTMLInputElement>(null);

  type Step1Form = {
    firstName: string;
    middleName?: string;
    lastName?: string;
    mobile: string;
    email: string;
    gender?: string;
    dob?: string;
  };

  type Step2Form = {
    memberType: string;
    businessName?: string;
    udyamNumber?: string;
    businessAddress?: string;
    businessPincode?: string;
    businessPhone?: string;
    businessEmail?: string;
    businessWebsite?: string;
    businessDescription?: string;
  };

  type Step3Form = {
    memberId: string;
    password: string;
    confirmPassword: string;
    stateName: string;
    districtName: string;
    block: string;
    address: string;
    pincode: string;
  };

  const { register: registerStep1, handleSubmit: handleSubmitStep1, control: controlStep1, formState: { errors: errorsStep1 } } = useForm<Step1Form>({ mode: 'onBlur' });
  const { register: registerStep2, handleSubmit: handleSubmitStep2, control: controlStep2, formState: { errors: errorsStep2 } } = useForm<Step2Form>({ mode: 'onBlur' });
  const { register: registerStep3, handleSubmit: handleSubmitStep3, control: controlStep3, watch: watchStep3, formState: { errors: errorsStep3 } } = useForm<Step3Form>({ mode: 'onBlur' });

  const handleStep1Submit = (data: Step1Form) => {
    setPartialData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2Submit = (data: Step2Form) => {
    // Validate Udyam Number format if provided
    if (data.udyamNumber && !/^UDYAM[A-Z0-9]{12}$/.test(data.udyamNumber)) {
      toast.error("Invalid Udyam Number format. Please use format: UDYAMXXXXXXXXXXXX");
      return;
    }
    
    setPartialData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep3Submit = async (data: Step3Form) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Auto-generate Membership ID if not provided
    let finalMemberId = data.memberId;
    if (!finalMemberId) {
      const firstName = partialData.firstName || 'MEMBER';
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      finalMemberId = `${firstName.toUpperCase().substring(0, 3)}${randomNumber}`;
    }

    const combined = {
      ...partialData,
      ...data,
      memberId: finalMemberId,
      password: data.password,
      state: data.stateName,
      district: data.districtName,
      registeredAt: new Date().toISOString(),
      // Add approval workflow fields
      status: "pending",
      currentLevel: "block",
      submissionDate: new Date().toISOString().split('T')[0],
      lastActionDate: new Date().toISOString().split('T')[0]
    };

    // Persist user to users list so they can login later
    try {
      const usersJson = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersJson) as Array<any>;

      // prevent duplicate memberId
      if (users.some((u) => u.memberId === finalMemberId)) {
        toast.error('Member ID already exists. Please choose another.');
        return;
      }

      users.push({
        memberId: finalMemberId,
        password: data.password,
        email: partialData.email,
        firstName: partialData.firstName,
        memberType: partialData.memberType,
        businessName: partialData.businessName,
        registeredAt: new Date().toISOString(),
        // Add approval workflow fields
        status: "pending",
        currentLevel: "block",
        submissionDate: new Date().toISOString().split('T')[0],
        lastActionDate: new Date().toISOString().split('T')[0],
        district: data.districtName,
        state: data.stateName,
        block: data.block
      });

      // Try to register with backend if available, otherwise fallback to localStorage users
      let backendOk = false;
      try {
        const res = await fetch('http://localhost:4000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            memberId: finalMemberId, 
            password: data.password, 
            email: partialData.email, 
            firstName: partialData.firstName,
            memberType: partialData.memberType,
            businessName: partialData.businessName
          }),
        });

        if (res.ok) {
          backendOk = true;
        }
      } catch (err) {
        // backend not available — fall back to localStorage
        backendOk = false;
      }

      if (!backendOk) localStorage.setItem('users', JSON.stringify(users));

      // Also save application data for approval workflow
      try {
        const applicationsJson = localStorage.getItem('applications') || '[]';
        const applications = JSON.parse(applicationsJson) as Array<any>;
        
        // Generate unique application ID
        const applicationId = `ACTIV${new Date().getFullYear()}${String(applications.length + 1).padStart(3, '0')}`;
        
        const applicationData = {
          id: applicationId,
          name: `${partialData.firstName} ${partialData.lastName || ''}`,
          email: partialData.email,
          role: "Member",
          gender: partialData.gender || "Not specified",
          sector: partialData.memberType === "individual" ? "Individual" : 
                 partialData.memberType === "shg" ? "Self Help Group" : "Farmer Producer Organization",
          phone: partialData.mobile,
          status: "pending",
          date: new Date().toISOString().split('T')[0],
          currentLevel: "block",
          memberType: partialData.memberType,
          businessName: partialData.businessName,
          district: data.districtName,
          state: data.stateName,
          block: data.block,
          submissionDate: new Date().toISOString().split('T')[0],
          lastActionDate: new Date().toISOString().split('T')[0]
        };
        
        applications.push(applicationData);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        // Also save to backend if available
        try {
          await fetch('http://localhost:4000/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(applicationData),
          });
        } catch (err) {
          console.log("Backend not available for applications, using localStorage");
        }
      } catch (err) {
        console.error("Error saving application data:", err);
      }

      // Keep registrationData (profile) for convenience
      localStorage.setItem('registrationData', JSON.stringify(combined));
      localStorage.setItem('userName', partialData.firstName || combined.firstName || 'Member');
      // set session so the user is logged in immediately after register
      localStorage.setItem('memberId', finalMemberId);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.removeItem('hasVisitedDashboard');
      
      // Send WhatsApp onboarding message
      try {
        // Send comprehensive registration notification
        await notificationService.sendRegistrationNotification(
          partialData.firstName || combined.firstName || 'Member',
          partialData.email,
          partialData.mobile,
          finalMemberId,
          partialData.businessName || 'your business'
        );
        
        // Also send WhatsApp onboarding message
        await notificationService.sendWhatsAppOnboarding(
          partialData.firstName || combined.firstName || 'Member',
          partialData.mobile,
          partialData.businessName || 'your business'
        );
        
        // Schedule a reminder to complete profile
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3); // 3 days from now
        
        reminderService.scheduleReminder(
          finalMemberId,
          "profile",
          "Complete Your Profile",
          "Complete your member profile to unlock all platform features",
          dueDate.toISOString()
        );
      } catch (error) {
        console.error('Failed to send registration notifications:', error);
      }
      
      toast.success('Registration successful — you are now signed in');
      // navigate to dashboard directly
      navigate('/member/dashboard');
    } catch (err) {
      console.error('Failed to persist user', err);
      toast.error('Failed to save registration. Please try again.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdProof(file);
      toast.success("ID proof uploaded successfully");
    }
  };

  const handleBusinessDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setBusinessDocuments(fileList);
      toast.success(`${fileList.length} document(s) uploaded successfully`);
    }
  };

  const watchedState = watchStep3 ? watchStep3('stateName') : null;
  useEffect(() => {
    if (watchedState) {
      setDistricts(INDIA_DISTRICTS[watchedState] ?? []);
    } else {
      setDistricts([]);
    }
  }, [watchedState]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[url('/assets/gradient-bg.png')] bg-cover bg-center">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left column - Title and progress (visible on all sizes but styled differently) */}
          <div className="w-full lg:w-auto">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <div className="mx-auto lg:mx-0 w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-full flex items-center justify-center mb-4 lg:mb-6">
                <UserPlus className="w-8 h-8 lg:w-10 lg:h-10 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-4 mb-2">
                <Link to="/member/login">
                  <Button variant="outline" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <h2 className="text-2xl lg:text-4xl font-bold">Member Registration</h2>
              </div>
              <p className="text-muted-foreground mb-3 text-sm lg:text-base">Step {step} of 3</p>

              <div className="w-full max-w-md mx-auto lg:mx-0 bg-white/30 rounded-full h-2 mb-3">
                <div className={`h-2 rounded-full bg-blue-600`} style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }} />
              </div>

              <div className="flex gap-4 justify-center lg:justify-start text-sm lg:text-sm text-blue-600">
                <div className={`flex items-center gap-2 ${step === 1 ? 'font-semibold' : 'text-gray-500'}`}>
                  <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">•</span>
                  <span>Personal</span>
                </div>
                <div className={`flex items-center gap-2 ${step === 2 ? 'font-semibold' : 'text-gray-500'}`}>
                  <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">•</span>
                  <span>Business</span>
                </div>
                <div className={`flex items-center gap-2 ${step === 3 ? 'font-semibold' : 'text-gray-500'}`}>
                  <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">•</span>
                  <span>Location</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Card with form */}
          <div>
            <Card className="w-full shadow-strong border-0">
              <CardHeader className="space-y-2 text-left">
                <CardTitle className="text-2xl font-bold">Registration Form</CardTitle>
                <CardDescription className="text-sm text-gray-500">Please provide accurate information</CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 ? (
                  <form onSubmit={handleSubmitStep1(handleStep1Submit)} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          {profilePicture ? (
                            <AvatarImage src={profilePicture} alt="Profile" />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <User className="w-12 h-12" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <label className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer">
                          <Upload className="w-4 h-4 text-primary-foreground" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Profile Picture (Optional)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name*</Label>
                        <Input id="firstName" placeholder="Enter your first name" {...registerStep1('firstName', { required: 'First name is required' })} />
                        {errorsStep1.firstName && <p className="text-xs text-red-600 mt-1">{errorsStep1.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" {...registerStep1('lastName')} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Phone Number*</Label>
                      <Input id="mobile" placeholder="+91 XXXXXX XXXXX" {...registerStep1('mobile', { required: 'Phone number required', pattern: { value: /^\+?\d{10,15}$/, message: 'Enter a valid phone number' } })} />
                      {errorsStep1.mobile && <p className="text-xs text-red-600 mt-1">{errorsStep1.mobile.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address*</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" {...registerStep1('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />
                      {errorsStep1.email && <p className="text-xs text-red-600 mt-1">{errorsStep1.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" {...registerStep1('dob')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Controller
                          control={controlStep1}
                          name="gender"
                          render={({ field }) => (
                            <Select value={field.value || ''} onValueChange={(v: string) => field.onChange(v)}>
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

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-blue-600 text-white">Next</Button>
                    </div>
                  </form>
                ) : step === 2 ? (
                  <form onSubmit={handleSubmitStep2(handleStep2Submit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="memberType">Member Type*</Label>
                      <Controller
                        control={controlStep2}
                        name="memberType"
                        rules={{ required: 'Member type is required' }}
                        render={({ field }) => (
                          <Select value={field.value || ''} onValueChange={(v: string) => field.onChange(v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select member type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Individual</SelectItem>
                              <SelectItem value="shg">SHG (Self Help Group)</SelectItem>
                              <SelectItem value="fpo">FPO (Farmer Producer Organization)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errorsStep2.memberType && <p className="text-xs text-red-600 mt-1">{errorsStep2.memberType.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input id="businessName" placeholder="Enter your business name" {...registerStep2('businessName')} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="udyamNumber">Udyam Number</Label>
                      <Input id="udyamNumber" placeholder="UDYAMXXXXXXXXXXXX" {...registerStep2('udyamNumber')} />
                      <p className="text-xs text-muted-foreground">Format: UDYAM followed by 12 alphanumeric characters</p>
                      {partialData.memberType && partialData.memberType !== "individual" && (
                        <p className="text-xs text-muted-foreground">Required for SHG/FPO registrations</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Textarea id="businessAddress" placeholder="Enter your business address" {...registerStep2('businessAddress')} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessPincode">Business Pincode</Label>
                        <Input id="businessPincode" placeholder="XXXXXX" {...registerStep2('businessPincode')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessPhone">Business Phone</Label>
                        <Input id="businessPhone" placeholder="+91 XXXXXX XXXXX" {...registerStep2('businessPhone')} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">Business Email</Label>
                      <Input id="businessEmail" type="email" placeholder="business@example.com" {...registerStep2('businessEmail')} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessWebsite">Business Website</Label>
                      <Input id="businessWebsite" placeholder="https://www.example.com" {...registerStep2('businessWebsite')} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea id="businessDescription" placeholder="Describe your business..." {...registerStep2('businessDescription')} />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <IdCard className="w-4 h-4" />
                          Upload ID Proof*
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                             onClick={() => idProofRef.current?.click()}>
                          <FileText className="w-6 h-6 mx-auto text-gray-400" />
                          <p className="text-sm mt-2">Click to upload ID proof</p>
                          <p className="text-xs text-muted-foreground mt-1">Aadhaar, PAN, Passport, etc.</p>
                          <input
                            type="file"
                            ref={idProofRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleIdProofUpload}
                          />
                        </div>
                        {idProof && (
                          <p className="text-xs text-green-600 mt-1">Uploaded: {idProof.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Upload Business Documents
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                             onClick={() => businessDocsRef.current?.click()}>
                          <FileText className="w-6 h-6 mx-auto text-gray-400" />
                          <p className="text-sm mt-2">Click to upload business documents</p>
                          <p className="text-xs text-muted-foreground mt-1">Registration certificate, license, etc.</p>
                          <input
                            type="file"
                            ref={businessDocsRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleBusinessDocsUpload}
                            multiple
                          />
                        </div>
                        {businessDocuments.length > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            Uploaded {businessDocuments.length} document(s)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>Previous</Button>
                      <Button type="submit" className="bg-blue-600 text-white">Next</Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmitStep3(handleStep3Submit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="memberId">Member ID</Label>
                      <Input id="memberId" placeholder="Leave blank to auto-generate" {...registerStep3('memberId')} />
                      <p className="text-xs text-muted-foreground">Leave blank to auto-generate a unique ID</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password*</Label>
                        <Input id="password" type="password" placeholder="Enter Password" {...registerStep3('password', { required: 'Password required', minLength: { value: 6, message: 'At least 6 characters' } })} />
                        {errorsStep3.password && <p className="text-xs text-red-600 mt-1">{errorsStep3.password.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password*</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm Password" {...registerStep3('confirmPassword', { required: 'Please confirm password' })} />
                        {errorsStep3.confirmPassword && <p className="text-xs text-red-600 mt-1">{errorsStep3.confirmPassword.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State*</Label>
                      <Controller
                        control={controlStep3}
                        name="stateName"
                        rules={{ required: 'State is required' }}
                        render={({ field }) => (
                          <Select value={field.value || ''} onValueChange={(v: string) => { field.onChange(v); }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(INDIA_DISTRICTS).map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errorsStep3.stateName && <p className="text-xs text-red-600 mt-1">{errorsStep3.stateName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District*</Label>
                      <Controller
                        control={controlStep3}
                        name="districtName"
                        rules={{ required: 'District is required' }}
                        render={({ field }) => (
                          <Select value={field.value || ''} onValueChange={(v: string) => field.onChange(v)} disabled={!watchedState}>
                            <SelectTrigger>
                              <SelectValue placeholder={districts.length ? 'Select district' : 'Select state first'} />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.length > 0 ? (
                                districts.map((d) => (
                                  <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>No districts available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errorsStep3.districtName && <p className="text-xs text-red-600 mt-1">{errorsStep3.districtName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="block">Block*</Label>
                      <Input id="block" placeholder="Block" {...registerStep3('block', { required: 'Block required' })} />
                      {errorsStep3.block && <p className="text-xs text-red-600 mt-1">{errorsStep3.block.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Residential Address*</Label>
                      <Textarea id="address" placeholder="Complete residential address" {...registerStep3('address', { required: 'Address required' })} />
                      {errorsStep3.address && <p className="text-xs text-red-600 mt-1">{errorsStep3.address.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode*</Label>
                      <Input id="pincode" placeholder="XXXXXX" {...registerStep3('pincode', { required: 'Pincode required' })} />
                      {errorsStep3.pincode && <p className="text-xs text-red-600 mt-1">{errorsStep3.pincode.message}</p>}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Approval Workflow
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your application will go through a multi-level approval process:
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">1</div>
                          <span className="mt-1 text-blue-700">Block Admin</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-blue-300 mx-2"></div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">2</div>
                          <span className="mt-1 text-blue-700">District Admin</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-blue-300 mx-2"></div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">3</div>
                          <span className="mt-1 text-blue-700">State Admin</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-blue-300 mx-2"></div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                          <span className="mt-1 text-green-700">Final Approval</span>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 mt-3">
                        Super Admin can override any level if needed.
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>Previous</Button>
                      <Button type="submit" className="bg-blue-600 text-white">Submit Registration</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRegister;