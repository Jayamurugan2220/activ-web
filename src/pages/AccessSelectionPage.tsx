import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Shield,
  ArrowRight,
  Users,
  Settings
} from "lucide-react";

const AccessSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">ACTIV Portal Access</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select your access level to continue to the appropriate portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Member Access Card */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Member Access</CardTitle>
              <CardDescription>
                For registered members of the ACTIV community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  <span>Access your personal dashboard</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 text-primary mr-2" />
                  <span>Browse marketplace and products</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 text-primary mr-2" />
                  <span>Manage your business listings</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 text-primary mr-2" />
                  <span>Track orders and inventory</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/access/member")}
              >
                Member Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Demo credentials: MEMBER001 / member123
              </div>
            </CardContent>
          </Card>

          {/* Admin Access Card */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</CardTitle>
              <CardDescription>
                For authorized administrators and staff
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Settings className="w-5 h-5 text-secondary mr-2" />
                  <span>Manage member accounts and approvals</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 text-secondary mr-2" />
                  <span>Oversee product catalog</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 text-secondary mr-2" />
                  <span>Monitor system activity</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-5 h-5 text-secondary mr-2" />
                  <span>Configure platform settings</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                size="lg"
                variant="secondary"
                onClick={() => navigate("/access/admin")}
              >
                Admin Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Demo credentials: ADMIN001 / admin123
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium"
              onClick={() => navigate("/member/register")}
            >
              Register as a member
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessSelectionPage;