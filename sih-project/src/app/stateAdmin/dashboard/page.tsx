"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PerformanceChart from "../analytics/performance-chart";
import GenerationChart from "../analytics/generation-chart";

interface SessionUser {
  id: number;
  username: string;
}

export default function StateAdminDashboard() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sessionUser");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  // Dashboard state — initialized with demo values and replaced by API response when available
  const [solar, setSolar] = useState<number>(50.6);
  const [wind, setWind] = useState<number>(11.5);
  const [batteryPercent, setBatteryPercent] = useState<number>(79);
  const [grid, setGrid] = useState<number>(4.2);
  const [renewablePct, setRenewablePct] = useState<number>(60.7);

  const [performanceData, setPerformanceData] = useState<any[]>([
    { name: "00:00", Consumption: 40, "Solar Gen": 0, "Wind Gen": 6 },
    { name: "04:00", Consumption: 38, "Solar Gen": 0, "Wind Gen": 7 },
    { name: "08:00", Consumption: 70, "Solar Gen": 30, "Wind Gen": 5 },
    { name: "12:00", Consumption: 110, "Solar Gen": 65, "Wind Gen": 6 },
    { name: "16:00", Consumption: 130, "Solar Gen": 40, "Wind Gen": 5 },
    { name: "20:00", Consumption: 95, "Solar Gen": 10, "Wind Gen": 6 },
    { name: "23:00", Consumption: 50, "Solar Gen": 0, "Wind Gen": 6 },
  ]);

  const [generationBreakdown, setGenerationBreakdown] = useState<any[]>([
    { name: "Solar", value: 50600, fill: "#FDE68A" },
    { name: "Wind", value: 11500, fill: "#BFDBFE" },
    { name: "Grid", value: 4200, fill: "#E9D5FF" },
  ]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/state-admin/metrics");
        if (!res.ok) throw new Error("Failed to load metrics");
        const json = await res.json();
        setSolar(json.solar ?? solar);
        setWind(json.wind ?? wind);
        setBatteryPercent(json.batteryPercent ?? batteryPercent);
        setGrid(json.grid ?? grid);
        setRenewablePct(json.renewablePct ?? renewablePct);
        if (Array.isArray(json.performanceData)) setPerformanceData(json.performanceData);
        if (Array.isArray(json.generationBreakdown)) setGenerationBreakdown(json.generationBreakdown);
      } catch (err) {
        // keep demo values on error
      } finally {
        setLoading(false);
      }
    }

    load();
    const iv = setInterval(load, 60_000); // refresh every minute
    return () => clearInterval(iv);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back, {user?.username ?? "pratik"}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-3 bg-white border border-slate-100 rounded-full px-3 py-1">
              <span className="text-sm text-slate-600">{renewablePct}% Renewable</span>
            </div>
            <button className="bg-white border rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Export Report</button>
            <button className="bg-white border rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">☼</button>
            <Link href="/admin/auth" className="text-sm text-red-600">Logout</Link>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-yellow-50 rounded-xl p-6 shadow flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-700">Solar Generation</p>
              <h3 className="text-2xl font-semibold text-amber-700">{solar} kW</h3>
              <p className="text-xs text-amber-600 mt-1">+12% from yesterday</p>
            </div>
            <div className="text-amber-500 self-end">☀️</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-700">Wind Generation</p>
              <h3 className="text-2xl font-semibold text-sky-700">{wind} kW</h3>
              <p className="text-xs text-slate-500 mt-1">Wind speed: 6.2 m/s</p>
            </div>
            <div className="text-sky-500 self-end">🌬️</div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-6 shadow flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-700">Battery Status</p>
              <h3 className="text-2xl font-semibold text-emerald-700">{batteryPercent}%</h3>
              <div className="w-full bg-slate-100 rounded-full h-3 mt-3 overflow-hidden">
                <div className="h-3 bg-emerald-500" style={{ width: `${batteryPercent}%` }} />
              </div>
            </div>
            <div className="text-emerald-500 self-end">🔋</div>
          </div>

          <div className="bg-violet-50 rounded-xl p-6 shadow flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-700">Grid Exchange</p>
              <h3 className="text-2xl font-semibold text-violet-700">{grid} kW</h3>
              <p className="text-xs text-slate-500 mt-1">Importing from grid</p>
            </div>
            <div className="text-violet-500 self-end">⚡</div>
          </div>
        </div>

        {/* Main panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Energy Generation & Demand (24h)</h2>
            <p className="text-sm text-slate-500 mb-4">Real-time monitoring of campus energy flow</p>
            <div style={{ height: 360 }}>
              <PerformanceChart data={performanceData} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-2">7-Day Energy Forecast</h2>
            <p className="text-sm text-slate-500 mb-4">Predicted generation based on weather patterns</p>
            <div style={{ height: 300 }}>
              <GenerationChart data={generationBreakdown} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

