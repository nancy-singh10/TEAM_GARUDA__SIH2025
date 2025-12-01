"use client";

import { useEffect, useState } from "react";
import { Sun, Wind, Zap, Moon, ArrowRight, Clock, BatteryCharging, AlertTriangle, Activity } from "lucide-react";

export default function IotPage() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date>(new Date());
  
  // Default Simulation States
  const [solar, setSolar] = useState(200); 
  const [wind, setWind] = useState(100);
  const [load, setLoad] = useState(250);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    now.setMinutes(0, 0, 0);
    setTime(now);
  }, []);

  const hour = mounted ? time.getHours() : 12;
  const isNight = hour >= 18 || hour < 6;

  // Handlers
  const handleAdvanceTime = () => {
    const updated = new Date(time);
    updated.setHours(updated.getHours() + 1);
    setTime(updated);

    const nextHour = updated.getHours();
    if (nextHour >= 18 || nextHour < 6) {
      setSolar(0);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  };

  // --- LOGIC: Energy Calculations ---
  const totalGeneration = solar + wind;
  const netGrid = totalGeneration - load;
  const isSurplus = netGrid >= 0;

  // --- LOGIC: Dynamic Background Generator ---
  const getBackgroundGradient = () => {
    if (!mounted) return "bg-slate-100"; 

    // NIGHT MODES
    if (isNight) {
      if (isSurplus) return "bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900"; // Windy Night
      return "bg-gradient-to-br from-gray-900 via-slate-900 to-black"; // Dark Night
    }

    // DAY MODES
    if (!isSurplus) return "bg-gradient-to-br from-slate-300 via-red-100 to-slate-300"; // Stressed Grid
    if (solar > wind) return "bg-gradient-to-br from-blue-300 via-yellow-200 to-orange-300"; // Sunny
    return "bg-gradient-to-br from-blue-300 via-cyan-200 to-emerald-300"; // Windy
  };

  const getStatusMessage = () => {
    if (isNight && isSurplus) return "Efficient Night Operation";
    if (isNight && !isSurplus) return "Grid Import Active";
    if (!isSurplus) return "High Load Demand";
    if (solar > wind) return "Peak Solar Production";
    return "Strong Wind Conditions";
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 font-sans transition-colors duration-1000 ease-in-out ${getBackgroundGradient()}`}>
      
      {/* Responsive Container:
        - Mobile: w-full (fills screen width)
        - Laptop: max-w-5xl (wider dashboard view)
      */}
      <div className="w-full max-w-lg lg:max-w-5xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50 ring-1 ring-black/5 flex flex-col">
        
        {/* Header - Stays at top for all devices */}
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

        {/* Responsive Grid Layout:
          - Mobile: 1 Column (Vertical Stack)
          - Laptop (lg): 2 Columns (Side by Side)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT COLUMN: Controls (Sliders) */}
          <div className="p-6 md:p-8 space-y-8">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 hidden lg:block">System Controls</h2>

            {/* Solar Slider */}
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
                onChange={(e) => setSolar(Number(e.target.value))}
                disabled={isNight}
                className={`w-full h-3 rounded-lg appearance-none cursor-pointer transition-all ${
                  isNight ? 'bg-slate-200 cursor-not-allowed' : 'bg-orange-100 accent-orange-500 hover:bg-orange-200'
                }`}
              />
              {isNight && (
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-medium italic">
                  (Solar inactive at night)
                </p>
              )}
            </div>

            {/* Wind Slider */}
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
                onChange={(e) => setWind(Number(e.target.value))}
                className="w-full h-3 bg-teal-100 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:bg-teal-200 transition-all"
              />
            </div>

            {/* Load Slider */}
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

          {/* RIGHT COLUMN: Dashboard Stats 
             - On Mobile: Appears below sliders
             - On Laptop: Appears to the right, with a background highlight
          */}
          <div className="bg-slate-50/80 p-6 md:p-8 lg:border-l border-slate-200 flex flex-col justify-between">
             <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 hidden lg:block">Real-time Metrics</h2>

                {/* Generation Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-row lg:flex-col items-center lg:items-start justify-between">
                    <div className="flex items-center gap-3 mb-0 lg:mb-2">
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                             <Zap size={20} />
                        </div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Generated</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-800">{totalGeneration} <span className="text-sm font-normal text-slate-500">kW</span></p>
                </div>
                
                {/* Net Grid Card */}
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
                    
                    {/* Visual Bar for Grid Balance */}
                    <div className="w-full bg-white/50 h-2 rounded-full mt-4 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${isSurplus ? 'bg-green-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(Math.abs(netGrid) / 5, 100)}%` }} // Visual approximation bar
                        ></div>
                    </div>
                </div>
             </div>

             {/* Action Button */}
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