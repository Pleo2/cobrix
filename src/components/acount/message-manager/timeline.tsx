"use client"

import { motion } from "framer-motion"
import { TimelineDay } from "./timeline-day"
import type { ScheduledMessage } from "../../../app/(main)/account/@dashboard/message-manager/types"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { useState } from "react"

interface TimelineProps {
    scheduledMessages: ScheduledMessage[]
    onScheduleMessage: (dayOffset: number) => void
    onRemoveMessage: (dayOffset: number) => void
}

export function Timeline({ scheduledMessages, onScheduleMessage, onRemoveMessage }: TimelineProps) {
    const [scrollPosition, setScrollPosition] = useState(0)
    const days = Array.from({ length: 21 }, (_, i) => i - 10) // -10 to +10

    const handleScroll = (direction: "left" | "right") => {
        const container = document.getElementById("timeline-container")
        if (container) {
            const scrollAmount = 300
            const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
            container.scrollTo({ left: newPosition, behavior: "smooth" })
            setScrollPosition(newPosition)
        }
    }

    return (
        <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm">
            <div className="flex justify-between items-center p-4 border-b">
                <div>
                    <h2 className="text-lg font-bold">Línea de Tiempo</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Arrastra mensajes a los días para programar envíos</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleScroll("left")}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                        aria-label="Scroll left"
                    >
                        <IconChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleScroll("right")}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                        aria-label="Scroll right"
                    >
                        <IconChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 relative min-h-0">
                {/* Left fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />

                <div
                    id="timeline-container"
                    className="h-full overflow-x-auto overflow-y-hidden px-6 py-6"
                    onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
                >
                    <div className="flex gap-4 min-w-max">
                        {days.map((dayOffset) => {
                            const scheduledMessage = scheduledMessages.find((msg) => msg.dayOffset === dayOffset) || null
                            return (
                                <motion.div
                                    key={dayOffset}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: (dayOffset + 10) * 0.02 }}
                                >
                                    <TimelineDay
                                        dayOffset={dayOffset}
                                        scheduledMessage={scheduledMessage}
                                        onDrop={onScheduleMessage}
                                        onRemove={onRemoveMessage}
                                    />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Right fade effect */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />
            </div>
        </div>
    )
}
