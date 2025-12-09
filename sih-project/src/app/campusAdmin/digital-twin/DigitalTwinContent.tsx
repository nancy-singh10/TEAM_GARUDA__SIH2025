"use client";

import { useEffect, useState, useRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Zap, Clock, Play, Pause, Sun, Moon, Battery, Leaf, IndianRupee, TrendingUp, BarChart3, X } from "lucide-react";
import { cn } from "@/lib/utils";
import CampusVisualizer from "./CampusVisualizer";
import { BuildingData, BUILDING_TEMPLATES } from "./types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES FOR LOGS ---
interface HourlyLog {
    hour: string;
    solar: number;
    wind: number;
    batteryDischarge: number;
    gridUsed: number;
    costSaved: number;
    totalLoad: number;
}

interface DigitalTwinContentProps {
    campus_id: string;
}

// --- LOGIC HOOK ---
const useDashboardLogic = (campus_id: string) => {
    const [mounted, setMounted] = useState(false);

    // Time starts at 00:00
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [time, setTime] = useState(() => {
        const d = new Date(); d.setHours(0, 0, 0, 0); return d;
    });

    // States
    const [solar, setSolar] = useState(0);
    const [wind, setWind] = useState(0);
    const [batteryPercent, setBatteryPercent] = useState(50);
    const [isAutoPilot, setIsAutoPilot] = useState(false);
    const [batteryStatus, setBatteryStatus] = useState<"IDLE" | "CHARGING" | "DISCHARGING">("IDLE");

    // Logging States
    const [hourlyLogs, setHourlyLogs] = useState<HourlyLog[]>([]);
    const [totalCostSaved, setTotalCostSaved] = useState(0);

    // Buildings
    const [buildings, setBuildings] = useState<BuildingData[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch from DB on mount
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const res = await fetch(`/api/digital-twin/buildings?campus_id=${campus_id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        // Map DB fields to BuildingData if needed, or assume they match
                        // stored data in DB: id, name, type, x, y, base_load, status, priority
                        const mappedBuildings: BuildingData[] = data.map((b: any) => ({
                            id: b.id,
                            type: b.type,
                            x: b.x,
                            y: b.y,
                            baseLoad: b.base_load,
                            status: b.status || 'NORMAL',
                            priority: b.priority || 'MEDIUM',
                            name: b.name,
                            renewableRatio: 0,
                            tokens: b.tokens || 0
                        }));
                        setBuildings(mappedBuildings);
                    } else {
                        // Default Templates if no data
                        setBuildings([
                            { id: "1", type: "HOSTEL", x: 100, y: 100, ...BUILDING_TEMPLATES.HOSTEL, renewableRatio: 0 },
                            { id: "2", type: "LAB", x: 300, y: 150, ...BUILDING_TEMPLATES.LAB, renewableRatio: 0 },
                            { id: "3", type: "ADMIN", x: 500, y: 200, ...BUILDING_TEMPLATES.ADMIN, renewableRatio: 0 },
                            { id: "4", type: "CLASSROOM", x: 200, y: 300, ...BUILDING_TEMPLATES.CLASSROOM, renewableRatio: 0 },
                        ]);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch buildings", e);
            } finally {
                setIsLoaded(true);
            }
        };

        if (campus_id) {
            fetchBuildings();
        }
    }, [campus_id]);

    // Save to DB whenever buildings change (debounced or explicit save would be better, but for now strictly on change to ensure sync)
    // To avoid spamming DB, we might want a manual save or optimize this.
    // For this task, "Save Simulation" button already exists in the UI? 
    // No, the UI has "Clock +1 Hr & Save" but that's for simulation logs.
    // Buildings are edited in CampusVisualizer.
    // We should add an effect to save buildings when they change, but debounce it.

    useEffect(() => {
        if (!isLoaded || !campus_id) return;

        const saveToDB = async () => {
            try {
                await fetch('/api/digital-twin/buildings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        campus_id,
                        buildings: buildings.map(b => ({
                            id: b.id,
                            type: b.type,
                            name: b.name,
                            baseLoad: b.baseLoad,
                            priority: b.priority,
                            x: b.x,
                            y: b.y,
                            status: b.status,
                            tokens: b.tokens // Ensure tokens are saved
                        }))
                    })
                });
                console.log("Buildings saved to DB");
            } catch (e) {
                console.error("Failed to save buildings", e);
            }
        };

        const timeout = setTimeout(saveToDB, 1000); // 1s Debounce
        return () => clearTimeout(timeout);

    }, [buildings, isLoaded, campus_id]);

    const capacities = {
        solar: 900,
        wind: 600,
        batteryKwh: 1000,
        maxDischargeRate: 600,
        maxChargeRate: 500
    };

    useEffect(() => setMounted(true), []);
    const totalLoad = buildings.reduce((sum, b) => sum + b.baseLoad, 0);

    const saveSimulationData = async (s: number, w: number, b_output: number, saved_val: number, current_time: string) => {
        try {
            await fetch('/api/digital-twin/save-simulation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campus_id: campus_id,
                    date: selectedDate.toISOString().split('T')[0],
                    time: current_time,
                    wind_capacity: capacities.wind,
                    solar_capacity: capacities.solar,
                    battery_output: b_output,
                    saved: saved_val
                })
            });
        } catch (e) { console.error("Simulation save error", e); }
    };

    // --- SIMULATION STEP ---
    const handleAdvanceTime = (saveToCloud = false) => {
        let currentLogs = [...hourlyLogs];
        let currentBaseTime = new Date(time);
        let currentTotalSaved = totalCostSaved;

        if (currentLogs.length >= 24) {
            currentLogs = [];
            currentTotalSaved = 0;
            currentBaseTime = new Date();
            currentBaseTime.setHours(0, 0, 0, 0);
            setHourlyLogs([]);
            setTotalCostSaved(0);
        }

        const updatedTime = new Date(currentBaseTime);
        updatedTime.setHours(updatedTime.getHours() + 1);
        const hourVal = updatedTime.getHours();
        // Enforce 24-hour format for consistency and DB compatibility
        const hourStr = updatedTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

        let newSolar = 0;
        if (hourVal >= 6 && hourVal < 18) {
            const distFromNoon = Math.abs(12 - hourVal);
            const factor = Math.max(0, 1 - (distFromNoon / 6.5));
            newSolar = capacities.solar * factor * (Math.random() * 0.2 + 0.8);
        }
        let newWind = Math.max(0, Math.min(capacities.wind, wind + (Math.random() - 0.5) * 80));

        const generation = newSolar + newWind;
        const surplus = generation - totalLoad;

        let newBatteryPercent = batteryPercent;
        let status: "IDLE" | "CHARGING" | "DISCHARGING" = "IDLE";
        let batteryOutput = 0;

        if (surplus > 0) {
            status = "CHARGING";
            const chargeAmount = Math.min(surplus, capacities.maxChargeRate);
            const percentAdded = (chargeAmount / capacities.batteryKwh) * 100;
            newBatteryPercent = Math.min(100, batteryPercent + percentAdded);
        } else if (surplus < 0) {
            const deficit = Math.abs(surplus);
            if (batteryPercent > 2) {
                status = "DISCHARGING";
                const dischargeNeeded = Math.min(deficit, capacities.maxDischargeRate);
                batteryOutput = dischargeNeeded;
                const percentDrained = (dischargeNeeded / capacities.batteryKwh) * 100;
                newBatteryPercent = Math.max(0, batteryPercent - percentDrained);
            }
        }

        const energyProvidedBySystem = newSolar + newWind + batteryOutput;
        const gridUsed = Math.max(0, totalLoad - energyProvidedBySystem);

        const costStep = ((newSolar + newWind + batteryOutput) - gridUsed) * 2;

        const newLog: HourlyLog = {
            hour: hourStr,
            solar: Math.round(newSolar),
            wind: Math.round(newWind),
            batteryDischarge: Math.round(batteryOutput),
            gridUsed: Math.round(gridUsed),
            costSaved: Math.round(costStep),
            totalLoad: totalLoad
        };

        const updatedLogs = [...currentLogs, newLog];

        setHourlyLogs(updatedLogs);
        setTotalCostSaved(currentTotalSaved + Math.round(costStep));

        setSolar(newSolar);
        setWind(newWind);
        setBatteryPercent(newBatteryPercent);
        setBatteryStatus(status);
        setTime(updatedTime);

        // Auto-save logic
        if (saveToCloud) {
            console.log("Saving simulation data...", { hourStr, newSolar, newWind });
            saveSimulationData(newSolar, newWind, batteryOutput, newSolar + newWind, hourStr)
                .then(() => console.log("Simulation data saved successfully"))
                .catch(err => console.error("Error saving simulation data:", err));
        }

        if (updatedLogs.length >= 24) {
            setIsAutoPilot(false);
        }
    };

    const resetDay = () => {
        setHourlyLogs([]);
        setTotalCostSaved(0);
        const d = new Date(); d.setHours(0, 0, 0, 0);
        setTime(d);
        setIsAutoPilot(true);
    };

    const toggleAutoPilot = () => {
        if (!isAutoPilot && hourlyLogs.length >= 24) {
            resetDay();
        } else {
            setIsAutoPilot(!isAutoPilot);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoPilot && hourlyLogs.length < 24) {
            interval = setInterval(() => handleAdvanceTime(true), 2000);
        }
        return () => clearInterval(interval);
    }, [isAutoPilot, hourlyLogs]);

    let dischargeKw = batteryStatus === "DISCHARGING" ? Math.min(capacities.maxDischargeRate, Math.max(0, totalLoad - (solar + wind))) : 0;

    const usedSolar = Math.min(solar, totalLoad);
    const remaining1 = Math.max(0, totalLoad - usedSolar);
    const usedWind = Math.min(wind, remaining1);
    const remaining2 = Math.max(0, remaining1 - usedWind);
    const usedBattery = Math.min(dischargeKw, remaining2);
    const remaining3 = Math.max(0, remaining2 - usedBattery);

    const energyMix = {
        solar: usedSolar / Math.max(1, totalLoad),
        wind: usedWind / Math.max(1, totalLoad),
        battery: usedBattery / Math.max(1, totalLoad),
        grid: remaining3 / Math.max(1, totalLoad)
    };

    return {
        mounted, time, solar, wind, batteryPercent, batteryStatus, isAutoPilot,
        setSolar, setWind, toggleAutoPilot, setBatteryPercent,
        handleAdvanceTime, buildings, setBuildings, totalLoad, capacities, energyMix,
        hourlyLogs, totalCostSaved, resetDay,
        selectedDate, setSelectedDate, saveSimulationData
    };
};

// --- LEFT PANEL ---
const CurrentStateSection = ({ data }: any) => {
    const { time, solar, wind, batteryPercent, batteryStatus, isAutoPilot, handleAdvanceTime, totalLoad, capacities, energyMix, hourlyLogs, totalCostSaved, toggleAutoPilot, setBatteryPercent, selectedDate, setSelectedDate } = data;
    const isNight = time.getHours() >= 18 || time.getHours() < 6;
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [hourlyLogs]);

    const handleBatteryClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isAutoPilot) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const height = rect.height;
        const clickY = e.clientY - rect.top;
        const newPercent = Math.max(0, Math.min(100, ((height - clickY) / height) * 100));
        setBatteryPercent(newPercent);
    };

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative">
            <style jsx>{`
         @keyframes wave {
           0% { transform: translateX(0) translateZ(0) scaleY(1); }
           50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
           100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
         }
         .animate-wave {
           animation: wave 5s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
         }
       `}</style>

            <div className="absolute top-4 right-4 z-10 flex flex-col items-end">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Saved</div>
                <div className={cn("text-xl font-mono font-bold flex items-center gap-1", totalCostSaved >= 0 ? "text-emerald-500" : "text-red-500")}>
                    <IndianRupee size={16} />
                    {totalCostSaved.toLocaleString()}
                </div>
            </div>

            <div className="p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dashboard</h2>
                    <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-700 dark:text-slate-200 mr-20">
                        {isNight ? <Moon size={14} /> : <Sun size={14} className="text-orange-500" />}
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-lg mb-2">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Energy Monitor</h1>
                    <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="text-xs border border-slate-200 dark:border-slate-700 rounded px-2 py-1 bg-white dark:bg-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                <div className="flex gap-4">
                    <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white shadow-lg flex flex-col justify-between h-48">
                        <div className="relative z-10">
                            <p className="text-indigo-100 text-[10px] font-bold uppercase mb-1">Campus Load</p>
                            <p className="text-3xl font-mono font-bold">{totalLoad} <span className="text-sm opacity-60">kW</span></p>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold opacity-80 mb-1">Grid Use</p>
                            <p className="text-lg font-mono">{Math.round(energyMix.grid * 100)}%</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                            <Zap size={100} />
                        </div>
                    </div>

                    <div className="w-24 h-48 bg-slate-100 rounded-2xl border-4 border-slate-300 relative flex flex-col items-center justify-end shadow-inner overflow-hidden group cursor-pointer" onClick={handleBatteryClick}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-slate-300 rounded-sm z-20" />

                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none mix-blend-difference text-white">
                            <span className="text-xl font-bold font-mono">{Math.round(batteryPercent)}%</span>
                            <span className="text-[9px] uppercase font-bold opacity-80">{batteryStatus === "IDLE" ? "" : batteryStatus}</span>
                        </div>

                        <div
                            className={cn("w-full transition-all duration-700 relative", batteryPercent < 20 ? "bg-red-500" : "bg-green-500")}
                            style={{ height: `${batteryPercent}%` }}
                        >
                            <div className="absolute -top-3 left-0 w-[200%] h-6 animate-wave flex">
                                <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={cn("h-full w-1/2 fill-current", batteryPercent < 20 ? "text-red-500" : "text-green-500")}>
                                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                                </svg>
                                <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={cn("h-full w-1/2 fill-current", batteryPercent < 20 ? "text-red-500" : "text-green-500")}>
                                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                                </svg>
                            </div>

                            {batteryStatus === "CHARGING" && (
                                <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                            <span className="flex items-center gap-1"><Sun size={12} /> Solar</span>
                            <span>{Math.round(solar)} kW</span>
                        </div>
                        <input type="range" min="0" max={capacities.solar} value={solar} onChange={(e) => !isAutoPilot && data.setSolar(Number(e.target.value))} disabled={isAutoPilot} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                            <span className="flex items-center gap-1"><Leaf size={12} /> Wind</span>
                            <span>{Math.round(wind)} kW</span>
                        </div>
                        <input type="range" min="0" max={capacities.wind} value={wind} onChange={(e) => !isAutoPilot && data.setWind(Number(e.target.value))} disabled={isAutoPilot} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={toggleAutoPilot} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all", isAutoPilot ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-white text-slate-600 border border-slate-200 shadow-sm")}>
                        {isAutoPilot ? <Pause size={16} /> : <Play size={16} />}
                        {isAutoPilot ? "Pause" : hourlyLogs.length >= 24 ? "Restart" : "Auto-Pilot"}
                    </button>

                    <button onClick={() => handleAdvanceTime(true)} disabled={isAutoPilot} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Clock size={16} /> +1 Hr & Save
                    </button>
                </div>

                <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="grid grid-cols-5 bg-slate-100 p-2 text-[9px] font-bold text-slate-500 uppercase text-center border-b border-slate-200">
                        <div>Time</div>
                        <div>Solar</div>
                        <div>Wind</div>
                        <div>Bat.Out</div>
                        <div>Saved</div>
                    </div>

                    <div ref={scrollRef} className="overflow-y-auto max-h-[200px] bg-slate-50/50">
                        {hourlyLogs.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400 italic">Ready to start...</div>
                        ) : (
                            hourlyLogs.map((log: HourlyLog, i: number) => (
                                <div key={i} className="grid grid-cols-5 p-2 text-[10px] font-mono text-center border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
                                    <div className="text-slate-500">{log.hour}</div>
                                    <div className="text-yellow-600 font-bold">{log.solar}</div>
                                    <div className="text-blue-600 font-bold">{log.wind}</div>
                                    <div className="text-green-600 font-bold">{log.batteryDischarge}</div>
                                    <div className={cn("font-bold", log.costSaved >= 0 ? "text-emerald-600" : "text-red-500")}>
                                        {log.costSaved}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function DigitalTwinContent({ campus_id }: DigitalTwinContentProps) {
    const logic = useDashboardLogic(campus_id);
    const [fullScreen, setFullScreen] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Prepare Data for Graphs
    const graphData = logic.hourlyLogs.map(log => ({
        name: log.hour,
        solar: log.solar,
        wind: log.wind,
        totalRenewable: log.solar + log.wind,
        load: log.totalLoad
    }));

    if (!logic.mounted) return null;

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col bg-slate-100">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="hidden md:block">
                    <CurrentStateSection data={logic} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={70} className="relative">

                    {/* --- ANALYTICS BUTTON --- */}
                    <button
                        onClick={() => setShowAnalytics(true)}
                        className="absolute top-4 right-16 z-50 p-2 bg-white/90 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg shadow-md border border-slate-200 transition-all"
                        title="View Analytics"
                    >
                        <BarChart3 size={18} />
                    </button>

                    <CampusVisualizer
                        buildings={logic.buildings}
                        setBuildings={logic.setBuildings}
                        energyMix={logic.energyMix}
                        batteryStatus={logic.batteryStatus}
                        timeOfDay={logic.time.getHours()}
                        isFullScreen={fullScreen}
                        onToggleFullScreen={() => setFullScreen(!fullScreen)}
                        windOutput={logic.wind}
                        solarOutput={logic.solar}
                    />

                    {/* --- ANALYTICS MODAL --- */}
                    <AnimatePresence>
                        {showAnalytics && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-8"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full h-full max-w-5xl max-h-[600px] flex flex-col overflow-hidden"
                                >
                                    {/* Modal Header */}
                                    <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BarChart3 size={20} /></div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Session Analytics</h2>
                                                <p className="text-xs text-slate-500">Real-time performance metrics</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowAnalytics(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={20} /></button>
                                    </div>

                                    {/* Modal Content - Graphs */}
                                    <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">

                                        {/* Graph 1 */}
                                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col">
                                            <div className="flex items-center gap-2 mb-4">
                                                <TrendingUp size={16} className="text-blue-500" />
                                                <h4 className="text-sm font-bold text-slate-600 uppercase">Renewable Mix</h4>
                                            </div>
                                            <div className="flex-1 w-full min-h-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={graphData}>
                                                        <defs>
                                                            <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                                        <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                                                        <Legend />
                                                        <Area type="monotone" dataKey="solar" name="Solar" stroke="#EAB308" fillOpacity={1} fill="url(#colorSolar)" strokeWidth={2} />
                                                        <Area type="monotone" dataKey="wind" name="Wind" stroke="#3B82F6" fillOpacity={1} fill="url(#colorWind)" strokeWidth={2} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Graph 2 */}
                                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Zap size={16} className="text-green-500" />
                                                <h4 className="text-sm font-bold text-slate-600 uppercase">Supply vs Demand</h4>
                                            </div>
                                            <div className="flex-1 w-full min-h-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={graphData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                                        <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                                                        <Legend />
                                                        <Line type="monotone" dataKey="totalRenewable" name="Generation (kW)" stroke="#10B981" strokeWidth={3} dot={false} />
                                                        <Line type="step" dataKey="load" name="Total Load (kW)" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
