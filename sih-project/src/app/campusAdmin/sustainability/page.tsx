"use client";

import { ArrowLeft, Leaf, TrendingUp, Calendar, Zap, Trees, Car, Factory, ChevronDown, ChevronUp, BarChart3, Activity, Info, Cloud } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SustainabilityPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "trends" | "glossary">("overview");

    // Mock Data (To be replaced by API later)
    const impactData = {
        treesPlanted: 1543,
        co2Saved: 12500, // kg
        drivingOffset: 45000, // km
        coalAvoided: 8500, // kg
        monthlyTrend: "+12%",
        projectedYearly: 150000, // kg CO2
    };

    const monthlyImpact = [
        { month: "Jan", co2: 980, trees: 12 },
        { month: "Feb", co2: 1050, trees: 15 },
        { month: "Mar", co2: 1100, trees: 18 },
        { month: "Apr", co2: 1250, trees: 22 },
        { month: "May", co2: 1400, trees: 28 },
        { month: "Jun", co2: 1550, trees: 35 },
        { month: "Jul", co2: 1600, trees: 38 },
        { month: "Aug", co2: 1580, trees: 36 },
        { month: "Sep", co2: 1450, trees: 30 },
        { month: "Oct", co2: 1300, trees: 25 },
        { month: "Nov", co2: 1150, trees: 20 },
        { month: "Dec", co2: 1050, trees: 16 },
    ];

    const maxCo2 = Math.max(...monthlyImpact.map(m => m.co2));

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
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg">
                            <Leaf className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                Sustainability Impact
                            </h1>
                            <p className="text-muted-foreground mt-1">Real-world environmental contribution of your renewable choices</p>
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
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Activity className="h-4 w-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("trends")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "trends"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <BarChart3 className="h-4 w-4" />
                        Yearly Trends
                    </button>
                    <button
                        onClick={() => setActiveTab("glossary")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "glossary"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Info className="h-4 w-4" />
                        What Does This Mean?
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
                                className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 shadow-xl text-white relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Trees className="w-32 h-32 text-white" />
                                </div>
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-emerald-100 font-medium">Trees Planted Equivalent</span>
                                    <Trees className="h-6 w-6 text-emerald-200" />
                                </div>
                                <div className="text-4xl font-bold relative z-10">{impactData.treesPlanted}</div>
                                <div className="text-emerald-100 text-sm mt-2 relative z-10">+32 this month</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-emerald-100 dark:border-emerald-900"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">CO₂ Emissions Saved</span>
                                    <Cloud className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="text-4xl font-bold text-emerald-600">{impactData.co2Saved.toLocaleString()} kg</div>
                                <div className="text-sm text-muted-foreground mt-2">Lifetime savings</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-emerald-100 dark:border-emerald-900"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">Driving Offset</span>
                                    <Car className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="text-4xl font-bold text-emerald-600">{impactData.drivingOffset.toLocaleString()} km</div>
                                <div className="text-sm text-muted-foreground mt-2">Not driven by a gas car</div>
                            </motion.div>
                        </div>

                        {/* Impact Details Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Visualizer Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
                            >
                                <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Factory className="w-5 h-5 text-emerald-600" />
                                    Coal Power Avoided
                                </h3>
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-center">
                                        <div className="text-6xl font-black text-slate-200 dark:text-slate-700 relative">
                                            {impactData.coalAvoided.toLocaleString()}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-3xl text-emerald-600 font-bold">{impactData.coalAvoided.toLocaleString()} kg</span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-muted-foreground">Of coal NOT burned thanks to your solar/wind usage.</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Encouragement Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 shadow-xl border border-teal-100 dark:border-teal-900 flex flex-col justify-center items-center text-center"
                            >
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg mb-4">
                                    <TrendingUp className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 mb-2">You're making a difference!</h3>
                                <p className="text-slate-600 dark:text-slate-300 max-w-sm">
                                    Your campus has saved enough energy this year to power <span className="font-bold text-emerald-600">50 average homes</span> for a whole month.
                                </p>
                                <button className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold transition-colors shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
                                    Download Impact Report
                                </button>
                            </motion.div>
                        </div>
                    </>
                )}

                {/* Trends Tab */}
                {activeTab === "trends" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
                    >
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-emerald-600" />
                            Monthly Carbon Savings (kg)
                        </h2>
                        <div className="h-[400px] w-full flex items-end justify-between gap-2 px-4 pb-2 border-b border-l border-slate-200 dark:border-slate-700 relative">
                            {/* Y-Axis labels approx */}
                            <div className="absolute left-0 top-0 bottom-0 -translate-x-full pr-2 flex flex-col justify-between text-xs text-muted-foreground py-2 h-full">
                                <span>{maxCo2}</span>
                                <span>{Math.round(maxCo2 / 2)}</span>
                                <span>0</span>
                            </div>

                            {monthlyImpact.map((m, i) => (
                                <div key={m.month} className="group relative flex-1 h-full flex items-end hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t transition-colors">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(m.co2 / maxCo2) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                                        className="w-full mx-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg relative group-hover:from-emerald-400 group-hover:to-teal-300 transition-all"
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                            <div className="font-bold">{m.co2} kg</div>
                                            <div className="text-[10px] text-emerald-300">{m.trees} trees</div>
                                        </div>
                                    </motion.div>
                                    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium">{m.month}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Glossary Tab */}
                {activeTab === "glossary" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4 max-w-3xl mx-auto"
                    >
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-border">
                            <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2"><Trees className="w-5 h-5" /> Trees Planted Equivalent</h3>
                            <p className="text-muted-foreground">
                                We calculate this based on the absorption rate of a mature tree. Saving 1 ton of CO2 is roughly equivalent to planting 45-50 trees that grow for 10 years.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-border">
                            <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2"><Car className="w-5 h-5" /> Driving Offset</h3>
                            <p className="text-muted-foreground">
                                The average passenger vehicle emits about 120g of CO2 per kilometer. We divide your total CO2 savings by this factor to show how many km of driving you've "cancelled out".
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-border">
                            <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2"><Factory className="w-5 h-5" /> Coal Power Avoided</h3>
                            <p className="text-muted-foreground">
                                Coal power plants generate roughly 0.85kg of CO2 per kWh. Every kWh of solar/wind energy you produce replaces one that would have been generated by burning coal.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Cloud Icon component local import replacement */}

        </div>
    );
}
