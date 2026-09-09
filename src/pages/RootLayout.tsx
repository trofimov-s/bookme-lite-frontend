import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <div>
      <span>RootLayout</span>
      <Outlet />
    </div>
  );
}

export default RootLayout;
