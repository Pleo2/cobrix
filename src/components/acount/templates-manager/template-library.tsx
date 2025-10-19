"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateCard } from "./template-card";
import type { Template } from "./data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus, IconSearch } from "@tabler/icons-react";

interface TemplateLibraryProps {
    templates: Template[];
    selectedTemplateId: string | null;
    onSelectTemplate: (template: Template) => void;
    onAddNew: () => void;
}

export function TemplateLibrary({
    templates,
    selectedTemplateId,
    onSelectTemplate,
    onAddNew,
}: TemplateLibraryProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTemplates = templates.filter(
        (template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">Librería</h2>
                <Button
                    size="sm"
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-medium h-8 text-xs"
                    onClick={onAddNew}
                >
                    <IconPlus className="mr-1 h-3.5 w-3.5" />
                    Crear
                </Button>
            </div>

            <div className="px-4 pt-3 pb-2">
                <div className="relative">
                    <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Buscar plantilla..."
                        className="pl-8 h-8 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- INICIO DE LA CORRECCIÓN --- */}
            {/* Este contenedor ahora maneja tanto el crecimiento (flex-1) como el scroll (overflow-y-auto) */}
            <div className="flex-1 relative min-h-0 overflow-y-auto p-4 space-y-2.5">
                {/* Los efectos de fade ahora se posicionan relativos a este contenedor */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />

                <AnimatePresence>
                    {filteredTemplates.length > 0 ? (
                        filteredTemplates.map((template, index) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <TemplateCard
                                    template={template}
                                    isSelected={template.id === selectedTemplateId}
                                    onClick={() => onSelectTemplate(template)}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-muted-foreground mt-8 p-6 bg-muted/30 rounded-lg border border-dashed"
                        >
                            <IconSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="font-medium text-sm">No se encontraron plantillas</p>
                            <p className="text-xs mt-1">Intenta con otro término</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
            </div>
            {/* --- FIN DE LA CORRECCIÓN --- */}
        </div>
    );
}
