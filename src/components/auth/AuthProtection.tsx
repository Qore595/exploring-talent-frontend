
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/context/AuthContext';
import { hasPermission } from '@/utils/adminPermissions';

interface AuthProtectionProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const AuthProtection = ({ children, allowedRoles = [] }: AuthProtectionProps) => {
  const { user } = useAuth();

  if (!user) {
    console.log('AuthProtection - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has permission (admin always has permission)
  const hasAccess = hasPermission(user.role, allowedRoles);
  console.log('AuthProtection - Has permission:', hasAccess);

  if (hasAccess) {
    return <>{children}</>;
  }

  // If user doesn't have required role, redirect to dashboard
  console.log('AuthProtection - Insufficient permissions, redirecting to dashboard');
  return <Navigate to="/dashboard" replace />;
};

export default AuthProtection;
