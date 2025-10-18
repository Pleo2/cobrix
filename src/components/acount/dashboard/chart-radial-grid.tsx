"use client";

import { TrendingUp } from "lucide-react";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A radial chart with payment methods";

// Datos de métodos de pago de hoy (basado en chart-area-interactive)
const chartData = [
    { method: "pagoMovil", transactions: 4, fill: "var(--color-pagoMovil)" },
    { method: "zelle", transactions: 3, fill: "var(--color-zelle)" },
    { method: "transferencia", transactions: 2, fill: "var(--color-transferencia)" },
    { method: "binance", transactions: 1, fill: "var(--color-binance)" },
];

// Colores consistentes con chart-area-interactive
const chartConfig = {
    transactions: {
        label: "Transacciones",
    },
    pagoMovil: {
        label: "Pago Móvil",
        color: "rgba(0, 169, 212, 0.6)",
    },
    zelle: {
        label: "Zelle",
        color: "rgba(168, 85, 247, 0.6)",
    },
    transferencia: {
        label: "Transferencia",
        color: "rgba(5, 233, 37, 0.6)",
    },
    binance: {
        label: "Binance",
        color: "rgba(234, 179, 8, 0.6)",
    },
} satisfies ChartConfig;

export function ChartRadialGrid() {
    return (
        <Card className="flex flex-col border-0 bg-transparent shadow-none">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <RadialBarChart data={chartData} innerRadius={40} outerRadius={120}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel nameKey="method" />}
                        />
                        <PolarGrid gridType="circle" />
                        <RadialBar dataKey="transactions" />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Total hoy: 10 transacciones <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Distribución de pagos por método
                </div>
            </CardFooter>
        </Card>
    );
}
