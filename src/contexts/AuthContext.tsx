import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthTokenPayload, UserRole, verifyToken } from '@/utils/jwt';

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthTokenPayload | null;
  role: UserRole | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to wrap the application
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthTokenPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        setIsAuthenticated(true);
        setUser(decoded);
      } else {
        // Token is invalid or expired, remove it
        localStorage.removeItem('authToken');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function - stores the token and updates state
  const login = (token: string) => {
    const decoded = verifyToken(token);
    if (decoded) {
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
      setUser(decoded);
    }
  };

  // Logout function - clears token and resets state
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Expose the context value
  const value = {
    isAuthenticated,
    user,
    role: user?.role || null,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};