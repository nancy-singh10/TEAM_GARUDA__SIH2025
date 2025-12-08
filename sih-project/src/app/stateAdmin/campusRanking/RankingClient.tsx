'use client';

import { useState, useEffect } from 'react';
import { Trophy, Zap, Calendar, Award, MessageSquare, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CampusRanking = {
    campus_admin_id: string;
    campus_name: string;
    admin_name: string;
    location: string;
    monthly_tokens: number;
    overall_tokens: number;
};

export default function RankingClient({ initialRankings }: { initialRankings: CampusRanking[] }) {
    // Default to 'overall' to show current balance by default (matching user expectation)
    const [activeTab, setActiveTab] = useState<'monthly' | 'overall'>('overall');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState<CampusRanking | null>(null);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const cookieId = getCookie('state_admin_id');
        if (cookieId) {
            setCurrentAdminId(cookieId);
        } else {
            try {
                const session = localStorage.getItem('stateSessionUser');
                if (session) {
                    const user = JSON.parse(session);
                    if (user.state_admin_id) setCurrentAdminId(user.state_admin_id);
                }
            } catch { }
        }
    }, []);

    const handleOpenModal = (campus: CampusRanking) => {
        setSelectedCampus(campus);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCampus(null);
        setMessage('');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampus || !currentAdminId) return;

        setSending(true);
        try {
            const res = await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_id: currentAdminId,
                    recipient_id: selectedCampus.campus_admin_id,
                    message,
                    type: 'info'
                })
            });

            if (res.ok) {
                alert('Message sent successfully!');
                handleCloseModal();
            } else {
                alert('Failed to send message');
            }
        } catch (error) {
            console.error(error);
            alert('Error sending message');
        } finally {
            setSending(false);
        }
    };

    // Sort based on active tab
    const sortedRankings = [...initialRankings].sort((a, b) => {
        if (activeTab === 'monthly') {
            return b.monthly_tokens - a.monthly_tokens;
        }
        return b.overall_tokens - a.overall_tokens;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 relative">
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
                            onClick={() => setActiveTab('overall')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'overall'
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Award className="w-4 h-4" />
                            Current Balance
                        </button>
                        <button
                            onClick={() => setActiveTab('monthly')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'monthly'
                                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            Monthly Earned
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
                            Sorted by {activeTab === 'monthly' ? 'Monthly Rewards' : 'Current Balance'}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4 w-20 text-center">Rank</th>
                                    <th className="px-6 py-4">Campus Details</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Administrator</th>
                                    <th className="px-6 py-4 text-right">
                                        {activeTab === 'monthly' ? 'Monthly Earned' : 'Current Balance'}
                                    </th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {sortedRankings.map((campus, index) => (
                                    <motion.tr
                                        key={campus.campus_admin_id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-center">
                                            {index < 3 ? (
                                                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-white shadow-md ${index === 0 ? 'bg-amber-400 shadow-amber-400/40' :
                                                        index === 1 ? 'bg-slate-400 shadow-slate-400/40' :
                                                            'bg-orange-400 shadow-orange-400/40' // Bronze
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-slate-500 dark:text-slate-400">
                                                    #{index + 1}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {campus.campus_name}
                                                    {index === 0 && <span className="text-amber-400"><Trophy className="w-3 h-3 fill-current" /></span>}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <span className="opacity-75">{campus.location}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    {campus.admin_name?.[0] || 'A'}
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">{campus.admin_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <Zap className={`w-3.5 h-3.5 ${activeTab === 'monthly' ? 'text-indigo-500' : 'text-emerald-500'}`} />
                                                <span className={`font-bold font-mono ${activeTab === 'monthly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                    {activeTab === 'monthly' ? campus.monthly_tokens : campus.overall_tokens}
                                                </span>
                                                <span className="text-xs font-medium text-slate-400">TKN</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleOpenModal(campus)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                title="Send Message"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Message Modal */}
            <AnimatePresence>
                {isModalOpen && selectedCampus && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-blue-500" />
                                    Message Admin
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">Recipient</label>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                                            {selectedCampus.admin_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedCampus.admin_name}</p>
                                            <p className="text-xs text-slate-500">{selectedCampus.campus_name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                                        placeholder="Type your message here..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={sending || !message.trim()}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {sending ? (
                                            <>Converting...</>
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
