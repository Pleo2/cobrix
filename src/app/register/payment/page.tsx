"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Smartphone, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const bancos = [
    "100% Banco",
    "Bancamiga Banco Universal, C.A.",
    "Bancaribe",
    "Banco Activo C.A., Banco Universal",
    "Banco Agrícola de Venezuela, C.A.",
    "Banco Bicentenario del Pueblo, de la Clase Obrera, Mujer y Comunas B.U.",
    "Banco Caroní, C.A., Banco Universal",
    "Banco de Comercio Exterior, C.A. (BANCOEX)",
    "Banco de la Fuerza Armada Nacional Bolivariana, Banco Universal, C.A. (BANFANB)",
    "Banco de Venezuela",
    "Banco del Tesoro",
    "Banco Exterior, C.A., Banco Universal",
    "Banco Internacional de Desarrollo, C.A. Banco Universal",
    "Banco Nacional de Crédito, C.A. Banco Universal",
    "Banco Plaza, C.A., Banco Universal",
    "Banco Venezolano de Crédito, S.A., Banco Universal",
    "Bancrecer, S.A. Banco Microfinanciero",
    "Banesco Banco Universal, C.A.",
    "Banplus Banco Universal, C.A.",
    "BBVA Provincial, S.A. Banco Universal",
    "BFC Banco Fondo Común",
    "Citibank",
    "DELSUR Banco Universal, C.A.",
    "Mercantil Banco",
    "Mi Banco, Banco Microfinanciero C.A.",
];

interface PaymentMethod {
    id: string;
    name: string;
    icon: any;
    active: boolean;
    description: string;
}

const paymentMethods: PaymentMethod[] = [
    {
        id: "binance",
        name: "Binance Pay",
        icon: Wallet,
        active: false,
        description: "Próximamente disponible",
    },
    {
        id: "zelle",
        name: "Zelle",
        icon: CreditCard,
        active: false,
        description: "Próximamente disponible",
    },
    {
        id: "pago-movil",
        name: "Pago Móvil",
        icon: Smartphone,
        active: true,
        description: "Verificación bancaria instantánea",
    },
];

export default function PaymentPage() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        cedula: "",
        telefono: "",
        banco: "",
    });

    useEffect(() => {
        // Verificar que existan datos previos
        const registroTemporal = sessionStorage.getItem("registroTemporal");
        const planSeleccionado = sessionStorage.getItem("planSeleccionado");
        
        if (!registroTemporal || !planSeleccionado) {
            router.push("/register");
        }
    }, [router]);

    useEffect(() => {
        if (selectedMethod === "pago-movil") {
            setTimeout(() => setShowForm(true), 300);
        } else {
            setShowForm(false);
        }
    }, [selectedMethod]);

    const handleMethodClick = (methodId: string, active: boolean) => {
        if (active) {
            setSelectedMethod(methodId);
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();

        // Obtener todos los datos guardados
        const registroTemporal = sessionStorage.getItem("registroTemporal");
        const planSeleccionado = sessionStorage.getItem("planSeleccionado");

        if (registroTemporal && planSeleccionado) {
            const datosRegistro = JSON.parse(registroTemporal);
            const plan = JSON.parse(planSeleccionado);

            // Combinar todos los datos
            const datosCompletos = {
                ...datosRegistro,
                plan: plan,
                metodoPago: {
                    tipo: "Pago Móvil",
                    ...formData,
                },
                fechaRegistro: new Date().toISOString(),
            };

            // Obtener registros existentes o crear array vacío
            const registrosExistentes = localStorage.getItem("registrosEmpresas");
            const registros = registrosExistentes ? JSON.parse(registrosExistentes) : [];
            
            // Agregar nuevo registro
            registros.push(datosCompletos);
            
            // Guardar en localStorage
            localStorage.setItem("registrosEmpresas", JSON.stringify(registros));
            
            // Verificar que se guardó correctamente
            console.log("✅ Empresa registrada:", datosCompletos);
            console.log("✅ Total de empresas registradas:", registros.length);

            // Autenticar automáticamente en Zustand
            useAuthStore.setState({ 
                isAuthenticated: true, 
                empresa: datosCompletos 
            });
            console.log("✅ Sesión iniciada automáticamente en Zustand");

            // Limpiar sessionStorage
            sessionStorage.removeItem("registroTemporal");
            sessionStorage.removeItem("planSeleccionado");

            console.log("Registro completo:", datosCompletos);

            // Redirigir al dashboard
            router.push("/account");
        }
    };

    const isFormValid = formData.cedula && formData.telefono && formData.banco;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#1e1e1e] p-6">
            <div className="w-full max-w-4xl space-y-8">
                {/* Header */}
                <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Método de Pago
                    </h2>
                    <p className="text-muted-foreground">
                        Selecciona tu método de pago preferido
                    </p>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;

                        return (
                            <div
                                key={method.id}
                                onClick={() => handleMethodClick(method.id, method.active)}
                                className={cn(
                                    "relative rounded-2xl border p-6 transition-all duration-300",
                                    method.active
                                        ? "cursor-pointer hover:scale-105 hover:shadow-xl"
                                        : "cursor-not-allowed opacity-50",
                                    isSelected
                                        ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background"
                                        : "border-border/50 bg-card/50",
                                    !method.active && "bg-muted/20"
                                )}
                            >
                                {!method.active && (
                                    <div className="absolute right-3 top-3">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}

                                {isSelected && method.active && (
                                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                                        <Check className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div
                                        className={cn(
                                            "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
                                            method.active
                                                ? "bg-primary/20"
                                                : "bg-muted/50"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "h-8 w-8",
                                                method.active
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold">
                                            {method.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {method.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Formulario de Pago Móvil - Animado */}
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-500 ease-out",
                        showForm
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0"
                    )}
                >
                    <form
                        onSubmit={handleFinish}
                        className="space-y-6 rounded-3xl border border-primary/30 bg-card/50 p-8 shadow-2xl backdrop-blur-sm"
                    >
                        <div className="space-y-2 border-b border-border/50 pb-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <Smartphone className="h-5 w-5 text-primary" />
                                Datos de Pago Móvil
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Completa la información de tu cuenta bancaria
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Cédula */}
                            <div className="space-y-2">
                                <Label htmlFor="cedula" className="text-sm font-medium">
                                    Cédula del Banco
                                </Label>
                                <Input
                                    id="cedula"
                                    name="cedula"
                                    type="number"
                                    placeholder="12345678"
                                    value={formData.cedula}
                                    onChange={(e) =>
                                        handleChange("cedula", e.target.value)
                                    }
                                    required
                                    minLength={6}
                                    maxLength={8}
                                    className="h-12"
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2">
                                <Label htmlFor="telefono" className="text-sm font-medium">
                                    Teléfono Celular
                                </Label>
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    placeholder="0412-1234567"
                                    value={formData.telefono}
                                    onChange={(e) =>
                                        handleChange("telefono", e.target.value)
                                    }
                                    required
                                    className="h-12"
                                />
                            </div>
                        </div>

                        {/* Banco */}
                        <div className="space-y-2">
                            <Label htmlFor="banco" className="text-sm font-medium">
                                Banco Afiliado
                            </Label>
                            <Select
                                value={formData.banco}
                                onValueChange={(value) => handleChange("banco", value)}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Selecciona tu banco" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bancos.map((banco) => (
                                        <SelectItem key={banco} value={banco}>
                                            {banco}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Botón Finalizar */}
                        <Button
                            type="submit"
                            disabled={!isFormValid}
                            className="group relative h-14 w-full text-base font-semibold shadow-xl hover:shadow-2xl"
                            size="lg"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Check className="h-5 w-5" />
                                Finalizar Registro
                            </span>
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary via-primary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
