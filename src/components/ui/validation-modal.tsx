"use client";

import { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export function ValidationModal({ isOpen, onClose, title, message }: ValidationModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
                    "animate-in fade-in-0 duration-300"
                )}
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 animate-in fade-in-0 zoom-in-95 slide-in-from-top-[48%] sm:rounded-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cerrar</span>
                </button>

                {/* Content */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h2 className="text-lg font-semibold">{title}</h2>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{message}</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
