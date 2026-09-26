import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  Film,
  UserCheck,
  ShoppingBag,
  Calendar,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  Menu,
  X,
  Radio
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { fanSubmissions, feedbackList } = useData();

  const pendingSubmissions = fanSubmissions.filter(s => s.status === 'pending').length;
  const pendingFeedback = feedbackList.filter(f => f.status === 'pending').length;

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Content Catalog', path: '/admin/content', icon: Film },
    { name: 'Characters', path: '/admin/characters', icon: UserCheck },
    { name: 'Merchandise', path: '/admin/merchandise', icon: ShoppingBag },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Fan Submissions', path: '/admin/fan-submissions', icon: Sparkles, badge: pendingSubmissions },
    { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare, badge: pendingFeedback }
  ];

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-850">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white"
            aria-label="Open admin navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-white">Admin Management</span>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Exit
        </Link>
      </div>

      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-850 bg-zinc-950 min-h-[calc(100vh-64px)] p-4 shrink-0">
        <div className="mb-6 px-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Live Cluster Active
            </span>
          </div>
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400">
            System Control
          </h2>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-zinc-950">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 border-t border-zinc-900 mt-auto">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User Portal</span>
          </Link>
        </div>
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-full bg-zinc-950 h-full p-5 flex flex-col border-r border-zinc-850">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-850 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Admin Console</h3>
                <p className="text-[10px] text-emerald-400 font-mono">Live Cluster Active</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-zinc-950">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-zinc-900 mt-auto">
              <Link
                to="/"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to User Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
