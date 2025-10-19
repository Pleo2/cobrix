import { IconMoodSmile, IconSparkles, IconTie } from "@tabler/icons-react";

// Tipos de mensajes que cada plantilla DEBE tener.
export type MessageType = "exito" | "error" | "rechazado" | "recordatorio" | "marketing-hooking";

// La estructura de un objeto de Plantilla.
export interface Template {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    messages: Record<MessageType, string>;
}

// Nuestras 3 plantillas por defecto.
export const defaultTemplates: Template[] = [
    {
        id: "tpl_amistoso",
        name: "Tono Amigable y Cercano",
        description: "Ideal para gimnasios y comunidades. Comunica de forma casual y positiva.",
        icon: IconMoodSmile,
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
        icon: IconTie,
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
        icon: IconSparkles,
        messages: {
            exito: "¡Boom! ✨ Tu pago está confirmado, {nombreCliente}. ¡Gracias por ser parte de nuestra comunidad!",
            error: "¡Houston, tenemos un problema! No pudimos procesar tu pago. Échale un ojo a tus datos.",
            rechazado:
                "Tu pago no pasó esta vez. ¡No te preocupes! Actualiza tus datos de pago para seguir disfrutando del servicio.",
            recordatorio:
                "¡Solo un recordatorio! Tu pago de {monto} está a la vuelta de la esquina ({fechaVencimiento}).",
            "marketing-hooking":
                "¿Quieres un mes gratis? ¡Invita a 3 amigos a unirse y el próximo mes va por nuestra cuenta!",
        },
    },
];
