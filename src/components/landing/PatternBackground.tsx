"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

interface PatternItem {
  id: number;
  src: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: number;
  rotation: number;
  opacity: number;
}

interface PatternBackgroundProps {
  isExiting?: boolean;
}

export function PatternBackground({
  isExiting = false,
}: PatternBackgroundProps) {
  const patterns: PatternItem[] = useMemo(
    () => [
      {
        id: 1,
        src: "/Pattern 5.svg",
        position: { top: "5%", left: "5%" },
        size: 120,
        rotation: 0,
        opacity: 0.6,
      },
      {
        id: 2,
        src: "/Pattern 5.svg",
        position: { top: "10%", right: "8%" },
        size: 100,
        rotation: 15,
        opacity: 0.5,
      },
      {
        id: 3,
        src: "/Pattern 5.svg",
        position: { bottom: "15%", left: "10%" },
        size: 140,
        rotation: -10,
        opacity: 0.55,
      },
      {
        id: 4,
        src: "/Pattern 5.svg",
        position: { bottom: "20%", right: "5%" },
        size: 110,
        rotation: 20,
        opacity: 0.5,
      },
      {
        id: 5,
        src: "/Pattern 5.svg",
        position: { top: "40%", left: "3%" },
        size: 90,
        rotation: -5,
        opacity: 0.45,
      },
      {
        id: 6,
        src: "/Pattern 5.svg",
        position: { top: "35%", right: "3%" },
        size: 85,
        rotation: 25,
        opacity: 0.4,
      },
      {
        id: 7,
        src: "/Pattern 5.svg",
        position: { bottom: "5%", left: "40%" },
        size: 95,
        rotation: -15,
        opacity: 0.5,
      },
      {
        id: 8,
        src: "/Pattern 5.svg",
        position: { top: "5%", left: "35%" },
        size: 80,
        rotation: 10,
        opacity: 0.35,
      },
    ],
    [],
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="w-full h-28 overflow-hidden relative">
        <Image
          src="/pattern 3.svg"
          alt="pattern top"
          fill
          className="object-cover"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(75%) sepia(30%) saturate(500%) hue-rotate(350deg) brightness(95%) contrast(90%)",
          }}
        />
      </div>
      <div className="w-full h-28 overflow-hidden  absolute bottom-0">
        <Image
          src="/pattern 3.svg"
          alt="pattern"
          fill
          className="object-cover"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(75%) sepia(30%) saturate(500%) hue-rotate(350deg) brightness(95%) contrast(90%)",
          }}
        />
      </div>
      {patterns.map((pattern, index) => (
        <motion.div
          key={pattern.id}
          className="absolute"
          style={{
            ...pattern.position,
            width: pattern.size,
            height: pattern.size,
            willChange: isExiting ? "transform, opacity" : "auto",
          }}
          initial={{
            opacity: 0,
            scale: 0.5,
            rotate: pattern.rotation - 20,
          }}
          animate={
            isExiting
              ? {
                  opacity: 0,
                  scale: 1.5,
                  y: pattern.position.top ? -100 : 100,
                }
              : {
                  opacity: pattern.opacity,
                  scale: 1,
                  rotate: pattern.rotation,
                  y: [0, -10, 0],
                }
          }
          transition={
            isExiting
              ? {
                  duration: 0.4,
                  ease: "easeIn",
                }
              : {
                  opacity: {
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  scale: {
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  rotate: {
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  y: {
                    duration: 4 + index * 0.5,
                    repeat: isExiting ? 0 : Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                  },
                }
          }
        >
          <Image
            src={pattern.src}
            alt=""
            width={pattern.size}
            height={pattern.size}
            className="w-full h-full object-contain"
            priority={index < 3}
          />
        </motion.div>
      ))}
    </div>
  );
}
