"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        payload.campus_name = campusName || "Unnamed Campus"; // required by schema
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Request failed');
      } else {
        setError(null);
        // Store lightweight session (NOT secure for production; replace with JWT HttpOnly cookie)
        try { localStorage.setItem('sessionUser', JSON.stringify(json.user)); } catch {}
        const dashboard = variant === 'admin' ? '/admin/dashboard' : '/consumer/dashboard';
        router.push(dashboard);
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-xl border border-slate-100 p-8 relative">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg">
        {icon || <span className="text-2xl">{variant === "admin" ? "🛡️" : "👥"}</span>}
      </div>
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="mt-6 grid grid-cols-2 rounded-md overflow-hidden bg-slate-100 text-sm font-medium">
        <button
          onClick={() => setMode("login")}
          className={`py-2 transition-colors ${
            mode === "login" ? "bg-white text-slate-900" : "text-slate-500"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`py-2 transition-colors ${
            mode === "signup" ? "bg-white text-slate-900" : "text-slate-500"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email</label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="state_admin or campus_admin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        {mode === 'signup' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            {variant === 'consumer' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campus Name</label>
                <input
                  type="text"
                  required
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Renewable Campus"
                />
              </div>
            )}
          </>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-2.5 text-sm font-medium shadow hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>

      {mode === "login" && (
        <p className="mt-4 text-xs text-center text-slate-500">
          Need an account?{" "}
          <button
            type="button"
            onClick={() => setMode("signup")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up
          </button>
        </p>
      )}
    </div>
  );
}

export default AuthCard;