'use client';

import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Settings, Activity } from 'lucide-react';

export default function TokenManagementPage() {
    const [loading, setLoading] = useState(true);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const [data, setData] = useState<any>(null);
    const [buyRate, setBuyRate] = useState(1.0); // Energy -> Token
    const [sellRate, setSellRate] = useState(1.0); // Token -> Energy
    const [updating, setUpdating] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/state-admin/tokens');
            const json = await res.json();
            if (json.error) {
                console.error(json.error);
                return;
            }
            setData(json);
            setBuyRate(json.settings.conversion_rate_energy_to_token);
            setSellRate(json.settings.conversion_rate_token_to_energy);
        } catch {
            console.error("Error fetching tokens data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateRates = async () => {
        setUpdating(true);
        try {
            await fetch('/api/state-admin/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversion_rate_energy_to_token: buyRate,
                    conversion_rate_token_to_energy: sellRate
                })
            });
            alert('Rates updated successfully!');
            fetchData(); // Refresh
        } catch {
            alert('Failed to update rates');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8">Loading Token System...</div>;

    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-yellow-500 rounded-xl text-white">
                        <Coins size={28} />
                    </div>
                    Token Economy
                </h1>
                <p className="text-slate-500 mt-2">Manage the energy credit system and conversion rates.</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Circulation</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {Number(data?.analytics?.totalTokens || 0).toLocaleString()} <span className="text-sm font-normal text-slate-400">TKN</span>
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Wallets</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {data?.analytics?.walletCount || 0}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Rate Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Settings className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Conversion Rates</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Reward Rate (Tokens earned per 1 kWh Sold)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={buyRate}
                                    onChange={(e) => setBuyRate(parseFloat(e.target.value))}
                                    className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                                <span className="text-sm font-medium text-slate-500">TKN / kWh</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Purchase Cost (Tokens needed to buy 1 kWh)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={sellRate}
                                    onChange={(e) => setSellRate(parseFloat(e.target.value))}
                                    className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                                <span className="text-sm font-medium text-slate-500">TKN / kWh</span>
                            </div>
                        </div>

                        <button
                            onClick={handleUpdateRates}
                            disabled={updating}
                            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {updating ? 'Updating...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Network Activity</h2>
                    </div>

                    <div className="space-y-4">
                        {data?.recentTransactions?.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No transactions yet.</p>
                        ) : (
                            data?.recentTransactions?.map((tx: any) => (
                                <div key={tx.transaction_id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${tx.type === 'MINT_REWARD' ? 'bg-green-100 text-green-700' :
                                                tx.type === 'BURN_PURCHASE' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {tx.type.replace('_', ' ').toLowerCase()}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                                            {tx.token_wallets?.campus_admin?.campus_name || 'Unknown Campus'}
                                        </p>
                                    </div>
                                    <div className={`text-right font-mono font-bold ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {Number(tx.amount) > 0 ? '+' : ''}{Number(tx.amount).toFixed(2)} TKN
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
