"use client";

import { SubscriptionsTable } from "@/components/acount/suscriptions/subscriptions-table";
import { useDashboardStore } from "@/store/dashboard-store";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function SubscriptionsPage() {
    const subscriptions = useDashboardStore((state) => state.subscriptions);
    const subscriptionPlans = useDashboardStore((state) => state.subscriptionPlans);
    const hasHydrated = useDashboardStore((state) => state._hasHydrated);
    const initializeFromLocalStorage = useDashboardStore(
        (state) => state.initializeFromLocalStorage
    );
    const resetSubscriptions = useDashboardStore((state) => state.resetSubscriptions);
    const getActiveSubscriptionsCount = useDashboardStore(
        (state) => state.getActiveSubscriptionsCount
    );
    const getCancelledSubscriptionsCount = useDashboardStore(
        (state) => state.getCancelledSubscriptionsCount
    );
    const getAppealSubscriptionsCount = useDashboardStore(
        (state) => state.getAppealSubscriptionsCount
    );
    const addSubscriptionPlan = useDashboardStore((state) => state.addSubscriptionPlan);
    const updateSubscriptionPlan = useDashboardStore((state) => state.updateSubscriptionPlan);
    const deleteSubscriptionPlan = useDashboardStore((state) => state.deleteSubscriptionPlan);
    const resetPlans = useDashboardStore((state) => state.resetPlans);

    // Estado para el formulario de nuevo plan
    const [showNewPlanForm, setShowNewPlanForm] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
    const [planForm, setPlanForm] = useState({
        name: "",
        description: "",
        price: 0,
        billingCycle: "Mensual" as "Mensual" | "Anual",
        features: [""],
        isActive: true,
    });

    useEffect(() => {
        // Inicializar desde localStorage en el primer render
        initializeFromLocalStorage();

        // Verificar si las suscripciones tienen la estructura correcta
        if (subscriptions.length > 0 && !subscriptions[0].clientName) {
            // Estructura incorrecta detectada, resetear a datos iniciales
            resetSubscriptions();
        }
    }, [initializeFromLocalStorage, subscriptions, resetSubscriptions]);

    const handleSavePlan = () => {
        if (!planForm.name || planForm.price <= 0 || planForm.features.every((f) => !f.trim())) {
            alert("Por favor completa todos los campos requeridos");
            return;
        }

        const cleanedFeatures = planForm.features.filter((f) => f.trim() !== "");

        if (editingPlanId) {
            // Actualizar plan existente
            updateSubscriptionPlan(editingPlanId, {
                ...planForm,
                features: cleanedFeatures,
            });
            setEditingPlanId(null);
        } else {
            // Crear nuevo plan
            addSubscriptionPlan({
                ...planForm,
                features: cleanedFeatures,
            });
        }

        // Resetear formulario
        setPlanForm({
            name: "",
            description: "",
            price: 0,
            billingCycle: "Mensual",
            features: [""],
            isActive: true,
        });
        setShowNewPlanForm(false);
    };

    const handleEditPlan = (planId: string) => {
        const plan = subscriptionPlans.find((p) => p.id === planId);
        if (plan) {
            setPlanForm({
                name: plan.name,
                description: plan.description,
                price: plan.price,
                billingCycle: plan.billingCycle,
                features: plan.features.length > 0 ? plan.features : [""],
                isActive: plan.isActive,
            });
            setEditingPlanId(planId);
            setShowNewPlanForm(true);
        }
    };

    const handleDeletePlan = (planId: string) => {
        if (confirm("¿Estás seguro de eliminar este plan?")) {
            deleteSubscriptionPlan(planId);
        }
    };

    const handleAddFeature = () => {
        setPlanForm((prev) => ({
            ...prev,
            features: [...prev.features, ""],
        }));
    };

    const handleRemoveFeature = (index: number) => {
        setPlanForm((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        setPlanForm((prev) => ({
            ...prev,
            features: prev.features.map((f, i) => (i === index ? value : f)),
        }));
    };

    const handleCancelForm = () => {
        setPlanForm({
            name: "",
            description: "",
            price: 0,
            billingCycle: "Mensual",
            features: [""],
            isActive: true,
        });
        setEditingPlanId(null);
        setShowNewPlanForm(false);
    };

    // Evitar hydration mismatch esperando a que el store se hidrate
    if (!hasHydrated) {
        return (
            <div className="flex max-h-max flex-col">
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                        <div className="mx-auto w-full flex flex-col gap-6 max-w-7xl">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-3xl font-bold tracking-tight">Suscripciones</h2>
                                <p className="text-muted-foreground">Cargando suscripciones...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const activeCount = getActiveSubscriptionsCount();
    const cancelledCount = getCancelledSubscriptionsCount();
    const appealCount = getAppealSubscriptionsCount();

    return (
        <div className="flex max-h-max flex-col">
            <div className="flex flex-1 flex-col">
                <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
                    <div className="mx-auto w-full flex flex-col gap-6 max-w-7xl">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Suscripciones y Planes
                            </h2>
                            <p className="text-muted-foreground">
                                Gestiona tus clientes, sus suscripciones y los planes disponibles.
                            </p>
                        </div>

                        <Tabs defaultValue="subscriptions" className="w-full">
                            <TabsList className="grid w-full max-w-md grid-cols-2">
                                <TabsTrigger value="subscriptions">
                                    Suscripciones de Clientes
                                </TabsTrigger>
                                <TabsTrigger value="plans">Planes Disponibles</TabsTrigger>
                            </TabsList>

                            <TabsContent value="subscriptions" className="space-y-4 mt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {subscriptions.length === 0 && (
                                            <Button
                                                onClick={() => resetSubscriptions()}
                                                variant="outline"
                                                size="sm"
                                            >
                                                🔄 Cargar Suscripciones
                                            </Button>
                                        )}
                                        <Badge
                                            variant="outline"
                                            className="px-3 py-1.5 bg-green-100 text-green-700 border-green-200"
                                        >
                                            <span className="opacity-70 text-xs">Activos</span>
                                            <span className="ml-1.5 font-bold text-sm">
                                                {activeCount}
                                            </span>
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 border-yellow-200"
                                        >
                                            <span className="opacity-70 text-xs">En Apelación</span>
                                            <span className="ml-1.5 font-bold text-sm">
                                                {appealCount}
                                            </span>
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="px-3 py-1.5 bg-red-100 text-red-700 border-red-200"
                                        >
                                            <span className="opacity-70 text-xs">Cancelados</span>
                                            <span className="ml-1.5 font-bold text-sm">
                                                {cancelledCount}
                                            </span>
                                        </Badge>
                                    </div>
                                </div>
                                <SubscriptionsTable data={subscriptions} />
                            </TabsContent>

                            <TabsContent value="plans" className="space-y-4 mt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="px-3 py-1.5">
                                            Total de Planes: {subscriptionPlans.length}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="px-3 py-1.5 bg-green-100 text-green-700 border-green-200"
                                        >
                                            Activos:{" "}
                                            {subscriptionPlans.filter((p) => p.isActive).length}
                                        </Badge>
                                        {subscriptionPlans.length === 0 && (
                                            <Button
                                                onClick={() => resetPlans()}
                                                variant="outline"
                                                size="sm"
                                            >
                                                🔄 Cargar Planes de Gimnasio
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        "¿Estás seguro de resetear todos los planes? Esto eliminará los planes actuales y cargará los planes de gimnasio por defecto."
                                                    )
                                                ) {
                                                    resetPlans();
                                                }
                                            }}
                                            variant="outline"
                                            size="sm"
                                        >
                                            🔄 Resetear a Planes de Gimnasio
                                        </Button>
                                        <Button onClick={() => setShowNewPlanForm(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Nuevo Plan
                                        </Button>
                                    </div>
                                </div>

                                {showNewPlanForm && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                {editingPlanId ? "Editar Plan" : "Crear Nuevo Plan"}
                                            </CardTitle>
                                            <CardDescription>
                                                Define los detalles y características del plan de
                                                suscripción
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="plan-name">
                                                        Nombre del Plan *
                                                    </Label>
                                                    <Input
                                                        id="plan-name"
                                                        placeholder="Ej: Profesional"
                                                        value={planForm.name}
                                                        onChange={(e) =>
                                                            setPlanForm((prev) => ({
                                                                ...prev,
                                                                name: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="plan-price">Precio *</Label>
                                                    <Input
                                                        id="plan-price"
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="99.99"
                                                        value={planForm.price}
                                                        onChange={(e) =>
                                                            setPlanForm((prev) => ({
                                                                ...prev,
                                                                price: parseFloat(e.target.value),
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="plan-description">
                                                    Descripción
                                                </Label>
                                                <Input
                                                    id="plan-description"
                                                    placeholder="Descripción breve del plan"
                                                    value={planForm.description}
                                                    onChange={(e) =>
                                                        setPlanForm((prev) => ({
                                                            ...prev,
                                                            description: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="billing-cycle">
                                                        Ciclo de Facturación *
                                                    </Label>
                                                    <Select
                                                        value={planForm.billingCycle}
                                                        onValueChange={(
                                                            value: "Mensual" | "Anual"
                                                        ) =>
                                                            setPlanForm((prev) => ({
                                                                ...prev,
                                                                billingCycle: value,
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Mensual">
                                                                Mensual
                                                            </SelectItem>
                                                            <SelectItem value="Anual">
                                                                Anual
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Estado</Label>
                                                    <div className="flex items-center space-x-2 h-10">
                                                        <input
                                                            type="checkbox"
                                                            id="plan-active"
                                                            checked={planForm.isActive}
                                                            onChange={(e) =>
                                                                setPlanForm((prev) => ({
                                                                    ...prev,
                                                                    isActive: e.target.checked,
                                                                }))
                                                            }
                                                            className="h-4 w-4"
                                                        />
                                                        <Label
                                                            htmlFor="plan-active"
                                                            className="cursor-pointer"
                                                        >
                                                            Plan Activo
                                                        </Label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Características *</Label>
                                                {planForm.features.map((feature, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            placeholder="Ej: Hasta 100 clientes"
                                                            value={feature}
                                                            onChange={(e) =>
                                                                handleFeatureChange(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        {planForm.features.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleRemoveFeature(index)
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleAddFeature}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Agregar Característica
                                                </Button>
                                            </div>

                                            <div className="flex gap-2 pt-4 border-t">
                                                <Button onClick={handleSavePlan}>
                                                    <Check className="h-4 w-4 mr-2" />
                                                    {editingPlanId
                                                        ? "Actualizar Plan"
                                                        : "Crear Plan"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={handleCancelForm}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {subscriptionPlans.map((plan) => (
                                        <Card
                                            key={plan.id}
                                            className={!plan.isActive ? "opacity-60" : ""}
                                        >
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle>{plan.name}</CardTitle>
                                                        <CardDescription className="mt-1">
                                                            {plan.description}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            plan.isActive ? "default" : "secondary"
                                                        }
                                                    >
                                                        {plan.isActive ? "Activo" : "Inactivo"}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-3xl font-bold">
                                                                ${plan.price}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                /
                                                                {plan.billingCycle === "Mensual"
                                                                    ? "mes"
                                                                    : "año"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium">
                                                            Características:
                                                        </p>
                                                        <ul className="text-sm space-y-1">
                                                            {plan.features.map((feature, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Check className="h-3 w-3 text-green-600" />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="flex gap-2 pt-2 border-t">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditPlan(plan.id)}
                                                        >
                                                            <Edit2 className="h-3 w-3 mr-1" />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeletePlan(plan.id)
                                                            }
                                                        >
                                                            <Trash2 className="h-3 w-3 mr-1" />
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
