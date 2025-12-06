// Reminder Service for scheduling and sending reminders
// This is a mock service that simulates scheduled reminders
// In a real application, this would integrate with a job scheduler or cron jobs

import notificationService from "./notificationService";

export interface Reminder {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  sent: boolean;
}

class ReminderService {
  private reminders: Reminder[] = [];
  
  // Schedule a new reminder
  scheduleReminder(
    userId: string,
    type: string,
    title: string,
    description: string,
    dueDate: string
  ): string {
    const id = `REM${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const reminder: Reminder = {
      id,
      userId,
      type,
      title,
      description,
      dueDate,
      createdAt: new Date().toISOString(),
      sent: false
    };
    
    this.reminders.push(reminder);
    
    // In a real app, this would be handled by a job scheduler
    this.scheduleNotification(reminder);
    
    return id;
  }
  
  // Schedule notification for a reminder
  private scheduleNotification(reminder: Reminder) {
    // Calculate time until due date
    const dueTime = new Date(reminder.dueDate).getTime();
    const now = new Date().getTime();
    const timeUntilDue = dueTime - now;
    
    // Don't schedule if due date has passed
    if (timeUntilDue <= 0) {
      console.log(`Reminder ${reminder.id} is already due`);
      return;
    }
    
    // Schedule the notification
    // In a real app, this would use a proper job scheduler
    setTimeout(() => {
      this.sendReminderNotification(reminder);
    }, timeUntilDue);
    
    console.log(`Scheduled reminder ${reminder.id} for ${reminder.dueDate}`);
  }
  
  // Send reminder notification
  private async sendReminderNotification(reminder: Reminder) {
    try {
      // Update reminder status
      const reminderIndex = this.reminders.findIndex(r => r.id === reminder.id);
      if (reminderIndex !== -1) {
        this.reminders[reminderIndex].sent = true;
      }
      
      // Get user info (in a real app, this would come from a database)
      const userName = localStorage.getItem('userName') || 'Member';
      
      // Send reminder notification
      await notificationService.sendReminderNotification(
        userName,
        undefined, // email - would come from user data
        undefined, // phone - would come from user data
        reminder.title,
        reminder.description,
        reminder.dueDate
      );
      
      console.log(`Sent reminder notification for ${reminder.id}`);
    } catch (error) {
      console.error('Failed to send reminder notification:', error);
    }
  }
  
  // Get all reminders for a user
  getUserReminders(userId: string): Reminder[] {
    return this.reminders.filter(reminder => reminder.userId === userId);
  }
  
  // Get upcoming reminders for a user
  getUpcomingReminders(userId: string, days: number = 7): Reminder[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return this.reminders.filter(reminder => {
      return (
        reminder.userId === userId &&
        !reminder.sent &&
        new Date(reminder.dueDate) <= cutoffDate
      );
    });
  }
  
  // Cancel a reminder
  cancelReminder(reminderId: string): boolean {
    const initialLength = this.reminders.length;
    this.reminders = this.reminders.filter(reminder => reminder.id !== reminderId);
    return this.reminders.length < initialLength;
  }
}

// Export singleton instance
const reminderService = new ReminderService();
export default reminderService;