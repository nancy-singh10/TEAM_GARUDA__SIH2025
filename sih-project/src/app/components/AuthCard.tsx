"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./ModeToggle";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  // 'admin' maps to state_admin, 'consumer' maps to campus_admin (legacy naming kept for simplicity)
  variant?: "admin" | "consumer";
}

export function AuthCard({
  title,
  subtitle = "Manage renewable energy sources and grid operations",
  icon,
  variant = "admin",
}: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [campusName, setCampusName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [campusLoadMin, setCampusLoadMin] = useState("");
  const [campusLoadMax, setCampusLoadMax] = useState("");
  const [batterySources, setBatterySources] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [windCapacity, setWindCapacity] = useState("");
  const [solarCapacity, setSolarCapacity] = useState("");
  const [location, setLocation] = useState("");

  // Ensure this matches your actual folder name in src/app/api
  const endpointBase = variant === "admin" ? "state-admin" : "campus-admin";

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const url = `/api/${endpointBase}/${mode === "signup" ? "signup" : "login"}`;
      const payload: any = { username: email, password };

      if (mode === "signup" && variant === "consumer") {
        payload.campus_name = campusName || "Unnamed Campus";
        payload.admin_name = adminName || undefined;
        
        // Ensure email is undefined if empty string to avoid Zod validation error
        payload.email = emailAddr === "" ? undefined : emailAddr;

        // Helper to convert string input to number safely
        const toNumber = (val: string) => (val === "" ? undefined : Number(val));

        payload.campus_load_min = toNumber(campusLoadMin);
        payload.campus_load_max = toNumber(campusLoadMax);
        payload.no_of_battery_sources = toNumber(batterySources);
        
        // FIXED: Use correct state variables here
        payload.solar_capacity = toNumber(solarCapacity);
        payload.wind_capacity = toNumber(windCapacity);
        payload.battery_capacity = toNumber(batteryCapacity);
        
        payload.location = location || undefined;
      }

      console.log("Sending payload:", payload); // helpful for debugging

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok) {
        // If validation error exists, show the first one to be helpful
        let errorMsg = json.error || 'Request failed';
        if (json.details?.fieldErrors) {
            const firstField = Object.keys(json.details.fieldErrors)[0];
            const firstMsg = json.details.fieldErrors[firstField][0];
            errorMsg = `${firstField}: ${firstMsg}`;
        }
        setError(errorMsg);
      } else {
        setError(null);
        // Store lightweight session
        try { localStorage.setItem('sessionUser', JSON.stringify(json.user)); } catch {}
        
        const dashboard = variant === 'admin' ? '/stateAdmin/dashboard' : '/campusAdmin/dashboard';
        router.push(dashboard);
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-sky-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 relative overflow-hidden"
      >
        {/* Decorative background blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              {icon || <span className="text-3xl">{variant === "admin" ? "🛡️" : "👥"}</span>}
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-8">
            <button
              onClick={() => setMode("login")}
              className={`py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === "login" 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === "signup" 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username / Email</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder={variant === 'admin' ? "state_master" : "north_admin"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    {variant === 'consumer' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Campus Name</label>
                          <input
                            type="text"
                            required
                            value={campusName}
                            onChange={(e) => setCampusName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="My Renewable Campus"
                          />
                        </div>
                        {/* Additional fields with same styling */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Admin Name</label>
                          <input
                            type="text"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                          <input
                            type="email"
                            value={emailAddr}
                            onChange={(e) => setEmailAddr(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="admin@campus.edu"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Load Min (kW)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={campusLoadMin}
                            onChange={(e) => setCampusLoadMin(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Load Max (kW)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={campusLoadMax}
                            onChange={(e) => setCampusLoadMax(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Battery Sources</label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            required
                            value={batterySources}
                            onChange={(e) => setBatterySources(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Solar Cap (kWh)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={solarCapacity}
                            onChange={(e) => setSolarCapacity(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Wind Cap (kWh)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={windCapacity}
                            onChange={(e) => setWindCapacity(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Battery Cap (kWh)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={batteryCapacity}
                            onChange={(e) => setBatteryCapacity(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                          <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="City, State"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3.5 text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {mode === "login" && (
            <p className="mt-6 text-sm text-center text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
              >
                Sign up now
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AuthCard;