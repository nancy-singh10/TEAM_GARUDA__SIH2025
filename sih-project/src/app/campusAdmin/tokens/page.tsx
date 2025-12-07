'use client';

import React, { useState, useEffect } from 'react';
import { Coins, Zap, History, ArrowRight, Wallet } from 'lucide-react';

export default function TokenWalletPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [redeemAmount, setRedeemAmount] = useState<number | ''>('');
    const [processing, setProcessing] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/campus-admin/tokens');
            const json = await res.json();
            if (json.error) return; // Handle error
            setData(json);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBuyEnergy = async () => {
        if (!redeemAmount || Number(redeemAmount) <= 0) return;

        setProcessing(true);
        try {
            const res = await fetch('/api/campus-admin/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'BUY_ENERGY',
                    amount_energy: Number(redeemAmount),
                    amount_tokens: 0 // Backend calculates this
                })
            });

            const json = await res.json();
            if (json.error) {
                alert(json.error);
            } else {
                alert(`Successfully purchased ${redeemAmount} kWh!`);
                setRedeemAmount('');
                fetchData();
            }
        } catch (e) {
            alert('Transaction failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-8">Loading Wallet...</div>;

    const balance = Number(data?.wallet?.balance || 0);
    const tokenToEnergyRate = Number(data?.rates?.conversion_rate_token_to_energy || 1);
    const maxEnergy = balance / tokenToEnergyRate;

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-xl text-white">
                            <Wallet size={28} />
                        </div>
                        Green Token Wallet
                    </h1>
                    <p className="text-slate-500 mt-2">Earn tokens by selling surplus energy, use them to buy back power.</p>
                </div>

                <div className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl shadow-lg flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                        <Coins size={32} />
                    </div>
                    <div>
                        <p className="text-yellow-100 text-sm font-medium uppercase tracking-wider">Current Balance</p>
                        <h3 className="text-3xl font-bold">{balance.toFixed(2)} TKN</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Redemption Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Zap className="text-emerald-500" />
                        Redeem for Energy
                    </h2>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">Current Rate</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{tokenToEnergyRate} TKN = 1 kWh</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Maximum Purchase</span>
                            <span className="font-bold text-emerald-600">{maxEnergy.toFixed(2)} kWh</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Amount to Buy (kWh)
                            </label>
                            <input
                                type="number"
                                value={redeemAmount}
                                onChange={(e) => setRedeemAmount(Number(e.target.value))}
                                placeholder="0.0"
                                className="w-full p-4 text-lg bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                            />
                        </div>

                        {redeemAmount && Number(redeemAmount) > 0 && (
                            <div className="flex items-center justify-between text-sm px-2">
                                <span className="text-slate-500">Cost in Tokens</span>
                                <span className="font-bold text-orange-500">{(Number(redeemAmount) * tokenToEnergyRate).toFixed(2)} TKN</span>
                            </div>
                        )}

                        <button
                            onClick={handleBuyEnergy}
                            disabled={processing || !redeemAmount || Number(redeemAmount) > maxEnergy}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 dark:shadow-none hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {processing ? 'Processing...' : 'Confirm Purchase'}
                        </button>
                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <History className="text-slate-400" />
                        Transaction History
                    </h2>

                    <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {data?.transactions?.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Coins size={48} className="mb-4 opacity-20" />
                                <p>No transactions yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data?.transactions?.map((tx: any) => (
                                    <div key={tx.transaction_id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${tx.type === 'MINT_REWARD' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                {tx.type === 'MINT_REWARD' ? <ArrowRight className="rotate-[-45deg]" size={20} /> : <Zap size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                                    {tx.type === 'MINT_REWARD' ? 'Energy Sold Reward' : 'Energy Purchase'}
                                                </p>
                                                <p className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                                            {Number(tx.amount) > 0 ? '+' : ''}{Number(tx.amount).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
