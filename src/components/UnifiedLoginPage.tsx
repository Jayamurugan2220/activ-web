import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, Shield, Lock, Globe, Facebook, Linkedin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authenticateAdmin, setAdminSession, isAdminIdForRole } from "@/utils/authService";

export default function UnifiedLoginPage() {
  const [userType, setUserType] = useState<"member" | "admin">("member");
  const [adminCategory, setAdminCategory] = useState<"block" | "district" | "state" | "super">("block");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Map admin category to role
  const getRoleFromCategory = (category: string): string => {
    switch (category) {
      case "block": return "block_admin";
      case "district": return "district_admin";
      case "state": return "state_admin";
      case "super": return "super_admin";
      default: return "member";
    }
  };

  // Get default credentials for each admin category
  const getDefaultCredentials = (category: string): { id: string, password: string } => {
    switch (category) {
      case "block":
        return { id: "block_admin_001", password: "block_pass_123" };
      case "district":
        return { id: "district_admin_001", password: "district_pass_123" };
      case "state":
        return { id: "state_admin_001", password: "state_pass_123" };
      case "super":
        return { id: "super_admin_001", password: "super_pass_123" };
      default:
        return { id: "", password: "" };
    }
  };

  // Handle social login
  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    toast.info(`Social login with ${provider} would be implemented here`);
  };

  // Handle admin login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!identifier || !password) {
      toast.error("Please enter both ID and password");
      setIsLoading(false);
      return;
    }

    try {
      const result = await authenticateAdmin(identifier, password);
      
      if (result.success) {
        // Check if this admin ID is authorized for the selected admin role
        const expectedRole = getRoleFromCategory(adminCategory);
        if (result.role === expectedRole || isAdminIdForRole(identifier, expectedRole)) {
          // Set admin session flags
          setAdminSession(identifier, expectedRole, `${expectedRole.split('_')[0].charAt(0).toUpperCase() + expectedRole.split('_')[0].slice(1)} Admin ${identifier.split('_')[2]}`);
          
          toast.success("Login successful!");
          
          // Navigate to appropriate dashboard
          const adminPath = expectedRole === "block_admin" ? "/admin/block/dashboard" : "/admin/dashboard";
          navigate(adminPath);
        } else {
          toast.error(`Access denied. This account is not authorized for ${expectedRole.split('_')[0].charAt(0).toUpperCase() + expectedRole.split('_')[0].slice(1)} Admin access.`);
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Unable to reach backend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle member login
  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Try backend login first
      try {
        const res = await fetch('http://localhost:4000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
        });

        if (res.ok) {
          const json = await res.json();
          const found = json.user;
          
          // Store user profile data
          localStorage.setItem('userName', found.firstName || found.email || found.memberId);
          localStorage.setItem('memberId', found.memberId);
          if (found && found.role) localStorage.setItem('role', found.role);
          localStorage.setItem('isLoggedIn', 'true');
          
          const isAdmin = ['super_admin','state_admin','district_admin','block_admin'].includes(found.role);
          const adminPath = found.role === 'block_admin' ? '/admin/block/dashboard' : '/admin/dashboard';
          navigate(isAdmin ? adminPath : '/member/dashboard');
          return;
        }
      } catch (err) {
        // no backend — fallback to localStorage
      }

      const usersJson = localStorage.getItem('users');
      if (!usersJson) {
        toast.error('No registered users found. Please register first.');
        setIsLoading(false);
        return;
      }

      const users = JSON.parse(usersJson) as Array<any>;
      // allow login by email or memberId
      const found = users.find((u) => u.email === identifier || u.memberId === identifier);
      if (!found) {
        toast.error('No account matches that email or member ID');
        setIsLoading(false);
        return;
      }

      if (found.password !== password) {
        toast.error('Invalid credentials');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('userName', found.firstName || found.email || found.memberId);
      localStorage.setItem('memberId', found.memberId);
      if (found && found.role) localStorage.setItem('role', found.role);
      localStorage.setItem('isLoggedIn', 'true');
      
      const isAdminFallback = ['super_admin','state_admin','district_admin','block_admin'].includes(found.role);
      const adminPath = found.role === 'block_admin' ? '/admin/block/dashboard' : '/admin/dashboard';
      navigate(isAdminFallback ? adminPath : '/member/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = userType === "admin" ? handleAdminLogin : handleMemberLogin;

  // if already logged in, redirect to dashboard
  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn');
    const isAdminLogged = localStorage.getItem('isAdminLoggedIn');
    if (logged === 'true' || isAdminLogged === 'true') {
      const role = localStorage.getItem('role') || '';
      const adminPath = role === 'block_admin' ? '/admin/block/dashboard' : '/admin/dashboard';
      navigate(role.endsWith('_admin') ? adminPath : '/member/dashboard');
    }
  }, [navigate]);

  // Fill default credentials when admin category changes
  useEffect(() => {
    if (userType === "admin") {
      const creds = getDefaultCredentials(adminCategory);
      setIdentifier(creds.id);
      setPassword(creds.password);
    }
  }, [adminCategory, userType]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong gradient-card border-0">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
            {userType === "admin" ? (
              <Shield className="w-10 h-10 text-secondary-foreground" />
            ) : (
              <UserCircle className="w-10 h-10 text-secondary-foreground" />
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {userType === "admin" ? "Admin Login" : "Member Login"}
          </CardTitle>
          <CardDescription>
            {userType === "admin" 
              ? `Access ${adminCategory.charAt(0).toUpperCase() + adminCategory.slice(1)} Administrator Portal` 
              : "Access your ACTIV member portal"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={userType === "member" ? "default" : "outline"}
                className="w-full"
                onClick={() => setUserType("member")}
              >
                Member Login
              </Button>
              <Button
                variant={userType === "admin" ? "default" : "outline"}
                className="w-full"
                onClick={() => setUserType("admin")}
              >
                Admin Login
              </Button>
            </div>

            {userType === "admin" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-category">Admin Category</Label>
                  <Select value={adminCategory} onValueChange={(value: "block" | "district" | "state" | "super") => setAdminCategory(value)}>
                    <SelectTrigger id="admin-category">
                      <SelectValue placeholder="Select admin category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block">Block Admin</SelectItem>
                      <SelectItem value="district">District Admin</SelectItem>
                      <SelectItem value="state">State Admin</SelectItem>
                      <SelectItem value="super">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Social Media Login Buttons */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("Google")}
              >
                <Globe className="w-4 h-4 text-red-500" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <Facebook className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("LinkedIn")}
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">
                {userType === "admin" ? `${adminCategory.charAt(0).toUpperCase() + adminCategory.slice(1)} Admin ID` : "Member ID or Email"}
              </Label>
              <Input
                id="identifier"
                placeholder={userType === "admin" ? `Enter your ${adminCategory} admin ID` : "Enter your member ID or email"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {userType === "member" && (
              <div className="flex justify-end">
                <Link to="/member/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? "Signing In..." : `Login as ${userType === "admin" ? `${adminCategory.charAt(0).toUpperCase() + adminCategory.slice(1)} Admin` : "Member"}`}
            </Button>
          </form>
          
          {userType === "admin" && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Default Credentials:</h3>
              <ul className="text-xs space-y-1">
                <li>{getDefaultCredentials(adminCategory).id} / {getDefaultCredentials(adminCategory).password}</li>
                {adminCategory === "block" && <li>block_admin_002 / block_secure_456</li>}
              </ul>
            </div>
          )}
          
          {userType === "member" && (
            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">New Member? </span>
              <Link to="/member/register" className="text-primary hover:underline font-medium">
                Register Here
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}