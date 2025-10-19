"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { InvoicesDataTable } from "@/components/acount/dashboard/invoices-data-table";
import { useDashboardStore } from "@/store/dashboard-store";
import { useEffect } from "react";

export default function InvoicesPage() {
    const invoices = useDashboardStore((state) => state.invoices);
    const hasHydrated = useDashboardStore((state) => state._hasHydrated);
    const initializeFromLocalStorage = useDashboardStore(
        (state) => state.initializeFromLocalStorage
    );
    const resetInvoices = useDashboardStore((state) => state.resetInvoices);
    const getPaidInvoicesCount = useDashboardStore((state) => state.getPaidInvoicesCount);
    const getPendingInvoicesCount = useDashboardStore((state) => state.getPendingInvoicesCount);
    const getOverdueInvoicesCount = useDashboardStore((state) => state.getOverdueInvoicesCount);

    useEffect(() => {
        // Inicializar desde localStorage en el primer render
        initializeFromLocalStorage();

        // Verificar si los invoices tienen la estructura correcta
        if (invoices.length > 0 && !invoices[0].invoice_number) {
            // Estructura incorrecta detectada, resetear a datos iniciales
            resetInvoices();
        }
    }, [initializeFromLocalStorage, invoices, resetInvoices]);

    // Evitar hydration mismatch esperando a que el store se hidrate
    if (!hasHydrated) {
        return (
            <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                Recibos
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground">
                                Cargando recibos...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const paidCount = getPaidInvoicesCount();
    const pendingCount = getPendingInvoicesCount();
    const overdueCount = getOverdueInvoicesCount();

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                Recibos
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground">
                                Gestiona todos tus recibos y facturas ({invoices.length})
                            </p>
                        </div>
                        <Button size="sm" className="gap-2 shrink-0">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Nuevo Recibo</span>
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {invoices.length === 0 && (
                            <Button onClick={() => resetInvoices()} variant="outline" size="sm">
                                🔄 Cargar Recibos
                            </Button>
                        )}
                        <Badge
                            variant="outline"
                            className="px-3 py-1.5 bg-green-100 text-green-700 border-green-200"
                        >
                            <span className="opacity-70 text-xs">Pagados</span>
                            <span className="ml-1.5 font-bold text-sm">{paidCount}</span>
                        </Badge>
                        <Badge
                            variant="outline"
                            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 border-yellow-200"
                        >
                            <span className="opacity-70 text-xs">Pendientes</span>
                            <span className="ml-1.5 font-bold text-sm">{pendingCount}</span>
                        </Badge>
                        <Badge
                            variant="outline"
                            className="px-3 py-1.5 bg-red-100 text-red-700 border-red-200"
                        >
                            <span className="opacity-70 text-xs">Vencidos</span>
                            <span className="ml-1.5 font-bold text-sm">{overdueCount}</span>
                        </Badge>
                    </div>
                </div>

                <InvoicesDataTable data={invoices} />
            </div>
        </div>
    );
}
