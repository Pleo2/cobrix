"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TemplateLibrary } from "../../../../../components/acount/templates-manager/template-library"
import { Timeline } from "../../../../../components/acount/message-manager/timeline"
import { MessagePool } from "../../../../../components/acount/message-manager/message-pool"
import { defaultTemplates, type Template, type MessageType } from "../templates-manager/data"
import type { ScheduledMessage, MessageScheduleConfig } from "./types"
import { Button } from "@/components/ui/button"
import { IconDeviceFloppy, IconAlertCircle } from "@tabler/icons-react"

const STORAGE_KEY = "cobrix-message-schedule"

export default function MessageManagerPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
    const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([])
    const [draggedMessage, setDraggedMessage] = useState<{ type: MessageType; content: string } | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const config: MessageScheduleConfig = JSON.parse(saved)
                const template = defaultTemplates.find((t) => t.id === config.templateId)
                if (template) {
                    setSelectedTemplate(template)
                    setScheduledMessages(config.scheduledMessages)
                }
            } catch (error) {
                console.error("Error loading saved configuration:", error)
            }
        }
    }, [])

    const handleSelectTemplate = (template: Template) => {
        if (selectedTemplate?.id !== template.id) {
            setSelectedTemplate(template)
            setScheduledMessages([])
            setHasUnsavedChanges(true)
        }
    }

    const handleDragStart = (e: React.DragEvent, type: MessageType, content: string) => {
        setDraggedMessage({ type, content })
        e.dataTransfer.effectAllowed = "copy"
    }

    const handleScheduleMessage = (dayOffset: number) => {
        if (!draggedMessage || !selectedTemplate) return

        // Check if day already has a message
        const existingIndex = scheduledMessages.findIndex((msg) => msg.dayOffset === dayOffset)

        // Check if we've reached the limit of 6 messages
        if (existingIndex === -1 && scheduledMessages.length >= 6) {
            alert("Has alcanzado el límite de 6 mensajes programados")
            return
        }

        const newMessage: ScheduledMessage = {
            id: `${Date.now()}-${Math.random()}`,
            messageType: draggedMessage.type as "recordatorio" | "marketing-hooking",
            dayOffset,
            content: draggedMessage.content,
        }

        if (existingIndex !== -1) {
            // Replace existing message
            const updated = [...scheduledMessages]
            updated[existingIndex] = newMessage
            setScheduledMessages(updated)
        } else {
            // Add new message
            setScheduledMessages([...scheduledMessages, newMessage])
        }

        setHasUnsavedChanges(true)
        setDraggedMessage(null)
    }

    const handleRemoveMessage = (dayOffset: number) => {
        setScheduledMessages(scheduledMessages.filter((msg) => msg.dayOffset !== dayOffset))
        setHasUnsavedChanges(true)
    }

    const handleSave = () => {
        if (!selectedTemplate) return

        const config: MessageScheduleConfig = {
            templateId: selectedTemplate.id,
            scheduledMessages,
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
        setHasUnsavedChanges(false)
    }

    return (
        <div className="flex max-h-max flex-col">
            <div className="flex flex-1 flex-col ">
                <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6"></div>
                <div className="mx-auto w-full flex flex-col gap-6 max-w-7xl">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold">Gestor de Mensajes</h1>
                                <p className="text-muted-foreground mt-1">
                                    Programa cuándo enviar notificaciones a tus clientes según su fecha de vencimiento.
                                </p>
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={!selectedTemplate || scheduledMessages.length === 0 || !hasUnsavedChanges}
                                className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-medium"
                            >
                                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                                Guardar Configuración
                            </Button>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                        {/* Left: Template Library */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="col-span-3 h-full"
                        >
                            <TemplateLibrary
                                templates={defaultTemplates}
                                selectedTemplateId={selectedTemplate?.id || null}
                                onSelectTemplate={handleSelectTemplate}
                            />
                        </motion.div>

                        {/* Right: Timeline and Messages */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="col-span-9 flex flex-col gap-4 h-full min-h-0"
                        >
                            {selectedTemplate ? (
                                <>
                                    {/* Message Pool */}
                                    <MessagePool
                                        recordatorioMessage={selectedTemplate.messages.recordatorio}
                                        marketingMessage={selectedTemplate.messages["marketing-hooking"]}
                                        scheduledMessages={scheduledMessages}
                                        onDragStart={handleDragStart}
                                    />

                                    {/* Timeline */}
                                    <div className="flex-1 min-h-0">
                                        <Timeline
                                            scheduledMessages={scheduledMessages}
                                            onScheduleMessage={handleScheduleMessage}
                                            onRemoveMessage={handleRemoveMessage}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center bg-card rounded-lg border border-dashed">
                                    <div className="text-center p-8">
                                        <IconAlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                        <h3 className="text-lg font-bold mb-2">Selecciona una Plantilla</h3>
                                        <p className="text-sm text-muted-foreground max-w-md">
                                            Elige una plantilla de la librería para comenzar a programar tus mensajes en la línea de tiempo.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
