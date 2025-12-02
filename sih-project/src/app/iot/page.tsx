"use client";

import { useEffect, useState } from "react";

import {

ResizableHandle,

ResizablePanel,

ResizablePanelGroup

} from "@/components/ui/resizable";

import {

Zap, LayoutGrid, TrendingUp, Clock, ArrowRight,

Play, Pause, Save, Moon, Sun, BatteryCharging, Wind,

Cloud, CloudRain

} from "lucide-react";

import { cn } from "@/lib/utils";

// --- 1. LOGIC HOOK (Your original logic) ---

const useIoTLogic = () => {

const [mounted, setMounted] = useState(false);

const [time, setTime] = useState(new Date());

// Simulation States

const [solar, setSolar] = useState(200);

const [wind, setWind] = useState(100);

const [load, setLoad] = useState(250);

const [battery, setBattery] = useState(50);

const [weatherMode, setWeatherMode] = useState("Custom");

const [isAutoPilot, setIsAutoPilot] = useState(false);

const [isSaving, setIsSaving] = useState(false);

const CAMPUS_ID = 1;

const BATTERY_CAPACITY_KWH = 2000;

useEffect(() => {

setMounted(true);

const now = new Date();

now.setMinutes(0, 0, 0);

setTime(now);

}, []);

// API Call

const saveDataToBackend = async (s: number, w: number, l: number, b: number) => {

setIsSaving(true);

try {

await fetch('/api/iot/log', {

method: 'POST',

headers: { 'Content-Type': 'application/json' },

body: JSON.stringify({ campus_id: CAMPUS_ID, solar: s, wind: w, load: l, battery_percent: b })

});

console.log("Saved to DB");

} catch (e) { console.error(e); }

finally { setIsSaving(false); }

};

const handleAdvanceTime = () => {

const updatedTime = new Date(time);

updatedTime.setHours(updatedTime.getHours() + 1);



// Logic

let newSolar = solar;

let newWind = wind;

let newLoad = load;



if (isAutoPilot) {

newWind = Math.max(0, wind + (Math.random() > 0.5 ? 10 : -10));

newLoad = Math.max(50, load + (Math.random() > 0.5 ? 20 : -20));

const nextHour = updatedTime.getHours();

if (nextHour >= 18 || nextHour < 6) newSolar = 0;

else if (weatherMode === "Sunny") newSolar = Math.max(0, 500 - (Math.abs(12 - nextHour) * 50));

}



const nextHour = updatedTime.getHours();

if (nextHour >= 18 || nextHour < 6) {

newSolar = 0;

if (weatherMode === "Sunny") setWeatherMode("Custom");

}



const netEnergy = (newSolar + newWind) - newLoad;

const percentChange = Math.round((netEnergy / BATTERY_CAPACITY_KWH) * 100);

let newBattery = Math.min(100, Math.max(0, battery + percentChange));



setTime(updatedTime);

setSolar(newSolar);

setWind(newWind);

setLoad(newLoad);

setBattery(newBattery);



if(isAutoPilot) saveDataToBackend(newSolar, newWind, newLoad, newBattery);

};

const applyWeather = (type: string) => {

const hour = time.getHours();

const isNight = hour >= 18 || hour < 6;

if (type === "Sunny" && isNight) return;



setWeatherMode(type);

switch (type) {

case "Sunny": setSolar(450); setWind(40); break;

case "Cloudy": setSolar(120); setWind(80); break;

case "Rainy": setSolar(30); setWind(150); break;

case "Windy": setSolar(250); setWind(230); break;

}

};

useEffect(() => {

let interval: NodeJS.Timeout;

if (isAutoPilot) interval = setInterval(handleAdvanceTime, 3000);

return () => clearInterval(interval);

}, [isAutoPilot, time]);

return {

mounted, time, solar, wind, load, battery, isAutoPilot, isSaving, weatherMode,

setSolar, setWind, setLoad, setIsAutoPilot, handleAdvanceTime, saveDataToBackend, applyWeather

};

};

// --- 2. LEFT PANEL COMPONENT (Controls) ---

const CurrentStateSection = ({ data }: { data: any }) => {

const { time, solar, wind, load, battery, isAutoPilot, setIsAutoPilot, handleAdvanceTime, saveDataToBackend, applyWeather, weatherMode, setSolar, setWind, setLoad } = data;

const totalGen = solar + wind;

const isNight = time.getHours() >= 18 || time.getHours() < 6;

// Small helper for weather buttons

const WBtn = ({ label, icon: Icon, onClick, active }: any) => (

<button onClick={onClick} disabled={isNight && label === "Sunny"}

className={cn("flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-xs",

active ? "bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300"

: "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400",

(isNight && label === "Sunny") && "opacity-30 cursor-not-allowed"

)}>

<Icon size={18} className="mb-1"/> {label}

</button>

);

return (

<div className="h-full w-full bg-slate-50 dark:bg-[#0d1117] flex flex-col border-r border-slate-200 dark:border-slate-800">



{/* Scrollable Content Area */}

<div className="flex-1 overflow-y-auto p-4 space-y-6">


{/* Header Status */}

<div className="flex items-center justify-between">

<div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">

<Zap size={20} className="fill-current"/>

<h2 className="font-bold uppercase tracking-wider text-sm">System</h2>

</div>

<div className="text-right">

<div className="text-lg font-mono font-bold text-slate-700 dark:text-white flex items-center justify-end gap-2">

{isNight ? <Moon size={16} /> : <Sun size={16} className="text-yellow-500" />}

{time.toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}

</div>

</div>

</div>



{/* 1. Supply Gauge */}

<div className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">

<div className="flex justify-between items-end mb-2">

<span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Supply</span>

<span className="text-2xl font-mono font-bold text-emerald-500">{totalGen} <span className="text-sm text-slate-400">kW</span></span>

</div>

<div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden flex">

<div style={{ width: `${(solar/800)*100}%` }} className="h-full bg-orange-400"></div>

<div style={{ width: `${(wind/800)*100}%` }} className="h-full bg-teal-400"></div>

</div>

<div className="flex justify-between text-[10px] text-slate-400 mt-1">

<span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"/> Solar: {solar}</span>

<span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal-400"/> Wind: {wind}</span>

</div>

</div>



{/* 2. Controls (Weather & Sliders) */}

<div className={cn("space-y-4", isAutoPilot && "opacity-50 pointer-events-none")}>

{/* Weather Buttons */}

<div className="grid grid-cols-4 gap-2">

<WBtn label="Sunny" icon={Sun} onClick={() => applyWeather("Sunny")} active={!isNight && weatherMode === "Sunny"} />

<WBtn label="Cloudy" icon={Cloud} onClick={() => applyWeather("Cloudy")} active={weatherMode === "Cloudy"} />

<WBtn label="Rainy" icon={CloudRain} onClick={() => applyWeather("Rainy")} active={weatherMode === "Rainy"} />

<WBtn label="Windy" icon={Wind} onClick={() => applyWeather("Windy")} active={weatherMode === "Windy"} />

</div>



{/* Sliders */}

<div className="space-y-3">

<div>

<div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">

<span>Solar Intensity</span>

<span>{solar} kW</span>

</div>

<input type="range" min={0} max={500} value={solar} onChange={(e) => {setSolar(Number(e.target.value)); setWeatherMode("Custom")}} disabled={isNight} className="w-full h-1.5 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500"/>

</div>

<div>

<div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">

<span>Wind Intensity</span>

<span>{wind} kW</span>

</div>

<input type="range" min={0} max={250} value={wind} onChange={(e) => {setWind(Number(e.target.value)); setWeatherMode("Custom")}} className="w-full h-1.5 bg-teal-100 rounded-lg appearance-none cursor-pointer accent-teal-500"/>

</div>

{/* Note: Load slider is kept here for now, but will eventually be controlled by the middle panel */}

<div>

<div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">

<span>Total Load</span>

<span>{load} kW</span>

</div>

<input type="range" min={0} max={800} value={load} onChange={(e) => setLoad(Number(e.target.value))} className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"/>

</div>

</div>

</div>



{/* 3. Battery Status */}

<div className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">

<div className="flex justify-between items-center mb-2">

<span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">

<BatteryCharging size={14}/> Battery

</span>

<span className={cn("text-sm font-bold", battery < 20 ? "text-red-500" : "text-green-500")}>{battery}%</span>

</div>

<div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 relative">

<div

className={cn("h-full transition-all duration-500 relative", battery < 20 ? "bg-red-500" : "bg-green-500")}

style={{ width: `${battery}%` }}

>

<div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>

</div>

</div>

</div>



</div>



{/* Fixed Bottom Controls */}

<div className="p-4 bg-white dark:bg-[#161b22] border-t border-slate-200 dark:border-slate-800 space-y-3">


{/* Auto Pilot Toggle */}

<button

onClick={() => setIsAutoPilot(!isAutoPilot)}

className={cn(

"w-full flex items-center justify-between p-3 rounded-xl border transition-all",

isAutoPilot

? "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"

: "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"

)}

>

<div className="flex items-center gap-3">

<div className={cn("p-2 rounded-lg", isAutoPilot ? "bg-purple-100 text-purple-600" : "bg-slate-200 text-slate-500")}>

{isAutoPilot ? <Pause size={16} className="fill-current"/> : <Play size={16} className="fill-current"/>}

</div>

<div className="text-left">

<p className="text-sm font-bold text-slate-700 dark:text-slate-200">Auto-Pilot</p>

<p className="text-[10px] text-slate-500">{isAutoPilot ? "System Running..." : "Paused"}</p>

</div>

</div>


{/* Toggle Switch UI */}

<div className={cn("w-8 h-5 rounded-full relative transition-colors", isAutoPilot ? "bg-purple-600" : "bg-slate-300")}>

<div className={cn("absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform", isAutoPilot ? "translate-x-3" : "translate-x-0")}></div>

</div>

</button>



{/* Manual Advance / Save */}

<button

onClick={() => { handleAdvanceTime(); saveDataToBackend(solar, wind, load, battery); }}

disabled={isAutoPilot}

className={cn(

"w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition-all active:scale-95 group",

isAutoPilot ? "bg-slate-400 cursor-not-allowed opacity-50" : "bg-blue-600 hover:bg-blue-700"

)}

>

{isAutoPilot ? <Clock size={18} /> : <Save size={18} />}

<span>{isAutoPilot ? "Auto-Advancing..." : "Advance & Save"}</span>

{!isAutoPilot && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}

</button>



</div>

</div>

);

};

// --- 3. MIDDLE PANEL (Placeholder for next step) ---

const PlaygroundSection = () => (

<div className="h-full w-full bg-white dark:bg-[#0f1115] relative flex flex-col">

<div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]"

style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>

</div>

<div className="relative z-10 p-4 h-full flex flex-col items-center justify-center">

<LayoutGrid size={48} className="text-slate-200 dark:text-slate-700 mb-4" />

<h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Campus Playground</h1>

<p className="text-slate-500 mt-2">Drag & Drop Buildings Here</p>

<p className="text-xs text-slate-400 mt-4 italic">(Coming in Installment 3)</p>

</div>

</div>

);

// --- 4. RIGHT PANEL (Placeholder for next step) ---

const PredictionSection = () => (

<div className="h-full w-full bg-slate-50 dark:bg-[#0d1117] p-4 border-l border-slate-200 dark:border-slate-800">

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

// --- 5. MAIN PAGE COMPONENT ---

export default function IotPage() {

const logic = useIoTLogic(); // <--- Hook up the logic here

if (!logic.mounted) return null;

return (

<div className="h-screen w-full bg-slate-100 dark:bg-black overflow-hidden flex flex-col">

<header className="h-14 bg-white dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between shrink-0">

<div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">

<span>⚡ IOT Orchestrator</span>

</div>

<div className="text-xs font-mono text-slate-500">

AUTO-PILOT: <span className={logic.isAutoPilot ? "text-purple-500 font-bold" : "text-orange-500"}>{logic.isAutoPilot ? "ON" : "OFF"}</span>

</div>

</header>



<div className="flex-1 overflow-hidden">

<ResizablePanelGroup direction="horizontal">


{/* LEFT PANEL */}

<ResizablePanel defaultSize={25} minSize={20} maxSize={35}>

<CurrentStateSection data={logic} />

</ResizablePanel>



<ResizableHandle withHandle />



{/* MIDDLE PANEL */}

<ResizablePanel defaultSize={50} minSize={30}>

<PlaygroundSection />

</ResizablePanel>



<ResizableHandle withHandle />



{/* RIGHT PANEL */}

<ResizablePanel defaultSize={25} minSize={20} maxSize={35}>

<PredictionSection />

</ResizablePanel>



</ResizablePanelGroup>

</div>

</div>

);

}