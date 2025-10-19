"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MessageSquare, Plus, FileText, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const messageTemplates = [
    {
        id: 1,
        title: "Bienvenida al Cliente",
        description:
            "Mensaje de bienvenida para nuevos clientes que se suscriben a nuestros servicios.",
        category: "Bienvenida",
        icon: MessageSquare,
        color: "bg-blue-500",
    },
    {
        id: 2,
        title: "Renovación de Suscripción",
        description: "Aviso para clientes sobre próxima renovación de su suscripción.",
        category: "Renovación",
        icon: MessageSquare,
        color: "bg-purple-500",
    },
    {
        id: 3,
        title: "Confirmación de Pago",
        description: "Confirmación al cliente cuando se recibe un pago exitoso.",
        category: "Pagos",
        icon: MessageSquare,
        color: "bg-green-500",
    },
    {
        id: 4,
        title: "Recordatorio de Vencimiento",
        description: "Recordatorio a cliente sobre vencimiento próximo de su servicio.",
        category: "Recordatorios",
        icon: MessageSquare,
        color: "bg-orange-500",
    },
];

function TemplateCard({ template }: { template: (typeof messageTemplates)[0] }) {
    const Icon = template.icon;

    return (
        <Link href={`/account/message-handler/${template.id}`}>
            <Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="h-full flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Icon className={`h-5 w-5 text-white ${template.color}`} />
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">
                                {template.category}
                            </span>
                        </div>
                        <Copy className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                    <Button variant="outline" size="sm" className="w-fit">
                        Ver Detalle
                    </Button>
                </CardHeader>
            </Card>
        </Link>
    );
}

function NewTemplateCard() {
    return (
        <Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 border-dashed border-2 flex items-center justify-center min-h-[300px]">
            <Link href="/account/message-handler/new" className="w-full h-full">
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <p className="text-center text-muted-foreground font-medium">Nueva Plantilla</p>
                </div>
            </Link>
        </Card>
    );
}

export default function MessageHandlerPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTemplates = messageTemplates.filter(
        (template) =>
            template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Plantillas de Mensajes
                        </h2>
                        <p className="text-muted-foreground">
                            Gestione sus plantillas para comunicación con clientes
                        </p>
                    </div>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Crear Plantilla
                    </Button>
                </div>

                {/* Barra de búsqueda */}
                <Input
                    placeholder="Buscar plantillas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />

                {/* Bento Grid */}
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTemplates.map((template) => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                        <NewTemplateCard />
                    </div>
                </div>

                {/* Mensaje cuando no hay resultados */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No se encontraron plantillas que coincidan con tu búsqueda
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
