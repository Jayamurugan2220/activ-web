import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  ShoppingCart, 
  Package, 
  Bell,
  CreditCard,
  Calendar,
  Share2,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MemberAccessPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const memberFeatures = [
    {
      id: "dashboard",
      title: "Member Dashboard",
      description: "Overview of your activities and notifications",
      icon: User,
      path: "/member/dashboard"
    },
    {
      id: "marketplace",
      title: "Marketplace",
      description: "Browse products and services from other members",
      icon: ShoppingCart,
      path: "/marketplace/b2b"
    },
    {
      id: "seller",
      title: "Seller Dashboard",
      description: "Manage your products and business listings",
      icon: Package,
      path: "/member/seller/dashboard"
    },
    {
      id: "orders",
      title: "My Orders",
      description: "View and manage your orders and purchases",
      icon: CreditCard,
      path: "/marketplace/orders"
    },
    {
      id: "inventory",
      title: "Inventory Tracking",
      description: "Track your product inventory and stock levels",
      icon: BarChart3,
      path: "/member/inventory"
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage your alerts and communication preferences",
      icon: Bell,
      path: "/notifications"
    },
    {
      id: "events",
      title: "Events Calendar",
      description: "View upcoming events and activities",
      icon: Calendar,
      path: "/member/events"
    },
    {
      id: "sharing",
      title: "WhatsApp Sharing",
      description: "Share your catalog with customers via WhatsApp",
      icon: Share2,
      path: "/member/whatsapp/share"
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Member Portal</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome, {user?.email ? user.email.split('@')[0] : "Member"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              MEMBER
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Orders</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">12</h3>
                </div>
                <ShoppingCart className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Products</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24</h3>
                </div>
                <Package className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notifications</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">5</h3>
                </div>
                <Bell className="h-10 w-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Events</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3</h3>
                </div>
                <Calendar className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Member Features
            </CardTitle>
            <CardDescription>
              Access all member tools and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {memberFeatures.map((feature) => {
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
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-primary/10 mb-3">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {feature.description}
                        </p>
                        <Button variant="link" className="mt-3 p-0 h-auto text-primary">
                          Access →
                        </Button>
                      </div>
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
              Use these credentials to access the member portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full mt-4" 
                  onClick={() => navigate("/login")}
                >
                  Go to Member Login
                </Button>
              </div>
              
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
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => navigate("/admin/block/login")}
                >
                  Go to Admin Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberAccessPage;