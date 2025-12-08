"use client";

import { ArrowLeft, IndianRupee, TrendingDown, Wallet, Receipt, CreditCard, PieChart, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function EnergyCostPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "reports" | "budget">("overview");

    // Mock Data
    const costData = {
        totalCost: 14904.75,
        savings: 8500.25,
        projectedBill: 18500.00,
        roi: 12.5, // %
    };

    const trendData = [
        { month: 'Jun', totalBill: 22000, savings: 4000 },
        { month: 'Jul', totalBill: 20500, savings: 4800 },
        { month: 'Aug', totalBill: 19000, savings: 5500 },
        { month: 'Sep', totalBill: 18500, savings: 5800 },
        { month: 'Oct', totalBill: 16000, savings: 7200 },
        { month: 'Nov', totalBill: 14904, savings: 8500 },
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
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg">
                            <IndianRupee className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Energy Cost
                            </h1>
                            <p className="text-muted-foreground mt-1">Monitor billing and financial savings</p>
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
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Wallet className="h-4 w-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("reports")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "reports"
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Receipt className="h-4 w-4" />
                        Billing Reports
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
                                className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 shadow-xl text-white"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-violet-100 font-medium">Cost (Nov 1-30)</span>
                                    <CreditCard className="h-6 w-6 text-violet-200" />
                                </div>
                                <div className="text-4xl font-bold">₹{costData.totalCost.toLocaleString()}</div>
                                <div className="text-violet-100 text-sm mt-2">Includes Fixed & Usage</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-violet-100 dark:border-violet-900"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">Total Savings</span>
                                    <TrendingDown className="h-5 w-5 text-violet-600" />
                                </div>
                                <div className="text-4xl font-bold text-violet-600">₹{costData.savings.toLocaleString()}</div>
                                <div className="text-sm text-muted-foreground mt-2">From renewable usage</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-violet-100 dark:border-violet-900"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">ROI (Yearly)</span>
                                        <div className="group relative">
                                            <Info className="h-4 w-4 text-slate-400 cursor-help" />
                                            <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                (Savings / System Cost) %
                                            </span>
                                        </div>
                                    </div>
                                    <PieChart className="h-5 w-5 text-violet-600" />
                                </div>
                                <div className="text-4xl font-bold text-violet-600">{costData.roi}%</div>
                                <div className="text-sm text-muted-foreground mt-2">Return on Investment</div>
                            </motion.div>
                        </div>
                    </>
                )}

                {/* Reports Tab */}
                {activeTab === "reports" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
                    >
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-violet-600" />
                            Cost Trend & Savings Analysis
                        </h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalBill" name="Total Bill" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="savings" name="Savings Achieved" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
