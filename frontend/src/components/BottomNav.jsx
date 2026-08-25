import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  // Hide bottom nav on full-screen exercise engine or active battle
  const hidePaths = ['/exercise/', '/placement-test'];
  if (hidePaths.some(p => location.pathname.startsWith(p))) {
    return null;
  }

  const navItems = [
    { to: '/', label: 'Home', tamil: 'முகப்பு', icon: 'home' },
    { to: '/learn', label: 'Learn', tamil: 'கற்றல்', icon: 'menu_book' },
    { to: '/chat', label: 'Chat', tamil: 'அரங்கம்', icon: 'forum' },
    { to: '/ai-tutor', label: 'AI Tutor', tamil: 'ஆசிரியர்', icon: 'smart_toy' },
    { to: '/progress', label: 'Progress', tamil: 'முன்னேற்றம்', icon: 'insights' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-surface-variant/50 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto h-16 flex items-stretch justify-around px-1 xs:px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-1 min-w-0 flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-primary scale-105 font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-9 xs:w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-primary-fixed' : 'bg-transparent'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className="text-[9px] xs:text-[10px] tracking-tight mt-0.5 leading-none max-w-full truncate px-0.5">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
