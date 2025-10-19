"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { MessageType, Template } from "./data";
import { IconCheck, IconX, IconLayout, IconSparkles, IconRobot } from "@tabler/icons-react";
import { MessageCard } from "./message-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import { messageConfig, secondaryMessageOrder } from "./data";

interface TemplateEditorProps {
    mode: 'viewing' | 'creating';
    template: Template | null;
    onSaveChanges: (updatedTemplate: Template) => void;
    onSaveNew: (newTemplate: Template) => void;
    onCancel: () => void;
}

const emptyTemplate: Omit<Template, 'id' | 'icon'> = {
    name: "",
    description: "",
    messages: {
        recordatorio: "",
        exito: "",
        error: "",
        rechazado: "",
        "marketing-hooking": "",
    },
};

export function TemplateEditor({ mode, template, onSaveChanges, onSaveNew, onCancel }: TemplateEditorProps) {
    const [formData, setFormData] = useState<Omit<Template, 'id' | 'icon'> | Template | null>(null);
    const [showAIDialog, setShowAIDialog] = useState(false);
    const [aiIntent, setAiIntent] = useState("");

    useEffect(() => {
        if (mode === 'creating') {
            setFormData(emptyTemplate);
        } else {
            setFormData(template);
        }
        setShowAIDialog(false); // Reseteamos la IA al cambiar de modo
        setAiIntent("");
    }, [mode, template]);

    const handleInputChange = (field: 'name' | 'description', value: string) => {
        if (!formData) return;
        setFormData({ ...formData, [field]: value });
    };

    const handleMessageChange = (type: MessageType, value: string) => {
        if (!formData) return;
        setFormData({
            ...formData,
            messages: { ...formData.messages, [type]: value },
        });
    };

    const handleSave = () => {
        if (!formData) return;
        if (mode === 'creating') {
            const newTemplate: Template = {
                ...(formData as Omit<Template, 'id' | 'icon'>),
                id: `tpl_${uuidv4()}`,
                icon: 'tools',
            };
            onSaveNew(newTemplate);
        } else {
            onSaveChanges(formData as Template);
        }
    };

    // --- LÓGICA DE IA REINTEGRADA ---
    const handleGenerateWithAI = () => {
        if (!formData || !aiIntent.trim()) return;

        const generatedMessages: Record<MessageType, string> = {
            recordatorio: `Hola {nombreCliente}, te recordamos amablemente que tu pago de {monto} está por vencer. ${aiIntent}.`,
            exito: `¡Excelente, {nombreCliente}! Tu pago ha sido procesado con éxito. ¡Gracias por tu confianza! ${aiIntent}.`,
            error: `Hola {nombreCliente}, hemos encontrado un problema técnico al procesar tu pago. Nuestro equipo ya está trabajando en ello. ${aiIntent}.`,
            rechazado: `Hola {nombreCliente}, tu pago fue rechazado por la entidad bancaria. Por favor, actualiza tu método de pago. ${aiIntent}.`,
            "marketing-hooking": `¡Hola {nombreCliente}! Tenemos algo especial para ti. ${aiIntent}. ¡No te lo pierdas!`,
        };

        setFormData({
            ...formData,
            messages: generatedMessages,
        });

        setShowAIDialog(false);
        setAiIntent("");
    };


    if (!formData) {
        return (
            <div className="flex h-full items-center justify-center bg-card rounded-lg border shadow-sm">
                <div className="text-center text-muted-foreground p-8">
                    <IconLayout className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-base font-semibold mb-1">Editor de Plantillas</p>
                    <p className="text-sm">Selecciona una plantilla para editar o crea una nueva.</p>
                </div>
            </div>
        );
    }

    const isSaveDisabled =
        !formData.name.trim() ||
        !formData.description.trim() ||
        Object.values(formData.messages).some(msg => msg.trim() === '');

    return (
        <div className="h-full flex flex-col bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b space-y-3">
                <div className="flex justify-between items-start gap-3">
                    {/* ... (código del nombre y descripción de la plantilla no cambia) ... */}
                    <div className="flex-1 min-w-0">
                        {mode === 'creating' ? (
                            <div className="space-y-2">
                                <Label htmlFor="template-name">Nombre de la Plantilla</Label>
                                <Input
                                    id="template-name"
                                    placeholder="Ej: Tono Motivacional Fitness"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="text-lg font-bold h-9"
                                />
                                <Label htmlFor="template-description" className="pt-2 block">Descripción</Label>
                                <Textarea
                                    id="template-description"
                                    placeholder="Describe brevemente el propósito de esta plantilla..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="text-xs min-h-[50px] resize-none"
                                />
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-bold truncate text-[#22c55e]">{formData.name}</h2>
                                <p className="text-muted-foreground text-xs mt-0.5">{formData.description}</p>
                            </div>
                        )}
                    </div>

                    {/* --- BOTONES DE ACCIÓN (INCLUYENDO IA) --- */}
                    <div className="flex gap-2 flex-shrink-0">
                        {mode === 'viewing' && ( // El botón de IA solo aparece en modo edición
                            <Button variant="outline" onClick={() => setShowAIDialog(!showAIDialog)} className="h-8 text-xs" size="sm">
                                <IconSparkles className="mr-1 h-3.5 w-3.5" />
                                IA
                            </Button>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={isSaveDisabled}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-medium h-8 text-xs" size="sm">
                            <IconCheck className="mr-1 h-3.5 w-3.5" />
                            {mode === 'creating' ? 'Guardar Plantilla' : 'Guardar Cambios'}
                        </Button>
                        {mode === 'creating' && (
                            <Button variant="outline" onClick={onCancel} className="h-8 text-xs" size="sm">
                                <IconX className="mr-1 h-3.5 w-3.5" />
                                Cancelar
                            </Button>
                        )}
                    </div>
                </div>

                {/* --- DIÁLOGO DE IA REINTEGRADO CON ANIMACIÓN --- */}
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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex-1 relative min-h-0">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />
                <div className="h-full overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <MessageCard
                                icon={messageConfig.recordatorio.icon}
                                label={messageConfig.recordatorio.label}
                                description={messageConfig.recordatorio.description}
                                placeholder={messageConfig.recordatorio.placeholder}
                                value={formData.messages.recordatorio}
                                onChange={(value) => handleMessageChange("recordatorio", value)}
                                variant="primary"
                            />
                        </div>
                        {secondaryMessageOrder.map((type) => (
                            <MessageCard
                                key={type}
                                icon={messageConfig[type].icon}
                                label={messageConfig[type].label}
                                description={messageConfig[type].description}
                                placeholder={messageConfig[type].placeholder}
                                value={formData.messages[type]}
                                onChange={(value) => handleMessageChange(type, value)}
                            />
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
