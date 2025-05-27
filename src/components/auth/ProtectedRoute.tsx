import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';
import { UserRole } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading, isGuest } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Allow guest access if no specific role is required
  if (isGuest && !requiredRole) {
    return <>{children}</>;
  }

  if (!user && !isGuest) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}