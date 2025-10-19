"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    IconBuilding,
    IconUser,
    IconMail,
    IconPhone,
    IconMapPin,
    IconEdit,
    IconCalendar,
    IconBriefcase,
    IconUsers,
    IconCheck,
    IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface EmpresaData {
    nombreEmpresa: string;
    rif: string;
    nombreDueno: string;
    ubicacion: string;
    volumenClientes: string;
    nicho: string;
    correo: string;
    telefono: string;
    plan?: {
        name?: string;
        price?: string | number;
        billingCycle?: string;
    };
    metodoPago?: unknown;
    fechaRegistro?: string;
    password?: string;
}

export default function AccountPage() {
    const empresa = useAuthStore((state) => state.empresa);
    const setEmpresa = useAuthStore((state) => state.setEmpresa);

    const [isEditingGeneral, setIsEditingGeneral] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isEditingBusiness, setIsEditingBusiness] = useState(false);

    // Estados para los formularios
    const [generalForm, setGeneralForm] = useState({
        nombreEmpresa: "",
        rif: "",
        nombreDueno: "",
    });

    const [contactForm, setContactForm] = useState({
        correo: "",
        telefono: "",
        ubicacion: "",
    });

    const [businessForm, setBusinessForm] = useState({
        nicho: "",
        volumenClientes: "",
    });

    // Inicializar formularios con datos actuales
    useEffect(() => {
        if (empresa) {
            setGeneralForm({
                nombreEmpresa: empresa.nombreEmpresa || "",
                rif: empresa.rif || "",
                nombreDueno: empresa.nombreDueno || "",
            });
            setContactForm({
                correo: empresa.correo || "",
                telefono: empresa.telefono || "",
                ubicacion: empresa.ubicacion || "",
            });
            setBusinessForm({
                nicho: empresa.nicho || "",
                volumenClientes: empresa.volumenClientes || "",
            });
        }
    }, [empresa]);

    // Obtener iniciales del nombre de la empresa
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Guardar información general
    const handleSaveGeneral = () => {
        if (!generalForm.nombreEmpresa.trim()) {
            toast.error("Error de validación", {
                description: "El nombre de la empresa es obligatorio",
            });
            return;
        }
        if (!generalForm.rif.trim()) {
            toast.error("Error de validación", {
                description: "El RIF es obligatorio",
            });
            return;
        }

        const updatedEmpresa = {
            ...empresa!,
            ...generalForm,
        };

        setEmpresa(updatedEmpresa);
        updateLocalStorage(updatedEmpresa);
        setIsEditingGeneral(false);
        toast.success("Información actualizada", {
            description: "Los datos generales de la empresa se han actualizado correctamente",
        });
    };

    // Guardar información de contacto
    const handleSaveContact = () => {
        if (!contactForm.correo.trim()) {
            toast.error("Error de validación", {
                description: "El correo electrónico es obligatorio",
            });
            return;
        }
        if (!contactForm.correo.includes("@")) {
            toast.error("Error de validación", {
                description: "El correo electrónico no es válido",
            });
            return;
        }

        const updatedEmpresa = {
            ...empresa!,
            ...contactForm,
        };

        setEmpresa(updatedEmpresa);
        updateLocalStorage(updatedEmpresa);
        setIsEditingContact(false);
        toast.success("Información actualizada", {
            description: "Los datos de contacto se han actualizado correctamente",
        });
    };

    // Guardar información de negocio
    const handleSaveBusiness = () => {
        const updatedEmpresa = {
            ...empresa!,
            ...businessForm,
        };

        setEmpresa(updatedEmpresa);
        updateLocalStorage(updatedEmpresa);
        setIsEditingBusiness(false);
        toast.success("Información actualizada", {
            description: "La información del negocio se ha actualizado correctamente",
        });
    };

    // Actualizar localStorage
    const updateLocalStorage = (updatedEmpresa: EmpresaData) => {
        const registrosEmpresas = localStorage.getItem("registrosEmpresas");
        if (registrosEmpresas) {
            const empresas: EmpresaData[] = JSON.parse(registrosEmpresas);
            const index = empresas.findIndex(
                (e) => e.correo.toLowerCase() === empresa?.correo.toLowerCase()
            );
            if (index !== -1) {
                empresas[index] = updatedEmpresa;
                localStorage.setItem("registrosEmpresas", JSON.stringify(empresas));
            }
        }
    };

    if (!empresa) {
        return (
            <div className="flex w-full max-w-7xl mx-auto flex-col justify-center items-center gap-4 py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>No hay información disponible</CardTitle>
                        <CardDescription>
                            No se encontró información de la empresa. Por favor, inicia sesión
                            nuevamente.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-7xl mx-auto flex-col justify-center gap-6 py-4 md:py-6 px-4 lg:px-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Información de la Empresa</h2>
                <p className="text-muted-foreground">
                    Administra la información de tu empresa y mantén tus datos actualizados
                </p>
            </div>

            {/* Profile Card */}
            <Card className="overflow-hidden pt-0">
                <div className="h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20" />
                <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-12">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                            <AvatarImage src="/placeholder.png" alt={empresa.nombreEmpresa} />
                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getInitials(empresa.nombreEmpresa)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold">{empresa.nombreEmpresa}</h3>
                                <Badge variant="secondary" className="gap-1">
                                    <IconCheck className="h-3 w-3" />
                                    Verificado
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{empresa.rif}</p>
                            {empresa.fechaRegistro && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <IconCalendar className="h-4 w-4" />
                                    Miembro desde{" "}
                                    {new Date(empresa.fechaRegistro).toLocaleDateString("es-ES", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Información General */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <IconBuilding className="h-5 w-5" />
                                    Información General
                                </CardTitle>
                                <CardDescription>Datos básicos de la empresa</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditingGeneral(true)}
                            >
                                <IconEdit className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                Nombre de la Empresa
                            </Label>
                            <p className="text-sm font-medium">{empresa.nombreEmpresa}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">RIF</Label>
                            <p className="text-sm font-medium">{empresa.rif}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Propietario</Label>
                            <div className="flex items-center gap-2">
                                <IconUser className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">{empresa.nombreDueno}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Información de Contacto */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <IconMail className="h-5 w-5" />
                                    Información de Contacto
                                </CardTitle>
                                <CardDescription>Datos de contacto y ubicación</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditingContact(true)}
                            >
                                <IconEdit className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                Correo Electrónico
                            </Label>
                            <div className="flex items-center gap-2">
                                <IconMail className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">{empresa.correo}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Teléfono</Label>
                            <div className="flex items-center gap-2">
                                <IconPhone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">
                                    {empresa.telefono || "No especificado"}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Ubicación</Label>
                            <div className="flex items-center gap-2">
                                <IconMapPin className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">
                                    {empresa.ubicacion || "No especificada"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Información del Negocio */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <IconBriefcase className="h-5 w-5" />
                                    Información del Negocio
                                </CardTitle>
                                <CardDescription>Sector y alcance del negocio</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditingBusiness(true)}
                            >
                                <IconEdit className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                Nicho de Mercado
                            </Label>
                            <div className="flex items-center gap-2">
                                <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium capitalize">
                                    {empresa.nicho || "No especificado"}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                Volumen de Clientes
                            </Label>
                            <div className="flex items-center gap-2">
                                <IconUsers className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">
                                    {empresa.volumenClientes || "No especificado"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Plan y Suscripción */}
                {empresa.plan && (
                    <Card>
                        <CardHeader>
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <IconCheck className="h-5 w-5" />
                                    Plan Actual
                                </CardTitle>
                                <CardDescription>Detalles de tu suscripción</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">
                                    Plan Suscrito
                                </Label>
                                <p className="text-sm font-medium">
                                    {empresa.plan.name || "Plan Básico"}
                                </p>
                            </div>
                            {empresa.plan.price && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Precio
                                        </Label>
                                        <p className="text-sm font-medium">
                                            ${empresa.plan.price}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modal - Editar Información General */}
            <Dialog open={isEditingGeneral} onOpenChange={setIsEditingGeneral}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Información General</DialogTitle>
                        <DialogDescription>
                            Actualiza los datos básicos de tu empresa
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombreEmpresa">
                                Nombre de la Empresa <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nombreEmpresa"
                                value={generalForm.nombreEmpresa}
                                onChange={(e) =>
                                    setGeneralForm({
                                        ...generalForm,
                                        nombreEmpresa: e.target.value,
                                    })
                                }
                                placeholder="Nombre de tu empresa"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rif">
                                RIF <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="rif"
                                value={generalForm.rif}
                                onChange={(e) =>
                                    setGeneralForm({ ...generalForm, rif: e.target.value })
                                }
                                placeholder="J-123456789"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nombreDueno">Nombre del Propietario</Label>
                            <Input
                                id="nombreDueno"
                                value={generalForm.nombreDueno}
                                onChange={(e) =>
                                    setGeneralForm({ ...generalForm, nombreDueno: e.target.value })
                                }
                                placeholder="Nombre completo"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditingGeneral(false)}>
                            <IconX className="h-4 w-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveGeneral}>
                            <IconCheck className="h-4 w-4 mr-2" />
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal - Editar Información de Contacto */}
            <Dialog open={isEditingContact} onOpenChange={setIsEditingContact}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Información de Contacto</DialogTitle>
                        <DialogDescription>
                            Actualiza tus datos de contacto y ubicación
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="correo">
                                Correo Electrónico <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="correo"
                                type="email"
                                value={contactForm.correo}
                                onChange={(e) =>
                                    setContactForm({ ...contactForm, correo: e.target.value })
                                }
                                placeholder="correo@empresa.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono"
                                value={contactForm.telefono}
                                onChange={(e) =>
                                    setContactForm({ ...contactForm, telefono: e.target.value })
                                }
                                placeholder="+58 412-1234567"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ubicacion">Ubicación</Label>
                            <Input
                                id="ubicacion"
                                value={contactForm.ubicacion}
                                onChange={(e) =>
                                    setContactForm({ ...contactForm, ubicacion: e.target.value })
                                }
                                placeholder="Ciudad, Estado, País"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditingContact(false)}>
                            <IconX className="h-4 w-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveContact}>
                            <IconCheck className="h-4 w-4 mr-2" />
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal - Editar Información del Negocio */}
            <Dialog open={isEditingBusiness} onOpenChange={setIsEditingBusiness}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Información del Negocio</DialogTitle>
                        <DialogDescription>
                            Actualiza el sector y alcance de tu negocio
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nicho">Nicho de Mercado</Label>
                            <Select
                                value={businessForm.nicho}
                                onValueChange={(value) =>
                                    setBusinessForm({ ...businessForm, nicho: value })
                                }
                            >
                                <SelectTrigger id="nicho">
                                    <SelectValue placeholder="Selecciona tu nicho" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tecnologia">Tecnología</SelectItem>
                                    <SelectItem value="retail">Retail / Comercio</SelectItem>
                                    <SelectItem value="servicios">Servicios</SelectItem>
                                    <SelectItem value="educacion">Educación</SelectItem>
                                    <SelectItem value="salud">Salud</SelectItem>
                                    <SelectItem value="finanzas">Finanzas</SelectItem>
                                    <SelectItem value="manufactura">Manufactura</SelectItem>
                                    <SelectItem value="alimentos">Alimentos y Bebidas</SelectItem>
                                    <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="volumenClientes">Volumen de Clientes</Label>
                            <Select
                                value={businessForm.volumenClientes}
                                onValueChange={(value) =>
                                    setBusinessForm({ ...businessForm, volumenClientes: value })
                                }
                            >
                                <SelectTrigger id="volumenClientes">
                                    <SelectValue placeholder="Selecciona el volumen" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-50">1-50 clientes</SelectItem>
                                    <SelectItem value="51-200">51-200 clientes</SelectItem>
                                    <SelectItem value="201-500">201-500 clientes</SelectItem>
                                    <SelectItem value="501-1000">501-1000 clientes</SelectItem>
                                    <SelectItem value="1000+">Más de 1000 clientes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditingBusiness(false)}>
                            <IconX className="h-4 w-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveBusiness}>
                            <IconCheck className="h-4 w-4 mr-2" />
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
