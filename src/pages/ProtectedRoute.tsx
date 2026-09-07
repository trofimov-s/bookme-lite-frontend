import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from '@/shared/store/auth.store';

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;
