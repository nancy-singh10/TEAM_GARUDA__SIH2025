"use client";

import { motion } from "framer-motion";

export const MorphingSun = () => {
    return (
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            {/* Core */}
            <motion.div
                className="absolute w-32 h-32 bg-gradient-to-tr from-fuchsia-600 to-amber-400 mix-blend-screen rounded-full blur-md"
                animate={{
                    scale: [1, 1.2, 0.9, 1],
                    borderRadius: ["50%", "20%", "50%", "10%"],
                    rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Geometric Rings */}
            <motion.div
                className="absolute w-40 h-40 border-2 border-cyan-400/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute w-40 h-40 border-2 border-fuchsia-400/50"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Glitch Rays */}
            {[0, 60, 120, 180, 240, 300].map((r, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-32 bg-gradient-to-t from-transparent via-cyan-400 to-transparent"
                    style={{ transform: `rotate(${r}deg)` }}
                    animate={{ height: ["0%", "150%", "0%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "circInOut" }}
                />
            ))}

            {/* Inner Glow */}
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
        </div>
    );
};
