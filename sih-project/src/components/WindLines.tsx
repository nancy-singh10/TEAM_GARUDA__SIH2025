"use client";

import { motion } from "framer-motion";

export const WindLines = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10"
                    style={{
                        top: `${10 + Math.random() * 60}%`,
                        left: -100,
                        width: Math.random() * 200 + 100,
                    }}
                    animate={{
                        x: ["0vw", "120vw"],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};
