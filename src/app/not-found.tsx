"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hummingbird } from "@/components/marketing/hummingbird";

export default function NotFound() {
    const router = useRouter();

    function handleNavigation(path: string): void {
        router.push(path);
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
            {/* Colibrí 3D en el fondo con fade in */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full pointer-events-none"
            >
                <Hummingbird className="w-full h-full" fov={50} />
            </motion.div>

            {/* Contenido del 404 con fade in escalonado */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="relative z-10 flex flex-col gap-6 items-center justify-center p-8 text-center max-w-2xl"
            >
                <div className="space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                        className="text-9xl font-bold text-black"
                    >
                        404
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="text-3xl font-semibold text-black"
                    >
                        Página no encontrada
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="text-lg text-black"
                    >
                        Lo sentimos, la página que buscas parece haber volado lejos como nuestro
                        colibrí.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="flex gap-4 mt-6"
                >
                    <button
                        onClick={() => handleNavigation("/")}
                        className="group relative cursor-pointer bg-slate-900 h-16 w-full sm:w-64 border-2 border-primary text-white text-base font-bold rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:border-emerald-400 hover:text-emerald-300 p-3 text-left before:absolute before:w-10 before:h-10 before:content-[''] before:right-2 before:top-2 before:z-10 before:bg-primary before:rounded-full before:blur-lg before:transition-all before:duration-500 after:absolute after:z-10 after:w-16 after:h-16 after:content-[''] after:bg-emerald-400 after:right-6 after:top-4 after:rounded-full after:blur-lg after:transition-all after:duration-500 hover:before:right-10 hover:before:-bottom-4 hover:before:blur hover:after:-right-6 hover:after:scale-110 z-80"
                    >
                        <span className="relative z-20">Volver al inicio</span>
                    </button>
                </motion.div>
            </motion.div>

            {/* Decoración de fondo con fade in */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/50 to-transparent pointer-events-none"
            />
        </div>
    );
}
