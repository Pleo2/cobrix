"use client"

import type React from "react"

import { motion } from "framer-motion"
import { IconBell, IconSparkles, IconGripVertical } from "@tabler/icons-react"
import type { MessageType } from "../../../app/(main)/account/@dashboard/templates-manager/data"

interface DraggableMessageProps {
    type: "recordatorio" | "marketing-hooking"
    content: string
    onDragStart: (e: React.DragEvent, type: MessageType, content: string) => void
    isUsed?: boolean
}

export function DraggableMessage({ type, content, onDragStart, isUsed }: DraggableMessageProps) {
    const icon = type === "recordatorio" ? IconBell : IconSparkles
    const Icon = icon

    return (
        <motion.div
            draggable
            onDragStart={(e) => onDragStart(e as any, type, content)}
            className={`group relative flex items-start gap-3 p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing transition-all ${isUsed ? "opacity-50 border-border/50" : "border-border hover:border-[#22c55e]/30 hover:shadow-sm"
                }`}
            whileHover={{ scale: isUsed ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex-shrink-0 mt-0.5">
                <IconGripVertical className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <div
                className={`flex-shrink-0 p-2 rounded-md ${type === "recordatorio" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                    }`}
            >
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium mb-1 capitalize">{type === "recordatorio" ? "Recordatorio" : "Marketing"}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{content}</p>
            </div>
        </motion.div>
    )
}
