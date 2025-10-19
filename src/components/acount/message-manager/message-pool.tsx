"use client"

import type React from "react"

import { motion } from "framer-motion"
import { DraggableMessage } from "./draggable-message"
import type { MessageType } from "../templates-manager/data"
import type { ScheduledMessage } from "../../../app/(main)/account/@dashboard/message-manager/types"

interface MessagePoolProps {
    recordatorioMessage: string
    marketingMessage: string
    scheduledMessages: ScheduledMessage[]
    onDragStart: (e: React.DragEvent, type: MessageType, content: string) => void
}

export function MessagePool({
    recordatorioMessage,
    marketingMessage,
    scheduledMessages,
    onDragStart,
}: MessagePoolProps) {
    const recordatorioUsedCount = scheduledMessages.filter((msg) => msg.messageType === "recordatorio").length
    const marketingUsedCount = scheduledMessages.filter((msg) => msg.messageType === "marketing-hooking").length

    return (
        <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="mb-3">
                <h3 className="text-sm font-bold mb-1">Mensajes Disponibles</h3>
                <p className="text-xs text-muted-foreground">Arrastra los mensajes a la línea de tiempo</p>
            </div>

            <div className="space-y-3">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <DraggableMessage
                        type="recordatorio"
                        content={recordatorioMessage}
                        onDragStart={onDragStart}
                        isUsed={recordatorioUsedCount >= 6}
                    />
                    {recordatorioUsedCount > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                            Usado {recordatorioUsedCount} {recordatorioUsedCount === 1 ? "vez" : "veces"}
                        </p>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <DraggableMessage
                        type="marketing-hooking"
                        content={marketingMessage}
                        onDragStart={onDragStart}
                        isUsed={marketingUsedCount >= 6}
                    />
                    {marketingUsedCount > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                            Usado {marketingUsedCount} {marketingUsedCount === 1 ? "vez" : "veces"}
                        </p>
                    )}
                </motion.div>
            </div>

            <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Nota:</strong> Puedes programar hasta 6 mensajes en total. Los mensajes de
                    éxito, error y rechazo se envían automáticamente según el estado del pago.
                </p>
            </div>
        </div>
    )
}
