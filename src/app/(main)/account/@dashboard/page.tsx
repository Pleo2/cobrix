"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Users, CreditCard, BarChart3, Plus, Check } from "lucide-react";

const quickAccess = [
    {
        id: "panel",
        id: "panel",
        title: "Panel",
        description: "Ver estadísticas y análisis",
        href: "/account/dashboard",
        icon: BarChart3,
        color: "bg-indigo-500",
        size: "large",
        features: ["Gráficos en tiempo real", "Análisis detallado", "Exportar reportes"],
    },
    {
        id: "new-client",
        title: "Nuevo Cliente",
        description: "Registra un nuevo cliente en el sistema",
        href: "/account/new-client",
        icon: Plus,
        color: "bg-orange-500",
        size: "small",
        features: ["Formulario completo", "Validación automática"],
    },
    {
        id: "subscriptions",
        title: "Suscripciones",
        description: "Gestiona todas tus suscripciones y planes activos",
        description: "Gestiona todas tus suscripciones y planes activos",
        href: "/account/subscriptions",
        icon: CreditCard,
        color: "bg-purple-500",
        size: "small",
        features: ["Planes personalizados", "Control total"],
    },
    {
        id: "invoices",
        title: "Recibos",
        description: "Gestiona todos tus recibos y facturas",
        href: "/account/invoices",
        icon: FileText,
        color: "bg-green-500",
        size: "small",
        features: ["Generación automática", "Historial completo"],
    },
    {
        id: "clients",
        title: "Clientes",
        description: "Gestiona todos tus clientes",
        href: "/account/clients",
        icon: Users,
        color: "bg-blue-500",
        size: "small",
        features: ["Base de datos centralizada", "Búsqueda rápida"],
    },
];

function BentoItem({ item }: { item: (typeof quickAccess)[0] }) {
    const Icon = item.icon;
    const isLarge = item.size === "large";

    // Mapping de colores Tailwind a valores RGB
    const colorRgbMap: Record<string, string> = {
        "bg-indigo-500": "99, 102, 241",
        "bg-orange-500": "249, 115, 22",
        "bg-purple-500": "168, 85, 247",
        "bg-green-500": "34, 197, 94",
        "bg-blue-500": "59, 130, 246",
    };

    const rgbColor = colorRgbMap[item.color] || "99, 102, 241";

    return (
        <Link href={item.href}>
            <Card
                className={`h-full transition-all duration-300 cursor-pointer bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card overflow-hidden flex flex-col relative group hover:shadow-2xl hover:-translate-y-1 ${isLarge ? "row-span-2" : ""
                    }`}
            >
                {/* Overlay gradiente en hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none rounded-[inherit]"
                    style={{
                        background: `linear-gradient(135deg, rgb(${rgbColor}), transparent)`,
                    }}
                />

                {/* Border accent en hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit] border"
                    style={{
                        borderColor: `rgba(${rgbColor}, 0.3)`,
                    }}
                />

                <CardHeader
                    className={`h-full flex flex-col justify-between gap-4 pb-4 relative z-10 ${isLarge ? "flex-row items-start" : ""
                        }`}
                >
                    {/* Header con ícono y título */}
                    <div
                        className={`flex items-start justify-between gap-4 ${isLarge ? "flex-col flex-1" : ""
                            }`}
                    >
                        <div className="flex-1">
                            <Icon className="text-white h-5 w-5" />
                            <CardTitle className={isLarge ? "text-2xl" : "text-lg"}>
                                {item.title}
                            </CardTitle>
                        </div>
                        {isLarge && (
                            <div className="opacity-10 group-hover:opacity-20 transition-opacity duration-300 hidden">
                                <Icon className="h-24 w-24" />
                            </div>
                        )}
                    </div>

                    {/* Descripción */}
                    <div className={isLarge ? "flex-1" : ""}>
                        <CardDescription className="text-sm leading-relaxed">
                            {item.description}
                        </CardDescription>
                    </div>

                    {/* Preview del gráfico para tarjeta grande */}
                    {isLarge && (
                        <div className="flex-1 flex items-center justify-center min-h-[200px]">
                            {/* Gráfico aquí */}
                        </div>
                    )}

                    {/* Lista de características (solo para tarjetas pequeñas) */}
                    {!isLarge && (
                        <div className="space-y-2 flex-1">
                            {item.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardHeader>
            </Card>
        </Link>
    );
}

function BentoItem({ item }: { item: (typeof quickAccess)[0] }) {
    const Icon = item.icon;
    const isLarge = item.size === "large";

    // Mapping de colores Tailwind a valores RGB
    const colorRgbMap: Record<string, string> = {
        "bg-indigo-500": "99, 102, 241",
        "bg-orange-500": "249, 115, 22",
        "bg-purple-500": "168, 85, 247",
        "bg-green-500": "34, 197, 94",
        "bg-blue-500": "59, 130, 246",
    };

    const rgbColor = colorRgbMap[item.color] || "99, 102, 241";

    return (
        <div className="flex max-h-max flex-col">
            <div className="flex flex-1 flex-col ">
                <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Bienvenido a Cobrix</h2>
                        <p className="text-muted-foreground">
                            Gestiona tus documentos, recibos, suscripciones y clientes en un solo
                            lugar.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
                        {/* Panel - Grande (ocupa 2 columnas y 2 filas = 50%) */}
                        <div className="md:col-span-2 md:row-span-2">
                            <BentoItem item={quickAccess[0]} />
                        </div>

                        {/* Nuevo Cliente - Pequeño (25%) */}
                        <div className="md:col-span-2">
                            <BentoItem item={quickAccess[1]} />
                        </div>

                        {/* Suscripciones - Pequeño (25%) */}
                        <div className="md:col-span-2">
                            <BentoItem item={quickAccess[2]} />
                        </div>

                        {/* Recibos - Mediano (50%) */}
                        <div className="md:col-span-2">
                            <BentoItem item={quickAccess[3]} />
                        </div>

                        {/* Clientes - Mediano (50%) */}
                        <div className="md:col-span-2">
                            <BentoItem item={quickAccess[4]} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
