import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/utils/jwt';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect if user role doesn't match required roles
    if (isAuthenticated && requiredRoles && role && !requiredRoles.includes(role)) {
      // Redirect based on user role
      switch (role) {
        case 'member':
          navigate('/member/dashboard');
          break;
        case 'block_admin':
          navigate('/admin/dashboard');
          break;
        case 'district_admin':
          navigate('/admin/dashboard');
          break;
        case 'state_admin':
          navigate('/admin/dashboard');
          break;
        case 'super_admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/login');
      }
    }
  }, [isAuthenticated, role, requiredRoles, navigate, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated and has the required role, render children
  if (isAuthenticated) {
    // If no specific roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return <>{children}</>;
    }

    // If user role is in the required roles, allow access
    if (role && requiredRoles.includes(role)) {
      return <>{children}</>;
    }
  }

  // Return null while redirecting
  return null;
};

export default ProtectedRoute;