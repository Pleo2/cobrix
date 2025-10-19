import {
    IconMoodSmile,
    IconSparkles,
    IconTie,
    IconTools,
    IconCheck,
    IconX,
    IconAlertTriangle,
    IconBell,
    IconDiscount2,
} from "@tabler/icons-react";
import type React from "react";

export type MessageType = "exito" | "error" | "rechazado" | "recordatorio" | "marketing-hooking";
export type IconName = "smile" | "sparkles" | "tie" | "tools";

export interface Template {
    id: string;
    name: string;
    description: string;
    icon: IconName;
    messages: Record<MessageType, string>;
}

export const defaultTemplates: Template[] = [
    {
        id: "tpl_amistoso",
        name: "Tono Amigable y Cercano",
        description: "Ideal para gimnasios y comunidades. Comunica de forma casual y positiva.",
        icon: "smile",
        messages: {
            exito: "¡Todo listo, {nombreCliente}! Tu pago ha sido procesado. ¡A entrenar con todo!",
            error: "¡Ups! Algo salió mal con tu pago, {nombreCliente}. Por favor, revisa tus datos e intenta de nuevo.",
            rechazado:
                "Hola {nombreCliente}, parece que tu pago fue rechazado. Puedes actualizar tu método de pago desde tu perfil.",
            recordatorio:
                "¡Que no se te pase! Tu pago de {monto} vence el {fechaVencimiento}. Manten tu racha de entrenamiento.",
            "marketing-hooking":
                "¡Hey, {nombreCliente}! ¿Sabías que si refieres a un amigo ambos reciben un 10% de descuento en su próxima mensualidad?",
        },
    },
    {
        id: "tpl_profesional",
        name: "Tono Directo y Profesional",
        description: "Comunicación formal y clara. Perfecta para servicios corporativos o educativos.",
        icon: "tie",
        messages: {
            exito: "Estimado/a {nombreCliente}, confirmamos la recepción de su pago. Su suscripción ha sido renovada exitosamente.",
            error: "Se ha producido un error al procesar su pago. Por favor, verifique la información proporcionada.",
            rechazado:
                "Le informamos que su reciente pago ha sido rechazado por la entidad bancaria. Le recomendamos contactarlos o actualizar su información de pago.",
            recordatorio:
                "Le recordamos que su pago por un monto de {monto} tiene como fecha de vencimiento el día {fechaVencimiento}.",
            "marketing-hooking":
                "Estimado/a {nombreCliente}, le invitamos a conocer nuestro nuevo plan anual con un 15% de descuento exclusivo para clientes actuales.",
        },
    },
    {
        id: "tpl_moderno",
        name: "Tono Moderno y Casual",
        description: "Un estilo fresco y enérgico, ideal para startups y servicios digitales.",
        icon: "sparkles",
        messages: {
            // --- INICIO DE LA CORRECCIÓN ---
            // Esta era la línea que faltaba
            recordatorio:
                "¡Solo un recordatorio! Tu pago de {monto} está a la vuelta de la esquina ({fechaVencimiento}).",
            // --- FIN DE LA CORRECCIÓN ---
            exito: "¡Boom! ✨ Tu pago está confirmado, {nombreCliente}. ¡Gracias por ser parte de nuestra comunidad!",
            error: "¡Houston, tenemos un problema! No pudimos procesar tu pago. Échale un ojo a tus datos.",
            rechazado:
                "Tu pago no pasó esta vez. ¡No te preocupes! Actualiza tus datos de pago para seguir disfrutando del servicio.",
            "marketing-hooking":
                "¿Quieres un mes gratis? ¡Invita a 3 amigos a unirse y el próximo mes va por nuestra cuenta!",
        },
    },
];

export const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
    smile: IconMoodSmile,
    sparkles: IconSparkles,
    tie: IconTie,
    tools: IconTools,
};

export const messageConfig: Record<
    MessageType,
    {
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        placeholder: string;
        description: string;
    }
> = {
    recordatorio: {
        label: "Recordatorio de Pago",
        icon: IconBell,
        placeholder: "Ej: ¡Hola {nombreCliente}! Tu pago de {monto} vence pronto...",
        description:
            "Este es el mensaje principal. Se envía antes de la fecha de vencimiento para notificar al cliente.",
    },
    exito: {
        label: "Pago Exitoso",
        icon: IconCheck,
        placeholder: "Ej: ¡Recibimos tu pago! Gracias por tu confianza.",
        description: "Se envía automáticamente cuando un pago se procesa correctamente.",
    },
    error: {
        label: "Error en el Pago",
        icon: IconAlertTriangle,
        placeholder: "Ej: Hubo un error inesperado al procesar tu pago.",
        description: "Para notificar al cliente de un fallo técnico o problema inesperado durante el cobro.",
    },
    rechazado: {
        label: "Pago Rechazado",
        icon: IconX,
        placeholder: "Ej: Tu pago fue rechazado. Actualiza tu método de pago.",
        description: "Informa al cliente que su método de pago fue rechazado por el banco o la pasarela.",
    },
    "marketing-hooking": {
        label: "Marketing y Ofertas",
        icon: IconDiscount2,
        placeholder: "Ej: ¡Refiere a un amigo y ambos obtienen un descuento!",
        description: "Un mensaje opcional para promociones, ofertas o para incentivar la retención del cliente.",
    },
};

export const secondaryMessageOrder: MessageType[] = ["exito", "error", "rechazado", "marketing-hooking"];

