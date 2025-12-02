import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Menu, AlertTriangle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileMenu from "@/components/AdminMobileMenu";
import ApprovalCard from "@/components/ui/approval-card";
import { Toaster } from "@/components/ui/toaster";

// Define TypeScript interfaces
interface Application {
  id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  sector: string;
  phone: string;
  status: "approved" | "pending" | "rejected" | "escalated";
  date: string;
  currentLevel: "block" | "district" | "state" | "super";
  escalationLevel?: "district" | "state" | "super";
  escalationDate?: string;
  memberType: "individual" | "shg" | "fpo";
  businessName?: string;
  district: string;
  state: string;
}

const Approvals = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Updated applications data with more detailed information
  const [applications, setApplications] = useState<Application[]>([
    { 
      id: "ACTIV2024001", 
      name: "John Doe", 
      email: "john.doe@example.com",
      role: "Member",
      gender: "Male",
      sector: "Manufacturing",
      phone: "+91 98765 43210",
      status: "pending", 
      date: "2024-01-15",
      currentLevel: "block",
      memberType: "individual",
      businessName: "Doe Enterprises",
      district: "Chennai",
      state: "Tamil Nadu"
    },
    { 
      id: "ACTIV2024002", 
      name: "Jane Smith", 
      email: "jane.smith@example.com",
      role: "Member",
      gender: "Female",
      sector: "Agriculture",
      phone: "+91 98765 43211",
      status: "pending", 
      date: "2024-01-14",
      currentLevel: "district",
      memberType: "fpo",
      businessName: "Green Farms Co-op",
      district: "Coimbatore",
      state: "Tamil Nadu"
    },
    { 
      id: "ACTIV2024003", 
      name: "Robert Brown", 
      email: "robert.brown@example.com",
      role: "Member",
      gender: "Male",
      sector: "Handicrafts",
      phone: "+91 98765 43212",
      status: "escalated", 
      date: "2024-01-10",
      currentLevel: "district",
      escalationLevel: "state",
      escalationDate: "2024-01-12",
      memberType: "shg",
      businessName: "Artisan Collective",
      district: "Madurai",
      state: "Tamil Nadu"
    },
    { 
      id: "ACTIV2024004", 
      name: "Emily Davis", 
      email: "emily.davis@example.com",
      role: "Member",
      gender: "Female",
      sector: "Food Processing",
      phone: "+91 98765 43213",
      status: "approved", 
      date: "2024-01-12",
      currentLevel: "state",
      memberType: "individual",
      businessName: "Healthy Bites Ltd",
      district: "Bangalore",
      state: "Karnataka"
    },
    { 
      id: "ACTIV2024005", 
      name: "Michael Wilson", 
      email: "michael.wilson@example.com",
      role: "Member",
      gender: "Male",
      sector: "Textiles",
      phone: "+91 98765 43214",
      status: "rejected", 
      date: "2024-01-11",
      currentLevel: "block",
      memberType: "fpo",
      businessName: "Weavers United",
      district: "Erode",
      state: "Tamil Nadu"
    },
  ]);

  // Handle approval action
  const handleApprove = (id: string) => {
    setApplications(prev => 
      prev.map(app => {
        if (app.id === id) {
          // Move to next approval level
          let nextLevel: "block" | "district" | "state" | "super" = app.currentLevel;
          if (app.currentLevel === "block") nextLevel = "district";
          else if (app.currentLevel === "district") nextLevel = "state";
          else if (app.currentLevel === "state") nextLevel = "super";
          
          // If already at super level, mark as fully approved
          if (app.currentLevel === "super") {
            return { ...app, status: "approved" };
          }
          
          return { ...app, currentLevel: nextLevel, date: new Date().toISOString().split('T')[0] };
        }
        return app;
      })
    );
  };

  // Handle rejection action
  const handleReject = (id: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: "rejected", date: new Date().toISOString().split('T')[0] } : app
      )
    );
  };

  // Handle escalation action
  const handleEscalate = (id: string) => {
    setApplications(prev => 
      prev.map(app => {
        if (app.id === id) {
          // Determine next escalation level
          let escalationLevel: "district" | "state" | "super" = "district";
          if (app.currentLevel === "block") escalationLevel = "district";
          else if (app.currentLevel === "district") escalationLevel = "state";
          else if (app.currentLevel === "state") escalationLevel = "super";
          
          return { 
            ...app, 
            status: "escalated", 
            escalationLevel,
            escalationDate: new Date().toISOString().split('T')[0],
            date: new Date().toISOString().split('T')[0]
          };
        }
        return app;
      })
    );
  };

  // Filter applications by status
  const pendingApplications = applications.filter(app => app.status === "pending");
  const escalatedApplications = applications.filter(app => app.status === "escalated");
  const approvedApplications = applications.filter(app => app.status === "approved");
  const rejectedApplications = applications.filter(app => app.status === "rejected");

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
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/dashboard")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Approvals</h1>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">AU</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="w-full max-w-6xl mx-auto">
            {/* Desktop header with back button */}
            <div className="hidden md:flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate("/admin/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Multi-Level Approval Workflow</h1>
            </div>
            
            {/* Approval Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="shadow-medium border-0">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-amber-600">{pendingApplications.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-medium border-0">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Escalated</p>
                      <p className="text-2xl font-bold text-blue-600">{escalatedApplications.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-medium border-0">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold text-success">{approvedApplications.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-medium border-0">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                      <p className="text-2xl font-bold text-destructive">{rejectedApplications.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pending Applications */}
            {pendingApplications.length > 0 && (
              <Card className="shadow-medium border-0 mb-6">
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingApplications.map(app => (
                      <ApprovalCard 
                        key={app.id} 
                        member={app} 
                        onApprove={handleApprove} 
                        onReject={handleReject} 
                        onEscalate={handleEscalate}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Escalated Applications */}
            {escalatedApplications.length > 0 && (
              <Card className="shadow-medium border-0 mb-6">
                <CardHeader>
                  <CardTitle>Escalated Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escalatedApplications.map(app => (
                      <div key={app.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border-l-4 border-blue-500">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {app.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">{app.id}</p>
                              <Badge variant="outline" className="text-xs">
                                {app.escalationLevel} Level
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{app.businessName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Escalated
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => handleApprove(app.id)}>
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Application History */}
            {(approvedApplications.length > 0 || rejectedApplications.length > 0) && (
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle>Application History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...approvedApplications, ...rejectedApplications]
                      .map((app) => (
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
                              <p className="text-sm text-muted-foreground">{app.businessName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "outline"}
                              className={app.status === "approved" ? "bg-success" : app.status === "rejected" ? "bg-destructive" : ""}
                            >
                              {app.status === "approved" && <CheckCircle className="w-4 h-4 mr-1" />}
                              {app.status === "rejected" && <XCircle className="w-4 h-4 mr-1" />}
                              {app.status === "pending" && <Clock className="w-4 h-4 mr-1" />}
                              {app.status === "escalated" && <AlertTriangle className="w-4 h-4 mr-1" />}
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Add Toaster for notifications */}
        <Toaster />
      </div>
    </div>
  );
};

export default Approvals;