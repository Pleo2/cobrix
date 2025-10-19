"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export default function Login() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        console.log("🔐 Intentando login con:");
        console.log("   - Email ingresado:", email);
        console.log("   - Password tiene contenido:", password ? "Sí" : "No");

        // Intentar login con Zustand
        const loginSuccess = login(email, password);

        if (loginSuccess) {
            // Login exitoso
            console.log("✅ Login exitoso - Redirigiendo al dashboard");
            
            // Animación de transición
            setTimeout(() => {
                router.push("/account");
            }, 500);
        } else {
            // Credenciales incorrectas
            setError("Correo o contraseña incorrectos");
            setIsLoading(false);
            console.log("❌ Login fallido - Credenciales no coinciden");
            console.log("💡 Verifica que hayas completado el registro correctamente");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] p-6">
            {/* Contenedor principal con borde */}
            <div className="flex w-full h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-2xl bg-card shadow-2xl">
                {/* Imagen a la izquierda */}
                <div className="relative hidden w-1/2 lg:block p-6">
                    <div className="relative h-full w-full rounded-2xl overflow-hidden">
                        <Image
                            src="/login.png"
                            alt="Cobrix"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
                
                {/* Formulario a la derecha */}
                <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-12">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        <div className="space-y-2 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                Únete a nosotros
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Iniciar sesión
                            </p>
                        </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-sm"
                                        type="button"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Button>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                        <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? "Iniciando sesión..." : "Entrar"}
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        <span className="text-gray-400">
                            ¿No tienes una cuenta?{" "}
                        </span>
                        <Link href="/register">
                            <Button variant="link" className="h-auto p-0 text-primary hover:text-primary/80">
                                Regístrate
                            </Button>
                        </Link>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}