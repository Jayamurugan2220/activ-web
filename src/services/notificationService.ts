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
   * Send profile update notification to admins
   * @param memberName - Name of the member who updated their profile
   * @param memberId - Member ID
   * @returns Promise with sending result
   */
  async sendProfileUpdateNotification(
    memberName: string,
    memberId: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'profile',
      recipient: {
        name: 'Admin Team',
      },
      subject: `Profile Updated - ${memberName}`,
      message: `Dear Admin,
      
Member ${memberName} (ID: ${memberId}) has updated their profile information.

No approval is required for this update.

Best regards,
ACTIV System`
    };

    return this.sendNotification(payload);
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

  /**
   * Send approval notification
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param itemType - Type of item being approved (application, product, etc.)
   * @param itemName - Name of the item being approved
   * @param status - Approval status (approved/rejected)
   * @returns Promise with sending result
   */
  async sendApprovalNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    itemType: string,
    itemName: string | undefined,
    status: "approved" | "rejected"
  ): Promise<boolean> {
    const action = status === "approved" ? "approved" : "rejected";
    const actionWord = status === "approved" ? "Approval" : "Rejection";
    
    const payload: NotificationPayload = {
      type: 'approval',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: `${actionWord} Notification - ${itemName || itemType}`,
      message: `Dear ${memberName},
      
Your ${itemType} "${itemName || 'submission'}" has been ${action}.
      
${status === "approved" 
  ? "Congratulations! Your application has been approved and you can now access all member benefits."
  : "We regret to inform you that your application has been rejected. Please contact support for more information."}

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send escalation notification
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param itemType - Type of item being escalated
   * @param itemName - Name of the item being escalated
   * @param fromLevel - Current approval level
   * @param toLevel - Escalation level
   * @returns Promise with sending result
   */
  async sendEscalationNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    itemType: string,
    itemName: string | undefined,
    fromLevel: string,
    toLevel: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'escalation',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: `Escalation Notification - ${itemName || itemType}`,
      message: `Dear ${memberName},
      
Your ${itemType} "${itemName || 'submission'}" has been escalated from ${fromLevel} level to ${toLevel} level due to no action being taken within the stipulated time.
      
An administrator at the ${toLevel} level will review your submission shortly.

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send reminder notification
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param title - Reminder title
   * @param description - Reminder description
   * @param dueDate - Due date
   * @returns Promise with sending result
   */
  async sendReminderNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    title: string,
    description: string,
    dueDate: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'reminder',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: `Reminder: ${title}`,
      message: `Dear ${memberName},
      
This is a reminder for: ${title}
      
${description}
      
Due Date: ${new Date(dueDate).toLocaleDateString()}

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send registration notification
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param memberId - Member ID
   * @param businessName - Business name
   * @returns Promise with sending result
   */
  async sendRegistrationNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    memberId: string,
    businessName: string | undefined
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'registration',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: 'Welcome to ACTIV - Registration Successful',
      message: `Dear ${memberName},
      
Welcome to ACTIV! Your registration has been successfully completed.
      
Member ID: ${memberId}
Business Name: ${businessName || 'Not provided'}
      
You will receive further instructions for the approval process shortly.

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send cart update notification
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param action - Action performed (added/removed)
   * @param itemName - Name of the item
   * @param quantity - Quantity of the item
   * @returns Promise with sending result
   */
  async sendCartUpdateNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    action: string,
    itemName: string,
    quantity: number
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'cart',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: `Cart Update - Item ${action}`,
      message: `Dear ${memberName},
      
Item "${itemName}" has been ${action} to your cart.
Quantity: ${quantity}
      
You can view your cart anytime from your dashboard.

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send order update notification
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param orderId - Order ID
   * @param status - Order status
   * @param itemName - Name of the item
   * @returns Promise with sending result
   */
  async sendOrderUpdateNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    orderId: string,
    status: string,
    itemName: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'order',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: `Order Update - ${orderId}`,
      message: `Dear ${memberName},
      
Your order "${orderId}" for item "${itemName}" has been updated.
Status: ${status}
      
You can track your order status from your dashboard.

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send inquiry notification
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param productName - Product name
   * @param customerName - Customer name
   * @param quantity - Quantity
   * @param message - Inquiry message
   * @returns Promise with sending result
   */
  async sendInquiryNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    productName: string,
    customerName: string,
    quantity: number,
    message: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'inquiry',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: `New Inquiry for ${productName}`,
      message: `Dear ${memberName},
      
You have received a new inquiry for your product "${productName}".
      
Customer: ${customerName}
Quantity: ${quantity}
Message: ${message}
      
Please respond to this inquiry at your earliest convenience.

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send WhatsApp onboarding information
   * @param memberName - Name of the member
   * @param phone - Phone number
   * @param businessName - Business name
   * @returns Promise with sending result
   */
  async sendWhatsAppOnboarding(
    memberName: string,
    phone: string,
    businessName: string | undefined
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'registration',
      recipient: {
        name: memberName,
        phone
      },
      subject: '',
      message: `Hello ${memberName}!
      
Welcome to ACTIV! Your business "${businessName || 'your business'}" has been registered successfully.
      
You'll receive important updates here. Save this number for future communications.

ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send QR Code via WhatsApp
   * @param memberName - Name of the member
   * @param phone - Phone number
   * @param qrCodeLink - QR code link
   * @param businessName - Business name
   * @returns Promise with sending result
   */
  async sendQRCodeWhatsApp(
    memberName: string,
    phone: string | undefined,
    qrCodeLink: string,
    businessName: string | undefined
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'document',
      recipient: {
        name: memberName,
        phone
      },
      subject: '',
      message: `Hello ${memberName}!
      
Here is your QR code for your business catalog "${businessName || 'your business'}".
      
Scan this QR code to view your product catalog: ${qrCodeLink}

ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send Catalog Link via WhatsApp
   * @param memberName - Name of the member
   * @param phone - Phone number
   * @param catalogLink - Catalog link
   * @param businessName - Business name
   * @returns Promise with sending result
   */
  async sendCatalogLinkWhatsApp(
    memberName: string,
    phone: string | undefined,
    catalogLink: string,
    businessName: string | undefined
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'document',
      recipient: {
        name: memberName,
        phone
      },
      subject: '',
      message: `Hello ${memberName}!
      
Check out our product catalog for "${businessName || 'your business'}".
      
View our catalog here: ${catalogLink}

ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send B2B Inquiry via WhatsApp
   * @param memberName - Name of the member
   * @param phone - Phone number
   * @param productName - Product name
   * @param customerName - Customer name
   * @param quantity - Quantity
   * @param message - Inquiry message
   * @returns Promise with sending result
   */
  async sendB2BInquiryWhatsApp(
    memberName: string,
    phone: string,
    productName: string,
    customerName: string,
    quantity: number,
    message: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'inquiry',
      recipient: {
        name: memberName,
        phone
      },
      subject: '',
      message: `Hello ${memberName}!
      
You have received a new B2B inquiry for your product "${productName}".
      
Customer: ${customerName}
Quantity: ${quantity}
Message: ${message}

Please respond to this inquiry at your earliest convenience.

ACTIV Team`
    };

    return this.sendNotification(payload);
  }

  /**
   * Send inquiry response notification
   * @param memberName - Name of the member
   * @param email - Email address
   * @param phone - Phone number
   * @param productName - Product name
   * @param sellerName - Seller name
   * @param response - Response message
   * @returns Promise with sending result
   */
  async sendInquiryResponseNotification(
    memberName: string,
    email: string | undefined,
    phone: string | undefined,
    productName: string,
    sellerName: string,
    response: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      type: 'response',
      recipient: {
        name: memberName,
        email,
        phone
      },
      subject: `Response to your inquiry about ${productName}`,
      message: `Dear ${memberName},
      
Thank you for your interest in "${productName}".
      
${sellerName} has responded to your inquiry:
${response}

Please contact the seller directly if you need further information.

Best regards,
ACTIV Team`
    };

    return this.sendNotification(payload);
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;