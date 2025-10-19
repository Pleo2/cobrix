"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { BulkUploadDropzone } from "@/components/acount/dashboard/bulk-upload-dropzone";
import { useDashboardStore } from "@/store/dashboard-store";

export default function CreateUserPage() {
    const addClient = useDashboardStore((state) => state.addClient);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        cedula: "",
        email: "",
        phone: "",
        address: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Agregar cliente usando el store de Zustand
        addClient(formData);

        setSubmitted(true);
        setTimeout(() => {
            setFormData({
                firstName: "",
                lastName: "",
                cedula: "",
                email: "",
                phone: "",
                address: "",
            });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h2>
                    <p className="text-muted-foreground">Registra un nuevo cliente en el sistema</p>
                </div>

                {submitted && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                        <p className="text-sm font-medium text-green-800">
                            ✓ Cliente registrado exitosamente. El formulario se reiniciará en 3
                            segundos.
                        </p>
                    </div>
                )}

                {/* Grid: Formulario y Carga Masiva lado a lado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Formulario Individual */}
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Cliente</CardTitle>
                                <CardDescription>
                                    Completa los datos del nuevo cliente
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nombre y Apellido */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Nombre *</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                placeholder="Juan"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Apellido *</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Pérez"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Cédula y Email */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="cedula">Cédula *</Label>
                                            <Input
                                                id="cedula"
                                                name="cedula"
                                                placeholder="V-12345678"
                                                value={formData.cedula}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Correo *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="juan@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Teléfono y Dirección */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Teléfono *</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                placeholder="+58 212 123 4567"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Dirección *</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                placeholder="Av. Principal 123"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-3 border-t pt-6">
                                        <Button type="submit" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Registrar Cliente
                                        </Button>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Información adicional */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Consejos útiles</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <p>
                                        El correo es importante para enviar recibos y notificaciones
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <p>
                                        El teléfono permite contacto rápido en caso de cambios o
                                        consultas
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <p>La dirección es necesaria para facturación y entregas</p>
                                </div>
                                <div className="flex gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <p>
                                        La cédula es requerida para la identificación legal del
                                        cliente
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Carga Masiva */}
                    <div className="flex flex-col">
                        <BulkUploadDropzone />
                    </div>
                </div>
            </div>
        </div>
    );
}
