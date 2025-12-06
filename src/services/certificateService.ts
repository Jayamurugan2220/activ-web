// Certificate Service for generating and managing membership certificates

interface CertificateData {
  certificateId: string;
  memberId: string;
  memberName: string;
  membershipId: string;
  issueDate: string;
  expiryDate?: string; // For annual memberships
  validity: string; // e.g., "Lifetime" or "1 Year"
  qrCodeData: string; // Data to encode in QR code for verification
}

class CertificateService {
  /**
   * Generate a membership certificate
   * @param certificateData - Data needed to generate the certificate
   * @returns Promise with certificate content as string
   */
  async generateCertificate(certificateData: CertificateData): Promise<string> {
    const certificateContent = `
ACTIV ORGANIZATION
MEMBERSHIP CERTIFICATE
----------------------------------------

Certificate ID: ${certificateData.certificateId}
Member Name: ${certificateData.memberName}
Membership ID: ${certificateData.membershipId}
Issue Date: ${new Date(certificateData.issueDate).toLocaleDateString()}
${certificateData.expiryDate ? `Expiry Date: ${new Date(certificateData.expiryDate).toLocaleDateString()}` : ''}
Validity: ${certificateData.validity}

This certifies that the above-named person is a duly registered member of 
ACTIV Organization and is entitled to all the rights and privileges thereof.

QR Verification Code: ${certificateData.qrCodeData}

----------------------------------------
Authorized Signature: _________________
Date: ${new Date().toLocaleDateString()}

For verification, scan the QR code or visit:
https://activ.org/verify/${certificateData.certificateId}
    `.trim();

    return certificateContent;
  }

  /**
   * Save certificate to localStorage for later retrieval
   * @param certificateId - Unique certificate identifier
   * @param certificateContent - Content of the certificate
   */
  saveCertificate(certificateId: string, certificateContent: string): void {
    try {
      const certificates = this.getSavedCertificates();
      certificates[certificateId] = certificateContent;
      localStorage.setItem('membershipCertificates', JSON.stringify(certificates));
    } catch (error) {
      console.error('Failed to save certificate:', error);
    }
  }

  /**
   * Get saved certificates from localStorage
   * @returns Object containing saved certificates
   */
  getSavedCertificates(): Record<string, string> {
    try {
      const certificates = localStorage.getItem('membershipCertificates');
      return certificates ? JSON.parse(certificates) : {};
    } catch (error) {
      console.error('Failed to retrieve certificates:', error);
      return {};
    }
  }

  /**
   * Get a specific certificate by ID
   * @param certificateId - Certificate identifier
   * @returns Certificate content or null if not found
   */
  getCertificate(certificateId: string): string | null {
    const certificates = this.getSavedCertificates();
    return certificates[certificateId] || null;
  }

  /**
   * Trigger download of certificate as text file
   * @param certificateContent - Content of the certificate
   * @param filename - Name of the file to download
   */
  downloadCertificate(certificateContent: string, filename: string): void {
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate QR code data for certificate verification
   * In a real implementation, this would generate an actual QR code
   * @param certificateId - Certificate identifier
   * @param memberId - Member identifier
   * @returns QR code data string
   */
  generateQRCodeData(certificateId: string, memberId: string): string {
    // In a real implementation, this would generate an actual QR code
    // For now, we'll return a verification string
    return `VERIFY:${certificateId}:${memberId}:${Date.now()}`;
  }
}

// Export singleton instance
const certificateService = new CertificateService();
export default certificateService;