"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InvoicesDataTable } from "@/components/acount/dashboard/invoices-data-table";
import { useDashboardStore } from "@/store/dashboard-store";

export default function InvoicesPage() {
    const invoices = useDashboardStore((state) => state.invoices);

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8  max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight">Recibos</h2>
                    <p className="text-muted-foreground">Gestiona todos tus recibos y facturas</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Recibo
                </Button>
            </div>

            <InvoicesDataTable data={invoices} />
        </div>
    );
}
