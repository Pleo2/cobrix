"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, FileText, User, MapPin, Users, Briefcase, Mail, Phone, Lock } from "lucide-react";
import { ValidationModal } from "@/components/ui/validation-modal";

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
        telefono: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState({
        show: false,
        title: "",
        message: ""
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
        
        // Validar que no haya espacios en blanco innecesarios
        const trimmedData = {
            ...formData,
            nombreEmpresa: formData.nombreEmpresa.trim(),
            rif: formData.rif.trim().replace(/\s+/g, ''),
            nombreDueno: formData.nombreDueno.trim(),
            ubicacion: formData.ubicacion.trim(),
            correo: formData.correo.trim().replace(/\s+/g, ''),
            telefono: formData.telefono.trim().replace(/\s+/g, ''),
            password: formData.password
        };

        // Validar formato del RIF (J-12345678-9)
        const rifRegex = /^[JVE]-\d{8}-\d$/;
        if (!rifRegex.test(trimmedData.rif)) {
            setValidationError({
                show: true,
                title: "RIF Inválido",
                message: "El RIF debe tener el formato exacto: J-12345678-9\n\nEjemplos válidos:\n• J-12345678-9\n• V-98765432-1\n• E-11223344-5"
            });
            return;
        }

        // Validar contraseña (mínimo 6 caracteres)
        if (trimmedData.password.length < 6) {
            setValidationError({
                show: true,
                title: "Contraseña Débil",
                message: "La contraseña debe tener al menos 6 caracteres"
            });
            return;
        }

        // Validar duplicados en localStorage
        const registrosExistentes = localStorage.getItem("registrosEmpresas");
        if (registrosExistentes) {
            const registros = JSON.parse(registrosExistentes);
            
            // Validar RIF duplicado (primary key)
            const rifDuplicado = registros.find((r: any) => r.rif === trimmedData.rif);
            if (rifDuplicado) {
                setValidationError({
                    show: true,
                    title: "RIF ya Registrado",
                    message: `El RIF ${trimmedData.rif} ya está registrado. Si olvidaste tu contraseña, inicia sesión.`
                });
                return;
            }

            // Validar nombre de empresa duplicado
            const nombreDuplicado = registros.find((r: any) => 
                r.nombreEmpresa.toLowerCase() === trimmedData.nombreEmpresa.toLowerCase()
            );
            if (nombreDuplicado) {
                setValidationError({
                    show: true,
                    title: "Empresa ya Registrada",
                    message: `El nombre "${trimmedData.nombreEmpresa}" ya está en uso. Por favor usa otro nombre.`
                });
                return;
            }

            // Validar correo duplicado
            const correoDuplicado = registros.find((r: any) => 
                r.correo.toLowerCase() === trimmedData.correo.toLowerCase()
            );
            if (correoDuplicado) {
                setValidationError({
                    show: true,
                    title: "Correo ya Registrado",
                    message: `El correo ${trimmedData.correo} ya está registrado. Intenta iniciar sesión.`
                });
                return;
            }
        }
        
        // Guardar temporalmente en sessionStorage (aún no en localStorage)
        sessionStorage.setItem("registroTemporal", JSON.stringify(trimmedData));
        
        console.log("Datos temporales guardados:", trimmedData);
        
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
                                        placeholder="Ej: J-12345678-9"
                                        value={formData.rif}
                                        onChange={handleChange}
                                        required
                                        pattern="[JVE]-\d{8}-\d"
                                        title="Formato: J-12345678-9"
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

                        {/* Contraseña - Línea completa */}
                        <div className="space-y-2 mb-3">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="h-12 pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                            <path d="M3.53 2.47a.75.75 0 1 0-1.06 1.06l2.3 2.3C3.03 7.1 1.78 8.87 1.1 10.2a2.83 2.83 0 0 0 0 2.6C3.06 16.9 6.89 20.25 12 20.25c2.02 0 3.79-.43 5.3-1.14l3.17 3.17a.75.75 0 0 0 1.06-1.06l-18-18Zm14.63 15.74A10.51 10.51 0 0 1 12 18.75c-4.52 0-7.83-2.94-9.7-6.05a1.33 1.33 0 0 1 0-1.4c.85-1.43 2.22-3.08 4.02-4.32l2.16 2.16A3.75 3.75 0 0 0 12 15.75c.54 0 1.06-.11 1.53-.31l4.63 4.63ZM12 6.75c.38 0 .74.06 1.08.17l1.5 1.5A3.75 3.75 0 0 0 8.92 9.58l1.5 1.5a3.75 3.75 0 0 0 1.58-4.33Z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                            <path d="M12 5.25c-5.11 0-8.94 3.35-10.9 6.55a2.83 2.83 0 0 0 0 2.4C3.06 17.9 6.89 21.25 12 21.25s8.94-3.35 10.9-7.05a2.83 2.83 0 0 0 0-2.4C20.94 8.6 17.11 5.25 12 5.25Zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"/>
                                        </svg>
                                    )}
                                </button>
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

                {/* Modal de Validación */}
                <ValidationModal
                    isOpen={validationError.show}
                    onClose={() => setValidationError({ show: false, title: "", message: "" })}
                    title={validationError.title}
                    message={validationError.message}
                />
            </div>
        </div>
    );
}
