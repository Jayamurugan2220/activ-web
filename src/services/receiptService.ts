// Receipt Service for generating and managing payment receipts

interface ReceiptData {
  receiptId: string;
  paymentId: string;
  memberId: string;
  memberName: string;
  email?: string;
  phone?: string;
  paymentType: 'membership' | 'lifetime_membership' | 'donation';
  amount: number;
  paymentDate: string;
  validity?: string; // For memberships
  purpose?: string; // For donations
}

class ReceiptService {
  /**
   * Generate a receipt for a payment
   * @param receiptData - Data needed to generate the receipt
   * @returns Promise with receipt content as string
   */
  async generateReceipt(receiptData: ReceiptData): Promise<string> {
    const receiptContent = `
ACTIV Organization
Payment Receipt
----------------------------------------
Receipt ID: ${receiptData.receiptId}
Payment ID: ${receiptData.paymentId}
Date: ${new Date(receiptData.paymentDate).toLocaleDateString()}

Member Information:
Name: ${receiptData.memberName}
Member ID: ${receiptData.memberId}
${receiptData.email ? `Email: ${receiptData.email}` : ''}
${receiptData.phone ? `Phone: ${receiptData.phone}` : ''}

Payment Details:
Type: ${this.getPaymentTypeDisplay(receiptData.paymentType)}
Amount: ₹${receiptData.amount.toFixed(2)}
${receiptData.validity ? `Validity: ${receiptData.validity}` : ''}
${receiptData.purpose ? `Purpose: ${receiptData.purpose}` : ''}

Thank you for your payment. This serves as your official receipt.
For any queries, contact support@activ.org
    `.trim();

    return receiptContent;
  }

  /**
   * Get display name for payment type
   * @param paymentType - Type of payment
   * @returns Display name
   */
  private getPaymentTypeDisplay(paymentType: string): string {
    switch (paymentType) {
      case 'membership':
        return 'Annual Membership Fee';
      case 'lifetime_membership':
        return 'Lifetime Membership Fee';
      case 'donation':
        return 'Donation';
      default:
        return paymentType;
    }
  }

  /**
   * Save receipt to localStorage for later retrieval
   * @param receiptId - Unique receipt identifier
   * @param receiptContent - Content of the receipt
   */
  saveReceipt(receiptId: string, receiptContent: string): void {
    try {
      const receipts = this.getSavedReceipts();
      receipts[receiptId] = receiptContent;
      localStorage.setItem('paymentReceipts', JSON.stringify(receipts));
    } catch (error) {
      console.error('Failed to save receipt:', error);
    }
  }

  /**
   * Get saved receipts from localStorage
   * @returns Object containing saved receipts
   */
  getSavedReceipts(): Record<string, string> {
    try {
      const receipts = localStorage.getItem('paymentReceipts');
      return receipts ? JSON.parse(receipts) : {};
    } catch (error) {
      console.error('Failed to retrieve receipts:', error);
      return {};
    }
  }

  /**
   * Get a specific receipt by ID
   * @param receiptId - Receipt identifier
   * @returns Receipt content or null if not found
   */
  getReceipt(receiptId: string): string | null {
    const receipts = this.getSavedReceipts();
    return receipts[receiptId] || null;
  }

  /**
   * Trigger download of receipt as text file
   * @param receiptContent - Content of the receipt
   * @param filename - Name of the file to download
   */
  downloadReceipt(receiptContent: string, filename: string): void {
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
const receiptService = new ReceiptService();
export default receiptService;