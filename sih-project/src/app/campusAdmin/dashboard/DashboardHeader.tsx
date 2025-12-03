'use client';

import { useState } from 'react';
import { LayoutDashboard, Radio, FileText, RefreshCw, UserCircle, Bell } from 'lucide-react';
import ProfileSlideOver from './ProfileSlideOver';
import { useRouter } from 'next/navigation';

export default function DashboardHeader({ user }: { user: any }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSimulating, setIsSimulating] = useState(false);
  const router = useRouter();

  const handleSimulate = async () => {
    setIsSimulating(true);
    // Simulate loading delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));
    // Trigger a refresh to fetch 'new' data if your DB updates on the backend
    router.refresh(); 
    setIsSimulating(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Branding */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 hidden md:block">
                Energy<span className="text-indigo-600">Orch</span>
              </span>
            </div>

            {/* Center: Navigation Bar */}
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-full border border-slate-200/50">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === 'dashboard' 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === 'simulator' 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                <Radio size={16} />
                IoT Simulator
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === 'report' 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                <FileText size={16} />
                Report
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {/* Simulate Button */}
              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm disabled:opacity-70"
              >
                <RefreshCw size={16} className={isSimulating ? "animate-spin" : ""} />
                <span className="hidden sm:inline">
                  {isSimulating ? 'Simulating...' : 'Simulate New Day'}
                </span>
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1"></div>

              {/* Profile Trigger */}
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-colors group"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {user?.full_name || 'Admin'}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-slate-500">
                    {user?.campus_name || 'Campus View'}
                  </p>
                </div>
                <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center overflow-hidden shadow-sm group-hover:ring-2 group-hover:ring-indigo-100 transition-all">
                  <UserCircle className="w-6 h-6 text-slate-400" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <ProfileSlideOver 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user}
      />
    </>
  );
}