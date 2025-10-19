"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDashboardStore } from "@/store/dashboard-store";

const colorMap: Record<string, string> = {
    Premium: "bg-amber-500",
    Básico: "bg-blue-500",
    Profesional: "bg-purple-500",
    Inactivo: "bg-gray-500",
};

function ProfileCard({
    profile,
}: {
    profile: { id: number; title: string; description: string; category: string };
}) {
    const color = colorMap[profile.category] || "bg-gray-500";

    return (
        <Link href={`/account/library-profile/${profile.id}`}>
            <Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="h-full flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Users className={`h-5 w-5 text-white ${color}`} />
                                <CardTitle className="text-lg">{profile.title}</CardTitle>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">
                                {profile.category}
                            </span>
                        </div>
                        <Copy className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription className="text-sm">{profile.description}</CardDescription>
                    <Button variant="outline" size="sm" className="w-fit">
                        Ver Detalle
                    </Button>
                </CardHeader>
            </Card>
        </Link>
    );
}

function NewProfileCard() {
    return (
        <Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 border-dashed border-2 flex items-center justify-center min-h-[300px]">
            <Link href="/account/library-profile/new" className="w-full h-full">
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <p className="text-center text-muted-foreground font-medium">Nuevo Perfil</p>
                </div>
            </Link>
        </Card>
    );
}

export default function LibraryProfilePage() {
    const clientProfiles = useDashboardStore((state) => state.clientProfiles);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProfiles = clientProfiles.filter(
        (profile) =>
            profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Librería de Perfiles</h2>
                        <p className="text-muted-foreground">
                            Administre perfiles y tipos de cliente en su sistema
                        </p>
                    </div>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Crear Perfil
                    </Button>
                </div>

                {/* Barra de búsqueda */}
                <Input
                    placeholder="Buscar perfiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />

                {/* Bento Grid */}
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProfiles.map((profile) => (
                            <ProfileCard key={profile.id} profile={profile} />
                        ))}
                        <NewProfileCard />
                    </div>
                </div>

                {/* Mensaje cuando no hay resultados */}
                {filteredProfiles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No se encontraron perfiles que coincidan con tu búsqueda
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
