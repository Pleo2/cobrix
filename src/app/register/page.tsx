"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, FileText, User, MapPin, Users, Briefcase, Mail, Phone } from "lucide-react";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombreEmpresa: "",
        rif: "",
        nombreDueno: "",
        ubicacion: "",
        volumenClientes: "",
        nicho: "Gimnasio",
        correo: "",
        telefono: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Guardar temporalmente en sessionStorage (aún no en localStorage)
        sessionStorage.setItem("registroTemporal", JSON.stringify(formData));
        
        console.log("Datos temporales guardados:", formData);
        
        // Redirigir a selección de planes
        router.push("/register/plans");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] p-6">
            <div className="w-full max-w-3xl">
                {/* Header */}
                <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
                        Registra tu Empresa
                    </h2>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 shadow-2xl">
                    {/* Sección: Información de la Empresa */}
                    <div>
                        {/* Nombre de la Empresa - Línea completa */}
                        <div className="space-y-2 mb-3">
                            <Label htmlFor="nombreEmpresa" className="text-sm font-medium">
                                Nombre de la Empresa
                            </Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="nombreEmpresa"
                                    name="nombreEmpresa"
                                    placeholder="Elite Fitness Gym"
                                    value={formData.nombreEmpresa}
                                    onChange={handleChange}
                                    required
                                    className="h-12 pl-10"
                                />
                            </div>
                        </div>

                        {/* RIF + Nombre del Dueño - 2 columnas */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-3">
                            <div className="space-y-2">
                                <Label htmlFor="rif" className="text-sm font-medium">
                                    RIF
                                </Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="rif"
                                        name="rif"
                                        placeholder="J-12345678-9"
                                        value={formData.rif}
                                        onChange={handleChange}
                                        required
                                        className="h-12 pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nombreDueno" className="text-sm font-medium">
                                    Nombre del Dueño
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="nombreDueno"
                                        name="nombreDueno"
                                        placeholder="Carlos Méndez"
                                        value={formData.nombreDueno}
                                        onChange={handleChange}
                                        required
                                        className="h-12 pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ubicación - Línea completa */}
                        <div className="space-y-2">
                            <Label htmlFor="ubicacion" className="text-sm font-medium">
                                Ubicación / Zona Postal
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="ubicacion"
                                    name="ubicacion"
                                    placeholder="Caracas, 1050"
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    required
                                    className="h-12 pl-10"
                                />
                            </div>
                        </div>

                        {/* Volumen de Clientes + Nicho - 2 columnas */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2 mt-3">
                                <Label htmlFor="volumenClientes" className="text-sm font-medium">
                                    Volumen de Clientes
                                </Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="volumenClientes"
                                        name="volumenClientes"
                                        type="number"
                                        placeholder="150"
                                        value={formData.volumenClientes}
                                        onChange={handleChange}
                                        required
                                        className="h-12 pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 mt-3">
                                <Label htmlFor="nicho" className="text-sm font-medium">
                                    Nicho
                                </Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="nicho"
                                        name="nicho"
                                        placeholder="Gimnasio"
                                        value={formData.nicho}
                                        onChange={handleChange}
                                        required
                                        className="h-12 pl-10 bg-muted/50"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Información de Contacto */}
                    <div>
                        

                        {/* Correo Electrónico - Línea completa */}
                        <div className="space-y-2 mb-3">
                            <Label htmlFor="correo" className="text-sm font-medium">
                                Correo Electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    placeholder="contacto@empresa.com"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    required
                                    className="h-12 pl-10"
                                />
                            </div>
                        </div>

                        {/* Teléfono - Línea completa */}
                        <div className="space-y-2 mb-3">
                            <Label htmlFor="telefono" className="text-sm font-medium">
                                Teléfono
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    placeholder="+58 412-345-6789"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    className="h-12 pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botón Submit */}
                    <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg">
                        Registrar Empresa
                    </Button>
                </form>

                {/* Footer */}
                <div className="text-center mt-3">
                    <span className="text-sm text-muted-foreground">
                        ¿Ya tienes una cuenta?{" "}
                    </span>
                    <Button 
                        variant="link" 
                        className="h-auto p-0 text-sm font-semibold"
                        onClick={() => router.push("/login")}
                    >
                        Inicia sesión
                    </Button>
                </div>
            </div>
        </div>
    );
}
