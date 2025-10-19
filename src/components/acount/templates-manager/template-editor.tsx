"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { MessageType, Template } from "../../../app/(main)/account/@dashboard/templates-manager/data"
import {
    IconCheck,
    IconX,
    IconAlertTriangle,
    IconBell,
    IconDiscount2,
    IconSparkles,
    IconRobot,
} from "@tabler/icons-react"
import { MessageCard } from "./message-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TemplateEditorProps {
    template: Template | null
    onSaveChanges: (updatedTemplate: Template) => void
}

const messageConfig: Record<
    MessageType,
    {
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        placeholder: string;
        description: string;
    }
> = {
    recordatorio: {
        label: "Recordatorio de Pago",
        icon: IconBell,
        placeholder: "Ej: ¡Hola {nombreCliente}! Tu pago de {monto} vence pronto...",
        description: "Este es el mensaje principal. Se envía antes de la fecha de vencimiento para notificar al cliente.",
    },
    exito: {
        label: "Pago Exitoso",
        icon: IconCheck,
        placeholder: "Ej: ¡Recibimos tu pago! Gracias por tu confianza.",
        description: "Se envía automáticamente cuando un pago se procesa correctamente.",
    },
    error: {
        label: "Error en el Pago",
        icon: IconAlertTriangle,
        placeholder: "Ej: Hubo un error inesperado al procesar tu pago.",
        description: "Para notificar al cliente de un fallo técnico o problema inesperado durante el cobro.",
    },
    rechazado: {
        label: "Pago Rechazado",
        icon: IconX,
        placeholder: "Ej: Tu pago fue rechazado. Actualiza tu método de pago.",
        description: "Informa al cliente que su método de pago fue rechazado por el banco o la pasarela.",
    },
    "marketing-hooking": {
        label: "Marketing y Ofertas",
        icon: IconDiscount2,
        placeholder: "Ej: ¡Refiere a un amigo y ambos obtienen un descuento!",
        description: "Un mensaje opcional para promociones, ofertas o para incentivar la retención del cliente.",
    },
};

const secondaryMessageOrder: MessageType[] = ["exito", "error", "rechazado", "marketing-hooking"]

export function TemplateEditor({ template, onSaveChanges }: TemplateEditorProps) {
    const [editableTemplate, setEditableTemplate] = useState<Template | null>(template)
    const [showAIDialog, setShowAIDialog] = useState(false)
    const [aiIntent, setAiIntent] = useState("")

    useEffect(() => {
        setEditableTemplate(template)
    }, [template])

    const handleMessageChange = (type: MessageType, value: string) => {
        if (!editableTemplate) return
        setEditableTemplate({
            ...editableTemplate,
            messages: {
                ...editableTemplate.messages,
                [type]: value,
            },
        })
    }

    const handleGenerateWithAI = () => {
        if (!editableTemplate || !aiIntent.trim()) return

        // Simulación de generación con IA
        const generatedMessages: Record<MessageType, string> = {
            recordatorio: `Hola {nombreCliente}, te recordamos que tu pago de {monto} vence el {fechaVencimiento}. ${aiIntent}`,
            exito: `¡Excelente {nombreCliente}! Tu pago ha sido procesado exitosamente. ${aiIntent}`,
            error: `Hola {nombreCliente}, hubo un problema al procesar tu pago. ${aiIntent}`,
            rechazado: `{nombreCliente}, tu pago fue rechazado. Por favor actualiza tu método de pago. ${aiIntent}`,
            "marketing-hooking": `¡Hola {nombreCliente}! ${aiIntent} ¡Aprovecha esta oportunidad!`,
        }

        setEditableTemplate({
            ...editableTemplate,
            messages: generatedMessages,
        })

        setShowAIDialog(false)
        setAiIntent("")
    }

    if (!editableTemplate) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full items-center justify-center bg-card rounded-lg border shadow-sm"
            >
                <div className="text-center text-muted-foreground p-8">
                    <IconBell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-base font-semibold mb-1">Editor de Plantillas</p>
                    <p className="text-sm">Selecciona una plantilla para empezar</p>
                </div>
            </motion.div>
        )
    }

    const allMessagesFilled = Object.values(editableTemplate.messages).every((msg) => msg.trim() !== "")

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col bg-card rounded-lg border shadow-sm"
        >
            <div className="p-4 border-b space-y-3">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold truncate">
                            <span className="text-[#22c55e]">{editableTemplate.name}</span>
                        </h2>
                        <p className="text-muted-foreground text-xs mt-0.5">Ajusta cada mensaje según tu marca</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <AnimatePresence mode="wait">
                            {!showAIDialog && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Button variant="outline" onClick={() => setShowAIDialog(true)} className="h-8 text-xs" size="sm">
                                        <IconSparkles className="mr-1 h-3.5 w-3.5" />
                                        IA
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Button
                            onClick={() => onSaveChanges(editableTemplate)}
                            disabled={!allMessagesFilled}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-medium h-8 text-xs"
                            size="sm"
                        >
                            <IconCheck className="mr-1 h-3.5 w-3.5" />
                            Guardar
                        </Button>
                    </div>
                </div>
                <AnimatePresence>
                    {showAIDialog && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex gap-2 items-end pt-2">
                                <div className="flex-1">
                                    <Label htmlFor="ai-intent" className="text-xs mb-1 block text-muted-foreground">
                                        Intención de los mensajes
                                    </Label>
                                    <Input
                                        id="ai-intent"
                                        placeholder="Ej: Tono amigable y motivador..."
                                        value={aiIntent}
                                        onChange={(e) => setAiIntent(e.target.value)}
                                        className="h-8 text-sm"
                                        autoFocus
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerateWithAI}
                                    disabled={!aiIntent.trim()}
                                    className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-medium h-8 text-xs"
                                    size="sm"
                                >
                                    <IconRobot className="mr-1 h-3.5 w-3.5" />
                                    Generar
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowAIDialog(false)
                                        setAiIntent("")
                                    }}
                                    className="h-8 text-xs"
                                    size="sm"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex-1 relative min-h-0">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />
                <div className="h-full overflow-y-auto p-4 space-y-3">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <MessageCard
                            icon={messageConfig.recordatorio.icon}
                            label={messageConfig.recordatorio.label}
                            description={messageConfig.recordatorio.description}
                            placeholder={messageConfig.recordatorio.placeholder}
                            value={editableTemplate.messages.recordatorio}
                            onChange={(value) => handleMessageChange("recordatorio", value)}
                            variant="primary"
                        />
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {secondaryMessageOrder.map((type, index) => {
                            const config = messageConfig[type]
                            return (
                                <motion.div
                                    key={type}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 + index * 0.05 }}
                                >
                                    <MessageCard
                                        icon={config.icon}
                                        label={config.label}
                                        description={config.description}
                                        placeholder={config.placeholder}
                                        value={editableTemplate.messages[type]}
                                        onChange={(value) => handleMessageChange(type, value)}
                                    />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
            </div>
        </motion.div>
    )
}
