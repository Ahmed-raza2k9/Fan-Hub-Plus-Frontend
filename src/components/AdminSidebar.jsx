import React, { useMemo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Star,
  Users,
  Layers,
  Film,
  UserCheck,
  ShoppingBag,
  Calendar,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  Flame,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useData } from '../context/DataContext';

const GROUPS = [
  {
    label: 'Insights',
    items: [
      { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
      { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp }
    ]
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Categories', path: '/admin/categories', icon: Layers },
      { name: 'Content', path: '/admin/content', icon: Film },
      { name: 'Characters', path: '/admin/characters', icon: UserCheck },
      { name: 'Merchandise', path: '/admin/merchandise', icon: ShoppingBag },
      { name: 'Events', path: '/admin/events', icon: Calendar }
    ]
  },
  {
    label: 'Community',
    items: [
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Ratings', path: '/admin/ratings', icon: Star },
      { name: 'Submissions', path: '/admin/fan-submissions', icon: Sparkles, badgeKey: 'subs' },
      { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare, badgeKey: 'fb' }
    ]
  }
];

export default function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { fanSubmissions = [], feedbackList = [] } = useData();
  const location = useLocation();

  const badges = useMemo(
    () => ({
      subs: fanSubmissions.filter((s) => s.status === 'pending').length,
      fb: feedbackList.filter((f) => f.status === 'pending').length
    }),
    [fanSubmissions, feedbackList]
  );

  const navClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-colors ${
      collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
    } ${
      isActive
        ? 'bg-[#ff2e63]/12 text-white'
        : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
    }`;

  const renderLink = (item) => {
    const badge = item.badgeKey ? badges[item.badgeKey] : 0;
    const isActive = item.exact
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.path);
    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.exact}
        title={collapsed ? item.name : undefined}
        onClick={onCloseMobile}
        className={navClass}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r bg-[#ff2e63]" />
        )}
        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#ff2e63]' : ''}`} />
        {!collapsed && <span className="truncate">{item.name}</span>}
        {!collapsed && badge > 0 && (
          <span className="ml-auto min-w-[1.25rem] h-5 px-1.5 rounded-md bg-[#ff2e63] text-[10px] font-semibold text-white flex items-center justify-center">
            {badge}
          </span>
        )}
      </NavLink>
    );
  };

  const brand = (
    <Link to="/admin" onClick={onCloseMobile} className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-1' : 'px-2'}`}>
      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff2e63] to-[#d6004c] flex items-center justify-center shrink-0">
        <Flame className="w-4 h-4 text-white fill-white" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block text-[13px] font-semibold text-white leading-none">Fan Hub Plus</span>
          <span className="block text-[10px] text-stone-500 mt-1 uppercase tracking-wider">Admin</span>
        </span>
      )}
    </Link>
  );

  const nav = (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-5 scrollbar-none">
      {GROUPS.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-600">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">{group.items.map(renderLink)}</div>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className={`pt-3 mt-auto border-t border-white/[0.06] space-y-1 ${collapsed ? 'px-0' : ''}`}>
      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-stone-500 hover:text-white hover:bg-white/[0.04]"
      >
        {collapsed ? <PanelLeft className="w-4 h-4 mx-auto" /> : (
          <>
            <PanelLeftClose className="w-4 h-4" />
            <span>Collapse</span>
          </>
        )}
      </button>
      <Link
        to="/"
        onClick={onCloseMobile}
        className={`flex items-center gap-3 rounded-lg text-[13px] text-stone-500 hover:text-white hover:bg-white/[0.04] ${
          collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        {!collapsed && <span>Back to site</span>}
      </Link>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-white/[0.06] bg-[#070103] h-[100dvh] sticky top-0 p-3 transition-[width] duration-200 overflow-x-hidden ${
          collapsed ? 'w-[72px]' : 'w-[228px]'
        }`}
      >
        <div className="mb-6 pt-1">{brand}</div>
        {nav}
        {footer}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/75"
            aria-label="Close navigation"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-[268px] max-w-[85vw] h-full bg-[#070103] border-r border-white/[0.06] p-4 flex flex-col">
            <div className="mb-6">{brand}</div>
            {nav}
            {footer}
          </aside>
        </div>
      )}
    </>
  );
}
