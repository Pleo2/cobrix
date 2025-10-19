"use client";

import * as React from "react";
import { motion } from 'motion/react';
import { generateRandomTransaction } from "@/data/mock-clients";
import { TransactionDetailView } from "./transaction-detail-view";
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconLayoutColumns,
    IconLoader,
    IconX,
    IconAlertCircle,
    IconClock,
} from "@tabler/icons-react";
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
    VisibilityState
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
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const schema = z.object({
    id: z.number(),
    referencia: z.string(),
    cliente: z.string(),
    concepto: z.string(),
    monto: z.number(),
    metodoPago: z.string(),
    estado: z.string(),
    fecha: z.string(),
    estadoFinal: z.string().optional(),
    motivoRechazo: z.string().optional()
});

// Componente para el estado con animación
function StatusCell({ row }: { row: Row<z.infer<typeof schema>> }) {
    const [currentStatus, setCurrentStatus] = React.useState(row.original.estado);
    const [isLoading, setIsLoading] = React.useState(row.original.estado === "Procesando");

    React.useEffect(() => {
        if (row.original.estado === "Procesando" && row.original.estadoFinal) {
            const delay = Math.random() * 2000 + 1000;
            const timer = setTimeout(() => {
                setCurrentStatus(row.original.estadoFinal!);
                setIsLoading(false);
            }, delay);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [row.original.estado, row.original.estadoFinal]);

    const getStatusConfig = () => {
        if (isLoading) {
            return {
                color: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
                icon: <IconLoader className="mr-1 size-3 animate-spin" />,
                label: "Procesando"
            };
        }
        switch (currentStatus) {
            case "Exitosa":
            case "Completado":
                return {
                    color: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
                    icon: <IconCircleCheckFilled className="mr-1 size-3" />,
                    label: "Exitosa"
                };
            case "Rechazada":
                return {
                    color: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
                    icon: <IconX className="mr-1 size-3" />,
                    label: "Rechazada"
                };
            case "Conciliación Manual":
                return {
                    color: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
                    icon: <IconClock className="mr-1 size-3" />,
                    label: "Conciliación Manual"
                };
            default:
                return {
                    color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                    icon: <IconAlertCircle className="mr-1 size-3" />,
                    label: currentStatus
                };
        }
    };

    const config = getStatusConfig();

    return (
        <Badge
            variant="outline"
            className={`px-2 cursor-pointer hover:opacity-80 transition-opacity ${config.color}`}
        >
            {config.icon}
            {config.label}
        </Badge>
    );
}

const createColumns = (): ColumnDef<z.infer<typeof schema>>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
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
        enableHiding: false
    },
    {
        accessorKey: "referencia",
        header: "Referencia",
        cell: ({ row }) => (
            <div className="font-medium text-foreground font-mono text-xs group-hover:text-primary transition-colors">
                {row.original.referencia}
            </div>
        ),
        enableHiding: false
    },
    {
        accessorKey: "cliente",
        header: "Cliente",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.cliente}</span>
                <span className="text-muted-foreground text-sm">
                    {row.original.concepto}
                </span>
            </div>
        )
    },
    {
        accessorKey: "monto",
        header: () => <div className="text-right">Monto</div>,
        cell: ({ row }) => {
            const formatted = new Intl.NumberFormat("es-VE", {
                style: "currency",
                currency: "USD"
            }).format(row.original.monto);
            return <div className="text-right font-medium">{formatted}</div>;
        }
    },
    {
        accessorKey: "metodoPago",
        header: "Método",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground px-2">
                {row.original.metodoPago}
            </Badge>
        )
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => <StatusCell row={row} />
    },
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => (
            <div className="text-muted-foreground text-sm">
                {row.original.fecha}
            </div>
        )
    },
    {
        id: "actions",
        cell: () => (
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
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Descargar comprobante</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Contactar cliente</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
];

function TransactionRow({ 
    row, 
    onSelectTransaction 
}: { 
    row: Row<z.infer<typeof schema>>;
    onSelectTransaction: (transaction: z.infer<typeof schema>) => void;
}) {
    return (
        <motion.tr
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            data-state={row.getIsSelected() && "selected"}
            className="border-b transition-all hover:bg-primary/5 hover:shadow-sm data-[state=selected]:bg-muted cursor-pointer group"
            onClick={() => onSelectTransaction(row.original)}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </motion.tr>
    );
}

export function DataTable({
    data: initialData
}: {
    data: z.infer<typeof schema>[];
}) {
    const [data, setData] = React.useState(initialData);
    const [selectedTransaction, setSelectedTransaction] = React.useState<z.infer<typeof schema> | null>(null);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10
    });

    // Agregar transacciones en tiempo real cada 15-30 segundos
    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        const scheduleNextTransaction = () => {
            const delay = Math.random() * 15000 + 15000; // 15-30 segundos
            timeoutId = setTimeout(() => {
                setData(prevData => {
                    const maxId = Math.max(...prevData.map(t => t.id), 0);
                    const newTransaction = generateRandomTransaction(maxId + 1) as z.infer<typeof schema>;
                    return [newTransaction, ...prevData];
                });
                scheduleNextTransaction();
            }, delay);
        };

        scheduleNextTransaction();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    const columns = React.useMemo(
        () => createColumns(),
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination
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
        getFacetedUniqueValues: getFacetedUniqueValues()
    });

    // Si hay una transacción seleccionada, mostrar la vista de detalles
    if (selectedTransaction) {
        return (
            <TransactionDetailView
                transaction={selectedTransaction}
                onBack={() => setSelectedTransaction(null)}
            />
        );
    }

    return (
        <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    Vista
                </Label>
                <Select defaultValue="outline">
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Seleccionar una vista" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="outline">Esquema</SelectItem>
                        <SelectItem value="past-performance">
                            Movimientos{" "}
                            <Badge variant="secondary">3</Badge>
                        </SelectItem>
                        <SelectItem value="key-personnel">
                            Personal Clave <Badge variant="secondary">2</Badge>
                        </SelectItem>
                        <SelectItem value="focus-documents">
                            Documentos de Enfoque
                        </SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="outline">Transacciones</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">
                                    Personalizar Columnas
                                </span>
                                <span className="lg:hidden">Columnas</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !==
                                        "undefined" && column.getCanHide()
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
            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column
                                                            .columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TransactionRow 
                                        key={row.id} 
                                        row={row} 
                                        onSelectTransaction={setSelectedTransaction}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No hay transacciones.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length} fila(s)
                        seleccionada(s).
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label
                                htmlFor="rows-per-page"
                                className="text-sm font-medium"
                            >
                                Filas por página
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="w-20"
                                    id="rows-per-page"
                                >
                                    <SelectValue
                                        placeholder={
                                            table.getState().pagination.pageSize
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem
                                            key={pageSize}
                                            value={`${pageSize}`}
                                        >
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Página {table.getState().pagination.pageIndex + 1}{" "}
                            de {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Ir a la primera página
                                </span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Ir a la página anterior
                                </span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">
                                    Ir a la siguiente página
                                </span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() =>
                                    table.setPageIndex(table.getPageCount() - 1)
                                }
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">
                                    Ir a la última página
                                </span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
