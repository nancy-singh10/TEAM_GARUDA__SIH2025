
export const dynamic = 'force-dynamic';
import React from 'react';
import { cookies } from 'next/headers';
import DigitalTwinContent from './DigitalTwinContent';

export default async function DigitalTwinPage() {
  const cookieStore = await cookies();
  const campusCookie = cookieStore.get('campus_admin_id');
  const adminId = campusCookie?.value;

  if (!adminId) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h1>
          <p className="text-slate-500 dark:text-slate-400">Please log in to access the Digital Twin.</p>
        </div>
      </div>
    );
  }

  return <DigitalTwinContent campus_id={adminId} />;
}