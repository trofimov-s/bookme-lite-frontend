import { Outlet, useNavigate } from 'react-router';

import { apiClient } from '@/api/client';
import { useAuthStore } from '@/shared/store/auth.store';

function ProtectedRoute() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  // temporary logout solution
  const logoutHandler = () => {
    apiClient
      .post<{ ok: boolean }>('/auth/logout', null)
      .then(() => {
        logout();
        navigate('/login', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <div>
      <div>
        <button onClick={logoutHandler}>Logout</button>
      </div>
      <Outlet />
    </div>
  );
}

export default ProtectedRoute;
