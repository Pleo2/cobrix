"use client";

import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MessageCardProps {
    // AQUÍ ESTÁ LA CORRECCIÓN: Un tipo más específico para el icono
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    variant?: "primary" | "secondary";
}

export function MessageCard({
    icon: Icon,
    label,
    description,
    placeholder,
    value,
    onChange,
    variant = "secondary",
}: MessageCardProps) {
    const isPrimary = variant === "primary";

    return (
        <Card
            className={cn(
                "transition-all border group h-full flex flex-col",
                isPrimary
                    ? "border-[#22c55e]/30 dark:border-[#22c55e]/20 bg-[#22c55e]/5 dark:bg-[#22c55e]/5"
                    : "border-border hover:border-[#22c55e]/20 dark:hover:border-[#22c55e]/15"
            )}
        >
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            isPrimary
                                ? "bg-[#22c55e]/20 text-[#22c55e]"
                                : "bg-muted text-muted-foreground group-hover:text-foreground"
                        )}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className={cn("text-base font-bold", isPrimary ? "text-[#22c55e]" : "")}>
                            {label}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                            {description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex-grow">
                <Textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "resize-none text-sm transition-colors h-full",
                        "focus:border-[#22c55e]/40 dark:focus:border-[#22c55e]/30",
                        isPrimary ? "min-h-[100px]" : "min-h-[80px]"
                    )}
                />
            </CardContent>
        </Card>
    );
}
