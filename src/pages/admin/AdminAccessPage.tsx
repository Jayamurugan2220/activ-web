import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileCheck, 
  Settings, 
  BarChart3, 
  ShoppingCart,
  Package,
  Bell,
  UserCog,
  Shield,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminAccessPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const adminFeatures = [
    {
      id: "dashboard",
      title: "Admin Dashboard",
      description: "Overview of all administrative activities and metrics",
      icon: LayoutDashboard,
      path: "/admin/dashboard"
    },
    {
      id: "members",
      title: "Member Management",
      description: "View, approve, and manage all members in the system",
      icon: Users,
      path: "/admin/members"
    },
    {
      id: "applications",
      title: "Application Approvals",
      description: "Review and approve new membership applications",
      icon: FileCheck,
      path: "/admin/approvals"
    },
    {
      id: "inventory",
      title: "Product Inventory",
      description: "Manage product catalog and inventory tracking",
      icon: Package,
      path: "/admin/inventory"
    },
    {
      id: "leads",
      title: "Lead Management",
      description: "Track and manage business leads and inquiries",
      icon: BarChart3,
      path: "/admin/leads"
    },
    {
      id: "settings",
      title: "System Settings",
      description: "Configure platform settings and categories",
      icon: Settings,
      path: "/admin/settings"
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Portal</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome, {user?.email ? user.email.split('@')[0] : "Administrator"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {user?.role?.replace('_', ' ').toUpperCase() || "ADMIN"}
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1,248</h3>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Applications</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24</h3>
                </div>
                <FileCheck className="h-10 w-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Products</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">864</h3>
                </div>
                <Package className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Administrative Features
            </CardTitle>
            <CardDescription>
              Access all administrative tools and management features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={feature.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      activeTab === feature.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => navigate(feature.path)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                        Access Feature →
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Access Credentials</CardTitle>
            <CardDescription>
              Use these credentials to access the admin portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Admin Login</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Username:</span>
                    <span className="font-mono">ADMIN001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Password:</span>
                    <span className="font-mono">admin123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                    <span className="font-mono">Block Admin</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate("/admin/block/login")}
                >
                  Go to Admin Login
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Member Login</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Username:</span>
                    <span className="font-mono">MEMBER001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Password:</span>
                    <span className="font-mono">member123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                    <span className="font-mono">Member</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => navigate("/login")}
                >
                  Go to Member Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAccessPage;