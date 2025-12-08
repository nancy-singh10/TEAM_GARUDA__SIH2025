"use client";

import { motion } from "framer-motion";

interface WindmillProps {
    className?: string;
    duration?: number;
}

export const Windmill = ({ className = "", duration = 8 }: WindmillProps) => {
    return (
        <div className={`relative ${className}`}>
            {/* Stand - Neon Spine */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[4%] h-[60%] bg-indigo-500/50 dark:bg-indigo-400/50 shadow-[0_0_10px_rgba(99,102,241,0.6)] rounded-t-sm z-0" />

            {/* Blades Container */}
            <motion.div
                className="absolute top-[30%] left-1/2 -translate-x-1/2 w-full h-full z-10 origin-center"
                animate={{ rotate: 360 }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{ width: '100%', height: '100%', top: '0%' }}
            >
                {/* Center Hub - Energy Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[12%] h-[12%] bg-cyan-400 rounded-full z-20 shadow-[0_0_20px_rgba(34,211,238,0.8)] border-2 border-white" />

                {/* Blades - Holographic */}
                {[0, 90, 180, 270].map((rotation, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-[8%] h-[55%] bg-gradient-to-t from-cyan-400/20 to-transparent border-x border-cyan-400/40 rounded-full origin-bottom shadow-[0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-sm"
                        style={{
                            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};
