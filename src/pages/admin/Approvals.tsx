import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const role = (localStorage.getItem('role') || 'block_admin') as string;

  const stageByRole: Record<string, StageKey> = {
    super_admin: 'payment',
    state_admin: 'state',
    district_admin: 'district',
    block_admin: 'block',
    member: 'block',
  };

  // Helpers to compute current stage and bucket by status
  const desiredStage: StageKey = stageByRole[role] ?? 'block';
  const getCurrentStage = (a: ApplicationRec): Stage | null => {
    const idx = Math.max(1, Math.min(Number(a.stage) || 1, (a.stages || []).length)) - 1;
    return a.stages?.[idx] ?? null;
  };

  const buckets = useMemo(() => {
    const pending: ApplicationRec[] = [];
    const approved: ApplicationRec[] = [];
    const rejected: ApplicationRec[] = [];
    const all: ApplicationRec[] = [...applications];
    for (const a of applications) {
      const st = getCurrentStage(a);
      if (a.status === 'Rejected') {
        rejected.push(a);
        continue;
      }
      if (a.status === 'Ready for Payment') {
        // treat as approved for listing purposes
        approved.push(a);
        continue;
      }
      if (st?.key === desiredStage) {
        if (st.status === 'Under Review') pending.push(a);
        else if (st.status === 'Approved') approved.push(a);
        else if (st.status === 'Rejected') rejected.push(a);
      }
    }
    return { pending, approved, rejected, all };
  }, [applications, desiredStage]);

  const stats = useMemo(() => ({
    total: applications.length,
    pending: buckets.pending.length,
    approved: buckets.approved.length,
    rejected: buckets.rejected.length,
  }), [applications.length, buckets.pending.length, buckets.approved.length, buckets.rejected.length]);

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
            {/* Top statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Total</CardTitle>
                  <CardDescription className="text-3xl font-bold">{stats.total}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Pending</CardTitle>
                  <CardDescription className="text-3xl font-bold flex items-center gap-2"><Clock className="w-5 h-5" />{stats.pending}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Approved</CardTitle>
                  <CardDescription className="text-3xl font-bold flex items-center gap-2"><CheckCircle className="w-5 h-5" />{stats.approved}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Rejected</CardTitle>
                  <CardDescription className="text-3xl font-bold flex items-center gap-2"><XCircle className="w-5 h-5" />{stats.rejected}</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Button variant={tab === 'pending' ? 'default' : 'outline'} onClick={() => setTab('pending')}>Pending <Badge className="ml-2" variant="secondary">{stats.pending}</Badge></Button>
              <Button variant={tab === 'approved' ? 'default' : 'outline'} onClick={() => setTab('approved')}>Approved <Badge className="ml-2" variant="secondary">{stats.approved}</Badge></Button>
              <Button variant={tab === 'rejected' ? 'default' : 'outline'} onClick={() => setTab('rejected')}>Rejected <Badge className="ml-2" variant="secondary">{stats.rejected}</Badge></Button>
              <Button variant={tab === 'all' ? 'default' : 'outline'} onClick={() => setTab('all')}>All <Badge className="ml-2" variant="secondary">{stats.total}</Badge></Button>
            </div>

            {/* Tab content */}
            {tab === 'pending' && (
              <div className="space-y-6">
                {buckets.pending.map(app => (
                  <ApprovalCard
                    key={app.id}
                    member={{
                      id: app.id,
                      name: app.profile?.profile?.profile?.firstName || app.userId,
                      email: app.profile?.profile?.profile?.email || '',
                      role: role,
                      gender: '', sector: '', phone: ''
                    }}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
                {buckets.pending.length === 0 && (
                  <Card className="shadow-medium border-0">
                    <CardContent className="p-6 text-center text-muted-foreground">No pending applications.</CardContent>
                  </Card>
                )}
              </div>
            )}

            {tab !== 'pending' && (
              <Card className="shadow-medium border-0">
                <CardContent>
                  <div className="space-y-4">
                    {(tab === 'approved' ? buckets.approved : tab === 'rejected' ? buckets.rejected : buckets.all).map(app => {
                      const stg = getCurrentStage(app);
                      const statusLabel = app.status === 'Rejected' ? 'Rejected' : (app.status === 'Ready for Payment' ? 'Ready for Payment' : (stg?.status || ''));
                      const isApproved = statusLabel === 'Approved' || statusLabel === 'Ready for Payment';
                      const isRejected = statusLabel === 'Rejected';
                      return (
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
                              variant={isApproved ? 'default' : isRejected ? 'destructive' : 'secondary'}
                              className={isApproved ? 'bg-success' : isRejected ? 'bg-destructive' : ''}
                            >
                              {isApproved && <CheckCircle className="w-4 h-4 mr-1" />}
                              {isRejected && <XCircle className="w-4 h-4 mr-1" />}
                              {statusLabel || '—'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                    {(tab === 'approved' ? buckets.approved : tab === 'rejected' ? buckets.rejected : buckets.all).length === 0 && (
                      <div className="p-6 text-center text-muted-foreground">No records.</div>
                    )}
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
