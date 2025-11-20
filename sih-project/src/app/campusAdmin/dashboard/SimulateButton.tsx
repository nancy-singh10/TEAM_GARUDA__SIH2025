
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SimulateButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSimulate = async () => {
    setLoading(true);
    try {
      // Randomize inputs slightly for variety
      const res = await fetch('/api/campus-admin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minSolar: 0,
          maxSolar: 40 + Math.random() * 20,
          minWind: 5 + Math.random() * 10,
          maxWind: 30 + Math.random() * 20,
          batteryStart: 60 + Math.random() * 30
        })
      });
      
      if (res.ok) {
        router.refresh(); // Refresh Server Components to fetch new DB data
      }
    } catch (error) {
      console.error("Simulation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSimulate}
      disabled={loading}
      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors disabled:opacity-50"
    >
      {loading ? "Simulating..." : "🔄 Simulate New Day"}
    </button>
  );
}
