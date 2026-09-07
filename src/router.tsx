import { createBrowserRouter, Navigate } from 'react-router';

import BookingItemPage from './pages/BookingItemPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './pages/ProtectedRoute';
import PublicBookingPage from './pages/PublicBookingPage';
import RootPage from './pages/RootPage';
import SchedulePage from './pages/SchedulePage';
import SignupPage from './pages/SignupPage';
import UserSettingsPage from './pages/UserSettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootPage,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        Component: ProtectedRoute,
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
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'signup',
        Component: SignupPage,
      },
      {
        path: 'book/:slug',
        Component: PublicBookingPage,
      },
    ],
  },
]);
