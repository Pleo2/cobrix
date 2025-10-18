"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus, CheckCircle2, XCircle } from "lucide-react";
import suscripciones from "../suscripciones.json";

export default function SubscriptionsPage() {
    const suscripcionesActivas = suscripciones.filter(s => s.estado === "Activa").length;
    const suscripcionesPendientes = suscripciones.filter(s => s.estado === "Pendiente").length;

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Suscripciones</h2>
                <p className="text-muted-foreground">
                    Gestiona todas las suscripciones y planes activos del gimnasio
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <CardTitle>Mis Suscripciones ({suscripciones.length})</CardTitle>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <span>{suscripcionesActivas} Activas</span>
                                {suscripcionesPendientes > 0 && (
                                    <span>{suscripcionesPendientes} Pendientes</span>
                                )}
                            </div>
                        </div>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nueva Suscripción
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead>Método de Pago</TableHead>
                                    <TableHead>Próximo Pago</TableHead>
                                    <TableHead>Renovación Auto</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suscripciones.map((suscripcion) => (
                                    <TableRow key={suscripcion.id}>
                                        <TableCell>
                                            <div className="font-medium">{suscripcion.clienteNombre}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{suscripcion.plan}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {new Intl.NumberFormat("es-VE", {
                                                style: "currency",
                                                currency: "USD"
                                            }).format(suscripcion.monto)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-muted-foreground">
                                                {suscripcion.metodoPago}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {suscripcion.fechaProximoPago}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {suscripcion.renovacionAutomatica ? (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm text-muted-foreground">Sí</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">No</span>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    suscripcion.estado === "Activa"
                                                        ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                                                        : "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                                }
                                            >
                                                {suscripcion.estado}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
