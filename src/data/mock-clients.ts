// Mock data de clientes variados para transacciones en tiempo real

export const mockClients = [
    {
        nombre: "Roberto Silva",
        concepto: "Mensualidad Noviembre 2024",
        monto: [35, 45, 50, 55],
        metodoPago: ["Pago Móvil", "Transferencia", "Zelle"]
    },
    {
        nombre: "Isabella Moreno",
        concepto: "Plan Trimestral",
        monto: [100, 120, 150],
        metodoPago: ["Transferencia", "Zelle", "Binance"]
    },
    {
        nombre: "Diego Fernández",
        concepto: "Clase Personal Training",
        monto: [75, 85, 95],
        metodoPago: ["Pago Móvil", "Transferencia"]
    },
    {
        nombre: "Valentina Cruz",
        concepto: "Mensualidad Noviembre 2024",
        monto: [35, 45, 50],
        metodoPago: ["Pago Móvil", "Zelle"]
    },
    {
        nombre: "Santiago Ruiz",
        concepto: "Plan Premium Mensual",
        monto: [65, 70, 75],
        metodoPago: ["Transferencia", "Binance", "Zelle"]
    },
    {
        nombre: "Camila Torres",
        concepto: "Plan Básico Mensual",
        monto: [25, 30, 35],
        metodoPago: ["Pago Móvil", "Transferencia"]
    },
    {
        nombre: "Mateo Vargas",
        concepto: "Plan Elite Mensual",
        monto: [80, 90, 100],
        metodoPago: ["Zelle", "Binance", "Transferencia"]
    },
    {
        nombre: "Lucía Herrera",
        concepto: "Renovación Anual",
        monto: [400, 450, 500],
        metodoPago: ["Transferencia", "Zelle"]
    },
    {
        nombre: "Andrés Castillo",
        concepto: "Mensualidad Noviembre 2024",
        monto: [35, 45, 50],
        metodoPago: ["Pago Móvil", "Transferencia"]
    },
    {
        nombre: "Sofía Mendoza",
        concepto: "Plan Profesional Mensual",
        monto: [50, 55, 60],
        metodoPago: ["Pago Móvil", "Zelle", "Binance"]
    },
    {
        nombre: "Gabriel Ortiz",
        concepto: "Plan Familiar",
        monto: [85, 90, 95],
        metodoPago: ["Transferencia", "Zelle"]
    },
    {
        nombre: "Elena Romero",
        concepto: "Clase Grupal",
        monto: [15, 20, 25],
        metodoPago: ["Pago Móvil", "Transferencia"]
    },
    {
        nombre: "Nicolás Jiménez",
        concepto: "Plan Premium Mensual",
        monto: [65, 70, 75],
        metodoPago: ["Zelle", "Binance"]
    },
    {
        nombre: "Victoria Soto",
        concepto: "Mensualidad Noviembre 2024",
        monto: [35, 45, 50],
        metodoPago: ["Pago Móvil", "Transferencia"]
    },
    {
        nombre: "Miguel Navarro",
        concepto: "Plan Estudiantil",
        monto: [20, 25, 30],
        metodoPago: ["Pago Móvil"]
    },
    {
        nombre: "Daniela Campos",
        concepto: "Personal Training",
        monto: [75, 85, 95],
        metodoPago: ["Transferencia", "Zelle"]
    },
    {
        nombre: "Joaquín Peña",
        concepto: "Plan Elite Mensual",
        monto: [80, 90, 100],
        metodoPago: ["Binance", "Zelle", "Transferencia"]
    },
    {
        nombre: "Mariana Lagos",
        concepto: "Plan Básico Mensual",
        monto: [25, 30, 35],
        metodoPago: ["Pago Móvil", "Transferencia"]
    },
    {
        nombre: "Fernando Ríos",
        concepto: "Mensualidad Noviembre 2024",
        monto: [35, 45, 50],
        metodoPago: ["Pago Móvil", "Zelle"]
    },
    {
        nombre: "Carolina Vega",
        concepto: "Plan Premium Mensual",
        monto: [65, 70, 75],
        metodoPago: ["Transferencia", "Zelle", "Binance"]
    }
];

// Función para generar una transacción aleatoria
export function generateRandomTransaction(id: number) {
    const client = mockClients[Math.floor(Math.random() * mockClients.length)];
    const monto = client.monto[Math.floor(Math.random() * client.monto.length)];
    const metodoPago = client.metodoPago[Math.floor(Math.random() * client.metodoPago.length)];
    
    // Estados posibles: 50% Exitosa, 30% Rechazada, 20% Conciliación Manual
    const random = Math.random();
    let estado;
    if (random < 0.5) {
        estado = "Procesando"; // Cambiará a "Exitosa" después del loader
    } else if (random < 0.8) {
        estado = "Procesando"; // Cambiará a "Rechazada"
    } else {
        estado = "Procesando"; // Cambiará a "Conciliación Manual"
    }
    
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    return {
        id,
        referencia: `GYM-2024-${String(id).padStart(3, '0')}`,
        cliente: client.nombre,
        concepto: client.concepto,
        monto,
        metodoPago,
        estado,
        fecha: `${fecha} ${hora}`,
        // Metadata adicional para el detalle
        estadoFinal: random < 0.5 ? "Exitosa" : random < 0.8 ? "Rechazada" : "Conciliación Manual",
        motivoRechazo: random >= 0.5 && random < 0.8 ? 
            ["Timeout de conexión", "Fondos insuficientes", "Error de validación", "Cuenta bloqueada"][Math.floor(Math.random() * 4)] : 
            undefined
    };
}
