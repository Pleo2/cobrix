"use client"

import { motion } from "motion/react"

interface AnimatedWavesProps {
  variant?: "light" | "dark"
}

export function AnimatedWaves({ variant = "light" }: AnimatedWavesProps) {
  const isDark = variant === "dark"
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ola 1 - Primary Blue */}
      <motion.div
        className={`absolute w-[150%] h-[150%] rounded-full blur-[100px] ${
          isDark ? "bg-primary/15" : "bg-primary/20"
        }`}
        style={{
          left: "-25%",
          top: "-25%",
        }}
        animate={{
          x: [0, 150, 0],
          y: [0, 80, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
          repeatType: "mirror",
        }}
      />

      {/* Ola 2 - Emerald Green */}
      <motion.div
        className={`absolute w-[120%] h-[120%] rounded-full blur-[120px] ${
          isDark ? "bg-emerald-500/12" : "bg-emerald-500/15"
        }`}
        style={{
          right: "-20%",
          top: "10%",
        }}
        animate={{
          x: [0, -120, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
          repeatType: "mirror",
          delay: 3,
        }}
      />

      {/* Ola 3 - Primary Blue (más pequeña) */}
      <motion.div
        className={`absolute w-[100%] h-[100%] rounded-full blur-[90px] ${
          isDark ? "bg-primary/12" : "bg-primary/15"
        }`}
        style={{
          left: "30%",
          bottom: "-20%",
        }}
        animate={{
          x: [0, -90, 0],
          y: [0, -70, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1],
          repeatType: "mirror",
          delay: 6,
        }}
      />

      {/* Ola 4 - Emerald Green (acento) */}
      <motion.div
        className={`absolute w-[90%] h-[90%] rounded-full blur-[110px] ${
          isDark ? "bg-emerald-500/18" : "bg-emerald-500/20"
        }`}
        style={{
          right: "10%",
          bottom: "-10%",
        }}
        animate={{
          x: [0, 110, 0],
          y: [0, -80, 0],
          scale: [1, 1.18, 1],
        }}
        transition={{
          duration: 42,
          repeat: Infinity,
          ease: [0.37, 0, 0.63, 1],
          repeatType: "mirror",
          delay: 9,
        }}
      />

      {/* Ola 5 - Primary Blue (centro) */}
      <motion.div
        className={`absolute w-[80%] h-[80%] rounded-full blur-[80px] ${
          isDark ? "bg-primary/8" : "bg-primary/10"
        }`}
        style={{
          left: "10%",
          top: "30%",
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, 110, 0],
          scale: [1, 1.35, 1],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: [0.33, 0.16, 0.67, 0.84],
          repeatType: "mirror",
          delay: 2,
        }}
      />

      {/* Overlay sutil para suavizar */}
      <div className={`absolute inset-0 ${isDark ? "bg-black/30" : "bg-[#F7f7f7]/40"} backdrop-blur-sm`} />
    </div>
  )
}
