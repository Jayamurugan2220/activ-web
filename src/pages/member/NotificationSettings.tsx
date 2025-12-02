import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Bell,
  User,
  FileText,
  CreditCard,
  Calendar,
  ShoppingCart
} from "lucide-react";

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    app: true
  });

  const [notificationTypes, setNotificationTypes] = useState({
    membership: true,
    payments: true,
    approvals: true,
    events: true,
    documents: true,
    orders: true,
    profile: true
  });

  const togglePreference = (type: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const toggleNotificationType = (type: keyof typeof notificationTypes) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    alert("Notification preferences saved successfully!");
  };

  const notificationTypeConfig = [
    { id: "membership", name: "Membership Updates", icon: User, description: "Renewals, expirations, and membership changes" },
    { id: "payments", name: "Payment Notifications", icon: CreditCard, description: "Payment confirmations and receipts" },
    { id: "approvals", name: "Approval Status", icon: FileText, description: "Application and document approvals" },
    { id: "events", name: "Event Reminders", icon: Calendar, description: "Upcoming events and workshops" },
    { id: "documents", name: "Document Updates", icon: FileText, description: "Document submissions and reviews" },
    { id: "orders", name: "Order Status", icon: ShoppingCart, description: "Order confirmations and shipping updates" },
    { id: "profile", name: "Profile Changes", icon: User, description: "Profile updates and security alerts" }
  ];

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Notification Settings</h1>
        </div>

        {/* Channel Preferences */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>Choose how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                </div>
              </div>
              <Switch 
                checked={preferences.app} 
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
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch 
                checked={preferences.email} 
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
                  <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                </div>
              </div>
              <Switch 
                checked={preferences.sms} 
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
                  <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
                </div>
              </div>
              <Switch 
                checked={preferences.whatsapp} 
                onCheckedChange={() => togglePreference("whatsapp")} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>Choose which types of notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationTypeConfig.map((type) => {
              const IconComponent = type.icon;
              const isChecked = notificationTypes[type.id as keyof typeof notificationTypes];
              
              return (
                <div key={type.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={isChecked} 
                    onCheckedChange={() => toggleNotificationType(type.id as keyof typeof notificationTypes)} 
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={saveSettings}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;