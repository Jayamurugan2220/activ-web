import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Users, CheckCircle, XCircle, 
  Clock, Home, List, User,
  Menu, TrendingUp, MapPin, UserCheck, AlertTriangle, Package
} from "lucide-react";
import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileMenu from "@/components/AdminMobileMenu";

// Define role-based dashboard configurations
const ROLE_CONFIGS = {
  block: {
    title: "Block Admin Dashboard",
    subtitle: "Block: North Zone",
    stats: [
      { label: "Total Members", value: 248, icon: Users, color: "primary" },
      { label: "Pending Approvals", value: 38, icon: Clock, color: "amber" },
      { label: "Approved Today", value: 12, icon: CheckCircle, color: "success" },
      { label: "Escalated Cases", value: 5, icon: AlertTriangle, color: "blue" }
    ]
  },
  district: {
    title: "District Admin Dashboard",
    subtitle: "District: Chennai",
    stats: [
      { label: "Total Members", value: 1248, icon: Users, color: "primary" },
      { label: "Pending Approvals", value: 87, icon: Clock, color: "amber" },
      { label: "Approved This Week", value: 42, icon: CheckCircle, color: "success" },
      { label: "Block Reports", value: 12, icon: FileText, color: "purple" }
    ]
  },
  state: {
    title: "State Admin Dashboard",
    subtitle: "State: Tamil Nadu",
    stats: [
      { label: "Total Members", value: 8742, icon: Users, color: "primary" },
      { label: "Pending Approvals", value: 156, icon: Clock, color: "amber" },
      { label: "Approved This Month", value: 234, icon: CheckCircle, color: "success" },
      { label: "District Reports", value: 38, icon: FileText, color: "purple" }
    ]
  },
  super: {
    title: "Super Admin Dashboard",
    subtitle: "All India",
    stats: [
      { label: "Total Members", value: 45872, icon: Users, color: "primary" },
      { label: "Pending Approvals", value: 342, icon: Clock, color: "amber" },
      { label: "Approved This Month", value: 1256, icon: CheckCircle, color: "success" },
      { label: "State Reports", value: 28, icon: FileText, color: "purple" }
    ]
  }
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // In a real app, this would come from authentication context
  const [adminRole, setAdminRole] = useState<"block" | "district" | "state" | "super">("block");
  
  const config = ROLE_CONFIGS[adminRole];
  
  // Update stats based on role
  const getStatsForRole = (role: string) => {
    const baseStats = ROLE_CONFIGS[role].stats;
    // Add inventory stats for all roles except block
    if (role !== "block") {
      return [
        ...baseStats,
        { label: "Low Stock Items", value: 24, icon: AlertTriangle, color: "amber" },
        { label: "Total Inventory Value", value: "₹4.2M", icon: Package, color: "green" }
      ];
    }
    return baseStats;
  };
  
  const currentStats = getStatsForRole(adminRole);
  
  const recentApplications = [
    { id: "ACTIV2024001", name: "John Doe", status: "approved", date: "2024-01-15", district: "Chennai", business: "Doe Enterprises" },
    { id: "ACTIV2024002", name: "Jane Smith", status: "pending", date: "2024-01-14", district: "Coimbatore", business: "Green Farms Co-op" },
    { id: "ACTIV2024003", name: "Robert Brown", status: "escalated", date: "2024-01-13", district: "Madurai", business: "Artisan Collective" },
    { id: "ACTIV2024004", name: "Emily Davis", status: "approved", date: "2024-01-12", district: "Bangalore", business: "Healthy Bites Ltd" },
  ];

  // Get color classes for stats cards
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary": return "bg-primary/10 text-primary";
      case "success": return "bg-success/10 text-success";
      case "amber": return "bg-amber-100 text-amber-600";
      case "destructive": return "bg-destructive/10 text-destructive";
      case "blue": return "bg-blue-100 text-blue-600";
      case "purple": return "bg-purple-100 text-purple-600";
      default: return "bg-primary/10 text-primary";
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
          <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Role Selector for Demo */}
            <div className="bg-card shadow-soft p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-2 mb-3">
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentStats.map((stat, index) => {
                const IconComponent = stat.icon;
                const colorClasses = getColorClasses(stat.color);
                
                return (
                  <Card key={index} className="shadow-medium border-0">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts and Reports Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Membership Growth
                  </CardTitle>
                  <CardDescription>Monthly membership trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">Membership Growth Chart Visualization</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Geographic Distribution */}
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>Members by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">Geographic Distribution Map Visualization</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Recent Applications
                    </CardTitle>
                    <CardDescription>Latest member applications</CardDescription>
                  </div>
                  <Link to="/admin/applications">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {app.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-muted-foreground">{app.id}</p>
                          <p className="text-sm text-muted-foreground">{app.business}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="hidden sm:block">
                          {app.district}
                        </Badge>
                        <Badge 
                          variant={app.status === "approved" ? "default" : app.status === "escalated" ? "destructive" : "outline"}
                          className={app.status === "approved" ? "bg-success" : app.status === "escalated" ? "bg-blue-500" : ""}
                        >
                          {app.status === "approved" ? "Approved" : app.status === "escalated" ? "Escalated" : "Pending"}
                        </Badge>
                        <Link to={`/admin/application/${app.id}`}>
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;