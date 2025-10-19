"use client";

import { useState } from "react";
import { Upload, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/store/dashboard-store";

interface ClientData {
    firstName: string;
    lastName: string;
    cedula: string;
    email: string;
    phone: string;
    address: string;
}

export function BulkUploadDropzone() {
    const addClient = useDashboardStore((state) => state.addClient);

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error" | "info";
        text: string;
    } | null>(null);

    const validateClientData = (data: unknown[]): ClientData[] => {
        return data.filter((item) => {
            if (
                typeof item === "object" &&
                item !== null &&
                "firstName" in item &&
                "lastName" in item &&
                "cedula" in item &&
                "email" in item &&
                "phone" in item &&
                "address" in item
            ) {
                return true;
            }
            return false;
        }) as ClientData[];
    };

    const parseCSV = (content: string): ClientData[] => {
        const lines = content.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        const data = lines.slice(1).map((line) => {
            if (!line.trim()) return null;
            const values = line.split(",").map((v) => v.trim());
            return {
                firstName: values[headers.indexOf("firstname")] || "",
                lastName: values[headers.indexOf("lastname")] || "",
                cedula: values[headers.indexOf("cedula")] || "",
                email: values[headers.indexOf("email")] || "",
                phone: values[headers.indexOf("phone")] || "",
                address: values[headers.indexOf("address")] || "",
            };
        });

        return data.filter((item) => item !== null && item.firstName && item.email) as ClientData[];
    };

    const handleFile = async (file: File) => {
        setIsLoading(true);
        setMessage(null);

        try {
            const content = await file.text();
            let parsedData: ClientData[] = [];

            if (file.name.endsWith(".json")) {
                const jsonData = JSON.parse(content);
                parsedData = validateClientData(Array.isArray(jsonData) ? jsonData : [jsonData]);
            } else if (file.name.endsWith(".csv")) {
                parsedData = parseCSV(content);
            } else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
                throw new Error(
                    "Archivos Excel detectados. Por favor, convierte a CSV: Abre el archivo en Excel → Guardar como → Formato CSV"
                );
            } else {
                throw new Error("Solo se aceptan archivos CSV, JSON, XLS o XLSX");
            }

            if (parsedData.length === 0) {
                throw new Error("No se encontraron datos válidos en el archivo");
            }

            // Agregar cada cliente al store usando addClient
            parsedData.forEach((client) => {
                addClient(client);
            });

            setMessage({
                type: "success",
                text: `✓ Se importaron ${parsedData.length} cliente(s) exitosamente`,
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: `Error: ${
                    error instanceof Error ? error.message : "No se pudo procesar el archivo"
                }`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Carga Masiva de Clientes</CardTitle>
                <CardDescription>
                    Importa múltiples clientes a través de un archivo CSV o JSON
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Dropzone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        isDragging
                            ? "border-green-500 bg-green-50 dark:border-blue-500 dark:bg-blue-950"
                            : "border-green-200 hover:border-green-400 dark:border-blue-800 dark:hover:border-blue-600 bg-green-50/50 dark:bg-blue-950/50"
                    }`}
                >
                    <input
                        type="file"
                        accept=".csv,.json,.xls,.xlsx"
                        onChange={handleFileInput}
                        disabled={isLoading}
                        className="absolute inset-0 cursor-pointer opacity-0"
                    />

                    <div className="flex flex-col items-center gap-2">
                        {isLoading ? (
                            <Loader className="h-10 w-10 animate-spin text-green-600 dark:text-blue-400" />
                        ) : (
                            <Upload className="h-10 w-10 text-green-600 dark:text-blue-400" />
                        )}
                        <div>
                            <p className="font-semibold text-green-900 dark:text-blue-100">
                                {isLoading
                                    ? "Procesando archivo..."
                                    : "Arrastra tu archivo aquí o haz clic para seleccionar"}
                            </p>
                            <p className="text-sm text-green-700 dark:text-blue-300">
                                Formatos aceptados: CSV, JSON, XLS, XLSX
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mensaje de feedback */}
                {message && (
                    <div
                        className={`rounded-lg p-4 flex gap-3 items-start ${
                            message.type === "success"
                                ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
                                : message.type === "error"
                                ? "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800"
                                : "bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                        }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        ) : message.type === "error" ? (
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        )}
                        <p
                            className={
                                message.type === "success"
                                    ? "text-sm text-green-800 dark:text-green-300"
                                    : message.type === "error"
                                    ? "text-sm text-red-800 dark:text-red-300"
                                    : "text-sm text-blue-800 dark:text-blue-300"
                            }
                        >
                            {message.text}
                        </p>
                    </div>
                )}

                {/* Formato esperado */}
                <div className="rounded-lg bg-green-50 dark:bg-blue-950 border border-green-200 dark:border-blue-800 p-4">
                    <p className="mb-2 text-sm font-semibold text-green-900 dark:text-blue-100">
                        Formato esperado:
                    </p>
                    <div className="space-y-2 text-xs text-green-700 dark:text-blue-300">
                        <p>
                            <strong>CSV:</strong> firstName, lastName, cedula, email, phone, address
                        </p>
                        <p>
                            <strong>JSON:</strong> Array de objetos con los mismos campos
                        </p>
                        <p>
                            <strong>Excel (.xls/.xlsx):</strong> Convierte a CSV usando Excel →
                            Guardar como → Formato CSV
                        </p>
                        <p className="mt-2 italic pt-2 border-t border-green-200 dark:border-blue-800">
                            Ejemplo CSV:
                            <br />
                            Juan,Pérez,V-12345678,juan@example.com,+58 212 123 4567,Av. Principal
                            123
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
