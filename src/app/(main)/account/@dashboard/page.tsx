"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Users, CreditCard, Plus, BarChart3 } from "lucide-react";

const quickAccess = [
    {
        title: "Panel",
        description: "Ver estadísticas y análisis",
        href: "/account/dashboard",
        icon: BarChart3,
        color: "bg-indigo-500",
    },
    {
        title: "Clientes",
        description: "Gestionar clientes",
        href: "/account/clients",
        icon: Users,
        color: "bg-blue-500",
    },
    {
        title: "Recibos",
        description: "Gestionar recibos y facturas",
        href: "/account/invoices",
        icon: FileText,
        color: "bg-green-500",
    },
    {
        title: "Suscripciones",
        description: "Ver suscripciones activas",
        href: "/account/subscriptions",
        icon: CreditCard,
        color: "bg-purple-500",
    },
    {
        title: "Nuevo Cliente",
        description: "Registrar cliente nuevo",
        href: "/account/new-client",
        icon: Plus,
        color: "bg-orange-500",
    },
];

export default function HomePage() {
    return (
        <div className="flex h-screen flex-col">
            <div className="flex flex-1 flex-col overflow-auto">
                <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Bienvenido a Cobrix</h2>
                        <p className="text-muted-foreground">
                            Gestiona tus documentos, recibos, suscripciones y clientes en un solo
                            lugar.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {quickAccess.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">
                                                        {item.title}
                                                    </CardTitle>
                                                    <CardDescription className="mt-1">
                                                        {item.description}
                                                    </CardDescription>
                                                </div>
                                                <div className={`${item.color} p-2 rounded-lg`}>
                                                    <Icon className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
