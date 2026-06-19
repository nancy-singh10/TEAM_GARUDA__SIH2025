"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ModeToggle } from "./components/ModeToggle";
import { ArrowRight, BarChart3, Zap, Leaf } from "lucide-react";
import { Windmill } from "../components/Windmill";
import { MorphingSun } from "../components/MorphingSun";
import { FloatingIsland } from "../components/FloatingIsland";
import { WindLines } from "../components/WindLines";
import { TypewriterText } from "../components/TypewriterText";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500 overflow-hidden">

      {/* Surreal Anti-Gravity Scene */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-[1000px]">

        {/* Void Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-black pointer-events-none" />

        {/* Morphing Sun (Energy Nexus) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.2 }}
          className="absolute top-[10%] left-[50%] -translate-x-1/2 z-0"
        >
          <MorphingSun />
        </motion.div>

        {/* Wind Lines (Digital Flow) */}
        <div className="absolute inset-0 z-0 opacity-40">
          <WindLines />
        </div>

        {/* Floating Island 1 (Left - Foreground) */}
        <div className="absolute top-[40%] left-[5%] z-20">
          <FloatingIsland width={280} delay={0}>
            <Windmill duration={15} className="w-48 h-48 -mt-24" />
          </FloatingIsland>
        </div>

        {/* Floating Island 2 (Right - Midground) */}
        <div className="absolute top-[30%] right-[10%] z-10 scale-75 blur-[1px]">
          <FloatingIsland width={200} delay={2}>
            <Windmill duration={8} className="w-32 h-32 -mt-16 rotate-12" />
          </FloatingIsland>
        </div>

        {/* Floating Island 3 (Bottom Center - Huge) */}
        <div className="absolute -bottom-20 left-[30%] z-30 scale-125">
          <FloatingIsland width={400} delay={4}>
            {/* No windmill, maybe just a platform */}
          </FloatingIsland>
        </div>

        {/* Floating Island 4 (Upside Down - Surprise) */}
        <motion.div
          className="absolute top-10 right-[20%] z-0 opacity-50"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <div className="rotate-180 grayscale opacity-40">
            <FloatingIsland width={150} delay={1}>
              <Windmill duration={20} className="w-24 h-24 -mt-12" />
            </FloatingIsland>
          </div>
        </motion.div>

        {/* Floating Debris/Rocks */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-slate-700/50 rounded-full"
            style={{
              left: `${(i * 17 + 10) % 90}%`,
              top: `${(i * 23 + 15) % 90}%`
            }}
            animate={{ y: [0, -50, 0], rotate: 360 }}
            transition={{ duration: 10 + (i % 10), repeat: Infinity }}
          />
        ))}

      </div>

      {/* Navbar / Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">GARUDA</span>
        </div>
        <ModeToggle />
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50">
            🚀 Next Gen Campus Energy Management
          </div>

          <div className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6 drop-shadow-sm flex flex-col items-center">
            <TypewriterText text="Revolutionize Your" delay={0.5} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 mt-2">
              <TypewriterText text="Energy Ecosystem" delay={1.5} />
            </span>
          </div>

          <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transform your campus into a smart energy hub with real-time monitoring, AI-driven predictive analytics, and automated optimization.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/stateAdmin/auth"
              className="group inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              State Admin Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/campusAdmin/auth"
              className="group inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-full font-semibold shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-200"
            >
              Campus Admin Access
            </Link>
          </div>
        </motion.section>

        {/* Cards */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.article variants={item} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 hover:shadow-lg">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Real-Time Monitoring</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Track solar, wind, battery, and grid usage with live data visualization and instant alerts.
            </p>
          </motion.article>

          <motion.article variants={item} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:shadow-lg">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Predictions</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              AI-powered forecasting for optimal energy distribution, storage management, and cost reduction.
            </p>
          </motion.article>

          <motion.article variants={item} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 hover:shadow-lg">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
              <Leaf className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Carbon Savings</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Monitor your environmental impact with detailed sustainability reports and carbon footprint tracking.
            </p>
          </motion.article>
        </motion.section>
      </div >
    </main >
  );
}
