"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CampusSessionUser {
  id: number;
  username: string;
  campus_name?: string;
}

export default function CampusAdminDashboard() {
  const [user, setUser] = useState<CampusSessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sessionUser');
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Campus Admin Dashboard</h1>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Home</Link>
        </div>
        {user ? (
          <p className="text-slate-700 mb-6">Welcome, <span className="font-semibold">{user.username}</span>{user.campus_name && <> from <span className='font-semibold'>{user.campus_name}</span></>}.</p>
        ) : (
          <p className="text-slate-500 mb-6">No session found. Please <Link href="/campusAdmin/auth" className="text-blue-600 hover:underline">login</Link>.</p>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-slate-800 mb-2">Live Sources</h2>
            <p className="text-sm text-slate-600">(Placeholder) Real-time generation and consumption metrics.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-slate-800 mb-2">Storage & Batteries</h2>
            <p className="text-sm text-slate-600">(Placeholder) Battery charge status and health.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-slate-800 mb-2">Optimization Tips</h2>
            <p className="text-sm text-slate-600">(Placeholder) AI suggestions for load balancing.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

