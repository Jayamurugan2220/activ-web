import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const SuperAdminGenerate = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [registrationRequests, setRegistrationRequests] = useState([]);

  // Fetch registration requests
  useEffect(() => {
    fetchRegistrationRequests();
  }, []);

  const fetchRegistrationRequests = async () => {
    try {
      // In a real app, this would fetch from your backend
      // For now, we'll use mock data
      const mockRequests = [
        {
          id: 1,
          fullName: "John Smith",
          email: "john.smith@example.com",
          phone: "+91 9876543210",
          state: "Maharashtra",
          organization: "State Health Department",
          position: "Director",
          reason: "Need access to manage state-level health programs",
          requestDate: "2024-01-15T10:30:00Z",
          status: "pending"
        },
        {
          id: 2,
          fullName: "Priya Sharma",
          email: "priya.sharma@example.com",
          phone: "+91 9876543211",
          state: "Karnataka",
          organization: "State Education Board",
          position: "Coordinator",
          reason: "Require access to update educational policies",
          requestDate: "2024-01-16T14:45:00Z",
          status: "pending"
        }
      ];
      setRegistrationRequests(mockRequests);
    } catch (error) {
      console.error("Failed to fetch registration requests:", error);
      toast.error("Failed to load registration requests");
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      // In a real app, this would send a request to your backend
      setRegistrationRequests(prev => 
        prev.map(req => req.id === requestId ? {...req, status: 'approved'} : req)
      );
      toast.success("Registration request approved!");
    } catch (error) {
      console.error("Failed to approve request:", error);
      toast.error("Failed to approve registration request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      // In a real app, this would send a request to your backend
      setRegistrationRequests(prev => 
        prev.map(req => req.id === requestId ? {...req, status: 'rejected'} : req)
      );
      toast.success("Registration request rejected");
    } catch (error) {
      console.error("Failed to reject request:", error);
      toast.error("Failed to reject registration request");
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`New ${role} account created successfully!`);
    // Reset form
    setUsername("");
    setPassword("");
    setRole("");
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Super Admin Panel</h1>
            <p className="text-muted-foreground">Create new administrator accounts</p>
          </div>
        </div>

        <Card className="shadow-strong gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Generate Admin User
            </CardTitle>
            <CardDescription>
              Create new accounts for Block, District, or State administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username / ID *</Label>
                <Input
                  id="username"
                  placeholder="Enter admin username or ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used as the login ID for the new administrator
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use a strong password with at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Designation / Role *</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select administrator role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="state">State Admin</SelectItem>
                    <SelectItem value="district">District Admin</SelectItem>
                    <SelectItem value="block">Block Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose the appropriate administrative level
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <UserPlus className="w-4 h-4 mr-2" />
                Generate User
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Pending Registration Requests */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Pending State Admin Registrations
            </CardTitle>
            <CardDescription>
              Review and approve/reject state admin registration requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationRequests.filter(req => req.status === 'pending').length > 0 ? (
              <div className="space-y-4">
                {registrationRequests
                  .filter(req => req.status === 'pending')
                  .map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{request.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{request.position} at {request.organization}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium">State</p>
                          <p>{request.state}</p>
                        </div>
                        <div>
                          <p className="font-medium">Contact</p>
                          <p>{request.email}</p>
                          <p>{request.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="font-medium">Reason for Request</p>
                          <p>{request.reason}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No pending registration requests</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recently Approved/Rejected Requests */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="text-lg">Recent Registration Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            {registrationRequests.filter(req => req.status !== 'pending').length > 0 ? (
              <div className="space-y-3">
                {registrationRequests
                  .filter(req => req.status !== 'pending')
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{request.fullName}</p>
                        <p className="text-sm text-muted-foreground">{request.state} - {request.organization}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.status === 'approved' ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>No recent decisions</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Admins */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="text-lg">Recently Created Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { username: "block_admin_001", role: "Block Admin", date: "2024-01-15" },
                { username: "district_admin_002", role: "District Admin", date: "2024-01-14" },
                { username: "state_admin_001", role: "State Admin", date: "2024-01-13" },
              ].map((admin, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{admin.username}</p>
                    <p className="text-sm text-muted-foreground">{admin.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{admin.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminGenerate;
