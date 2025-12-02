import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  AlertTriangle,
  Package,
  Bell,
  Mail,
  MessageSquare,
  Smartphone
} from "lucide-react";

// Mock alert data
const alerts = [
  {
    id: "ALERT001",
    itemId: "INV002",
    itemName: "Organic Cotton Textiles - 48 inches",
    currentStock: 30,
    minStock: 50,
    category: "Textiles",
    severity: "high",
    date: "2024-01-15",
    resolved: false
  },
  {
    id: "ALERT002",
    itemId: "INV004",
    itemName: "Handcrafted Pottery - Large Vase",
    currentStock: 5,
    minStock: 10,
    category: "Handicrafts",
    severity: "high",
    date: "2024-01-14",
    resolved: false
  },
  {
    id: "ALERT003",
    itemId: "INV001",
    itemName: "Organic Cotton Textiles - 54 inches",
    currentStock: 150,
    minStock: 50,
    category: "Textiles",
    severity: "medium",
    date: "2024-01-10",
    resolved: true
  },
  {
    id: "ALERT004",
    itemId: "INV005",
    itemName: "Spices Collection - 500g Pack",
    currentStock: 200,
    minStock: 100,
    category: "Food Products",
    severity: "low",
    date: "2024-01-05",
    resolved: true
  }
];

const InventoryAlerts = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [alertPreferences, setAlertPreferences] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    app: true
  });

  const togglePreference = (type: keyof typeof alertPreferences) => {
    setAlertPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const filteredAlerts = activeTab === "active" 
    ? alerts.filter(alert => !alert.resolved)
    : alerts.filter(alert => alert.resolved);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-muted";
    }
  };

  const resolveAlert = (id: string) => {
    // In a real app, this would update the backend
    console.log("Resolving alert", id);
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Inventory Alerts</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-3xl font-bold text-red-600">
                    {alerts.filter(a => !a.resolved).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-3xl font-bold">
                    {alerts.filter(a => !a.resolved && a.severity === "high").length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-3xl font-bold">
                    {alerts.filter(a => a.resolved && a.date === "2024-01-15").length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                  <p className="text-3xl font-bold">{alerts.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Preferences */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Alert Preferences</CardTitle>
            <CardDescription>Choose how you want to receive inventory alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts within the app</p>
                </div>
              </div>
              <Switch 
                checked={alertPreferences.app} 
                onCheckedChange={() => togglePreference("app")} 
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
              </div>
              <Switch 
                checked={alertPreferences.email} 
                onCheckedChange={() => togglePreference("email")} 
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                </div>
              </div>
              <Switch 
                checked={alertPreferences.sms} 
                onCheckedChange={() => togglePreference("sms")} 
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts via WhatsApp</p>
                </div>
              </div>
              <Switch 
                checked={alertPreferences.whatsapp} 
                onCheckedChange={() => togglePreference("whatsapp")} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert Tabs */}
        <div className="flex gap-2">
          <Button 
            variant={activeTab === "active" ? "default" : "outline"} 
            onClick={() => setActiveTab("active")}
          >
            Active Alerts ({alerts.filter(a => !a.resolved).length})
          </Button>
          <Button 
            variant={activeTab === "resolved" ? "default" : "outline"} 
            onClick={() => setActiveTab("resolved")}
          >
            Resolved Alerts ({alerts.filter(a => a.resolved).length})
          </Button>
        </div>

        {/* Alerts List */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>
              {activeTab === "active" ? "Active Inventory Alerts" : "Resolved Alerts"}
            </CardTitle>
            <CardDescription>
              {activeTab === "active" 
                ? "Items that need immediate attention" 
                : "Previously resolved inventory alerts"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border ${
                      alert.resolved 
                        ? "bg-muted/50 border-muted" 
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{alert.itemName}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Priority
                          </Badge>
                          {alert.resolved && (
                            <Badge variant="default">Resolved</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current Stock</p>
                            <p className={`font-medium ${alert.currentStock < alert.minStock ? "text-red-600" : ""}`}>
                              {alert.currentStock} units
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground">Minimum Stock</p>
                            <p className="font-medium">{alert.minStock} units</p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground">Category</p>
                            <p className="font-medium">{alert.category}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2">
                          Alert generated on {alert.date}
                        </p>
                      </div>
                      
                      {!alert.resolved && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === "active" ? "No active alerts" : "No resolved alerts"}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === "active" 
                      ? "All inventory items are at healthy stock levels" 
                      : "No alerts have been resolved yet"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryAlerts;