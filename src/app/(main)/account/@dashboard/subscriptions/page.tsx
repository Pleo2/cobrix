"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function SubscriptionsPage() {
    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Suscripciones</h2>
                <p className="text-muted-foreground">
                    Gestiona todas tus suscripciones y planes activos
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Mis Suscripciones</CardTitle>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nueva Suscripción
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No hay suscripciones registradas aún.</p>
                </CardContent>
            </Card>
        </div>
    );
}
