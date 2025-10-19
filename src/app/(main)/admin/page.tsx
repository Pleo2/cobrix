"use client";

import { CheckoutLinkGenerator } from "@/components/acount/dashboard/checkout-link-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard-store";
import {
    Trash2,
    Database,
    Users,
    CreditCard,
    FileText,
    MessageSquare,
    AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminPage() {
    const clients = useDashboardStore((state) => state.clients);
    const subscriptions = useDashboardStore((state) => state.subscriptions);
    const transactions = useDashboardStore((state) => state.transactions);
    const invoices = useDashboardStore((state) => state.invoices);
    const messageTemplates = useDashboardStore((state) => state.messageTemplates);
    const resetStore = useDashboardStore((state) => state.resetStore);
    const resetSubscriptions = useDashboardStore((state) => state.resetSubscriptions);
    const resetInvoices = useDashboardStore((state) => state.resetInvoices);

    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const handleDeleteAllClients = () => {
        if (confirmDelete === "clients") {
            // Eliminar todos los clientes usando el store
            const count = clients.length;
            clients.forEach((client) => {
                useDashboardStore.getState().deleteClient(client.id);
            });
            setConfirmDelete(null);
            toast.success("Clientes eliminados", {
                description: `Se eliminaron ${count} cliente(s) del sistema`,
            });
        } else {
            setConfirmDelete("clients");
        }
    };

    const handleDeleteAllSubscriptions = () => {
        if (confirmDelete === "subscriptions") {
            const count = subscriptions.length;
            subscriptions.forEach((sub) => {
                useDashboardStore.getState().deleteSubscription(sub.id);
            });
            setConfirmDelete(null);
            toast.success("Suscripciones eliminadas", {
                description: `Se eliminaron ${count} suscripción(es) del sistema`,
            });
        } else {
            setConfirmDelete("subscriptions");
        }
    };

    const handleDeleteAllTransactions = () => {
        if (confirmDelete === "transactions") {
            const count = transactions.length;
            transactions.forEach((trans) => {
                useDashboardStore.getState().deleteTransaction(trans.id);
            });
            setConfirmDelete(null);
            toast.success("Transacciones eliminadas", {
                description: `Se eliminaron ${count} transacción(es) del sistema`,
            });
        } else {
            setConfirmDelete("transactions");
        }
    };

    const handleDeleteAllInvoices = () => {
        if (confirmDelete === "invoices") {
            const count = invoices.length;
            invoices.forEach((inv) => {
                useDashboardStore.getState().deleteInvoice(inv.id);
            });
            setConfirmDelete(null);
            toast.success("Facturas eliminadas", {
                description: `Se eliminaron ${count} factura(s) del sistema`,
            });
        } else {
            setConfirmDelete("invoices");
        }
    };

    const handleResetEverything = () => {
        if (confirmDelete === "everything") {
            if (
                confirm(
                    "⚠️ ADVERTENCIA: Esto eliminará TODOS los datos del sistema (clientes, suscripciones, transacciones, facturas, plantillas). Esta acción NO se puede deshacer. ¿Estás completamente seguro?"
                )
            ) {
                resetStore();
                setConfirmDelete(null);
                toast.success("Sistema reiniciado", {
                    description: "Todos los datos han sido eliminados. La página se recargará...",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } else {
            setConfirmDelete("everything");
        }
    };

    const handleResetToDefaults = () => {
        if (
            confirm(
                "¿Deseas resetear el sistema a los datos de ejemplo? Esto restaurará las transacciones, facturas y suscripciones por defecto."
            )
        ) {
            resetSubscriptions();
            resetInvoices();
            setConfirmDelete(null);
            toast.success("Datos restaurados", {
                description: "Los datos de ejemplo han sido cargados. La página se recargará...",
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Panel de Administración</h2>
                <p className="text-muted-foreground">
                    Herramientas de administración para gestionar tu negocio
                </p>
            </div>

            {/* Estadísticas del Sistema */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Estado del Sistema
                    </CardTitle>
                    <CardDescription>
                        Resumen de todos los datos almacenados en el sistema
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 rounded-lg border bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                            <p className="text-2xl font-bold">{clients.length}</p>
                            <p className="text-xs text-muted-foreground">Clientes</p>
                        </div>
                        <div className="text-center p-4 rounded-lg border bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                            <CreditCard className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                            <p className="text-2xl font-bold">{subscriptions.length}</p>
                            <p className="text-xs text-muted-foreground">Suscripciones</p>
                        </div>
                        <div className="text-center p-4 rounded-lg border bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                            <Database className="h-6 w-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                            <p className="text-2xl font-bold">{transactions.length}</p>
                            <p className="text-xs text-muted-foreground">Transacciones</p>
                        </div>
                        <div className="text-center p-4 rounded-lg border bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                            <FileText className="h-6 w-6 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                            <p className="text-2xl font-bold">{invoices.length}</p>
                            <p className="text-xs text-muted-foreground">Facturas</p>
                        </div>
                        <div className="text-center p-4 rounded-lg border bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800">
                            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-pink-600 dark:text-pink-400" />
                            <p className="text-2xl font-bold">{messageTemplates.length}</p>
                            <p className="text-xs text-muted-foreground">Plantillas</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Generador de Enlaces */}
                <CheckoutLinkGenerator />

                {/* Gestión de Datos */}
                <Card className="border-red-200 dark:border-red-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-5 w-5" />
                            Gestión de Datos
                        </CardTitle>
                        <CardDescription>
                            Elimina o restaura datos del sistema. ¡Ten cuidado con estas acciones!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {/* Eliminar Clientes */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Clientes</p>
                                    <p className="text-xs text-muted-foreground">
                                        {clients.length} registros
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant={confirmDelete === "clients" ? "destructive" : "outline"}
                                size="sm"
                                onClick={handleDeleteAllClients}
                                disabled={clients.length === 0}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                {confirmDelete === "clients" ? "¿Confirmar?" : "Eliminar"}
                            </Button>
                        </div>

                        {/* Eliminar Suscripciones */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Suscripciones</p>
                                    <p className="text-xs text-muted-foreground">
                                        {subscriptions.length} registros
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant={
                                    confirmDelete === "subscriptions" ? "destructive" : "outline"
                                }
                                size="sm"
                                onClick={handleDeleteAllSubscriptions}
                                disabled={subscriptions.length === 0}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                {confirmDelete === "subscriptions" ? "¿Confirmar?" : "Eliminar"}
                            </Button>
                        </div>

                        {/* Eliminar Transacciones */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <Database className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Transacciones</p>
                                    <p className="text-xs text-muted-foreground">
                                        {transactions.length} registros
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant={
                                    confirmDelete === "transactions" ? "destructive" : "outline"
                                }
                                size="sm"
                                onClick={handleDeleteAllTransactions}
                                disabled={transactions.length === 0}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                {confirmDelete === "transactions" ? "¿Confirmar?" : "Eliminar"}
                            </Button>
                        </div>

                        {/* Eliminar Facturas */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Facturas</p>
                                    <p className="text-xs text-muted-foreground">
                                        {invoices.length} registros
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant={confirmDelete === "invoices" ? "destructive" : "outline"}
                                size="sm"
                                onClick={handleDeleteAllInvoices}
                                disabled={invoices.length === 0}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                {confirmDelete === "invoices" ? "¿Confirmar?" : "Eliminar"}
                            </Button>
                        </div>

                        <Separator className="my-4" />

                        {/* Restaurar Datos por Defecto */}
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleResetToDefaults}
                            >
                                🔄 Restaurar Datos de Ejemplo
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Restaura transacciones, facturas y suscripciones de ejemplo
                            </p>
                        </div>

                        <Separator className="my-4" />

                        {/* Eliminar TODO */}
                        <div className="p-3 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                            <div className="flex items-start gap-2 mb-3">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                                        Zona de Peligro
                                    </p>
                                    <p className="text-xs text-red-700 dark:text-red-300">
                                        Elimina TODO del sistema. Esta acción NO se puede deshacer.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant={confirmDelete === "everything" ? "destructive" : "outline"}
                                className="w-full"
                                onClick={handleResetEverything}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {confirmDelete === "everything"
                                    ? "⚠️ CLICK PARA CONFIRMAR"
                                    : "Eliminar TODO el Sistema"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Información Adicional */}
            <Card>
                <CardHeader>
                    <CardTitle>Información del Sistema</CardTitle>
                    <CardDescription>Detalles técnicos y de almacenamiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-muted-foreground">Almacenamiento:</span>
                        <Badge variant="outline">LocalStorage (Navegador)</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-muted-foreground">Clave de Persistencia:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                            dashboard-storage
                        </code>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground">Estado Manager:</span>
                        <Badge variant="outline">Zustand + Persist</Badge>
                    </div>
                    <div className="pt-3 text-xs text-muted-foreground">
                        💡 Los datos se guardan automáticamente en el navegador. Para hacer backup,
                        exporta tus datos antes de limpiar el navegador.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
