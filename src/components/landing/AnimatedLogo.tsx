"use client";

import { motion } from "framer-motion";

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({ className }: AnimatedLogoProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        animate={{
          filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src="/Qafila-01.svg"
          alt="Qafila Logo"
          width={280}
          height={120}
          className="w-auto h-auto max-w-70 md:max-w-90"
        />
      </motion.div>
    </motion.div>
  );
}
