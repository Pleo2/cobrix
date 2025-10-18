"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Plus, Search } from "lucide-react";
import { useState } from "react";

const receiptsData = [
    {
        id: 1,
        number: "REC-001",
        date: "2024-10-15",
        client: "Cliente A",
        amount: "$1,250.00",
        status: "Pagado",
    },
    {
        id: 2,
        number: "REC-002",
        date: "2024-10-14",
        client: "Cliente B",
        amount: "$2,500.00",
        status: "Pendiente",
    },
    {
        id: 3,
        number: "REC-003",
        date: "2024-10-13",
        client: "Cliente C",
        amount: "$750.00",
        status: "Pagado",
    },
    {
        id: 4,
        number: "REC-004",
        date: "2024-10-12",
        client: "Cliente D",
        amount: "$3,000.00",
        status: "Vencido",
    },
    {
        id: 5,
        number: "REC-005",
        date: "2024-10-11",
        client: "Cliente E",
        amount: "$1,500.00",
        status: "Pagado",
    },
];

export default function ReceiptsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredReceipts = receiptsData.filter(
        (receipt) =>
            receipt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receipt.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pagado":
                return "bg-green-100 text-green-800";
            case "Pendiente":
                return "bg-yellow-100 text-yellow-800";
            case "Vencido":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="flex h-screen flex-col">
            <div className="flex flex-1 flex-col overflow-auto">
                <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Recibos</h2>
                        <p className="text-muted-foreground">
                            Gestiona y descarga tus recibos y facturas
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mis Recibos</CardTitle>
                            <CardDescription>Todos tus recibos registrados</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por número o cliente..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Nuevo Recibo
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2 font-medium">
                                                Número
                                            </th>
                                            <th className="text-left py-3 px-2 font-medium">
                                                Fecha
                                            </th>
                                            <th className="text-left py-3 px-2 font-medium">
                                                Cliente
                                            </th>
                                            <th className="text-left py-3 px-2 font-medium">
                                                Monto
                                            </th>
                                            <th className="text-left py-3 px-2 font-medium">
                                                Estado
                                            </th>
                                            <th className="text-left py-3 px-2 font-medium">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReceipts.map((receipt) => (
                                            <tr
                                                key={receipt.id}
                                                className="border-b hover:bg-muted/50"
                                            >
                                                <td className="py-3 px-2 font-mono">
                                                    {receipt.number}
                                                </td>
                                                <td className="py-3 px-2">{receipt.date}</td>
                                                <td className="py-3 px-2">{receipt.client}</td>
                                                <td className="py-3 px-2 font-semibold">
                                                    {receipt.amount}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                                            receipt.status
                                                        )}`}
                                                    >
                                                        {receipt.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="gap-1"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Descargar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredReceipts.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        No se encontraron recibos
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
