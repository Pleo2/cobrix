"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Ocultar confetti después de 5 segundos
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                            }}
                        >
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    [
                                        "bg-green-500",
                                        "bg-emerald-500",
                                        "bg-teal-500",
                                        "bg-yellow-500",
                                        "bg-blue-500",
                                        "bg-purple-500",
                                        "bg-pink-500",
                                    ][Math.floor(Math.random() * 7)]
                                }`}
                                style={{
                                    transform: `rotate(${Math.random() * 360}deg)`,
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <Sparkles
                        key={i}
                        className={`absolute text-yellow-400/30 animate-pulse ${
                            i % 2 === 0 ? "h-4 w-4" : "h-6 w-6"
                        }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <Card className="max-w-2xl w-full shadow-2xl border-2 border-green-200 dark:border-green-800 relative z-10 animate-in zoom-in-95 duration-500">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="relative animate-bounce">
                            <div className="absolute inset-0 bg-green-500/20 dark:bg-green-500/30 rounded-full " />
                            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-lg">
                                <CheckCircle2 className="h-16 w-16 md:h-20 md:w-20 text-white " />
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r bg-foreground bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
                            ¡Pago Verificado con Éxito!
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            ¡Felicitaciones! Tu pago ha sido procesado correctamente
                        </p>
                    </div>

                    {/* Celebration Message */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl p-6 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        <p className="text-base md:text-lg font-medium text-green-900 dark:text-green-100">
                            Tu suscripción ha sido activada exitosamente
                        </p>
                        <p className="text-sm md:text-base text-green-700 dark:text-green-300">
                            Recibirás una confirmación por email en los próximos minutos
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                            <span>Tu pago será verificado en un plazo máximo de 24 horas</span>
                        </div>

                        {/* Action Button */}
                    </div>

                    {/* Footer Message */}
                    <p className="text-xs md:text-sm text-muted-foreground pt-4 animate-in fade-in duration-700 delay-500">
                        Gracias por tu confianza 💚
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
