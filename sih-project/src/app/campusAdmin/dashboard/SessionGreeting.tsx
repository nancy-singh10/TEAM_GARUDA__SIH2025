"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  id?: number;
  username?: string;
  campus_name?: string;
};

export default function SessionGreeting() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sessionUser');
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  if (!user) {
    return (
      <p className="text-slate-500 dark:text-slate-400 mb-4">No session found. Please <Link href="/campusAdmin/auth" className="text-blue-600 dark:text-blue-400 hover:underline">login</Link>.</p>
    );
  }

  return (
    <p className="text-slate-700 dark:text-slate-300 mb-4">Welcome back, <span className="font-semibold text-slate-900 dark:text-white">{user.username}</span>{user.campus_name && <> from <span className='font-semibold text-slate-900 dark:text-white'>{user.campus_name}</span></>}.</p>
  );
}
