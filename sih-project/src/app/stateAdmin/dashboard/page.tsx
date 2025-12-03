"use client";
import MapDashboard from "@/app/components/MapDashboard";
import CampusRankingTable from "@/app/components/CampusRankingTable";

export default function StateAdminDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            State Energy Overview
          </h1>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            Real-time monitoring across all campuses
          </div>
        </div>

        {/* 50 - 50 SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT HALF = MAP */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-1 border border-slate-200 dark:border-slate-800">
            <MapDashboard />
          </div>

          {/* RIGHT HALF = TABLE */}
          <CampusRankingTable />

        </div>
      </div>
    </main>
  );
}

