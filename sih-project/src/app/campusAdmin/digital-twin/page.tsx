"use client";

import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import {
  Zap, TrendingUp, Clock, ArrowRight, Play, Pause, Save, Moon, Sun, BatteryCharging, Wind,
  Cloud, CloudRain, Maximize2, Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import CampusVisualizer from "./CampusVisualizer";
import { BuildingData } from "./types";

// --- 1. LOGIC HOOK ---
const useDashboardLogic = () => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(7, 0, 0, 0);
    return d;
  });

  // Simulation States
  const [solar, setSolar] = useState(0);
  const [wind, setWind] = useState(0);
  const [battery, setBattery] = useState(50);
  const [weatherMode, setWeatherMode] = useState("Custom");
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Campus Data
  const [campusId, setCampusId] = useState<number | null>(null);
  const [buildings, setBuildings] = useState<BuildingData[]>([]);

  // Capacities (Default fallbacks)
  const [capacities, setCapacities] = useState({
    solar: 500,
    wind: 500,
    battery: 2000,
    loadMax: 1000
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    setMounted(true);
    // Time is already initialized to 7 AM

    // Load User & Fetch Data
    const storedSession = localStorage.getItem("sessionUser");
    if (storedSession) {
      try {
        const user = JSON.parse(storedSession);
        if (user?.id) {
          setCampusId(user.id);
          // fetchCampusData called separately below (uses cookie)
          fetchBuildings(user.id);  // Fetch Buildings
        }
      } catch (e) { console.error("Session error", e); }
    }

    // Always fetch capacity (uses cookie)
    fetchCampusData();
    // fetchBuildings still depends on ID for now, or we can update it too. 
    // For now, buildings rely on localStorage ID which is acceptable if we assume matching cookie.

  }, []);

  // --- API CALLS ---
  const fetchCampusData = async () => {
    try {
      // UPDATED: Using POST (cookie-based auth)
      const res = await fetch(`/api/campus-admin/capacity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // No body needed
      });

      if (res.ok) {
        const data = await res.json();
        const newCaps = {
          solar: Number(data.solar_capacity) || 500,
          wind: Number(data.wind_capacity) || 500,
          battery: Number(data.battery_capacity) || 2000,
          loadMax: Number(data.campus_load_max) || 1000
        };
        setCapacities(newCaps);
        // Initialize values within range (User requested 50% for solar)
        setSolar(newCaps.solar * 0.5);
        setWind(newCaps.wind * 0.2); // Safe default for wind
      }
    } catch (e) { console.error("Capacity fetch error", e); }
  };

  const fetchBuildings = async (id: number) => {
    try {
      const res = await fetch(`/api/digital-twin/buildings?campus_id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map((b: any) => ({
            id: b.id,
            type: b.type,
            x: b.x,
            y: b.y,
            name: b.name,
            baseLoad: b.base_load,
            priority: b.priority,
            renewableRatio: 0,
            status: b.status
          }));
          setBuildings(mapped);
        }
      }
    } catch (e) { console.error("Buildings fetch error", e); }
  };

  const saveBuildingsToDB = async (updatedBuildings: BuildingData[]) => {
    if (!campusId) return;
    try {
      const payload = updatedBuildings.map(b => ({
        id: b.id.length > 10 ? b.id : undefined,
        type: b.type,
        name: b.name,
        baseLoad: b.baseLoad,
        priority: b.priority,
        x: b.x,
        y: b.y,
        status: b.status,
        renewableRatio: b.renewableRatio
      }));
      await fetch('/api/iot/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campus_id: campusId, buildings: payload })
      });
    } catch (e) { console.error("Layout save error", e); }
  };

  const saveDataToBackend = async (s: number, w: number, l: number, b: number) => {
    setIsSaving(true);
    if (!campusId) return;
    try {
      await fetch('/api/iot/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campus_id: campusId, solar: s, wind: w, load: l, battery_percent: b })
      });
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  // --- CORE LOGIC ---
  const totalLoad = buildings.reduce((sum, b) => sum + b.baseLoad, 0);
  // Battery delivers 500kW if charged > 10%
  const batteryPower = battery > 10 ? 500 : 0;

  const calculateBuildingStatus = () => {
    const availableGreenPower = solar + wind + batteryPower;
    let remainingGreen = availableGreenPower;

    const sorted = [...buildings].sort((a, b) => {
      if (a.priority === "HIGH" && b.priority !== "HIGH") return -1;
      if (a.priority !== "HIGH" && b.priority === "HIGH") return 1;
      return 0;
    });

    const statusMap = new Map();
    sorted.forEach(b => {
      let ratio = 0;
      if (remainingGreen >= b.baseLoad) {
        ratio = 1;
        remainingGreen -= b.baseLoad;
      } else if (remainingGreen > 0) {
        ratio = remainingGreen / b.baseLoad;
        remainingGreen = 0;
      } else {
        ratio = 0;
      }
      statusMap.set(b.id, ratio);
    });

    return buildings.map(b => ({
      ...b,
      renewableRatio: statusMap.get(b.id) || 0
    }));
  };

  const processedBuildings = calculateBuildingStatus();

  const handleSetBuildings = (newBuildings: BuildingData[]) => {
    setBuildings(newBuildings);
    saveBuildingsToDB(newBuildings);
  };

  const handleAdvanceTime = () => {
    const updatedTime = new Date(time);
    updatedTime.setHours(updatedTime.getHours() + 1);

    let newSolar = solar;
    let newWind = wind;

    if (isAutoPilot) {
      newWind = Math.min(capacities.wind, Math.max(0, wind + (Math.random() > 0.5 ? 10 : -10)));
      const nextHour = updatedTime.getHours();
      // Strict 6PM - 6AM cutoff
      if (nextHour >= 18 || nextHour < 6) newSolar = 0;
      else if (weatherMode === "Sunny") newSolar = Math.max(0, capacities.solar - (Math.abs(12 - nextHour) * 50));
    }

    const nextHour = updatedTime.getHours();
    if (nextHour >= 18 || nextHour < 6) {
      newSolar = 0;
      if (weatherMode === "Sunny") setWeatherMode("Custom");
    }

    const netEnergy = (newSolar + newWind) - totalLoad;
    const percentChange = Math.round((netEnergy / capacities.battery) * 100);
    let newBattery = Math.min(100, Math.max(0, battery + percentChange));

    setTime(updatedTime);
    setSolar(newSolar);
    setWind(newWind);
    setBattery(newBattery);

    if (isAutoPilot) saveDataToBackend(newSolar, newWind, totalLoad, newBattery);
  };

  const applyWeather = (type: string) => {
    const hour = time.getHours();
    const isNight = hour >= 18 || hour < 6;
    if (type === "Sunny" && isNight) return;

    setWeatherMode(type);
    switch (type) {
      case "Sunny": setSolar(capacities.solar * 0.9); setWind(capacities.wind * 0.1); break;
      case "Cloudy": setSolar(capacities.solar * 0.3); setWind(capacities.wind * 0.3); break;
      case "Rainy": setSolar(capacities.solar * 0.1); setWind(capacities.wind * 0.6); break;
      case "Windy": setSolar(capacities.solar * 0.5); setWind(capacities.wind * 0.9); break;
    }
  };

  const getGradientClass = () => {
    if (!mounted) return "bg-slate-50 dark:bg-[#0d1117]";
    const totalGen = solar + wind + batteryPower;
    const isSurplus = totalGen >= totalLoad;
    const hour = time.getHours();
    const isNight = hour >= 18 || hour < 6;

    if (isNight) {
      return isSurplus
        ? "bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 text-white"
        : "bg-gradient-to-b from-gray-900 via-slate-900 to-black text-white";
    }
    if (weatherMode === "Rainy") return "bg-gradient-to-b from-slate-200 via-blue-100 to-slate-200 dark:from-slate-800 dark:via-blue-950 dark:to-slate-900";
    if (!isSurplus) return "bg-gradient-to-b from-red-50 via-red-100 to-slate-50 dark:from-red-950/30 dark:via-red-900/20 dark:to-slate-900";
    return "bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50 dark:from-blue-950/30 dark:via-cyan-900/20 dark:to-slate-900";
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPilot) interval = setInterval(handleAdvanceTime, 3000);
    return () => clearInterval(interval);
  }, [isAutoPilot, time]);

  // Ensure solar is 0 if it somehow got set during night (defensive)
  useEffect(() => {
    const hour = time.getHours();
    if ((hour >= 18 || hour < 6) && solar > 0) {
      setSolar(0);
    }
  }, [time, solar]);

  return {
    mounted, time, solar, wind, battery, batteryPower, isAutoPilot, isSaving, weatherMode, capacities,
    setSolar, setWind, setIsAutoPilot, handleAdvanceTime, saveDataToBackend, applyWeather, getGradientClass,
    buildings: processedBuildings, setBuildings: handleSetBuildings, totalLoad, saveBuildingsToDB
  };
};

// --- 2. LEFT PANEL (Current State) ---
const CurrentStateSection = ({ data, onExpand, isExpanded }: any) => {
  const {
    time, solar, wind, battery, batteryPower, isAutoPilot, handleAdvanceTime,
    applyWeather, weatherMode, setSolar, setWind, getGradientClass,
    saveDataToBackend, totalLoad, capacities
  } = data;

  const totalGen = solar + wind + batteryPower;
  const renewableGen = solar + wind;
  const isNight = time.getHours() >= 18 || time.getHours() < 6;
  const availableBatteryEnergy = Math.round((battery / 100) * capacities.battery);

  const WBtn = ({ label, icon: Icon, onClick, active }: any) => (
    <button onClick={onClick} disabled={isNight && label === "Sunny"}
      className={cn("flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-xs shadow-sm",
        active
          ? "bg-blue-600 text-white border-blue-700 shadow-md transform scale-105"
          : "bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white",
        (isNight && label === "Sunny") && "opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-900"
      )}>
      <Icon size={18} className="mb-1" /> {label}
    </button>
  );

  return (
    <div className={cn("h-full w-full flex flex-col border-r border-slate-200/60 dark:border-slate-800 transition-colors duration-1000 relative group/panel", getGradientClass())}>

      <button onClick={onExpand} className="absolute top-2 right-2 p-1.5 bg-black/20 text-white rounded opacity-50 hover:opacity-100 transition-opacity z-50" title={isExpanded ? "Minimize" : "Full Screen"}>
        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} className="fill-current text-yellow-500" />
            <h2 className="font-bold uppercase tracking-wider text-sm">System</h2>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono font-bold flex items-center justify-end gap-2">
              {isNight ? <Moon size={16} /> : <Sun size={16} className="text-yellow-500" />}
              {time.toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}
            </div>
          </div>
        </div>

        {/* Supply Breakdown */}
        <div className="p-4 bg-white/70 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl backdrop-blur-md shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold opacity-70 uppercase">Total Supply</span>
            <span className="text-2xl font-mono font-bold">{Math.round(totalGen)} <span className="text-sm opacity-60">kW</span></span>
          </div>

          {/* Renewable Only */}
          <div className="flex justify-between items-end mb-2 border-b border-black/5 dark:border-white/5 pb-2">
            <span className="text-[10px] font-bold opacity-50 uppercase flex items-center gap-1"><TrendingUp size={12} /> Green Energy</span>
            <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{Math.round(renewableGen)} kW</span>
          </div>

          {/* Multi-colored Bar */}
          <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden flex mb-3">
            <div style={{ width: `${(solar / Math.max(1, totalGen)) * 100}%` }} className="h-full bg-orange-400 transition-all duration-500"></div>
            <div style={{ width: `${(wind / Math.max(1, totalGen)) * 100}%` }} className="h-full bg-teal-400 transition-all duration-500"></div>
            <div style={{ width: `${(batteryPower / Math.max(1, totalGen)) * 100}%` }} className="h-full bg-emerald-500 transition-all duration-500"></div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] opacity-70">
            <div className="flex flex-col items-center p-1 rounded bg-orange-500/10 border border-orange-500/20">
              <span className="font-bold text-orange-600 dark:text-orange-400">{Math.round(solar)}</span>
              <span className="uppercase text-[9px]">Solar</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-teal-500/10 border border-teal-500/20">
              <span className="font-bold text-teal-600 dark:text-teal-400">{Math.round(wind)}</span>
              <span className="uppercase text-[9px]">Wind</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{Math.round(batteryPower)}</span>
              <span className="uppercase text-[9px]">Battery</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={cn("space-y-4", isAutoPilot && "opacity-50 pointer-events-none")}>
          <div className="grid grid-cols-4 gap-2">
            <WBtn label="Sunny" icon={Sun} onClick={() => applyWeather("Sunny")} active={!isNight && weatherMode === "Sunny"} />
            <WBtn label="Cloudy" icon={Cloud} onClick={() => applyWeather("Cloudy")} active={weatherMode === "Cloudy"} />
            <WBtn label="Rainy" icon={CloudRain} onClick={() => applyWeather("Rainy")} active={weatherMode === "Rainy"} />
            <WBtn label="Windy" icon={Wind} onClick={() => applyWeather("Windy")} active={weatherMode === "Windy"} />
          </div>

          <div className="space-y-4 p-4 bg-white/40 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5">
            {/* Solar Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Solar Intensity {isNight && <span className="text-red-500 ml-1">(Night Mode)</span>}</span>
                <span className="font-mono">{Math.round(solar)} / {capacities.solar} kW</span>
              </div>
              <input type="range" min={0} max={capacities.solar} value={solar} onChange={(e) => { data.setSolar(Number(e.target.value)); data.weatherMode !== "Custom" && data.setWeatherMode("Custom") }} disabled={isNight} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", isNight ? "bg-slate-300 dark:bg-slate-700" : "bg-orange-200 accent-orange-500")} />
            </div>

            {/* Wind Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Wind Intensity</span>
                <span className="font-mono">{Math.round(wind)} / {capacities.wind} kW</span>
              </div>
              <input type="range" min={0} max={capacities.wind} value={wind} onChange={(e) => { data.setWind(Number(e.target.value)); data.weatherMode !== "Custom" && data.setWeatherMode("Custom") }} className="w-full h-1.5 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-500" />
            </div>

            {/* Load Slider (Read Only) */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 opacity-80">
                <span>Total Load (Calculated)</span>
                <span className="font-mono">{totalLoad} kW</span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden border border-black/5">
                <div style={{ width: `${Math.min(100, (totalLoad / capacities.loadMax) * 100)}%` }} className="h-full bg-purple-500 transition-all duration-300"></div>
              </div>
              <p className="text-[10px] opacity-60 mt-1 text-right">Sum of all buildings in Playground</p>
            </div>
          </div>
        </div>

        {/* Battery Container */}
        <div className="bg-white/60 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm flex flex-col items-center justify-center relative shadow-lg">
          <h3 className="text-xs font-bold opacity-70 uppercase absolute top-4 left-4 flex items-center gap-1.5"><BatteryCharging size={14} className="text-emerald-500" /> Storage System</h3>

          <div className="flex items-end gap-8 mt-6">
            {/* Vertical Cylinder Battery */}
            <div className="relative group cursor-pointer">
              {/* Battery Cap */}
              <div className="w-16 h-4 bg-slate-300 dark:bg-slate-600 rounded-t-full absolute -top-2 left-1/2 -translate-x-1/2 z-10 border-b border-black/10"></div>

              {/* Battery Body Container */}
              <div className="w-24 h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-slate-300 dark:border-slate-600 relative overflow-hidden shadow-inner flex flex-col justify-end">
                {/* Fluid Fill */}
                <div
                  className={cn("w-full transition-all duration-700 ease-in-out relative", battery < 20 ? "bg-red-500" : "bg-emerald-500")}
                  style={{ height: `${battery}%` }}
                >
                  {/* Wave Animation at Top */}
                  {battery > 0 && (
                    <div className="absolute -top-3 left-0 right-0 h-4 overflow-hidden -z-0">
                      <div className="absolute top-0 left-0 h-full w-[200%] animate-wave flex">
                        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={cn("h-full w-1/2 fill-current", battery < 20 ? "text-red-500" : "text-emerald-500")}>
                          <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                        </svg>
                        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={cn("h-full w-1/2 fill-current", battery < 20 ? "text-red-500" : "text-emerald-500")}>
                          <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Liquid Surface Effect */}
                  <div className="w-full h-2 bg-white/30 absolute top-0 left-0" />
                  {/* Bubbles Animation */}
                  <div className="absolute inset-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse"></div>
                </div>

                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-2xl"></div>

                {/* Percentage Text Centered */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none drop-shadow-md">
                  <span className={cn("text-2xl font-black font-mono", battery > 50 ? "text-white" : "text-slate-800 dark:text-white")}>{Math.round(battery)}%</span>
                </div>
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                Output: {batteryPower} kW
              </div>
            </div>

            {/* Stats Info */}
            <div className="flex flex-col gap-3 text-right">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Available Energy</p>
                <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{availableBatteryEnergy}</p>
                <p className="text-[10px] text-slate-500">kWh</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Capacity</p>
                <p className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{capacities.battery} kWh</p>
              </div>
              {isAutoPilot && (
                <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-blue-500 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Charging/Draining
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-3 bg-white/20 dark:bg-black/20 backdrop-blur-md">
        <button onClick={() => data.setIsAutoPilot(!isAutoPilot)} className={cn("w-full flex items-center justify-between p-3 rounded-xl border transition-all", isAutoPilot ? "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700" : "bg-white/50 border-slate-200 dark:bg-white/5 dark:border-slate-700")}>
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", isAutoPilot ? "bg-purple-500 text-white" : "bg-slate-200 text-slate-500")}>
              {isAutoPilot ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Auto-Pilot</p>
              <p className="text-[10px] opacity-70">{isAutoPilot ? "System Running..." : "Paused"}</p>
            </div>
          </div>
          <div className={cn("w-8 h-5 rounded-full relative transition-colors", isAutoPilot ? "bg-purple-500" : "bg-slate-300")}>
            <div className={cn("absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform", isAutoPilot ? "translate-x-3" : "translate-x-0")}></div>
          </div>
        </button>

        <button onClick={() => { handleAdvanceTime(); saveDataToBackend(solar, wind, totalLoad, battery); }} disabled={isAutoPilot} className={cn("w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition-all active:scale-95 group", isAutoPilot ? "bg-slate-400 cursor-not-allowed opacity-50" : "bg-blue-600 hover:bg-blue-700")}>
          <Clock size={18} />
          <span>Advance 1 Hr & Save</span>
        </button>
      </div>
    </div>
  );
};

const PlaygroundSection = ({ buildings, setBuildings, totalAvailablePower, isExpanded, onExpand }: any) => (
  <div className="h-full w-full bg-slate-50/50 dark:bg-[#0f1115] relative flex flex-col group/panel">
    <button onClick={onExpand} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded opacity-0 group-hover/panel:opacity-100 transition-opacity z-50" title={isExpanded ? "Minimize" : "Full Screen"}>
      {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
    </button>
    <CampusVisualizer
      buildings={buildings}
      setBuildings={setBuildings}
      totalAvailablePower={totalAvailablePower}
    />
  </div>
);

// --- 4. RIGHT PANEL ---
const PredictionSection = ({ isExpanded, onExpand }: any) => (
  <div className="h-full w-full bg-slate-50 dark:bg-[#0d1117] p-4 border-l border-slate-200 dark:border-slate-800 relative group/panel">
    <button onClick={onExpand} className="absolute top-2 right-2 p-1.5 bg-black/20 text-white rounded opacity-0 group-hover/panel:opacity-100 transition-opacity z-50" title={isExpanded ? "Minimize" : "Full Screen"}>
      {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
    </button>
    <div className="flex items-center gap-2 mb-6 text-purple-600 dark:text-purple-400">
      <TrendingUp size={20} />
      <h2 className="font-bold uppercase tracking-wider text-sm">Future State (T+1hr)</h2>
    </div>
    <div className="space-y-4">
      <div className="h-32 bg-white dark:bg-slate-800/50 rounded-lg animate-pulse"></div>
      <div className="h-32 bg-white dark:bg-slate-800/50 rounded-lg animate-pulse"></div>
    </div>
    <p className="text-xs text-center text-slate-400 mt-4">(Coming in Installment 4)</p>
  </div>
);

// --- 5. MAIN PAGE ---
export default function DashboardPage() {
  const logic = useDashboardLogic();
  const [fullScreenPanel, setFullScreenPanel] = useState<"LEFT" | "MIDDLE" | "RIGHT" | null>(null);

  if (!logic.mounted) return null;

  return (
    <div className="h-screen w-full bg-slate-100 dark:bg-black overflow-hidden flex flex-col">
      <header className="h-14 bg-white dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
          <span>⚡ Digital Twin Orchestrator</span>
        </div>
        <div className="text-xs font-mono text-slate-500">
          AUTO-PILOT: <span className={logic.isAutoPilot ? "text-purple-500 font-bold" : "text-orange-500"}>{logic.isAutoPilot ? "ON" : "OFF"}</span>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {/* KEY PROP is the fix for the minimize layout bug */}
        <ResizablePanelGroup direction="horizontal" key={fullScreenPanel || "default"}>

          {(fullScreenPanel === null || fullScreenPanel === "LEFT") && (
            <ResizablePanel defaultSize={25} minSize={20} maxSize={fullScreenPanel === "LEFT" ? 100 : 35} className={cn(fullScreenPanel === "LEFT" && "flex-1")}>
              <CurrentStateSection data={logic} isExpanded={fullScreenPanel === "LEFT"} onExpand={() => setFullScreenPanel(fullScreenPanel === "LEFT" ? null : "LEFT")} />
            </ResizablePanel>
          )}

          {fullScreenPanel === null && <ResizableHandle withHandle />}

          {(fullScreenPanel === null || fullScreenPanel === "MIDDLE") && (
            <ResizablePanel defaultSize={50} minSize={30} maxSize={fullScreenPanel === "MIDDLE" ? 100 : 80} className={cn(fullScreenPanel === "MIDDLE" && "flex-1")}>
              <PlaygroundSection
                buildings={logic.buildings}
                setBuildings={logic.setBuildings}
                totalAvailablePower={logic.solar + logic.wind}
                isExpanded={fullScreenPanel === "MIDDLE"}
                onExpand={() => setFullScreenPanel(fullScreenPanel === "MIDDLE" ? null : "MIDDLE")}
              />
            </ResizablePanel>
          )}

          {fullScreenPanel === null && <ResizableHandle withHandle />}

          {(fullScreenPanel === null || fullScreenPanel === "RIGHT") && (
            <ResizablePanel defaultSize={25} minSize={20} maxSize={fullScreenPanel === "RIGHT" ? 100 : 35} className={cn(fullScreenPanel === "RIGHT" && "flex-1")}>
              <PredictionSection isExpanded={fullScreenPanel === "RIGHT"} onExpand={() => setFullScreenPanel(fullScreenPanel === "RIGHT" ? null : "RIGHT")} />
            </ResizablePanel>
          )}

        </ResizablePanelGroup>
      </div>
    </div>
  );
}