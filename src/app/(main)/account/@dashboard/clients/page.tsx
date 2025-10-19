"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientsDataTable } from "@/components/acount/dashboard/clients-data-table";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/dashboard-store";
import { useEffect } from "react";

export default function ClientsPage() {
    const router = useRouter();
    const clients = useDashboardStore((state) => state.clients);
    const hasHydrated = useDashboardStore((state) => state._hasHydrated);
    const initializeFromLocalStorage = useDashboardStore(
        (state) => state.initializeFromLocalStorage
    );

    useEffect(() => {
        // Inicializar desde localStorage en el primer render (migrar datos antiguos si existen)
        initializeFromLocalStorage();
    }, [initializeFromLocalStorage]);

    // Evitar hydration mismatch esperando a que el store se hidrate desde localStorage
    if (!hasHydrated) {
        return (
            <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                            <p className="text-muted-foreground">Cargando clientes...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                        <p className="text-muted-foreground">
                            Gestiona todos tus clientes registrados ({clients.length})
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => router.push("/account/new-client")}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Cliente
                    </Button>
                </div>

                <ClientsDataTable data={clients} />
            </div>
        </div>
    );
}
