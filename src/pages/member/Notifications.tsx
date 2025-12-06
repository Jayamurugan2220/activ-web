import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calendar, 
  FileText, 
  User, 
  Mail, 
  MessageSquare, 
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  CreditCard,
  ShoppingCart
} from "lucide-react";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const notifications = [
    {
      id: 1,
      type: "event",
      title: "Upcoming Workshop",
      message: "JavaScript Fundamentals workshop is scheduled for tomorrow at 2 PM",
      time: "2 hours ago",
      unread: true,
      channel: "app"
    },
    {
      id: 2,
      type: "document",
      title: "Document Approved",
      message: "Your ADF form has been approved by the administrator",
      time: "1 day ago",
      unread: false,
      channel: "email"
    },
    {
      id: 3,
      type: "inquiry",
      title: "New Product Inquiry",
      message: "You have received a new inquiry for Organic Cotton Textiles from Global Traders",
      time: "2 days ago",
      unread: true,
      channel: "app"
    },
    {
      id: 4,
      type: "profile",
      title: "Profile Update",
      message: "Please complete your profile to unlock all features",
      time: "2 days ago",
      unread: false,
      channel: "sms"
    },
    {
      id: 5,
      type: "payment",
      title: "Payment Successful",
      message: "Your membership renewal payment of ₹1,500 was successful",
      time: "3 days ago",
      unread: false,
      channel: "whatsapp"
    },
    {
      id: 6,
      type: "approval",
      title: "Application Status",
      message: "Your membership application has been forwarded to District Admin",
      time: "4 days ago",
      unread: true,
      channel: "email"
    }
  ];

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => n.channel === activeTab);

  const getIcon = (type: string) => {
    switch (type) {
      case "event": return <Calendar className="h-5 w-5 text-blue-500" />;
      case "document": return <FileText className="h-5 w-5 text-green-500" />;
      case "inquiry": return <MessageCircle className="h-5 w-5 text-indigo-500" />;
      case "profile": return <User className="h-5 w-5 text-purple-500" />;
      case "payment": return <CheckCircle className="h-5 w-5 text-success" />;
      case "approval": return <Clock className="h-5 w-5 text-amber-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email": return <Mail className="h-4 w-4" />;
      case "sms": return <Smartphone className="h-4 w-4" />;
      case "whatsapp": return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "email": return "bg-blue-100 text-blue-800";
      case "sms": return "bg-green-100 text-green-800";
      case "whatsapp": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const markAsRead = (id: number) => {
    // In a real app, this would update the notification status
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, this would update all notifications
    console.log("Marking all notifications as read");
  };

  const notificationTypeConfig = [
    { id: "membership", name: "Membership Updates", icon: User, description: "Renewals, expirations, and membership changes" },
    { id: "payments", name: "Payment Notifications", icon: CreditCard, description: "Payment confirmations and receipts" },
    { id: "approvals", name: "Approval Status", icon: FileText, description: "Application and document approvals" },
    { id: "events", name: "Event Reminders", icon: Calendar, description: "Upcoming events and workshops" },
    { id: "documents", name: "Document Updates", icon: FileText, description: "Document submissions and reviews" },
    { id: "orders", name: "Order Status", icon: ShoppingCart, description: "Order confirmations and shipping updates" },
    { id: "inquiries", name: "Inquiry Notifications", icon: MessageCircle, description: "New product inquiries and responses" },
    { id: "profile", name: "Profile Changes", icon: User, description: "Profile updates and security alerts" }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
        
        {/* Channel Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeTab === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab("all")}
          >
            All
          </Button>
          <Button 
            variant={activeTab === "app" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab("app")}
          >
            <Bell className="w-4 h-4 mr-2" />
            App
          </Button>
          <Button 
            variant={activeTab === "email" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab("email")}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button 
            variant={activeTab === "sms" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab("sms")}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            SMS
          </Button>
          <Button 
            variant={activeTab === "whatsapp" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab("whatsapp")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
        
        {/* Notification Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.unread).length}</p>
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
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.channel === "email").length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.channel === "whatsapp").length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`${notification.unread ? "border-l-4 border-l-blue-500" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {notification.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        )}
                        <Badge className={`${getChannelColor(notification.channel)} ml-auto`}>
                          <div className="flex items-center gap-1">
                            {getChannelIcon(notification.channel)}
                            <span className="capitalize">{notification.channel}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-medium border-0">
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! Check back later for new notifications.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;