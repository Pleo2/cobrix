"use client";

import * as React from "react";
import { toast } from "sonner";
import {
    IconDotsVertical,
    IconSearch,
    IconLayoutColumns,
    IconChevronDown,
    IconCircleCheckFilled,
    IconLoader,
    IconX,
    IconCopy,
    IconEdit,
} from "@tabler/icons-react";
import { AlertTriangle } from "lucide-react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTablePagination } from "./data-table-pagination";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// 1. Definir el schema de datos con Zod
export const subscriptionSchema = z.object({
    id: z.string(),
    clientName: z.string(),
    email: z.string().email(),
    plan: z.string(),
    planId: z.string().optional(),
    clientId: z.number().optional(),
    status: z.enum(["Activo", "En Apelación", "Cancelado"]),
    nextPaymentDate: z.string().nullable(),
    price: z.number().optional(),
    billingCycle: z.string().optional(),
});

type Subscription = z.infer<typeof subscriptionSchema>;

interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    billingCycle: "Mensual" | "Anual";
}

// 2. Función para crear columnas con callbacks
export const createColumns = (
    onEdit: (subscription: Subscription) => void,
    onCancel: (subscriptionId: string, clientName: string) => void
): ColumnDef<Subscription>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todo"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Seleccionar fila"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "clientName",
        header: "Cliente",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.getValue("clientName")}</span>
                <span className="text-muted-foreground text-sm">{row.original.email}</span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as "Activo" | "En Apelación" | "Cancelado";

            return (
                <Badge
                    variant="outline"
                    className="text-muted-foreground px-1.5 items-center gap-1"
                >
                    {status === "Activo" ? (
                        // Estilo exacto del dashboard: Icono con fill verde
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                    ) : status === "En Apelación" ? (
                        // Icono por defecto (gris) para apelación
                        <IconLoader className="animate-spin" />
                    ) : (
                        // Icono por defecto (gris) para cancelado
                        <IconX className="fill-red-500 dark:fill-red-500" />
                    )}
                    {/* El texto siempre hereda el color gris del Badge */}
                    {status}
                </Badge>
            );
        },
    },

    {
        accessorKey: "plan",
        header: "Plan",
    },
    {
        accessorKey: "nextPaymentDate",
        header: "Próximo Cobro",
        cell: ({ row }) => {
            const date = row.getValue("nextPaymentDate");
            return date ? (
                <span>{date as string}</span>
            ) : (
                <span className="text-muted-foreground">N/A</span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const subscription = row.original;
            const params = new URLSearchParams();
            if (subscription.planId) {
                params.set("planId", subscription.planId);
            }
            if (subscription.clientId) {
                params.set("clientId", subscription.clientId.toString());
            }
            const checkoutUrl = `/checkout?${params.toString()}`;
            const fullCheckoutUrl =
                typeof window !== "undefined"
                    ? `${window.location.origin}${checkoutUrl}`
                    : checkoutUrl;

            const handleCopyLink = () => {
                navigator.clipboard.writeText(fullCheckoutUrl);
                toast.success("Link de renovación copiado al portapapeles", {
                    description: "Puedes compartir este enlace con tu cliente",
                });
            };

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <IconDotsVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={handleCopyLink}
                                className="flex items-center gap-2"
                            >
                                <IconCopy className="h-4 w-4" />
                                Copiar Link de Pago
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onEdit(subscription)}
                                className="flex items-center gap-2"
                            >
                                <IconEdit className="h-4 w-4" />
                                Editar Suscripción
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onCancel(subscription.id, subscription.clientName)}
                                className="text-red-600 flex items-center gap-2"
                            >
                                <IconX className="h-4 w-4" />
                                Cancelar Suscripción
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

// 3. El componente principal de la tabla
interface SubscriptionsTableProps {
    data: Subscription[];
    plans: SubscriptionPlan[];
    onUpdateSubscription: (id: string, updates: Partial<Subscription>) => void;
}

export function SubscriptionsTable({ data, plans, onUpdateSubscription }: SubscriptionsTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Estado del modal de edición
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editingSubscription, setEditingSubscription] = React.useState<Subscription | null>(null);
    const [editForm, setEditForm] = React.useState({
        planId: "",
        status: "Activo" as "Activo" | "En Apelación" | "Cancelado",
        nextPaymentDate: "",
    });

    // Estado del modal de confirmación de cancelación
    const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
    const [subscriptionToCancel, setSubscriptionToCancel] = React.useState<{
        id: string;
        clientName: string;
    } | null>(null);

    // Callbacks para las acciones
    const handleEdit = React.useCallback((subscription: Subscription) => {
        setEditingSubscription(subscription);
        setEditForm({
            planId: subscription.planId || "",
            status: subscription.status,
            nextPaymentDate: subscription.nextPaymentDate || "",
        });
        setIsEditOpen(true);
    }, []);

    const handleOpenCancelDialog = React.useCallback(
        (subscriptionId: string, clientName: string) => {
            setSubscriptionToCancel({ id: subscriptionId, clientName });
            setIsCancelDialogOpen(true);
        },
        []
    );

    const handleConfirmCancel = () => {
        if (subscriptionToCancel) {
            onUpdateSubscription(subscriptionToCancel.id, {
                status: "Cancelado",
                nextPaymentDate: null,
            });
            toast.error("Suscripción cancelada", {
                description: `La suscripción de ${subscriptionToCancel.clientName} ha sido cancelada`,
            });
            setIsCancelDialogOpen(false);
            setSubscriptionToCancel(null);
        }
    };

    const handleSaveEdit = () => {
        if (!editingSubscription) return;

        const selectedPlan = plans.find((p) => p.id === editForm.planId);
        if (!selectedPlan) {
            toast.error("Error al guardar", {
                description: "Por favor selecciona un plan válido",
            });
            return;
        }

        onUpdateSubscription(editingSubscription.id, {
            planId: selectedPlan.id,
            plan: selectedPlan.name,
            price: selectedPlan.price,
            billingCycle: selectedPlan.billingCycle,
            status: editForm.status,
            nextPaymentDate: editForm.nextPaymentDate || null,
        });

        toast.success("Suscripción actualizada", {
            description: `Los cambios en la suscripción de ${editingSubscription.clientName} han sido guardados`,
        });

        setIsEditOpen(false);
        setEditingSubscription(null);
    };

    const columns = React.useMemo(
        () => createColumns(handleEdit, handleOpenCancelDialog),
        [handleEdit, handleOpenCancelDialog]
    );

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const handleFilterChange = (status: string) => {
        if (status === "Todos") {
            table.getColumn("status")?.setFilterValue(undefined);
        } else {
            table.getColumn("status")?.setFilterValue(status);
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Barra de Filtros y Acciones */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Tabs defaultValue="Todos" onValueChange={handleFilterChange}>
                        <TabsList>
                            <TabsTrigger value="Todos">Todos</TabsTrigger>
                            <TabsTrigger value="Activo">Activos</TabsTrigger>
                            <TabsTrigger value="En Apelación">En Apelación</TabsTrigger>
                            <TabsTrigger value="Cancelado">Cancelados</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="relative">
                        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            value={
                                (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table.getColumn("clientName")?.setFilterValue(event.target.value)
                            }
                            className="pl-8 w-64"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <IconLayoutColumns className="mr-2 h-4 w-4" />
                                Columnas
                                <IconChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id === "clientName"
                                            ? "Cliente"
                                            : column.id === "nextPaymentDate"
                                            ? "Próximo Cobro"
                                            : column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* La Tabla */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            <DataTablePagination table={table} />

            {/* Modal de Confirmación de Cancelación */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmar Cancelación
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            ¿Estás seguro de cancelar la suscripción de{" "}
                            <span className="font-semibold text-foreground">
                                {subscriptionToCancel?.clientName}
                            </span>
                            ?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                <strong>Advertencia:</strong> Esta acción cambiará el estado de la
                                suscripción a &ldquo;Cancelado&rdquo; y eliminará la fecha del
                                próximo pago.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCancelDialogOpen(false);
                                setSubscriptionToCancel(null);
                            }}
                        >
                            No, mantener activa
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmCancel}>
                            Sí, cancelar suscripción
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Edición */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Suscripción</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles de la suscripción de{" "}
                            <span className="font-semibold">{editingSubscription?.clientName}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Información del Cliente */}
                        <div className="rounded-lg border p-3 bg-muted/50">
                            <p className="text-sm font-medium mb-2">Información del Cliente</p>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="text-muted-foreground">Cliente:</span>{" "}
                                    {editingSubscription?.clientName}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Email:</span>{" "}
                                    {editingSubscription?.email}
                                </p>
                            </div>
                        </div>

                        {/* Plan */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-plan">Plan</Label>
                            <Select
                                value={editForm.planId}
                                onValueChange={(value) =>
                                    setEditForm((prev) => ({ ...prev, planId: value }))
                                }
                            >
                                <SelectTrigger id="edit-plan">
                                    <SelectValue placeholder="Selecciona un plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                            {plan.name} - ${plan.price}/
                                            {plan.billingCycle === "Mensual" ? "mes" : "año"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Estado</Label>
                            <Select
                                value={editForm.status}
                                onValueChange={(value: "Activo" | "En Apelación" | "Cancelado") =>
                                    setEditForm((prev) => ({ ...prev, status: value }))
                                }
                            >
                                <SelectTrigger id="edit-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Activo">Activo</SelectItem>
                                    <SelectItem value="En Apelación">En Apelación</SelectItem>
                                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Próxima Fecha de Pago */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-next-payment">Próxima Fecha de Pago</Label>
                            <Input
                                id="edit-next-payment"
                                type="date"
                                value={editForm.nextPaymentDate}
                                onChange={(e) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        nextPaymentDate: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
