"use client";

import { useEffect, useState } from "react";
import { 
  Sun, Wind, Zap, Moon, ArrowRight, Clock, BatteryCharging, 
  AlertTriangle, Activity, Cloud, CloudRain, Play, Pause, Save
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn button, or use standard HTML button

export default function IotPage() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date>(new Date());
  
  // --- Simulation States ---
  const [solar, setSolar] = useState(200); 
  const [wind, setWind] = useState(100);
  const [load, setLoad] = useState(250);
  const [battery, setBattery] = useState(50); // Starts at 50%
  const [weatherMode, setWeatherMode] = useState("Custom");
  
  // --- Auto-Pilot State ---
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Configuration (In real app, fetch these from DB)
  const CAMPUS_ID = 1; 
  const BATTERY_CAPACITY_KWH = 2000; // Fake capacity for math

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    now.setMinutes(0, 0, 0);
    setTime(now);
  }, []);

  // --- AUTO-PILOT LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPilot) {
      interval = setInterval(() => {
        handleAdvanceTime();
      }, 3000); // Runs every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPilot, time, solar, wind, load]); // Dependencies are important here

  const hour = mounted ? time.getHours() : 12;
  const isNight = hour >= 18 || hour < 6;

  // --- API: Save to Database ---
  const saveDataToBackend = async (currentSolar: number, currentWind: number, currentLoad: number, currentBattery: number) => {
    setIsSaving(true);
    try {
      await fetch('/api/iot/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campus_id: CAMPUS_ID,
          solar: currentSolar,
          wind: currentWind,
          load: currentLoad,
          battery_percent: currentBattery
        })
      });
      console.log("Data logged to DB");
    } catch (error) {
      console.error("Failed to save", error);
    } finally {
      setIsSaving(false);
    }
  };

  //Wrapper for manual save button
  const handleManualSave = () => {
      saveDataToBackend(solar, wind, load, battery);
  }

  // --- LOGIC: Preset Scenarios ---
  const applyWeather = (type: string) => {
    if (type === "Sunny" && isNight) return;

    setWeatherMode(type);
    switch (type) {
        case "Sunny": setSolar(450); setWind(40); break;
        case "Cloudy": setSolar(120); setWind(80); break;
        case "Rainy": setSolar(30); setWind(150); break;
        case "Windy": setSolar(250); setWind(230); break;
    }
  };

  const handleAdvanceTime = () => {
    // 1. Calculate New Values for the next hour
    const updatedTime = new Date(time);
    updatedTime.setHours(updatedTime.getHours() + 1);
    
    // Randomize slightly for realism if in Auto-Pilot
    let newSolar = solar;
    let newWind = wind;
    let newLoad = load;

    if (isAutoPilot) {
        // Random fluctuation +/- 10
        newWind = Math.max(0, wind + (Math.random() > 0.5 ? 10 : -10));
        newLoad = Math.max(50, load + (Math.random() > 0.5 ? 20 : -20));
        
        // Solar Logic
        const nextHour = updatedTime.getHours();
        if (nextHour >= 18 || nextHour < 6) {
            newSolar = 0; // Night
        } else if (weatherMode === "Sunny") {
             // Simple curve logic: Peak at noon
             const distFromNoon = Math.abs(12 - nextHour);
             newSolar = Math.max(0, 500 - (distFromNoon * 50)); 
        }
    }

    // 2. Night Check
    const nextHour = updatedTime.getHours();
    if (nextHour >= 18 || nextHour < 6) {
      newSolar = 0;
      if (weatherMode === "Sunny") setWeatherMode("Custom");
    }

    // 3. Battery Math
    const totalGen = newSolar + newWind;
    const netEnergy = totalGen - newLoad; // Surplus or Deficit
    
    // Simple Battery Physics: 100kWh surplus adds ~5% to a 2000kWh battery
    const percentChange = Math.round((netEnergy / BATTERY_CAPACITY_KWH) * 100);
    let newBattery = Math.min(100, Math.max(0, battery + percentChange));

    // 4. Update State
    setTime(updatedTime);
    setSolar(newSolar);
    setWind(newWind);
    setLoad(newLoad);
    setBattery(newBattery);

    // 5. Save to DB (only in AutoPilot)
    if(isAutoPilot) {
        saveDataToBackend(newSolar, newWind, newLoad, newBattery);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  };

  const totalGeneration = solar + wind;
  const netGrid = totalGeneration - load;
  const isSurplus = netGrid >= 0;

  const getBackgroundGradient = () => {
    if (!mounted) return "bg-slate-100"; 
    if (isNight) return isSurplus ? "bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900" : "bg-gradient-to-br from-gray-900 via-slate-900 to-black";
    if (weatherMode === "Rainy") return "bg-gradient-to-br from-slate-400 via-blue-200 to-slate-400";
    if (weatherMode === "Cloudy") return "bg-gradient-to-br from-slate-300 via-gray-200 to-slate-300";
    if (!isSurplus) return "bg-gradient-to-br from-slate-300 via-red-100 to-slate-300"; 
    return "bg-gradient-to-br from-blue-300 via-cyan-200 to-emerald-300"; 
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 font-sans transition-all duration-1000 ease-in-out ${getBackgroundGradient()}`}>
      
      <div className="w-full max-w-lg lg:max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50 ring-1 ring-black/5 flex flex-col">
        
        {/* Header */}
        <div className={`p-6 md:p-8 text-white flex justify-between items-center transition-colors duration-500 ${isNight ? 'bg-slate-800' : 'bg-blue-600'}`}>
          <div>
            <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
              <Zap className="fill-current text-yellow-300 w-6 h-6 md:w-8 md:h-8" /> 
              Energy Simulator
            </h1>
            <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isSaving ? 'bg-green-400 text-green-900 animate-pulse' : 'bg-white/20'}`}>
                    {isSaving ? "Saving..." : "System Ready"}
                </span>
                {isAutoPilot && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-400 text-purple-900 animate-pulse">Auto-Pilot ON</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-2xl md:text-4xl font-mono font-bold">
              {isNight ? <Moon size={24} className="md:w-8 md:h-8 text-blue-200" /> : <Sun size={24} className="md:w-8 md:h-8 text-yellow-300" />}
              {formatTime(time)}
            </div>
            <span className="text-[10px] md:text-xs uppercase tracking-wider opacity-70">
              {isNight ? "Night Schedule" : "Day Schedule"}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT: Controls */}
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Auto Pilot Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isAutoPilot ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-500'}`}>
                        {isAutoPilot ? <Play size={20} className="fill-current"/> : <Pause size={20} className="fill-current"/>}
                    </div>
                    <div>
                        <p className="font-bold text-slate-700">Auto-Pilot Mode</p>
                        <p className="text-xs text-slate-500">Automatically advance time & weather</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsAutoPilot(!isAutoPilot)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAutoPilot ? 'bg-purple-600' : 'bg-slate-300'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAutoPilot ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
            </div>

            <hr className="border-slate-100" />

            {/* Weather Presets (Disabled in AutoPilot) */}
            <div className={isAutoPilot ? "opacity-50 pointer-events-none grayscale" : ""}>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Weather Conditions</h2>
                <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => applyWeather("Sunny")} disabled={isNight} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${isNight ? 'opacity-40 bg-slate-100' : weatherMode === 'Sunny' ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-white hover:bg-slate-50'}`}>
                        <Sun size={24} className={!isNight && weatherMode === 'Sunny' ? 'fill-orange-400 text-orange-500' : 'text-slate-600'} />
                        <span className={`text-xs font-bold mt-1 ${!isNight && weatherMode === 'Sunny' ? 'text-orange-700' : 'text-slate-600'}`}>Sunny</span>
                    </button>
                    <button onClick={() => applyWeather("Cloudy")} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${weatherMode === 'Cloudy' ? 'bg-slate-200 border-slate-400 text-slate-700' : 'bg-white hover:bg-slate-50'}`}>
                        <Cloud size={24} className={weatherMode === 'Cloudy' ? 'fill-slate-400 text-slate-600' : 'text-slate-500'} />
                        <span className="text-xs font-bold mt-1">Cloudy</span>
                    </button>
                    <button onClick={() => applyWeather("Rainy")} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${weatherMode === 'Rainy' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white hover:bg-slate-50'}`}>
                        <CloudRain size={24} className={weatherMode === 'Rainy' ? 'text-blue-600' : 'text-slate-500'} />
                        <span className="text-xs font-bold mt-1">Rainy</span>
                    </button>
                    <button onClick={() => applyWeather("Windy")} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${weatherMode === 'Windy' ? 'bg-teal-100 border-teal-400 text-teal-700' : 'bg-white hover:bg-slate-50'}`}>
                        <Wind size={24} className={weatherMode === 'Windy' ? 'text-teal-600' : 'text-slate-500'} />
                        <span className="text-xs font-bold mt-1">Windy</span>
                    </button>
                </div>
            </div>

            {/* Sliders (Disabled in AutoPilot) */}
            <div className={`space-y-6 ${isAutoPilot ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="group">
                    <div className="flex justify-between mb-2">
                        <label className="font-semibold text-slate-700 flex items-center gap-2 text-sm"><Sun className="w-4 h-4 text-orange-500"/> Solar</label>
                        <span className="font-mono font-bold text-slate-600">{solar} kW</span>
                    </div>
                    <input type="range" min={0} max={500} value={solar} onChange={(e) => {setSolar(Number(e.target.value)); setWeatherMode("Custom")}} disabled={isNight} className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500"/>
                </div>
                <div className="group">
                    <div className="flex justify-between mb-2">
                        <label className="font-semibold text-slate-700 flex items-center gap-2 text-sm"><Wind className="w-4 h-4 text-teal-500"/> Wind</label>
                        <span className="font-mono font-bold text-slate-600">{wind} kW</span>
                    </div>
                    <input type="range" min={0} max={250} value={wind} onChange={(e) => {setWind(Number(e.target.value)); setWeatherMode("Custom")}} className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer accent-teal-500"/>
                </div>
                <div className="group">
                    <div className="flex justify-between mb-2">
                        <label className="font-semibold text-slate-700 flex items-center gap-2 text-sm"><BatteryCharging className="w-4 h-4 text-purple-600"/> Load</label>
                        <span className="font-mono font-bold text-slate-600">{load} kW</span>
                    </div>
                    <input type="range" min={0} max={800} value={load} onChange={(e) => setLoad(Number(e.target.value))} className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"/>
                </div>
            </div>
          </div>

          {/* RIGHT: Stats */}
          <div className="bg-slate-50/80 p-6 md:p-8 lg:border-l border-slate-200 flex flex-col justify-between">
             <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Real-time Metrics</h2>

                {/* Battery Status */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Battery Storage</span>
                        <span className={`text-sm font-bold ${battery < 20 ? 'text-red-500' : 'text-green-600'}`}>{battery}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200 relative">
                        {/* Grid lines */}
                        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/50"></div>
                        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-white/50"></div>
                        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white/50"></div>
                        
                        <div 
                            className={`h-full transition-all duration-500 relative ${battery < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${battery}%` }}
                        >
                             <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">Capacity: {BATTERY_CAPACITY_KWH} kWh</p>
                </div>
                
                {/* Generation & Grid Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-bold">Total Gen</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{totalGeneration} <span className="text-sm font-normal">kW</span></p>
                    </div>
                    <div className={`p-4 rounded-xl border shadow-sm ${isSurplus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                         <p className={`text-xs uppercase font-bold ${isSurplus ? 'text-green-700' : 'text-red-700'}`}>
                            {isSurplus ? "Exporting" : "Importing"}
                        </p>
                        <p className={`text-2xl font-bold mt-1 ${isSurplus ? 'text-green-700' : 'text-red-700'}`}>
                            {Math.abs(netGrid)} <span className="text-sm font-normal">kW</span>
                        </p>
                    </div>
                </div>
             </div>

             <div className="mt-8 lg:mt-0 space-y-3">
                <button
                    onClick={handleAdvanceTime}
                    disabled={isAutoPilot}
                    className={`w-full py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg transition-all active:scale-95 group ${
                        isNight ? 'bg-slate-700 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'
                    } ${isAutoPilot ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Clock size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>Advance 1 Hour</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={handleManualSave}
                    disabled={isAutoPilot}
                    className={`w-full py-3 font-bold rounded-xl flex items-center justify-center gap-2 text-base transition-all active:scale-95 group bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300
                    ${isAutoPilot ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                >
                    <Save size={18} />
                    <span>Save History</span>
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}