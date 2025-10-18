"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Mail, Phone, MapPin, Building2 } from "lucide-react";

export default function CreateUserPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        city: "",
        country: "",
        taxId: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                address: "",
                city: "",
                country: "",
                taxId: "",
            });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
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

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Información del Cliente</CardTitle>
                    <CardDescription>Completa los datos del nuevo cliente</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Información Personal */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm">Información Personal</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Juan Pérez"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
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

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="+58 212 123 4567"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxId">RIF / Cédula</Label>
                                    <Input
                                        id="taxId"
                                        name="taxId"
                                        placeholder="V-12345678"
                                        value={formData.taxId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información de Empresa */}
                        <div className="space-y-4 border-t pt-6">
                            <h3 className="font-semibold text-sm">Información de la Empresa</h3>
                            <div className="space-y-2">
                                <Label htmlFor="company">Nombre de la Empresa</Label>
                                <Input
                                    id="company"
                                    name="company"
                                    placeholder="Mi Empresa S.A."
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="Av. Principal 123"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ciudad</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="Caracas"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">País</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        placeholder="Venezuela"
                                        value={formData.country}
                                        onChange={handleChange}
                                    />
                                </div>
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
                        <p>El email es importante para enviar recibos y notificaciones</p>
                    </div>
                    <div className="flex gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p>El teléfono permite contacto rápido en caso de cambios</p>
                    </div>
                    <div className="flex gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p>La dirección es necesaria para facturación y entregas</p>
                    </div>
                    <div className="flex gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p>Los datos de la empresa ayudan en la identificación legal</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
