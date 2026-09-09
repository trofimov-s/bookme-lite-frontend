import { createBrowserRouter, Outlet, redirect } from 'react-router';

import BookingItemPage from './pages/BookingItemPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './pages/ProtectedRoute';
import PublicBookingPage from './pages/PublicBookingPage';
import RootLayout from './pages/RootLayout';
import SchedulePage from './pages/SchedulePage';
import SignupPage from './pages/SignupPage';
import UserSettingsPage from './pages/UserSettingsPage';
import Loader from './shared/components/Loader';
import { useAuthStore } from './shared/store/auth.store';

const guestOnlyLoader = async () => {
  const isAuth = await useAuthStore.getState().checkAuth();

  if (isAuth) {
    return redirect('/bookings');
  }

  return null;
};

const protectedLoader = async () => {
  const isAuth = await useAuthStore.getState().checkAuth();

  if (!isAuth) {
    return redirect('/login');
  }

  return null;
};

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      // PUBLIC
      {
        path: 'book/:slug',
        Component: PublicBookingPage,
      },

      // INDEX PATH
      {
        path: '/',
        element: <Outlet />,
        HydrateFallback: () => <Loader />,
        loader: async () => {
          const isAuth = await useAuthStore.getState().checkAuth();

          return redirect(isAuth ? '/bookings' : '/login');
        },
      },

      // GUEST ROUTES
      {
        element: <Outlet />,
        loader: guestOnlyLoader,
        HydrateFallback: () => <Loader />,
        children: [
          {
            path: 'login',
            Component: LoginPage,
          },
          {
            path: 'signup',
            Component: SignupPage,
          },
        ],
      },

      // PRIVATE ROUTES
      {
        Component: ProtectedRoute,
        HydrateFallback: () => <Loader />,
        loader: protectedLoader,
        children: [
          {
            path: 'bookings',
            Component: BookingsPage,
          },
          {
            path: 'bookings/:id',
            Component: BookingItemPage,
          },
          {
            path: 'settings',
            Component: UserSettingsPage,
          },
          {
            path: 'schedule',
            Component: SchedulePage,
          },
        ],
      },

      // NOT FOUND ROUTE
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);
