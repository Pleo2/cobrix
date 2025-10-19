import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { defaultTemplates, Template } from "@/components/acount/templates-manager/data"; // Ajusta la ruta si es necesario
import { IconMoodSmile } from "@tabler/icons-react"; // Necesitamos un icono por defecto

// Estado y Acciones del Store
interface TemplateState {
    templates: Template[];
    isInitialized: boolean;
    initializeTemplates: () => void;
    addTemplate: (newTemplate: Template) => void;
    updateTemplate: (updatedTemplate: Template) => void;
}

export const useTemplateStore = create<TemplateState>()(
    persist(
        (set, get) => ({
            templates: [],
            isInitialized: false,

            // Acción para inicializar con datos por defecto si no hay nada en localStorage
            initializeTemplates: () => {
                if (!get().isInitialized) {
                    // El middleware 'persist' ya habrá cargado desde localStorage si existe.
                    // Si después de eso 'templates' sigue vacío, cargamos los por defecto.
                    if (get().templates.length === 0) {
                        set({ templates: defaultTemplates, isInitialized: true });
                    } else {
                        set({ isInitialized: true });
                    }
                }
            },

            // Acción para añadir una nueva plantilla
            addTemplate: (newTemplate) => {
                set((state) => ({
                    templates: [...state.templates, newTemplate],
                }));
            },

            // Acción para actualizar una plantilla existente
            updateTemplate: (updatedTemplate) => {
                set((state) => ({
                    templates: state.templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)),
                }));
            },
        }),
        {
            name: "cobrix-templates-storage", // Nombre de la clave en localStorage
            storage: createJSONStorage(() => localStorage), // Usar localStorage
        }
    )
);
