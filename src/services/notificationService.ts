// Notification Service for handling different notification channels
// This is a mock service that simulates sending notifications
// In a real application, this would integrate with actual email/SMS/WhatsApp APIs

export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'app';
export type NotificationType = 'inquiry' | 'response' | 'order' | 'payment' | 'membership' | 'approval' | 'event' | 'document' | 'profile';

export interface NotificationPayload {
  type: NotificationType;
  recipient: {
    name: string;
    email?: string;
    phone?: string;
  };
  subject: string;
  message: string;
  channelId?: string; // For WhatsApp channel
}

export interface UserNotificationPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  app: boolean;
  types: Record<NotificationType, boolean>;
}

// Mock user preferences - in a real app, this would come from the backend
const mockUserPreferences: Record<string, UserNotificationPreferences> = {
  'default': {
    email: true,
    sms: true,
    whatsapp: true,
    app: true,
    types: {
      inquiry: true,
      response: true,
      order: true,
      payment: true,
      membership: true,
      approval: true,
      event: true,
      document: true,
      profile: true
    }
  }
};

class NotificationService {
  // Get user notification preferences
  getUserPreferences(userId: string): UserNotificationPreferences {
    return mockUserPreferences[userId] || mockUserPreferences['default'];
  }

  // Send notification through appropriate channels based on user preferences
  async sendNotification(payload: NotificationPayload, userId: string = 'default'): Promise<void> {
    const preferences = this.getUserPreferences(userId);
    
    // Check if user wants this notification type
    if (!preferences.types[payload.type]) {
      console.log(`User has disabled ${payload.type} notifications`);
      return;
    }

    // Send through enabled channels
    const promises: Promise<void>[] = [];

    if (preferences.email && payload.recipient.email) {
      promises.push(this.sendEmail(payload));
    }

    if (preferences.sms && payload.recipient.phone) {
      promises.push(this.sendSMS(payload));
    }

    if (preferences.whatsapp && payload.recipient.phone) {
      promises.push(this.sendWhatsApp(payload));
    }

    if (preferences.app) {
      promises.push(this.sendAppNotification(payload));
    }

    try {
      await Promise.all(promises);
      console.log('Notifications sent successfully');
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  }

  // Send email notification
  private async sendEmail(payload: NotificationPayload): Promise<void> {
    // In a real app, this would integrate with an email service like SendGrid, SES, etc.
    console.log(`📧 Sending email to ${payload.recipient.email}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Message: ${payload.message}`);
    
    // Simulate API delay
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  // Send SMS notification
  private async sendSMS(payload: NotificationPayload): Promise<void> {
    // In a real app, this would integrate with an SMS service like Twilio, AWS SNS, etc.
    console.log(`📱 Sending SMS to ${payload.recipient.phone}`);
    console.log(`Message: ${payload.message}`);
    
    // Simulate API delay
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  // Send WhatsApp notification
  private async sendWhatsApp(payload: NotificationPayload): Promise<void> {
    // In a real app, this would integrate with WhatsApp Business API
    console.log(`💬 Sending WhatsApp to ${payload.recipient.phone}`);
    console.log(`Message: ${payload.message}`);
    
    // Simulate API delay
    return new Promise(resolve => setTimeout(resolve, 400));
  }

  // Send in-app notification
  private async sendAppNotification(payload: NotificationPayload): Promise<void> {
    // In a real app, this would store the notification in the database
    console.log(`🔔 Creating in-app notification`);
    console.log(`Title: ${payload.subject}`);
    console.log(`Message: ${payload.message}`);
    
    // Simulate API delay
    return new Promise(resolve => setTimeout(resolve, 200));
  }

  // Send inquiry notification to seller
  async sendInquiryNotification(
    sellerName: string,
    sellerEmail: string | undefined,
    sellerPhone: string | undefined,
    productName: string,
    customerName: string,
    quantity: number,
    message: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'inquiry',
      recipient: {
        name: sellerName,
        email: sellerEmail,
        phone: sellerPhone
      },
      subject: `New Inquiry for ${productName}`,
      message: `Hello ${sellerName},

You have received a new inquiry for "${productName}" from ${customerName}.

Details:
- Product: ${productName}
- Quantity: ${quantity}
- Message: ${message}

Please log in to your seller dashboard to view and respond to this inquiry.

Best regards,
ACTIV Team`
    };

    await this.sendNotification(payload);
  }

  // Send response notification to buyer
  async sendInquiryResponseNotification(
    buyerName: string,
    buyerEmail: string | undefined,
    buyerPhone: string | undefined,
    productName: string,
    sellerName: string,
    responseMessage: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'response',
      recipient: {
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone
      },
      subject: `Response to Your Inquiry for ${productName}`,
      message: `Hello ${buyerName},

${sellerName} has responded to your inquiry for "${productName}".

Response:
"${responseMessage}"

Please log in to your account to view the full details.

Best regards,
ACTIV Team`
    };

    await this.sendNotification(payload);
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;