import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

const RoleBasedRedirect = ({ children }: RoleBasedRedirectProps) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && role) {
      // If authenticated, redirect based on role
      if (role === 'member') {
        navigate('/member/dashboard');
      } else if (['block_admin', 'district_admin', 'state_admin', 'super_admin'].includes(role)) {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, role, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, render children (access selection page)
  // If authenticated but no role yet, render children
  return <>{children}</>;
};

export default RoleBasedRedirect;