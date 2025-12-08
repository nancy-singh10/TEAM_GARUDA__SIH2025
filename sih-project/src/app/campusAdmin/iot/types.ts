export type BuildingType = "HOSTEL" | "LAB" | "CLASSROOM" | "ADMIN";

export interface BuildingData {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
  name: string;
  baseLoad: number; // In kW
  priority: "HIGH" | "LOW"; // Simplified to 2 priorities as requested
  renewableRatio: number; // 0 to 1 (e.g., 0.4 = 40% green)
  status?: string; // e.g., 'grid', 'green'
}

// Templates now serve as "Defaults" for the popup
export const BUILDING_TEMPLATES: Record<BuildingType, Omit<BuildingData, "id" | "x" | "y" | "renewableRatio" | "type">> = {
  HOSTEL: { name: "Boys Hostel", baseLoad: 150, priority: "HIGH" },
  LAB: { name: "Chemistry Lab", baseLoad: 300, priority: "LOW" },
  CLASSROOM: { name: "Lecture Hall", baseLoad: 50, priority: "LOW" },
  ADMIN: { name: "Admin Block", baseLoad: 100, priority: "HIGH" },
};