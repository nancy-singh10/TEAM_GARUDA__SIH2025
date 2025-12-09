"use client";

import { ArrowLeft, Battery, TrendingUp, Calendar, Zap, BatteryCharging, Activity, BarChart3, Thermometer, Heart, AlertCircle, Flame, Ban, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import { supabase } from "@/lib/supabaseClient";

export default function BatteryPage() {
  const [activeTab, setActiveTab] = useState<"charge" | "cells" | "temperature" | "health">("charge");

  // --- OVERHEAT SIMULATION STATE ---
  const [showOverheatAlert, setShowOverheatAlert] = useState(false);
  const [isOverheated, setIsOverheated] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const isOverheatedRef = useRef(false); // Ref for subscription callback access

  const [batteryData, setBatteryData] = useState({
    current: 81,
    capacity: 2000,
    stored: 1620,
    charging: true,
    chargeRate: 15.3,
    health: 94,
    cycleCount: 342,
  });

  // --- CHART STATE (Dynamic) ---
  const [thermalData, setThermalData] = useState([
    { time: "12:00", cell1: 28.1, cell8: 28.2, pack: 28.0 },
    { time: "01:00", cell1: 28.0, cell8: 28.1, pack: 27.9 },
    { time: "02:00", cell1: 27.9, cell8: 28.0, pack: 27.8 },
    { time: "03:00", cell1: 27.8, cell8: 27.9, pack: 27.7 },
    { time: "04:00", cell1: 27.5, cell8: 27.6, pack: 27.4 },
    { time: "05:00", cell1: 27.6, cell8: 27.7, pack: 27.5 },
    { time: "06:00", cell1: 27.8, cell8: 27.9, pack: 27.6 },
    { time: "07:00", cell1: 28.5, cell8: 28.6, pack: 28.3 },
  ]);

  const [healthMetrics, setHealthMetrics] = useState({
    capacity: 95.2,
    voltageBalance: 98.5,
    resistance: 92.1,
    temperature: 96.8,
    cycleLife: 93.2,
  });

  const [efficiencyData, setEfficiencyData] = useState(() => Array.from({ length: 20 }, (_, i) => ({
    cycle: i,
    charge: 97 + Math.random() * 1.5,
    discharge: 97.5 + Math.random() * 1.5,
    roundTrip: 93 + Math.random() * 2,
  })));

  // --- SIMULATION TRIGGER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ',') {
        // Trigger sequence: Wait 2s then alert
        setTimeout(() => setShowOverheatAlert(true), 2000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- COOLDOWN TIMER ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOverheated && cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            // Cooldown complete
            setIsOverheated(false);
            isOverheatedRef.current = false;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOverheated, cooldownTime]);

  // Activate Overheat Mode
  const handleEmergencyShutdown = () => {
    setShowOverheatAlert(false);
    setIsOverheated(true);
    isOverheatedRef.current = true;
    setCooldownTime(15); // 15s cooldown

    // Force Critical State Immediately
    setBatteryData(prev => ({
      ...prev,
      current: 0,
      stored: 0,
      charging: false,
      chargeRate: 0,
      health: 45 // Drop health temporarily
    }));

    // Critical Voltages
    setCellVoltages(prev => prev.map(c => ({
      ...c,
      voltage: Number((2.5 + Math.random()).toFixed(2)), // Critical low/unstable
      temp: Number((95 + Math.random() * 10).toFixed(1)), // > 90 degrees
      status: "critical"
    })));
  };

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
        if (!isOverheatedRef.current) {
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

        // --- DYNAMIC REALISM UPDATES ---

        // 1. Thermal Data (Based on load)
        // Take last 8 hours of logs
        const recentLogs = logs.slice(-8);
        if (recentLogs.length > 0) {
          const newThermal = recentLogs.map((l: any) => {
            const out = Number(l.battery_output);
            // Heat model: Base 25 + Load heating
            const heat = (out / 2000) * 8; // Max ~8 deg rise at full load
            const noise = Math.random() * 0.5;
            const pTemp = 25 + heat + (isCharging ? 1 : 0) + noise;

            // If Overheated, force critical
            if (isOverheatedRef.current) return { time: l.simulation_time, cell1: 95.2, cell8: 94.8, pack: 95.0 };

            return {
              time: l.simulation_time,
              cell1: Number((pTemp + Math.random() * 0.3).toFixed(1)),
              cell8: Number((pTemp + Math.random() * 0.4).toFixed(1)),
              pack: Number(pTemp.toFixed(1))
            };
          });
          // Fill if < 8 (shouldn't happen often in full day sim, but handling init)
          setThermalData(prev => {
            if (newThermal.length < 8) return [...prev.slice(newThermal.length), ...newThermal];
            return newThermal;
          });
        }

        // 2. Health Metrics (Degrade with cycles)
        if (!isOverheatedRef.current) {
          const baseHealth = 95.2;
          const degradation = additionalCycles * 0.05; // Fake degradation for demo
          setHealthMetrics(prev => ({
            ...prev,
            capacity: Number((baseHealth - degradation).toFixed(1)),
            cycleLife: Number((93.2 - degradation * 0.8).toFixed(1)),
            // Temperature score drops if pack temp is high
            temperature: Math.max(0, 100 - (rate > 100 ? 10 : 0))
          }));
        }
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
          className={`${isOverheated
            ? "bg-gradient-to-br from-red-600 to-red-800 animate-pulse"
            : "bg-gradient-to-br from-emerald-500 to-green-600"} 
            rounded-2xl p-8 shadow-2xl text-white mb-8 transition-colors duration-500`}
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
              <div className={isOverheated ? "text-red-200 text-sm" : "text-emerald-100 text-sm"}>Status</div>
              <div className="text-xl font-semibold">
                {isOverheated ? "🔴 CRITICAL SHUTDOWN" : (batteryData.charging ? "⚡ Charging" : "📉 Discharging")}
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

      {/* --- OVERHEAT ALERT MODAL --- */}
      <AnimatePresence>
        {showOverheatAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-red-950 border-2 border-red-600 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.5)] text-center relative overflow-hidden"
            >
              {/* Pulsing background effect */}
              <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 p-4 bg-red-900/50 rounded-full animate-bounce">
                  <Flame className="w-12 h-12 text-red-500" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">THERMAL RUNAWAY</h2>
                <div className="text-red-400 font-mono text-xl font-bold mb-6">TEMP CRITICAL: 92.4°C</div>

                <p className="text-red-200 mb-8 text-sm leading-relaxed">
                  Battery Pack #1 internal temperature has exceeded safety thresholds. Immediate automated shutdown required to prevent catastrophic failure.
                </p>

                <button
                  onClick={handleEmergencyShutdown}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-lg border border-red-500 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                  INITIATE EMERGENCY SHUTDOWN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SHUTDOWN STATE OVERLAY --- */}
      <AnimatePresence>
        {isOverheated && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40 bg-red-950/90 border border-red-600 text-red-100 p-6 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-900/50 rounded-lg shrink-0">
                <Ban className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-1">System Locked</h3>
                <p className="text-sm text-red-300 mb-3">Cooling protocols active. Manual override disabled.</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 bg-red-900/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 15, ease: "linear" }}
                      className="h-full bg-red-500"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold">{cooldownTime}s</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
