import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

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

const ApplicationView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [app, setApp] = useState<ApplicationRec | null>(null);
  const role = (localStorage.getItem('role') || 'block_admin') as string;

  const load = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/applications/${id}`);
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setApp(json.application);
    } catch {
      toast.error('Unable to load application');
    }
  };

  useEffect(() => { if (id) load(); }, [id]);

  const patch = async (body: any) => {
    const res = await fetch(`http://localhost:4000/api/applications/${id}` ,{
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Request failed');
    const json = await res.json();
    setApp(json.application);
  };

  const handleApprove = async () => {
    try {
      await patch({ action: 'approve', reviewerRole: role });
      toast.success('Approved');
    } catch {
      toast.error('Approval failed');
    }
  };

  const handleReject = async () => {
    try {
      await patch({ action: 'reject', reviewerRole: role });
      toast.success('Rejected');
    } catch {
      toast.error('Rejection failed');
    }
  };

  const stages: { key: StageKey; label: string }[] = [
    { key: 'block', label: 'Block' },
    { key: 'district', label: 'District' },
    { key: 'state', label: 'State' },
    { key: 'payment', label: 'Ready' },
  ];

  const currentIndex = Math.max(1, Math.min(Number(app?.stage) || 1, app?.stages?.length || 1)) - 1;

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Application Details</h1>
        </div>

        {/* Stage progress */}
        <Card className="shadow-medium border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>{app ? `${Math.min(currentIndex+1, 4)} of 4 stages completed` : 'Loading...'}</span>
              <span>{app?.status === 'Ready for Payment' ? '100%' : `${Math.round(((currentIndex) / 4) * 100)}%`}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-2 bg-blue-600" style={{ width: `${app?.status === 'Ready for Payment' ? 100 : Math.round(((currentIndex) / 4) * 100)}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-4 text-center">
              {stages.map((s, idx) => (
                <div key={s.key} className="flex flex-col items-center gap-1">
                  <span className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-amber-400' : idx < currentIndex ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                  <span className="text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Card */}
        <Card className="shadow-medium border-0 gradient-card">
          <CardHeader>
            <CardTitle>Review</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{app?.profile?.profile?.profile?.firstName || app?.userId || 'Member'}</h2>
                <p className="text-muted-foreground">ID: {id}</p>
              </div>
              <Badge variant="outline" className={
                app?.status === "Ready for Payment" ? "bg-success text-success-foreground" : 
                app?.status === "Rejected" ? "bg-destructive text-destructive-foreground" : 
                "bg-amber-500 text-white"
              }>
                {app?.status === "Ready for Payment" ? "Ready" : app?.status === "Rejected" ? "Rejected" : (app?.stages?.[currentIndex]?.status || 'Holding')}
              </Badge>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleApprove} 
                className="flex-1 bg-success hover:bg-success/90"
                disabled={!app || app.status === 'Ready for Payment' || app.status === 'Rejected'}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button 
                onClick={handleReject} 
                variant="destructive" 
                className="flex-1"
                disabled={!app || app.status === 'Ready for Payment' || app.status === 'Rejected'}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>

            {app?.status === 'Ready for Payment' && (
              <Link to="/member/payment">
                <Button className="w-full">Proceed to Payment</Button>
              </Link>
            )}

            <Button variant="link" onClick={() => navigate(-1)} className="w-full">
              Back To List
            </Button>
          </CardContent>
        </Card>

        {/* Application Details - Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="profile">
            <AccordionTrigger>Profile</AccordionTrigger>
            <AccordionContent>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(app?.profile, null, 2)}</pre>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="stages">
            <AccordionTrigger>Stages</AccordionTrigger>
            <AccordionContent>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(app?.stages, null, 2)}</pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ApplicationView;
