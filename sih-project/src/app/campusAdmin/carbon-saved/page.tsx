"use client";

import { ArrowLeft, Cloud, Wind, TrendingDown, Info, BarChart3, AlertCircle, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CarbonSavedPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "analysis" | "goals">("overview");

    // Mock Data
    const carbonData = {
        totalSaved: 37.62, // kg
        thisMonth: 37.62,
        lastMonth: 32.10,
        dailyAverage: 1.25,
        target: 50.00,
    };

    const savingsData = [
        { month: 'Jun', actual: 28, target: 40 },
        { month: 'Jul', actual: 35, target: 42 },
        { month: 'Aug', actual: 42, target: 45 },
        { month: 'Sep', actual: 38, target: 45 },
        { month: 'Oct', actual: 45, target: 48 },
        { month: 'Nov', actual: 37.6, target: 50 },
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
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
                            <Cloud className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
                                Carbon Saved
                            </h1>
                            <p className="text-muted-foreground mt-1">Track your reduction in carbon footprint</p>
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
                            ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <TrendingDown className="h-4 w-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("analysis")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "analysis"
                            ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <BarChart3 className="h-4 w-4" />
                        Emissions Analysis
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
                                className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-6 shadow-xl text-white"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sky-100 font-medium">Total Saved</span>
                                        <div className="group relative">
                                            <Info className="h-4 w-4 text-sky-200 cursor-help" />
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-sky-900 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Based on 0.82kg CO2 / kWh
                                            </span>
                                        </div>
                                    </div>
                                    <Cloud className="h-6 w-6 text-sky-200" />
                                </div>
                                <div className="text-4xl font-bold">{carbonData.totalSaved} kg</div>
                                <div className="text-sky-100 text-sm mt-2">vs {carbonData.lastMonth} kg last month</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-sky-100 dark:border-sky-900"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">Daily Average</span>
                                    <Activity className="h-5 w-5 text-sky-600" />
                                </div>
                                <div className="text-4xl font-bold text-sky-600">{carbonData.dailyAverage} kg</div>
                                <div className="text-sm text-muted-foreground mt-2">Per day reduction</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-sky-100 dark:border-sky-900"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">Monthly Goal</span>
                                    <AlertCircle className="h-5 w-5 text-sky-600" />
                                </div>
                                <div className="text-4xl font-bold text-sky-600">{((carbonData.totalSaved / carbonData.target) * 100).toFixed(1)}%</div>
                                <div className="text-sm text-muted-foreground mt-2">Target: {carbonData.target} kg</div>
                            </motion.div>
                        </div>
                    </>
                )}

                {/* Analysis Tab */}
                {activeTab === "analysis" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
                    >
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-sky-600" />
                            Monthly Savings vs Target (Last 6 Months)
                        </h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={savingsData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="actual" name="Actual Saved" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar dataKey="target" name="Target Goal" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
