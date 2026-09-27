import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Compass, Users, Calendar, PlaySquare, PlusCircle } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('fanhub_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('fanhub_sidebar_collapsed', String(next));
      } catch (e) {
        // Fallback gracefully if localStorage is unavailable
      }
      return next;
    });
  };

  const mobileNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Submit', path: '/submit', icon: PlusCircle },
    { name: 'Characters', path: '/characters', icon: Users },
    { name: 'Media', path: '/media', icon: PlaySquare }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-page)] flex flex-col selection:bg-[#ff2e63] selection:text-white transition-colors duration-300 overflow-x-clip">
      <Navbar />
      <div className="pt-16 flex-1 flex flex-col w-full min-h-screen">
        <div className="flex-1 flex w-full relative">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
          
          {/* Main content container resizes automatically based on Sidebar width */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
            <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1680px] w-full pb-16 md:pb-8 mx-auto">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>

      {/* Mobile App Bottom Navigation (Hidden on Desktop/Tablet >= md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080306]/95 backdrop-blur-xl border-t border-red-500/30 px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 xs:px-3 rounded-xl text-[10px] font-bold transition-all select-none ${
                  isActive
                    ? 'text-red-400 scale-105 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] font-black'
                    : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
