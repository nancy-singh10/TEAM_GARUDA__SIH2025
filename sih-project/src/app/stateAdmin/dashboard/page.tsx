"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SessionUser {
  id: number;
  username: string;
}

export default function StateAdminDashboard() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sessionUser');
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">State Admin Dashboard</h1>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Home</Link>
        </div>
        {user ? (
          <p className="text-slate-700 mb-6">Welcome, <span className="font-semibold">{user.username}</span>.</p>
        ) : (
          <p className="text-slate-500 mb-6">No session found. Please <Link href="/stateAdmin/auth" className="text-blue-600 hover:underline">login</Link>.</p>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-slate-800 mb-2">Campuses</h2>
            <p className="text-sm text-slate-600">(Placeholder) List & management of registered campuses.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-slate-800 mb-2">Energy Overview</h2>
            <p className="text-sm text-slate-600">(Placeholder) Aggregated renewable sources performance.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-slate-800 mb-2">Alerts</h2>
            <p className="text-sm text-slate-600">(Placeholder) System alerts & optimization suggestions.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

