'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sun, Wind, Battery, Zap, ArrowRight } from 'lucide-react';

type TopMetricsProps = {
  solar_kw: number;
  wind_kw: number;
  battery_percent: number;
  grid_kw: number;
};

export default function TopMetricsRow({ solar_kw, wind_kw, battery_percent, grid_kw }: TopMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Solar Card */}
      <Link href="/campusAdmin/solar">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 shadow border border-yellow-100 dark:border-yellow-800 cursor-pointer group relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-amber-600/0 group-hover:from-yellow-400/10 group-hover:to-amber-600/10 transition-all duration-300"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-amber-700 dark:text-amber-400">Solar Generation</div>
              <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-semibold text-amber-800 dark:text-amber-300 mt-3">{solar_kw} kW</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-amber-600 dark:text-amber-500">+12% from yesterday</div>
              <ArrowRight className="h-4 w-4 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Wind Card */}
      <Link href="/campusAdmin/wind">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-6 shadow border border-sky-100 dark:border-sky-800 cursor-pointer group relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-blue-600/0 group-hover:from-sky-400/10 group-hover:to-blue-600/10 transition-all duration-300"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-sky-700 dark:text-sky-400">Wind Generation</div>
              <Wind className="h-5 w-5 text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-semibold text-sky-800 dark:text-sky-300 mt-3">{wind_kw} kW</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-sky-600 dark:text-sky-500">Wind speed: 6.2 m/s</div>
              <ArrowRight className="h-4 w-4 text-sky-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Battery Card */}
      <Link href="/campusAdmin/battery">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 shadow border border-emerald-100 dark:border-emerald-800 cursor-pointer group relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-green-600/0 group-hover:from-emerald-400/10 group-hover:to-green-600/10 transition-all duration-300"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-emerald-700 dark:text-emerald-400">Battery Status</div>
              <Battery className="h-5 w-5 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-semibold text-emerald-800 dark:text-emerald-300 mt-3">{battery_percent}%</div>
            <div className="w-full bg-white/60 dark:bg-slate-800/60 rounded-full h-3 mt-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${battery_percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-3 bg-emerald-600 dark:bg-emerald-500"
              />
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-600 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        </motion.div>
      </Link>

      {/* Grid Card */}
      <Link href="/campusAdmin/grid">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-6 shadow border border-violet-100 dark:border-violet-800 cursor-pointer group relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-violet-400/0 to-purple-600/0 group-hover:from-violet-400/10 group-hover:to-purple-600/10 transition-all duration-300"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-violet-700 dark:text-violet-400">Grid Exchange</div>
              <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-semibold text-violet-800 dark:text-violet-300 mt-3">{grid_kw} kW</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-violet-600 dark:text-violet-500">Importing from grid</div>
              <ArrowRight className="h-4 w-4 text-violet-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}