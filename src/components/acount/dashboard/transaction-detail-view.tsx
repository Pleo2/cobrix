"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    IconArrowLeft,
    IconCircleCheckFilled,
    IconX,
    IconAlertCircle,
    IconClock,
    IconDownload,
    IconUpload,
    IconCheck,
} from "@tabler/icons-react";
import { z } from "zod";
import { schema } from "./data-table";
import jsPDF from "jspdf";

interface TransactionDetailViewProps {
    transaction: z.infer<typeof schema>;
    onBack: () => void;
}

export function TransactionDetailView({ transaction, onBack }: TransactionDetailViewProps) {
    const [currentEstado, setCurrentEstado] = React.useState(transaction.estadoFinal || transaction.estado);
    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
    const [showValidateDialog, setShowValidateDialog] = React.useState(false);
    const [showRejectDialog, setShowRejectDialog] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleValidate = () => {
        setCurrentEstado("Exitosa");
        setShowValidateDialog(false);
    };

    const handleReject = () => {
        setCurrentEstado("Rechazada");
        setShowRejectDialog(false);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        // Configuración de colores según el estado
        let statusColor: [number, number, number] = [0, 0, 0];
        if (currentEstado === "Exitosa" || currentEstado === "Completado") {
            statusColor = [34, 197, 94]; // verde
        } else if (currentEstado === "Rechazada") {
            statusColor = [239, 68, 68]; // rojo
        } else if (currentEstado === "Conciliación Manual") {
            statusColor = [59, 130, 246]; // azul
        }

        // Encabezado
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text("COMPROBANTE DE TRANSACCIÓN", 105, 20, { align: "center" });
        
        // Línea decorativa
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 25, 190, 25);

        // Estado de la transacción
        doc.setFontSize(12);
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(`Estado: ${currentEstado}`, 105, 35, { align: "center" });

        // Información del Cliente
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("INFORMACIÓN DEL CLIENTE", 20, 50);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 52, 190, 52);

        doc.setFontSize(11);
        doc.text(`Cliente: ${transaction.cliente}`, 25, 60);
        doc.text(`Concepto: ${transaction.concepto}`, 25, 68);

        // Detalles del Pago
        doc.setFontSize(14);
        doc.text("DETALLES DEL PAGO", 20, 85);
        doc.line(20, 87, 190, 87);

        doc.setFontSize(11);
        const montoFormatted = new Intl.NumberFormat("es-VE", {
            style: "currency",
            currency: "USD"
        }).format(transaction.monto);
        
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text(`Monto: ${montoFormatted}`, 25, 98);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Método de Pago: ${transaction.metodoPago}`, 25, 108);
        doc.text(`Fecha y Hora: ${transaction.fecha}`, 25, 116);
        doc.text(`Referencia: ${transaction.referencia}`, 25, 124);

        // Información adicional según el estado
        if (currentEstado === "Rechazada" && transaction.motivoRechazo) {
            doc.setFontSize(14);
            doc.setTextColor(239, 68, 68);
            doc.text("MOTIVO DE RECHAZO", 20, 140);
            doc.setDrawColor(239, 68, 68);
            doc.line(20, 142, 190, 142);
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text(transaction.motivoRechazo, 25, 152);
        }

        if (currentEstado === "Exitosa" || currentEstado === "Completado") {
            doc.setFontSize(11);
            doc.setTextColor(34, 197, 94);
            doc.text("[OK] Pago procesado y confirmado correctamente", 25, 145);
        }

        // Pie de página
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("Este documento es un comprobante de transacción generado automáticamente.", 105, 280, { align: "center" });
        doc.text(`Generado el: ${new Date().toLocaleString("es-ES")}`, 105, 286, { align: "center" });

        // Descargar el PDF
        doc.save(`Comprobante_${transaction.referencia}.pdf`);
    };

    const getEstadoConfig = () => {
        switch (currentEstado) {
            case "Exitosa":
            case "Completado":
                return {
                    color: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
                    icon: <IconCircleCheckFilled className="size-5" />,
                    label: "Exitosa"
                };
            case "Rechazada":
                return {
                    color: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
                    icon: <IconX className="size-5" />,
                    label: "Rechazada"
                };
            case "Conciliación Manual":
                return {
                    color: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
                    icon: <IconClock className="size-5" />,
                    label: "Conciliación Manual"
                };
            default:
                return {
                    color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                    icon: <IconAlertCircle className="size-5" />,
                    label: currentEstado
                };
        }
    };

    const estadoConfig = getEstadoConfig();

    return (
        <div className="flex flex-col h-full animate-in fade-in-0 duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-5 lg:px-6 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="shrink-0 hover:bg-muted"
                >
                    <IconArrowLeft className="size-5" />
                    <span className="sr-only">Volver</span>
                </Button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold tracking-tight">Detalles de Transacción</h2>
                    <p className="text-sm text-muted-foreground font-mono truncate">
                        {transaction.referencia}
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-sm ${estadoConfig.color}`}
                >
                    {estadoConfig.icon}
                    <span>{estadoConfig.label}</span>
                </Badge>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-6 bg-muted/20">
                <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Información del Cliente */}
                    <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="h-1 w-8 bg-primary rounded-full"></span>
                                Información del Cliente
                            </h3>
                            <Separator className="mb-4" />
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cliente</label>
                                <p className="text-base font-semibold text-foreground">{transaction.cliente}</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Concepto</label>
                                <p className="text-base text-foreground">{transaction.concepto}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detalles del Pago */}
                    <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="h-1 w-8 bg-primary rounded-full"></span>
                                Detalles del Pago
                            </h3>
                            <Separator className="mb-4" />
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Monto</label>
                                <p className="text-3xl font-bold text-primary tracking-tight">
                                    {new Intl.NumberFormat("es-VE", {
                                        style: "currency",
                                        currency: "USD"
                                    }).format(transaction.monto)}
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Método de Pago</label>
                                <div>
                                    <Badge variant="outline" className="text-sm font-medium px-3 py-1.5">
                                        {transaction.metodoPago}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fecha y Hora</label>
                                <p className="text-base font-medium text-foreground">{transaction.fecha}</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Referencia</label>
                                <p className="text-base font-mono text-foreground bg-muted/50 px-3 py-1.5 rounded-md inline-block">{transaction.referencia}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección específica según el estado */}
                    {currentEstado === "Rechazada" && transaction.motivoRechazo && (
                        <div className="rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-red-500/10 p-6 space-y-4 shadow-lg animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                <div className="p-2 rounded-full bg-red-500/10">
                                    <IconAlertCircle className="size-6" />
                                </div>
                                <h3 className="text-base font-bold uppercase tracking-wide">
                                    Motivo de Rechazo
                                </h3>
                            </div>
                            <Separator className="bg-red-500/20" />
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-base font-semibold text-red-900 dark:text-red-100">{transaction.motivoRechazo}</p>
                                </div>
                                <div className="rounded-lg bg-card p-4 border border-red-500/20">
                                    <p className="text-sm text-foreground">
                                        <strong className="text-red-700 dark:text-red-400">⚠️ Acción recomendada:</strong> Por favor, contacta al cliente 
                                        para resolver este inconveniente y procesar nuevamente el pago.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentEstado === "Conciliación Manual" && (
                        <div className="rounded-xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-6 space-y-6 shadow-lg animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400">
                                <div className="p-2 rounded-full bg-blue-500/10 animate-pulse">
                                    <IconClock className="size-6" />
                                </div>
                                <h3 className="text-base font-bold uppercase tracking-wide">
                                    Requiere Acción Manual
                                </h3>
                            </div>
                            <Separator className="bg-blue-500/20" />
                            
                            {/* Sección de carga de comprobante */}
                            <div className="rounded-lg bg-card p-5 border border-blue-500/20 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="comprobante" className="text-sm font-semibold text-foreground">
                                        Subir Comprobante de Pago (Opcional)
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Puede adjuntar un comprobante de pago para facilitar la verificación
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="comprobante"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex-1"
                                    >
                                        <IconUpload className="mr-2 size-4" />
                                        {uploadedFile ? uploadedFile.name : "Seleccionar archivo"}
                                    </Button>
                                    {uploadedFile && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setUploadedFile(null)}
                                        >
                                            <IconX className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Sección de validación manual */}
                            <div className="rounded-lg bg-card p-5 border-2 border-blue-500/30 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-base font-bold text-foreground">
                                        🔍 Validación Manual del Pago
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Por favor verifique su <span className="font-semibold text-foreground">{transaction.metodoPago}</span> para estar seguro de la validación de su pago.
                                    </p>
                                </div>
                                <Separator />
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={() => setShowValidateDialog(true)}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        size="lg"
                                    >
                                        <IconCheck className="mr-2 size-5" />
                                        Validar Pago
                                    </Button>
                                    <Button
                                        onClick={() => setShowRejectDialog(true)}
                                        variant="destructive"
                                        className="flex-1"
                                        size="lg"
                                    >
                                        <IconX className="mr-2 size-5" />
                                        Rechazar Pago
                                    </Button>
                                </div>
                            </div>

                            {/* Instrucciones */}
                            <div className="rounded-lg bg-blue-500/5 p-4 border border-blue-500/20">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    <strong className="text-blue-700 dark:text-blue-400">💡 Nota:</strong> Asegúrese de verificar todos los detalles de la transacción antes de validar o rechazar el pago. Esta acción actualizará el estado de la factura de manera permanente.
                                </p>
                            </div>
                        </div>
                    )}

                    {(currentEstado === "Exitosa" || currentEstado === "Completado") && (
                        <div className="rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-500/10 p-6 space-y-4 shadow-lg animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                                <div className="p-2 rounded-full bg-green-500/10">
                                    <IconCircleCheckFilled className="size-6" />
                                </div>
                                <h3 className="text-base font-bold uppercase tracking-wide">
                                    Pago Procesado Exitosamente
                                </h3>
                            </div>
                            <Separator className="bg-green-500/20" />
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                <p className="text-base font-medium text-green-900 dark:text-green-100">
                                    ✅ El pago ha sido procesado y confirmado correctamente. El cliente ha sido notificado.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t px-4 py-5 lg:px-6 bg-gradient-to-t from-muted/50 to-background backdrop-blur supports-[backdrop-filter]:bg-muted/20">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
                    <Button 
                        className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow" 
                        size="lg"
                        disabled={currentEstado === "Rechazada"}
                        onClick={handleDownloadPDF}
                    >
                        <IconDownload className="mr-2 size-4" />
                        Descargar Comprobante
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={onBack}
                        className="sm:ml-auto hover:bg-primary/10 hover:text-primary hover:border-primary"
                        size="lg"
                    >
                        <IconArrowLeft className="mr-2 size-4" />
                        Volver a Transacciones
                    </Button>
                </div>
            </div>

            {/* Modal de Validación */}
            <AlertDialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <IconCheck className="size-6" />
                            Confirmar Validación de Pago
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3 pt-2">
                            <p>¿Está seguro de que desea validar este pago?</p>
                            <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                    Referencia: {transaction.referencia}
                                </p>
                                <p className="text-sm text-foreground">
                                    Cliente: {transaction.cliente}
                                </p>
                                <p className="text-sm font-bold text-green-700 dark:text-green-400">
                                    Monto: {new Intl.NumberFormat("es-VE", {
                                        style: "currency",
                                        currency: "USD"
                                    }).format(transaction.monto)}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Esta acción cambiará el estado de la factura a <strong className="text-green-600">Exitosa</strong> de manera permanente.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleValidate}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Sí, Validar Pago
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal de Rechazo */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <IconX className="size-6" />
                            Confirmar Rechazo de Pago
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3 pt-2">
                            <p>¿Está seguro de que desea rechazar este pago?</p>
                            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                    Referencia: {transaction.referencia}
                                </p>
                                <p className="text-sm text-foreground">
                                    Cliente: {transaction.cliente}
                                </p>
                                <p className="text-sm font-bold text-red-700 dark:text-red-400">
                                    Monto: {new Intl.NumberFormat("es-VE", {
                                        style: "currency",
                                        currency: "USD"
                                    }).format(transaction.monto)}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Esta acción cambiará el estado de la factura a <strong className="text-red-600">Rechazada</strong> de manera permanente.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReject}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Sí, Rechazar Pago
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
