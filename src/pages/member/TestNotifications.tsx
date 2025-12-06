import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  User,
  FileText,
  CreditCard,
  ShoppingCart,
  Calendar,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import notificationService from "@/services/notificationService";
import reminderService from "@/services/reminderService";

const TestNotifications = () => {
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});
  
  // Get user info from localStorage
  const userName = localStorage.getItem('userName') || 'Test User';
  const userEmail = 'test@example.com';
  const userPhone = '+919876543210';
  const memberId = localStorage.getItem('memberId') || 'TEST001';

  const runTest = async (testName: string, testFunction: () => Promise<void>) => {
    try {
      setTestResults(prev => ({ ...prev, [testName]: 'Running...' }));
      await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: '✅ Success' }));
    } catch (error) {
      console.error(`${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: `❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}` }));
    }
  };

  // Test notification methods
  const testRegistrationNotification = () => {
    return notificationService.sendRegistrationNotification(
      userName,
      userEmail,
      userPhone,
      memberId,
      "Test Business"
    );
  };

  const testApprovalNotification = () => {
    return notificationService.sendApprovalNotification(
      userName,
      userEmail,
      userPhone,
      "product",
      "Test Product",
      "approved"
    );
  };

  const testPaymentNotification = () => {
    return notificationService.sendPaymentSuccessNotification(
      userName,
      userEmail,
      userPhone,
      "PAYTEST123",
      1500,
      "Annual Membership"
    );
  };

  const testCartNotification = () => {
    return notificationService.sendCartUpdateNotification(
      userName,
      userEmail,
      userPhone,
      "added",
      "Test Item",
      2
    );
  };

  const testOrderNotification = () => {
    return notificationService.sendOrderUpdateNotification(
      userName,
      userEmail,
      userPhone,
      "ORDTEST123",
      "shipped",
      "Test Product"
    );
  };

  const testEscalationNotification = () => {
    return notificationService.sendEscalationNotification(
      userName,
      userEmail,
      userPhone,
      "application",
      "Test Application",
      "district",
      "state"
    );
  };

  const testReminderNotification = () => {
    return notificationService.sendReminderNotification(
      userName,
      userEmail,
      userPhone,
      "Test Reminder",
      "This is a test reminder",
      new Date(Date.now() + 86400000).toISOString() // Tomorrow
    );
  };

  const testInquiryNotification = () => {
    return notificationService.sendInquiryNotification(
      userName,
      userEmail,
      userPhone,
      "Test Product",
      "Test Customer",
      5,
      "This is a test inquiry"
    );
  };

  const testWhatsAppOnboarding = () => {
    return notificationService.sendWhatsAppOnboarding(
      userName,
      userPhone,
      "Test Business"
    );
  };

  const testScheduleReminder = () => {
    const dueDate = new Date();
    dueDate.setMinutes(dueDate.getMinutes() + 1); // 1 minute from now for testing
    
    const reminderId = reminderService.scheduleReminder(
      memberId,
      "test",
      "Test Scheduled Reminder",
      "This is a test scheduled reminder",
      dueDate.toISOString()
    );
    
    return Promise.resolve();
  };

  const notificationTests = [
    { name: "Registration Notification", func: testRegistrationNotification, icon: User },
    { name: "Approval Notification", func: testApprovalNotification, icon: FileText },
    { name: "Payment Notification", func: testPaymentNotification, icon: CreditCard },
    { name: "Cart Update Notification", func: testCartNotification, icon: ShoppingCart },
    { name: "Order Update Notification", func: testOrderNotification, icon: ShoppingCart },
    { name: "Escalation Notification", func: testEscalationNotification, icon: AlertTriangle },
    { name: "Reminder Notification", func: testReminderNotification, icon: Calendar },
    { name: "Inquiry Notification", func: testInquiryNotification, icon: Bell },
    { name: "WhatsApp Onboarding", func: testWhatsAppOnboarding, icon: MessageSquare },
    { name: "Schedule Reminder", func: testScheduleReminder, icon: Calendar }
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
          <h1 className="text-2xl font-bold">Test Notification System</h1>
        </div>
        
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Notification System Tests</CardTitle>
            <CardDescription>
              Run tests to verify all notification channels and types are working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificationTests.map((test) => {
                const IconComponent = test.icon;
                return (
                  <div key={test.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testResults[test.name] || 'Not run'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => runTest(test.name, test.func)}
                      disabled={testResults[test.name] === 'Running...'}
                    >
                      {testResults[test.name] === 'Running...' ? 'Testing...' : 'Run Test'}
                    </Button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Test Instructions
              </h3>
              <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Click "Run Test" for each notification type to verify it works</li>
                <li>Check browser console for detailed logs</li>
                <li>Scheduled reminder will trigger automatically after 1 minute</li>
                <li>All notifications are simulated and won't send real emails/SMS</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestNotifications;