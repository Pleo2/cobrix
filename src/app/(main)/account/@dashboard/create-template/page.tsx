"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Layout, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const screenTemplates = [
    {
        id: 1,
        title: "Dashboard Principal",
        description: "Panel de control personalizado con widgets y gráficos en tiempo real.",
        category: "Dashboard",
        icon: Layout,
        color: "bg-indigo-500",
    },
    {
        id: 2,
        title: "Gestión de Clientes",
        description: "Pantalla para administrar y visualizar información de clientes.",
        category: "Gestión",
        icon: Layout,
        color: "bg-blue-500",
    },
    {
        id: 3,
        title: "Reportes Avanzados",
        description: "Plantilla para crear reportes personalizados con múltiples vistas.",
        category: "Reportes",
        icon: Layout,
        color: "bg-green-500",
    },
    {
        id: 4,
        title: "Configuración del Sistema",
        description: "Pantalla para configurar parámetros y preferencias del sistema.",
        category: "Configuración",
        icon: Layout,
        color: "bg-orange-500",
    },
];

function ScreenCard({ screen }: { screen: (typeof screenTemplates)[0] }) {
    const Icon = screen.icon;

    return (
        <Link href={`/account/create-template/${screen.id}`}>
            <Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="h-full flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Icon className={`h-5 w-5 text-white ${screen.color}`} />
                                <CardTitle className="text-lg">{screen.title}</CardTitle>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">
                                {screen.category}
                            </span>
                        </div>
                        <Copy className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription className="text-sm">{screen.description}</CardDescription>
                    <Button variant="outline" size="sm" className="w-fit">
                        Ver Detalle
                    </Button>
                </CardHeader>
            </Card>
        </Link>
    );
}

function NewScreenCard() {
    return (
        <Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 border-dashed border-2 flex items-center justify-center min-h-[300px]">
            <Link href="/account/create-template/new" className="w-full h-full">
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <p className="text-center text-muted-foreground font-medium">Nueva Pantalla</p>
                </div>
            </Link>
        </Card>
    );
}

export default function CreateTemplatePage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredScreens = screenTemplates.filter(
        (screen) =>
            screen.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            screen.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Creación de Pantallas</h2>
                        <p className="text-muted-foreground">
                            Diseñe pantallas personalizadas para su negocio
                        </p>
                    </div>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Crear Pantalla
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
                        {filteredScreens.map((screen) => (
                            <ScreenCard key={screen.id} screen={screen} />
                        ))}
                        <NewScreenCard />
                    </div>
                </div>

                {/* Mensaje cuando no hay resultados */}
                {filteredScreens.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No se encontraron pantallas que coincidan con tu búsqueda
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
