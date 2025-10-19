"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { IconX, IconBell, IconSparkles } from "@tabler/icons-react"
import type { ScheduledMessage } from "../../../app/(main)/account/@dashboard/message-manager/types"

interface TimelineDayProps {
    dayOffset: number
    scheduledMessage: ScheduledMessage | null
    onDrop: (dayOffset: number) => void
    onRemove: (dayOffset: number) => void
}

export function TimelineDay({ dayOffset, scheduledMessage, onDrop, onRemove }: TimelineDayProps) {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.currentTarget.classList.add("ring-2", "ring-[#22c55e]/50")
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove("ring-2", "ring-[#22c55e]/50")
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.currentTarget.classList.remove("ring-2", "ring-[#22c55e]/50")
        onDrop(dayOffset)
    }

    const getDayLabel = () => {
        if (dayOffset === 0) return "Día 0"
        if (dayOffset > 0) return `+${dayOffset}`
        return `${dayOffset}`
    }

    const isToday = dayOffset === 0

    return (
        <div className="flex flex-col items-center gap-2 min-w-[120px]">
            <div
                className={`text-xs font-medium px-2 py-1 rounded-md ${isToday ? "bg-[#22c55e]/20 text-[#22c55e] dark:bg-[#22c55e]/10" : "bg-muted/50 text-muted-foreground"
                    }`}
            >
                {getDayLabel()}
            </div>

            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative w-full h-24 rounded-lg border-2 border-dashed transition-all ${scheduledMessage
                    ? "border-[#22c55e]/30 bg-[#22c55e]/5"
                    : "border-border/50 bg-muted/20 hover:border-[#22c55e]/20 hover:bg-muted/30"
                    }`}
                whileHover={{ scale: 1.02 }}
            >
                <AnimatePresence>
                    {scheduledMessage ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 p-2 flex flex-col"
                        >
                            <button
                                onClick={() => onRemove(dayOffset)}
                                className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors z-10"
                            >
                                <IconX className="h-3 w-3" />
                            </button>

                            <div className="flex items-center gap-1.5 mb-1.5">
                                {scheduledMessage.messageType === "recordatorio" ? (
                                    <div className="p-1 rounded bg-blue-500/10">
                                        <IconBell className="h-3 w-3 text-blue-500" />
                                    </div>
                                ) : (
                                    <div className="p-1 rounded bg-purple-500/10">
                                        <IconSparkles className="h-3 w-3 text-purple-500" />
                                    </div>
                                )}
                                <span className="text-[10px] font-medium capitalize">
                                    {scheduledMessage.messageType === "recordatorio" ? "Recordatorio" : "Marketing"}
                                </span>
                            </div>

                            <p className="text-[10px] text-muted-foreground line-clamp-3 leading-tight">{scheduledMessage.content}</p>
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-[10px] text-muted-foreground/50 text-center px-2">Arrastra un mensaje aquí</p>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>

            {isToday && <div className="text-[10px] text-muted-foreground font-medium">Fecha de vencimiento</div>}
        </div>
    )
}
