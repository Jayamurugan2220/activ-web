import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const SocialCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleSocialLogin = async () => {
      try {
        // Get the provider from the URL
        const provider = window.location.pathname.split("/")[3]; // /auth/callback/:provider
        
        // Get the code/token from search params
        const code = searchParams.get("code");
        const token = searchParams.get("token");
        
        if (!code && !token) {
          throw new Error("No authorization code or token received");
        }
        
        // In a real app, you would exchange the code for an access token
        // and then get user info from the provider's API
        console.log(`Processing ${provider} login with code:`, code);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, we'll simulate a successful login
        const userData = {
          memberId: "social_user_123",
          firstName: "Social",
          lastName: "User",
          email: "social@example.com",
          provider: provider
        };
        
        // Store user data in localStorage
        localStorage.setItem("userName", `${userData.firstName} ${userData.lastName}`);
        localStorage.setItem("memberId", userData.memberId);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("socialProvider", provider);
        
        // Navigate to dashboard
        navigate("/member/dashboard");
      } catch (error) {
        console.error("Social login error:", error);
        // Navigate to login page with error
        navigate("/login?error=social_login_failed");
      }
    };
    
    handleSocialLogin();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong border-0">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Completing Login</h2>
          <p className="text-muted-foreground">
            Please wait while we complete your social login...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialCallback;