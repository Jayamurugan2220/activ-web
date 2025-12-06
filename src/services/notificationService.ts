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

  // Send WhatsApp notification using WhatsApp Business API
  private async sendWhatsApp(payload: NotificationPayload): Promise<void> {
    // In a real app, this would integrate with WhatsApp Business API
    console.log(`💬 Sending WhatsApp to ${payload.recipient.phone}`);
    console.log(`Message: ${payload.message}`);
    
    // If template is provided, use template-based messaging
    if (payload.template) {
      console.log(`Using template: ${payload.template.name}`);
      console.log(`Template parameters:`, payload.parameters);
    }
    
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

  // Send member onboarding WhatsApp message
  async sendOnboardingWhatsApp(
    memberName: string,
    memberPhone: string,
    businessName: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'membership',
      recipient: {
        name: memberName,
        phone: memberPhone
      },
      subject: "Welcome to ACTIV!",
      message: `Hi ${memberName}! Welcome to ACTIV. Your business "${businessName}" has been successfully registered. You can now start showcasing your products and connecting with buyers.`,
      template: {
        name: "onboarding_welcome",
        language: "en"
      },
      parameters: {
        memberName,
        businessName
      }
    };

    await this.sendNotification(payload);
  }

  // Send approval/rejection WhatsApp message
  async sendApprovalStatusWhatsApp(
    memberName: string,
    memberPhone: string,
    status: "approved" | "rejected",
    itemType: string,
    itemName: string,
    reason?: string
  ): Promise<void> {
    const statusText = status === "approved" ? "approved" : "rejected";
    const actionText = status === "approved" ? "is now live" : "requires changes";
    
    const payload: NotificationPayload = {
      type: 'approval',
      recipient: {
        name: memberName,
        phone: memberPhone
      },
      subject: `Your ${itemType} ${statusText}`,
      message: `Hello ${memberName}, your ${itemType} "${itemName}" has been ${statusText}. ${reason ? `Reason: ${reason}` : ""}`,
      template: {
        name: `approval_${status}`,
        language: "en"
      },
      parameters: {
        memberName,
        itemType,
        itemName,
        actionText,
        ...(reason && { reason })
      }
    };

    await this.sendNotification(payload);
  }

  // Send order status update WhatsApp message
  async sendOrderStatusUpdateWhatsApp(
    customerName: string,
    customerPhone: string,
    orderId: string,
    status: string,
    productName: string,
    estimatedDelivery?: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'order',
      recipient: {
        name: customerName,
        phone: customerPhone
      },
      subject: `Order #${orderId} Status Update`,
      message: `Hello ${customerName}, your order #${orderId} for "${productName}" is now ${status}. ${estimatedDelivery ? `Estimated delivery: ${estimatedDelivery}` : ""}`,
      template: {
        name: "order_status_update",
        language: "en"
      },
      parameters: {
        customerName,
        orderId,
        status,
        productName,
        ...(estimatedDelivery && { estimatedDelivery })
      }
    };

    await this.sendNotification(payload);
  }

  // Send B2B inquiry notification via WhatsApp
  async sendB2BInquiryWhatsApp(
    sellerName: string,
    sellerPhone: string,
    productName: string,
    customerName: string,
    quantity: number,
    message: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'inquiry',
      recipient: {
        name: sellerName,
        phone: sellerPhone
      },
      subject: `New B2B Inquiry for ${productName}`,
      message: `Hello ${sellerName}, you have received a new B2B inquiry for "${productName}" from ${customerName}. Quantity: ${quantity}. Message: ${message}`,
      template: {
        name: "b2b_inquiry_notification",
        language: "en"
      },
      parameters: {
        sellerName,
        productName,
        customerName,
        quantity: quantity.toString(),
        message
      }
    };

    await this.sendNotification(payload);
  }

  // Send catalog link via WhatsApp
  async sendCatalogLinkWhatsApp(
    recipientName: string,
    recipientPhone: string,
    catalogLink: string,
    senderName: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'document',
      recipient: {
        name: recipientName,
        phone: recipientPhone
      },
      subject: "Product Catalog Shared",
      message: `Hello ${recipientName}, ${senderName} has shared a product catalog with you. View it here: ${catalogLink}`,
      template: {
        name: "catalog_link_sharing",
        language: "en"
      },
      parameters: {
        recipientName,
        senderName,
        catalogLink
      }
    };

    await this.sendNotification(payload);
  }

  // Send QR code via WhatsApp
  async sendQRCodeWhatsApp(
    recipientName: string,
    recipientPhone: string,
    qrCodeLink: string,
    businessName: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'document',
      recipient: {
        name: recipientName,
        phone: recipientPhone
      },
      subject: "Business QR Code",
      message: `Hello ${recipientName}, here is the QR code for ${businessName}. Scan it to view their catalog: ${qrCodeLink}`,
      template: {
        name: "qr_code_sharing",
        language: "en"
      },
      parameters: {
        recipientName,
        businessName,
        qrCodeLink
      }
    };

    await this.sendNotification(payload);
  }

  // Send registration notification
  async sendRegistrationNotification(
    memberName: string,
    memberEmail: string | undefined,
    memberPhone: string | undefined,
    memberId: string,
    businessName: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'registration',
      recipient: {
        name: memberName,
        email: memberEmail,
        phone: memberPhone
      },
      subject: "Welcome to ACTIV - Registration Successful",
      message: `Hello ${memberName},

Congratulations! Your registration with ACTIV has been successfully completed.

Member ID: ${memberId}
Business Name: ${businessName}

You can now start showcasing your products and connecting with buyers.

Best regards,
ACTIV Team`,
      template: {
        name: "member_registration",
        language: "en"
      },
      parameters: {
        memberName,
        memberId,
        businessName
      }
    };

    await this.sendNotification(payload);
  }

  // Send approval notification
  async sendApprovalNotification(
    memberName: string,
    memberEmail: string | undefined,
    memberPhone: string | undefined,
    itemType: string,
    itemName: string,
    status: "approved" | "rejected"
  ): Promise<void> {
    const statusText = status === "approved" ? "Approved" : "Rejected";
    const actionText = status === "approved" ? "is now live" : "requires changes";

    const payload: NotificationPayload = {
      type: 'approval',
      recipient: {
        name: memberName,
        email: memberEmail,
        phone: memberPhone
      },
      subject: `Your ${itemType} ${statusText}`,
      message: `Hello ${memberName},

Your ${itemType} "${itemName}" has been ${statusText}.

${status === "approved" 
  ? `Great news! Your ${itemType} is now live on the platform and visible to potential buyers.`
  : `Unfortunately, your ${itemType} requires changes before it can be approved. Please review the feedback and resubmit.`}

Please log in to your dashboard for more details.

Best regards,
ACTIV Team`,
      template: {
        name: `approval_${status}`,
        language: "en"
      },
      parameters: {
        memberName,
        itemType,
        itemName,
        statusText,
        actionText
      }
    };

    await this.sendNotification(payload);
  }

  // Send payment success notification
  async sendPaymentSuccessNotification(
    memberName: string,
    memberEmail: string | undefined,
    memberPhone: string | undefined,
    paymentId: string,
    amount: number,
    paymentType: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'payment',
      recipient: {
        name: memberName,
        email: memberEmail,
        phone: memberPhone
      },
      subject: `Payment Successful - ₹${amount}`,
      message: `Hello ${memberName},

Your payment of ₹${amount} for ${paymentType} has been successfully processed.

Payment ID: ${paymentId}
Amount: ₹${amount}
Date: ${new Date().toLocaleDateString()}

Thank you for your payment. Your transaction details are available in your payment history.

Best regards,
ACTIV Team`,
      template: {
        name: "payment_success",
        language: "en"
      },
      parameters: {
        memberName,
        paymentId,
        amount: amount.toString(),
        paymentType
      }
    };

    await this.sendNotification(payload);
  }

  // Send cart update notification
  async sendCartUpdateNotification(
    memberName: string,
    memberEmail: string | undefined,
    memberPhone: string | undefined,
    action: string,
    itemName: string,
    quantity: number
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'cart',
      recipient: {
        name: memberName,
        email: memberEmail,
        phone: memberPhone
      },
      subject: `Cart Updated - ${action} ${itemName}`,
      message: `Hello ${memberName},

Your shopping cart has been updated.

Action: ${action}
Item: ${itemName}
Quantity: ${quantity}

Continue shopping or proceed to checkout when you're ready.

Best regards,
ACTIV Team`,
      template: {
        name: "cart_update",
        language: "en"
      },
      parameters: {
        memberName,
        action,
        itemName,
        quantity: quantity.toString()
      }
    };

    await this.sendNotification(payload);
  }

  // Send order update notification
  async sendOrderUpdateNotification(
    memberName: string,
    memberEmail: string | undefined,
    memberPhone: string | undefined,
    orderId: string,
    status: string,
    itemName: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'order',
      recipient: {
        name: memberName,
        email: memberEmail,
        phone: memberPhone
      },
      subject: `Order #${orderId} Status Update`,
      message: `Hello ${memberName},

Your order #${orderId} status has been updated.

Item: ${itemName}
New Status: ${status}
Updated: ${new Date().toLocaleDateString()}

Please log in to your account to view the complete order details.

Best regards,
ACTIV Team`,
      template: {
        name: "order_update",
        language: "en"
      },
      parameters: {
        memberName,
        orderId,
        status,
        itemName
      }
    };

    await this.sendNotification(payload);
  }

  // Send escalation notification
  async sendEscalationNotification(
    memberName: string,
    memberEmail: string | undefined,
    memberPhone: string | undefined,
    itemType: string,
    itemName: string,
    currentLevel: string,
    nextLevel: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'escalation',
      recipient: {
        name: memberName,
        email: memberEmail,
        phone: memberPhone
      },
      subject: `${itemType} Escalated to ${nextLevel} Level`,
      message: `Hello ${memberName},

Your ${itemType} "${itemName}" has been escalated for review.

Current Status: Escalated
From: ${currentLevel} Admin
To: ${nextLevel} Admin

Your ${itemType} is being reviewed by the ${nextLevel} level administrator. We'll notify you once a decision has been made.

Best regards,
ACTIV Team`,
      template: {
        name: "item_escalation",
        language: "en"
      },
      parameters: {
        memberName,
        itemType,
        itemName,
        currentLevel,
        nextLevel
      }
    };

    await this.sendNotification(payload);
  }

  // Send reminder notification
  async sendReminderNotification(
    memberName: string,
    memberEmail: string | undefined,
    memberPhone: string | undefined,
    reminderType: string,
    itemName: string,
    dueDate?: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'reminder',
      recipient: {
        name: memberName,
        email: memberEmail,
        phone: memberPhone
      },
      subject: `Reminder: ${reminderType}`,
      message: `Hello ${memberName},

This is a friendly reminder regarding your ${reminderType}.

Item: ${itemName}
${dueDate ? `Due Date: ${dueDate}` : ''}

Please take the necessary action at your earliest convenience.

Best regards,
ACTIV Team`,
      template: {
        name: "general_reminder",
        language: "en"
      },
      parameters: {
        memberName,
        reminderType,
        itemName,
        ...(dueDate && { dueDate })
      }
    };

    await this.sendNotification(payload);
  }

  // Send WhatsApp onboarding notification
  async sendWhatsAppOnboarding(
    memberName: string,
    memberPhone: string,
    businessName: string
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'membership',
      recipient: {
        name: memberName,
        phone: memberPhone
      },
      subject: "Welcome to ACTIV!",
      message: `Hi ${memberName}! 👋

Welcome to ACTIV! Your business "${businessName}" has been successfully registered.

✅ Access your dashboard
✅ Start adding products
✅ Connect with buyers

Visit https://activ-web.example.com/member/dashboard to get started!

ACTIV Team`,
      template: {
        name: "whatsapp_onboarding",
        language: "en"
      },
      parameters: {
        memberName,
        businessName
      }
    };

    await this.sendNotification(payload);
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;