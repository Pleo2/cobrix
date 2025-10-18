"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    InvoicesDataTable,
    invoiceSchema,
} from "@/components/acount/dashboard/invoices-data-table";
import { z } from "zod";

// Datos de ejemplo para facturas
const invoicesData: z.infer<typeof invoiceSchema>[] = [
    {
        id: 1,
        invoice_number: "INV-2024-001",
        client: "Jack Alfredo",
        email: "jack@shadcnstudio.com",
        amount: "$50.00",
        status: "Pagado",
        date: "2025-09-15",
        due_date: "2025-10-15",
        plan_type: "Profesional",
        payment_method: "Pago Móvil",
        exchange_rate: "1.0",
    },
    {
        id: 2,
        invoice_number: "INV-2024-002",
        client: "Maria Gonzalez",
        email: "maria.g@shadcnstudio.com",
        amount: "$30.00",
        status: "Pendiente",
        date: "2025-10-20",
        due_date: "2025-11-20",
        plan_type: "Básico",
        payment_method: "Zelle",
        exchange_rate: "1.0",
    },
    {
        id: 3,
        invoice_number: "INV-2024-003",
        client: "John Doe",
        email: "john.doe@shadcnstudio.com",
        amount: "$70.00",
        status: "Pagado",
        date: "2025-09-10",
        due_date: "2025-10-10",
        plan_type: "Premium",
        payment_method: "Transferencia",
        exchange_rate: "1.0",
    },
    {
        id: 4,
        invoice_number: "INV-2024-004",
        client: "Emily Carter",
        email: "emily.carter@shadcnstudio.com",
        amount: "$50.00",
        status: "Fallida",
        date: "2025-08-20",
        due_date: "2025-09-20",
        plan_type: "Profesional",
        payment_method: "Binance",
        exchange_rate: "1.0",
    },
    {
        id: 5,
        invoice_number: "INV-2024-005",
        client: "David Lee",
        email: "david.lee@shadcnstudio.com",
        amount: "$70.00",
        status: "Pagado",
        date: "2025-09-05",
        due_date: "2025-10-05",
        plan_type: "Premium",
        payment_method: "Pago Móvil",
        exchange_rate: "1.0",
    },
    {
        id: 6,
        invoice_number: "INV-2024-006",
        client: "Sarah Johnson",
        email: "sarah.j@shadcnstudio.com",
        amount: "$30.00",
        status: "Pendiente",
        date: "2025-10-18",
        due_date: "2025-11-18",
        plan_type: "Básico",
        payment_method: "Transferencia",
        exchange_rate: "1.0",
    },
];

export default function InvoicesPage() {
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

            <InvoicesDataTable data={invoicesData} />
        </div>
    );
}
