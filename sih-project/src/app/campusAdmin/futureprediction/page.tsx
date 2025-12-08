
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Wind, IndianRupee, Calendar as CalendarIcon, Loader2, TrendingUp } from 'lucide-react';

import { SimpleCalendar } from "@/components/ui/simple-calendar";

export default function FuturePredictionPage() {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Date Constraints
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const maxDate = nextYear.toISOString().split('T')[0];

    const handlePredict = async () => {
        if (!selectedDate) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`/api/campusAdmin/prediction?date=${selectedDate}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch prediction');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">

            {/* Header */}
            <div className="animate-in slide-in-from-top-4 fade-in duration-700">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center gap-3">
                    <TrendingUp className="w-10 h-10 text-emerald-500" />
                    Future Prediction
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl">
                    Leverage our AI-driven forecast engine to predict renewal generation and potential savings.
                    <span className="block text-sm mt-1 opacity-70 italic">Powered by 3-year historical dataset analysis.</span>
                </p>
            </div>

            {/* Control Panel */}
            <Card className="max-w-xl border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl bg-white/50 dark:bg-slate-900/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20 animate-in slide-in-from-left-4 fade-in duration-700 delay-150 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                <CardHeader>
                    <CardTitle className="text-xl">Select Prediction Target</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-end relative">
                        <div className="flex-1 space-y-2 w-full relative">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Date (Next 12 Months)</label>

                            {/* Custom Date Picker Trigger */}
                            <button
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                className="w-full h-12 rounded-xl border border-slate-300/50 bg-white/80 px-4 flex items-center justify-between text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-white transition-all shadow-sm hover:border-emerald-400/50"
                            >
                                <span className={selectedDate ? "text-slate-900 dark:text-white font-medium" : "text-slate-400"}>
                                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : "Pick a date..."}
                                </span>
                                <CalendarIcon className="w-5 h-5 text-slate-400" />
                            </button>

                            {/* Calendar Popup */}
                            {isCalendarOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsCalendarOpen(false)} />
                                    <div className="absolute top-full mt-2 left-0 z-20 animate-in zoom-in-95 fade-in duration-200">
                                        <SimpleCalendar
                                            value={selectedDate ? new Date(selectedDate) : undefined}
                                            minDate={new Date(minDate)}
                                            maxDate={new Date(maxDate)}
                                            onChange={(date) => {
                                                // Convert to YYYY-MM-DD for consistency
                                                // Adjust for timezone offset to avoid previous day bug
                                                // Use local date parts
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const day = String(date.getDate()).padStart(2, '0');
                                                setSelectedDate(`${year}-${month}-${day}`);
                                                setIsCalendarOpen(false);
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <Button
                            onClick={handlePredict}
                            disabled={!selectedDate || loading}
                            className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Generate</span>}
                        </Button>
                    </div>
                    {error && (
                        <div className="p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm animate-in zoom-in-95 fade-in">
                            ⚠️ {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results Grid */}
            {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Solar Card */}
                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-100">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <Sun className="w-32 h-32 text-orange-500" />
                        </div>
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center justify-between">
                                Solar Potential
                                <Sun className="h-5 w-5" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                    {result.solar.toFixed(0)}
                                </span>
                                <span className="text-lg font-medium text-slate-500 dark:text-slate-400">kWh</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[70%] rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                High Confidence Forecast
                            </p>
                        </CardContent>
                    </Card>

                    {/* Wind Card */}
                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-200">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-700">
                            <Wind className="w-32 h-32 text-blue-500" />
                        </div>
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center justify-between">
                                Wind Potential
                                <Wind className="h-5 w-5" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {result.wind.toFixed(0)}
                                </span>
                                <span className="text-lg font-medium text-slate-500 dark:text-slate-400">kWh</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[45%] rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Moderate Confidence
                            </p>
                        </CardContent>
                    </Card>

                    {/* Savings Card */}
                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-300">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-15 transition-opacity transform group-hover:scale-125 duration-500">
                            <IndianRupee className="w-32 h-32 text-emerald-500" />
                        </div>
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                                Projected Savings
                                <IndianRupee className="h-5 w-5" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500 group-hover:to-emerald-400 transition-all">
                                    ₹{result.costSaved.toFixed(0)}
                                </span>
                            </div>
                            <div className="mt-4 px-3 py-1.5 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-lg inline-flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">ROI Potential</span>
                                <span className="text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm text-slate-600 dark:text-slate-400">High</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
