import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronRight } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../context/AuthContext';

const TITLES = {
  '/admin': 'Overview',
  '/admin/analytics': 'Analytics',
  '/admin/ratings': 'Ratings',
  '/admin/users': 'Users',
  '/admin/categories': 'Categories',
  '/admin/content': 'Content',
  '/admin/characters': 'Characters',
  '/admin/merchandise': 'Merchandise',
  '/admin/events': 'Events',
  '/admin/fan-submissions': 'Fan submissions',
  '/admin/feedback': 'Feedback'
};

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const match = Object.keys(TITLES)
      .sort((a, b) => b.length - a.length)
      .find((path) => location.pathname === path);
    return TITLES[match] || 'Admin';
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (currentUser?.name || 'A')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="admin-shell flex min-h-[100dvh]">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col bg-[#0a0204]">
        <header className="sticky top-0 z-30 h-16 border-b border-white/[0.06] bg-[#0a0204]/90 backdrop-blur-md flex items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-2 -ml-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/5"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <nav className="flex items-center gap-1.5 text-xs text-stone-500 min-w-0">
              <span className="hidden sm:inline">Admin</span>
              <ChevronRight className="w-3 h-3 hidden sm:block shrink-0" />
              <span className="text-white font-medium truncate">{pageTitle}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-xs font-medium text-white truncate max-w-[10rem]">{currentUser?.name || 'Admin'}</p>
              <p className="text-[10px] text-stone-500 truncate max-w-[10rem]">{currentUser?.email}</p>
            </div>
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className="w-8 h-8 rounded-lg object-cover border border-white/10"
              />
            ) : (
              <span className="w-8 h-8 rounded-lg bg-[#ff2e63]/15 text-[#ff2e63] text-[11px] font-semibold flex items-center justify-center border border-[#ff2e63]/20">
                {initials}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
