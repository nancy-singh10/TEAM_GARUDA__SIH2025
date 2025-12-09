// "use client";

// import { useEffect, useState } from "react";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup
// } from "@/components/ui/resizable";
// import {
//   Zap, TrendingUp, Clock, ArrowRight, Play, Pause, Save, Moon, Sun, BatteryCharging, Wind,
//   Cloud, CloudRain, Maximize2, Minimize2
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import CampusVisualizer from "./CampusVisualizer";
// import { BuildingData } from "./types";

// // --- 1. LOGIC HOOK ---
// const useDashboardLogic = () => {
//   const [mounted, setMounted] = useState(false);

//   // Date & Time State
//   // Default to today
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

//   // Simulated Time (starts at 00:00 of selected date)
//   const [time, setTime] = useState(() => {
//     const d = new Date();
//     d.setHours(0, 0, 0, 0);
//     return d;
//   });

//   // Derived Season
//   const getSeason = (date: Date) => {
//     const month = date.getMonth(); // 0-11
//     // Simple Season Logic (Northern Hemisphere)
//     if (month >= 2 && month <= 5) return "Summer";
//     if (month >= 6 && month <= 8) return "Rainy"; // Monsoon/Rainy
//     if (month >= 9 && month <= 10) return "Autumn";
//     return "Winter";
//   };
//   const season = getSeason(selectedDate);

//   // Simulation States
//   const [solar, setSolar] = useState(0);
//   const [wind, setWind] = useState(0);
//   const [battery, setBattery] = useState(50); // Initial 50%
//   const [isAutoPilot, setIsAutoPilot] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   // Campus Data
//   const [campusId, setCampusId] = useState<number | null>(null);
//   const [buildings, setBuildings] = useState<BuildingData[]>([]);

//   // Capacities (Default fallbacks)
//   const [capacities, setCapacities] = useState({
//     solar: 500,
//     wind: 500,
//     battery: 2000,
//     loadMax: 1000
//   });

//   // --- INITIALIZATION ---
//   useEffect(() => {
//     setMounted(true);
//     // Load User & Fetch Data
//     const storedSession = localStorage.getItem("sessionUser");
//     if (storedSession) {
//       try {
//         const user = JSON.parse(storedSession);
//         if (user?.id) {
//           setCampusId(user.id);
//           fetchBuildings(user.id);
//         }
//       } catch (e) { console.error("Session error", e); }
//     }
//     fetchCampusData();
//   }, []);

//   // Update time's date when selectedDate changes (keep hour same or reset? Reset to 00:00 seems safer specific to user request "starts at 00am")
//   useEffect(() => {
//     const newDateTime = new Date(selectedDate);
//     newDateTime.setHours(time.getHours(), 0, 0, 0);
//     setTime(newDateTime);
//   }, [selectedDate]);

//   // --- API CALLS ---
//   const fetchCampusData = async () => {
//     try {
//       const res = await fetch(`/api/campus-admin/capacity`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({})
//       });

//       if (res.ok) {
//         const data = await res.json();
//         const newCaps = {
//           solar: Number(data.solar_capacity) || 500,
//           wind: Number(data.wind_capacity) || 500,
//           battery: Number(data.battery_capacity) || 2000,
//           loadMax: Number(data.campus_load_max) || 1000
//         };
//         setCapacities(newCaps);
//       }
//     } catch (e) { console.error("Capacity fetch error", e); }
//   };

//   const fetchBuildings = async (id: number) => {
//     try {
//       const res = await fetch(`/api/digital-twin/buildings?campus_id=${id}`);
//       if (res.ok) {
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           const mapped = data.map((b: any) => ({
//             id: b.id,
//             type: b.type,
//             x: b.x,
//             y: b.y,
//             name: b.name,
//             baseLoad: b.base_load,
//             priority: b.priority,
//             renewableRatio: 0,
//             status: b.status
//           }));
//           setBuildings(mapped);
//         }
//       }
//     } catch (e) { console.error("Buildings fetch error", e); }
//   };

//   const saveBuildingsToDB = async (updatedBuildings: BuildingData[]) => {
//     if (!campusId) return;
//     try {
//       const payload = updatedBuildings.map(b => ({
//         id: b.id.length > 10 ? b.id : undefined,
//         type: b.type,
//         name: b.name,
//         baseLoad: b.baseLoad,
//         priority: b.priority,
//         x: b.x,
//         y: b.y,
//         status: b.status,
//         renewableRatio: b.renewableRatio
//       }));
//       await fetch('/api/iot/buildings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ campus_id: campusId, buildings: payload })
//       });
//     } catch (e) { console.error("Layout save error", e); }
//   };

//   const saveDataToBackend = async (s: number, w: number, l: number, b: number) => {
//     setIsSaving(true);
//     if (!campusId) return;
//     try {
//       await fetch('/api/iot/log', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ campus_id: campusId, solar: s, wind: w, load: l, battery_percent: b })
//       });
//     } catch (e) { console.error(e); }
//     finally { setIsSaving(false); }
//   };

//   // --- CORE LOGIC ---
//   const totalLoad = buildings.reduce((sum, b) => sum + b.baseLoad, 0);
//   const batteryPower = battery > 10 ? 500 : 0;
//   // User asked for sum of building load to be strictly total load.

//   const calculateBuildingStatus = () => {
//     const availableGreenPower = solar + wind + batteryPower;
//     let remainingGreen = availableGreenPower;

//     const sorted = [...buildings].sort((a, b) => {
//       if (a.priority === "HIGH" && b.priority !== "HIGH") return -1;
//       if (a.priority !== "HIGH" && b.priority === "HIGH") return 1;
//       return 0;
//     });

//     const statusMap = new Map();
//     sorted.forEach(b => {
//       let ratio = 0;
//       if (remainingGreen >= b.baseLoad) {
//         ratio = 1;
//         remainingGreen -= b.baseLoad;
//       } else if (remainingGreen > 0) {
//         ratio = remainingGreen / b.baseLoad;
//         remainingGreen = 0;
//       } else {
//         ratio = 0;
//       }
//       statusMap.set(b.id, ratio);
//     });

//     return buildings.map(b => ({
//       ...b,
//       renewableRatio: statusMap.get(b.id) || 0
//     }));
//   };

//   const processedBuildings = calculateBuildingStatus();

//   const handleSetBuildings = (newBuildings: BuildingData[]) => {
//     setBuildings(newBuildings);
//     saveBuildingsToDB(newBuildings);
//   };

//   // --- SEASONAL SIMULATION ALGO ---
//   const getSeasonalFactors = (s: string) => {
//     // Return max efficiency factors (0-1)
//     switch (s) {
//       case "Summer": return { solar: 1.0, wind: 0.4 };   // High Sun, Moderate Wind
//       case "Rainy": return { solar: 0.3, wind: 0.6 };    // Low Sun, High Wind (Monsoon)
//       case "Autumn": return { solar: 0.7, wind: 0.5 };   // Moderate both
//       case "Winter": return { solar: 0.6, wind: 0.9 };   // Moderate Sun, High Wind
//       default: return { solar: 0.5, wind: 0.5 };
//     }
//   };

//   const handleAdvanceTime = () => {
//     // Increment hour
//     const updatedTime = new Date(time);
//     updatedTime.setHours(updatedTime.getHours() + 1);
//     const hour = updatedTime.getHours();

//     const factors = getSeasonalFactors(season);

//     // 1. Calculate Solar
//     // Strict 6PM - 6AM cutoff = 0
//     let newSolar = 0;
//     if (hour >= 6 && hour < 18) {
//       // Peak at 12 (noon)
//       const distFromNoon = Math.abs(12 - hour);
//       // Bell curve approximation: 1 - (dist/6)
//       const timeFactor = Math.max(0, 1 - (distFromNoon / 6));
//       newSolar = capacities.solar * factors.solar * timeFactor;
//       // Add a tiny bit of random noise (clouds)
//       newSolar *= (0.8 + Math.random() * 0.2);
//     }

//     // 2. Calculate Wind
//     // Wind varies randomly but based on season max
//     let newWind = wind;
//     // Walk simulation: existing +/- random change
//     // Target base based on season
//     const targetWind = capacities.wind * factors.wind;
//     const change = (Math.random() - 0.5) * 50; // +/- 25kW
//     // Pull towards target
//     const pull = (targetWind - newWind) * 0.1;
//     newWind = newWind + change + pull;
//     newWind = Math.max(0, Math.min(capacities.wind, newWind));

//     // 3. Battery Logic
//     const netEnergy = (newSolar + newWind) - totalLoad;
//     // Charge/Drain
//     // Simple model: excess goes to battery, deficit comes from battery
//     const percentChange = (netEnergy / capacities.battery) * 100;
//     // Clamp 0-100
//     let newBattery = Math.min(100, Math.max(0, battery + percentChange));

//     setTime(updatedTime);
//   // Better logic: Calculate how much of the Total Load is covered by each source
//   let remainingLoadForMix = totalLoad;

//   const solarUsed = Math.min(solar, remainingLoadForMix);
//   remainingLoadForMix = Math.max(0, remainingLoadForMix - solarUsed);

//   const windUsed = Math.min(wind, remainingLoadForMix);
//   remainingLoadForMix = Math.max(0, remainingLoadForMix - windUsed);

//   // Battery usage (only if we are draining)
//   // We don't have exact drain per tick stored in state easily accessible here without more complex state
//   // but we can estimate based on deficit
//   const generation = solar + wind;
//   let batteryUsed = 0;
//   if (generation < totalLoad) {
//     batteryUsed = Math.min(batteryPower, totalLoad - generation);
//   }
//   remainingLoadForMix = Math.max(0, remainingLoadForMix - batteryUsed);

//   const gridUsed = remainingLoadForMix;

//   const totalMixBase = Math.max(1, totalLoad);
//   const energyMix = {
//     solar: solarUsed / totalMixBase,
//     wind: windUsed / totalMixBase,
//     battery: batteryUsed / totalMixBase,
//     grid: gridUsed / totalMixBase
//   };
//     selectedDate, setSelectedDate, season,
//     setSolar, setWind,
//     saveDataToBackend, totalLoad, capacities
//   } = data;

//   const totalGen = solar + wind + batteryPower;
//   const renewableGen = solar + wind;
//   const hour = time.getHours();
//   const isNight = hour >= 18 || hour < 6;
//   const availableBatteryEnergy = Math.round((battery / 100) * capacities.battery);

//   // Background Gradient based on Time/System
//   const getDynamicBackground = () => {
//     if (isNight) return "bg-gradient-to-b from-gray-900 to-black text-white"; // Night
//     if (season === "Rainy") return "bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-800 dark:to-slate-900";

//     // Day
//     const isSurplus = totalGen >= totalLoad;
//     return isSurplus
//       ? "bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-950"
//       : "bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-950";
//   };

//   return (
//     <div className={cn("h-full w-full flex flex-col border-r border-slate-200/60 dark:border-slate-800 transition-colors duration-1000 relative group/panel", getDynamicBackground())}>

//       <button onClick={onExpand} className="absolute top-2 right-2 p-1.5 bg-black/20 text-white rounded opacity-50 hover:opacity-100 transition-opacity z-50" title={isExpanded ? "Minimize" : "Full Screen"}>
//         {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//       </button>

//       <div className="flex-1 overflow-y-auto p-4 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Zap size={20} className="fill-current text-yellow-500" />
//             <h2 className="font-bold uppercase tracking-wider text-sm">System</h2>
//           </div>
//           <div className="text-right">
//             <div className="text-lg font-mono font-bold flex items-center justify-end gap-2">
//               {isNight ? <Moon size={16} /> : <Sun size={16} className="text-yellow-500" />}
//               {time.toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}
//             </div>
//             <div className="text-[10px] font-mono opacity-60">
//               {time.toDateString()}
//             </div>
//               season === "Winter" && "bg-blue-100 text-blue-600",
//               season === "Rainy" && "bg-slate-200 text-slate-600",
//               season === "Autumn" && "bg-amber-100 text-amber-600"
//             )}>
//               {season}
//             </span>
//           </div>
//         </div>

//         {/* Supply Breakdown */}
//         <div className="p-4 bg-white/70 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl backdrop-blur-md shadow-sm transition-all hover:shadow-md">
//           <div className="flex justify-between items-end mb-2">
//             <span className="text-xs font-bold opacity-70 uppercase">Total Supply</span>
//             <span className="text-2xl font-mono font-bold">{Math.round(totalGen)} <span className="text-sm opacity-60">kW</span></span>
//           </div>

//           {/* Renewable Only */}
//           <div className="flex justify-between items-end mb-2 border-b border-black/5 dark:border-white/5 pb-2">
//             <span className="text-[10px] font-bold opacity-50 uppercase flex items-center gap-1"><TrendingUp size={12} /> Green Energy</span>
//             <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{Math.round(renewableGen)} kW</span>
//           </div>

//           {/* Multi-colored Bar (Requested: Solar->Orange/Yellow, Wind->Blue, Battery->Green) */}
//           <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden flex mb-3">
//             <div style={{ width: `${(solar / Math.max(1, totalGen)) * 100}%` }} className="h-full bg-yellow-400 transition-all duration-500"></div>
//             <div style={{ width: `${(wind / Math.max(1, totalGen)) * 100}%` }} className="h-full bg-blue-500 transition-all duration-500"></div>
//             <div style={{ width: `${(batteryPower / Math.max(1, totalGen)) * 100}%` }} className="h-full bg-green-500 transition-all duration-500"></div>
//           </div>

//           <div className="grid grid-cols-3 gap-2 text-[10px] opacity-70">
//             <div className="flex flex-col items-center p-1 rounded bg-yellow-500/10 border border-yellow-500/20">
//               <span className="font-bold text-yellow-600 dark:text-yellow-400">{Math.round(solar)}</span>
//               <span className="uppercase text-[9px]">Solar (Yel)</span>
//             </div>
//             <div className="flex flex-col items-center p-1 rounded bg-blue-500/10 border border-blue-500/20">
//               <span className="font-bold text-blue-600 dark:text-blue-400">{Math.round(wind)}</span>
//               <span className="uppercase text-[9px]">Wind (Blu)</span>
//             </div>
//             <div className="flex flex-col items-center p-1 rounded bg-green-500/10 border border-green-500/20">
//               <span className="font-bold text-green-600 dark:text-green-400">{Math.round(batteryPower)}</span>
//               <span className="uppercase text-[9px]">Batt (Grn)</span>
//             </div>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className={cn("space-y-4", isAutoPilot && "opacity-50 pointer-events-none")}>

//           <div className="space-y-4 p-4 bg-white/40 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5">
//             {/* Solar Slider */}
//             <div>
//               <div className="flex justify-between text-xs font-bold mb-1.5">
//                 <span>Solar Intensity {isNight && <span className="text-red-500 ml-1">(Night Mode)</span>}</span>
//                 <span className="font-mono">{Math.round(solar)} / {capacities.solar} kW</span>
//               </div>
//               {/* Solar: Orange/Yellow */}
//               <input type="range" min={0} max={capacities.solar} value={solar} onChange={(e) => { data.setSolar(Number(e.target.value)); }} disabled={isNight} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", isNight ? "bg-slate-300 dark:bg-slate-700" : "bg-yellow-200 accent-yellow-500")} />
//             </div>

//             {/* Wind Slider */}
//             <div>
//               <div className="flex justify-between text-xs font-bold mb-1.5">
//                 <span>Wind Intensity</span>
//                 <span className="font-mono">{Math.round(wind)} / {capacities.wind} kW</span>
//               </div>
//               {/* Wind: Blue */}
//               <input type="range" min={0} max={capacities.wind} value={wind} onChange={(e) => { data.setWind(Number(e.target.value)); }} className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
//             </div>

//             {/* Load Slider (Read Only) */}
//             <div>
//               <div className="flex justify-between text-xs font-bold mb-1.5 opacity-80">
//                 <span>Total Load (Calculated)</span>
//                 <span className="font-mono">{totalLoad} kW</span>
//               </div>
//               <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden border border-black/5">
//                 <div style={{ width: `${Math.min(100, (totalLoad / capacities.loadMax) * 100)}%` }} className="h-full bg-purple-500 transition-all duration-300"></div>
//               </div>
//               <p className="text-[10px] opacity-60 mt-1 text-right">Sum of all buildings in Playground</p>
//             </div>
//           </div>
//         </div>

//         {/* Battery Container */}
//         <div className="bg-white/60 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm flex flex-col items-center justify-center relative shadow-lg">
//           <h3 className="text-xs font-bold opacity-70 uppercase absolute top-4 left-4 flex items-center gap-1.5"><BatteryCharging size={14} className="text-green-500" /> Storage System</h3>

//           <div className="flex items-end gap-8 mt-6">
//             {/* Vertical Cylinder Battery */}
//             <div className="relative group cursor-pointer">
//               {/* Battery Cap */}
//               <div className="w-16 h-4 bg-slate-300 dark:bg-slate-600 rounded-t-full absolute -top-2 left-1/2 -translate-x-1/2 z-10 border-b border-black/10"></div>

//               {/* Battery Body Container */}
//               <div className="w-24 h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-slate-300 dark:border-slate-600 relative overflow-hidden shadow-inner flex flex-col justify-end">
//                 {/* Fluid Fill - Green */}
//                 <div
//                   className={cn("w-full transition-all duration-700 ease-in-out relative", battery < 20 ? "bg-red-500" : "bg-green-500")}
//                   style={{ height: `${battery}%` }}
//                 >
//                   {/* Wave Animation at Top */}
//                   {battery > 0 && (
//                     <div className="absolute -top-3 left-0 right-0 h-4 overflow-hidden -z-0">
//                       <div className="absolute top-0 left-0 h-full w-[200%] animate-wave flex">
//                         <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={cn("h-full w-1/2 fill-current", battery < 20 ? "text-red-500" : "text-green-500")}>
//                           <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
//                         </svg>
//                         <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={cn("h-full w-1/2 fill-current", battery < 20 ? "text-red-500" : "text-green-500")}>
//                           <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
//                         </svg>
//                       </div>
//                     </div>
//                   )}

//                   {/* Liquid Surface Effect */}
//                   <div className="w-full h-2 bg-white/30 absolute top-0 left-0" />
//                   {/* Bubbles Animation */}
//                   <div className="absolute inset-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse"></div>
//                 </div>

//                 {/* Glass Reflection */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-2xl"></div>

//                 {/* Percentage Text Centered */}
//                 <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none drop-shadow-md">
//                   <span className={cn("text-2xl font-black font-mono", battery > 50 ? "text-white" : "text-slate-800 dark:text-white")}>{Math.round(battery)}%</span>
//                 </div>
//               </div>

//               {/* Tooltip on Hover */}
//               <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
//                 Output: {batteryPower} kW
//               </div>
//             </div>

//             {/* Stats Info */}
//             <div className="flex flex-col gap-3 text-right">
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-slate-400">Available Energy</p>
//                 <p className="text-xl font-mono font-bold text-green-600 dark:text-green-400">{availableBatteryEnergy}</p>
//                 <p className="text-[10px] text-slate-500">kWh</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-slate-400">Total Capacity</p>
//                 <p className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{capacities.battery} kWh</p>
//               </div>
//               {isAutoPilot && (
//                 <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-blue-500 animate-pulse">
//                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
//                   Charging/Draining
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* Bottom Controls */}
//       <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-3 bg-white/20 dark:bg-black/20 backdrop-blur-md">
//         <button onClick={() => data.setIsAutoPilot(!isAutoPilot)} className={cn("w-full flex items-center justify-between p-3 rounded-xl border transition-all", isAutoPilot ? "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700" : "bg-white/50 border-slate-200 dark:bg-white/5 dark:border-slate-700")}>
//           <div className="flex items-center gap-3">
//             <div className={cn("p-2 rounded-lg", isAutoPilot ? "bg-purple-500 text-white" : "bg-slate-200 text-slate-500")}>
//               {isAutoPilot ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-bold">Auto-Pilot</p>
//               <p className="text-[10px] opacity-70">{isAutoPilot ? "System Running..." : "Paused"}</p>
//             </div>
//           </div>
//           <div className={cn("w-8 h-5 rounded-full relative transition-colors", isAutoPilot ? "bg-purple-500" : "bg-slate-300")}>
//             <div className={cn("absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform", isAutoPilot ? "translate-x-3" : "translate-x-0")}></div>
//           </div>
//         </button>

//         <button onClick={() => { handleAdvanceTime(); saveDataToBackend(solar, wind, totalLoad, battery); }} disabled={isAutoPilot} className={cn("w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition-all active:scale-95 group", isAutoPilot ? "bg-slate-400 cursor-not-allowed opacity-50" : "bg-blue-600 hover:bg-blue-700")}>
//           <Clock size={18} />
//           <span>Advance 1 Hr & Save</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// const PlaygroundSection = ({ buildings, setBuildings, isExpanded, onExpand, energyMix, time }: any) => (
//   <div className="h-full w-full bg-slate-50/50 dark:bg-[#0f1115] relative flex flex-col group/panel">
//     <button onClick={onExpand} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded opacity-0 group-hover/panel:opacity-100 transition-opacity z-50" title={isExpanded ? "Minimize" : "Full Screen"}>
//       {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//     </button>
//     <CampusVisualizer
//       buildings={buildings}
//       setBuildings={setBuildings}
//       energyMix={energyMix}
//       timeOfDay={time.getHours()}
//     />
//   </div>
// );

// // --- 4. RIGHT PANEL ---
// // --- 5. MAIN PAGE ---
// export default function DashboardPage() {
//   const logic = useDashboardLogic();
//   const [fullScreenPanel, setFullScreenPanel] = useState<"LEFT" | "MIDDLE" | null>(null);

//   if (!logic.mounted) return null;

//   return (
//     <div className="h-screen w-full bg-slate-100 dark:bg-black overflow-hidden flex flex-col">
//       <header className="h-14 bg-white dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between shrink-0">
//         <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
//           <span>⚡ Digital Twin Orchestrator</span>
//         </div>
//         <div className="text-xs font-mono text-slate-500">
//           AUTO-PILOT: <span className={logic.isAutoPilot ? "text-purple-500 font-bold" : "text-orange-500"}>{logic.isAutoPilot ? "ON" : "OFF"}</span>
//         </div>
//       </header>

//       <div className="flex-1 overflow-hidden">
//         {/* KEY PROP is the fix for the minimize layout bug */}
//         <ResizablePanelGroup direction="horizontal" key={fullScreenPanel || "default"}>

//           {(fullScreenPanel === null || fullScreenPanel === "LEFT") && (
//             <ResizablePanel defaultSize={25} minSize={20} maxSize={fullScreenPanel === "LEFT" ? 100 : 35} className={cn(fullScreenPanel === "LEFT" && "flex-1")}>
//               <CurrentStateSection data={logic} isExpanded={fullScreenPanel === "LEFT"} onExpand={() => setFullScreenPanel(fullScreenPanel === "LEFT" ? null : "LEFT")} />
//             </ResizablePanel>
//           )}

//           {fullScreenPanel === null && <ResizableHandle withHandle />}

//           {(fullScreenPanel === null || fullScreenPanel === "MIDDLE") && (
//             <ResizablePanel defaultSize={75} minSize={30} maxSize={100} className={cn(fullScreenPanel === "MIDDLE" && "flex-1")}>
//               <PlaygroundSection
//                 buildings={logic.buildings}
//                 setBuildings={logic.setBuildings}
//                 energyMix={logic.energyMix}
//                 time={logic.time}
//                 isExpanded={fullScreenPanel === "MIDDLE"}
//                 onExpand={() => setFullScreenPanel(fullScreenPanel === "MIDDLE" ? null : "MIDDLE")}
//               />
//             </ResizablePanel>
//           )}

//         </ResizablePanelGroup>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// import { Zap, Clock, Play, Pause, Sun, Moon, BatteryCharging, Maximize2, Minimize2, Battery, Leaf } from "lucide-react";
// import { cn } from "@/lib/utils";
// import CampusVisualizer from "./CampusVisualizer";
// import { BuildingData, BUILDING_TEMPLATES } from "./types";

// const useDashboardLogic = () => {
//   const [mounted, setMounted] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

//   const [time, setTime] = useState(() => {
//     const d = new Date(); d.setHours(0, 0, 0, 0); return d;
//   });

//   const getSeason = (date: Date) => {
//     const month = date.getMonth();
//     if (month >= 2 && month <= 5) return "Summer";
//     if (month >= 6 && month <= 8) return "Rainy";
//     if (month >= 9 && month <= 10) return "Autumn";
//     return "Winter";
//   };
//   const season = getSeason(selectedDate);

//   const [solar, setSolar] = useState(0);
//   const [wind, setWind] = useState(0);
//   const [batteryPercent, setBatteryPercent] = useState(30); // Start low so we can see charging
//   const [isAutoPilot, setIsAutoPilot] = useState(false);
//   const [batteryStatus, setBatteryStatus] = useState<"IDLE" | "CHARGING" | "DISCHARGING">("IDLE");

//   // Buildings initialized to ~550kW Total Load
//   const [buildings, setBuildings] = useState<BuildingData[]>([
//     { id: "1", type: "HOSTEL", x: 100, y: 100, ...BUILDING_TEMPLATES.HOSTEL, renewableRatio: 0 },
//     { id: "2", type: "LAB", x: 300, y: 150, ...BUILDING_TEMPLATES.LAB, renewableRatio: 0 },
//     { id: "3", type: "CLASSROOM", x: 200, y: 300, ...BUILDING_TEMPLATES.CLASSROOM, renewableRatio: 0 },
//     { id: "4", type: "ADMIN", x: 400, y: 250, ...BUILDING_TEMPLATES.ADMIN, renewableRatio: 0 },
//   ]);

//   // INCREASED CAPACITIES TO ENSURE CHARGING
//   const capacities = {
//     solar: 800, // Significantly higher than load (550)
//     wind: 600,
//     batteryKwh: 2000, 
//     maxDischargeRate: 600,
//     maxChargeRate: 500
//   };

//   useEffect(() => setMounted(true), []);

//   const totalLoad = buildings.reduce((sum, b) => sum + b.baseLoad, 0);

//   // --- SIMULATION STEP ---
//   const handleAdvanceTime = () => {
//     const updatedTime = new Date(time);
//     updatedTime.setHours(updatedTime.getHours() + 1);
//     const hour = updatedTime.getHours();

//     // 1. Generate Renewables (High enough to cause surplus)
//     let newSolar = 0;
//     if (hour >= 6 && hour < 18) {
//       const distFromNoon = Math.abs(12 - hour);
//       const factor = Math.max(0, 1 - (distFromNoon / 6.5)); 
//       newSolar = capacities.solar * factor * (Math.random() * 0.1 + 0.9);
//     }

//     // Wind (Variable but high enough to help)
//     let newWind = Math.max(50, Math.min(capacities.wind, wind + (Math.random() - 0.5) * 100));

//     // 2. Calculate Net Energy
//     const generation = newSolar + newWind;
//     const surplus = generation - totalLoad;

//     let newBatteryPercent = batteryPercent;
//     let status: "IDLE" | "CHARGING" | "DISCHARGING" = "IDLE";

//     if (surplus > 0) {
//       // CHARGE
//       status = "CHARGING";
//       const chargeAmount = Math.min(surplus, capacities.maxChargeRate);
//       const percentAdded = (chargeAmount / capacities.batteryKwh) * 100;
//       newBatteryPercent = Math.min(100, batteryPercent + percentAdded);
//     } else if (surplus < 0) {
//       // DISCHARGE
//       const deficit = Math.abs(surplus);
//       if (batteryPercent > 1) {
//         status = "DISCHARGING";
//         const dischargeNeeded = Math.min(deficit, capacities.maxDischargeRate);
//         const percentDrained = (dischargeNeeded / capacities.batteryKwh) * 100;
//         newBatteryPercent = Math.max(0, batteryPercent - percentDrained);
//       }
//     }

//     setSolar(newSolar);
//     setWind(newWind);
//     setBatteryPercent(newBatteryPercent);
//     setBatteryStatus(status);
//     setTime(updatedTime);
//   };

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isAutoPilot) interval = setInterval(handleAdvanceTime, 1200); // Slightly faster
//     return () => clearInterval(interval);
//   }, [isAutoPilot, time, batteryPercent, solar, wind]);

//   // --- ENERGY MIX CALC ---
//   const generation = solar + wind;
//   let batteryOutput = 0;

//   if (batteryStatus === "DISCHARGING") {
//     const deficit = Math.max(0, totalLoad - generation);
//     batteryOutput = Math.min(deficit, capacities.maxDischargeRate);
//   }

//   // Visual Mix Logic
//   const usedSolar = Math.min(solar, totalLoad);
//   const remainingAfterSolar = Math.max(0, totalLoad - usedSolar);

//   const usedWind = Math.min(wind, remainingAfterSolar);
//   const remainingAfterWind = Math.max(0, remainingAfterSolar - usedWind);

//   const usedBattery = Math.min(batteryOutput, remainingAfterWind);
//   const remainingAfterBattery = Math.max(0, remainingAfterWind - usedBattery);

//   const usedGrid = remainingAfterBattery;

//   const energyMix = {
//     solar: usedSolar / Math.max(1, totalLoad),
//     wind: usedWind / Math.max(1, totalLoad),
//     battery: usedBattery / Math.max(1, totalLoad), // This ensures Green Lines appear
//     grid: usedGrid / Math.max(1, totalLoad)
//   };

//   return {
//     mounted, time, solar, wind, batteryPercent, batteryStatus, isAutoPilot,
//     setSolar, setWind, setIsAutoPilot, setBatteryPercent,
//     handleAdvanceTime, buildings, setBuildings, totalLoad, capacities, energyMix,
//     season, selectedDate, setSelectedDate
//   };
// };

// const CurrentStateSection = ({ data }: any) => {
//   const { time, solar, wind, batteryPercent, batteryStatus, isAutoPilot, handleAdvanceTime, totalLoad, capacities, energyMix } = data;
//   const isNight = time.getHours() >= 18 || time.getHours() < 6;

//   return (
//     <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative">
//        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
//           <div className="flex justify-between items-center mb-1">
//             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dashboard</h2>
//             <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
//                {isNight ? <Moon size={14} /> : <Sun size={14} className="text-orange-500" />}
//                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Energy Monitor</h1>
//        </div>

//        <div className="flex-1 overflow-y-auto p-6 space-y-8">
//           <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
//              <div className="relative z-10 flex justify-between items-end">
//                 <div>
//                   <p className="text-indigo-100 text-xs font-bold uppercase mb-1">Campus Load</p>
//                   <p className="text-4xl font-mono font-bold">{totalLoad} <span className="text-lg opacity-60">kW</span></p>
//                 </div>
//                 <div className="text-right">
//                    <p className="text-xs font-bold opacity-80 mb-1">Grid Dependency</p>
//                    <p className="text-xl font-mono">{Math.round(energyMix.grid * 100)}%</p>
//                 </div>
//              </div>
//              <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
//                 <Zap size={120} />
//              </div>
//           </div>

//           <div className="space-y-6">
//              <div>
//                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
//                  <span className="flex items-center gap-1"><Sun size={12}/> Solar Output</span>
//                  <span>{Math.round(solar)} kW</span>
//                </div>
//                <div className="flex items-center gap-3">
//                  <input type="range" min="0" max={capacities.solar} value={solar} onChange={(e) => !isAutoPilot && data.setSolar(Number(e.target.value))} disabled={isAutoPilot} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
//                </div>
//              </div>

//              <div>
//                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
//                  <span className="flex items-center gap-1"><Leaf size={12}/> Wind Output</span>
//                  <span>{Math.round(wind)} kW</span>
//                </div>
//                <div className="flex items-center gap-3">
//                  <input type="range" min="0" max={capacities.wind} value={wind} onChange={(e) => !isAutoPilot && data.setWind(Number(e.target.value))} disabled={isAutoPilot} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
//                </div>
//              </div>

//              <div>
//                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
//                  <span className="flex items-center gap-1">
//                    <Battery size={12}/> Battery Level 
//                    {batteryStatus === "CHARGING" && <span className="text-blue-500 text-[10px] ml-2 animate-pulse font-bold">CHARGING (+{(data.capacities.maxChargeRate/data.capacities.batteryKwh*100).toFixed(0)}%/h)</span>}
//                    {batteryStatus === "DISCHARGING" && <span className="text-green-500 text-[10px] ml-2 animate-pulse font-bold">DISCHARGING</span>}
//                  </span>
//                  <span className={cn(batteryPercent < 20 ? "text-red-500" : "text-green-600")}>{Math.round(batteryPercent)}%</span>
//                </div>
//                <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden relative border border-slate-300">
//                   <div 
//                     className={cn("h-full transition-all duration-500", batteryPercent < 20 ? "bg-red-500" : "bg-green-500")} 
//                     style={{ width: `${batteryPercent}%` }} 
//                   />
//                   {batteryStatus === "CHARGING" && (
//                     <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30 animate-pulse"></div>
//                   )}
//                </div>
//                <div className="flex justify-between mt-2">
//                  <button onClick={() => data.setBatteryPercent(Math.max(0, batteryPercent - 10))} disabled={isAutoPilot} className="text-[10px] px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50">-10%</button>
//                  <button onClick={() => data.setBatteryPercent(Math.min(100, batteryPercent + 10))} disabled={isAutoPilot} className="text-[10px] px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50">+10%</button>
//                </div>
//              </div>
//           </div>
//        </div>

//        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200">
//           <div className="grid grid-cols-2 gap-3">
//              <button onClick={() => data.setIsAutoPilot(!isAutoPilot)} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all", isAutoPilot ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-white text-slate-600 border border-slate-200 shadow-sm")}>
//                 {isAutoPilot ? <Pause size={16} /> : <Play size={16} />}
//                 {isAutoPilot ? "Auto-Pilot" : "Manual"}
//              </button>
//              <button onClick={handleAdvanceTime} disabled={isAutoPilot} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
//                 <Clock size={16} /> +1 Hr
//              </button>
//           </div>
//        </div>
//     </div>
//   );
// };

// export default function DashboardPage() {
//   const logic = useDashboardLogic();
//   const [fullScreen, setFullScreen] = useState(false);

//   if (!logic.mounted) return null;

//   return (
//     <div className="h-screen w-full overflow-hidden flex flex-col bg-slate-100">
//        <ResizablePanelGroup direction="horizontal">
//           <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="hidden md:block">
//              <CurrentStateSection data={logic} />
//           </ResizablePanel>
//           <ResizableHandle />
//           <ResizablePanel defaultSize={75}>
//              <CampusVisualizer 
//                 buildings={logic.buildings} 
//                 setBuildings={logic.setBuildings} 
//                 energyMix={logic.energyMix} 
//                 batteryStatus={logic.batteryStatus}
//                 timeOfDay={logic.time.getHours()} 
//                 isFullScreen={fullScreen}
//                 onToggleFullScreen={() => setFullScreen(!fullScreen)}
//              />
//           </ResizablePanel>
//        </ResizablePanelGroup>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// import { Zap, Clock, Play, Pause, Sun, Moon, Battery, Leaf, RotateCcw, IndianRupee } from "lucide-react";
// import { cn } from "@/lib/utils";
// import CampusVisualizer from "./CampusVisualizer";
// import { BuildingData, BUILDING_TEMPLATES } from "./types";

// // --- TYPES FOR LOGS ---
// interface HourlyLog {
//   hour: string;
//   solar: number;
//   wind: number;
//   batteryDischarge: number;
//   gridUsed: number;
//   costSaved: number;
// }

// // --- LOGIC HOOK ---
// const useDashboardLogic = () => {
//   const [mounted, setMounted] = useState(false);

//   // Time starts at 00:00
//   const [time, setTime] = useState(() => {
//     const d = new Date(); d.setHours(0, 0, 0, 0); return d;
//   });

//   // States
//   const [solar, setSolar] = useState(0);
//   const [wind, setWind] = useState(0);
//   const [batteryPercent, setBatteryPercent] = useState(50);
//   const [isAutoPilot, setIsAutoPilot] = useState(false);
//   const [batteryStatus, setBatteryStatus] = useState<"IDLE" | "CHARGING" | "DISCHARGING">("IDLE");

//   // New: Logging States
//   const [hourlyLogs, setHourlyLogs] = useState<HourlyLog[]>([]);
//   const [totalCostSaved, setTotalCostSaved] = useState(0);

//   // Buildings - Init with total load ~550
//   const [buildings, setBuildings] = useState<BuildingData[]>([
//     { id: "1", type: "HOSTEL", x: 100, y: 100, ...BUILDING_TEMPLATES.HOSTEL, renewableRatio: 0 },
//     { id: "2", type: "LAB", x: 300, y: 150, ...BUILDING_TEMPLATES.LAB, renewableRatio: 0 },
//     { id: "3", type: "CLASSROOM", x: 200, y: 300, ...BUILDING_TEMPLATES.CLASSROOM, renewableRatio: 0 },
//     { id: "4", type: "ADMIN", x: 400, y: 250, ...BUILDING_TEMPLATES.ADMIN, renewableRatio: 0 },
//   ]);

//   const capacities = {
//     solar: 900,
//     wind: 600,
//     batteryKwh: 1000,
//     maxDischargeRate: 600,
//     maxChargeRate: 500
//   };

//   useEffect(() => setMounted(true), []);

//   const totalLoad = buildings.reduce((sum, b) => sum + b.baseLoad, 0);

//   // --- SIMULATION STEP ---
//   const handleAdvanceTime = () => {
//     // 1. Advance Time
//     const updatedTime = new Date(time);
//     updatedTime.setHours(updatedTime.getHours() + 1);
//     const hourVal = updatedTime.getHours();
//     const hourStr = updatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     // 2. Generate Renewables
//     let newSolar = 0;
//     if (hourVal >= 6 && hourVal < 18) {
//       const distFromNoon = Math.abs(12 - hourVal);
//       const factor = Math.max(0, 1 - (distFromNoon / 6.5));
//       newSolar = capacities.solar * factor * (Math.random() * 0.2 + 0.8);
//     }
//     let newWind = Math.max(0, Math.min(capacities.wind, wind + (Math.random() - 0.5) * 80));

//     // 3. Energy Logic
//     const generation = newSolar + newWind;
//     const surplus = generation - totalLoad;

//     let newBatteryPercent = batteryPercent;
//     let status: "IDLE" | "CHARGING" | "DISCHARGING" = "IDLE";
//     let batteryOutput = 0;

//     if (surplus > 0) {
//       // CHARGE
//       status = "CHARGING";
//       const chargeAmount = Math.min(surplus, capacities.maxChargeRate);
//       const percentAdded = (chargeAmount / capacities.batteryKwh) * 100;
//       newBatteryPercent = Math.min(100, batteryPercent + percentAdded);
//     } else if (surplus < 0) {
//       // DISCHARGE
//       const deficit = Math.abs(surplus);
//       if (batteryPercent > 2) {
//         status = "DISCHARGING";
//         const dischargeNeeded = Math.min(deficit, capacities.maxDischargeRate);
//         batteryOutput = dischargeNeeded; // Actual kW out
//         const percentDrained = (dischargeNeeded / capacities.batteryKwh) * 100;
//         newBatteryPercent = Math.max(0, batteryPercent - percentDrained);
//       }
//     }

//     // 4. Calculate Grid Usage & Cost
//     // Grid covers whatever renewables + battery didn't cover
//     const energyProvidedBySystem = newSolar + newWind + batteryOutput;
//     // Note: If we are charging, batteryOutput is 0. 
//     // Grid Used = Load - EnergyProvided (clamped to 0)
//     const gridUsed = Math.max(0, totalLoad - energyProvidedBySystem);

//     // Formula: (Renewable Produced - Grid Used) * 10
//     // Renewable Produced = newSolar + newWind (even if stored in battery, it was produced)
//     const costStep = ((newSolar + newWind) - gridUsed) * 10;

//     // 5. Update Logs
//     const newLog: HourlyLog = {
//       hour: hourStr,
//       solar: Math.round(newSolar),
//       wind: Math.round(newWind),
//       batteryDischarge: Math.round(batteryOutput),
//       gridUsed: Math.round(gridUsed),
//       costSaved: Math.round(costStep)
//     };

//     setHourlyLogs(prev => [...prev, newLog]);
//     setTotalCostSaved(prev => prev + Math.round(costStep));

//     // 6. Update State
//     setSolar(newSolar);
//     setWind(newWind);
//     setBatteryPercent(newBatteryPercent);
//     setBatteryStatus(status);
//     setTime(updatedTime);

//     // 7. Auto-Stop Check (After 24 logs)
//     // Note: We just added one, so check length + 1
//     if (hourlyLogs.length + 1 >= 24) {
//       setIsAutoPilot(false);
//     }
//   };

//   // Reset Function for Manual Restart
//   const resetDay = () => {
//     setHourlyLogs([]);
//     setTotalCostSaved(0);
//     const d = new Date(); d.setHours(0, 0, 0, 0);
//     setTime(d);
//     setIsAutoPilot(true);
//   };

//   // Toggle Handler
//   const toggleAutoPilot = () => {
//     if (!isAutoPilot && hourlyLogs.length >= 24) {
//       resetDay(); // Auto-restart if day is done
//     } else {
//       setIsAutoPilot(!isAutoPilot);
//     }
//   };

//   // Auto Loop
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isAutoPilot && hourlyLogs.length < 24) {
//       interval = setInterval(handleAdvanceTime, 800); // Slightly faster for 24h cycle
//     } else if (hourlyLogs.length >= 24) {
//       setIsAutoPilot(false); // Ensure it stops
//     }
//     return () => clearInterval(interval);
//   }, [isAutoPilot, time, batteryPercent, solar, wind, hourlyLogs]);

//   // Visual Mix Logic
//   let dischargeKw = batteryStatus === "DISCHARGING" ? Math.min(capacities.maxDischargeRate, Math.max(0, totalLoad - (solar + wind))) : 0;

//   const usedSolar = Math.min(solar, totalLoad);
//   const remaining1 = Math.max(0, totalLoad - usedSolar);
//   const usedWind = Math.min(wind, remaining1);
//   const remaining2 = Math.max(0, remaining1 - usedWind);
//   const usedBattery = Math.min(dischargeKw, remaining2);
//   const remaining3 = Math.max(0, remaining2 - usedBattery);

//   const energyMix = {
//     solar: usedSolar / Math.max(1, totalLoad),
//     wind: usedWind / Math.max(1, totalLoad),
//     battery: usedBattery / Math.max(1, totalLoad),
//     grid: remaining3 / Math.max(1, totalLoad)
//   };

//   return {
//     mounted, time, solar, wind, batteryPercent, batteryStatus, isAutoPilot,
//     setSolar, setWind, toggleAutoPilot, setBatteryPercent,
//     handleAdvanceTime, buildings, setBuildings, totalLoad, capacities, energyMix,
//     hourlyLogs, totalCostSaved, resetDay
//   };
// };

// // --- LEFT PANEL ---
// const CurrentStateSection = ({ data }: any) => {
//   const { time, solar, wind, batteryPercent, batteryStatus, isAutoPilot, handleAdvanceTime, totalLoad, capacities, energyMix, hourlyLogs, totalCostSaved, toggleAutoPilot, resetDay } = data;
//   const isNight = time.getHours() >= 18 || time.getHours() < 6;
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll table
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [hourlyLogs]);

//   return (
//     <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative">
//       {/* Top Right Total Cost */}
//       <div className="absolute top-4 right-4 z-10 flex flex-col items-end">
//         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Saved</div>
//         <div className={cn("text-xl font-mono font-bold flex items-center gap-1", totalCostSaved >= 0 ? "text-emerald-500" : "text-red-500")}>
//           <IndianRupee size={16} />
//           {totalCostSaved.toLocaleString()}
//         </div>
//       </div>

//       {/* Header */}
//       <div className="p-6 border-b border-slate-100 dark:border-slate-800">
//         <div className="flex justify-between items-center mb-1">
//           <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dashboard</h2>
//           <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-700 dark:text-slate-200 mr-20">
//             {isNight ? <Moon size={14} /> : <Sun size={14} className="text-orange-500" />}
//             {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </div>
//         </div>
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Energy Monitor</h1>
//       </div>

//       <div className="flex-1 overflow-y-hidden flex flex-col">
//         {/* Scrollable Content Area */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">

//           {/* Load Card */}
//           <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg shrink-0">
//             <div className="relative z-10 flex justify-between items-end">
//               <div>
//                 <p className="text-indigo-100 text-xs font-bold uppercase mb-1">Campus Load</p>
//                 <p className="text-4xl font-mono font-bold">{totalLoad} <span className="text-lg opacity-60">kW</span></p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs font-bold opacity-80 mb-1">Grid Use</p>
//                 <p className="text-xl font-mono">{Math.round(energyMix.grid * 100)}%</p>
//               </div>
//             </div>
//             <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
//               <Zap size={120} />
//             </div>
//           </div>

//           {/* Sliders Area (Compact) */}
//           <div className="space-y-4 shrink-0">
//             {/* Solar */}
//             <div>
//               <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
//                 <span className="flex items-center gap-1"><Sun size={12} /> Solar</span>
//                 <span>{Math.round(solar)} kW</span>
//               </div>
//               <input type="range" min="0" max={capacities.solar} value={solar} onChange={(e) => !isAutoPilot && data.setSolar(Number(e.target.value))} disabled={isAutoPilot} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
//             </div>

//             {/* Wind */}
//             <div>
//               <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
//                 <span className="flex items-center gap-1"><Leaf size={12} /> Wind</span>
//                 <span>{Math.round(wind)} kW</span>
//               </div>
//               <input type="range" min="0" max={capacities.wind} value={wind} onChange={(e) => !isAutoPilot && data.setWind(Number(e.target.value))} disabled={isAutoPilot} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
//             </div>

//             {/* Battery */}
//             <div>
//               <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
//                 <span className="flex items-center gap-1">
//                   <Battery size={12} /> Batt ({batteryStatus})
//                 </span>
//                 <span className={cn(batteryPercent < 20 ? "text-red-500" : "text-green-600")}>{Math.round(batteryPercent)}%</span>
//               </div>
//               <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden relative border border-slate-300">
//                 <div className={cn("h-full transition-all duration-500", batteryPercent < 20 ? "bg-red-500" : "bg-green-500")} style={{ width: `${batteryPercent}%` }} />
//                 {batteryStatus === "CHARGING" && <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30 animate-pulse"></div>}
//               </div>
//             </div>
//           </div>

//           {/* --- CONTROLS --- */}
//           <div className="grid grid-cols-2 gap-3 shrink-0">
//             <button onClick={toggleAutoPilot} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all", isAutoPilot ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-white text-slate-600 border border-slate-200 shadow-sm")}>
//               {isAutoPilot ? <Pause size={16} /> : <Play size={16} />}
//               {isAutoPilot ? "Pause" : hourlyLogs.length >= 24 ? "Restart Day" : "Auto-Pilot"}
//             </button>
//             <button onClick={handleAdvanceTime} disabled={isAutoPilot || hourlyLogs.length >= 24} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
//               <Clock size={16} /> +1 Hr
//             </button>
//           </div>

//           {/* --- DATA TABLE --- */}
//           <div className="flex-1 flex flex-col min-h-[200px]">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-xs font-bold uppercase text-slate-400">24H Cycle Log</h3>
//               <button onClick={resetDay} className="text-[10px] text-slate-500 hover:text-red-500 flex items-center gap-1"><RotateCcw size={10} /> Reset</button>
//             </div>

//             <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-white shadow-sm flex-1">
//               {/* Table Header */}
//               <div className="grid grid-cols-5 bg-slate-100 p-2 text-[9px] font-bold text-slate-500 uppercase text-center border-b border-slate-200">
//                 <div>Time</div>
//                 <div>Solar</div>
//                 <div>Wind</div>
//                 <div>Bat.Out</div>
//                 <div>Saved</div>
//               </div>

//               {/* Table Body */}
//               <div ref={scrollRef} className="overflow-y-auto max-h-[250px] bg-slate-50/50">
//                 {hourlyLogs.length === 0 ? (
//                   <div className="p-8 text-center text-xs text-slate-400 italic">Start simulation to generate data...</div>
//                 ) : (
//                   hourlyLogs.map((log, i) => (
//                     <div key={i} className="grid grid-cols-5 p-2 text-[10px] font-mono text-center border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
//                       <div className="text-slate-500">{log.hour}</div>
//                       <div className="text-yellow-600 font-bold">{log.solar}</div>
//                       <div className="text-blue-600 font-bold">{log.wind}</div>
//                       <div className="text-green-600 font-bold">{log.batteryDischarge}</div>
//                       <div className={cn("font-bold", log.costSaved >= 0 ? "text-emerald-600" : "text-red-500")}>
//                         {log.costSaved}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default function DashboardPage() {
//   const logic = useDashboardLogic();
//   const [fullScreen, setFullScreen] = useState(false);

//   if (!logic.mounted) return null;

//   return (
//     <div className="h-screen w-full overflow-hidden flex flex-col bg-slate-100">
//       <ResizablePanelGroup direction="horizontal">
//         <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="hidden md:block">
//           <CurrentStateSection data={logic} />
//         </ResizablePanel>
//         <ResizableHandle />
//         <ResizablePanel defaultSize={70}>
//           <CampusVisualizer
//             buildings={logic.buildings}
//             setBuildings={logic.setBuildings}
//             energyMix={logic.energyMix}
//             batteryStatus={logic.batteryStatus}
//             timeOfDay={logic.time.getHours()}
//             isFullScreen={fullScreen}
//             onToggleFullScreen={() => setFullScreen(!fullScreen)}
//           />
//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState, useRef } from "react";
// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// import { Zap, Clock, Play, Pause, Sun, Moon, Battery, BatteryCharging, Leaf, RotateCcw, IndianRupee, TrendingUp, BarChart3, X } from "lucide-react";
// import { cn } from "@/lib/utils";
// import CampusVisualizer from "./CampusVisualizer";
// import { BuildingData, BUILDING_TEMPLATES } from "./types";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
// import { motion, AnimatePresence } from "framer-motion";

// // --- TYPES FOR LOGS ---
// interface HourlyLog {
//   hour: string;
//   solar: number;
//   wind: number;
//   batteryDischarge: number;
//   gridUsed: number;
//   costSaved: number;
//   totalLoad: number;
// }

// // --- LOGIC HOOK ---
// const useDashboardLogic = () => {
//   const [mounted, setMounted] = useState(false);

//   // Time starts at 00:00
//   const [time, setTime] = useState(() => {
//     const d = new Date(); d.setHours(0, 0, 0, 0); return d;
//   });

//   // States
//   const [solar, setSolar] = useState(0);
//   const [wind, setWind] = useState(0);
//   const [batteryPercent, setBatteryPercent] = useState(50);
//   const [isAutoPilot, setIsAutoPilot] = useState(false);
//   const [batteryStatus, setBatteryStatus] = useState<"IDLE" | "CHARGING" | "DISCHARGING">("IDLE");

//   // Logging States
//   const [hourlyLogs, setHourlyLogs] = useState<HourlyLog[]>([]);
//   const [totalCostSaved, setTotalCostSaved] = useState(0);

//   // Buildings - Init with localStorage or default
//   const [buildings, setBuildings] = useState<BuildingData[]>([]);
//   const [isLoaded, setIsLoaded] = useState(false);

//   // Load from LocalStorage on mount
//   useEffect(() => {
//     const saved = localStorage.getItem("campus-buildings");
//     if (saved) {
//       try {
//         setBuildings(JSON.parse(saved));
//       } catch (e) {
//         console.error("Failed to parse buildings", e);
//         setBuildings([
//           { id: "1", type: "HOSTEL", x: 100, y: 100, ...BUILDING_TEMPLATES.HOSTEL, renewableRatio: 0 },
//           { id: "2", type: "LAB", x: 300, y: 150, ...BUILDING_TEMPLATES.LAB, renewableRatio: 0 },
//           { id: "3", type: "ADMIN", x: 500, y: 200, ...BUILDING_TEMPLATES.ADMIN, renewableRatio: 0 },
//           { id: "4", type: "CLASSROOM", x: 200, y: 300, ...BUILDING_TEMPLATES.CLASSROOM, renewableRatio: 0 },
//         ]);
//       }
//     } else {
//       setBuildings([
//         { id: "1", type: "HOSTEL", x: 100, y: 100, ...BUILDING_TEMPLATES.HOSTEL, renewableRatio: 0 },
//         { id: "2", type: "LAB", x: 300, y: 150, ...BUILDING_TEMPLATES.LAB, renewableRatio: 0 },
//         { id: "3", type: "ADMIN", x: 500, y: 200, ...BUILDING_TEMPLATES.ADMIN, renewableRatio: 0 },
//         { id: "4", type: "CLASSROOM", x: 200, y: 300, ...BUILDING_TEMPLATES.CLASSROOM, renewableRatio: 0 },
//       ]);
//     }
//     setIsLoaded(true);
//   }, []);

//   // Save to LocalStorage whenever buildings change
//   useEffect(() => {
//     if (isLoaded) {
//       localStorage.setItem("campus-buildings", JSON.stringify(buildings));
//     }
//   }, [buildings, isLoaded]);

//   const capacities = {
//     solar: 900,
//     wind: 600,
//     batteryKwh: 1000,
//     maxDischargeRate: 600,
//     maxChargeRate: 500
//   };

//   useEffect(() => setMounted(true), []);
//   const totalLoad = buildings.reduce((sum, b) => sum + b.baseLoad, 0);
//   // --- SIMULATION STEP ---
//   const handleAdvanceTime = () => {
//     let currentLogs = [...hourlyLogs];
//     let currentBaseTime = new Date(time);
//     let currentTotalSaved = totalCostSaved;

//     if (currentLogs.length >= 24) {
//       currentLogs = [];
//       currentTotalSaved = 0;
//       currentBaseTime = new Date();
//       currentBaseTime.setHours(0, 0, 0, 0);
//       setHourlyLogs([]);
//       setTotalCostSaved(0);
//     }

//     const updatedTime = new Date(currentBaseTime);
//     updatedTime.setHours(updatedTime.getHours() + 1);
//     const hourVal = updatedTime.getHours();
//     const hourStr = updatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     let newSolar = 0;
//     if (hourVal >= 6 && hourVal < 18) {
//       const distFromNoon = Math.abs(12 - hourVal);
//       const factor = Math.max(0, 1 - (distFromNoon / 6.5));
//       newSolar = capacities.solar * factor * (Math.random() * 0.2 + 0.8);
//     }
//     let newWind = Math.max(0, Math.min(capacities.wind, wind + (Math.random() - 0.5) * 80));

//     const generation = newSolar + newWind;
//     const surplus = generation - totalLoad;

//     let newBatteryPercent = batteryPercent;
//     let status: "IDLE" | "CHARGING" | "DISCHARGING" = "IDLE";
//     let batteryOutput = 0;

//     if (surplus > 0) {
//       status = "CHARGING";
//       const chargeAmount = Math.min(surplus, capacities.maxChargeRate);
//       const percentAdded = (chargeAmount / capacities.batteryKwh) * 100;
//       newBatteryPercent = Math.min(100, batteryPercent + percentAdded);
//     } else if (surplus < 0) {
//       const deficit = Math.abs(surplus);
//       if (batteryPercent > 2) {
//         status = "DISCHARGING";
//         const dischargeNeeded = Math.min(deficit, capacities.maxDischargeRate);
//         batteryOutput = dischargeNeeded;
//         const percentDrained = (dischargeNeeded / capacities.batteryKwh) * 100;
//         newBatteryPercent = Math.max(0, batteryPercent - percentDrained);
//       }
//     }

//     const energyProvidedBySystem = newSolar + newWind + batteryOutput;
//     const gridUsed = Math.max(0, totalLoad - energyProvidedBySystem);

//     const costStep = ((newSolar + newWind + batteryOutput) - gridUsed) * 2;

//     const newLog: HourlyLog = {
//       hour: hourStr,
//       solar: Math.round(newSolar),
//       wind: Math.round(newWind),
//       batteryDischarge: Math.round(batteryOutput),
//       gridUsed: Math.round(gridUsed),
//       costSaved: Math.round(costStep),
//       totalLoad: totalLoad
//     };

//     const updatedLogs = [...currentLogs, newLog];

//     setHourlyLogs(updatedLogs);
//     setTotalCostSaved(currentTotalSaved + Math.round(costStep));

//     setSolar(newSolar);
//     setWind(newWind);
//     setBatteryPercent(newBatteryPercent);
//     setBatteryStatus(status);
//     setTime(updatedTime);

//     if (updatedLogs.length >= 24) {
//       setIsAutoPilot(false);
//     }
//   };

//   const resetDay = () => {
//     setHourlyLogs([]);
//     setTotalCostSaved(0);
//     const d = new Date(); d.setHours(0, 0, 0, 0);
//     setTime(d);
//     setIsAutoPilot(true);
//   };

//   const toggleAutoPilot = () => {
//     if (!isAutoPilot && hourlyLogs.length >= 24) {
//       resetDay();
//     } else {
//       setIsAutoPilot(!isAutoPilot);
//     }
//   };

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isAutoPilot && hourlyLogs.length < 24) {
//       interval = setInterval(handleAdvanceTime, 2000);
//     }
//     return () => clearInterval(interval);
//   }, [isAutoPilot, hourlyLogs]);

//   let dischargeKw = batteryStatus === "DISCHARGING" ? Math.min(capacities.maxDischargeRate, Math.max(0, totalLoad - (solar + wind))) : 0;

//   const usedSolar = Math.min(solar, totalLoad);
//   const remaining1 = Math.max(0, totalLoad - usedSolar);
//   const usedWind = Math.min(wind, remaining1);
//   const remaining2 = Math.max(0, remaining1 - usedWind);
//   const usedBattery = Math.min(dischargeKw, remaining2);
//   const remaining3 = Math.max(0, remaining2 - usedBattery);

//   const energyMix = {
//     solar: usedSolar / Math.max(1, totalLoad),
//     wind: usedWind / Math.max(1, totalLoad),
//     battery: usedBattery / Math.max(1, totalLoad),
//     grid: remaining3 / Math.max(1, totalLoad)
//   };

//   return {
//     mounted, time, solar, wind, batteryPercent, batteryStatus, isAutoPilot,
//     setSolar, setWind, toggleAutoPilot, setBatteryPercent,
//     handleAdvanceTime, buildings, setBuildings, totalLoad, capacities, energyMix,
//     hourlyLogs, totalCostSaved, resetDay
//   };
// };

// // --- LEFT PANEL ---
// const CurrentStateSection = ({ data }: any) => {
//   const { time, solar, wind, batteryPercent, batteryStatus, isAutoPilot, handleAdvanceTime, totalLoad, capacities, energyMix, hourlyLogs, totalCostSaved, toggleAutoPilot, setBatteryPercent } = data;
//   const isNight = time.getHours() >= 18 || time.getHours() < 6;
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [hourlyLogs]);

//   const handleBatteryClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isAutoPilot) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const height = rect.height;
//     const clickY = e.clientY - rect.top;
//     const newPercent = Math.max(0, Math.min(100, ((height - clickY) / height) * 100));
//     setBatteryPercent(newPercent);
//   };

//   return (
//     <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative">
//       <style jsx>{`
//          @keyframes wave {
//            0% { transform: translateX(0) translateZ(0) scaleY(1); }
//            50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
//            100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
//          }
//          .animate-wave {
//            animation: wave 5s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
//          }
//        `}</style>

//       <div className="absolute top-4 right-4 z-10 flex flex-col items-end">
//         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Saved</div>
//         <div className={cn("text-xl font-mono font-bold flex items-center gap-1", totalCostSaved >= 0 ? "text-emerald-500" : "text-red-500")}>
//           <IndianRupee size={16} />
//           {totalCostSaved.toLocaleString()}
//         </div>
//       </div>

//       <div className="p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
//         <div className="flex justify-between items-center mb-1">
//           <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dashboard</h2>
//           <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-700 dark:text-slate-200 mr-20">
//             {isNight ? <Moon size={14} /> : <Sun size={14} className="text-orange-500" />}
//             {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </div>
//         </div>
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Energy Monitor</h1>
//       </div>

//       <div className="flex-1 overflow-y-auto p-6 space-y-6">

//         <div className="flex gap-4">
//           <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white shadow-lg flex flex-col justify-between h-48">
//             <div className="relative z-10">
//               <p className="text-indigo-100 text-[10px] font-bold uppercase mb-1">Campus Load</p>
//               <p className="text-3xl font-mono font-bold">{totalLoad} <span className="text-sm opacity-60">kW</span></p>
//             </div>
//             <div className="relative z-10">
//               <p className="text-[10px] font-bold opacity-80 mb-1">Grid Use</p>
//               <p className="text-lg font-mono">{Math.round(energyMix.grid * 100)}%</p>
//             </div>
//             <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
//               <Zap size={100} />
//             </div>
//           </div>

//           <div className="w-24 h-48 bg-slate-100 rounded-2xl border-4 border-slate-300 relative flex flex-col items-center justify-end shadow-inner overflow-hidden group cursor-pointer" onClick={handleBatteryClick}>
//             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-slate-300 rounded-sm z-20" />

//             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none mix-blend-difference text-white">
//               <span className="text-xl font-bold font-mono">{Math.round(batteryPercent)}%</span>
//               <span className="text-[9px] uppercase font-bold opacity-80">{batteryStatus === "IDLE" ? "" : batteryStatus}</span>
//             </div>

//             <div
//               className={cn("w-full transition-all duration-700 relative", batteryPercent < 20 ? "bg-red-500" : "bg-green-500")}
//               style={{ height: `${batteryPercent}%` }}
//             >
//               <div className="absolute -top-3 left-0 w-[200%] h-6 animate-wave flex">
//                 <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={cn("h-full w-1/2 fill-current", batteryPercent < 20 ? "text-red-500" : "text-green-500")}>
//                   <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
//                 </svg>
//                 <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={cn("h-full w-1/2 fill-current", batteryPercent < 20 ? "text-red-500" : "text-green-500")}>
//                   <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
//                 </svg>
//               </div>

//               {batteryStatus === "CHARGING" && (
//                 <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
//               <span className="flex items-center gap-1"><Sun size={12} /> Solar</span>
//               <span>{Math.round(solar)} kW</span>
//             </div>
//             <input type="range" min="0" max={capacities.solar} value={solar} onChange={(e) => !isAutoPilot && data.setSolar(Number(e.target.value))} disabled={isAutoPilot} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
//           </div>

//           <div>
//             <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
//               <span className="flex items-center gap-1"><Leaf size={12} /> Wind</span>
//               <span>{Math.round(wind)} kW</span>
//             </div>
//             <input type="range" min="0" max={capacities.wind} value={wind} onChange={(e) => !isAutoPilot && data.setWind(Number(e.target.value))} disabled={isAutoPilot} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <button onClick={toggleAutoPilot} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all", isAutoPilot ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-white text-slate-600 border border-slate-200 shadow-sm")}>
//             {isAutoPilot ? <Pause size={16} /> : <Play size={16} />}
//             {isAutoPilot ? "Pause" : hourlyLogs.length >= 24 ? "Restart" : "Auto-Pilot"}
//           </button>

//           <button onClick={handleAdvanceTime} disabled={isAutoPilot} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
//             <Clock size={16} /> +1 Hr
//           </button>
//         </div>

//         <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
//           <div className="grid grid-cols-5 bg-slate-100 p-2 text-[9px] font-bold text-slate-500 uppercase text-center border-b border-slate-200">
//             <div>Time</div>
//             <div>Solar</div>
//             <div>Wind</div>
//             <div>Bat.Out</div>
//             <div>Saved</div>
//           </div>

//           <div ref={scrollRef} className="overflow-y-auto max-h-[200px] bg-slate-50/50">
//             {hourlyLogs.length === 0 ? (
//               <div className="p-8 text-center text-xs text-slate-400 italic">Ready to start...</div>
//             ) : (
//               hourlyLogs.map((log, i) => (
//                 <div key={i} className="grid grid-cols-5 p-2 text-[10px] font-mono text-center border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
//                   <div className="text-slate-500">{log.hour}</div>
//                   <div className="text-yellow-600 font-bold">{log.solar}</div>
//                   <div className="text-blue-600 font-bold">{log.wind}</div>
//                   <div className="text-green-600 font-bold">{log.batteryDischarge}</div>
//                   <div className={cn("font-bold", log.costSaved >= 0 ? "text-emerald-600" : "text-red-500")}>
//                     {log.costSaved}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function DashboardPage() {
//   const logic = useDashboardLogic();
//   const [fullScreen, setFullScreen] = useState(false);
//   const [showAnalytics, setShowAnalytics] = useState(false);

//   // Prepare Data for Graphs
//   const graphData = logic.hourlyLogs.map(log => ({
//     name: log.hour,
//     solar: log.solar,
//     wind: log.wind,
//     totalRenewable: log.solar + log.wind,
//     load: log.totalLoad
//   }));

//   if (!logic.mounted) return null;

//   return (
//     <div className="h-screen w-full overflow-hidden flex flex-col bg-slate-100">
//       <ResizablePanelGroup direction="horizontal">
//         <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="hidden md:block">
//           <CurrentStateSection data={logic} />
//         </ResizablePanel>
//         <ResizableHandle />
//         <ResizablePanel defaultSize={70} className="relative">

//           {/* --- ANALYTICS BUTTON --- */}
//           <button
//             onClick={() => setShowAnalytics(true)}
//             className="absolute top-4 right-16 z-50 p-2 bg-white/90 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg shadow-md border border-slate-200 transition-all"
//             title="View Analytics"
//           >
//             <BarChart3 size={18} />
//           </button>

//           <CampusVisualizer
//             buildings={logic.buildings}
//             setBuildings={logic.setBuildings}
//             energyMix={logic.energyMix}
//             batteryStatus={logic.batteryStatus}
//             timeOfDay={logic.time.getHours()}
//             isFullScreen={fullScreen}
//             onToggleFullScreen={() => setFullScreen(!fullScreen)}
//             windOutput={logic.wind}
//             solarOutput={logic.solar}
//           />

//           {/* --- ANALYTICS MODAL --- */}
//           <AnimatePresence>
//             {showAnalytics && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-8"
//               >
//                 <motion.div
//                   initial={{ scale: 0.9, y: 20 }}
//                   animate={{ scale: 1, y: 0 }}
//                   exit={{ scale: 0.9, y: 20 }}
//                   className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full h-full max-w-5xl max-h-[600px] flex flex-col overflow-hidden"
//                 >
//                   {/* Modal Header */}
//                   <div className="flex justify-between items-center p-6 border-b border-slate-100">
//                     <div className="flex items-center gap-2">
//                       <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BarChart3 size={20} /></div>
//                       <div>
//                         <h2 className="text-xl font-bold text-slate-800">Session Analytics</h2>
//                         <p className="text-xs text-slate-500">Real-time performance metrics</p>
//                       </div>
//                     </div>
//                     <button onClick={() => setShowAnalytics(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={20} /></button>
//                   </div>

//                   {/* Modal Content - Graphs */}
//                   <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">

//                     {/* Graph 1 */}
//                     <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col">
//                       <div className="flex items-center gap-2 mb-4">
//                         <TrendingUp size={16} className="text-blue-500" />
//                         <h4 className="text-sm font-bold text-slate-600 uppercase">Renewable Mix</h4>
//                       </div>
//                       <div className="flex-1 w-full min-h-0">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <AreaChart data={graphData}>
//                             <defs>
//                               <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
//                                 <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
//                               </linearGradient>
//                               <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
//                                 <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
//                               </linearGradient>
//                             </defs>
//                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//                             <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
//                             <YAxis fontSize={10} tickLine={false} axisLine={false} />
//                             <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
//                             <Legend />
//                             <Area type="monotone" dataKey="solar" name="Solar" stroke="#EAB308" fillOpacity={1} fill="url(#colorSolar)" strokeWidth={2} />
//                             <Area type="monotone" dataKey="wind" name="Wind" stroke="#3B82F6" fillOpacity={1} fill="url(#colorWind)" strokeWidth={2} />
//                           </AreaChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>

//                     {/* Graph 2 */}
//                     <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col">
//                       <div className="flex items-center gap-2 mb-4">
//                         <Zap size={16} className="text-green-500" />
//                         <h4 className="text-sm font-bold text-slate-600 uppercase">Supply vs Demand</h4>
//                       </div>
//                       <div className="flex-1 w-full min-h-0">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <LineChart data={graphData}>
//                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//                             <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
//                             <YAxis fontSize={10} tickLine={false} axisLine={false} />
//                             <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
//                             <Legend />
//                             <Line type="monotone" dataKey="totalRenewable" name="Generation (kW)" stroke="#10B981" strokeWidth={3} dot={false} />
//                             <Line type="step" dataKey="load" name="Total Load (kW)" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
//                           </LineChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>

//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </div>
//   );
// }

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

// --- LOGIC HOOK ---
const useDashboardLogic = () => {
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

  // Buildings - Init with localStorage or default
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("campus-buildings");
    if (saved) {
      try {
        setBuildings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse buildings", e);
        setBuildings([
          { id: "1", type: "HOSTEL", x: 100, y: 100, ...BUILDING_TEMPLATES.HOSTEL, renewableRatio: 0 },
          { id: "2", type: "LAB", x: 300, y: 150, ...BUILDING_TEMPLATES.LAB, renewableRatio: 0 },
          { id: "3", type: "ADMIN", x: 500, y: 200, ...BUILDING_TEMPLATES.ADMIN, renewableRatio: 0 },
          { id: "4", type: "CLASSROOM", x: 200, y: 300, ...BUILDING_TEMPLATES.CLASSROOM, renewableRatio: 0 },
        ]);
      }
    } else {
      setBuildings([
        { id: "1", type: "HOSTEL", x: 100, y: 100, ...BUILDING_TEMPLATES.HOSTEL, renewableRatio: 0 },
        { id: "2", type: "LAB", x: 300, y: 150, ...BUILDING_TEMPLATES.LAB, renewableRatio: 0 },
        { id: "3", type: "ADMIN", x: 500, y: 200, ...BUILDING_TEMPLATES.ADMIN, renewableRatio: 0 },
        { id: "4", type: "CLASSROOM", x: 200, y: 300, ...BUILDING_TEMPLATES.CLASSROOM, renewableRatio: 0 },
      ]);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever buildings change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("campus-buildings", JSON.stringify(buildings));
    }
  }, [buildings, isLoaded]);

  const capacities = {
    solar: 900,
    wind: 600,
    batteryKwh: 1000,
    maxDischargeRate: 600,
    maxChargeRate: 500
  };

  useEffect(() => {
    setMounted(true);
    // Reset backend logs on mount to ensure a fresh session on refresh
    fetch('/api/digital-twin/reset-simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campus_id: "CAMPUS_001" })
    }).catch(err => console.error("Failed to reset logs on mount", err));
  }, []);
  const totalLoad = buildings.reduce((sum, b) => sum + b.baseLoad, 0);

  const saveSimulationData = async (s: number, w: number, b_output: number, b_percent: number, saved_val: number, current_time: string, grid_used: number, total_load: number) => {
    try {
      await fetch('/api/digital-twin/save-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campus_id: "CAMPUS_001",
          date: selectedDate.toISOString().split('T')[0],
          time: current_time,
          wind_capacity: w,
          solar_capacity: s,
          battery_output: b_output,
          battery_percentage: b_percent,
          saved: saved_val,
          grid_used: grid_used,
          total_load: total_load
        })
      });
    } catch (e) { console.error("Simulation save error", e); }
  };

  // --- SIMULATION STEP ---
  const handleAdvanceTime = (saveToCloud = false) => {
    // STRICT GUARD: Absolute limit of 24 logs
    if (hourlyLogs.length >= 24) {
      setIsAutoPilot(false);
      return;
    }

    let currentLogs = [...hourlyLogs];
    let currentBaseTime = new Date(time);
    let currentTotalSaved = totalCostSaved;

    // Redundant safety check, but keeping flow
    if (currentLogs.length >= 24) {
      // Should be caught by guard, but just in case
      setIsAutoPilot(false);
      return;
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
      if (newSolar < 50) newSolar = 0; // Cut-off threshold
    }
    let newWind = Math.max(0, Math.min(capacities.wind, wind + (Math.random() - 0.5) * 80));
    if (newWind < 10) newWind = 0; // Cut-off threshold

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

    // STATE UPDATES
    setHourlyLogs(updatedLogs);
    setTotalCostSaved(currentTotalSaved + Math.round(costStep));

    setSolar(newSolar);
    setWind(newWind);
    setBatteryPercent(newBatteryPercent);
    setBatteryStatus(status);
    setTime(updatedTime);

    // PERSISTENCE: Save to Cloud
    if (saveToCloud) {
      // We only save if we haven't exceeded 24 logs (already checked by guard)
      // Use fire-and-forget but log errors
      saveSimulationData(newSolar, newWind, batteryOutput, newBatteryPercent, Math.round(costStep), hourStr, Math.round(gridUsed), totalLoad)
        .catch(err => console.error("Error saving simulation data:", err));
    }

    // Auto-Stop if we just hit 24
    if (updatedLogs.length >= 24) {
      setIsAutoPilot(false);
    }
  };

  const resetDay = async () => {
    // 1. Reset frontend
    setHourlyLogs([]);
    setTotalCostSaved(0);
    const d = new Date(); d.setHours(0, 0, 0, 0);
    setTime(d);

    // 2. Reset Backend Logs (Critical for fresh cycle)
    try {
      await fetch('/api/digital-twin/reset-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campus_id: "CAMPUS_001" })
      });
      console.log("Backend simulation logs reset successfully.");
    } catch (e) {
      console.error("Failed to reset backend logs:", e);
    }

    // 3. Start Auto Pilot
    setIsAutoPilot(true);
  };

  const toggleAutoPilot = async () => {
    if (isAutoPilot) {
      // PAUSE: Just stop the interval, do NOT reset data
      setIsAutoPilot(false);
    } else {
      // START / RESUME
      if (hourlyLogs.length >= 24) {
        // Cycle complete, restart from scratch
        await resetDay();
      } else if (hourlyLogs.length === 0) {
        // Fresh Start: CLEAN DB FIRST
        try {
          await fetch('/api/digital-twin/reset-simulation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campus_id: "CAMPUS_001" })
          });
        } catch (e) { console.error("AutoPilot Start Reset Error", e); }

        setIsAutoPilot(true);
      } else {
        // RESUME: Continue adding to existing logs (DB not cleared)
        setIsAutoPilot(true);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPilot && hourlyLogs.length < 24) {
      interval = setInterval(() => handleAdvanceTime(true), 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoPilot, hourlyLogs]);

  const effectiveWind = wind < 10 ? 0 : wind;
  const effectiveSolar = solar < 50 ? 0 : solar;
  let dischargeKw = batteryStatus === "DISCHARGING" ? Math.min(capacities.maxDischargeRate, Math.max(0, totalLoad - (effectiveSolar + effectiveWind))) : 0;

  const usedSolar = Math.min(effectiveSolar, totalLoad);
  const remaining1 = Math.max(0, totalLoad - usedSolar);
  const usedWind = Math.min(effectiveWind, remaining1);
  const remaining2 = Math.max(0, remaining1 - usedWind);
  const usedBattery = Math.min(dischargeKw, remaining2);
  const remaining3 = Math.max(0, remaining2 - usedBattery);

  const energyMix = {
    solar: usedSolar / Math.max(1, totalLoad),
    wind: usedWind / Math.max(1, totalLoad),
    battery: usedBattery / Math.max(1, totalLoad),
    grid: remaining3 / Math.max(1, totalLoad)
  };

  // =================================================================
  //  DATA BRIDGE: Save Simulation Data to Local Storage
  // =================================================================
  useEffect(() => {
    if (!mounted) return;

    const simulationData = {
      solar: solar,
      wind: wind,
      hourlyLogs: hourlyLogs,
      capacities: capacities,
      totalCostSaved: totalCostSaved,
      totalLoad: totalLoad,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem("campus-simulation-data", JSON.stringify(simulationData));
  }, [solar, wind, hourlyLogs, capacities, totalCostSaved, totalLoad, mounted]);
  // =================================================================

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

      <div className="absolute top-4 left-4 z-10 flex flex-col items-start">
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
            <input type="range" min="0" max={capacities.solar} value={solar} onChange={(e) => !isAutoPilot && data.setSolar(Math.max(50, Number(e.target.value)))} disabled={isAutoPilot} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span className="flex items-center gap-1"><Leaf size={12} /> Wind</span>
              <span>{Math.round(wind)} kW</span>
            </div>
            <input type="range" min="0" max={capacities.wind} value={wind} onChange={(e) => !isAutoPilot && data.setWind(Math.max(10, Number(e.target.value)))} disabled={isAutoPilot} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
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
              hourlyLogs.map((log, i) => (
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

export default function DashboardPage() {
  const logic = useDashboardLogic();
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
            windOutput={logic.wind < 10 ? 0 : logic.wind}
            solarOutput={logic.solar < 50 ? 0 : logic.solar}
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
                  <div className="flex-1 p-6 flex flex-col min-h-0">

                    {/* Graph 2 */}
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col flex-1">
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
                            <Line type="monotone" dataKey="solar" name="Solar (kW)" stroke="#EAB308" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="wind" name="Wind (kW)" stroke="#3B82F6" strokeWidth={2} dot={false} />
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