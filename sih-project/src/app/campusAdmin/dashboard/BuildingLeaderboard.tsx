"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Coins } from 'lucide-react';

type Building = {
    id: string;
    name: string;
    base_load: number;
    tokens: number;
};

export default function BuildingLeaderboard({ buildings }: { buildings: Building[] }) {
    // Sort by tokens (highest first)
    const sortedBuildings = [...buildings].sort((a, b) => b.tokens - a.tokens);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Eco-Champions Leaderboard</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Top performing buildings by energy efficiency tokens</p>
                </div>
            </div>

            <div className="space-y-4">
                {sortedBuildings.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No buildings found. Add them in Digital Twin.</div>
                ) : (
                    sortedBuildings.map((building, index) => (
                        <motion.div
                            key={building.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                  w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                                        index === 1 ? 'bg-slate-200 text-slate-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-100 text-slate-500'}
                `}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 dark:text-white">{building.name}</div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            {building.base_load} kW Load
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg font-bold text-sm">
                                <Coins className="w-4 h-4" />
                                {building.tokens}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
