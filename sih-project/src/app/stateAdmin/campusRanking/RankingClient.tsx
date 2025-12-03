'use client';

import { useState } from 'react';
import { Trophy, TrendingUp, Zap, Calendar, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CampusRanking = {
    campus_admin_id: string;
    campus_name: string;
    location: string;
    admin_name: string;
    monthly_tokens: number;
    overall_tokens: number;
};

export default function RankingClient({ initialRankings }: { initialRankings: CampusRanking[] }) {
    const [activeTab, setActiveTab] = useState<'monthly' | 'overall'>('monthly');

    // Sort based on active tab
    const sortedRankings = [...initialRankings].sort((a, b) => {
        if (activeTab === 'monthly') {
            return b.monthly_tokens - a.monthly_tokens;
        }
        return b.overall_tokens - a.overall_tokens;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Campus Leaderboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Track energy efficiency and token earnings across campuses</p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 shadow-sm">
                        <button
                            onClick={() => setActiveTab('monthly')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'monthly'
                                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            Monthly Ranking
                        </button>
                        <button
                            onClick={() => setActiveTab('overall')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'overall'
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Award className="w-4 h-4" />
                            Overall Ranking
                        </button>
                    </div>
                </div>

                {/* Leaderboard Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className={`w-5 h-5 ${activeTab === 'monthly' ? 'text-indigo-500' : 'text-emerald-500'} fill-current`} />
                            Top Performing Campuses
                        </h2>
                        <div className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            Sorted by {activeTab === 'monthly' ? 'Monthly' : 'Lifetime'} Tokens
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-20 text-center">Rank</th>
                                    <th className="px-6 py-4">Campus Details</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Administrator</th>
                                    <th className="px-6 py-4 text-right">
                                        {activeTab === 'monthly' ? 'Monthly Tokens' : 'Total Tokens'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <AnimatePresence mode="popLayout">
                                    {sortedRankings.map((campus, index) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            key={campus.campus_admin_id}
                                            className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-center">
                                                <div className={`
                          mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm
                          ${index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 ring-2 ring-yellow-500/20' :
                                                        index === 1 ? 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 ring-2 ring-slate-500/20' :
                                                            index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 ring-2 ring-orange-500/20' :
                                                                'text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50'}
                        `}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {campus.campus_name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                        {campus.location}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-500">
                                                        {campus.admin_name?.[0] || 'A'}
                                                    </div>
                                                    {campus.admin_name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className={`inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-lg text-sm ${activeTab === 'monthly'
                                                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                                        : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                                                    }`}>
                                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                                    {activeTab === 'monthly'
                                                        ? campus.monthly_tokens.toLocaleString()
                                                        : campus.overall_tokens.toLocaleString()
                                                    }
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>

                                {sortedRankings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            No campuses found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
