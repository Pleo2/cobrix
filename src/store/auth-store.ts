import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EmpresaData {
    nombreEmpresa: string;
    rif: string;
    nombreDueno: string;
    ubicacion: string;
    volumenClientes: string;
    nicho: string;
    correo: string;
    telefono: string;
    plan?: any;
    metodoPago?: any;
    fechaRegistro?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    empresa: EmpresaData | null;
    login: (correo: string, password: string) => boolean;
    logout: () => void;
    setEmpresa: (empresa: EmpresaData) => void;
    initializeSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            empresa: null,

            login: (correo: string, password: string) => {
                // Obtener todas las empresas registradas
                const registrosEmpresas = localStorage.getItem('registrosEmpresas');
                
                if (!registrosEmpresas) {
                    return false;
                }

                const empresas = JSON.parse(registrosEmpresas);
                
                // Buscar empresa por correo y contraseña
                const empresa = empresas.find((e: any) => 
                    e.correo.toLowerCase() === correo.toLowerCase() && 
                    e.password === password
                );

                if (empresa) {
                    set({ 
                        isAuthenticated: true, 
                        empresa: empresa 
                    });
                    return true;
                }

                return false;
            },

            logout: () => {
                set({ 
                    isAuthenticated: false, 
                    empresa: null 
                });
            },

            setEmpresa: (empresa: EmpresaData) => {
                set({ empresa });
            },

            initializeSession: () => {
                const state = get();
                // Si está autenticado pero no hay datos de empresa, intentar cargar
                if (state.isAuthenticated && !state.empresa) {
                    // Primero intentar del nuevo sistema
                    const registrosEmpresas = localStorage.getItem('registrosEmpresas');
                    if (registrosEmpresas) {
                        const empresas = JSON.parse(registrosEmpresas);
                        if (empresas.length > 0) {
                            // Tomar la primera empresa (puedes mejorar esto)
                            set({ empresa: empresas[0] });
                        }
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
