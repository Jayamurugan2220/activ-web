import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileMenu from "@/components/AdminMobileMenu";
import ApprovalCard from "@/components/ui/approval-card";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";

// Backend application types
type StageKey = 'block' | 'district' | 'state' | 'payment';
interface Stage { id: number; key: StageKey; title: string; reviewer: string; status: string; reviewDate: string | null; notes: string; }
interface ApplicationRec {
  id: string;
  userId: string;
  submittedAt: string;
  status: string; // 'Under Review' | 'Rejected' | 'Ready for Payment'
  stage: number; // 1-based index
  stages: Stage[];
  profile?: any;
}

const Approvals = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationRec[]>([]);
  const role = (localStorage.getItem('role') || 'block_admin') as string;

  const stageByRole: Record<string, StageKey> = {
    super_admin: 'payment',
    state_admin: 'state',
    district_admin: 'district',
    block_admin: 'block',
    member: 'block',
  };

  const load = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/applications');
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setApplications(json.applications || []);
    } catch {
      toast.error('Unable to fetch applications');
    }
  };

  useEffect(() => { load(); }, []);

  const patch = async (id: string, body: any) => {
    const res = await fetch(`http://localhost:4000/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Request failed');
    const json = await res.json();
    setApplications(prev => prev.map(a => (a.id === id ? json.application : a)));
  };

  const handleApprove = async (id: string) => {
    try {
      await patch(id, { action: 'approve', reviewerRole: role });
      toast.success('Approved');
    } catch {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await patch(id, { action: 'reject', reviewerRole: role });
      toast.success('Rejected');
    } catch {
      toast.error('Rejection failed');
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
          <h1 className="text-xl font-bold">Approvals</h1>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">AU</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Approvals</h1>
            {/* Display applications for current admin stage */}
            <div className="space-y-6">
              {applications
                .filter(app => {
                  const desired = stageByRole[role];
                  if (desired === 'payment') return app.status === 'Ready for Payment';
                  const idx = Math.max(1, Math.min(Number(app.stage) || 1, (app.stages || []).length)) - 1;
                  const stg = app.stages?.[idx];
                  return stg?.key === desired && stg.status === 'Under Review';
                })
                .map(app => (
                  <ApprovalCard 
                    key={app.id} 
                    member={{
                      id: app.id,
                      name: app.profile?.profile?.profile?.firstName || app.userId,
                      email: app.profile?.profile?.profile?.email || '',
                      role: role,
                      gender: '', sector: '', phone: '',
                      status: 'pending', date: app.submittedAt,
                    }} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                  />
                ))
              }
            </div>
            {/* Display completed items */}
            {applications.some(app => app.status === 'Rejected' || app.status === 'Ready for Payment') && (
              <Card className="shadow-medium border-0 mt-6">
                <CardHeader>
                  <CardTitle>Application History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications
                      .filter(app => app.status === 'Rejected' || app.status === 'Ready for Payment')
                      .map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {(app.profile?.profile?.profile?.firstName || app.userId || 'U').slice(0,2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{app.profile?.profile?.profile?.firstName || app.userId}</p>
                              <p className="text-sm text-muted-foreground">{app.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={app.status === 'Ready for Payment' ? 'default' : 'destructive'}
                              className={app.status === 'Ready for Payment' ? 'bg-success' : 'bg-destructive'}
                            >
                              {app.status === 'Ready for Payment' && <CheckCircle className="w-4 h-4 mr-1" />}
                              {app.status === 'Rejected' && <XCircle className="w-4 h-4 mr-1" />}
                              {app.status}
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
