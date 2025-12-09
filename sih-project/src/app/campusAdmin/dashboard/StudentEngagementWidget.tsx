'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone, Zap, ArrowRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface StudentAggregation {
    phone_number: string;
    student_name: string;
    total_energy: number;
    total_tokens: number;
    session_count: number;
}

export default function StudentEngagementWidget({ campus_id }: { campus_id: string }) {
    const [data, setData] = useState<StudentAggregation[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!campus_id) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/campusAdmin/student-engagement?campus_id=${campus_id}`);
                if (res.ok) {
                    const logs: any[] = await res.json();

                    // Aggregate Data
                    const map = new Map<string, StudentAggregation>();
                    logs.forEach(log => {
                        const existing = map.get(log.phone_number) || {
                            phone_number: log.phone_number,
                            student_name: log.student_name || 'Anonymous',
                            total_energy: 0,
                            total_tokens: 0,
                            session_count: 0
                        };

                        if (log.student_name && existing.student_name === 'Anonymous') {
                            existing.student_name = log.student_name;
                        }

                        existing.total_energy += log.energy_used;
                        existing.total_tokens += log.tokens_earned;
                        existing.session_count += 1;
                        map.set(log.phone_number, existing);
                    });

                    // Sort by Tokens (Desc) and take top 5
                    const sorted = Array.from(map.values())
                        .sort((a, b) => b.total_tokens - a.total_tokens)
                        .slice(0, 5);

                    setData(sorted);
                }
            } catch (error) {
                console.error("Failed to fetch student data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [campus_id]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Student Engagement</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Top Eco-Chargers</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 flex-grow">
                {loading ? (
                    <div className="text-center py-4 text-slate-400 text-sm">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-sm">No activations yet.</div>
                ) : (
                    data.map((student, i) => (
                        <motion.div
                            key={student.phone_number}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {i + 1}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {student.student_name}
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> {student.total_energy.toFixed(1)} kWh
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    {student.total_tokens} Pts
                                </div>
                                {student.total_tokens >= 100 && (
                                    <Trophy className="w-3 h-3 text-yellow-500 ml-auto mt-1" />
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <Button
                variant="outline"
                className="w-full mt-6 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => router.push('/campusAdmin/student-engagement')}
            >
                View Full Leaderboard
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    );
}
