"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "Un gráfico de área interactivo";

const chartData = [
    {
        date: "2024-04-01",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-02",
        pagoMovil: 2,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-04-03",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-04",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-04-05",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-06",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-07",
        pagoMovil: 2,
        zelle: 0,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-04-08",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-04-09",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-04-10",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 2,
        binance: 0
    },
    {
        date: "2024-04-11",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-04-12",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 2
    },
    {
        date: "2024-04-13",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-04-14",
        pagoMovil: 0,
        zelle: 1,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-15",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-04-16",
        pagoMovil: 2,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-17",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-04-18",
        pagoMovil: 2,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-04-19",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-20",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-04-21",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 2,
        binance: 0
    },
    {
        date: "2024-04-22",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-04-23",
        pagoMovil: 2,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-24",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-04-25",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-04-26",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-27",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-04-28",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-04-29",
        pagoMovil: 2,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-04-30",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-05-01",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-05-02",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-03",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-05-04",
        pagoMovil: 2,
        zelle: 0,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-05-05",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-05-06",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-07",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-05-08",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 2,
        binance: 0
    },
    {
        date: "2024-05-09",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-10",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-11",
        pagoMovil: 2,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-05-12",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-05-13",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-05-14",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-15",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-05-16",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-17",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 2
    },
    {
        date: "2024-05-18",
        pagoMovil: 2,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-05-19",
        pagoMovil: 0,
        zelle: 1,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-05-20",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-05-21",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 2,
        binance: 0
    },
    {
        date: "2024-05-22",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-23",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-05-24",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-25",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-05-26",
        pagoMovil: 2,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-05-27",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-05-28",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-05-29",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-05-30",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-05-31",
        pagoMovil: 2,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-06-01",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-06-02",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-06-03",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-06-04",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-06-05",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 2,
        binance: 0
    },
    {
        date: "2024-06-06",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 2
    },
    {
        date: "2024-06-07",
        pagoMovil: 2,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-06-08",
        pagoMovil: 0,
        zelle: 1,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-06-09",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-06-10",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 2,
        binance: 0
    },
    {
        date: "2024-06-11",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-06-12",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-06-13",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-06-14",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-06-15",
        pagoMovil: 2,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-06-16",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-06-17",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-06-18",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-06-19",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-06-20",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 2,
        binance: 0
    },
    {
        date: "2024-06-21",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 2
    },
    {
        date: "2024-06-22",
        pagoMovil: 2,
        zelle: 2,
        transferencia: 1,
        binance: 0
    },
    {
        date: "2024-06-23",
        pagoMovil: 0,
        zelle: 1,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-06-24",
        pagoMovil: 1,
        zelle: 1,
        transferencia: 1,
        binance: 2
    },
    {
        date: "2024-06-25",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 2,
        binance: 0
    },
    {
        date: "2024-06-26",
        pagoMovil: 1,
        zelle: 2,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-06-27",
        pagoMovil: 0,
        zelle: 2,
        transferencia: 2,
        binance: 1
    },
    {
        date: "2024-06-28",
        pagoMovil: 2,
        zelle: 1,
        transferencia: 1,
        binance: 1
    },
    {
        date: "2024-06-29",
        pagoMovil: 1,
        zelle: 0,
        transferencia: 2,
        binance: 1
    },
    { date: "2024-06-30", pagoMovil: 2, zelle: 2, transferencia: 1, binance: 0 }
];

const chartConfig = {
    pagoMovil: {
        label: "Pago Móvil",
        color: "#00A9D4"
    },
    zelle: {
        label: "Zelle",
        color: "#a855f7"
    },
    transferencia: {
        label: "Transferencia",
        color: "oklch(0.867 0.2902 142.9971)"
    },
    binance: {
        label: "Binance",
        color: "#eab308"
    }
} satisfies ChartConfig;

export function ChartAreaInteractive() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState("90d");

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d");
        }
    }, [isMobile]);

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date("2024-06-30");
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Total Visitantes</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Total para los últimos 3 meses
                    </span>
                    <span className="@[540px]/card:hidden">
                        Últimos 3 meses
                    </span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">
                            Últimos 3 meses
                        </ToggleGroupItem>
                        <ToggleGroupItem value="30d">
                            Últimos 30 días
                        </ToggleGroupItem>
                        <ToggleGroupItem value="7d">
                            Últimos 7 días
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Últimos 3 meses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Últimos 3 meses
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Últimos 30 días
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Últimos 7 días
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient
                                id="fillPagoMovil"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#00A9D4"
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#00A9D4"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillZelle"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#a855f7"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#a855f7"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillTransferencia"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#05E925"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#05E925"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillBinance"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#eab308"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#eab308"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric"
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric"
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="pagoMovil"
                            type="natural"
                            fill="url(#fillPagoMovil)"
                            stroke="#3b82f6"
                            stackId="a"
                        />
                        <Area
                            dataKey="zelle"
                            type="natural"
                            fill="url(#fillZelle)"
                            stroke="#a855f7"
                            stackId="a"
                        />
                        <Area
                            dataKey="transferencia"
                            type="natural"
                            fill="url(#fillTransferencia)"
                            stroke="#22c55e"
                            stackId="a"
                        />
                        <Area
                            dataKey="binance"
                            type="natural"
                            fill="url(#fillBinance)"
                            stroke="#eab308"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
