import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, CheckCircle, XCircle, Clock, AlertTriangle, IndianRupee,
  TrendingUp, MapPin, PieChart, Activity, Filter, Eye, Calendar
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from "recharts";

// Mock data for charts
const growthData = [
  { period: "Week 1", members: 186 },
  { period: "Week 2", members: 234 },
  { period: "Week 3", members: 218 },
  { period: "Week 4", members: 302 },
];

const districtData = [
  { district: "Chennai", members: 1248 },
  { district: "Coimbatore", members: 987 },
  { district: "Madurai", members: 756 },
  { district: "Salem", members: 623 },
  { district: "Trichy", members: 589 },
];

const genderData = [
  { name: "Male", value: 642 },
  { name: "Female", value: 587 },
  { name: "Other", value: 19 },
];

const categoryData = [
  { name: "Individual", value: 876 },
  { name: "SHG", value: 245 },
  { name: "FPO", value: 128 },
  { name: "MSME", value: 87 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DistrictAdminDashboard = () => {
  const stats = [
    { label: "Total Members", value: 1248, icon: Users, color: "primary" },
    { label: "Pending Approvals", value: 87, icon: Clock, color: "amber" },
    { label: "Approved Members", value: 1125, icon: CheckCircle, color: "success" },
    { label: "Rejected Members", value: 36, icon: XCircle, color: "destructive" },
    { label: "Escalated Cases", value: 12, icon: AlertTriangle, color: "blue" },
    { label: "Payments Received", value: "₹4.2L", icon: IndianRupee, color: "green" }
  ];

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
      case "green": return "bg-green-100 text-green-600";
      default: return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const colorClasses = getColorClasses(stat.color);
          
          return (
            <Card key={index} className="shadow-medium border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
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
            <CardDescription>Weekly membership trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="members" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* District-wise Statistics */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              District-wise Statistics
            </CardTitle>
            <CardDescription>Members by district</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="district" type="category" scale="band" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="members" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Gender Distribution */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gender Distribution
            </CardTitle>
            <CardDescription>Members by gender</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Category Distribution */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Member Category Distribution
            </CardTitle>
            <CardDescription>Distribution by member type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Filters */}
        <Card className="shadow-medium border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Data Filters
            </CardTitle>
            <CardDescription>Apply filters to customize your view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Member Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Individual</Badge>
                  <Badge variant="secondary">SHG</Badge>
                  <Badge variant="secondary">FPO</Badge>
                  <Badge variant="secondary">MSME</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Agriculture</Badge>
                  <Badge variant="outline">Manufacturing</Badge>
                  <Badge variant="outline">Services</Badge>
                  <Badge variant="outline">Trade</Badge>
                  <Badge variant="outline">Handicrafts</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Date Range</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Last 30 days</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="shadow-medium border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Applications
          </CardTitle>
          <CardDescription>Latest member applications</CardDescription>
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
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistrictAdminDashboard;