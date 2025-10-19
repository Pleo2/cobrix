"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de autenticación aquí
    };

    return (
        <div className="flex min-h-screen">
            {/* ... (resto del JSX que ya está correcto) ... */}
            <div className="bg-muted relative hidden w-1/2 lg:block">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-full w-full">
                        <Image
                            src="/login.png"
                            alt="Gimnasio"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-white">
                            <h1 className="mb-4 text-4xl font-bold">Cobrix</h1>
                            <p className="text-center text-lg">
                                Tu plataforma de gestión de pagos y suscripciones
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Únete a nosotros
                        </h2>
                        <p className="text-muted-foreground text-sm">
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
                        <Button type="submit" className="w-full" size="lg">
                            Entrar
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            ¿No tienes una cuenta?{" "}
                        </span>
                        <Button variant="link" className="h-auto p-0">
                            Regístrate
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
