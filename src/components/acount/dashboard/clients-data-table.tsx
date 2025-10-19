"use client";

import * as React from "react";
import { toast } from "sonner";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns,
    IconEdit,
    IconTrash,
    IconEye,
    IconMail,
} from "@tabler/icons-react";
import { AlertTriangle } from "lucide-react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const clientSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    cedula: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
});

export type Client = z.infer<typeof clientSchema>;

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({
        id,
    });

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent"
        >
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Arrastra para reordenar</span>
        </Button>
    );
}

export const createColumns = (
    onEdit: (client: Client) => void,
    onDelete: (clientId: number, clientName: string) => void,
    onViewDetails: (client: Client) => void
): ColumnDef<Client>[] => [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleccionar todo"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Seleccionar fila"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "firstName",
        header: "Nombre",
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">
                    {row.original.firstName} {row.original.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{row.original.cedula}</p>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Correo",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">{row.original.email}</span>
        ),
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">{row.original.phone}</span>
        ),
    },
    {
        accessorKey: "address",
        header: "Dirección",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">{row.original.address}</span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const client = row.original;
            const clientName = `${client.firstName} ${client.lastName}`;

            const handleCopyEmail = () => {
                navigator.clipboard.writeText(client.email);
                toast.success("Email copiado", {
                    description: `El email de ${clientName} ha sido copiado al portapapeles`,
                });
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Abrir menú</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onClick={() => onViewDetails(client)}
                            className="flex items-center gap-2"
                        >
                            <IconEye className="h-4 w-4" />
                            Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onEdit(client)}
                            className="flex items-center gap-2"
                        >
                            <IconEdit className="h-4 w-4" />
                            Editar cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleCopyEmail}
                            className="flex items-center gap-2"
                        >
                            <IconMail className="h-4 w-4" />
                            Copiar email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(client.id, clientName)}
                            className="text-red-600 flex items-center gap-2"
                        >
                            <IconTrash className="h-4 w-4" />
                            Eliminar cliente
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof clientSchema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}

interface ClientsDataTableProps {
    data: Client[];
    onUpdateClient: (id: number, updates: Partial<Client>) => void;
    onDeleteClient: (id: number) => void;
}

export function ClientsDataTable({
    data: initialData,
    onUpdateClient,
    onDeleteClient,
}: ClientsDataTableProps) {
    const [data, setData] = React.useState(() => initialData);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Sincronizar con los datos del store
    React.useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Estados para modales de edición
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editingClient, setEditingClient] = React.useState<Client | null>(null);
    const [editForm, setEditForm] = React.useState({
        firstName: "",
        lastName: "",
        cedula: "",
        email: "",
        phone: "",
        address: "",
    });

    // Estados para modal de eliminación
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [clientToDelete, setClientToDelete] = React.useState<{
        id: number;
        name: string;
    } | null>(null);

    // Estados para modal de detalles
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
    const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);

    const sortableId = React.useId();
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ id }) => id) || [],
        [data]
    );

    // Callbacks para las acciones
    const handleEdit = React.useCallback((client: Client) => {
        setEditingClient(client);
        setEditForm({
            firstName: client.firstName,
            lastName: client.lastName,
            cedula: client.cedula,
            email: client.email,
            phone: client.phone,
            address: client.address,
        });
        setIsEditOpen(true);
    }, []);

    const handleOpenDeleteDialog = React.useCallback((clientId: number, clientName: string) => {
        setClientToDelete({ id: clientId, name: clientName });
        setIsDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = () => {
        if (clientToDelete) {
            onDeleteClient(clientToDelete.id);
            toast.error("Cliente eliminado", {
                description: `${clientToDelete.name} ha sido eliminado del sistema`,
            });
            setIsDeleteDialogOpen(false);
            setClientToDelete(null);
        }
    };

    const handleViewDetails = React.useCallback((client: Client) => {
        setSelectedClient(client);
        setIsDetailsOpen(true);
    }, []);

    const handleSaveEdit = () => {
        if (!editingClient) return;

        // Validaciones básicas
        if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
            toast.error("Error de validación", {
                description: "El nombre y apellido son obligatorios",
            });
            return;
        }

        if (!editForm.email.trim() || !editForm.email.includes("@")) {
            toast.error("Error de validación", {
                description: "El email es inválido",
            });
            return;
        }

        onUpdateClient(editingClient.id, {
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            cedula: editForm.cedula,
            email: editForm.email,
            phone: editForm.phone,
            address: editForm.address,
        });

        toast.success("Cliente actualizado", {
            description: `Los datos de ${editForm.firstName} ${editForm.lastName} han sido actualizados`,
        });

        setIsEditOpen(false);
        setEditingClient(null);
    };

    const columns = React.useMemo(
        () => createColumns(handleEdit, handleOpenDeleteDialog, handleViewDetails),
        [handleEdit, handleOpenDeleteDialog, handleViewDetails]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Personalizar Columnas</span>
                                <span className="lg:hidden">Columnas</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="relative flex flex-col gap-4 overflow-auto rounded-lg border">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="**:data-[slot=table-cell]:first:w-8">
                            {table.getRowModel().rows?.length ? (
                                <SortableContext
                                    items={dataIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {table.getRowModel().rows.map((row) => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))}
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No hay clientes registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Filas por página
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir a la primera página</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir a la página anterior</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir a la siguiente página</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir a la última página</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal de Detalles del Cliente */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Detalles del Cliente</DialogTitle>
                        <DialogDescription>
                            Información completa del cliente seleccionado
                        </DialogDescription>
                    </DialogHeader>
                    {selectedClient && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-semibold">Nombre:</Label>
                                <div className="col-span-3">
                                    {selectedClient.firstName} {selectedClient.lastName}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-semibold">Cédula:</Label>
                                <div className="col-span-3">{selectedClient.cedula}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-semibold">Email:</Label>
                                <div className="col-span-3">{selectedClient.email}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-semibold">Teléfono:</Label>
                                <div className="col-span-3">{selectedClient.phone}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-semibold">Dirección:</Label>
                                <div className="col-span-3">{selectedClient.address}</div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsDetailsOpen(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Confirmación de Eliminación */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            ¿Estás seguro de eliminar el cliente{" "}
                            <span className="font-semibold text-foreground">
                                {clientToDelete?.name}
                            </span>
                            ?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                <strong>Advertencia:</strong> Esta acción no se puede deshacer. Se
                                eliminará permanentemente el cliente y toda su información asociada.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setClientToDelete(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Sí, eliminar cliente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Edición */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                        <DialogDescription>
                            Modifica los datos del cliente{" "}
                            {editingClient &&
                                `${editingClient.firstName} ${editingClient.lastName}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-firstName">
                                    Nombre <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-firstName"
                                    value={editForm.firstName}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, firstName: e.target.value })
                                    }
                                    placeholder="Nombre del cliente"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-lastName">
                                    Apellido <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-lastName"
                                    value={editForm.lastName}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, lastName: e.target.value })
                                    }
                                    placeholder="Apellido del cliente"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-cedula">Cédula</Label>
                            <Input
                                id="edit-cedula"
                                value={editForm.cedula}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, cedula: e.target.value })
                                }
                                placeholder="V-12345678"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, email: e.target.value })
                                }
                                placeholder="cliente@ejemplo.com"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-phone">Teléfono</Label>
                            <Input
                                id="edit-phone"
                                value={editForm.phone}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, phone: e.target.value })
                                }
                                placeholder="+58 414-1234567"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-address">Dirección</Label>
                            <Textarea
                                id="edit-address"
                                value={editForm.address}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, address: e.target.value })
                                }
                                placeholder="Dirección completa del cliente"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditOpen(false);
                                setEditingClient(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveEdit}>Guardar cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
