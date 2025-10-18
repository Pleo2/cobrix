"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { Github, Chrome } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        // Intentar login con Zustand
        const success = login(email, password);
        
        if (success) {
            console.log("Login exitoso");
            router.push("/account/dashboard");
        } else {
            setError("Correo o contraseña incorrectos");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#1e1e1e]">
            {/* Lado izquierdo - Imagen */}
            <div className="relative hidden w-1/2 lg:block">
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                    <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-xl">
                        <Image
                            src="/login.png"
                            alt="Gimnasio"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Lado derecho - Formulario */}
            <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-12 border-l ">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Únete a nosotros</h2>
                        <p className="text-muted-foreground text-sm">Inicia sesión o crea tu cuenta</p>
                    </div>

                    {/* Social auth */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button variant="outline" className="justify-center gap-2">
                            <Chrome className="h-4 w-4" />
                            Sign in with Google
                        </Button>
                        <Button variant="outline" className="justify-center gap-2">
                            <Github className="h-4 w-4" />
                            Sign in with Github
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">O continúa con tu email</span>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nombre</Label>
                                <Input id="firstName" placeholder="John" className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input id="lastName" placeholder="Doe" className="h-11" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Choose your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-2 inline-flex items-center text-muted-foreground"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3.53 2.47a.75.75 0 1 0-1.06 1.06l2.3 2.3C3.03 7.1 1.78 8.87 1.1 10.2a2.83 2.83 0 0 0 0 2.6C3.06 16.9 6.89 20.25 12 20.25c2.02 0 3.79-.43 5.3-1.14l3.17 3.17a.75.75 0 0 0 1.06-1.06l-18-18Zm14.63 15.74A10.51 10.51 0 0 1 12 18.75c-4.52 0-7.83-2.94-9.7-6.05a1.33 1.33 0 0 1 0-1.4c.85-1.43 2.22-3.08 4.02-4.32l2.16 2.16A3.75 3.75 0 0 0 12 15.75c.54 0 1.06-.11 1.53-.31l4.63 4.63ZM12 6.75c.38 0 .74.06 1.08.17l1.5 1.5A3.75 3.75 0 0 0 8.92 9.58l1.5 1.5a3.75 3.75 0 0 0 1.58-4.33Z"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5.25c-5.11 0-8.94 3.35-10.9 6.55a2.83 2.83 0 0 0 0 2.4C3.06 17.9 6.89 21.25 12 21.25s8.94-3.35 10.9-7.05a2.83 2.83 0 0 0 0-2.4C20.94 8.6 17.11 5.25 12 5.25Zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"/></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg">
                            Iniciar Sesión
                        </Button>
                    </form>

                    {/* Legal */}
                    <p className="text-center text-xs text-muted-foreground">
                        By continuing, you agree to our
                        <button className="px-1 underline underline-offset-2">Terms of Service</button>
                        and
                        <button className="px-1 underline underline-offset-2">Privacy Policy</button>.
                    </p>

                    {/* Footer - Link a Registro */}
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            ¿No tienes una cuenta?{" "}
                        </span>
                        <Button 
                            variant="link" 
                            className="h-auto p-0"
                            onClick={() => window.location.href = "/register"}
                        >
                            Regístrate
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
