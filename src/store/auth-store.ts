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
                // Obtener datos del registro desde localStorage
                const registroEmpresa = localStorage.getItem('registroEmpresa');
                
                if (!registroEmpresa) {
                    return false;
                }

                const empresa: EmpresaData = JSON.parse(registroEmpresa);

                // Validar correo y contraseña
                // Por ahora, la contraseña será el RIF (puedes cambiar esto)
                if (empresa.correo === correo && empresa.rif === password) {
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
                // Si está autenticado pero no hay datos de empresa, cargarlos de localStorage
                if (state.isAuthenticated && !state.empresa) {
                    const registroEmpresa = localStorage.getItem('registroEmpresa');
                    if (registroEmpresa) {
                        const empresa: EmpresaData = JSON.parse(registroEmpresa);
                        set({ empresa });
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
