import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle,
  XCircle
} from "lucide-react";
import reminderService, { Reminder } from "@/services/reminderService";

const Reminders = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  // Get user ID (in a real app, this would come from auth context)
  const userId = localStorage.getItem('memberId') || 'default-user';

  // Load reminders on component mount
  useEffect(() => {
    loadReminders();
  }, [activeTab]);

  const loadReminders = () => {
    if (activeTab === "upcoming") {
      const upcomingReminders = reminderService.getUpcomingReminders(userId, 30);
      setReminders(upcomingReminders);
    } else {
      const allReminders = reminderService.getUserReminders(userId);
      setReminders(allReminders);
    }
  };

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.dueDate) {
      reminderService.scheduleReminder(
        userId,
        "general",
        newReminder.title,
        newReminder.description,
        newReminder.dueDate
      );
      
      // Reset form
      setNewReminder({
        title: "",
        description: "",
        dueDate: ""
      });
      
      setShowAddForm(false);
      
      // Reload reminders
      loadReminders();
    }
  };

  const handleCancelReminder = (reminderId: string) => {
    reminderService.cancelReminder(reminderId);
    loadReminders();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

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
          <h1 className="text-2xl font-bold">Reminders</h1>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reminders.filter(r => !r.sent && !isOverdue(r.dueDate)).length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reminders.filter(r => !r.sent && isOverdue(r.dueDate)).length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reminders.filter(r => r.sent).length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <Button 
            variant={activeTab === "upcoming" ? "default" : "outline"} 
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </Button>
          <Button 
            variant={activeTab === "all" ? "default" : "outline"} 
            onClick={() => setActiveTab("all")}
          >
            All Reminders
          </Button>
          <Button 
            variant="default" 
            className="ml-auto"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reminder
          </Button>
        </div>
        
        {/* Add Reminder Form */}
        {showAddForm && (
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle>Add New Reminder</CardTitle>
              <CardDescription>Create a new reminder for important tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title*</Label>
                <Input 
                  id="title" 
                  placeholder="Enter reminder title" 
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter reminder description" 
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date*</Label>
                <Input 
                  id="dueDate" 
                  type="datetime-local" 
                  value={newReminder.dueDate}
                  onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddReminder}>
                  Add Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <Card key={reminder.id} className="shadow-medium border-0">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{reminder.title}</h3>
                        {reminder.sent ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : isOverdue(reminder.dueDate) ? (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Overdue
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{reminder.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Due: {formatDate(reminder.dueDate)}
                      </p>
                    </div>
                    {!reminder.sent && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCancelReminder(reminder.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-medium border-0">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {activeTab === "upcoming" ? "No upcoming reminders" : "No reminders"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "upcoming" 
                    ? "You don't have any upcoming reminders. Create one to stay organized!" 
                    : "You haven't created any reminders yet."}
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;