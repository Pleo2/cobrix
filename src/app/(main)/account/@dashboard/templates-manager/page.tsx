"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateLibrary } from '../../../../../components/acount/templates-manager/template-library';
import { TemplateEditor } from '../../../../../components/acount/templates-manager/template-editor';
import { Template } from '../../../../../components/acount/templates-manager/data';
import { useTemplateStore } from '../../../../../store/templates-store';
import { Toaster, toast } from 'sonner'; // Importamos el Toaster y toast

export default function TemplatesManagerPage() {
    // Estado de la UI local: 'viewing' para ver/editar, 'creating' para el formulario nuevo
    const [mode, setMode] = useState<'viewing' | 'creating'>('viewing');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    // Obtenemos el estado y las acciones del store de Zustand
    const { templates, isInitialized, initializeTemplates, addTemplate, updateTemplate } = useTemplateStore();

    // Inicializamos el store al montar el componente (solo se ejecuta una vez)
    useEffect(() => {
        initializeTemplates();
    }, [initializeTemplates]);

    // Seleccionamos la primera plantilla por defecto una vez que el store esté listo
    useEffect(() => {
        if (isInitialized && templates.length > 0 && !selectedTemplate) {
            setSelectedTemplate(templates[0]);
        }
    }, [isInitialized, templates, selectedTemplate]);


    const handleSelectTemplate = (template: Template) => {
        setMode('viewing');
        setSelectedTemplate(template);
    };

    const handleAddNewClick = () => {
        setMode('creating');
        setSelectedTemplate(null); // Deseleccionamos cualquier plantilla existente
    };

    const handleSaveChanges = (updatedTemplate: Template) => {
        updateTemplate(updatedTemplate);
        setSelectedTemplate(updatedTemplate);
        toast.success("Plantilla actualizada exitosamente!");
    };

    const handleSaveNewTemplate = (newTemplate: Template) => {
        addTemplate(newTemplate);
        setMode('viewing');
        setSelectedTemplate(newTemplate); // Seleccionamos la nueva plantilla creada
        toast.success("¡Nueva plantilla creada con éxito!");
    };

    const handleCancelCreation = () => {
        setMode('viewing');
        setSelectedTemplate(templates[0] || null); // Volvemos a la primera plantilla
    }

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="flex max-h-max flex-col">
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6"></div>
                    <div className="mx-auto w-full flex flex-col gap-6 max-w-7xl">
                        {/* Header */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="flex-shrink-0"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Gestor de Plantillas</h1>
                                    <p className="text-muted-foreground mt-1">
                                        Crea, edita y gestiona tus plantillas de comunicación.
                                    </p>
                                </div>
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
                                    templates={templates}
                                    selectedTemplateId={selectedTemplate?.id || null}
                                    onSelectTemplate={handleSelectTemplate}
                                    onAddNew={handleAddNewClick}
                                />
                            </motion.div>

                            {/* Right: Template Editor */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="col-span-9 h-full min-h-0"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mode}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full"
                                    >
                                        <TemplateEditor
                                            mode={mode}
                                            template={selectedTemplate}
                                            onSaveChanges={handleSaveChanges}
                                            onSaveNew={handleSaveNewTemplate}
                                            onCancel={handleCancelCreation}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
