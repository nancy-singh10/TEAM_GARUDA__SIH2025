"use client";
import { useState, useEffect } from "react";
import MapDashboard from "@/app/components/MapDashboard";
import CampusRankingTable from "@/app/components/CampusRankingTable";
import { supabase } from "@/lib/supabaseClient";

// Define interface for Campus Data
interface CampusData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  renewable_usage: number;
  details_url: string;
  location?: string;
  admin?: string;
}

export default function StateAdminDashboard() {
  // State to track which row was clicked
  const [selectedCampus, setSelectedCampus] = useState<CampusData | null>(null);
  const [campuses, setCampuses] = useState<CampusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Campus Admin Data
        const { data: campusData, error: campusError } = await supabase
          .from('campus_admin')
          .select(`
            campus_admin_id,
            campus_name,
            location,
            admin_name
          `);

        if (campusError) throw campusError;

        // 2. Fetch Campus Comparison Data (for renewable usage)
        const { data: comparisonData, error: comparisonError } = await supabase
          .from('campus_comparison')
          .select('campus_admin_id, renewable_energy_used');

        if (comparisonError) throw comparisonError;

        // Create a map for quick lookup of renewable usage
        const usageMap = new Map();
        comparisonData?.forEach(item => {
          usageMap.set(item.campus_admin_id, item.renewable_energy_used);
        });

        // 3. Process and Geocode Data
        const processedCampuses: CampusData[] = [];

        for (const campus of campusData || []) {
          let lat = 0;
          let lon = 0;

          // Geocode if location is available
          if (campus.location) {
            try {
              const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(campus.location)}`;
              const response = await fetch(url);
              const data = await response.json();

              if (data && data.length > 0) {
                lat = parseFloat(data[0].lat);
                lon = parseFloat(data[0].lon);
              }
            } catch (err) {
              console.error(`Failed to geocode location: ${campus.location}`, err);
            }
          }

          processedCampuses.push({
            id: campus.campus_admin_id,
            name: campus.campus_name,
            latitude: lat,
            longitude: lon,
            renewable_usage: usageMap.get(campus.campus_admin_id) || 0,
            details_url: `/campusAdmin/dashboard`,
            location: campus.location,
            admin: campus.admin_name
          });
        }

        setCampuses(processedCampuses);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            State Energy Overview
          </h1>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? "Loading real-time data..." : "Real-time monitoring across all campuses"}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: MAP (Receives the selected campus to zoom in) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-1 border border-slate-200 dark:border-slate-800">
            <MapDashboard
              campuses={campuses}
              selectedCampus={selectedCampus}
            />
          </div>

          {/* RIGHT: TABLE (Updates state when row is clicked) */}
          {/* Note: Ensure your Table component accepts an `onRowClick` prop and calls it on <tr onClick> */}
          <CampusRankingTable
            campuses={campuses}
            onRowClick={(campus: CampusData) => setSelectedCampus(campus)}
          />

        </div>
      </div>
    </main>
  );
}
