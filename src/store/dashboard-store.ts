import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==================== TIPOS ====================

export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    cedula: string;
    email: string;
    phone: string;
    address: string;
    createdAt?: string;
}

export interface Transaction {
    id: number;
    cliente: string;
    concepto: string;
    monto: number;
    metodoPago: string;
    estado: string;
    fecha: string;
    referencia: string;
}

export interface Invoice {
    id: number;
    invoice_number: string;
    client: string;
    email: string;
    amount: string;
    status: "Pagado" | "Pendiente" | "Vencido";
    date: string;
    due_date: string;
    plan_type: string;
    payment_method: string;
    exchange_rate: string;
}

export interface Subscription {
    id: string;
    clientName: string;
    email: string;
    plan: string;
    price?: number;
    status: "Activo" | "En Apelación" | "Cancelado";
    billingCycle?: string;
    nextPaymentDate: string | null;
}

export interface MessageTemplate {
    id: number;
    title: string;
    description: string;
    category: string;
    content?: string;
    createdAt?: string;
}

export interface ClientProfile {
    id: number;
    title: string;
    description: string;
    category: string;
    features?: string[];
    createdAt?: string;
}

export interface ScreenTemplate {
    id: number;
    title: string;
    description: string;
    category: string;
    components?: unknown[];
    createdAt?: string;
}

// ==================== ESTADO ====================

interface DashboardState {
    // Data
    clients: Client[];
    transactions: Transaction[];
    invoices: Invoice[];
    subscriptions: Subscription[];
    messageTemplates: MessageTemplate[];
    clientProfiles: ClientProfile[];
    screenTemplates: ScreenTemplate[];

    // Estado de hidratación
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;

    // Estadísticas derivadas
    getClientsCount: () => number;
    getActiveSubscriptionsCount: () => number;
    getCancelledSubscriptionsCount: () => number;
    getAppealSubscriptionsCount: () => number;
    getPendingInvoicesCount: () => number;
    getPaidInvoicesCount: () => number;
    getOverdueInvoicesCount: () => number;
    getTotalRevenue: () => number;
    getTodayRevenue: () => number;
    getTransactionsByPaymentMethod: () => Record<string, number>;

    // Acciones - Clientes
    addClient: (client: Omit<Client, "id">) => void;
    updateClient: (id: number, client: Partial<Client>) => void;
    deleteClient: (id: number) => void;

    // Acciones - Transacciones
    addTransaction: (transaction: Omit<Transaction, "id">) => void;
    updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
    deleteTransaction: (id: number) => void;

    // Acciones - Facturas
    addInvoice: (invoice: Omit<Invoice, "id">) => void;
    updateInvoice: (id: number, invoice: Partial<Invoice>) => void;
    deleteInvoice: (id: number) => void;

    // Acciones - Suscripciones
    addSubscription: (subscription: Omit<Subscription, "id">) => void;
    updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
    deleteSubscription: (id: string) => void;

    // Acciones - Plantillas de Mensajes
    addMessageTemplate: (template: Omit<MessageTemplate, "id">) => void;
    updateMessageTemplate: (id: number, template: Partial<MessageTemplate>) => void;
    deleteMessageTemplate: (id: number) => void;

    // Acciones - Perfiles de Clientes
    addClientProfile: (profile: Omit<ClientProfile, "id">) => void;
    updateClientProfile: (id: number, profile: Partial<ClientProfile>) => void;
    deleteClientProfile: (id: number) => void;

    // Acciones - Plantillas de Pantallas
    addScreenTemplate: (template: Omit<ScreenTemplate, "id">) => void;
    updateScreenTemplate: (id: number, template: Partial<ScreenTemplate>) => void;
    deleteScreenTemplate: (id: number) => void;

    // Inicialización
    initializeFromLocalStorage: () => void;
    resetStore: () => void;
    resetSubscriptions: () => void;
    resetInvoices: () => void;
}

// ==================== DATA INICIAL ====================

const initialTransactions: Transaction[] = [
    {
        id: 1,
        cliente: "Carlos Méndez",
        concepto: "Mensualidad Octubre 2024",
        monto: 45.0,
        metodoPago: "Pago Móvil",
        estado: "Completado",
        fecha: "19 Oct 2024",
        referencia: "GYM-2024-001",
    },
    {
        id: 2,
        cliente: "Maria Gonzalez",
        concepto: "Plan Trimestral",
        monto: 120.0,
        metodoPago: "Transferencia",
        estado: "Completado",
        fecha: "19 Oct 2024",
        referencia: "GYM-2024-002",
    },
    {
        id: 3,
        cliente: "José Ramírez",
        concepto: "Mensualidad Octubre 2024",
        monto: 45.0,
        metodoPago: "Zelle",
        estado: "Completado",
        fecha: "19 Oct 2024",
        referencia: "GYM-2024-003",
    },
    {
        id: 4,
        cliente: "Ana Martínez",
        concepto: "Plan Personal Training",
        monto: 85.0,
        metodoPago: "Pago Móvil",
        estado: "Procesando",
        fecha: "17 Oct 2024",
        referencia: "GYM-2024-004",
    },
    {
        id: 5,
        cliente: "Pedro López",
        concepto: "Mensualidad Octubre 2024",
        monto: 45.0,
        metodoPago: "Transferencia",
        estado: "Completado",
        fecha: "17 Oct 2024",
        referencia: "GYM-2024-005",
    },
    {
        id: 6,
        cliente: "Jack Alfredo",
        concepto: "Plan Profesional Mensual",
        monto: 50.0,
        metodoPago: "Pago Móvil",
        estado: "Completado",
        fecha: "19 Oct 2024",
        referencia: "GYM-2024-006",
    },
    {
        id: 7,
        cliente: "John Doe",
        concepto: "Plan Premium Mensual",
        monto: 70.0,
        metodoPago: "Binance",
        estado: "Completado",
        fecha: "19 Oct 2024",
        referencia: "GYM-2024-007",
    },
    {
        id: 8,
        cliente: "Emily Carter",
        concepto: "Plan Profesional Mensual",
        monto: 50.0,
        metodoPago: "Binance",
        estado: "Procesando",
        fecha: "15 Oct 2024",
        referencia: "GYM-2024-008",
    },
    {
        id: 9,
        cliente: "David Lee",
        concepto: "Plan Premium Mensual",
        monto: 70.0,
        metodoPago: "Pago Móvil",
        estado: "Completado",
        fecha: "14 Oct 2024",
        referencia: "GYM-2024-009",
    },
    {
        id: 10,
        cliente: "Sarah Johnson",
        concepto: "Plan Básico Mensual",
        monto: 30.0,
        metodoPago: "Transferencia",
        estado: "Pendiente",
        fecha: "14 Oct 2024",
        referencia: "GYM-2024-010",
    },
];

const initialInvoices: Invoice[] = [
    {
        id: 1,
        invoice_number: "INV-2024-001",
        client: "Jack Alfredo",
        email: "jack@shadcnstudio.com",
        amount: "$50.00",
        status: "Pagado",
        date: "2025-09-15",
        due_date: "2025-10-15",
        plan_type: "Profesional",
        payment_method: "Pago Móvil",
        exchange_rate: "1.0",
    },
    {
        id: 2,
        invoice_number: "INV-2024-002",
        client: "Maria Gonzalez",
        email: "maria.g@shadcnstudio.com",
        amount: "$30.00",
        status: "Pendiente",
        date: "2025-10-20",
        due_date: "2025-11-20",
        plan_type: "Básico",
        payment_method: "Zelle",
        exchange_rate: "1.0",
    },
    {
        id: 3,
        invoice_number: "INV-2024-003",
        client: "John Doe",
        email: "john.doe@shadcnstudio.com",
        amount: "$70.00",
        status: "Pagado",
        date: "2025-09-10",
        due_date: "2025-10-10",
        plan_type: "Premium",
        payment_method: "Transferencia",
        exchange_rate: "1.0",
    },
    {
        id: 4,
        invoice_number: "INV-2024-004",
        client: "Ana Pérez",
        email: "ana.perez@email.com",
        amount: "$70.00",
        status: "Pagado",
        date: "2025-10-01",
        due_date: "2025-11-01",
        plan_type: "Premium",
        payment_method: "Transferencia",
        exchange_rate: "1.0",
    },
    {
        id: 5,
        invoice_number: "INV-2024-005",
        client: "Carlos García",
        email: "carlos.garcia@email.com",
        amount: "$30.00",
        status: "Vencido",
        date: "2025-09-05",
        due_date: "2025-10-05",
        plan_type: "Básico",
        payment_method: "Pago Móvil",
        exchange_rate: "1.0",
    },
    {
        id: 6,
        invoice_number: "INV-2024-006",
        client: "Sofía López",
        email: "sofia.lopez@email.com",
        amount: "$70.00",
        status: "Pagado",
        date: "2025-10-15",
        due_date: "2025-11-15",
        plan_type: "Premium",
        payment_method: "Zelle",
        exchange_rate: "1.0",
    },
    {
        id: 7,
        invoice_number: "INV-2024-007",
        client: "Miguel Hernández",
        email: "miguel.h@email.com",
        amount: "$100.00",
        status: "Pagado",
        date: "2024-09-01",
        due_date: "2025-09-01",
        plan_type: "Anual",
        payment_method: "Transferencia",
        exchange_rate: "1.0",
    },
    {
        id: 8,
        invoice_number: "INV-2024-008",
        client: "David Sánchez",
        email: "david.sanchez@email.com",
        amount: "$70.00",
        status: "Pendiente",
        date: "2025-10-22",
        due_date: "2025-11-22",
        plan_type: "Premium",
        payment_method: "Pago Móvil",
        exchange_rate: "1.0",
    },
    {
        id: 9,
        invoice_number: "INV-2024-009",
        client: "Elena Torres",
        email: "elena.torres@email.com",
        amount: "$30.00",
        status: "Pagado",
        date: "2025-10-25",
        due_date: "2025-11-25",
        plan_type: "Básico",
        payment_method: "Zelle",
        exchange_rate: "1.0",
    },
    {
        id: 10,
        invoice_number: "INV-2024-010",
        client: "Francisco Romero",
        email: "francisco.r@email.com",
        amount: "$70.00",
        status: "Pagado",
        date: "2025-10-28",
        due_date: "2025-11-28",
        plan_type: "Premium",
        payment_method: "Transferencia",
        exchange_rate: "1.0",
    },
    {
        id: 11,
        invoice_number: "INV-2024-011",
        client: "Patricia Díaz",
        email: "patricia.diaz@email.com",
        amount: "$50.00",
        status: "Pendiente",
        date: "2025-10-12",
        due_date: "2025-11-12",
        plan_type: "Profesional",
        payment_method: "Pago Móvil",
        exchange_rate: "1.0",
    },
    {
        id: 12,
        invoice_number: "INV-2024-012",
        client: "Roberto Vargas",
        email: "roberto.vargas@email.com",
        amount: "$70.00",
        status: "Vencido",
        date: "2025-09-08",
        due_date: "2025-10-08",
        plan_type: "Premium",
        payment_method: "Zelle",
        exchange_rate: "1.0",
    },
    {
        id: 13,
        invoice_number: "INV-2024-013",
        client: "Jorge Castillo",
        email: "jorge.castillo@email.com",
        amount: "$50.00",
        status: "Pagado",
        date: "2025-10-18",
        due_date: "2025-11-18",
        plan_type: "Profesional",
        payment_method: "Transferencia",
        exchange_rate: "1.0",
    },
    {
        id: 14,
        invoice_number: "INV-2024-014",
        client: "María Fernández",
        email: "maria.fernandez@email.com",
        amount: "$70.00",
        status: "Pagado",
        date: "2025-10-22",
        due_date: "2025-11-22",
        plan_type: "Premium",
        payment_method: "Pago Móvil",
        exchange_rate: "1.0",
    },
    {
        id: 15,
        invoice_number: "INV-2024-015",
        client: "Luis Morales",
        email: "luis.morales@email.com",
        amount: "$30.00",
        status: "Vencido",
        date: "2025-08-25",
        due_date: "2025-09-25",
        plan_type: "Básico",
        payment_method: "Pago Móvil",
        exchange_rate: "1.0",
    },
];

const initialMessageTemplates: MessageTemplate[] = [
    {
        id: 1,
        title: "Bienvenida al Cliente",
        description: "Mensaje de bienvenida para nuevos clientes que se suscriben a nuestros servicios.",
        category: "Bienvenida",
        content: "Bienvenido a nuestro servicio...",
    },
    {
        id: 2,
        title: "Renovación de Suscripción",
        description: "Aviso para clientes sobre próxima renovación de su suscripción.",
        category: "Renovación",
        content: "Tu suscripción está próxima a renovarse...",
    },
    {
        id: 3,
        title: "Confirmación de Pago",
        description: "Confirmación al cliente cuando se recibe un pago exitoso.",
        category: "Pagos",
        content: "Hemos recibido tu pago exitosamente...",
    },
    {
        id: 4,
        title: "Recordatorio de Vencimiento",
        description: "Recordatorio a cliente sobre vencimiento próximo de su servicio.",
        category: "Recordatorios",
        content: "Tu servicio está próximo a vencer...",
    },
];

const initialClientProfiles: ClientProfile[] = [
    {
        id: 1,
        title: "Clientes Premium",
        description: "Clientes con suscripción premium y acceso a todas las funcionalidades.",
        category: "Premium",
        features: ["Acceso completo", "Soporte prioritario", "Descuentos exclusivos"],
    },
    {
        id: 2,
        title: "Clientes Básicos",
        description: "Clientes con plan básico con acceso limitado a funcionalidades.",
        category: "Básico",
        features: ["Funcionalidades básicas", "Soporte estándar"],
    },
    {
        id: 3,
        title: "Clientes Profesionales",
        description: "Clientes con plan profesional y soporte prioritario.",
        category: "Profesional",
        features: ["Funcionalidades avanzadas", "Soporte prioritario"],
    },
    {
        id: 4,
        title: "Clientes Inactivos",
        description: "Clientes con suscripción expirada o cancelada.",
        category: "Inactivo",
        features: ["Acceso limitado"],
    },
];

const initialScreenTemplates: ScreenTemplate[] = [
    {
        id: 1,
        title: "Dashboard Principal",
        description: "Panel de control personalizado con widgets y gráficos en tiempo real.",
        category: "Dashboard",
    },
    {
        id: 2,
        title: "Gestión de Clientes",
        description: "Pantalla para administrar y visualizar información de clientes.",
        category: "Gestión",
    },
    {
        id: 3,
        title: "Reportes Avanzados",
        description: "Plantilla para crear reportes personalizados con múltiples vistas.",
        category: "Reportes",
    },
    {
        id: 4,
        title: "Configuración del Sistema",
        description: "Pantalla para configurar parámetros y preferencias del sistema.",
        category: "Configuración",
    },
];

const initialSubscriptions: Subscription[] = [
    {
        id: "SUB001",
        clientName: "Ana Pérez",
        email: "ana.perez@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-01",
    },
    {
        id: "SUB002",
        clientName: "Carlos García",
        email: "carlos.garcia@email.com",
        plan: "Plan Básico",
        price: 30,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-05",
    },
    {
        id: "SUB003",
        clientName: "Laura Martínez",
        email: "laura.martinez@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "Cancelado",
        billingCycle: "Mensual",
        nextPaymentDate: null,
    },
    {
        id: "SUB004",
        clientName: "Juan Rodríguez",
        email: "juan.rodriguez@email.com",
        plan: "Plan Básico",
        price: 30,
        status: "En Apelación",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-10-20",
    },
    {
        id: "SUB005",
        clientName: "Sofía López",
        email: "sofia.lopez@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-15",
    },
    {
        id: "SUB006",
        clientName: "Miguel Hernández",
        email: "miguel.h@email.com",
        plan: "Plan Anual",
        price: 100,
        status: "Activo",
        billingCycle: "Anual",
        nextPaymentDate: "2026-09-01",
    },
    {
        id: "SUB007",
        clientName: "Isabel Gómez",
        email: "isabel.gomez@email.com",
        plan: "Plan Básico",
        price: 30,
        status: "Cancelado",
        billingCycle: "Mensual",
        nextPaymentDate: null,
    },
    {
        id: "SUB008",
        clientName: "David Sánchez",
        email: "david.sanchez@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "En Apelación",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-10-22",
    },
    {
        id: "SUB009",
        clientName: "Elena Torres",
        email: "elena.torres@email.com",
        plan: "Plan Básico",
        price: 30,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-25",
    },
    {
        id: "SUB010",
        clientName: "Francisco Romero",
        email: "francisco.r@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-28",
    },
    {
        id: "SUB011",
        clientName: "Patricia Díaz",
        email: "patricia.diaz@email.com",
        plan: "Plan Profesional",
        price: 50,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-12",
    },
    {
        id: "SUB012",
        clientName: "Roberto Vargas",
        email: "roberto.vargas@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-08",
    },
    {
        id: "SUB013",
        clientName: "Carmen Silva",
        email: "carmen.silva@email.com",
        plan: "Plan Básico",
        price: 30,
        status: "Cancelado",
        billingCycle: "Mensual",
        nextPaymentDate: null,
    },
    {
        id: "SUB014",
        clientName: "Jorge Castillo",
        email: "jorge.castillo@email.com",
        plan: "Plan Profesional",
        price: 50,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-18",
    },
    {
        id: "SUB015",
        clientName: "María Fernández",
        email: "maria.fernandez@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-22",
    },
    {
        id: "SUB016",
        clientName: "Luis Morales",
        email: "luis.morales@email.com",
        plan: "Plan Básico",
        price: 30,
        status: "En Apelación",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-10-25",
    },
    {
        id: "SUB017",
        clientName: "Gabriela Ruiz",
        email: "gabriela.ruiz@email.com",
        plan: "Plan Profesional",
        price: 50,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-30",
    },
    {
        id: "SUB018",
        clientName: "Ricardo Medina",
        email: "ricardo.medina@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-14",
    },
    {
        id: "SUB019",
        clientName: "Lucía Ortiz",
        email: "lucia.ortiz@email.com",
        plan: "Plan Anual",
        price: 100,
        status: "Activo",
        billingCycle: "Anual",
        nextPaymentDate: "2026-10-15",
    },
    {
        id: "SUB020",
        clientName: "Fernando Navarro",
        email: "fernando.navarro@email.com",
        plan: "Plan Básico",
        price: 30,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-20",
    },
    {
        id: "SUB021",
        clientName: "Valentina Cruz",
        email: "valentina.cruz@email.com",
        plan: "Plan Profesional",
        price: 50,
        status: "Cancelado",
        billingCycle: "Mensual",
        nextPaymentDate: null,
    },
    {
        id: "SUB022",
        clientName: "Andrés Flores",
        email: "andres.flores@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-10",
    },
    {
        id: "SUB023",
        clientName: "Beatriz Ramos",
        email: "beatriz.ramos@email.com",
        plan: "Plan Básico",
        price: 30,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-16",
    },
    {
        id: "SUB024",
        clientName: "Sebastián Aguilar",
        email: "sebastian.aguilar@email.com",
        plan: "Plan Premium",
        price: 70,
        status: "En Apelación",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-10-28",
    },
    {
        id: "SUB025",
        clientName: "Daniela Mendoza",
        email: "daniela.mendoza@email.com",
        plan: "Plan Profesional",
        price: 50,
        status: "Activo",
        billingCycle: "Mensual",
        nextPaymentDate: "2025-11-26",
    },
];

// Data inicial de clientes (basada en los usuarios de invoices y transacciones)
const initialClients: Client[] = [
    // {
    //     id: 1,
    //     firstName: "Jack",
    //     lastName: "Alfredo",
    //     cedula: "V-12345678",
    //     email: "jack@shadcnstudio.com",
    //     phone: "+1 (555) 123-4567",
    //     address: "123 Main St, New York, NY 10001",
    //     createdAt: "2024-01-15T00:00:00.000Z",
    // },
    // {
    //     id: 2,
    //     firstName: "Maria",
    //     lastName: "Gonzalez",
    //     cedula: "V-23456789",
    //     email: "maria.g@shadcnstudio.com",
    //     phone: "+1 (555) 234-5678",
    //     address: "456 Oak Ave, Los Angeles, CA 90001",
    //     createdAt: "2024-02-20T00:00:00.000Z",
    // },
    // {
    //     id: 3,
    //     firstName: "John",
    //     lastName: "Doe",
    //     cedula: "V-34567890",
    //     email: "john.doe@shadcnstudio.com",
    //     phone: "+1 (555) 345-6789",
    //     address: "789 Pine Rd, Chicago, IL 60601",
    //     createdAt: "2024-03-10T00:00:00.000Z",
    // },
    // {
    //     id: 4,
    //     firstName: "Emily",
    //     lastName: "Carter",
    //     cedula: "V-45678901",
    //     email: "emily.carter@shadcnstudio.com",
    //     phone: "+1 (555) 456-7890",
    //     address: "321 Elm St, Houston, TX 77001",
    //     createdAt: "2024-04-05T00:00:00.000Z",
    // },
    // {
    //     id: 5,
    //     firstName: "David",
    //     lastName: "Lee",
    //     cedula: "V-56789012",
    //     email: "david.lee@shadcnstudio.com",
    //     phone: "+1 (555) 567-8901",
    //     address: "654 Maple Dr, Phoenix, AZ 85001",
    //     createdAt: "2024-05-12T00:00:00.000Z",
    // },
    // {
    //     id: 6,
    //     firstName: "Sarah",
    //     lastName: "Johnson",
    //     cedula: "V-67890123",
    //     email: "sarah.j@shadcnstudio.com",
    //     phone: "+1 (555) 678-9012",
    //     address: "987 Cedar Ln, Philadelphia, PA 19101",
    //     createdAt: "2024-06-18T00:00:00.000Z",
    // },
    // {
    //     id: 7,
    //     firstName: "Carlos",
    //     lastName: "Méndez",
    //     cedula: "V-78901234",
    //     email: "carlos.mendez@example.com",
    //     phone: "+58 412 123 4567",
    //     address: "Av. Libertador, Caracas, Venezuela",
    //     createdAt: "2024-07-01T00:00:00.000Z",
    // },
    // {
    //     id: 8,
    //     firstName: "José",
    //     lastName: "Ramírez",
    //     cedula: "V-89012345",
    //     email: "jose.ramirez@example.com",
    //     phone: "+58 414 234 5678",
    //     address: "Av. Bolívar, Maracaibo, Venezuela",
    //     createdAt: "2024-08-05T00:00:00.000Z",
    // },
    // {
    //     id: 9,
    //     firstName: "Ana",
    //     lastName: "Martínez",
    //     cedula: "V-90123456",
    //     email: "ana.martinez@example.com",
    //     phone: "+58 416 345 6789",
    //     address: "Calle Principal, Valencia, Venezuela",
    //     createdAt: "2024-08-15T00:00:00.000Z",
    // },
    // {
    //     id: 10,
    //     firstName: "Pedro",
    //     lastName: "López",
    //     cedula: "V-01234567",
    //     email: "pedro.lopez@example.com",
    //     phone: "+58 424 456 7890",
    //     address: "Av. Universidad, Barquisimeto, Venezuela",
    //     createdAt: "2024-09-01T00:00:00.000Z",
    // },
];

// ==================== STORE ====================

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set, get) => ({
            // Estado inicial
            clients: initialClients,
            transactions: initialTransactions,
            invoices: initialInvoices,
            subscriptions: initialSubscriptions,
            messageTemplates: initialMessageTemplates,
            clientProfiles: initialClientProfiles,
            screenTemplates: initialScreenTemplates,

            // Estado de hidratación
            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({ _hasHydrated: state });
            },

            // Estadísticas derivadas
            getClientsCount: () => get().clients.length,

            getActiveSubscriptionsCount: () => get().subscriptions.filter((s) => s.status === "Activo").length,

            getCancelledSubscriptionsCount: () => get().subscriptions.filter((s) => s.status === "Cancelado").length,

            getAppealSubscriptionsCount: () => get().subscriptions.filter((s) => s.status === "En Apelación").length,

            getPendingInvoicesCount: () => get().invoices.filter((i) => i.status === "Pendiente").length,

            getPaidInvoicesCount: () => get().invoices.filter((i) => i.status === "Pagado").length,

            getOverdueInvoicesCount: () => get().invoices.filter((i) => i.status === "Vencido").length,

            getTotalRevenue: () =>
                get()
                    .transactions.filter((t) => t.estado === "Completado")
                    .reduce((sum, t) => sum + t.monto, 0),

            getTodayRevenue: () => {
                const today = new Date();
                const todayStr = `${today.getDate()} ${today.toLocaleDateString("es-ES", {
                    month: "short",
                })} ${today.getFullYear()}`.replace(".", "");
                return get()
                    .transactions.filter((t) => t.estado === "Completado" && t.fecha === todayStr)
                    .reduce((sum, t) => sum + t.monto, 0);
            },

            getTransactionsByPaymentMethod: () => {
                const transactions = get().transactions.filter((t) => t.estado === "Completado");
                const byMethod: Record<string, number> = {};

                transactions.forEach((t) => {
                    const method = t.metodoPago;
                    byMethod[method] = (byMethod[method] || 0) + 1;
                });

                return byMethod;
            },

            // ==================== CLIENTES ====================
            addClient: (client) => {
                const newClient = {
                    ...client,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    clients: [...state.clients, newClient],
                }));
            },

            updateClient: (id, clientUpdate) => {
                set((state) => ({
                    clients: state.clients.map((c) => (c.id === id ? { ...c, ...clientUpdate } : c)),
                }));
            },

            deleteClient: (id) => {
                set((state) => ({
                    clients: state.clients.filter((c) => c.id !== id),
                }));
            },

            // ==================== TRANSACCIONES ====================
            addTransaction: (transaction) => {
                const newTransaction = {
                    ...transaction,
                    id: Date.now(),
                };
                set((state) => ({
                    transactions: [...state.transactions, newTransaction],
                }));
            },

            updateTransaction: (id, transactionUpdate) => {
                set((state) => ({
                    transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...transactionUpdate } : t)),
                }));
            },

            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },

            // ==================== FACTURAS ====================
            addInvoice: (invoice) => {
                const newInvoice = {
                    ...invoice,
                    id: Date.now(),
                };
                set((state) => ({
                    invoices: [...state.invoices, newInvoice],
                }));
            },

            updateInvoice: (id, invoiceUpdate) => {
                set((state) => ({
                    invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...invoiceUpdate } : i)),
                }));
            },

            deleteInvoice: (id) => {
                set((state) => ({
                    invoices: state.invoices.filter((i) => i.id !== id),
                }));
            },

            // ==================== SUSCRIPCIONES ====================
            addSubscription: (subscription) => {
                const subscriptionCount = get().subscriptions.length + 1;
                const newSubscription = {
                    ...subscription,
                    id: `SUB${String(subscriptionCount).padStart(3, "0")}`,
                };
                set((state) => ({
                    subscriptions: [...state.subscriptions, newSubscription],
                }));
            },

            updateSubscription: (id, subscriptionUpdate) => {
                set((state) => ({
                    subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, ...subscriptionUpdate } : s)),
                }));
            },

            deleteSubscription: (id) => {
                set((state) => ({
                    subscriptions: state.subscriptions.filter((s) => s.id !== id),
                }));
            },

            // ==================== PLANTILLAS DE MENSAJES ====================
            addMessageTemplate: (template) => {
                const newTemplate = {
                    ...template,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    messageTemplates: [...state.messageTemplates, newTemplate],
                }));
            },

            updateMessageTemplate: (id, templateUpdate) => {
                set((state) => ({
                    messageTemplates: state.messageTemplates.map((t) =>
                        t.id === id ? { ...t, ...templateUpdate } : t
                    ),
                }));
            },

            deleteMessageTemplate: (id) => {
                set((state) => ({
                    messageTemplates: state.messageTemplates.filter((t) => t.id !== id),
                }));
            },

            // ==================== PERFILES DE CLIENTES ====================
            addClientProfile: (profile) => {
                const newProfile = {
                    ...profile,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    clientProfiles: [...state.clientProfiles, newProfile],
                }));
            },

            updateClientProfile: (id, profileUpdate) => {
                set((state) => ({
                    clientProfiles: state.clientProfiles.map((p) => (p.id === id ? { ...p, ...profileUpdate } : p)),
                }));
            },

            deleteClientProfile: (id) => {
                set((state) => ({
                    clientProfiles: state.clientProfiles.filter((p) => p.id !== id),
                }));
            },

            // ==================== PLANTILLAS DE PANTALLAS ====================
            addScreenTemplate: (template) => {
                const newTemplate = {
                    ...template,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    screenTemplates: [...state.screenTemplates, newTemplate],
                }));
            },

            updateScreenTemplate: (id, templateUpdate) => {
                set((state) => ({
                    screenTemplates: state.screenTemplates.map((t) => (t.id === id ? { ...t, ...templateUpdate } : t)),
                }));
            },

            deleteScreenTemplate: (id) => {
                set((state) => ({
                    screenTemplates: state.screenTemplates.filter((t) => t.id !== id),
                }));
            },

            // ==================== UTILIDADES ====================
            initializeFromLocalStorage: () => {
                // El middleware persist de Zustand ya carga automáticamente
                // los datos desde localStorage con la clave "dashboard-storage"
                // Esta función solo se usa para migrar datos antiguos si existen

                const oldClients = localStorage.getItem("clients");
                if (oldClients) {
                    try {
                        const parsedClients = JSON.parse(oldClients);
                        if (Array.isArray(parsedClients) && parsedClients.length > 0) {
                            const currentClients = get().clients;

                            // Combinar clientes antiguos con los actuales
                            const allClients = [...currentClients];
                            parsedClients.forEach((oldClient) => {
                                // Solo agregar si no existe ya (comparar por email o id)
                                if (!allClients.some((c) => c.email === oldClient.email || c.id === oldClient.id)) {
                                    allClients.push(oldClient);
                                }
                            });

                            if (allClients.length > currentClients.length) {
                                set({ clients: allClients });
                            }
                        }
                    } catch (error) {
                        console.error("❌ Error migrando clientes de localStorage:", error);
                    } finally {
                        // Limpiar el localStorage antiguo después de migrar
                        localStorage.removeItem("clients");
                        localStorage.removeItem("clientsCount");
                    }
                }
            },

            resetStore: () => {
                set({
                    clients: [],
                    transactions: initialTransactions,
                    invoices: initialInvoices,
                    subscriptions: initialSubscriptions,
                    messageTemplates: initialMessageTemplates,
                    clientProfiles: initialClientProfiles,
                    screenTemplates: initialScreenTemplates,
                });
            },

            resetSubscriptions: () => {
                set({
                    subscriptions: initialSubscriptions,
                });
            },

            resetInvoices: () => {
                set({
                    invoices: initialInvoices,
                });
            },
        }),
        {
            name: "dashboard-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
