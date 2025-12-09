
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    Package,
    Zap,
    Building2,
    Wallet
} from 'lucide-react';

interface StoreItem {
    id: string;
    name: string;
    description: string;
    token_cost: number;
    category: string;
    image_url?: string;
}

interface BlockRequest {
    id: string;
    block_identifier: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at: string;
    store_items: {
        name: string;
        token_cost: number;
        image_url?: string;
    };
}

interface StoreContentProps {
    campusAdminId: string;
    initialBalance: number;
}

export default function StoreContent({ campusAdminId, initialBalance }: StoreContentProps) {
    const [activeTab, setActiveTab] = useState<'requests' | 'catalog'>('requests');
    const [requests, setRequests] = useState<BlockRequest[]>([]);
    const [items, setItems] = useState<StoreItem[]>([]);
    const [balance, setBalance] = useState(initialBalance);
    const [loading, setLoading] = useState(false);

    // For simulating a request
    const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
    const [blockName, setBlockName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchItems();
        fetchRequests();
    }, []);

    const fetchItems = async () => {
        const res = await fetch('/api/campusAdmin/store/items');
        if (res.ok) setItems(await res.json());
    };

    const fetchRequests = async () => {
        const res = await fetch(`/api/campusAdmin/store/requests?campusAdminId=${campusAdminId}`);
        if (res.ok) setRequests(await res.json());
    };

    const handleSimulateRequest = async () => {
        if (!selectedItem || !blockName) return;
        setLoading(true);
        try {
            const res = await fetch('/api/campusAdmin/store/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campusAdminId,
                    itemId: selectedItem.id,
                    blockIdentifier: blockName
                })
            });
            if (res.ok) {
                setIsModalOpen(false);
                setBlockName('');
                setSelectedItem(null);
                fetchRequests();
                setActiveTab('requests'); // Switch to requests tab to see it
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId: string, cost: number) => {
        if (balance < cost) {
            alert("Insufficient Token Balance!");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/campusAdmin/store/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, campusAdminId })
            });

            if (res.ok) {
                setBalance(prev => prev - cost);
                // Optimistic update
                setRequests(prev => prev.map(r =>
                    r.id === requestId ? { ...r, status: 'APPROVED' } : r
                ));
            } else {
                alert("Failed to approve request");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                        Campus Store
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage infrastructure requests from blocks and departments.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-900/30 ring-1 ring-black/5">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                        <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Token Balance</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                            {balance.toLocaleString()} TKN
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'requests'
                        ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    Requests Queue
                    {requests.filter(r => r.status === 'PENDING').length > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                            {requests.filter(r => r.status === 'PENDING').length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('catalog')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'catalog'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                >
                    <ShoppingCart className="w-4 h-4" />
                    Item Catalog
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'requests' ? (
                    <motion.div
                        key="requests"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid gap-4"
                    >
                        {requests.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No requests found</h3>
                                <p className="text-slate-500 dark:text-slate-400">Go to the Catalog tab to simulate a new request.</p>
                            </div>
                        )}

                        {requests.map((req) => (
                            <div key={req.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${req.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                                        req.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                                            'bg-red-100 dark:bg-red-900/30 text-red-600'
                                        }`}>
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{req.store_items?.name || "Unknown Item"}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">Requested by:</span>
                                            <span className="text-sm font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                                                {req.block_identifier}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">ID: {req.id}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-end md:items-center gap-6 w-full md:w-auto">
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Cost</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">{req.store_items?.token_cost} TKN</p>
                                    </div>

                                    {req.status === 'PENDING' ? (
                                        <div className="flex gap-2 w-full md:w-auto">
                                            {/* <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium">
                        Reject
                      </button> */}
                                            <button
                                                onClick={() => handleApprove(req.id, req.store_items.token_cost)}
                                                disabled={loading || balance < req.store_items.token_cost}
                                                className="flex-1 md:flex-none px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-emerald-600/20"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-medium border flex items-center gap-1.5 ${req.status === 'APPROVED'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                                            }`}>
                                            {req.status === 'APPROVED' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            {req.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="catalog"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {items.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group">
                                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative">
                                    {item.image_url ? (
                                        <div className="w-full h-full relative">
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    ) : (
                                        <Zap className="w-16 h-16 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300" />
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm z-10">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10 line-clamp-2">{item.description}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {item.token_cost} <span className="text-sm font-normal text-slate-500">TKN</span>
                                        </span>
                                        <button
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                                        >
                                            Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Simulate Request Modal */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700"
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Request {selectedItem.name}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Simulate a request coming from a specific block or department.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Block / Department Name
                                </label>
                                <input
                                    type="text"
                                    value={blockName}
                                    onChange={(e) => setBlockName(e.target.value)}
                                    placeholder="e.g. Hostel Block A"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Cost</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedItem.token_cost} TKN</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSimulateRequest}
                                disabled={!blockName || loading}
                                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
