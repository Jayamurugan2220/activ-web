// Notification Service for handling different notification channels
// This is a mock service that simulates sending notifications
// In a real application, this would integrate with actual email/SMS/WhatsApp APIs

export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'app';
export type NotificationType = 'inquiry' | 'response' | 'order' | 'payment' | 'membership' | 'approval' | 'event' | 'document' | 'profile' | 'registration' | 'escalation' | 'reminder' | 'cart';

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
  // Add template and parameters for WhatsApp templates
  template?: {
    name: string;
    language: string;
    components?: any[];
  };
  parameters?: Record<string, string>;
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
      profile: true,
      registration: true,
      escalation: true,
      reminder: true,
      cart: true
    }
  }
};

class NotificationService {
  /**
   * Send a notification through preferred channels
   * @param payload - Notification details
   * @returns Promise with sending result
   */
  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      // In a real implementation, this would send notifications through actual channels
      console.log('Sending notification:', payload);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate successful sending
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Send payment success notification with receipt attachment
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param paymentId - Payment identifier
   * @param amount - Payment amount
   * @param paymentType - Type of payment
   * @returns Promise with sending result
   */
  async sendPaymentSuccessNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    paymentId: string,
    amount: number,
    paymentType: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'payment',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: `Payment Successful - ${paymentType}`,
      message: `Dear ${memberName},
      
Your payment of ₹${amount} for ${paymentType} has been successfully processed.
Payment ID: ${paymentId}

A receipt has been generated for this transaction. You can download it from your payment history.

Thank you for your payment!

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send receipt via email
   * @param email - Recipient email
   * @param memberName - Name of the member
   * @param receiptContent - Content of the receipt
   * @param paymentType - Type of payment
   * @returns Promise with sending result
   */
  async sendReceiptEmail(
    email: string,
    memberName: string,
    receiptContent: string,
    paymentType: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'payment',
      recipient: {
        name: memberName,
        email
      },
      subject: `Payment Receipt - ${paymentType}`,
      message: `Dear ${memberName},

Please find attached the receipt for your recent payment.

${receiptContent}

Thank you for your payment!

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send receipt via SMS
   * @param phone - Recipient phone number
   * @param memberName - Name of the member
   * @param paymentId - Payment identifier
   * @param amount - Payment amount
   * @returns Promise with sending result
   */
  async sendReceiptSMS(
    phone: string,
    memberName: string,
    paymentId: string,
    amount: number
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'payment',
      recipient: {
        name: memberName,
        phone
      },
      subject: '',
      message: `Dear ${memberName}, your payment of Rs.${amount} has been received. Payment ID: ${paymentId}. View receipt in your account. - ACTIV`
    };

    return this.sendNotification(payload);
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;