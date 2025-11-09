"use client";

import { useState } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "admin" | "consumer";
}

export function AuthCard({
  title,
  subtitle = "Manage renewable energy sources and grid operations",
  icon,
  variant = "admin",
}: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

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

      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-2.5 text-sm font-medium shadow hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {mode === "login" ? "Login" : "Create Account"}
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