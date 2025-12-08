"use client";

import { motion } from "framer-motion";

export const Sun = () => {
    return (
        <div className="relative w-32 h-32 md:w-40 md:h-40">
            {/* Rays */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-b from-yellow-300/0 via-yellow-400/50 to-yellow-300/0 rounded-full blur-sm"
                        style={{
                            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        }}
                    />
                ))}
            </motion.div>

            {/* Core Sun Body */}
            <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-[0_0_60px_rgba(253,224,71,0.6)] z-10"
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};
