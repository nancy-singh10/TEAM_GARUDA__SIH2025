'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Zap, LayoutDashboard, Radio, Bot, Download, User, LogOut, Settings, MapPin, Mail, Building, Moon, Sun } from 'lucide-react';

type CampusUser = {
  admin_name: string;
  campus_name: string;
  email: string;
  location: string;
  username: string;
  campus_admin_id?: string;
};

export default function HeaderCampus({ user }: { user: CampusUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State to hold the user data, initialized with prop but can update from localStorage
  const [currentUser, setCurrentUser] = useState<CampusUser | null>(user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If no user prop (server failed to fetch), try client-side storage
    if (!user) {
      try {
        const sessionStr = localStorage.getItem('sessionUser');
        if (sessionStr) {
          const sessionUser = JSON.parse(sessionStr);
          setCurrentUser(sessionUser);
        }
      } catch (e) {
        console.error("Error parsing session user", e);
      }
    } else {
      setCurrentUser(user);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide header on auth pages
  if (pathname.includes('/auth')) {
    return null;
  }

  const handleLogout = async () => {
    // 1. Attempt to clear cookie client-side (works if not HttpOnly)
    document.cookie = "campus_admin_id=; path=/; max-age=0";

    // Clear local storage
    localStorage.removeItem('sessionUser');

    // 2. Call logout API (Optional: Implement /api/campusAdmin/logout for HttpOnly cookies)
    try {
      await fetch('/api/campusAdmin/logout', { method: 'POST' });
    } catch (e) {
      // Ignore error if route doesn't exist yet
    }

    // 3. Redirect to Home
    router.push('/');
    router.refresh();
  };

  // Default values if user is null (fallback)
  const displayName = currentUser?.admin_name || currentUser?.username || 'Admin';
  const displayCampus = currentUser?.campus_name || 'Default Campus';
  const displayEmail = currentUser?.email || 'admin@campus.edu';
  const displayLocation = currentUser?.location || 'Campus Location';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-900 dark:text-white leading-none">
                Energy<span className="text-emerald-500">Dashboard</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Campus Energy Management</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/campusAdmin/dashboard" className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-200">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/campusAdmin/iot" className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
              <Radio className="w-4 h-4" /> IoT
            </Link>
            <Link href="/campusAdmin/ai" className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
              <Bot className="w-4 h-4" /> Chatbot
            </Link>
            <Link href="/campusAdmin/export" className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Export Report
            </Link>
          </nav>

          {/* Right Section: Theme Toggle & Profile */}
          <div className="flex items-center gap-4" ref={dropdownRef}>
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <span className="font-bold text-lg">{displayName[0]?.toUpperCase()}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animation-fade-in origin-top-right">
                  {/* User Header */}
                  <div className="bg-emerald-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold backdrop-blur-sm">
                        {displayName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{displayName}</h3>
                        <p className="text-emerald-100 text-xs font-medium">@{currentUser?.username || 'admin'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Campus</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{displayCampus}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate w-48">{displayEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{displayLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <Link href="/campusAdmin/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded-xl transition-all">
                      <Settings className="w-4 h-4" /> View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}