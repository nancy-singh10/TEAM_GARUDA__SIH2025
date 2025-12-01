"use client";

import { useEffect, useState } from "react";
import { 
  Sun, Wind, Zap, Moon, ArrowRight, Clock, BatteryCharging, 
  AlertTriangle, Activity, Cloud, CloudRain
} from "lucide-react";

export default function IotPage() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date>(new Date());
  
  // Simulation States
  const [solar, setSolar] = useState(200); 
  const [wind, setWind] = useState(100);
  const [load, setLoad] = useState(250);
  const [weatherMode, setWeatherMode] = useState("Custom");

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    now.setMinutes(0, 0, 0);
    setTime(now);
  }, []);

  const hour = mounted ? time.getHours() : 12;
  // Night Logic: 6 PM (18:00) to 6 AM (06:00)
  const isNight = hour >= 18 || hour < 6;

  // --- LOGIC: Preset Scenarios ---
  const applyWeather = (type: string) => {
    // Prevent applying Sunny mode at night
    if (type === "Sunny" && isNight) return;

    setWeatherMode(type);
    switch (type) {
        case "Sunny":
            setSolar(450);
            setWind(40);
            break;
        case "Cloudy":
            setSolar(120); 
            setWind(80);
            break;
        case "Rainy":
            setSolar(30);  
            setWind(150);  
            break;
        case "Windy":
            setSolar(250); 
            setWind(230);  
            break;
        default:
            break;
    }
  };

  const handleAdvanceTime = () => {
    const updated = new Date(time);
    updated.setHours(updated.getHours() + 1);
    setTime(updated);

    const nextHour = updated.getHours();
    // Auto-disable solar if entering night
    if (nextHour >= 18 || nextHour < 6) {
      setSolar(0);
      // If we were in Sunny mode, switch to Custom so it doesn't look weird
      if (weatherMode === "Sunny") setWeatherMode("Custom");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  };

  const totalGeneration = solar + wind;
  const netGrid = totalGeneration - load;
  const isSurplus = netGrid >= 0;

  const getBackgroundGradient = () => {
    if (!mounted) return "bg-slate-100"; 

    if (isNight) {
      if (isSurplus) return "bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900"; 
      return "bg-gradient-to-br from-gray-900 via-slate-900 to-black"; 
    }

    if (weatherMode === "Rainy") return "bg-gradient-to-br from-slate-400 via-blue-200 to-slate-400";
    if (weatherMode === "Cloudy") return "bg-gradient-to-br from-slate-300 via-gray-200 to-slate-300";

    if (!isSurplus) return "bg-gradient-to-br from-slate-300 via-red-100 to-slate-300"; 
    if (solar > wind) return "bg-gradient-to-br from-blue-300 via-yellow-200 to-orange-300"; 
    return "bg-gradient-to-br from-blue-300 via-cyan-200 to-emerald-300"; 
  };

  const getStatusMessage = () => {
    if (isNight && isSurplus) return "Efficient Night Operation";
    if (isNight) return "Grid Import Active";
    if (weatherMode === "Rainy") return "Storm Conditions Detected";
    if (weatherMode === "Cloudy") return "Low Irradiance Levels";
    if (!isSurplus) return "High Load Demand";
    return "Optimal Generation";
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 font-sans transition-all duration-1000 ease-in-out ${getBackgroundGradient()}`}>
      
      <div className="w-full max-w-lg lg:max-w-5xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50 ring-1 ring-black/5 flex flex-col">
        
        {/* Header */}
        <div className={`p-6 md:p-8 text-white flex justify-between items-center transition-colors duration-500 ${isNight ? 'bg-slate-800' : 'bg-blue-600'}`}>
          <div>
            <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
              <Zap className="fill-current text-yellow-300 w-6 h-6 md:w-8 md:h-8" /> 
              Energy Simulator
            </h1>
            <p className="text-blue-100 text-xs md:text-sm mt-1 opacity-90 flex items-center gap-2">
              <Activity size={14} /> {getStatusMessage()}
            </p>
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
            
            {/* Weather Presets */}
            <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Weather Conditions</h2>
                <div className="grid grid-cols-4 gap-2">
                    
                    {/* SUNNY BUTTON: Disabled at Night */}
                    <button 
                        onClick={() => applyWeather("Sunny")} 
                        disabled={isNight}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all 
                        ${isNight 
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400' // Disabled Style
                            : weatherMode === 'Sunny' 
                                ? 'bg-orange-100 border-orange-400 text-orange-700' 
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        <Sun size={24} className={!isNight && weatherMode === 'Sunny' ? 'fill-orange-400 text-orange-500' : 'text-current'} />
                        <span className="text-xs font-bold mt-1">Sunny</span>
                    </button>

                    <button onClick={() => applyWeather("Cloudy")} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${weatherMode === 'Cloudy' ? 'bg-slate-200 border-slate-400 text-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <Cloud size={24} className={weatherMode === 'Cloudy' ? 'fill-slate-400 text-slate-600' : 'text-slate-500'} />
                        <span className="text-xs font-bold mt-1">Cloudy</span>
                    </button>
                    <button onClick={() => applyWeather("Rainy")} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${weatherMode === 'Rainy' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <CloudRain size={24} className={weatherMode === 'Rainy' ? 'text-blue-600' : 'text-slate-500'} />
                        <span className="text-xs font-bold mt-1">Rainy</span>
                    </button>
                    <button onClick={() => applyWeather("Windy")} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${weatherMode === 'Windy' ? 'bg-teal-100 border-teal-400 text-teal-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <Wind size={24} className={weatherMode === 'Windy' ? 'text-teal-600' : 'text-slate-500'} />
                        <span className="text-xs font-bold mt-1">Windy</span>
                    </button>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Sliders */}
            <div className="space-y-6">
                {/* Solar */}
                <div className="group">
                <div className="flex justify-between mb-2">
                    <label className="font-semibold text-slate-700 flex items-center gap-2 text-sm md:text-base">
                    <Sun className={`w-5 h-5 transition-colors ${isNight ? 'text-slate-400' : 'text-orange-500'}`} />
                    Solar Intensity
                    </label>
                    <span className="font-mono font-bold text-slate-600">{solar} kW</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={500}
                    value={solar}
                    onChange={(e) => { setSolar(Number(e.target.value)); setWeatherMode("Custom"); }}
                    disabled={isNight}
                    className={`w-full h-3 rounded-lg appearance-none cursor-pointer transition-all ${
                    isNight ? 'bg-slate-200 cursor-not-allowed' : 'bg-orange-100 accent-orange-500 hover:bg-orange-200'
                    }`}
                />
                {isNight && <p className="text-xs text-slate-400 mt-1 italic flex items-center gap-1"><Moon size={10}/> Solar unavailable at night</p>}
                </div>

                {/* Wind */}
                <div className="group">
                <div className="flex justify-between mb-2">
                    <label className="font-semibold text-slate-700 flex items-center gap-2 text-sm md:text-base">
                    <Wind className="w-5 h-5 text-teal-500" />
                    Wind Intensity
                    </label>
                    <span className="font-mono font-bold text-slate-600">{wind} kW</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={250}
                    value={wind}
                    onChange={(e) => { setWind(Number(e.target.value)); setWeatherMode("Custom"); }}
                    className="w-full h-3 bg-teal-100 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:bg-teal-200 transition-all"
                />
                </div>

                {/* Load */}
                <div className="group">
                <div className="flex justify-between mb-2">
                    <label className="font-semibold text-slate-700 flex items-center gap-2 text-sm md:text-base">
                    <BatteryCharging className="w-5 h-5 text-purple-600" />
                    Load Demand
                    </label>
                    <span className="font-mono font-bold text-slate-600">{load} kW</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={800}
                    value={load}
                    onChange={(e) => setLoad(Number(e.target.value))}
                    className="w-full h-3 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:bg-purple-200 transition-all"
                />
                </div>
            </div>
          </div>

          {/* RIGHT: Stats */}
          <div className="bg-slate-50/80 p-6 md:p-8 lg:border-l border-slate-200 flex flex-col justify-between">
             <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 hidden lg:block">Real-time Metrics</h2>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-row lg:flex-col items-center lg:items-start justify-between">
                    <div className="flex items-center gap-3 mb-0 lg:mb-2">
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                             <Zap size={20} />
                        </div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Generated</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-800">{totalGeneration} <span className="text-sm font-normal text-slate-500">kW</span></p>
                </div>
                
                <div className={`p-5 rounded-xl border shadow-sm transition-colors duration-300 ${isSurplus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <p className={`text-xs uppercase font-bold tracking-wider ${isSurplus ? 'text-green-700' : 'text-red-700'}`}>
                        {isSurplus ? "Exporting to Grid" : "Importing from Grid"}
                        </p>
                        {!isSurplus && <AlertTriangle size={18} className="text-red-500 animate-pulse" />}
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                        <p className={`text-3xl md:text-4xl font-bold ${isSurplus ? 'text-green-700' : 'text-red-700'}`}>
                            {Math.abs(netGrid)}
                        </p>
                        <span className={`text-sm font-medium ${isSurplus ? 'text-green-600' : 'text-red-600'}`}>kW</span>
                    </div>
                    
                    <div className="w-full bg-white/50 h-2 rounded-full mt-4 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${isSurplus ? 'bg-green-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(Math.abs(netGrid) / 5, 100)}%` }} 
                        ></div>
                    </div>
                </div>
             </div>

             <div className="mt-8 lg:mt-0">
                <button
                    onClick={handleAdvanceTime}
                    className={`w-full py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg transition-all active:scale-95 group ${
                        isNight ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    }`}
                >
                    <Clock size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>Advance 1 Hour</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}