"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Datos de ejemplo para transacciones recientes
const transactionsData = [
    {
        id: 1,
        name: "Jack Alfredo",
        email: "jack@shadcnstudio.com",
        amount: "$316.00",
        status: "Completado",
        statusColor: "bg-green-100 text-green-700",
        paymentMethod: "mastercard",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
        date: "Hoy",
    },
    {
        id: 2,
        name: "Maria Gonzalez",
        email: "maria.g@shadcnstudio.com",
        amount: "$253.40",
        status: "Pendiente",
        statusColor: "bg-yellow-100 text-yellow-700",
        paymentMethod: "visa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        date: "Hoy",
    },
    {
        id: 3,
        name: "John Doe",
        email: "john.doe@shadcnstudio.com",
        amount: "$852.00",
        status: "Completado",
        statusColor: "bg-green-100 text-green-700",
        paymentMethod: "mastercard",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        date: "Ayer",
    },
    {
        id: 4,
        name: "Emily Carter",
        email: "emily.carter@shadcnstudio.com",
        amount: "$889.00",
        status: "Procesando",
        statusColor: "bg-blue-100 text-blue-700",
        paymentMethod: "visa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        date: "Ayer",
    },
    {
        id: 5,
        name: "David Lee",
        email: "david.lee@shadcnstudio.com",
        amount: "$723.16",
        status: "Completado",
        statusColor: "bg-green-100 text-green-700",
        paymentMethod: "mastercard",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        date: "Hace 2 días",
    },
];

function PaymentMethodIcon({ method }: { method: "mastercard" | "visa" }) {
    if (method === "visa") {
        return <span className="text-sm font-semibold text-blue-600">VISA</span>;
    }
    return (
        <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
        </div>
    );
}

export function RecentTransactions() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(transactionsData.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = transactionsData.slice(startIndex, endIndex);

    return (
        <Card className="overflow-hidden">
            <div className="px-4 lg:px-6 py-4 border-b">
                <h3 className="font-semibold">Transacciones Recientes</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                                Cliente
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                                Monto
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                                Estado
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                                Método de Pago
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((transaction) => (
                            <tr
                                key={transaction.id}
                                className="border-b hover:bg-muted/50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={transaction.avatar}
                                                alt={transaction.name}
                                            />
                                            <AvatarFallback>
                                                {transaction.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-medium text-sm">
                                                {transaction.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right font-medium">
                                    {transaction.amount}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <Badge
                                        variant="outline"
                                        className={`${transaction.statusColor}`}
                                    >
                                        {transaction.status}
                                    </Badge>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <PaymentMethodIcon
                                        method={transaction.paymentMethod as "mastercard" | "visa"}
                                    />
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                            <DropdownMenuItem>Descargar recibo</DropdownMenuItem>
                                            <DropdownMenuItem>Contactar cliente</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
                <p className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, transactionsData.length)} de{" "}
                    {transactionsData.length} transacciones
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-10"
                        >
                            {page}
                        </Button>
                    ))}
                    {totalPages > 5 && (
                        <span className="px-2 text-sm text-muted-foreground">...</span>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </Card>
    );
}
