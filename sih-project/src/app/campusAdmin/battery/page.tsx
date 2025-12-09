"use client";

import { ArrowLeft, Battery, TrendingUp, Calendar, Zap, BatteryCharging, Activity, BarChart3, Thermometer, Heart, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabaseClient";

export default function BatteryPage() {
  const [activeTab, setActiveTab] = useState<"charge" | "cells" | "temperature" | "health">("charge");

  const [batteryData, setBatteryData] = useState({
    current: 81,
    capacity: 2000,
    stored: 1620,
    charging: true,
    chargeRate: 15.3,
    health: 94,
    cycleCount: 342,
  });

  const [hourlyStatus, setHourlyStatus] = useState<any[]>([]);
  const [cellVoltages, setCellVoltages] = useState<any[]>([
    { id: 1, voltage: 3.82, temp: 28.0, status: "normal" },
    { id: 2, voltage: 3.81, temp: 28.2, status: "normal" },
    { id: 3, voltage: 3.82, temp: 28.1, status: "normal" },
    { id: 4, voltage: 3.80, temp: 27.9, status: "normal" },
    { id: 5, voltage: 3.81, temp: 28.0, status: "normal" },
    { id: 6, voltage: 3.82, temp: 28.2, status: "normal" },
    { id: 7, voltage: 3.81, temp: 27.9, status: "normal" },
    { id: 8, voltage: 3.82, temp: 28.1, status: "normal" },
  ]);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let mounted = true;

    const updateDashboard = (logs: any[]) => {
      if (!logs || logs.length === 0) return;

      const latest = logs[logs.length - 1];
      const pct = Number(latest.battery_percentage);
      const output = Number(latest.battery_output); // Discharge KW

      // Logic: If output > 0, Discharging. Else Charging.
      // Rate: If Discharging, rate = output. If Charging, simulate ~150kW or derive.
      const isCharging = output === 0;
      const rate = isCharging ? 150.5 : output;

      // Calculate Cycles: 342 + sum(output / capacity)
      const totalDischarge = logs.reduce((acc: number, l: any) => acc + Number(l.battery_output || 0), 0);
      const additionalCycles = totalDischarge / 2000;

      if (mounted) {
        setBatteryData({
          current: pct,
          capacity: 2000,
          stored: Math.round(2000 * (pct / 100)),
          charging: isCharging,
          chargeRate: Math.round(rate * 10) / 10,
          health: 94, // Static for MVP
          cycleCount: Math.floor(342 + additionalCycles)
        });

        // Hourly Status
        const history = logs.map((l: any) => ({
          hour: l.simulation_time,
          level: Number(l.battery_percentage),
          status: Number(l.battery_output) > 0 ? "discharging" : "charging"
        }));
        setHourlyStatus(history);

        // Update Cells based on %
        // 0% -> 3.2V, 100% -> 4.2V
        const baseV = 3.2 + (pct / 100) * 1.0;
        setCellVoltages(prev => prev.map(c => ({
          ...c,
          voltage: Number((baseV + (Math.random() * 0.05 - 0.025)).toFixed(2)),
          temp: Number((28 + (isCharging ? 2 : 0) + Math.random()).toFixed(1))
        })));
      }
    };

    const init = async () => {
      try {
        const { data, error } = await supabase
          .from('digital_twin_simulation_logs')
          .select('*')
          .eq('campus_id', 'CAMPUS_001')
          .eq('simulation_date', todayStr)
          .order('id', { ascending: true });

        if (error) throw error;
        updateDashboard(data || []);
      } catch (e) {
        console.error("Battery Data Error", e);
      }
    };
    init();

    const sub = supabase
      .channel('battery-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'digital_twin_simulation_logs', filter: `campus_id=eq.CAMPUS_001` },
        (payload) => {
          if (payload.new.simulation_date === todayStr) {
            // Initial fetch gets all, subscription adds one by one.
            // For simplicity, re-invoking update with accumulated logic inside state setter might be complex.
            // We will just fetch the latest single row and update state incrementally.
            const newLog = payload.new;

            // To update cycles correctly including history, we'd need the full history or keep a running sum.
            // Let's do a quick re-fetch for accuracy or just maintain state.
            // Re-fetching 24 rows is cheap and robust.
            init();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, []);

  // Temperature monitoring data (hourly from 12:00 to 14:00)
  const thermalData = [
    { time: "12:00", cell1: 28.1, cell8: 28.2, pack: 28.0 },
    { time: "02:00", cell1: 27.9, cell8: 28.0, pack: 27.8 },
    { time: "04:00", cell1: 27.5, cell8: 27.6, pack: 27.4 },
    { time: "06:00", cell1: 27.8, cell8: 27.9, pack: 27.6 },
    { time: "08:00", cell1: 29.2, cell8: 29.4, pack: 29.0 },
    { time: "10:00", cell1: 31.5, cell8: 31.8, pack: 31.3 },
    { time: "12:00", cell1: 33.8, cell8: 34.2, pack: 33.5 },
    { time: "14:00", cell1: 34.2, cell8: 34.5, pack: 33.9 },
  ];

  // Health radar data
  const healthMetrics = {
    capacity: 95.2,
    voltageBalance: 98.5,
    resistance: 92.1,
    temperature: 96.8,
    cycleLife: 93.2,
  };

  // Efficiency data (20 cycles)
  const efficiencyData = Array.from({ length: 20 }, (_, i) => ({
    cycle: i,
    charge: 97 + Math.random() * 1.5,
    discharge: 97.5 + Math.random() * 1.5,
    roundTrip: 93 + Math.random() * 2,
  }));



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/campusAdmin/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg">
              <Battery className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                Battery Storage
              </h1>
              <p className="text-muted-foreground mt-1">Energy storage system status and performance</p>
            </div>
          </div>
        </motion.div>

        {/* Main Battery Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 shadow-2xl text-white mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-emerald-100 mb-2">Current Charge Level</div>
              <div className="text-6xl font-bold">{batteryData.current}%</div>
            </div>
            <motion.div
              animate={{ rotate: batteryData.charging ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BatteryCharging className="h-16 w-16 text-emerald-200" />
            </motion.div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-6 overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${batteryData.current}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-white rounded-full flex items-center justify-center"
            >
              <span className="text-xs font-bold text-emerald-600">{batteryData.stored} kWh</span>
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-sm text-emerald-100">
            <span>0 kWh</span>
            <span>{batteryData.capacity} kWh Capacity</span>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
            <div>
              <div className="text-emerald-100 text-sm">Status</div>
              <div className="text-xl font-semibold">
                {batteryData.charging ? "⚡ Charging" : "📉 Discharging"}
              </div>
            </div>
            <div>
              <div className="text-emerald-100 text-sm">Rate</div>
              <div className="text-xl font-semibold">{batteryData.chargeRate} kW</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-border overflow-x-auto mb-8"
        >
          <button
            onClick={() => setActiveTab("charge")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "charge"
              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
          >
            <BarChart3 className="h-4 w-4" />
            Charge Profile
          </button>
          <button
            onClick={() => setActiveTab("cells")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "cells"
              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
          >
            <Battery className="h-4 w-4" />
            Cell Balance
          </button>
          <button
            onClick={() => setActiveTab("temperature")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "temperature"
              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
          >
            <Thermometer className="h-4 w-4" />
            Temperature Monitoring
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "health"
              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
          >
            <Heart className="h-4 w-4" />
            Health & Efficiency
          </button>
        </motion.div>

        {/* Charge Profile Tab */}
        {activeTab === "charge" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-emerald-100 dark:border-emerald-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Battery Health</span>
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-4xl font-bold text-emerald-600">{batteryData.health}%</div>
                <div className="text-sm text-muted-foreground mt-2">Excellent condition</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-emerald-100 dark:border-emerald-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Charge Cycles</span>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-4xl font-bold text-emerald-600">{batteryData.cycleCount}</div>
                <div className="text-sm text-muted-foreground mt-2">Out of 5000 rated</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-emerald-100 dark:border-emerald-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Stored Energy</span>
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-4xl font-bold text-emerald-600">{batteryData.stored} kWh</div>
                <div className="text-sm text-muted-foreground mt-2">Available now</div>
              </motion.div>
            </div>

            {/* Daily Pattern */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Daily Charge/Discharge Pattern
              </h2>
              <div className="space-y-4">
                {hourlyStatus.map((item, index) => (
                  <motion.div
                    key={item.hour}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">{item.hour}</div>
                      <div className={`text-xs px-2 py-1 rounded ${item.status === "charging"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        }`}>
                        {item.status === "charging" ? "⚡ Charging" : "📉 Discharging"}
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ duration: 1, delay: 0.9 + index * 0.08, ease: "easeOut" }}
                        className={`h-full ${item.status === "charging"
                          ? "bg-gradient-to-r from-emerald-400 to-green-600"
                          : "bg-gradient-to-r from-orange-400 to-red-500"
                          } flex items-center justify-end pr-3`}
                      >
                        <span className="text-xs font-semibold text-white">{item.level}%</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Cell Balance Tab */}
        {activeTab === "cells" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cell Voltage Monitor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
            >
              <h2 className="text-xl font-semibold mb-2">Cell Voltage Monitor</h2>
              <p className="text-sm text-muted-foreground mb-6">Individual cell performance</p>

              <div className="space-y-4">
                {cellVoltages.map((cell, index) => (
                  <motion.div
                    key={cell.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cell {cell.id}</span>
                      <div className="text-xs text-muted-foreground flex items-center gap-3">
                        <span>{cell.voltage}V</span>
                        <span>{cell.temp}°C</span>
                      </div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cell.voltage / 4.2) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.05, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-green-600"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-red-900 dark:text-red-100">1 Issue</div>
                  <div className="text-xs text-red-700 dark:text-red-300 mt-0.5">Cell 7 voltage slightly low</div>
                </div>
              </div>
            </motion.div>

            {/* Health Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl border border-slate-700"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">Health Radar</h2>
              <p className="text-sm text-slate-300 mb-6">Multi-point diagnostic scan</p>

              <div className="flex items-center justify-center h-80 bg-slate-900/50 rounded-lg p-6">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-sm">
                  {/* Pentagon outline (target) - Purple */}
                  <polygon
                    points="100,20 180,80 150,170 50,170 20,80"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    opacity="0.5"
                  />

                  {/* Health score pentagon - Emerald filled */}
                  <motion.polygon
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    points={`
                      100,${20 + (100 - healthMetrics.capacity) * 0.8}
                      ${180 - (100 - healthMetrics.resistance) * 1.6},${80 - (100 - healthMetrics.resistance) * 0.5}
                      ${150 - (100 - healthMetrics.cycleLife) * 1.0},${170 - (100 - healthMetrics.cycleLife) * 1.0}
                      ${50 + (100 - healthMetrics.temperature) * 1.0},${170 - (100 - healthMetrics.temperature) * 1.0}
                      ${20 + (100 - healthMetrics.voltageBalance) * 1.6},${80 - (100 - healthMetrics.voltageBalance) * 0.5}
                    `}
                    fill="#10b981"
                    opacity="0.6"
                  />
                  <motion.polygon
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    points={`
                      100,${20 + (100 - healthMetrics.capacity) * 0.8}
                      ${180 - (100 - healthMetrics.resistance) * 1.6},${80 - (100 - healthMetrics.resistance) * 0.5}
                      ${150 - (100 - healthMetrics.cycleLife) * 1.0},${170 - (100 - healthMetrics.cycleLife) * 1.0}
                      ${50 + (100 - healthMetrics.temperature) * 1.0},${170 - (100 - healthMetrics.temperature) * 1.0}
                      ${20 + (100 - healthMetrics.voltageBalance) * 1.6},${80 - (100 - healthMetrics.voltageBalance) * 0.5}
                    `}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />

                  {/* Labels - White text */}
                  <text x="100" y="15" textAnchor="middle" className="text-xs font-medium" fill="white">Capacity</text>
                  <text x="190" y="85" textAnchor="start" className="text-xs font-medium" fill="white">Resistance</text>
                  <text x="155" y="185" textAnchor="middle" className="text-xs font-medium" fill="white">Cycle Life</text>
                  <text x="45" y="185" textAnchor="middle" className="text-xs font-medium" fill="white">Temperature</text>
                  <text x="10" y="85" textAnchor="start" className="text-xs font-medium" fill="white">Voltage Bal</text>
                </svg>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                  <span className="text-sm text-slate-300">Health Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-sm opacity-50" />
                  <span className="text-sm text-slate-300">Target</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Temperature Monitoring Tab */}
        {activeTab === "temperature" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
          >
            <h2 className="text-xl font-semibold mb-2">Thermal Monitoring</h2>
            <p className="text-sm text-muted-foreground mb-6">Pack and individual cell temperatures</p>

            <div className="relative h-64 mb-8">
              <svg viewBox="0 0 800 200" className="w-full h-full">
                {/* Grid lines */}
                <line x1="40" y1="20" x2="40" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
                <line x1="40" y1="180" x2="780" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />

                {/* Y-axis labels */}
                <text x="30" y="25" textAnchor="end" className="text-xs fill-current text-muted-foreground">36</text>
                <text x="30" y="65" textAnchor="end" className="text-xs fill-current text-muted-foreground">27</text>
                <text x="30" y="145" textAnchor="end" className="text-xs fill-current text-muted-foreground">18</text>
                <text x="30" y="185" textAnchor="end" className="text-xs fill-current text-muted-foreground">9</text>

                {/* Temperature lines */}
                {/* Cell1 (orange) */}
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.4 }}
                  points={thermalData.map((d, i) => `${50 + i * 100},${180 - (d.cell1 - 18) * 8}`).join(" ")}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                {thermalData.map((d, i) => (
                  <circle key={`c1-${i}`} cx={50 + i * 100} cy={180 - (d.cell1 - 18) * 8} r="4" fill="#f97316" />
                ))}

                {/* Cell8 (blue) */}
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  points={thermalData.map((d, i) => `${50 + i * 100},${180 - (d.cell8 - 18) * 8}`).join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                {thermalData.map((d, i) => (
                  <circle key={`c8-${i}`} cx={50 + i * 100} cy={180 - (d.cell8 - 18) * 8} r="4" fill="#3b82f6" />
                ))}

                {/* Pack (emerald) */}
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.6 }}
                  points={thermalData.map((d, i) => `${50 + i * 100},${180 - (d.pack - 18) * 8}`).join(" ")}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                {thermalData.map((d, i) => (
                  <circle key={`p-${i}`} cx={50 + i * 100} cy={180 - (d.pack - 18) * 8} r="4" fill="#10b981" />
                ))}

                {/* X-axis labels */}
                {thermalData.map((d, i) => (
                  <text key={`x-${i}`} x={50 + i * 100} y="195" textAnchor="middle" className="text-xs fill-current text-muted-foreground">
                    {d.time}
                  </text>
                ))}
              </svg>

              {/* Hover tooltip simulation */}
              <div className="absolute top-1/3 left-1/4 bg-white dark:bg-slate-700 rounded-lg shadow-lg p-3 border border-border">
                <div className="text-xs font-semibold mb-1">12:00</div>
                <div className="text-xs text-orange-600">cell1 : 28.1</div>
                <div className="text-xs text-blue-600">cell8 : 28.2</div>
                <div className="text-xs text-emerald-600">pack : 28</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-sm text-muted-foreground">cell1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-muted-foreground">cell8</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-sm text-muted-foreground">pack</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Health & Efficiency Tab */}
        {activeTab === "health" && (
          <div className="space-y-6">
            {/* Efficiency Analysis Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
            >
              <h2 className="text-xl font-semibold mb-2">Efficiency Analysis</h2>
              <p className="text-sm text-muted-foreground mb-6">Round-trip energy efficiency</p>

              <div className="relative h-64 mb-8">
                <svg viewBox="0 0 800 200" className="w-full h-full">
                  {/* Grid */}
                  <line x1="40" y1="20" x2="40" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
                  <line x1="40" y1="180" x2="780" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />

                  {/* Y-axis */}
                  <text x="30" y="25" textAnchor="end" className="text-xs fill-current text-muted-foreground">100</text>
                  <text x="30" y="65" textAnchor="end" className="text-xs fill-current text-muted-foreground">97</text>
                  <text x="30" y="145" textAnchor="end" className="text-xs fill-current text-muted-foreground">89</text>
                  <text x="30" y="185" textAnchor="end" className="text-xs fill-current text-muted-foreground">85</text>

                  {/* Efficiency lines */}
                  {/* Charge (purple dashed) */}
                  <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.4 }}
                    points={efficiencyData.map((d, i) => `${50 + i * 37},${180 - (d.charge - 85) * 8}`).join(" ")}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />

                  {/* Discharge (orange dashed) */}
                  <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    points={efficiencyData.map((d, i) => `${50 + i * 37},${180 - (d.discharge - 85) * 8}`).join(" ")}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />

                  {/* Round trip (emerald solid) */}
                  <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.6 }}
                    points={efficiencyData.map((d, i) => `${50 + i * 37},${180 - (d.roundTrip - 85) * 8}`).join(" ")}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  {efficiencyData.filter((_, i) => i % 4 === 0).map((d, i) => (
                    <circle key={i} cx={50 + i * 148} cy={180 - (d.roundTrip - 85) * 8} r="3" fill="#10b981" />
                  ))}

                  {/* X-axis labels */}
                  {[0, 4, 8, 12, 16, 20].map((val) => (
                    <text key={val} x={50 + val * 37} y="195" textAnchor="middle" className="text-xs fill-current text-muted-foreground">
                      {val}
                    </text>
                  ))}
                </svg>
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-purple-500 border-dashed border-t-2 border-purple-500" />
                  <span className="text-sm text-muted-foreground">charge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-orange-500 border-dashed border-t-2 border-orange-500" />
                  <span className="text-sm text-muted-foreground">discharge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">roundTrip</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border text-center"
              >
                <div className="text-sm text-muted-foreground mb-2">TOTAL CYCLES</div>
                <div className="text-4xl font-bold text-emerald-600">2,847</div>
                <div className="text-xs text-muted-foreground mt-2">Life exp. 8,000</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border text-center"
              >
                <div className="text-sm text-muted-foreground mb-2">CAPACITY REM.</div>
                <div className="text-4xl font-bold text-purple-600">95.2%</div>
                <div className="text-xs text-muted-foreground mt-2">Nominal: 100Ah</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border text-center"
              >
                <div className="text-sm text-muted-foreground mb-2">OP. HOURS</div>
                <div className="text-4xl font-bold text-blue-600">12,456</div>
                <div className="text-xs text-muted-foreground mt-2">Since install</div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
