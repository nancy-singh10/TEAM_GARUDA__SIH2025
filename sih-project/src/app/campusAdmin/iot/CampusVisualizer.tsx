"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, FlaskConical, Home, GraduationCap, Plus, Trash2, X, Crown, Edit, Save, Maximize2, Minimize2 } from "lucide-react";
import { BuildingData, BuildingType, BUILDING_TEMPLATES } from "./types";
import { cn } from "@/lib/utils";

const BuildingIcon = ({ type, className }: { type: BuildingType; className?: string }) => {
  switch (type) {
    case "HOSTEL": return <Home className={className} />;
    case "LAB": return <FlaskConical className={className} />;
    case "CLASSROOM": return <GraduationCap className={className} />;
    case "ADMIN": return <Building2 className={className} />;
  }
};

interface VisualizerProps {
  buildings: BuildingData[];
  setBuildings: (b: BuildingData[]) => void;
  totalAvailablePower: number;
  isFullScreen?: boolean; // Optional prop
  onToggleFullScreen?: () => void; // Optional prop
  onSave?: () => void; // Trigger save to DB
}

export default function CampusVisualizer({ buildings, setBuildings, totalAvailablePower, isFullScreen, onToggleFullScreen, onSave }: VisualizerProps) {
  const constraintsRef = useRef(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<BuildingType>("HOSTEL");
  const [formName, setFormName] = useState("");
  const [formLoad, setFormLoad] = useState(100);
  const [formPriority, setFormPriority] = useState<"HIGH" | "LOW">("LOW");

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
        x: 100, // Default start position
        y: 100,
        name: formName,
        baseLoad: formLoad,
        priority: formPriority,
        renewableRatio: 0,
        status: 'grid'
      };
      newLayout = [...buildings, newBuilding];
    } else if (modalMode === "EDIT" && editingBuildingId) {
      newLayout = buildings.map(b => b.id === editingBuildingId ? {
        ...b,
        name: formName,
        baseLoad: formLoad,
        priority: formPriority
      } : b);
    }

    setBuildings(newLayout);
    setIsModalOpen(false);
    setSelectedId(null);

    // Trigger Save
    if (onSave) setTimeout(onSave, 100);
  };

  const removeBuilding = (id: string) => {
    const newLayout = buildings.filter(b => b.id !== id);
    setBuildings(newLayout);
    setSelectedId(null);
    if (onSave) setTimeout(onSave, 100);
  };

  const updatePosition = (id: string, x: number, y: number) => {
    const newLayout = buildings.map(b => b.id === id ? { ...b, x, y } : b);
    setBuildings(newLayout);
  };

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-[#0f1115] relative flex flex-col overflow-hidden select-none group/panel">

      {/* --- Full Screen Button --- */}
      {onToggleFullScreen && (
        <button
          onClick={onToggleFullScreen}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-blue-600 text-white rounded-lg opacity-0 group-hover/panel:opacity-100 transition-opacity"
          title="Toggle Full Screen"
        >
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      )}

      {/* --- PLAYGROUND AREA --- */}
      <div ref={constraintsRef} className="flex-1 relative overflow-hidden" onClick={() => setSelectedId(null)}>
        {/* Grid Background */}
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            ['--grid-color' as any]: 'rgba(128, 128, 128, 0.2)'
          }}
        />

        {/* --- BUILDINGS RENDER --- */}
        {buildings.map((building) => {
          // Color Logic (Green if Renewable, Red if Grid)
          // Logic: If renewableRatio > 0.5, it's mostly green.
          const isGreen = building.renewableRatio > 0.5;

          let borderColor = "border-red-500/50";
          let glowColor = "shadow-red-500/20";
          let bgColor = "bg-red-950/80";

          if (isGreen) {
            borderColor = "border-emerald-500/50";
            glowColor = "shadow-emerald-500/20";
            bgColor = "bg-emerald-950/80";
          }

          return (
            <motion.div
              key={building.id}
              drag
              dragMomentum={false} // STOP FLYING AWAY
              dragElastic={0}      // STOP RUBBER BANDING
              dragConstraints={constraintsRef}
              onDragEnd={(event, info) => {
                // Update state with the *new* position relative to the last position
                // Note: Ideally we use absolute coordinates, but framer motion uses delta.
                // For this fix, we will rely on visual drag and update state.
                updatePosition(building.id, building.x + info.offset.x, building.y + info.offset.y);
                if (onSave) onSave(); // Trigger DB Save on drag end
              }}
              onClick={(e) => { e.stopPropagation(); setSelectedId(building.id); }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05, cursor: "grab" }}
              whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
              className={cn(
                "absolute w-40 p-3 rounded-xl border-2 backdrop-blur-md shadow-2xl flex flex-col items-center gap-2 group transition-colors duration-300",
                bgColor, borderColor, glowColor,
                selectedId === building.id && "ring-2 ring-white border-white scale-105 z-40"
              )}
              style={{ left: building.x, top: building.y }}
            >
              {building.priority === "HIGH" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black p-1 rounded-full shadow-lg z-50">
                  <Crown size={12} fill="black" />
                </div>
              )}

              <div className={cn(
                "p-2.5 rounded-full shadow-inner border border-white/10 transition-colors duration-300",
                isGreen ? "bg-emerald-500 text-black" : "bg-red-600 text-white"
              )}>
                <BuildingIcon type={building.type} className="w-6 h-6" />
              </div>

              <div className="text-center w-full">
                <p className="text-[11px] font-bold text-white uppercase tracking-wider truncate">{building.name}</p>
                {/* Visual Load Bar */}
                <div className="mt-2 w-full bg-black/40 rounded-full h-1.5 overflow-hidden flex">
                  <div className="h-full bg-emerald-400" style={{ width: `${building.renewableRatio * 100}%` }} />
                  <div className="h-full bg-red-500" style={{ width: `${(1 - building.renewableRatio) * 100}%` }} />
                </div>
                <p className="text-[9px] text-gray-300 font-mono mt-1">
                  {Math.round(building.renewableRatio * 100)}% Green | {building.baseLoad} kW
                </p>
              </div>

              {selectedId === building.id && (
                <div className="absolute -top-3 -right-3 flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); openEditModal(building); }} className="p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow-lg"><Edit size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); removeBuilding(building.id); }} className="p-1.5 bg-red-600 rounded-full text-white hover:bg-red-700 shadow-lg"><Trash2 size={12} /></button>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-[#18181b] border border-slate-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {modalMode === "ADD" ? <Plus size={20} /> : <Edit size={20} />}
                  {modalMode === "ADD" ? "Deploy Infrastructure" : "Configure Building"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Building Name</label>
                  <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white text-sm focus:border-blue-500 outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block flex justify-between">
                    <span>Load Demand</span>
                    <span className="text-white font-mono">{formLoad} kW</span>
                  </label>
                  <input type="range" min="10" max="500" step="10" value={formLoad} onChange={(e) => setFormLoad(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Priority Level</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setFormPriority("HIGH")} className={cn("p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all", formPriority === "HIGH" ? "bg-yellow-500/20 border-yellow-500 text-yellow-500" : "border-gray-700 text-gray-500 hover:bg-gray-800")}><Crown size={14} /> HIGH</button>
                    <button onClick={() => setFormPriority("LOW")} className={cn("p-2 rounded-lg border text-xs font-bold transition-all", formPriority === "LOW" ? "bg-blue-500/20 border-blue-500 text-blue-500" : "border-gray-700 text-gray-500 hover:bg-gray-800")}>LOW</button>
                  </div>
                </div>

                <button onClick={handleSaveBuilding} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-2 transition-all active:scale-95"><Save size={18} /> {modalMode === "ADD" ? "Deploy Unit" : "Save Changes"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TOOLBAR --- */}
      <div className="h-24 bg-white dark:bg-[#18181b] border-t border-slate-200 dark:border-gray-800 flex items-center justify-center gap-6 px-4 z-10 shadow-xl">
        {Object.keys(BUILDING_TEMPLATES).map((type) => (
          <button
            key={type}
            onClick={() => openAddModal(type as BuildingType)}
            className="flex flex-col items-center gap-2 group transition-all active:scale-90"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 group-hover:border-blue-500 group-hover:bg-gray-700 flex items-center justify-center transition-all shadow-lg">
              <BuildingIcon type={type as BuildingType} className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 uppercase tracking-wide transition-colors">{type.toLowerCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}