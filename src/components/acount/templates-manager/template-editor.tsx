"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { MessageType, Template } from "./data";
import { IconCheck, IconX, IconLayout, IconSparkles, IconRobot, IconLoader } from "@tabler/icons-react";
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
    const [isGenerating, setIsGenerating] = useState(false);

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

    // --- LÓGICA DE IA REINTEGRADA CON SIMULACIÓN ---
    const handleGenerateWithAI = async () => {
        if (!formData || !aiIntent.trim()) return;

        setIsGenerating(true);

        // Simular delay de 3 segundos
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Generar mensajes inteligentes según el prompt
        const prompt = aiIntent.toLowerCase();
        let generatedMessages: Record<MessageType, string>;

        if (prompt.includes('amigable') || prompt.includes('amable') || prompt.includes('cordial')) {
            generatedMessages = {
                recordatorio: `¡Hola {nombreCliente}! 😊 Te escribimos con cariño para recordarte que tu pago de {monto} está próximo a vencer. Sabemos que estás ocupado, pero queremos ayudarte a mantener tu cuenta al día. ¡Gracias por tu confianza!`,
                exito: `¡Genial {nombreCliente}! 🎉 Tu pago ha sido procesado exitosamente. ¡Muchas gracias por tu puntualidad! Nos encanta tenerte como parte de nuestra comunidad.`,
                error: `Hola {nombreCliente}, te escribimos para informarte que hemos tenido un pequeño inconveniente técnico al procesar tu pago. ¡No te preocupes! Nuestro equipo ya está trabajando para solucionarlo. Te mantendremos informado. 💪`,
                rechazado: `Hola {nombreCliente}, queremos informarte que tu pago fue rechazado por tu entidad bancaria. Sabemos que esto puede ser frustrante, pero estamos aquí para ayudarte. ¿Podrías verificar tu método de pago? Estamos a tu disposición. 🤝`,
                "marketing-hooking": `¡Hola {nombreCliente}! 🌟 Tenemos una sorpresa especial pensada para ti. Como miembro valioso de nuestra comunidad, queremos ofrecerte algo único. ¡No te lo pierdas!`
            };
        } else if (prompt.includes('profesional') || prompt.includes('formal') || prompt.includes('serio')) {
            generatedMessages = {
                recordatorio: `Estimado/a {nombreCliente}, le recordamos que su pago de {monto} está próximo a vencer. Le agradecemos mantener su cuenta al día para continuar disfrutando de nuestros servicios sin interrupciones.`,
                exito: `Estimado/a {nombreCliente}, confirmamos que su pago ha sido procesado correctamente. Agradecemos su puntualidad y confianza en nuestros servicios.`,
                error: `Estimado/a {nombreCliente}, le informamos que se ha presentado un inconveniente técnico al procesar su pago. Nuestro equipo técnico está trabajando en la solución. Le mantendremos informado del progreso.`,
                rechazado: `Estimado/a {nombreCliente}, le informamos que su pago ha sido rechazado por su entidad bancaria. Le solicitamos verificar y actualizar su método de pago a la brevedad posible.`,
                "marketing-hooking": `Estimado/a {nombreCliente}, nos complace informarle sobre una oferta especial diseñada exclusivamente para nuestros clientes distinguidos. Le invitamos a conocer los detalles.`
            };
        } else if (prompt.includes('motivador') || prompt.includes('motivacional') || prompt.includes('inspirador')) {
            generatedMessages = {
                recordatorio: `¡{nombreCliente}, sigue adelante! 💪 Tu pago de {monto} está por vencer, pero sabemos que puedes mantener el ritmo. ¡Cada paso cuenta para alcanzar tus metas!`,
                exito: `¡Increíble {nombreCliente}! 🚀 Tu pago ha sido procesado. ¡Estás en el camino correcto! Sigue así, cada logro te acerca más a tus objetivos. ¡Eres imparable!`,
                error: `{nombreCliente}, encontramos un obstáculo temporal con tu pago, pero ¡no te detengas! 🌟 Nuestro equipo está resolviendo esto. Los campeones siempre encuentran la manera. ¡Volveremos más fuertes!`,
                rechazado: `{nombreCliente}, tu pago fue rechazado, pero esto es solo un pequeño tropiezo. 💪 Verifica tu método de pago y vuelve con más fuerza. ¡Los verdaderos ganadores nunca se rinden!`,
                "marketing-hooking": `¡{nombreCliente}, es tu momento! ✨ Tenemos algo especial que te ayudará a alcanzar el siguiente nivel. ¡No dejes pasar esta oportunidad de brillar!`
            };
        } else {
            // Mensajes genéricos con el tono del prompt
            generatedMessages = {
                recordatorio: `Hola {nombreCliente}, te recordamos que tu pago de {monto} está por vencer. ${aiIntent}`,
                exito: `¡Excelente {nombreCliente}! Tu pago ha sido procesado con éxito. ${aiIntent}`,
                error: `Hola {nombreCliente}, hemos encontrado un problema al procesar tu pago. Nuestro equipo está trabajando en ello. ${aiIntent}`,
                rechazado: `Hola {nombreCliente}, tu pago fue rechazado. Por favor, actualiza tu método de pago. ${aiIntent}`,
                "marketing-hooking": `¡Hola {nombreCliente}! Tenemos algo especial para ti. ${aiIntent}`
            };
        }

        setFormData({
            ...formData,
            messages: generatedMessages,
        });

        setIsGenerating(false);
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
                        <Button 
                            variant="outline" 
                            onClick={() => setShowAIDialog(!showAIDialog)} 
                            className="h-8 text-xs" 
                            size="sm"
                            disabled={isGenerating}
                        >
                            <IconSparkles className="mr-1 h-3.5 w-3.5" />
                            IA
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaveDisabled || isGenerating}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-medium h-8 text-xs" size="sm">
                            <IconCheck className="mr-1 h-3.5 w-3.5" />
                            {mode === 'creating' ? 'Guardar Plantilla' : 'Guardar Cambios'}
                        </Button>
                        {mode === 'creating' && (
                            <Button variant="outline" onClick={onCancel} className="h-8 text-xs" size="sm" disabled={isGenerating}>
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
                                        ingrese su prompt para obtener los Mensajes
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
                                    disabled={!aiIntent.trim() || isGenerating}
                                    className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-medium h-8 text-xs"
                                    size="sm"
                                >
                                    {isGenerating ? (
                                        <>
                                            <IconLoader className="mr-1 h-3.5 w-3.5 animate-spin" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <IconRobot className="mr-1 h-3.5 w-3.5" />
                                            Generar
                                        </>
                                    )}
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
                                isGenerating={isGenerating}
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
                                isGenerating={isGenerating}
                            />
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
