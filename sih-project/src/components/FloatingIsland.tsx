"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingIslandProps {
    children?: ReactNode;
    className?: string;
    delay?: number;
    width?: number;
}

export const FloatingIsland = ({ children, className = "", delay = 0, width = 200 }: FloatingIslandProps) => {
    return (
        <motion.div
            className={`relative ${className}`}
            style={{ width }}
            animate={{
                y: [-15, 15, -15],
                x: [-5, 5, -5],
                rotate: [-2, 2, -2],
            }}
            transition={{
                duration: 6 + (width % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
        >
            {/* Island Top / Turf */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-emerald-500/80 dark:bg-emerald-900/60 rounded-full blur-[1px] z-10 box-shadow-[0_0_15px_rgba(16,185,129,0.5)] border-t border-emerald-400" />

            {/* Rock Formation (SVG) */}
            <div className="absolute top-2 left-2 right-2 z-0">
                <svg viewBox="0 0 100 60" className="w-full h-full fill-stone-700/90 dark:fill-stone-900/90 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" preserveAspectRatio="none">
                    <path d="M10,0 L90,0 L80,20 L60,50 L40,35 L20,45 L15,20 Z" />
                </svg>
            </div>

            {/* Content Placed on Top */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                {children}
            </div>

            {/* Anti-Gravity Particles below */}
            <div className="absolute top-full left-1/4 right-1/4 h-20">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                        style={{ left: `${(i * 33 + 15) % 100}%`, top: 0 }}
                        animate={{ y: [0, 30], opacity: [1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: (i * 0.5) % 2 }}
                    />
                ))}
            </div>
        </motion.div>
    );
};
