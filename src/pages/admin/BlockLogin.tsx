import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { toast } from "sonner";

const BlockLogin = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: memberId, password }),
      });

      if (!res.ok) {
        const msg = (await res.json().catch(() => ({})))?.error || "Login failed";
        toast.error(msg);
        return;
      }

      const json = await res.json();
      const found = json.user;

      // Set admin session flags
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminId", found.memberId || memberId);
      localStorage.setItem("userName", found.firstName || found.email || found.memberId || memberId);
      if (found.role) localStorage.setItem("role", found.role);

      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Unable to reach backend. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong gradient-card border-0">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
            <Shield className="w-10 h-10 text-secondary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Block Admin Login</CardTitle>
          <CardDescription>Access Block Administrator Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="memberId">Admin ID</Label>
              <Input
                id="memberId"
                placeholder="Enter your admin ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" variant="default">
              <Lock className="w-4 h-4 mr-2" />
              Login as Block Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockLogin;
