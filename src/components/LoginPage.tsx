import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  UserCircle, 
  Lock, 
  Eye, 
  EyeOff,
  Chrome,
  Facebook,
  Linkedin
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { generateToken } from "@/utils/jwt";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Try backend auth first
      try {
        const res = await fetch('http://localhost:4000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: formData.identifier, password: formData.password }),
        });

        if (res.ok) {
          const json = await res.json();
          const found = json.user;
          
          // Determine role based on memberId
          const role = found.memberId.startsWith('ADMIN') ? 'block_admin' : 'member';
          
          // Generate JWT token with user info
          const token = generateToken({
            userId: found.id,
            memberId: found.memberId,
            role: role,
            email: found.email
          });
          
          // Use auth context to login
          login(token);
          
          // Store additional user info in localStorage
          localStorage.setItem('userName', found.firstName || found.email || found.memberId);
          localStorage.setItem('memberId', found.memberId);
          navigate('/member/dashboard');
          return;
        }
      } catch (err) {
        // ignore and fall back to localStorage
      }

      const usersJson = localStorage.getItem("users");
      if (!usersJson) {
        toast.error("No registered users found. Please register first.");
        return;
      }

      const users = JSON.parse(usersJson) as Array<any>;
      const found = users.find((u) => u.memberId === formData.identifier);
      if (!found) {
        toast.error("No account found with that Member ID");
        return;
      }

      if (found.password !== formData.password) {
        toast.error("Invalid credentials");
        return;
      }

      // Determine role based on memberId
      const role = found.memberId.startsWith('ADMIN') ? 'block_admin' : 'member';
      
      // Generate JWT token with user info
      const token = generateToken({
        userId: found.id || found.memberId,
        memberId: found.memberId,
        role: role,
        email: found.email
      });
      
      // Use auth context to login
      login(token);
      
      // Set logged-in session info
      localStorage.setItem("userName", found.firstName || found.email || found.memberId);
      localStorage.setItem("memberId", found.memberId);
      navigate("/member/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again later.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Logging in with ${provider}...`);
    // In a real app, this would redirect to the OAuth provider
    console.log(`Social login with ${provider}`);
    
    // For demo purposes, create a mock user and token
    const mockUserId = `social_${provider.toLowerCase()}_${Date.now()}`;
    const token = generateToken({
      userId: mockUserId,
      memberId: `SOCIAL_${mockUserId.toUpperCase()}`,
      role: 'member',
      email: `${provider.toLowerCase()}user@example.com`
    });
    
    // Use auth context to login
    login(token);
    
    // Store user info
    localStorage.setItem('userName', `${provider} User`);
    localStorage.setItem('memberId', `SOCIAL_${mockUserId.toUpperCase()}`);
    navigate("/member/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong gradient-card border-0">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
            <UserCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">ACTIV Portal</CardTitle>
          <CardDescription>Member & Admin Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Member ID or Email</Label>
              <Input 
                id="identifier" 
                name="identifier"
                placeholder="Enter your member ID or email" 
                value={formData.identifier}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Lock className="w-4 h-4 mr-2" />
              Login
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center justify-center"
                onClick={() => handleSocialLogin("Google")}
              >
                <Chrome className="w-5 h-5 text-red-500" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center justify-center"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <Facebook className="w-5 h-5 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center justify-center"
                onClick={() => handleSocialLogin("LinkedIn")}
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">New Member? </span>
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium"
              onClick={() => navigate("/member/register")}
            >
              Register Here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;