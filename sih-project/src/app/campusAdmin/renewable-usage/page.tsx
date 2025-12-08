"use client";

import { ArrowLeft, Zap, PieChart, Activity, Settings, TrendingUp, Sun, Wind, Battery, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RenewableUsagePage() {
    const [activeTab, setActiveTab] = useState<"overview" | "breakdown">("overview");

    // Mock Data
    const usageData = {
        renewablePercent: 32.61,
        totalUsage: 1020, // kWh
        solarContribution: 18.5, // %
        windContribution: 14.1, // %
        gridContribution: 67.4, // %
        peakRenewable: "2:00 PM",
        efficiencyScore: 78, // out of 100
    };

    const generationData = [
        { time: '00:00', solar: 0, wind: 30, grid: 50 },
        { time: '04:00', solar: 0, wind: 45, grid: 40 },
        { time: '08:00', solar: 20, wind: 35, grid: 60 },
        { time: '12:00', solar: 85, wind: 20, grid: 10 },
        { time: '16:00', solar: 60, wind: 25, grid: 30 },
        { time: '20:00', solar: 0, wind: 40, grid: 70 },
        { time: '23:59', solar: 0, wind: 35, grid: 60 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/campusAdmin/dashboard"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-600 shadow-lg">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-emerald-600 dark:from-amber-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                Renewable Usage
                            </h1>
                            <p className="text-muted-foreground mt-1">Analyze and optimize your energy mix</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-border overflow-x-auto mb-8"
                >
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "overview"
                            ? "bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Activity className="h-4 w-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("breakdown")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "breakdown"
                            ? "bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <PieChart className="h-4 w-4" />
                        Source Breakdown
                    </button>

                </motion.div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-gradient-to-br from-amber-500 to-emerald-600 rounded-xl p-6 shadow-xl text-white"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-amber-100 font-medium">Renewable Share</span>
                                    <Zap className="h-6 w-6 text-amber-200" />
                                </div>
                                <div className="text-4xl font-bold">{usageData.renewablePercent}%</div>
                                <div className="text-amber-100 text-sm mt-2">of total consumption</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-amber-100 dark:border-amber-900"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Efficiency Score</span>
                                        <div className="group relative">
                                            <Info className="h-4 w-4 text-slate-400 cursor-help" />
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                (Renewable / Total) × 100
                                            </span>
                                        </div>
                                    </div>
                                    <TrendingUp className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="text-4xl font-bold text-amber-600">{usageData.efficiencyScore}/100</div>
                                <div className="text-sm text-muted-foreground mt-2">Normalized Benchmark</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-amber-100 dark:border-amber-900"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">Peak Renewable</span>
                                    <Sun className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="text-4xl font-bold text-amber-600">{usageData.peakRenewable}</div>
                                <div className="text-sm text-muted-foreground mt-2">Avg. Last 30 Days</div>
                            </motion.div>
                        </div>
                    </>
                )}

                {/* Breakdown Tab */}
                {activeTab === "breakdown" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
                    >
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-amber-600" />
                            Energy Source Distribution
                        </h2>

                        <div className="mb-8 h-[300px] w-full">
                            <h3 className="font-semibold text-sm text-muted-foreground mb-4">24h Generation Mix</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={generationData}>
                                    <defs>
                                        <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kW`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="solar" stackId="1" stroke="#eab308" fill="url(#colorSolar)" name="Solar" />
                                    <Area type="monotone" dataKey="wind" stackId="1" stroke="#0ea5e9" fill="url(#colorWind)" name="Wind" />
                                    <Area type="monotone" dataKey="grid" stackId="1" stroke="#8b5cf6" fill="#ddd6fe" name="Grid" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-6">
                            {/* Solar Bar */}
                            <div>
                                <div className="flex justify-between mb-2 text-sm font-medium">
                                    <span className="flex items-center gap-2"><Sun className="w-4 h-4 text-yellow-500" /> Solar</span>
                                    <span>{usageData.solarContribution}%</span>
                                </div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usageData.solarContribution}%` }}
                                        transition={{ duration: 1 }}
                                        className="h-full bg-yellow-500"
                                    />
                                </div>
                            </div>

                            {/* Wind Bar */}
                            <div>
                                <div className="flex justify-between mb-2 text-sm font-medium">
                                    <span className="flex items-center gap-2"><Wind className="w-4 h-4 text-sky-500" /> Wind</span>
                                    <span>{usageData.windContribution}%</span>
                                </div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usageData.windContribution}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-sky-500"
                                    />
                                </div>
                            </div>

                            {/* Grid Bar */}
                            <div>
                                <div className="flex justify-between mb-2 text-sm font-medium">
                                    <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-violet-500" /> Grid (Non-Renewable)</span>
                                    <span>{usageData.gridContribution}%</span>
                                </div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usageData.gridContribution}%` }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                        className="h-full bg-violet-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}


            </div>
        </div>
    );
}
