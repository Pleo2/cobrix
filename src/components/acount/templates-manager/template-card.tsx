"use client";

import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { iconMap, Template } from "./data"; // Importamos el mapa de iconos

interface TemplateCardProps {
    template: Template;
    isSelected: boolean;
    onClick: () => void;
}

export function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
    // --- INICIO DE LA CORRECCIÓN FINAL ---
    // 1. Obtenemos el nombre del icono (string) desde la plantilla.
    const iconName = template.icon;
    // 2. Usamos el mapa para obtener el componente de React real.
    //    Le damos un valor por defecto por si acaso.
    const Icon = iconMap[iconName] || iconMap.tools;
    // --- FIN DE LA CORRECCIÓN FINAL ---

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            <Card
                onClick={onClick}
                className={cn(
                    "cursor-pointer transition-all duration-200",
                    "hover:shadow-md group",
                    isSelected
                        ? "border-[#22c55e]/40 dark:border-[#22c55e]/30 bg-[#22c55e]/5 dark:bg-[#22c55e]/5"
                        : "border-border hover:border-[#22c55e]/20 dark:hover:border-[#22c55e]/20"
                )}
            >
                <CardHeader className="p-4">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex flex-col flex-1 min-w-0">
                            <CardTitle
                                className={cn(
                                    "text-base leading-tight transition-colors truncate",
                                    isSelected ? "text-[#22c55e]" : "group-hover:text-[#22c55e]"
                                )}
                            >
                                {template.name}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1 leading-relaxed line-clamp-2">
                                {template.description}
                            </CardDescription>
                        </div>
                        <motion.div
                            className={cn(
                                "p-2 rounded-lg transition-all flex-shrink-0",
                                isSelected
                                    ? "bg-[#22c55e]/20 text-[#22c55e]"
                                    : "bg-muted text-muted-foreground group-hover:bg-[#22c55e]/10 group-hover:text-[#22c55e]"
                            )}
                            whileHover={{ rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Icon className="h-5 w-5" />
                        </motion.div>
                    </div>
                </CardHeader>
            </Card>
        </motion.div>
    );
}
