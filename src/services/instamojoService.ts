// Instamojo Payment Service
// This service handles integration with Instamojo payment gateway

interface InstamojoPaymentData {
  amount: number;
  currency: string;
  buyer_name: string;
  email: string;
  phone: string;
  purpose: string;
  redirect_url: string;
  webhook_url?: string;
  send_email?: boolean;
  send_sms?: boolean;
}

interface InstamojoPaymentResponse {
  success: boolean;
  payment_request?: {
    id: string;
    longurl: string;
    status: string;
  };
  message?: string;
}

// Define payment types
export type PaymentType = 'membership' | 'lifetime_membership' | 'donation';

// Define payment purpose mapping
const PAYMENT_PURPOSES: Record<PaymentType, string> = {
  membership: "Annual Membership Fee",
  lifetime_membership: "Lifetime Membership Fee",
  donation: "Donation to Organization"
};

class InstamojoService {
  private baseUrl: string;
  private apiKey: string;
  private authToken: string;

  constructor() {
    // In a real application, these would come from environment variables
    this.baseUrl = import.meta.env.VITE_INSTAMOJO_BASE_URL || "https://test.instamojo.com/api/1.1/";
    this.apiKey = import.meta.env.VITE_INSTAMOJO_API_KEY || "YOUR_API_KEY";
    this.authToken = import.meta.env.VITE_INSTAMOJO_AUTH_TOKEN || "YOUR_AUTH_TOKEN";
  }

  /**
   * Create a payment request with Instamojo
   * @param paymentData - Payment details
   * @returns Promise with payment request response
   */
  async createPaymentRequest(paymentData: InstamojoPaymentData): Promise<InstamojoPaymentResponse> {
    try {
      // In a real implementation, you would make an API call to Instamojo
      // For demonstration purposes, we're simulating the response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful response
      const response: InstamojoPaymentResponse = {
        success: true,
        payment_request: {
          id: `PAYMENT_${Date.now()}`,
          longurl: "https://test.instamojo.com/@yourusername/payment-link",
          status: "created"
        }
      };
      
      return response;
    } catch (error) {
      console.error("Instamojo payment request failed:", error);
      return {
        success: false,
        message: "Failed to create payment request"
      };
    }
  }

  /**
   * Validate payment response from Instamojo webhook
   * @param paymentId - Payment request ID
   * @param paymentRequestId - Payment request ID
   * @returns Promise with validation result
   */
  async validatePayment(paymentId: string, paymentRequestId: string): Promise<boolean> {
    try {
      // In a real implementation, you would verify the payment with Instamojo API
      // For demonstration purposes, we're simulating the validation
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate successful validation
      return true;
    } catch (error) {
      console.error("Instamojo payment validation failed:", error);
      return false;
    }
  }

  /**
   * Generate payment link for redirection
   * @param paymentData - Payment details
   * @returns Promise with payment link
   */
  async generatePaymentLink(paymentData: InstamojoPaymentData): Promise<string> {
    try {
      const response = await this.createPaymentRequest(paymentData);
      
      if (response.success && response.payment_request) {
        return response.payment_request.longurl;
      } else {
        throw new Error(response.message || "Failed to generate payment link");
      }
    } catch (error) {
      console.error("Failed to generate payment link:", error);
      throw error;
    }
  }

  /**
   * Process membership payment
   * @param amount - Payment amount
   * @param buyerInfo - Buyer information
   * @param membershipType - Type of membership (annual/lifetime)
   * @param redirectUrl - URL to redirect after payment
   * @returns Promise with payment link
   */
  async processMembershipPayment(
    amount: number,
    buyerInfo: { name: string; email: string; phone: string },
    membershipType: 'annual' | 'lifetime',
    redirectUrl: string
  ): Promise<string> {
    const paymentData: InstamojoPaymentData = {
      amount,
      currency: "INR",
      buyer_name: buyerInfo.name,
      email: buyerInfo.email,
      phone: buyerInfo.phone,
      purpose: membershipType === 'annual' 
        ? PAYMENT_PURPOSES.membership 
        : PAYMENT_PURPOSES.lifetime_membership,
      redirect_url: redirectUrl,
      webhook_url: `${window.location.origin}/api/webhook/instamojo`,
      send_email: true,
      send_sms: true
    };

    return this.generatePaymentLink(paymentData);
  }

  /**
   * Process donation payment
   * @param amount - Donation amount
   * @param buyerInfo - Buyer information
   * @param donationPurpose - Purpose of donation
   * @param redirectUrl - URL to redirect after payment
   * @returns Promise with payment link
   */
  async processDonationPayment(
    amount: number,
    buyerInfo: { name: string; email: string; phone: string },
    donationPurpose: string,
    redirectUrl: string
  ): Promise<string> {
    const paymentData: InstamojoPaymentData = {
      amount,
      currency: "INR",
      buyer_name: buyerInfo.name,
      email: buyerInfo.email,
      phone: buyerInfo.phone,
      purpose: `${PAYMENT_PURPOSES.donation} - ${donationPurpose}`,
      redirect_url: redirectUrl,
      webhook_url: `${window.location.origin}/api/webhook/instamojo`,
      send_email: true,
      send_sms: true
    };

    return this.generatePaymentLink(paymentData);
  }
}

// Export singleton instance
const instamojoService = new InstamojoService();
export default instamojoService;