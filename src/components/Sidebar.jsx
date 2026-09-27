import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  LayoutGrid,
  Users,
  FileText,
  Calendar,
  PlaySquare,
  ShoppingBag,
  Info,
  Sparkles,
  Bookmark,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  const mainNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Categories', path: '/categories', icon: LayoutGrid },
    { name: 'Articles', path: '/fan-creations', icon: FileText },
    { name: 'Characters', path: '/characters', icon: Users },
    { name: 'Media', path: '/media', icon: PlaySquare },
    { name: 'Merchandise', path: '/merchandise', icon: ShoppingBag },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'About', path: '/about', icon: Info }
  ];

  const userSpaceItems = [
    { name: 'My Bookmarks', path: '/bookmarks', icon: Bookmark, protected: true },
    { name: 'Profile Settings', path: '/profile', icon: User, protected: true },
    { name: 'Feedback & Support', path: '/feedback', icon: MessageSquare, protected: false }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)] border-r border-zinc-200 dark:border-red-950/40 bg-white dark:bg-[#070911] transition-all duration-300 ease-in-out select-none z-30 shrink-0 overflow-x-hidden ${
        isCollapsed ? 'w-20 p-2.5' : 'w-64 p-4'
      }`}
      aria-label="Main Navigation Sidebar"
    >
      {/* Sidebar Header: Branding & Toggle Button */}
      <div className={`flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-red-950/40 ${isCollapsed ? 'flex-col gap-3' : ''}`}>
        <div className="flex-1" />

        {/* Toggle Collapse Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Sidebar Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 pt-3 pr-0.5 scrollbar-none">
        {/* Submit Creation Primary CTA Button */}
        <div className="pt-1">
          <NavLink
            to="/submit"
            className={({ isActive }) =>
              `relative group flex items-center justify-center rounded-2xl font-bold transition-all duration-200 ${
                isCollapsed ? 'p-3' : 'px-4 py-2.5 gap-2.5'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/40 border border-white/20'
                  : 'bg-gradient-to-r from-red-600/90 to-rose-700/90 hover:from-red-500 hover:to-rose-600 text-white shadow-md shadow-red-600/25'
              }`
            }
          >
            <Sparkles className="w-4 h-4 text-white shrink-0 animate-pulse" />
            {!isCollapsed && <span className="text-xs tracking-wide">Submit Creation</span>}

            {/* Tooltip for Collapsed State */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                <div className="bg-[#150508] border border-red-500/40 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-2xl whitespace-nowrap flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>Submit Creation</span>
                </div>
              </div>
            )}
          </NavLink>
        </div>

        {/* Main Navigation Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <h4 className="px-3 text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-1.5">
              Menu
            </h4>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative group flex items-center rounded-2xl text-xs font-semibold transition-all duration-200 ${
                      isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white !text-white shadow-lg shadow-red-600/35 font-bold'
                        : 'text-zinc-800 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-red-950/30'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}

                  {/* Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                      <div className="bg-[#150508] border border-red-500/40 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-2xl whitespace-nowrap">
                        {item.name}
                      </div>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Space Section */}
        <div className="space-y-1 pt-2 border-t border-zinc-200 dark:border-red-950/40">
          {!isCollapsed && (
            <h4 className="px-3 text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-1.5">
              User Space
            </h4>
          )}
          <nav className="space-y-1">
            {userSpaceItems.map((item) => {
              const Icon = item.icon;
              if (item.protected && !isAuthenticated) return null;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative group flex items-center rounded-2xl text-xs font-semibold transition-all duration-200 ${
                      isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/35 font-bold'
                        : 'text-zinc-800 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-red-950/30'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}

                  {/* Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                      <div className="bg-[#150508] border border-red-500/40 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-2xl whitespace-nowrap">
                        {item.name}
                      </div>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer / User Profile State */}
      <div className="pt-3 mt-auto border-t border-zinc-200 dark:border-red-950/40">
        {isAuthenticated ? (
          <Link
            to="/profile"
            className={`flex items-center gap-2.5 min-w-0 group hover:opacity-90 transition-opacity ${isCollapsed ? 'justify-center' : ''}`}
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500/50 shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{currentUser?.email}</p>
              </div>
            )}
          </Link>
        ) : (
          !isCollapsed ? (
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-red-950/40 space-y-2 text-center">
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Join the Fandom Universe</p>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 py-1.5 text-xs font-bold rounded-xl text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 py-1.5 text-xs font-bold rounded-xl text-white bg-red-600 hover:bg-red-500 transition-colors shadow-sm"
                >
                  Join
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                to="/login"
                className="relative group p-2.5 rounded-2xl text-red-400 bg-red-950/30 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all"
              >
                <LogIn className="w-4 h-4" />
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                  <div className="bg-[#150508] border border-red-500/40 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-2xl whitespace-nowrap">
                    Log In
                  </div>
                </div>
              </Link>
            </div>
          )
        )}
      </div>
    </aside>
  );
}
