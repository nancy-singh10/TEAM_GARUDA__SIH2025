"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Building2, FlaskConical, Home, GraduationCap, Plus, Trash2 } from "lucide-react";
import { BuildingData, BuildingType, BUILDING_TEMPLATES } from "./types";
import { cn } from "@/lib/utils";

// --- Icons Helper ---
const BuildingIcon = ({ type, className }: { type: BuildingType; className?: string }) => {
  switch (type) {
    case "HOSTEL": return <Home className={className} />;
    case "LAB": return <FlaskConical className={className} />;
    case "CLASSROOM": return <GraduationCap className={className} />;
    case "ADMIN": return <Building2 className={className} />;
  }
};

// --- Props ---
interface VisualizerProps {
  buildings: BuildingData[];
  setBuildings: (b: BuildingData[]) => void;
  totalAvailablePower: number; // Passed from parent to determine Green/Red status
}

export default function CampusVisualizer({ buildings, setBuildings, totalAvailablePower }: VisualizerProps) {
  const constraintsRef = useRef(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 1. Add New Building
  const addBuilding = (type: BuildingType) => {
    const template = BUILDING_TEMPLATES[type];
    const newBuilding: BuildingData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 50 + Math.random() * 100, // Random start pos
      y: 50 + Math.random() * 100,
      status: "grid", // Default
      ...template
    };
    setBuildings([...buildings, newBuilding]);
  };

  // 2. Remove Building
  const removeBuilding = (id: string) => {
    setBuildings(buildings.filter(b => b.id !== id));
    setSelectedId(null);
  };

  // 3. Update Position Logic
  const updatePosition = (id: string, x: number, y: number) => {
    setBuildings(buildings.map(b => b.id === id ? { ...b, x, y } : b));
  };

  return (
    <div className="h-full w-full bg-[#0f1115] relative flex flex-col overflow-hidden">
      
      {/* --- THE PLAYGROUND GRID --- */}
      <div ref={constraintsRef} className="flex-1 relative overflow-hidden">
        {/* CSS Pattern for "Blueprint" Grid */}
        <div className="absolute inset-0 opacity-20"
             style={{ 
               backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />

        {/* --- Render Buildings --- */}
        {buildings.map((building) => {
          // Check if this specific building is powered by Renewable Energy
          // Logic: We calculate cumulative load. If this building falls within available power, it's green.
          return (
            <motion.div
              key={building.id}
              drag
              dragMomentum={false}
              dragConstraints={constraintsRef}
              onDragEnd={(_, info) => {
                // Calculate new position relative to parent
                updatePosition(building.id, building.x + info.offset.x, building.y + info.offset.y);
              }}
              onClick={() => setSelectedId(building.id)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
              className={cn(
                "absolute w-32 p-3 rounded-xl border-2 backdrop-blur-md shadow-2xl cursor-grab transition-colors flex flex-col items-center gap-2",
                // Dynamic Coloring based on Status
                building.status === "re" 
                  ? "bg-emerald-900/40 border-emerald-500/50 shadow-emerald-500/20" 
                  : "bg-red-900/40 border-red-500/50 shadow-red-500/20",
                selectedId === building.id && "ring-2 ring-white"
              )}
              style={{ left: building.x, top: building.y }}
            >
              <div className={cn(
                "p-2 rounded-full",
                building.status === "re" ? "bg-emerald-500 text-black" : "bg-red-500 text-white"
              )}>
                <BuildingIcon type={building.type} className="w-6 h-6" />
              </div>
              
              <div className="text-center">
                <p className="text-xs font-bold text-white leading-tight">{building.name}</p>
                <p className="text-[10px] text-gray-300 font-mono mt-1">{building.baseLoad} kW</p>
              </div>

              {/* Status Indicator Dot */}
              <div className={cn(
                "absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse",
                building.status === "re" ? "bg-emerald-400" : "bg-red-500"
              )}/>
              
              {selectedId === building.id && (
                <button 
                  onClick={(e) => { e.stopPropagation(); removeBuilding(building.id); }}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* --- BOTTOM TOOLBAR (Add Buildings) --- */}
      <div className="h-20 bg-[#18181b] border-t border-gray-800 flex items-center justify-center gap-4 px-4 z-10">
        <p className="text-xs text-gray-500 font-mono uppercase mr-4 hidden md:block">Deploy Infrastructure:</p>
        
        {Object.keys(BUILDING_TEMPLATES).map((type) => (
          <button
            key={type}
            onClick={() => addBuilding(type as BuildingType)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 transition-all active:scale-95 group"
          >
            <BuildingIcon type={type as BuildingType} className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
            <span className="text-sm font-medium capitalize">{type.toLowerCase()}</span>
            <Plus size={14} className="opacity-50" />
          </button>
        ))}
      </div>
    </div>
  );
}