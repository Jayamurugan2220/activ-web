// Custom JWT-like utility functions for frontend authentication
// Since this is a frontend-only implementation, we'll use a simplified approach

// User roles
export type UserRole = 'member' | 'block_admin' | 'district_admin' | 'state_admin' | 'super_admin';

// Extended token payload with user information
export interface AuthTokenPayload {
  userId: string;
  memberId: string;
  role: UserRole;
  email?: string;
  iat: number; // issued at timestamp
  exp: number; // expiration timestamp
}

/**
 * Generate a token for authenticated users
 * @param payload - User information to include in the token
 * @returns Token string (JSON encoded)
 */
export const generateToken = (payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string => {
  // Add issued at and expiration timestamps (24 hours)
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + (24 * 60 * 60); // 24 hours in seconds
  
  const tokenPayload: AuthTokenPayload = {
    ...payload,
    iat,
    exp
  };
  
  // Encode as base64 JSON string
  return btoa(JSON.stringify(tokenPayload));
};

/**
 * Verify a token and extract user information
 * @param token - Token string
 * @returns Decoded token payload or null if invalid/expired
 */
export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    // Decode base64 JSON string
    const jsonPayload = atob(token);
    const decoded = JSON.parse(jsonPayload) as AuthTokenPayload;
    
    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.error('Token has expired');
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

/**
 * Decode a token without verification (for debugging purposes)
 * @param token - Token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): AuthTokenPayload | null => {
  try {
    const jsonPayload = atob(token);
    return JSON.parse(jsonPayload) as AuthTokenPayload;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
};