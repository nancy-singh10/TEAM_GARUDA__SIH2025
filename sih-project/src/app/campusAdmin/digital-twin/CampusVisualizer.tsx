
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Building2, FlaskConical, Home, GraduationCap, Plus, Trash2, X, Edit, Save, Maximize2, Minimize2, Box, Wind, Battery, Plug, Sun, Zap, Leaf } from "lucide-react";
// import { BuildingData, BuildingType, BUILDING_TEMPLATES } from "./types";
// import { cn } from "@/lib/utils";

// const BuildingIcon = ({ type, className }: { type: BuildingType; className?: string }) => {
//   switch (type) {
//     case "HOSTEL": return <Home className={className} />;
//     case "LAB": return <FlaskConical className={className} />;
//     case "CLASSROOM": return <GraduationCap className={className} />;
//     case "ADMIN": return <Building2 className={className} />;
//     case "CUSTOM": return <Box className={className} />;
//   }
// };

// interface VisualizerProps {
//   buildings: BuildingData[];
//   setBuildings: (b: BuildingData[]) => void;
//   energyMix: { solar: number; wind: number; battery: number; grid: number; };
//   batteryStatus: "CHARGING" | "DISCHARGING" | "IDLE"; 
//   timeOfDay: number; 
//   isFullScreen?: boolean;
//   onToggleFullScreen?: () => void;
//   onSave?: () => void;
// }

// // Layout Configuration
// const SOURCES = {
//   SOLAR: { x: 50, y: 10, color: "#FACC15" },    
//   WIND: { x: 90, y: 50, color: "#3B82F6" },      
//   BATTERY: { x: 10, y: 50, color: "#22C55E" }, 
//   GRID: { x: 50, y: 90, color: "#EF4444" },      
// };

// export default function CampusVisualizer({ buildings, setBuildings, energyMix, batteryStatus, timeOfDay, isFullScreen, onToggleFullScreen, onSave }: VisualizerProps) {
//   const constraintsRef = useRef(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
//   const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null);
//   const [formType, setFormType] = useState<BuildingType>("HOSTEL");
//   const [formName, setFormName] = useState("");
//   const [formLoad, setFormLoad] = useState(100);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const updateSize = () => {
//       if (containerRef.current) {
//         setWindowSize({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
//       }
//     };
//     updateSize();
//     window.addEventListener('resize', updateSize);
//     return () => window.removeEventListener('resize', updateSize);
//   }, []);

//   const openAddModal = (type: BuildingType) => {
//     const template = BUILDING_TEMPLATES[type];
//     setModalMode("ADD"); setFormType(type); setFormName(template.name); setFormLoad(template.baseLoad); setIsModalOpen(true);
//   };

//   const handleSaveBuilding = () => {
//     let newLayout = [...buildings];
//     if (modalMode === "ADD") {
//       newLayout = [...buildings, {
//         id: self.crypto.randomUUID(), type: formType, x: windowSize.w/2 - 50, y: windowSize.h/2 - 50,
//         name: formName, baseLoad: formLoad, priority: "LOW", renewableRatio: 0
//       }];
//     } else if (modalMode === "EDIT" && editingBuildingId) {
//       newLayout = buildings.map(b => b.id === editingBuildingId ? { ...b, name: formName, baseLoad: formLoad } : b);
//     }
//     setBuildings(newLayout);
//     setIsModalOpen(false);
//   };

//   const removeBuilding = (id: string) => setBuildings(buildings.filter(b => b.id !== id));
//   const isNight = timeOfDay < 6 || timeOfDay >= 18;

//   // Sun Logic
//   const getSunPosition = () => {
//     if (isNight) return { x: 50, y: 130, opacity: 0 }; 
//     const currentHour = timeOfDay - 6; 
//     const progress = currentHour / 12; 
//     return { x: 10 + (progress * 80), y: 80 - (Math.sin(progress * Math.PI) * 75), opacity: 1 };
//   };
//   const sunPos = getSunPosition();

//   const renderConnections = () => {
//     if (windowSize.w === 0) return null;
//     return (
//       <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
//         {/* --- CHARGING MODE: Lines flowing INTO Battery --- */}
//         {batteryStatus === "CHARGING" && (
//            <>
//              {/* Solar -> Battery */}
//              <motion.path 
//                 d={`M ${(SOURCES.SOLAR.x/100)*windowSize.w} ${(SOURCES.SOLAR.y/100)*windowSize.h} Q ${windowSize.w/2} ${windowSize.h/2} ${(SOURCES.BATTERY.x/100)*windowSize.w} ${(SOURCES.BATTERY.y/100)*windowSize.h}`}
//                 stroke={SOURCES.SOLAR.color} strokeWidth={3} fill="none" strokeDasharray="8,8" opacity={0.8}
//              >
//                 <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.8s" repeatCount="indefinite" />
//              </motion.path>
//              {/* Wind -> Battery */}
//              <motion.path 
//                 d={`M ${(SOURCES.WIND.x/100)*windowSize.w} ${(SOURCES.WIND.y/100)*windowSize.h} Q ${windowSize.w/2} ${windowSize.h/2} ${(SOURCES.BATTERY.x/100)*windowSize.w} ${(SOURCES.BATTERY.y/100)*windowSize.h}`}
//                 stroke={SOURCES.WIND.color} strokeWidth={3} fill="none" strokeDasharray="8,8" opacity={0.8}
//              >
//                 <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.8s" repeatCount="indefinite" />
//              </motion.path>
//            </>
//         )}

//         {/* --- SUPPLY MODE: Lines flowing to Buildings --- */}
//         {buildings.map(b => {
//           const sx = (SOURCES.SOLAR.x / 100) * windowSize.w;
//           const sy = (SOURCES.SOLAR.y / 100) * windowSize.h;
//           const wx = (SOURCES.WIND.x / 100) * windowSize.w;
//           const wy = (SOURCES.WIND.y / 100) * windowSize.h;
//           const bx = (SOURCES.BATTERY.x / 100) * windowSize.w;
//           const by = (SOURCES.BATTERY.y / 100) * windowSize.h;
//           const gx = (SOURCES.GRID.x / 100) * windowSize.w;
//           const gy = (SOURCES.GRID.y / 100) * windowSize.h;
//           const buildX = b.x + 48; 
//           const buildY = b.y + 48;

//           return (
//             <g key={b.id}>
//               {/* Solar Line */}
//               {energyMix.solar > 0.01 && <line x1={sx} y1={sy} x2={buildX} y2={buildY} stroke={SOURCES.SOLAR.color} strokeWidth={energyMix.solar * 5} opacity={0.7} />}

//               {/* Wind Line */}
//               {energyMix.wind > 0.01 && <line x1={wx} y1={wy} x2={buildX} y2={buildY} stroke={SOURCES.WIND.color} strokeWidth={energyMix.wind * 5} opacity={0.7} />}

//               {/* Battery Discharging Line (Distinct Green Flow) */}
//               {energyMix.battery > 0.01 && batteryStatus === "DISCHARGING" && (
//                 <>
//                   <line x1={bx} y1={by} x2={buildX} y2={buildY} stroke={SOURCES.BATTERY.color} strokeWidth={4} opacity={1} strokeDasharray="none" />
//                   <circle r="4" fill="#86efac">
//                     <animateMotion dur="0.8s" repeatCount="indefinite" path={`M ${bx} ${by} L ${buildX} ${buildY}`} />
//                   </circle>
//                 </>
//               )}

//               {/* Grid Line */}
//               {energyMix.grid > 0.01 && <line x1={gx} y1={gy} x2={buildX} y2={buildY} stroke={SOURCES.GRID.color} strokeWidth={energyMix.grid * 4} opacity={0.4} />}
//             </g>
//           );
//         })}
//       </svg>
//     );
//   };

//   const getSkyGradient = () => {
//     const h = timeOfDay;
//     if (h >= 5 && h < 8) return "bg-gradient-to-b from-[#fdba74] via-[#fed7aa] to-[#ffedd5]";
//     if (h >= 8 && h < 16) return "bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#e0f2fe]";
//     if (h >= 16 && h < 19) return "bg-gradient-to-b from-[#fca5a5] via-[#fdba74] to-[#fed7aa]";
//     return "bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]";
//   };

//   return (
//     <div className={cn("h-full w-full relative flex flex-col overflow-hidden select-none transition-colors duration-1000", getSkyGradient())} ref={containerRef}>

//       {onToggleFullScreen && (
//         <button onClick={onToggleFullScreen} className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-lg transition-colors">
//           {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
//         </button>
//       )}

//       {/* --- ATMOSPHERE --- */}
//       <div className="absolute inset-0 pointer-events-none">
//         {!isNight && (
//           <motion.div className="absolute w-24 h-24 flex items-center justify-center" animate={{ left: `${sunPos.x}%`, top: `${sunPos.y}%`, opacity: sunPos.opacity }} transition={{ duration: 1, ease: "linear" }}>
//             <div className="absolute w-40 h-40 bg-yellow-400/30 rounded-full blur-2xl animate-pulse"></div>
//             <Sun size={80} className="text-yellow-400 fill-yellow-300 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
//           </motion.div>
//         )}
//         {isNight && (
//           <div className="absolute top-10 right-20 opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
//              <div className="w-16 h-16 rounded-full bg-slate-100 shadow-inner"></div>
//           </div>
//         )}
//         <motion.div animate={{ x: ["-10%", "120%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute top-20 opacity-60">
//           <div className="w-40 h-16 bg-white rounded-full blur-xl"></div>
//         </motion.div>
//       </div>

//       {/* --- PLAYGROUND --- */}
//       <div ref={constraintsRef} className="flex-1 relative overflow-hidden" onClick={() => setSelectedId(null)}>
//         {/* SOLAR */}
//         <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group">
//           <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl shadow-lg border-2 border-white/50 flex items-center justify-center transform group-hover:scale-110 transition-transform">
//             <Sun size={40} className="text-white spin-slow" />
//           </div>
//           <span className="mt-2 px-3 py-1 bg-white/90 rounded-full text-xs font-bold shadow-sm">Solar Farm</span>
//         </div>

//         {/* WIND */}
//         <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20 flex flex-col items-center group">
//            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: Math.max(0.2, 5 - (energyMix.wind * 5)), ease: "linear" }} className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg border-2 border-white/50 flex items-center justify-center">
//              <Wind size={40} className="text-white" />
//            </motion.div>
//            <span className="mt-2 px-3 py-1 bg-white/90 rounded-full text-xs font-bold shadow-sm">Wind Park</span>
//         </div>

//         {/* BATTERY - Visual Logic Updated */}
//         <div className="absolute top-1/2 left-8 -translate-y-1/2 z-20 flex flex-col items-center">
//            <div className={cn(
//              "w-20 h-24 rounded-2xl shadow-xl border-4 flex flex-col items-center justify-center relative transition-all duration-500",
//              batteryStatus === "CHARGING" ? "bg-green-50 border-blue-400 ring-4 ring-blue-400/30 scale-110" : 
//              batteryStatus === "DISCHARGING" ? "bg-green-100 border-green-500 ring-4 ring-green-400/50 scale-105" : 
//              "bg-white border-slate-300"
//            )}>
//               <Battery size={40} className={cn("mb-1 transition-colors", 
//                 batteryStatus === "CHARGING" ? "text-blue-500" :
//                 batteryStatus === "DISCHARGING" ? "text-green-600" : "text-slate-400")} />

//               <div className={cn("absolute -top-3 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase shadow-sm flex items-center gap-1",
//                 batteryStatus === "CHARGING" ? "bg-blue-500" : batteryStatus === "DISCHARGING" ? "bg-green-600" : "hidden"
//               )}>
//                 {batteryStatus === "CHARGING" ? <Zap size={10} className="fill-current" /> : <Leaf size={10} />}
//                 {batteryStatus}
//               </div>
//            </div>
//            <span className="mt-2 px-3 py-1 bg-white/90 rounded-full text-xs font-bold shadow-sm">Battery</span>
//         </div>

//         {/* GRID */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
//            <div className={cn("w-24 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg border-2 border-white/50 flex items-center justify-center", energyMix.grid > 0 && "animate-pulse")}>
//               <Plug size={32} className="text-white" />
//            </div>
//            <span className="mt-2 px-3 py-1 bg-white/90 rounded-full text-xs font-bold shadow-sm">Main Grid</span>
//         </div>

//         {renderConnections()}

//         {/* BUILDINGS */}
//         {buildings.map((building) => {
//           // Dynamic Border: Green when running on Battery
//           const isBatteryPowered = batteryStatus === "DISCHARGING" && energyMix.battery > 0.1;
//           const borderColor = isBatteryPowered ? "border-green-500 ring-4 ring-green-500/20" : "border-white";
//           const bgColor = isBatteryPowered ? "bg-green-50/90" : "bg-white/80";

//           return (
//             <motion.div
//               key={building.id}
//               drag dragMomentum={false} dragConstraints={constraintsRef}
//               onDragEnd={(e, i) => updatePosition(building.id, building.x + i.offset.x, building.y + i.offset.y)}
//               onClick={(e) => { e.stopPropagation(); setSelectedId(building.id); }}
//               initial={{ scale: 0 }} animate={{ scale: 1 }}
//               whileHover={{ scale: 1.05 }}
//               className={cn(
//                 "absolute w-24 h-24 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center z-30 backdrop-blur-md border-4 cursor-grab active:cursor-grabbing transition-all duration-300",
//                 borderColor, bgColor,
//                 selectedId === building.id && "ring-4 ring-blue-400 scale-110 z-40"
//               )}
//               style={{ left: building.x, top: building.y }}
//             >
//               <div className="p-2 bg-slate-100 rounded-xl mb-1">
//                  <BuildingIcon type={building.type} className={cn("w-6 h-6", isBatteryPowered ? "text-green-600" : "text-slate-700")} />
//               </div>
//               <div className="text-[10px] font-bold text-slate-700 text-center leading-tight px-1">{building.name}</div>
//               <div className="text-[9px] font-mono text-slate-500">{building.baseLoad} kW</div>

//               {isBatteryPowered && (
//                 <div className="absolute -bottom-2 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
//                    BATTERY
//                 </div>
//               )}

//               {/* Edit Controls */}
//               {selectedId === building.id && (
//                 <div className="absolute -top-10 flex gap-2 bg-white p-1 rounded-full shadow-lg">
//                   <button onClick={(e) => { e.stopPropagation(); openEditModal(building); }} className="p-2 hover:bg-slate-100 rounded-full text-blue-600"><Edit size={14} /></button>
//                   <button onClick={(e) => { e.stopPropagation(); removeBuilding(building.id); }} className="p-2 hover:bg-slate-100 rounded-full text-red-600"><Trash2 size={14} /></button>
//                 </div>
//               )}
//             </motion.div>
//           )
//         })}
//       </div>

//       {/* --- ADD MODAL (Unchanged) --- */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-80 bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
//                <h3 className="text-lg font-bold text-slate-800 mb-4">{modalMode === "ADD" ? "Add Building" : "Edit Building"}</h3>
//                <div className="space-y-4">
//                  <div>
//                    <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
//                    <input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full border rounded p-2 text-sm mt-1" />
//                  </div>
//                  <div>
//                    <label className="text-xs font-bold text-slate-400 uppercase flex justify-between">
//                      <span>Load</span> <span className="text-slate-800">{formLoad} kW</span>
//                    </label>
//                    <input type="range" min="10" max="300" step="10" value={formLoad} onChange={e => setFormLoad(Number(e.target.value))} className="w-full mt-1 accent-blue-600" />
//                  </div>
//                  <div className="flex gap-2 mt-4">
//                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
//                    <button onClick={handleSaveBuilding} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/30">Save</button>
//                  </div>
//                </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* --- TOOLBAR --- */}
//       <div className="h-16 bg-white/80 backdrop-blur-lg border-t border-slate-200 flex items-center justify-center gap-4 px-4 z-40">
//         {Object.keys(BUILDING_TEMPLATES).map((type) => (
//           <button key={type} onClick={() => openAddModal(type as BuildingType)} className="group flex flex-col items-center justify-center w-12 hover:w-16 transition-all duration-300">
//             <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 flex items-center justify-center shadow-sm">
//                <BuildingIcon type={type as BuildingType} className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, FlaskConical, Home, GraduationCap, Edit, Trash2, Maximize2, Minimize2, Box, Wind, Battery, Plug, Sun, Zap } from "lucide-react";
import { BuildingData, BuildingType, BUILDING_TEMPLATES } from "./types";
import { cn } from "@/lib/utils";

// --- ICONS ---
const BuildingIcon = ({ type, className }: { type: BuildingType; className?: string }) => {
  switch (type) {
    case "HOSTEL": return <Home className={className} />;
    case "LAB": return <FlaskConical className={className} />;
    case "CLASSROOM": return <GraduationCap className={className} />;
    case "ADMIN": return <Building2 className={className} />;
    case "CUSTOM": return <Box className={className} />;
  }
};

interface VisualizerProps {
  buildings: BuildingData[];
  setBuildings: (b: BuildingData[]) => void;
  energyMix: { solar: number; wind: number; battery: number; grid: number; };
  batteryStatus: "CHARGING" | "DISCHARGING" | "IDLE";
  timeOfDay: number;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onSave?: () => void;
}

// Layout Configuration (Percentages)
const SOURCES = {
  SOLAR: { x: 50, y: 10, color: "#FACC15" },
  WIND: { x: 90, y: 50, color: "#3B82F6" },
  BATTERY: { x: 10, y: 50, color: "#22C55E" },
  GRID: { x: 50, y: 90, color: "#EF4444" },
};

// --- HEATMAP / COLOR MIXING HELPERS ---
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const mixColors = (sources: { color: string; weight: number }[]) => {
  if (sources.length === 0) return "#e2e8f0";

  let totalWeight = 0;
  let r = 0, g = 0, b = 0;

  sources.forEach(s => {
    const rgb = hexToRgb(s.color);
    r += rgb.r * s.weight;
    g += rgb.g * s.weight;
    b += rgb.b * s.weight;
    totalWeight += s.weight;
  });

  if (totalWeight <= 0) return "#e2e8f0";

  r = Math.round(r / totalWeight);
  g = Math.round(g / totalWeight);
  b = Math.round(b / totalWeight);

  return `rgb(${r}, ${g}, ${b})`;
};

export default function CampusVisualizer({ buildings, setBuildings, energyMix, batteryStatus, timeOfDay, isFullScreen, onToggleFullScreen, onSave }: VisualizerProps) {
  const constraintsRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<BuildingType>("HOSTEL");
  const [formName, setFormName] = useState("");
  const [formLoad, setFormLoad] = useState(100);
  const [formPriority, setFormPriority] = useState<"HIGH" | "LOW">("LOW");

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setWindowSize({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // --- HANDLERS ---
  const openAddModal = (type: BuildingType) => {
    const template = BUILDING_TEMPLATES[type];
    setModalMode("ADD");
    setFormType(type);
    setFormName(template.name);
    setFormLoad(template.baseLoad);
    setFormPriority(template.priority);
    setIsModalOpen(true);
  };

  const openEditModal = (building: BuildingData) => {
    setModalMode("EDIT");
    setEditingBuildingId(building.id);
    setFormType(building.type);
    setFormName(building.name);
    setFormLoad(building.baseLoad);
    setFormPriority(building.priority);
    setIsModalOpen(true);
  };

  const handleSaveBuilding = () => {
    let newLayout = [...buildings];
    if (modalMode === "ADD") {
      const newBuilding: BuildingData = {
        id: self.crypto.randomUUID(),
        type: formType,
        x: windowSize.w / 2 - 50,
        y: windowSize.h / 2 - 50,
        name: formName,
        baseLoad: formLoad,
        priority: formPriority,
        renewableRatio: 0,
      };
      newLayout = [...buildings, newBuilding];
    } else if (modalMode === "EDIT" && editingBuildingId) {
      newLayout = buildings.map(b => b.id === editingBuildingId ? {
        ...b, name: formName, baseLoad: formLoad, priority: formPriority
      } : b);
    }
    setBuildings(newLayout);
    setIsModalOpen(false);
    if (onSave) setTimeout(onSave, 100);
  };

  const removeBuilding = (id: string) => {
    setBuildings(buildings.filter(b => b.id !== id));
    if (onSave) setTimeout(onSave, 100);
  };

  const updatePosition = (id: string, x: number, y: number) => {
    setBuildings(buildings.map(b => b.id === id ? { ...b, x, y } : b));
  };


  // --- VISUAL LOGIC ---
  const isNight = timeOfDay < 6 || timeOfDay >= 18;

  const getSunPosition = () => {
    if (isNight) return { x: 50, y: 130, opacity: 0 };
    const totalDayHours = 12;
    const currentHour = timeOfDay - 6;
    const progress = currentHour / totalDayHours;
    const x = 10 + (progress * 80);
    const y = 80 - (Math.sin(progress * Math.PI) * 75);
    return { x, y, opacity: 1 };
  };
  const sunPos = getSunPosition();

  const renderConnections = () => {
    if (windowSize.w === 0) return null;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        {/* --- CHARGING LINES (Sources -> Battery) --- */}
        {batteryStatus === "CHARGING" && (
          <>
            {energyMix.solar > 0 && (
              <motion.path
                d={`M ${(SOURCES.SOLAR.x / 100) * windowSize.w} ${(SOURCES.SOLAR.y / 100) * windowSize.h} Q ${windowSize.w / 2} ${windowSize.h / 2} ${(SOURCES.BATTERY.x / 100) * windowSize.w} ${(SOURCES.BATTERY.y / 100) * windowSize.h}`}
                stroke={SOURCES.SOLAR.color} strokeWidth={3} fill="none" strokeDasharray="8,8"
              >
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.8s" repeatCount="indefinite" />
              </motion.path>
            )}
            {energyMix.wind > 0 && (
              <motion.path
                d={`M ${(SOURCES.WIND.x / 100) * windowSize.w} ${(SOURCES.WIND.y / 100) * windowSize.h} Q ${windowSize.w / 2} ${windowSize.h / 2} ${(SOURCES.BATTERY.x / 100) * windowSize.w} ${(SOURCES.BATTERY.y / 100) * windowSize.h}`}
                stroke={SOURCES.WIND.color} strokeWidth={3} fill="none" strokeDasharray="8,8"
              >
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.8s" repeatCount="indefinite" />
              </motion.path>
            )}
          </>
        )}

        {/* --- SUPPLY LINES (Sources -> Buildings) --- */}
        {buildings.map(b => {
          const sx = (SOURCES.SOLAR.x / 100) * windowSize.w;
          const sy = (SOURCES.SOLAR.y / 100) * windowSize.h;
          const wx = (SOURCES.WIND.x / 100) * windowSize.w;
          const wy = (SOURCES.WIND.y / 100) * windowSize.h;
          const bx = (SOURCES.BATTERY.x / 100) * windowSize.w;
          const by = (SOURCES.BATTERY.y / 100) * windowSize.h;
          const gx = (SOURCES.GRID.x / 100) * windowSize.w;
          const gy = (SOURCES.GRID.y / 100) * windowSize.h;
          const buildX = b.x + 48; // Center
          const buildY = b.y + 48;

          return (
            <g key={b.id}>
              {energyMix.solar > 0.05 && batteryStatus !== 'CHARGING' && <line x1={sx} y1={sy} x2={buildX} y2={buildY} stroke={SOURCES.SOLAR.color} strokeWidth={energyMix.solar * 5} opacity={0.6} />}

              {energyMix.wind > 0.05 && batteryStatus !== 'CHARGING' && <line x1={wx} y1={wy} x2={buildX} y2={buildY} stroke={SOURCES.WIND.color} strokeWidth={energyMix.wind * 5} opacity={0.6} />}

              {batteryStatus === "DISCHARGING" && (
                <>
                  <line x1={bx} y1={by} x2={buildX} y2={buildY} stroke={SOURCES.BATTERY.color} strokeWidth={4} opacity={0.8} />
                  <circle r="4" fill={SOURCES.BATTERY.color}>
                    <animateMotion dur="0.8s" repeatCount="indefinite" path={`M ${bx} ${by} L ${buildX} ${buildY}`} />
                  </circle>
                </>
              )}

              {energyMix.grid > 0.05 && <line x1={gx} y1={gy} x2={buildX} y2={buildY} stroke={SOURCES.GRID.color} strokeWidth={energyMix.grid * 4} opacity={0.4} strokeDasharray="2,2" />}
            </g>
          );
        })}
      </svg>
    );
  };

  const getSkyGradient = () => {
    const h = timeOfDay;
    if (h >= 5 && h < 8) return "bg-gradient-to-b from-[#fdba74] via-[#fed7aa] to-[#ffedd5]";
    if (h >= 8 && h < 16) return "bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#e0f2fe]";
    if (h >= 16 && h < 19) return "bg-gradient-to-b from-[#fca5a5] via-[#fdba74] to-[#fed7aa]";
    return "bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]";
  };

  return (
    <div className={cn("h-full w-full relative flex flex-col overflow-hidden select-none transition-colors duration-1000", getSkyGradient())} ref={containerRef}>

      {/* --- Full Screen --- */}
      {onToggleFullScreen && (
        <button onClick={onToggleFullScreen} className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-lg transition-colors">
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      )}

      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {!isNight && (
          <motion.div
            className="absolute w-24 h-24 flex items-center justify-center"
            animate={{ left: `${sunPos.x}%`, top: `${sunPos.y}%`, opacity: sunPos.opacity }}
            transition={{ duration: 1, ease: "linear" }}
          >
            <div className="absolute w-40 h-40 bg-yellow-400/30 rounded-full blur-2xl animate-pulse"></div>
            <Sun size={80} className="text-yellow-400 fill-yellow-300 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
          </motion.div>
        )}

        {isNight && (
          <div className="absolute top-10 right-20 opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <div className="w-16 h-16 rounded-full bg-slate-100 shadow-inner"></div>
          </div>
        )}
      </div>

      {/* --- PLAYGROUND --- */}
      <div ref={constraintsRef} className="flex-1 relative overflow-hidden" onClick={() => setSelectedId(null)}>

        {/* SOURCES (Solar, Wind, Battery, Grid) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl shadow-lg border-2 border-white/50 flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <Sun size={40} className="text-white spin-slow" />
          </div>
          <span className="mt-3 px-4 py-1.5 bg-white rounded-full text-sm font-bold text-slate-900 border border-slate-200 shadow-md">Solar Farm</span>
        </div>

        <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20 flex flex-col items-center group">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: Math.max(0.2, 5 - (energyMix.wind * 5)), ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg border-2 border-white/50 flex items-center justify-center"
          >
            <Wind size={40} className="text-white" />
          </motion.div>
          <span className="mt-3 px-4 py-1.5 bg-white rounded-full text-sm font-bold text-slate-900 border border-slate-200 shadow-md">Wind Park</span>
        </div>

        <div className="absolute top-1/2 left-8 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className={cn(
            "w-20 h-24 rounded-2xl shadow-xl border-4 flex flex-col items-center justify-center relative transition-all duration-500",
            batteryStatus === "CHARGING" ? "bg-green-100 border-green-400 ring-4 ring-green-400/30 shadow-[0_0_30px_#4ade80]" :
              batteryStatus === "DISCHARGING" ? "bg-green-50 border-green-600 ring-4 ring-green-600/30" : "bg-white border-slate-300"
          )}>
            <Battery size={40} className={cn("mb-1 transition-colors", batteryStatus !== "IDLE" ? "text-green-600" : "text-slate-400")} />
            <div className={cn(
              "absolute -top-3 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase shadow-sm flex items-center gap-1",
              batteryStatus === "CHARGING" ? "bg-blue-500" : batteryStatus === "DISCHARGING" ? "bg-green-600" : "hidden"
            )}>
              {batteryStatus === "CHARGING" && <Zap size={10} className="fill-current" />}
              {batteryStatus}
            </div>
          </div>
          <span className="mt-3 px-4 py-1.5 bg-white rounded-full text-sm font-bold text-slate-900 border border-slate-200 shadow-md">Battery Storage</span>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className={cn("w-24 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg border-2 border-white/50 flex items-center justify-center", energyMix.grid > 0 && "animate-pulse")}>
            <Plug size={32} className="text-white" />
          </div>

          <span className="mt-3 px-4 py-1.5 bg-white rounded-full text-sm font-bold text-slate-900 border border-slate-200 shadow-md">Main Grid</span>
        </div>

        {renderConnections()}

        {/* --- BUILDINGS WITH MIXED COLORS --- */}
        {buildings.map((building) => {

          // --- MIXING LOGIC FOR THIS BUILDING ---
          const activeSources = [];
          if (batteryStatus !== 'CHARGING') {
            if (energyMix.solar > 0.01) activeSources.push({ color: SOURCES.SOLAR.color, weight: energyMix.solar });
            if (energyMix.wind > 0.01) activeSources.push({ color: SOURCES.WIND.color, weight: energyMix.wind });
          }
          if (batteryStatus === 'DISCHARGING') {
            if (energyMix.battery > 0.01) activeSources.push({ color: SOURCES.BATTERY.color, weight: energyMix.battery });
          }
          // Grid always counts if used
          if (energyMix.grid > 0.01) {
            activeSources.push({ color: SOURCES.GRID.color, weight: energyMix.grid });
          }

          const mixedColor = mixColors(activeSources);

          return (
            <motion.div
              key={building.id}
              drag dragMomentum={false} dragConstraints={constraintsRef}
              onDragEnd={(e, i) => updatePosition(building.id, building.x + i.offset.x, building.y + i.offset.y)}
              onClick={(e) => { e.stopPropagation(); setSelectedId(building.id); }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              style={{ left: building.x, top: building.y }}
              className={cn(
                "absolute w-24 h-24 rounded-2xl shadow-xl z-30 cursor-grab active:cursor-grabbing",
                selectedId === building.id && "z-40 scale-110"
              )}
            >
              {/* Mixed Color Border */}
              <div
                className="w-full h-full rounded-2xl p-[4px] transition-colors duration-500"
                style={{ background: mixedColor, boxShadow: `0 0 15px ${mixedColor}60` }}
              >
                {/* Inner White Content */}
                <div className="w-full h-full bg-white/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center">
                  <div className="p-2 bg-slate-100 rounded-xl mb-1">
                    <BuildingIcon type={building.type} className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-700 text-center leading-tight px-1">{building.name}</div>
                  <div className="text-[9px] font-mono text-slate-500">{building.baseLoad} kW</div>
                </div>
              </div>

              {selectedId === building.id && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-1 rounded-full shadow-lg">
                  <button onClick={(e) => { e.stopPropagation(); openEditModal(building); }} className="p-2 hover:bg-slate-100 rounded-full text-blue-600"><Edit size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); removeBuilding(building.id); }} className="p-2 hover:bg-slate-100 rounded-full text-red-600"><Trash2 size={14} /></button>
                </div>
              )}
            </motion.div>
          )
        })}

        {/* --- LEGEND (BOTTOM RIGHT CORNER) --- */}
        <div className="absolute bottom-4 right-4 z-40 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-slate-200">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Current Mix</h4>
          {(() => {
            const list = [];
            if (batteryStatus !== 'CHARGING') {
              if (energyMix.solar > 0.01) list.push({ name: 'Solar', ...SOURCES.SOLAR, weight: energyMix.solar });
              if (energyMix.wind > 0.01) list.push({ name: 'Wind', ...SOURCES.WIND, weight: energyMix.wind });
            }
            if (batteryStatus === 'DISCHARGING') {
              if (energyMix.battery > 0.01) list.push({ name: 'Battery', ...SOURCES.BATTERY, weight: energyMix.battery });
            }
            if (energyMix.grid > 0.01) list.push({ name: 'Grid', ...SOURCES.GRID, weight: energyMix.grid });

            const resultColor = mixColors(list);

            if (list.length === 0) return <span className="text-xs text-slate-400 italic">No Energy Flow</span>;

            return (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                {list.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1">
                    {idx > 0 && <span className="text-slate-300 text-[10px]">+</span>}
                    <div className="flex flex-col items-center">
                      <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                      <span className="text-[9px] opacity-70">{item.name}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center ml-2 pl-2 border-l border-slate-300">
                  <span className="mr-2 text-slate-400">→</span>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-lg border-2 border-white shadow-sm" style={{ background: resultColor }}></div>
                    <span className="text-[9px] opacity-70">Result</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

      </div>

      {/* --- ADD MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-80 bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">{modalMode === "ADD" ? "Add Building" : "Edit Building"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full border rounded p-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase flex justify-between">
                    <span>Load</span> <span className="text-slate-800">{formLoad} kW</span>
                  </label>
                  <input type="range" min="10" max="300" step="10" value={formLoad} onChange={e => setFormLoad(Number(e.target.value))} className="w-full mt-1 accent-blue-600" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button onClick={handleSaveBuilding} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/30">Save</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TOOLBAR --- */}
      <div className="h-16 bg-white/80 backdrop-blur-lg border-t border-slate-200 flex items-center justify-center gap-4 px-4 z-40">
        {Object.keys(BUILDING_TEMPLATES).map((type) => (
          <button
            key={type}
            onClick={() => openAddModal(type as BuildingType)}
            className="group flex flex-col items-center justify-center w-12 hover:w-16 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 flex items-center justify-center shadow-sm">
              <BuildingIcon type={type as BuildingType} className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}