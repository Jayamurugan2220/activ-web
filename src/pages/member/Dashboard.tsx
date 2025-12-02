import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user name from localStorage (set during login/registration)
    const storedUserName = localStorage.getItem("userName");
    const hasVisitedBefore = localStorage.getItem("hasVisitedDashboard");

    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (hasVisitedBefore) {
      setIsFirstVisit(false);
    } else {
      // Mark first visit as complete
      localStorage.setItem("hasVisitedDashboard", "true");
    }
  }, []);

  const computeProfileCompletion = (): number => {
    // Load profile from either userProfile or registrationData
    const raw = localStorage.getItem("userProfile") || localStorage.getItem("registrationData");
    if (!raw) return 0;
    try {
      const p = JSON.parse(raw);
      const fields = [
        p.firstName,
        p.lastName,
        p.email,
        p.phone,
        p.dateOfBirth,
        p.gender,
        p.state,
        p.district,
        p.block,
        p.address,
      ];
      const filled = fields.filter((f: any) => !!f && `${f}`.trim() !== "").length;
      return Math.round((filled / fields.length) * 100) || 0;
    } catch (e) {
      return 0;
    }
  };

  const completionPercentage = computeProfileCompletion();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-16 lg:w-56">
        <Sidebar />
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">SD</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="w-full max-w-6xl mx-auto">
            {/* Welcome section - adjusted for mobile */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold hidden md:block">
                {isFirstVisit ? "Welcome" : "Welcome back"}, {userName || "Member"}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {userName ? userName.split(" ").map(n => n[0]).join("") : "SD"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold md:text-2xl">
                    {isFirstVisit ? "Welcome" : "Welcome back"}, {userName || "Member"}
                  </h2>
                  <p className="text-muted-foreground">TechCorp Solution</p>
                </div>
              </div>
            </div>

            {/* Search bar - improved mobile responsiveness */}
            <div className="mb-6">
              <div className="w-full">
                <input
                  aria-label="Search by location"
                  placeholder="Search by location..."
                  className="w-full border border-gray-200 rounded-full px-4 py-2 shadow-sm bg-white"
                />
              </div>
            </div>

            {/* Profile completion card - optimized spacing */}
            <Card className="shadow-medium border-0 w-full mb-6">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Complete Your Profile</h3>
                    <p className="text-sm text-blue-600 mt-1">{completionPercentage}% completed</p>
                    <p className="text-sm text-muted-foreground mt-2">Unlock all features by completing your profile.</p>

                    <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: `${completionPercentage}%` }} />
                    </div>

                    <div className="mt-4">
                      <Button 
                        className="bg-blue-600 text-white w-full md:w-auto"
                        onClick={() => navigate("/member/profile")}
                      >
                        Complete Profile
                      </Button>
                    </div>
                  </div>

                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg flex items-center justify-center">
                    <img src="/assets/placeholder.svg" alt="illustration" className="w-20 h-20 md:w-24 md:h-24" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick actions grid - mobile optimized (single set, clickable) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/member/adf")}>
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">ADF</span>
                </div>
                <h4 className="font-medium">ADF Form</h4>
              </Card>
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/member/certificate")}>
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">CERT</span>
                </div>
                <h4 className="font-medium">Certificate</h4>
              </Card>
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/member/help")}>
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">HELP</span>
                </div>
                <h4 className="font-medium">Help Center</h4>
              </Card>
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/member/events")}>
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 font-bold">EV</span>
                </div>
                <h4 className="font-medium">Events</h4>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;