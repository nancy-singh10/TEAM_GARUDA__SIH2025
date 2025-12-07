'use client';

import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle, Users } from 'lucide-react';

export default function BroadcastPage() {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'info' | 'warning' | 'alert'>('info');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            // Get sender ID from cookie or local storage (similar to HeaderState)
            // For now, we'll try to get it from localStorage as fallback or assume it's handled by the API/session
            // In a real app, this should come from a robust auth context.
            // Using a placeholder or fetching from localStorage if available.
            let senderId = 'state_admin'; // Default fallback
            if (typeof window !== 'undefined') {
                const sessionStr = localStorage.getItem('stateSessionUser');
                if (sessionStr) {
                    const sessionUser = JSON.parse(sessionStr);
                    senderId = sessionUser.state_admin_id || sessionUser.username || 'state_admin';
                }
            }

            const response = await fetch('/api/messages/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_id: senderId,
                    message,
                    type,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.details ? `${data.error}: ${JSON.stringify(data.details)}` : (data.error || 'Failed to send broadcast');
                throw new Error(errorMsg);
            }

            setStatus({ type: 'success', message: `Successfully sent to ${data.count} campus admins!` });
            setMessage('');
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-500" />
                    Broadcast Message
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Send a notification to all Campus Admins simultaneously.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <form onSubmit={handleBroadcast} className="space-y-6">

                    {/* Message Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Message Type
                        </label>
                        <div className="flex gap-4">
                            {(['info', 'warning', 'alert'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors border ${type === t
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Input */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Message Content
                        </label>
                        <textarea
                            id="message"
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                            }`}>
                            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <p className="font-medium">{status.message}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            Send Broadcast
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
