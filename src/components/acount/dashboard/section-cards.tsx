"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import { convertToBS, formatCurrency } from "@/lib/utils";

export function SectionCards() {
    const { currency, mounted } = useCurrency();

    if (!mounted) {
        return <div />;
    }

    // Valores en USD
    const totalRevenueUSD = 1250.0;
    const growthRateValue = 4.5;

    // Convertir a moneda seleccionada
    const totalRevenue =
        currency === "BS" ? convertToBS(totalRevenueUSD) : totalRevenueUSD;
    const totalRevenueFormatted = formatCurrency(totalRevenue, currency);

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Ingresos Totales</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
                        {totalRevenueFormatted}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            +12.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Tendencia al alza este mes{" "}
                        <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Visitantes de los últimos 6 meses
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Nuevos Clientes</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
                        25
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            +25%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Bajó 20% este período{" "}
                        <IconTrendingDown className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        La adquisición necesita atención
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Cuentas Activas</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
                        278
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            +12.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Fuerte retención de usuarios{" "}
                        <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        El compromiso supera los objetivos
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Tasa de Crecimiento</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
                        {growthRateValue}%
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />+{growthRateValue}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Aumento de rendimiento constante{" "}
                        <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Cumple con las proyecciones de crecimiento
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
