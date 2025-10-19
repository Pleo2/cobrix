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
                <div className="flex flex-1 flex-col ">
                    <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6 "></div>
                    <div className="mx-auto w-full flex flex-col gap-6 max-w-7xl ">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Gestor de Plantillas</h1>
                    <p className="text-muted-foreground">
                        Crea, edita y gestiona tus plantillas de comunicación.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
                    <div className="lg:col-span-1 h-full">
                        <TemplateLibrary
                            templates={templates}
                            selectedTemplateId={selectedTemplate?.id || null}
                            onSelectTemplate={handleSelectTemplate}
                            onAddNew={handleAddNewClick}
                        />
                    </div>

                    <div className="lg:col-span-2 h-full">
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
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
