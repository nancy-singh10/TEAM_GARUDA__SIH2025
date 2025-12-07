'use client';

import React from 'react';
import { TrendingUp, ShieldCheck, Zap, Coins, Building, FileSignature, Server, Scale } from 'lucide-react';

export default function BusinessModelPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="inline-block p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
                        <Scale className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Green Energy</span> Economy
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        A state-led initiative to revolutionize campus energy management. We provide the infrastructure; you provide the participation. Validated by a transparent tokenomic model.
                    </p>
                </div>

                {/* Tokenomics Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-300" />

                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10 flex items-center gap-3">
                            <Coins className="text-yellow-500" />
                            Token Economics & Profit Model
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Visual Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-[28%] left-[16%] right-[16%] h-1 bg-gradient-to-r from-emerald-200 to-emerald-200 dark:from-emerald-900 dark:to-emerald-900 -z-0"></div>

                            {/* Buy Price */}
                            <div className="relative z-10 bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="mb-4 inline-flex p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                                    <Zap className="w-8 h-8 text-emerald-500" />
                                </div>
                                <p className="text-sm font-bold uppercase text-slate-400 tracking-wider">You Sell Surplus</p>
                                <div className="my-2">
                                    <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">8</span>
                                    <span className="text-lg font-bold text-slate-500 ml-1">TKN</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Per kWh exported to Grid</p>
                            </div>

                            {/* Grid Price */}
                            <div className="relative z-10 bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/20 shadow-lg text-center scale-110">
                                <div className="mb-4 inline-flex p-4 bg-emerald-500 rounded-full shadow-lg">
                                    <Building className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-sm font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Grid Operations</p>
                                <div className="my-2">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">4</span>
                                    <span className="text-lg font-bold text-slate-500 ml-1">TKN</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">State Margin & Maintenance</p>
                            </div>

                            {/* Sell Price */}
                            <div className="relative z-10 bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="mb-4 inline-flex p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                                    <TrendingUp className="w-8 h-8 text-blue-500" />
                                </div>
                                <p className="text-sm font-bold uppercase text-slate-400 tracking-wider">Grid Sells Energy</p>
                                <div className="my-2">
                                    <span className="text-4xl font-black text-blue-600 dark:text-blue-400">12</span>
                                    <span className="text-lg font-bold text-slate-500 ml-1">TKN</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Per kWh bought from Grid</p>
                            </div>
                        </div>

                        <div className="mt-12 bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-start gap-4">
                            <Coins className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Why this margin?</h4>
                                <p className="text-emerald-800 dark:text-emerald-400 text-sm mt-1">
                                    The <strong>4 Token margin</strong> funds the entire transmission infrastructure, the free software deployment, and the grid maintenance. This ensures the system remains self-sustaining without external tax burdens.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Value Proposition Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Free Software */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Zero-Cost Infrastructure</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            State Administration provides the full IoT and AI software stack <strong>completely free of charge</strong>. No license fees, no installation costs. We lower the barrier to entry for every campus.
                        </p>
                    </div>

                    {/* State Governance */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">State Governance</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            The entire ecosystem is monitored by the State Admin Dashboard. This centralized oversight ensures fair play, transparent auditing, and rapid dispute resolution.
                        </p>
                    </div>

                    {/* PPA */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <FileSignature className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Exclusive PPA</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            Campuses sign a <strong>Power Purchase Agreement (PPA)</strong> mandating that all surplus energy must be sold exclusively to the Government Grid at the standardized token rate.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
