import { Outlet } from 'react-router-dom';

export default function AILayout() {
  // Phase 3 will add AINavigation and AIFooter here.
  // For now, just a placeholder so the route tree compiles and the
  // root path can render its Coming Soon page.
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
}
