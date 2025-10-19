"use client";

/**
 * @author: @dorian_baffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { ArrowRight, Repeat2, Check } from "lucide-react";
import { useState } from "react";

export interface CardFlipProps {
    title?: string;
    price?: string;
    period?: string;
    subtitle?: string;
    description?: string;
    features?: string[];
    badge?: string;
    popular?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
}

export default function CardFlip({
    title = "Design Systems",
    price = "$29",
    period = "/mes",
    subtitle = "Explore the fundamentals",
    description = "Dive deep into the world of modern UI/UX design.",
    features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
    badge,
    popular = false,
    isSelected = false,
    onSelect,
}: CardFlipProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={cn(
                "relative w-full max-w-[380px] h-[480px] group [perspective:2000px]",
                "transition-transform duration-300",
                isSelected && "scale-105 ring-2 ring-primary ring-offset-2 ring-offset-background rounded-2xl"
            )}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            {isSelected && (
                <div className="absolute -top-3 -right-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                    <Check className="h-5 w-5 text-primary-foreground" />
                </div>
            )}
            
            <div
                className={cn(
                    "relative w-full h-full",
                    "[transform-style:preserve-3d]",
                    "transition-all duration-700",
                    isFlipped
                        ? "[transform:rotateY(180deg)]"
                        : "[transform:rotateY(0deg)]"
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(0deg)]",
                        "overflow-hidden rounded-2xl",
                        "bg-zinc-50 dark:bg-zinc-900",
                        popular ? "border-2 border-primary" : "border border-zinc-200 dark:border-zinc-800/50",
                        "shadow-xs dark:shadow-lg",
                        "transition-all duration-700",
                        "group-hover:shadow-lg dark:group-hover:shadow-xl",
                        isFlipped ? "opacity-0" : "opacity-100"
                    )}
                >
                    {/* Badge */}
                    {badge && (
                        <div className={cn(
                            "absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold",
                            popular 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        )}>
                            {badge}
                        </div>
                    )}
                    
                    <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black">
                        <div className="absolute inset-0 flex items-start justify-center pt-24">
                            <div className="relative w-[200px] h-[100px] flex items-center justify-center">
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "absolute w-[50px] h-[50px]",
                                            "rounded-[140px]",
                                            "animate-[scale_3s_linear_infinite]",
                                            "opacity-0",
                                            "shadow-[0_0_50px_rgba(59,130,246,0.5)]",
                                            "group-hover:animate-[scale_2s_linear_infinite]"
                                        )}
                                        style={{
                                            animationDelay: `${i * 0.3}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="space-y-4">
                            {/* Price */}
                            <div className="flex items-baseline gap-1">
                                <span className={cn(
                                    "text-4xl font-bold tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px]",
                                    popular ? "text-primary" : "text-zinc-900 dark:text-white"
                                )}>
                                    {price}
                                </span>
                                {period && (
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400 transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px] delay-[50ms]">
                                        {period}
                                    </span>
                                )}
                            </div>
                            
                            {/* Title & Subtitle */}
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]">
                                    {title}
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px] delay-[50ms]">
                                    {subtitle}
                                </p>
                            </div>
                            
                            {/* Hover Icon */}
                            <div className="flex justify-end">
                                <div className="relative group/icon">
                                    <div
                                        className={cn(
                                            "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                                            "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
                                        )}
                                    />
                                    <Repeat2 className={cn(
                                        "relative z-10 w-5 h-5 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12",
                                        "text-primary"
                                    )} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of card */}
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                        "p-6 rounded-2xl",
                        "bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black",
                        popular ? "border-2 border-primary" : "border border-zinc-200 dark:border-zinc-800",
                        "shadow-xs dark:shadow-lg",
                        "flex flex-col",
                        "transition-all duration-700",
                        "group-hover:shadow-lg dark:group-hover:shadow-xl",
                        !isFlipped ? "opacity-0" : "opacity-100"
                    )}
                >
                    <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className={cn(
                                    "text-xl font-bold leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]",
                                    popular ? "text-primary" : "text-zinc-900 dark:text-white"
                                )}>
                                    {title}
                                </h3>
                                {badge && (
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-semibold",
                                        popular 
                                            ? "bg-primary/10 text-primary" 
                                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                    )}>
                                        {badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]">
                                {description}
                            </p>
                        </div>

                        <div className="space-y-1.5 max-h-[240px] overflow-y-auto custom-scrollbar">
                            {features.map((feature, index) => (
                                <div
                                    key={feature}
                                    className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300 transition-all duration-500"
                                    style={{
                                        transform: isFlipped
                                            ? "translateX(0)"
                                            : "translateX(-10px)",
                                        opacity: isFlipped ? 1 : 0,
                                        transitionDelay: `${
                                            index * 100 + 200
                                        }ms`,
                                    }}
                                >
                                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                                    <span className="leading-tight">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={onSelect}
                            className={cn(
                                "w-full group/start relative",
                                "flex items-center justify-center gap-2",
                                "py-2.5 px-4 rounded-lg",
                                "transition-all duration-300",
                                "font-semibold text-sm",
                                isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700",
                                "hover:scale-[1.02] hover:cursor-pointer",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            )}
                        >
                            {isSelected ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Seleccionado</span>
                                </>
                            ) : (
                                <>
                                    <span>Seleccionar Plan</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/start:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale {
                    0% {
                        transform: scale(2);
                        opacity: 0;
                        box-shadow: 0px 0px 50px rgba(59, 130, 246, 0.5);
                    }
                    50% {
                        transform: translate(0px, -5px) scale(1);
                        opacity: 1;
                        box-shadow: 0px 8px 20px rgba(59, 130, 246, 0.5);
                    }
                    100% {
                        transform: translate(0px, 5px) scale(0.1);
                        opacity: 0;
                        box-shadow: 0px 10px 20px rgba(59, 130, 246, 0);
                    }
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #22c55e;
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #16a34a;
                }
                
                /* Firefox */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #22c55e transparent;
                }
            `}</style>
        </div>
    );
}
