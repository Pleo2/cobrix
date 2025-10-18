"use client";

import * as React from "react";
import {
    IconDotsVertical,
    IconPlus,
    IconSearch,
    IconLayoutColumns,
    IconChevronDown,
    IconCircleCheckFilled,
    IconLoader,
    IconX,
} from "@tabler/icons-react";
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
    VisibilityState
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { DataTablePagination } from "./data-table-pagination";

// 1. Definir el schema de datos con Zod
export const subscriptionSchema = z.object({
    id: z.string(),
    clientName: z.string(),
    email: z.string().email(),
    plan: z.string(),
    status: z.enum(["Activo", "En Apelación", "Cancelado"]),
    nextPaymentDate: z.string().nullable(),
});

type Subscription = z.infer<typeof subscriptionSchema>;

// 2. Definir las columnas de la tabla
export const columns: ColumnDef<Subscription>[] = [
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
                <Badge variant="outline" className="text-muted-foreground px-1.5 items-center gap-1">
                    {status === "Activo" ? (
                        // Estilo exacto del dashboard: Icono con fill verde
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                    ) : status === "En Apelación" ? (
                        // Icono por defecto (gris) para apelación
                        <IconLoader className="animate-spin" />
                    ) : (
                        // Icono por defecto (gris) para cancelado
                        <IconX />
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
            return date ? <span>{date as string}</span> : <span className="text-muted-foreground">N/A</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <IconDotsVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Cliente</DropdownMenuItem>
                        <DropdownMenuItem>Editar Suscripción</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Cancelar Suscripción</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];

// 3. El componente principal de la tabla
export function SubscriptionsTable({ data }: { data: Subscription[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

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
                            value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
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
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id === 'clientName' ? 'Cliente' :
                                        column.id === 'nextPaymentDate' ? 'Próximo Cobro' :
                                        column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" className="h-9">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Añadir Suscriptor
                    </Button>
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
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            <DataTablePagination table={table} />
        </div>
    );
}
