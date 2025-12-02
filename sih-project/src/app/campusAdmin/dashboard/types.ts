export type BuildingType = "HOSTEL" | "LAB" | "CLASSROOM" | "ADMIN";

export interface BuildingData {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
  name: string;
  baseLoad: number; // In kW
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "re" | "grid"; // re = renewable, grid = grid power
}

export const BUILDING_TEMPLATES: Record<BuildingType, Omit<BuildingData, "id" | "x" | "y" | "status">> = {
  HOSTEL: { name: "Boys Hostel", baseLoad: 150, priority: "HIGH" },
  LAB: { name: "Chemistry Lab", baseLoad: 300, priority: "MEDIUM" },
  CLASSROOM: { name: "Lecture Hall", baseLoad: 50, priority: "LOW" },
  ADMIN: { name: "Admin Block", baseLoad: 100, priority: "HIGH" },
};