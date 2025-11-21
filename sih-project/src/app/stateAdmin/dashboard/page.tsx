"use client";
import MapDashboard from "@/app/components/MapDashboard";
import { ModeToggle } from "@/app/components/ModeToggle";

export default function StateAdminDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">State Energy Overview</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Real-time monitoring across all campuses
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-1">
          <MapDashboard />
        </div>
      </div>
    </main>
  );
}
