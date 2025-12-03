"use client";
import { useState } from "react";
import MapDashboard from "@/app/components/MapDashboard";
import CampusRankingTable from "@/app/components/CampusRankingTable";

// Centralized Data
const CAMPUS_DATA = [
  {
    id: 1,
    name: "Jaipur University",
    latitude: 26.9124,
    longitude: 75.7873,
    renewable_usage: 65,
    details_url: "/campus/1/details",
  },
  {
    id: 2,
    name: "Udaipur Tech Campus",
    latitude: 24.5854,
    longitude: 73.7125,
    renewable_usage: 80,
    details_url: "/campus/2/details",
  },
];

export default function StateAdminDashboard() {
  // State to track which row was clicked
  const [selectedCampus, setSelectedCampus] = useState(null);

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

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: MAP (Receives the selected campus to zoom in) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-1 border border-slate-200 dark:border-slate-800">
            <MapDashboard 
              campuses={CAMPUS_DATA} 
              selectedCampus={selectedCampus} 
            />
          </div>

          {/* RIGHT: TABLE (Updates state when row is clicked) */}
          {/* Note: Ensure your Table component accepts an `onRowClick` prop and calls it on <tr onClick> */}
          <CampusRankingTable 
            campuses={CAMPUS_DATA}
            onRowClick={(campus) => setSelectedCampus(campus)} 
          />

        </div>
      </div>
    </main>
  );
}

