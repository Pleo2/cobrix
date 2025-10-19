"use client"

import { useState } from "react"
import { TemplateLibrary } from "../../../../../components/acount/templates-manager/template-library"
import { TemplateEditor } from "../../../../../components/acount/templates-manager/template-editor"
import { defaultTemplates, type Template } from "./data"

export default function TemplatesManagerPage() {
    const [templates, setTemplates] = useState<Template[]>(defaultTemplates)
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0] || null)

    const handleSelectTemplate = (template: Template) => {
        setSelectedTemplate(template)
    }

    const handleSaveChanges = (updatedTemplate: Template) => {
        setTemplates((prevTemplates) => prevTemplates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
        setSelectedTemplate(updatedTemplate)
        console.log("Plantilla guardada:", updatedTemplate)
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex flex-col gap-4 py-6 md:py-8 px-4 lg:px-6 h-full">
                    <div className="mx-auto w-full flex flex-col gap-4 max-w-7xl h-full">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Gestor de Plantillas de Notificaciones</h1>
                            <p className="text-muted-foreground mt-1.5 text-balance">
                                Crea y personaliza las plantillas de mensajes para comunicarte con tus clientes.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
                            <div className="lg:col-span-1 h-full min-h-0">
                                <TemplateLibrary
                                    templates={templates}
                                    selectedTemplateId={selectedTemplate?.id || null}
                                    onSelectTemplate={handleSelectTemplate}
                                />
                            </div>

                            <div className="lg:col-span-2 h-full min-h-0">
                                <TemplateEditor template={selectedTemplate} onSaveChanges={handleSaveChanges} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
