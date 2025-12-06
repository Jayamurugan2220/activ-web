import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Menu, AlertTriangle, ArrowLeft, Crown, UserCog } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileMenu from "@/components/AdminMobileMenu";
import ApprovalCard from "@/components/ui/approval-card";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import notificationService from "@/services/notificationService";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

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
  date: string; // Submission date
  currentLevel: "block" | "district" | "state" | "super";
  escalationLevel?: "district" | "state" | "super";
  escalationDate?: string;
  memberType: "individual" | "shg" | "fpo";
  businessName?: string;
  district: string;
  state: string;
  block?: string; // Added block information
  submissionDate: string; // Track when application was first submitted
  lastActionDate: string; // Track when last action was taken
  escalationHistory?: Array<{
    fromLevel: "block" | "district" | "state";
    toLevel: "district" | "state" | "super";
    date: string;
    reason: string;
  }>;
}

const Approvals = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // To track if Super Admin
  
  // Filter states
  const [filters, setFilters] = useState({
    district: "",
    state: "",
    gender: "",
    category: "",
    status: ""
  });
  
  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is Super Admin
  useEffect(() => {
    // In a real app, this would come from authentication context
    // For demo purposes, we'll simulate this
    const userType = localStorage.getItem('userType') || 'block';
    setIsAdmin(userType === 'super');
  }, []);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/applications');
        const data = await response.json();
        if (data.ok) {
          setApplications(data.applications);
        } else {
          toast.error("Failed to fetch applications");
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Error fetching applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchApplications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle approval action
  const handleApprove = async (id: string) => {
    try {
      const application = applications.find(app => app.id === id);
      if (!application) return;
      
      // Move to next approval level
      let nextLevel: "block" | "district" | "state" | "super" = application.currentLevel;
      if (application.currentLevel === "block") nextLevel = "district";
      else if (application.currentLevel === "district") nextLevel = "state";
      else if (application.currentLevel === "state") nextLevel = "super";
      
      // Prepare update data
      let updateData: Partial<Application>;
      
      // If already at super level or Super Admin overriding, mark as fully approved
      if (application.currentLevel === "super" || isAdmin) {
        updateData = { 
          status: "approved",
          lastActionDate: new Date().toISOString().split('T')[0]
        };
        
        // Send comprehensive approval notification
        notificationService.sendApprovalNotification(
          application.name,
          application.email,
          application.phone,
          "application",
          application.businessName,
          "approved"
        ).catch(error => {
          console.error('Failed to send approval notification:', error);
        });
      } else {
        updateData = { 
          currentLevel: nextLevel, 
          date: new Date().toISOString().split('T')[0],
          lastActionDate: new Date().toISOString().split('T')[0]
        };
      }
      
      // Update in backend
      const response = await fetch(`http://localhost:4000/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      if (data.ok) {
        // Update local state
        setApplications(prev => 
          prev.map(app => app.id === id ? { ...app, ...data.application } : app)
        );
        toast.success(isAdmin ? "Application approved successfully by Super Admin" : "Application approved successfully");
      } else {
        toast.error("Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Error approving application");
    }
  };

  // Handle rejection action
  const handleReject = async (id: string) => {
    try {
      const application = applications.find(app => app.id === id);
      if (!application) return;
      
      // Prepare update data
      const updateData = { 
        status: "rejected", 
        date: new Date().toISOString().split('T')[0],
        lastActionDate: new Date().toISOString().split('T')[0]
      };
      
      // Update in backend
      const response = await fetch(`http://localhost:4000/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      if (data.ok) {
        // Update local state
        setApplications(prev => 
          prev.map(app => app.id === id ? { ...app, ...data.application } : app)
        );
        
        // Send comprehensive rejection notification
        notificationService.sendApprovalNotification(
          application.name,
          application.email,
          application.phone,
          "application",
          application.businessName,
          "rejected"
        ).catch(error => {
          console.error('Failed to send rejection notification:', error);
        });
        
        toast.success("Application rejected successfully");
      } else {
        toast.error("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Error rejecting application");
    }
  };

  // Handle escalation action
  const handleEscalate = async (id: string) => {
    try {
      const application = applications.find(app => app.id === id);
      if (!application) return;
      
      // Determine next escalation level
      let escalationLevel: "district" | "state" | "super" = "district";
      if (application.currentLevel === "block") escalationLevel = "district";
      else if (application.currentLevel === "district") escalationLevel = "state";
      else if (application.currentLevel === "state") escalationLevel = "super";
      
      // Prepare update data
      const updateData = { 
        status: "escalated", 
        escalationLevel,
        escalationDate: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        lastActionDate: new Date().toISOString().split('T')[0]
      };
      
      // Update in backend
      const response = await fetch(`http://localhost:4000/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      if (data.ok) {
        // Update local state
        setApplications(prev => 
          prev.map(app => app.id === id ? { ...app, ...data.application } : app)
        );
        
        // Send escalation notification
        notificationService.sendEscalationNotification(
          application.name,
          application.email,
          application.phone,
          "application",
          application.businessName,
          application.currentLevel,
          escalationLevel
        ).catch(error => {
          console.error('Failed to send escalation notification:', error);
        });
        
        toast.success("Application escalated successfully");
      } else {
        toast.error("Failed to escalate application");
      }
    } catch (error) {
      console.error("Error escalating application:", error);
      toast.error("Error escalating application");
    }
  };

  // Filter applications by status
  const filteredApplications = applications.filter(app => {
    return (
      (filters.district === "" || app.district.toLowerCase().includes(filters.district.toLowerCase())) &&
      (filters.state === "" || app.state.toLowerCase().includes(filters.state.toLowerCase())) &&
      (filters.gender === "" || app.gender.toLowerCase() === filters.gender.toLowerCase()) &&
      (filters.category === "" || app.sector.toLowerCase().includes(filters.category.toLowerCase())) &&
      (filters.status === "" || app.status === filters.status)
    );
  });

  const pendingApplications = filteredApplications.filter(app => app.status === "pending");
  const escalatedApplications = filteredApplications.filter(app => app.status === "escalated");
  const approvedApplications = filteredApplications.filter(app => app.status === "approved");
  const rejectedApplications = filteredApplications.filter(app => app.status === "rejected");

  // Get unique values for filter dropdowns
  const districts = [...new Set(applications.map(app => app.district))];
  const states = [...new Set(applications.map(app => app.state))];
  const genders = [...new Set(applications.map(app => app.gender))];
  const categories = [...new Set(applications.map(app => app.sector))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading applications...</p>
        </div>
      </div>
    );
  }

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
              {isAdmin && (
                <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Super Admin
                </Badge>
              )}
            </div>
            
            {/* Info box about workflow */}
            <Card className="shadow-medium border-0 mb-6 bg-blue-50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <UserCog className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Approval Workflow</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      Applications progress through 4 levels: Block → District → State → Final Approval.
                      {isAdmin && " As Super Admin, you can approve applications at any level."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Filters Section */}
            <Card className="shadow-medium border-0 mb-6">
              <CardHeader>
                <CardTitle>Filter Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">District</label>
                    <Select 
                      value={filters.district} 
                      onValueChange={(value) => setFilters({...filters, district: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Districts</SelectItem>
                        {districts.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">State</label>
                    <Select 
                      value={filters.state} 
                      onValueChange={(value) => setFilters({...filters, state: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All States</SelectItem>
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Gender</label>
                    <Select 
                      value={filters.gender} 
                      onValueChange={(value) => setFilters({...filters, gender: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Genders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Genders</SelectItem>
                        {genders.map(gender => (
                          <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select 
                      value={filters.category} 
                      onValueChange={(value) => setFilters({...filters, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => setFilters({...filters, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({district: "", state: "", gender: "", category: "", status: ""})}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
            
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
                        isAdmin={isAdmin}
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