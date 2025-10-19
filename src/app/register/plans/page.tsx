"use client";

import { Button } from "@/components/ui/button";
import CardFlip from "@/components/ui/card-flip";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check } from "lucide-react";

interface Plan {
    id: string;
    title: string;
    price: string;
    period: string;
    subtitle: string;
    description: string;
    features: string[];
    badge?: string;
    popular?: boolean;
}

const plans: Plan[] = [
    {
        id: "starter",
        title: "Starter",
        price: "$19.99",
        period: "/mes",
        subtitle: "Ideal para empezar tu gimnasio",
        description: "Perfecto para gimnasios pequeños que están comenzando su negocio.",
        features: [
            "Hasta 50 clientes activos",
            "Gestión básica de membresías",
            "100 SMS mensuales",
            "Notificaciones por correo",
            "Panel de control básico",
            "Reportes de ingresos simples",
            "Soporte por email"
        ],
        badge: "Económico"
    },
    {
        id: "pro",
        title: "Pro",
        price: "$59.99",
        period: "/mes",
        subtitle: "La elección más popular",
        description: "La mejor opción para gimnasios en crecimiento que buscan más funciones.",
        features: [
            "Hasta 200 clientes activos",
            "Gestión avanzada de membresías",
            "500 SMS mensuales",
            "Notificaciones SMS y Email",
            "Dashboard con estadísticas",
            "Reportes detallados y gráficos",
            "Control de asistencia",
            "Recordatorios automáticos",
            "Soporte prioritario"
        ],
        badge: "Más Popular",
        popular: true
    },
    {
        id: "premium",
        title: "Premium",
        price: "$90",
        period: "/mes",
        subtitle: "Todo lo que necesitas y más",
        description: "Para gimnasios establecidos que buscan optimización completa.",
        features: [
            "Hasta 500 clientes activos",
            "Gestión completa ilimitada",
            "2000 SMS mensuales",
            "Notificaciones SMS, Email y Push",
            "Dashboard avanzado con IA",
            "Analytics y predicciones",
            "Sistema de facturación",
            "Múltiples usuarios/staff",
            "Integraciones con apps",
            "Reportes personalizados",
            "Soporte prioritario 24/7"
        ],
        badge: "Avanzado"
    },
    {
        id: "enterprise",
        title: "Enterprise",
        price: "Custom",
        period: "",
        subtitle: "Solución empresarial personalizada",
        description: "Para cadenas de gimnasios y empresas con necesidades específicas.",
        features: [
            "Clientes ilimitados",
            "Multi-sucursales sin límite",
            "SMS ilimitados",
            "Sistema de notificaciones completo",
            "Personalización total del sistema",
            "API completa y webhooks",
            "White label (marca propia)",
            "Gerente de cuenta dedicado",
            "Capacitación personalizada",
            "SLA garantizado 99.9%",
            "Backup diario automático",
            "Soporte técnico 24/7 premium"
        ],
        badge: "Contactar"
    }
];

export default function PlansPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        // Verificar que existan datos temporales del registro
        const registroTemporal = sessionStorage.getItem("registroTemporal");
        if (!registroTemporal) {
            // Si no hay datos, redirigir al registro
            router.push("/register");
        }
    }, [router]);

    useEffect(() => {
        if (selectedPlan) {
            // Pequeño delay para la animación
            setTimeout(() => setShowButton(true), 300);
        } else {
            setShowButton(false);
        }
    }, [selectedPlan]);

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
    };

    const handleConfirm = () => {
        // Obtener datos temporales del registro
        const registroTemporal = sessionStorage.getItem("registroTemporal");

        if (registroTemporal && selectedPlan) {
            // ELIMINADO: const datosRegistro = JSON.parse(registroTemporal);
            const planSeleccionado = plans.find(p => p.id === selectedPlan);

            // Guardar plan en sessionStorage (aún no en localStorage)
            sessionStorage.setItem("planSeleccionado", JSON.stringify(planSeleccionado));

            // ELIMINADO: console.log("Plan seleccionado:", planSeleccionado);

            // Redirigir a métodos de pago
            router.push("/register/payment");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#1e1e1e] p-4">
            <div className="w-full max-w-[1600px] space-y-6">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Elige tu Plan
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Selecciona el plan que mejor se adapte a tu gimnasio
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 place-items-center">
                    {plans.map((plan) => (
                        <CardFlip
                            key={plan.id}
                            title={plan.title}
                            price={plan.price}
                            period={plan.period}
                            subtitle={plan.subtitle}
                            description={plan.description}
                            features={plan.features}
                            badge={plan.badge}
                            popular={plan.popular}
                            isSelected={selectedPlan === plan.id}
                            onSelect={() => handleSelectPlan(plan.id)}
                        />
                    ))}
                </div>

                {/* Botón Confirmar con animación */}
                <div
                    className={`flex justify-center transition-all duration-500 ease-out ${showButton
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0 pointer-events-none"
                        }`}
                >
                    <Button
                        onClick={handleConfirm}
                        size="lg"
                        className="group relative h-12 px-8 text-base font-semibold shadow-xl hover:shadow-2xl"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Check className="h-5 w-5" />
                            Confirmar Plan
                        </span>
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary via-primary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
