"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Check,
    CreditCard,
    ArrowRight,
    ArrowLeft,
    Upload,
    FileText,
    AlertCircle,
    Image as ImageIcon,
} from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";

type PaymentMethod = "pagoMovil" | "zelle" | "transferencia" | "binance";
type CheckoutStep = "plan" | "payment" | "confirmation";

interface PaymentFormData {
    // Pago Móvil
    phoneNumber?: string;
    referenceNumber?: string;

    // Zelle
    zelleConfirmation?: string;

    // Transferencia
    transferReference?: string;

    // Binance
    transactionHash?: string;

    // Comunes (pre-llenados)
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
    proofOfPayment?: File | null;
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subscriptionPlans = useDashboardStore((state) => state.subscriptionPlans);
    const subscriptions = useDashboardStore((state) => state.subscriptions);
    const clients = useDashboardStore((state) => state.clients);

    // Obtener parámetros de la URL
    const currentPlanId = searchParams.get("planId");
    const clientId = searchParams.get("clientId");

    // Buscar cliente y suscripción si hay clientId
    const client = clientId ? clients.find((c) => c.id === parseInt(clientId)) : null;
    const subscription = client ? subscriptions.find((s) => s.email === client.email) : null;

    const [currentStep, setCurrentStep] = useState<CheckoutStep>("plan");
    const [selectedPlanId, setSelectedPlanId] = useState<string>(
        currentPlanId || subscription?.planId || ""
    );
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
        customerName: client ? `${client.firstName} ${client.lastName}` : "",
        customerEmail: client?.email || "",
        customerPhone: client?.phone || "",
        amount: 0,
        proofOfPayment: null,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        phoneNumber?: boolean;
        referenceNumber?: boolean;
        zelleConfirmation?: boolean;
        transferReference?: boolean;
        transactionHash?: boolean;
        proofOfPayment?: boolean;
    }>({});
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: "success" | "error" | "info";
    }>({ show: false, message: "", type: "info" });

    // Función para mostrar toast
    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "info" });
        }, 4000);
    };

    // Obtener plan actual y seleccionado
    const currentPlan = subscriptionPlans.find((p) => p.id === currentPlanId);
    const selectedPlan = subscriptionPlans.find((p) => p.id === selectedPlanId);

    useEffect(() => {
        if (selectedPlan) {
            setPaymentFormData((prev) => ({
                ...prev,
                amount: selectedPlan.price,
            }));
        }
    }, [selectedPlan]);

    const paymentMethods = [
        {
            id: "pagoMovil" as PaymentMethod,
            name: "Pago Móvil",
            icon: "/pagomovil.png",
            color: "bg-cyan-100 text-cyan-700 border-cyan-200",
            description: "Transferencia instantánea entre bancos venezolanos",
        },
        {
            id: "zelle" as PaymentMethod,
            name: "Zelle",
            icon: "/zelle.png",
            color: "bg-purple-100 text-purple-700 border-purple-200",
            description: "Pago rápido y seguro en USD",
        },
        {
            id: "transferencia" as PaymentMethod,
            name: "Transferencia",
            icon: "🏦",
            color: "bg-teal-100 text-teal-700 border-teal-200",
            description: "Transferencia bancaria tradicional",
        },
        {
            id: "binance" as PaymentMethod,
            name: "Binance",
            icon: "/binance-logo.png",
            color: "bg-yellow-100 text-yellow-700 border-yellow-200",
            description: "Pago con criptomonedas",
        },
    ];

    const handlePlanSelection = () => {
        if (!selectedPlanId) {
            showToast("Por favor selecciona un plan", "error");
            return;
        }
        setCurrentStep("payment");
    };

    const handlePaymentMethodSelection = () => {
        if (!selectedPaymentMethod) {
            showToast("Por favor selecciona un método de pago", "error");
            return;
        }
        setCurrentStep("confirmation");
    };

    const handleFormChange = (field: keyof PaymentFormData, value: string | number | File) => {
        setPaymentFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentFormData((prev) => ({
                ...prev,
                proofOfPayment: file,
            }));
            // Limpiar error de validación si existe
            if (validationErrors.proofOfPayment) {
                setValidationErrors((prev) => ({ ...prev, proofOfPayment: false }));
            }
            setIsDrawerOpen(false);
        }
    };

    const handleSubmitPayment = async () => {
        setIsProcessing(true);
        const errors: typeof validationErrors = {};

        // Validar que se haya subido el comprobante
        if (!paymentFormData.proofOfPayment) {
            errors.proofOfPayment = true;
            showToast("Por favor sube el comprobante de pago", "error");
            setValidationErrors(errors);
            setIsProcessing(false);
            return;
        }

        // Validaciones específicas por método de pago
        if (selectedPaymentMethod === "pagoMovil") {
            if (!paymentFormData.phoneNumber) errors.phoneNumber = true;
            if (!paymentFormData.referenceNumber) errors.referenceNumber = true;

            if (errors.phoneNumber || errors.referenceNumber) {
                showToast("Por favor completa tu teléfono y número de referencia", "error");
                setValidationErrors(errors);
                setIsProcessing(false);
                return;
            }
        } else if (selectedPaymentMethod === "zelle") {
            if (!paymentFormData.zelleConfirmation) {
                errors.zelleConfirmation = true;
                showToast("Por favor ingresa el código de confirmación de Zelle", "error");
                setValidationErrors(errors);
                setIsProcessing(false);
                return;
            }
        } else if (selectedPaymentMethod === "transferencia") {
            if (!paymentFormData.transferReference) {
                errors.transferReference = true;
                showToast("Por favor ingresa el número de referencia de tu transferencia", "error");
                setValidationErrors(errors);
                setIsProcessing(false);
                return;
            }
        } else if (selectedPaymentMethod === "binance") {
            if (!paymentFormData.transactionHash) {
                errors.transactionHash = true;
                showToast("Por favor ingresa el hash de transacción de Binance", "error");
                setValidationErrors(errors);
                setIsProcessing(false);
                return;
            }
        }

        // Limpiar errores si todo está correcto
        setValidationErrors({});

        // Simular procesamiento de pago exitoso
        setTimeout(() => {
            setIsProcessing(false);

            // Redirigir a la página de éxito
            router.push("/checkout/success");
        }, 2000);
    };

    // Renderizar formulario según método de pago (simplificado)
    const renderPaymentForm = () => {
        switch (selectedPaymentMethod) {
            case "pagoMovil":
                return (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-cyan-50 dark:bg-cyan-950/20 p-3 md:p-4 space-y-2">
                            <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
                                Datos para Pago Móvil
                            </p>
                            <div className="text-xs md:text-sm space-y-1">
                                <p>
                                    <span className="font-medium">Banco:</span> Banesco
                                </p>
                                <p>
                                    <span className="font-medium">Teléfono:</span> 0414-1234567
                                </p>
                                <p>
                                    <span className="font-medium">CI:</span> V-12345678
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Tu Teléfono *</Label>
                                <Input
                                    id="phoneNumber"
                                    placeholder="0414-1234567"
                                    value={paymentFormData.phoneNumber || ""}
                                    onChange={(e) => {
                                        handleFormChange("phoneNumber", e.target.value);
                                        if (validationErrors.phoneNumber) {
                                            setValidationErrors((prev) => ({
                                                ...prev,
                                                phoneNumber: false,
                                            }));
                                        }
                                    }}
                                    className={validationErrors.phoneNumber ? "border-red-500" : ""}
                                />
                                {validationErrors.phoneNumber && (
                                    <p className="text-xs text-red-500">
                                        Este campo es obligatorio
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="referenceNumber">Referencia *</Label>
                                <Input
                                    id="referenceNumber"
                                    placeholder="123456"
                                    value={paymentFormData.referenceNumber || ""}
                                    onChange={(e) => {
                                        handleFormChange("referenceNumber", e.target.value);
                                        if (validationErrors.referenceNumber) {
                                            setValidationErrors((prev) => ({
                                                ...prev,
                                                referenceNumber: false,
                                            }));
                                        }
                                    }}
                                    className={
                                        validationErrors.referenceNumber ? "border-red-500" : ""
                                    }
                                />
                                {validationErrors.referenceNumber && (
                                    <p className="text-xs text-red-500">
                                        Este campo es obligatorio
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case "zelle":
                return (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 p-3 md:p-4 space-y-2">
                            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                Datos para Zelle
                            </p>
                            <div className="text-xs md:text-sm space-y-1">
                                <p>
                                    <span className="font-medium">Email:</span> pagos@empresa.com
                                </p>
                                <p>
                                    <span className="font-medium">Nombre:</span> Empresa Gym
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zelleConfirmation">Código de Confirmación *</Label>
                            <Input
                                id="zelleConfirmation"
                                placeholder="ZELLE-123456"
                                value={paymentFormData.zelleConfirmation || ""}
                                onChange={(e) => {
                                    handleFormChange("zelleConfirmation", e.target.value);
                                    if (validationErrors.zelleConfirmation) {
                                        setValidationErrors((prev) => ({
                                            ...prev,
                                            zelleConfirmation: false,
                                        }));
                                    }
                                }}
                                className={
                                    validationErrors.zelleConfirmation ? "border-red-500" : ""
                                }
                            />
                            {validationErrors.zelleConfirmation && (
                                <p className="text-xs text-red-500">Este campo es obligatorio</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                El código que te envió Zelle por email o SMS
                            </p>
                        </div>
                    </div>
                );

            case "transferencia":
                return (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-teal-50 dark:bg-teal-950/20 p-3 md:p-4 space-y-2">
                            <p className="text-sm font-medium text-teal-900 dark:text-teal-100">
                                Datos Bancarios
                            </p>
                            <div className="text-xs md:text-sm space-y-1">
                                <p>
                                    <span className="font-medium">Banco:</span> Banco Provincial
                                </p>
                                <p className="break-all">
                                    <span className="font-medium">Cuenta:</span>{" "}
                                    0108-1234-5678-9012-3456
                                </p>
                                <p>
                                    <span className="font-medium">RIF:</span> J-123456789
                                </p>
                                <p>
                                    <span className="font-medium">Titular:</span> Empresa Gym C.A.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transferReference">Número de Referencia *</Label>
                            <Input
                                id="transferReference"
                                placeholder="REF-123456"
                                value={paymentFormData.transferReference || ""}
                                onChange={(e) => {
                                    handleFormChange("transferReference", e.target.value);
                                    if (validationErrors.transferReference) {
                                        setValidationErrors((prev) => ({
                                            ...prev,
                                            transferReference: false,
                                        }));
                                    }
                                }}
                                className={
                                    validationErrors.transferReference ? "border-red-500" : ""
                                }
                            />
                            {validationErrors.transferReference && (
                                <p className="text-xs text-red-500">Este campo es obligatorio</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Ingresa el número de referencia de tu transferencia
                            </p>
                        </div>
                    </div>
                );

            case "binance":
                return (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-3 md:p-4 space-y-2">
                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                                Datos para Binance
                            </p>
                            <div className="text-xs md:text-sm space-y-1">
                                <p>
                                    <span className="font-medium">Binance ID:</span> 123456789
                                </p>
                                <p>
                                    <span className="font-medium">Red:</span> BSC (BEP20)
                                </p>
                                <p className="break-all">
                                    <span className="font-medium">Wallet:</span> 0x1234...5678
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transactionHash">Transaction Hash (TxID) *</Label>
                            <Input
                                id="transactionHash"
                                placeholder="0x..."
                                value={paymentFormData.transactionHash || ""}
                                onChange={(e) => {
                                    handleFormChange("transactionHash", e.target.value);
                                    if (validationErrors.transactionHash) {
                                        setValidationErrors((prev) => ({
                                            ...prev,
                                            transactionHash: false,
                                        }));
                                    }
                                }}
                                className={validationErrors.transactionHash ? "border-red-500" : ""}
                            />
                            {validationErrors.transactionHash && (
                                <p className="text-xs text-red-500">Este campo es obligatorio</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                El hash de la transacción en la blockchain
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-4 md:py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                        Renovación de Suscripción
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Completa el proceso de renovación en 3 simples pasos
                    </p>
                </div>

                {/* Step 1: Plan Selection */}
                {currentStep === "plan" && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                    1
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    Paso 1 de 3
                                </span>
                            </div>
                            <CardTitle>Selecciona tu Plan</CardTitle>
                            <CardDescription>
                                {currentPlan
                                    ? `Tu plan actual: ${currentPlan.name}`
                                    : "Elige el plan que mejor se adapte a tus necesidades"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {currentPlan && (
                                <div className="rounded-lg bg-muted p-4 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium">{currentPlan.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {currentPlan.description}
                                            </p>
                                        </div>
                                        <Badge variant="outline">Actual</Badge>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        ${currentPlan.price}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            /
                                            {currentPlan.billingCycle === "Mensual" ? "mes" : "año"}
                                        </span>
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Label>
                                    {currentPlan
                                        ? "Mantener plan actual o cambiar a:"
                                        : "Planes disponibles:"}
                                </Label>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {subscriptionPlans
                                        .filter((p) => p.isActive)
                                        .map((plan) => (
                                            <Card
                                                key={plan.id}
                                                className={`cursor-pointer transition-all ${
                                                    selectedPlanId === plan.id
                                                        ? "ring-2 ring-primary"
                                                        : "hover:shadow-md"
                                                }`}
                                                onClick={() => setSelectedPlanId(plan.id)}
                                            >
                                                <CardContent className="p-4 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-1">
                                                            <p className="font-semibold">
                                                                {plan.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {plan.description}
                                                            </p>
                                                        </div>
                                                        {selectedPlanId === plan.id && (
                                                            <Check className="h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-bold">
                                                            ${plan.price}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            /
                                                            {plan.billingCycle === "Mensual"
                                                                ? "mes"
                                                                : "año"}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {plan.features
                                                            .slice(0, 3)
                                                            .map((feature, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center gap-2 text-xs"
                                                                >
                                                                    <Check className="h-3 w-3 text-green-600" />
                                                                    <span>{feature}</span>
                                                                </div>
                                                            ))}
                                                        {plan.features.length > 3 && (
                                                            <p className="text-xs text-muted-foreground">
                                                                +{plan.features.length - 3} más...
                                                            </p>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </div>

                            <Button
                                onClick={handlePlanSelection}
                                className="w-full gap-2 h-12 text-base font-semibold"
                                size="lg"
                            >
                                <span>Continuar</span>
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Payment Method Selection */}
                {currentStep === "payment" && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                    2
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    Paso 2 de 3
                                </span>
                            </div>
                            <CardTitle>Método de Pago</CardTitle>
                            <CardDescription>
                                Selecciona cómo deseas realizar el pago de ${selectedPlan?.price}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Resumen del plan seleccionado */}
                            <div className="rounded-lg bg-muted p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Plan seleccionado
                                        </p>
                                        <p className="font-semibold">{selectedPlan?.name}</p>
                                    </div>
                                    <p className="text-2xl font-bold">${selectedPlan?.price}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {paymentMethods.map((method) => (
                                    <Card
                                        key={method.id}
                                        className={`cursor-pointer transition-all ${
                                            selectedPaymentMethod === method.id
                                                ? "ring-2 ring-primary"
                                                : "hover:shadow-md"
                                        }`}
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                    >
                                        <CardContent className="p-6 space-y-3">
                                            <div className="flex items-center justify-between">
                                                {method.icon.startsWith("/") ? (
                                                    <div className="relative w-12 h-12">
                                                        <Image
                                                            src={method.icon}
                                                            alt={method.name}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-3xl">{method.icon}</span>
                                                )}
                                                {selectedPaymentMethod === method.id && (
                                                    <Check className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold">{method.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {method.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3">
                                <Button
                                    onClick={() => setCurrentStep("plan")}
                                    variant="outline"
                                    className="gap-2 w-full sm:w-auto h-12 text-base"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    <span>Volver</span>
                                </Button>
                                <Button
                                    onClick={handlePaymentMethodSelection}
                                    className="flex-1 gap-2 h-12 text-base font-semibold"
                                    size="lg"
                                >
                                    <span>Continuar</span>
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Payment Confirmation */}
                {currentStep === "confirmation" && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                    3
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    Paso 3 de 3
                                </span>
                            </div>
                            <CardTitle>Confirmar Pago</CardTitle>
                            <CardDescription>
                                Completa los datos de tu pago mediante{" "}
                                {paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Resumen */}
                            <div className="rounded-lg bg-muted p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Plan</p>
                                        <p className="font-semibold">{selectedPlan?.name}</p>
                                    </div>
                                    <p className="text-xl font-bold">${selectedPlan?.price}</p>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Método de pago
                                        </p>
                                        <p className="font-semibold">
                                            {
                                                paymentMethods.find(
                                                    (m) => m.id === selectedPaymentMethod
                                                )?.name
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Datos del cliente (solo si no hay clientId en URL) */}
                            {/* {!client ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <Label className="text-base font-semibold">
                                                Tus Datos de Contacto
                                            </Label>
                                        </div>

                                        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="customerName">
                                                    Nombre Completo *
                                                </Label>
                                                <Input
                                                    id="customerName"
                                                    placeholder="Juan Pérez"
                                                    value={paymentFormData.customerName}
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            "customerName",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="customerEmail">Email *</Label>
                                                <Input
                                                    id="customerEmail"
                                                    type="email"
                                                    placeholder="juan@email.com"
                                                    value={paymentFormData.customerEmail}
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            "customerEmail",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="customerPhone">Teléfono *</Label>
                                                <Input
                                                    id="customerPhone"
                                                    placeholder="0414-1234567"
                                                    value={paymentFormData.customerPhone}
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            "customerPhone",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />
                                </>
                            ) : (
                                <div className="rounded-lg bg-muted p-3 md:p-4 space-y-2">
                                    <p className="text-sm font-medium">Datos del cliente</p>
                                    <div className="text-sm space-y-1">
                                        <p>
                                            <span className="text-muted-foreground">Nombre:</span>{" "}
                                            {paymentFormData.customerName}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">Email:</span>{" "}
                                            {paymentFormData.customerEmail}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">Teléfono:</span>{" "}
                                            {paymentFormData.customerPhone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Formulario específico del método de pago */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-base font-semibold">
                                        Detalles del Pago
                                    </Label>
                                </div>
                                {renderPaymentForm()}
                            </div>

                            <Separator />

                            {/* Subir comprobante - Drawer */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-base font-semibold">
                                        Comprobante de Pago
                                    </Label>
                                </div>

                                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                    <DrawerTrigger asChild>
                                        <div
                                            className={`rounded-lg border-2 border-dashed p-6 text-center space-y-2 cursor-pointer hover:border-primary transition-colors ${
                                                validationErrors.proofOfPayment
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        >
                                            <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                                            <div>
                                                <p className="text-primary font-medium">
                                                    Haz clic para subir tu comprobante
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG o PDF (Max. 5MB)
                                            </p>
                                            {paymentFormData.proofOfPayment && (
                                                <Badge variant="outline" className="mt-2">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    {paymentFormData.proofOfPayment.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </DrawerTrigger>
                                    {validationErrors.proofOfPayment && (
                                        <p className="text-xs text-red-500 mt-2">
                                            Debes subir un comprobante de pago
                                        </p>
                                    )}
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>Subir Comprobante de Pago</DrawerTitle>
                                            <DrawerDescription>
                                                Elige cómo quieres subir tu comprobante
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="p-4 pb-8 space-y-4 max-w-2xl mx-auto w-full">
                                            {/* Opciones de carga */}
                                            <div className="flex flex-col gap-3 w-full">
                                                {/* Fila 1: Galería y Cámara */}
                                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                                    {/* Galería */}
                                                    <Label
                                                        htmlFor="galleryUpload"
                                                        className="cursor-pointer flex-1"
                                                    >
                                                        <div className="h-full rounded-xl border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 p-5 sm:p-6 text-center flex flex-col items-center justify-center gap-3 min-h-[140px] w-full">
                                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                                                <ImageIcon className="h-6 w-6 text-primary" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="font-semibold text-base">
                                                                    Galería
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Seleccionar de tus fotos
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Input
                                                            id="galleryUpload"
                                                            type="file"
                                                            accept="image/*"
                                                            capture={false}
                                                            className="hidden"
                                                            onChange={handleFileUpload}
                                                        />
                                                    </Label>

                                                    {/* Cámara */}
                                                    <Label
                                                        htmlFor="cameraUpload"
                                                        className="cursor-pointer flex-1"
                                                    >
                                                        <div className="h-full rounded-xl border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 p-5 sm:p-6 text-center flex flex-col items-center justify-center gap-3 min-h-[140px] w-full">
                                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                                                                <span className="text-3xl">📷</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="font-semibold text-base">
                                                                    Cámara
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Tomar una foto ahora
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Input
                                                            id="cameraUpload"
                                                            type="file"
                                                            accept="image/*"
                                                            capture="environment"
                                                            className="hidden"
                                                            onChange={handleFileUpload}
                                                        />
                                                    </Label>
                                                </div>

                                                {/* Fila 2: Archivo/PDF - Ancho completo */}
                                                <Label
                                                    htmlFor="fileUpload"
                                                    className="cursor-pointer w-full"
                                                >
                                                    <div className="rounded-xl border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 p-5 text-center flex flex-row sm:flex-col items-center justify-center gap-4 sm:gap-3 min-h-[100px] sm:min-h-[120px] w-full">
                                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted shrink-0">
                                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                        <div className="text-left sm:text-center space-y-1">
                                                            <p className="font-semibold text-base">
                                                                Archivo o PDF
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                PNG, JPG o PDF (Max. 5MB)
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Input
                                                        id="fileUpload"
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        className="hidden"
                                                        onChange={handleFileUpload}
                                                    />
                                                </Label>
                                            </div>

                                            {/* Archivo seleccionado */}
                                            {paymentFormData.proofOfPayment && (
                                                <div className="flex items-center justify-between gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <Check className="h-5 w-5 text-green-600 shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-green-900 dark:text-green-100 truncate">
                                                                Archivo seleccionado
                                                            </p>
                                                            <p className="text-xs text-green-700 dark:text-green-200 truncate">
                                                                {
                                                                    paymentFormData.proofOfPayment
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setPaymentFormData((prev) => ({
                                                                ...prev,
                                                                proofOfPayment: null,
                                                            }))
                                                        }
                                                    >
                                                        Cambiar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <DrawerFooter>
                                            <DrawerClose asChild>
                                                <Button
                                                    variant="outline"
                                                    className="max-w-fit self-center h-12"
                                                >
                                                    Cerrar
                                                </Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            </div>

                            {/* Alerta informativa */}
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-blue-900">
                                        Información importante
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Tu pago será verificado por nuestro equipo en un plazo
                                        máximo de 24 horas. Recibirás una confirmación por email
                                        cuando tu suscripción sea activada.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3">
                                <Button
                                    onClick={() => setCurrentStep("payment")}
                                    variant="outline"
                                    className="gap-2 w-full sm:w-auto h-12 text-base"
                                    disabled={isProcessing}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    <span>Volver</span>
                                </Button>
                                <Button
                                    onClick={handleSubmitPayment}
                                    className="flex-1 gap-2 h-12 text-base font-semibold"
                                    size="lg"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            <span>Procesando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-8 w-5" />
                                            <span>Confirmar Pago</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed bottom-4 right-4 left-4 md:left-auto md:min-w-[400px] z-50 animate-in slide-in-from-bottom-5">
                    <div
                        className={`rounded-lg p-4 shadow-lg border-2 ${
                            toast.type === "success"
                                ? "bg-green-50 dark:bg-green-950/90 border-green-500 text-green-900 dark:text-green-100"
                                : toast.type === "error"
                                ? "bg-red-50 dark:bg-red-950/90 border-red-500 text-red-900 dark:text-red-100"
                                : "bg-blue-50 dark:bg-blue-950/90 border-blue-500 text-blue-900 dark:text-blue-100"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                                {toast.type === "success" ? (
                                    <Check className="h-5 w-5" />
                                ) : toast.type === "error" ? (
                                    <AlertCircle className="h-5 w-5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium leading-relaxed">
                                    {toast.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setToast({ show: false, message: "", type: "info" })}
                                className="shrink-0 hover:opacity-70 transition-opacity"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8 px-4 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                        <p className="text-muted-foreground">Cargando información de pago...</p>
                    </div>
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
