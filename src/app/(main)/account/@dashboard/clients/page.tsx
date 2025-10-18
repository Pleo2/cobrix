"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientsDataTable, clientSchema } from "@/components/acount/dashboard/clients-data-table";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<z.infer<typeof clientSchema>[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Obtener clientes del localStorage
        const storedClients = JSON.parse(localStorage.getItem("clients") || "[]");
        setClients(storedClients);

        // Guardar el conteo
        localStorage.setItem("clientsCount", storedClients.length.toString());

        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                <div className="max-w-7xl mx-auto w-full">
                    <p>Cargando clientes...</p>
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
                            Gestiona todos tus clientes registrados
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
