"use client";

import { Button } from "@/components/ui/button";
import CardFlip from "@/components/ui/card-flip";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check } from "lucide-react";

interface Plan {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
}

const plans: Plan[] = [
    {
        id: "basico",
        title: "Plan Básico",
        subtitle: "$29/mes - Ideal para empezar",
        description: "Perfecto para gimnasios pequeños que están comenzando.",
        features: [
            "Hasta 50 clientes",
            "Gestión de pagos",
            "Reportes básicos",
            "Soporte por email"
        ]
    },
    {
        id: "profesional",
        title: "Plan Profesional",
        subtitle: "$59/mes - Más popular",
        description: "La mejor opción para gimnasios en crecimiento.",
        features: [
            "Hasta 200 clientes",
            "Gestión avanzada",
            "Reportes detallados",
            "Soporte prioritario",
            "Integraciones"
        ]
    },
    {
        id: "enterprise",
        title: "Plan Enterprise",
        subtitle: "$99/mes - Sin límites",
        description: "Para gimnasios grandes con necesidades avanzadas.",
        features: [
            "Clientes ilimitados",
            "Personalización total",
            "Analytics avanzado",
            "Soporte 24/7",
            "API completa",
            "Multi-sucursales"
        ]
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
            const datosRegistro = JSON.parse(registroTemporal);
            const planSeleccionado = plans.find(p => p.id === selectedPlan);
            
            // Guardar plan en sessionStorage (aún no en localStorage)
            sessionStorage.setItem("planSeleccionado", JSON.stringify(planSeleccionado));
            
            console.log("Plan seleccionado:", planSeleccionado);
            
            // Redirigir a métodos de pago
            router.push("/register/payment");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#1e1e1e] p-6">
            <div className="w-full max-w-6xl space-y-8">
                {/* Header */}
                <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Elige tu Plan
                    </h2>
                    <p className="text-muted-foreground">
                        Selecciona el plan que mejor se adapte a las necesidades de tu gimnasio
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 place-items-center">
                    {plans.map((plan) => (
                        <CardFlip
                            key={plan.id}
                            title={plan.title}
                            subtitle={plan.subtitle}
                            description={plan.description}
                            features={plan.features}
                            isSelected={selectedPlan === plan.id}
                            onSelect={() => handleSelectPlan(plan.id)}
                        />
                    ))}
                </div>

                {/* Botón Confirmar con animación */}
                <div
                    className={`flex justify-center transition-all duration-500 ease-out ${
                        showButton
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0 pointer-events-none"
                    }`}
                >
                    <Button
                        onClick={handleConfirm}
                        size="lg"
                        className="group relative h-14 px-8 text-base font-semibold shadow-xl hover:shadow-2xl"
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
