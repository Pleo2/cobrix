"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Mail, Phone, MapPin, Building2, ArrowRight, Check, CreditCard } from "lucide-react";
import { BulkUploadDropzone } from "@/components/acount/dashboard/bulk-upload-dropzone";
import { useDashboardStore } from "@/store/dashboard-store";
import { useRouter } from "next/navigation";

type Step = "client" | "subscription" | "success";

export default function CreateUserPage() {
    const router = useRouter();
    const addClient = useDashboardStore((state) => state.addClient);
    const addSubscription = useDashboardStore((state) => state.addSubscription);
    const subscriptionPlans = useDashboardStore((state) => state.subscriptionPlans);

    // Filtrar planes activos
    const activePlans = subscriptionPlans.filter((p) => p.isActive);

    const [currentStep, setCurrentStep] = useState<Step>("client");
    const [createdClientId, setCreatedClientId] = useState<number | null>(null);

    const [clientData, setClientData] = useState({
        firstName: "",
        lastName: "",
        cedula: "",
        email: "",
        phone: "",
        address: "",
    });

    const [selectedPlanId, setSelectedPlanId] = useState<string>("");

    const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClientData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClientSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Agregar cliente usando el store de Zustand
        addClient(clientData);

        // Generar ID temporal (en un caso real, el backend devolvería el ID)
        const tempId = Date.now();
        setCreatedClientId(tempId);

        // Pasar al siguiente paso
        setCurrentStep("subscription");
    };

    const handleSubscriptionSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Obtener el plan seleccionado
        const selectedPlan = activePlans.find((p) => p.id === selectedPlanId);
        if (!selectedPlan) {
            alert("Por favor selecciona un plan");
            return;
        }

        // Agregar suscripción usando el store de Zustand
        addSubscription({
            clientName: `${clientData.firstName} ${clientData.lastName}`,
            email: clientData.email,
            planId: selectedPlan.id,
            plan: selectedPlan.name,
            price: selectedPlan.price,
            status: "Activo",
            billingCycle: selectedPlan.billingCycle,
            nextPaymentDate: calculateNextPayment(selectedPlan.billingCycle),
        });

        // Ir al paso de éxito
        setCurrentStep("success");

        // Redirigir después de 3 segundos
        setTimeout(() => {
            router.push("/account/clients");
        }, 3000);
    };

    const calculateNextPayment = (billingCycle: "Mensual" | "Anual"): string => {
        const today = new Date();
        if (billingCycle === "Anual") {
            today.setFullYear(today.getFullYear() + 1);
        } else {
            today.setMonth(today.getMonth() + 1);
        }
        return today.toISOString().split("T")[0];
    };

    const getSelectedPlan = () => {
        return activePlans.find((p) => p.id === selectedPlanId);
    };

    const skipSubscription = () => {
        setCurrentStep("success");
        setTimeout(() => {
            router.push("/account/clients");
        }, 2000);
    };

    const resetForm = () => {
        setClientData({
            firstName: "",
            lastName: "",
            cedula: "",
            email: "",
            phone: "",
            address: "",
        });
        setSelectedPlanId("");
        setCurrentStep("client");
        setCreatedClientId(null);
    };

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                {/* Header con indicador de pasos */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h2>
                    <p className="text-muted-foreground">
                        {currentStep === "client" && "Paso 1: Registra los datos del cliente"}
                        {currentStep === "subscription" &&
                            "Paso 2: Asigna una suscripción (opcional)"}
                        {currentStep === "success" && "¡Proceso completado!"}
                    </p>

                    {/* Indicador de pasos */}
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex items-center gap-2 ${
                                currentStep === "client" ? "text-primary" : "text-green-600"
                            }`}
                        >
                            {currentStep === "client" ? (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    1
                                </div>
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <span className="text-sm font-medium">Cliente</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div
                            className={`flex items-center gap-2 ${
                                currentStep === "subscription"
                                    ? "text-primary"
                                    : currentStep === "success"
                                    ? "text-green-600"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {currentStep === "success" ? (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                                    <Check className="h-4 w-4" />
                                </div>
                            ) : (
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        currentStep === "subscription"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    2
                                </div>
                            )}
                            <span className="text-sm font-medium">Suscripción</span>
                        </div>
                    </div>
                </div>

                {/* Contenido según el paso actual */}
                {currentStep === "client" && (
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
                                    <form onSubmit={handleClientSubmit} className="space-y-6">
                                        {/* Nombre y Apellido */}
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">Nombre *</Label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    placeholder="Juan"
                                                    value={clientData.firstName}
                                                    onChange={handleClientChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Apellido *</Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Pérez"
                                                    value={clientData.lastName}
                                                    onChange={handleClientChange}
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
                                                    value={clientData.cedula}
                                                    onChange={handleClientChange}
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
                                                    value={clientData.email}
                                                    onChange={handleClientChange}
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
                                                    value={clientData.phone}
                                                    onChange={handleClientChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="address">Dirección *</Label>
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    placeholder="Av. Principal 123"
                                                    value={clientData.address}
                                                    onChange={handleClientChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex gap-3 border-t pt-6">
                                            <Button type="submit" className="gap-2">
                                                <ArrowRight className="h-4 w-4" />
                                                Continuar a Suscripción
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.push("/account/clients")}
                                            >
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
                                            El correo es importante para enviar recibos y
                                            notificaciones
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
                )}

                {/* Paso 2: Asignar Suscripción */}
                {currentStep === "subscription" && (
                    <div className="max-w-3xl mx-auto w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Asignar Suscripción</CardTitle>
                                <CardDescription>
                                    Asigna un plan de suscripción a {clientData.firstName}{" "}
                                    {clientData.lastName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubscriptionSubmit} className="space-y-6">
                                    {/* Plan */}
                                    <div className="space-y-2">
                                        <Label htmlFor="plan">Plan *</Label>
                                        <Select
                                            value={selectedPlanId}
                                            onValueChange={setSelectedPlanId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {activePlans.map((plan) => (
                                                    <SelectItem key={plan.id} value={plan.id}>
                                                        {plan.name} - ${plan.price}/
                                                        {plan.billingCycle === "Mensual"
                                                            ? "mes"
                                                            : "año"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Detalles del plan seleccionado */}
                                    {getSelectedPlan() && (
                                        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                                            <div>
                                                <h4 className="text-sm font-semibold mb-1">
                                                    {getSelectedPlan()?.name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {getSelectedPlan()?.description}
                                                </p>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold">
                                                    ${getSelectedPlan()?.price}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    /
                                                    {getSelectedPlan()?.billingCycle === "Mensual"
                                                        ? "mes"
                                                        : "año"}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Características incluidas:
                                                </p>
                                                <ul className="text-xs space-y-1">
                                                    {getSelectedPlan()?.features.map(
                                                        (feature, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Check className="h-3 w-3 text-green-600" />
                                                                {feature}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Información del cliente */}
                                    <div className="rounded-lg bg-muted p-4 space-y-2">
                                        <p className="text-sm font-medium">Resumen del Cliente</p>
                                        <div className="text-sm space-y-1">
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Nombre:
                                                </span>{" "}
                                                {clientData.firstName} {clientData.lastName}
                                            </p>
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Email:
                                                </span>{" "}
                                                {clientData.email}
                                            </p>
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Teléfono:
                                                </span>{" "}
                                                {clientData.phone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-3 border-t pt-6">
                                        <Button type="submit" className="gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Asignar Suscripción
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={skipSubscription}
                                        >
                                            Omitir
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setCurrentStep("client")}
                                        >
                                            Volver
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Paso 3: Éxito */}
                {currentStep === "success" && (
                    <div className="max-w-2xl mx-auto w-full">
                        <Card>
                            <CardContent className="pt-6 text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                        <Check className="h-10 w-10 text-green-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">
                                        ¡Cliente Creado Exitosamente!
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {clientData.firstName} {clientData.lastName} ha sido
                                        registrado en el sistema
                                        {selectedPlanId &&
                                            ` con el plan ${getSelectedPlan()?.name}`}
                                        .
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted p-4 space-y-2 text-left">
                                    <p className="text-sm font-medium">Detalles del Registro</p>
                                    <div className="text-sm space-y-1">
                                        <p>
                                            <span className="text-muted-foreground">Cliente:</span>{" "}
                                            {clientData.firstName} {clientData.lastName}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">Email:</span>{" "}
                                            {clientData.email}
                                        </p>
                                        {selectedPlanId && getSelectedPlan() && (
                                            <>
                                                <p>
                                                    <span className="text-muted-foreground">
                                                        Plan:
                                                    </span>{" "}
                                                    {getSelectedPlan()?.name}
                                                </p>
                                                <p>
                                                    <span className="text-muted-foreground">
                                                        Precio:
                                                    </span>{" "}
                                                    ${getSelectedPlan()?.price}/
                                                    {getSelectedPlan()?.billingCycle === "Mensual"
                                                        ? "mes"
                                                        : "año"}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Redirigiendo a la lista de clientes en 3 segundos...
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={() => router.push("/account/clients")}>
                                        Ver Lista de Clientes
                                    </Button>
                                    <Button variant="outline" onClick={resetForm}>
                                        Crear Otro Cliente
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
