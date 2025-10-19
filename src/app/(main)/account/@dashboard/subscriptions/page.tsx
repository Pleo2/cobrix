"use client";

import { SubscriptionsTable } from "@/components/acount/suscriptions/subscriptions-table";
import { useDashboardStore } from "@/store/dashboard-store";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SubscriptionsPage() {
    const subscriptions = useDashboardStore((state) => state.subscriptions);
    const hasHydrated = useDashboardStore((state) => state._hasHydrated);
    const initializeFromLocalStorage = useDashboardStore(
        (state) => state.initializeFromLocalStorage
    );
    const resetSubscriptions = useDashboardStore((state) => state.resetSubscriptions);
    const getActiveSubscriptionsCount = useDashboardStore(
        (state) => state.getActiveSubscriptionsCount
    );
    const getCancelledSubscriptionsCount = useDashboardStore(
        (state) => state.getCancelledSubscriptionsCount
    );
    const getAppealSubscriptionsCount = useDashboardStore(
        (state) => state.getAppealSubscriptionsCount
    );

    useEffect(() => {
        // Inicializar desde localStorage en el primer render
        initializeFromLocalStorage();

        // Verificar si las suscripciones tienen la estructura correcta
        if (subscriptions.length > 0 && !subscriptions[0].clientName) {
            // Estructura incorrecta detectada, resetear a datos iniciales
            resetSubscriptions();
        }
    }, [initializeFromLocalStorage, subscriptions, resetSubscriptions]);

    // Evitar hydration mismatch esperando a que el store se hidrate
    if (!hasHydrated) {
        return (
            <div className="flex max-h-max flex-col">
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                        <div className="mx-auto w-full flex flex-col gap-6 max-w-7xl">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-3xl font-bold tracking-tight">Suscripciones</h2>
                                <p className="text-muted-foreground">Cargando suscripciones...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const activeCount = getActiveSubscriptionsCount();
    const cancelledCount = getCancelledSubscriptionsCount();
    const appealCount = getAppealSubscriptionsCount();

    return (
        <div className="flex max-h-max flex-col">
            <div className="flex flex-1 flex-col ">
                <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6"></div>
                <div className="mx-auto w-full flex flex-col gap-6 max-w-7xl">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-3xl font-bold tracking-tight">Suscripciones</h2>
                                <p className="text-muted-foreground">
                                    Gestiona y visualiza a todos tus clientes y sus planes.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {subscriptions.length === 0 && (
                                    <Button
                                        onClick={() => resetSubscriptions()}
                                        variant="outline"
                                        size="sm"
                                    >
                                        🔄 Cargar Suscripciones
                                    </Button>
                                )}
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1.5 bg-green-100 text-green-700 border-green-200"
                                >
                                    <span className="opacity-70 text-xs">Activos</span>
                                    <span className="ml-1.5 font-bold text-sm">{activeCount}</span>
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1.5 bg-yellow-100 text-yellow-700 border-yellow-200"
                                >
                                    <span className="opacity-70 text-xs">En Apelación</span>
                                    <span className="ml-1.5 font-bold text-sm">{appealCount}</span>
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1.5 bg-red-100 text-red-700 border-red-200"
                                >
                                    <span className="opacity-70 text-xs">Cancelados</span>
                                    <span className="ml-1.5 font-bold text-sm">
                                        {cancelledCount}
                                    </span>
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <SubscriptionsTable data={subscriptions} />
                </div>
            </div>
        </div>
    );
}
