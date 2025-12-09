'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Coins, Smartphone, Trophy, Search, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface StudentLog {
    id: string;
    phone_number: string;
    student_name?: string; // Optional (older logs might be null)
    energy_used: number;
    tokens_earned: number;
    created_at: string;
}

interface StudentAggregation {
    phone_number: string;
    student_name: string;
    total_energy: number;
    total_tokens: number;
    session_count: number;
}

export default function StudentEngagementPage() {
    const [logs, setLogs] = useState<StudentLog[]>([]);
    const [aggregatedData, setAggregatedData] = useState<StudentAggregation[]>([]);
    const [loading, setLoading] = useState(true);
    const [simLoading, setSimLoading] = useState(false);

    // Simulation Form State
    const [phoneInput, setPhoneInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [energyInput, setEnergyInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Filter
    const [searchQuery, setSearchQuery] = useState('');

    const VOUCHER_THRESHOLD = 100; // Tokens needed for a voucher

    // Fetch Data
    const fetchData = async () => {
        try {
            // Get Campus ID from localStorage (User Session)
            const storedSession = localStorage.getItem("sessionUser");
            if (!storedSession) return;
            const user = JSON.parse(storedSession);
            const campusId = user?.id;

            if (!campusId) return;

            const res = await fetch(`/api/campusAdmin/student-engagement?campus_id=${campusId}`);
            if (res.ok) {
                const data: StudentLog[] = await res.json();
                setLogs(data);
                aggregateData(data);
            }
        } catch (e) {
            console.error("Failed to fetch logs", e);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Aggregate Data by Phone Number
    const aggregateData = (data: StudentLog[]) => {
        const map = new Map<string, StudentAggregation>();

        // Sort by date desc so we see latest name first if needed, 
        // effectively we just accumulate
        data.forEach(log => {
            const existing = map.get(log.phone_number) || {
                phone_number: log.phone_number,
                student_name: log.student_name || 'Unknown',
                total_energy: 0,
                total_tokens: 0,
                session_count: 0
            };

            // Update name if current log has one and existing is default 'Unknown'
            // OR if this log is newer (assuming data is sorted desc by default from API)
            if (log.student_name && existing.student_name === 'Unknown') {
                existing.student_name = log.student_name;
            }

            existing.total_energy += log.energy_used;
            existing.total_tokens += log.tokens_earned;
            existing.session_count += 1;

            map.set(log.phone_number, existing);
        });

        setAggregatedData(Array.from(map.values()));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Simulate Hardware Event
    const handleSimulate = async () => {
        if (!phoneInput || !energyInput || !nameInput) {
            setError("Please fill in all fields (Name, Phone, Energy)");
            return;
        }

        setSimLoading(true);
        setError(null);

        try {
            // Get Campus ID from localStorage (User Session)
            const storedSession = localStorage.getItem("sessionUser");
            if (!storedSession) {
                setError("User session not found. Please re-login.");
                return;
            }
            const user = JSON.parse(storedSession);
            const campusId = user?.id;

            const res = await fetch('/api/campusAdmin/student-engagement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campus_admin_id: campusId,
                    phone_number: phoneInput,
                    student_name: nameInput,
                    energy_used: parseFloat(energyInput)
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to simulate charging session");
            }

            // Success
            setPhoneInput('');
            setNameInput('');
            setEnergyInput('');
            fetchData(); // Refresh table

        } catch (err: any) {
            setError(err.message);
        } finally {
            setSimLoading(false);
        }
    };

    const filteredData = aggregatedData.filter(d =>
        d.phone_number.includes(searchQuery) ||
        d.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-slate-950">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center gap-3">
                        <Smartphone className="w-10 h-10 text-emerald-500" />
                        Student Engagement
                    </h1>
                    <p className="text-slate-500 mt-2">Track Eco-Charging sessions and reward green behavior.</p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-sm">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">1 kWh = 10 Tokens</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Simulation Form */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-0 shadow-lg bg-white dark:bg-slate-900/50 backdrop-blur-sm sticky top-8">
                        <CardHeader className="bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-t-xl">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Zap className="w-5 h-5 text-blue-500" />
                                Simulate Charging
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Student Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g John Doe"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Student Phone Number</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        placeholder="e.g 9876543210"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Energy Consumed (kWh)</label>
                                <div className="relative">
                                    <Zap className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        placeholder="e.g 1.5"
                                        step="0.1"
                                        value={energyInput}
                                        onChange={(e) => setEnergyInput(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-xs flex items-center gap-1 bg-red-50 p-2 rounded">
                                    <AlertCircle className="w-3 h-3" /> {error}
                                </div>
                            )}

                            <Button
                                onClick={handleSimulate}
                                disabled={simLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {simLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simulate Session"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Data Table */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-0 shadow-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <Card className="border-0 shadow-lg bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Student Name</th>
                                        <th className="p-4 font-semibold">Phone</th>
                                        <th className="p-4 font-semibold text-center">Sessions</th>
                                        <th className="p-4 font-semibold text-center">Total Energy</th>
                                        <th className="p-4 font-semibold text-center">Green Points</th>
                                        <th className="p-4 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-400">
                                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                Loading records...
                                            </td>
                                        </tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-400">
                                                No records found. Start simulating charging sessions!
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((data, index) => {
                                            const isVoucherEligible = data.total_tokens >= VOUCHER_THRESHOLD;

                                            return (
                                                <motion.tr
                                                    key={data.phone_number}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                                                        {data.student_name}
                                                    </td>

                                                    <td className="p-4 text-center text-slate-500">
                                                        {data.session_count}
                                                    </td>
                                                    <td className="p-4 text-center font-medium">
                                                        {data.total_energy.toFixed(2)} kWh
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 rounded-md font-bold">
                                                            <Coins className="w-3 h-3" />
                                                            {data.total_tokens}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {isVoucherEligible ? (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-sm text-xs font-bold animate-pulse">
                                                                    <Trophy className="w-3 h-3" />
                                                                    Voucher Unlocked!
                                                                </div>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                                                                    title="Send via WhatsApp"
                                                                    onClick={() => {
                                                                        const text = `Congratulations! You have reached ${data.total_tokens} Green Points and unlocked a 10% Discount Voucher for the Campus Store.`;
                                                                        window.open(`https://wa.me/${data.phone_number}?text=${encodeURIComponent(text)}`, '_blank');
                                                                    }}
                                                                >
                                                                    <Smartphone className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-slate-400 font-medium">
                                                                {VOUCHER_THRESHOLD - data.total_tokens} to go
                                                            </div>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Threshold Info */}
                    <div className="flex justify-end">
                        <p className="text-xs text-slate-400 italic">
                            * Students unlock a store voucher upon reaching <strong>{VOUCHER_THRESHOLD} Green Points</strong>.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
