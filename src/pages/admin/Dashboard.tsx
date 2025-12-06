import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileMenu from "@/components/AdminMobileMenu";
import BlockAdminDashboard from "@/components/admin-dashboard/BlockAdminDashboard";
import DistrictAdminDashboard from "@/components/admin-dashboard/DistrictAdminDashboard";
import StateAdminDashboard from "@/components/admin-dashboard/StateAdminDashboard";
import SuperAdminDashboard from "@/components/admin-dashboard/SuperAdminDashboard";

// Define role-based dashboard configurations
const ROLE_CONFIGS = {
  block: {
    title: "Block Admin Dashboard",
    subtitle: "Block: North Zone",
  },
  district: {
    title: "District Admin Dashboard",
    subtitle: "District: Chennai",
  },
  state: {
    title: "State Admin Dashboard",
    subtitle: "State: Tamil Nadu",
  },
  super: {
    title: "Super Admin Dashboard",
    subtitle: "All India",
  }
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // In a real app, this would come from authentication context
  const [adminRole, setAdminRole] = useState<"block" | "district" | "state" | "super">("block");
  
  const config = ROLE_CONFIGS[adminRole];

  // Render the appropriate dashboard based on role
  const renderDashboard = () => {
    switch (adminRole) {
      case "block":
        return <BlockAdminDashboard />;
      case "district":
        return <DistrictAdminDashboard />;
      case "state":
        return <StateAdminDashboard />;
      case "super":
        return <SuperAdminDashboard />;
      default:
        return <BlockAdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-16 lg:w-56">
        <AdminSidebar />
      </div>

      {/* Mobile menu */}
      <AdminMobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with menu button */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">AU</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Role Selector for Demo */}
            <div className="bg-card shadow-soft p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Switch Role:</span>
                <Button 
                  size="sm" 
                  variant={adminRole === "block" ? "default" : "outline"}
                  onClick={() => setAdminRole("block")}
                >
                  Block Admin
                </Button>
                <Button 
                  size="sm" 
                  variant={adminRole === "district" ? "default" : "outline"}
                  onClick={() => setAdminRole("district")}
                >
                  District Admin
                </Button>
                <Button 
                  size="sm" 
                  variant={adminRole === "state" ? "default" : "outline"}
                  onClick={() => setAdminRole("state")}
                >
                  State Admin
                </Button>
                <Button 
                  size="sm" 
                  variant={adminRole === "super" ? "default" : "outline"}
                  onClick={() => setAdminRole("super")}
                >
                  Super Admin
                </Button>
              </div>
            </div>
            
            {/* Header */}
            <div className="bg-card shadow-soft p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {adminRole === "block" && "BA"}
                    {adminRole === "district" && "DA"}
                    {adminRole === "state" && "SA"}
                    {adminRole === "super" && "SPA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold">{config.title}</h1>
                  <p className="text-sm text-muted-foreground">{config.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Render the appropriate dashboard based on role */}
            {renderDashboard()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;