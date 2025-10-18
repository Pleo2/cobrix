"use client";

import { DollarSign, Banknote } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function CurrencyToggle() {
    const { currency, setCurrency, mounted } = useCurrency();

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled className="h-9 w-9" />
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    {currency === "BS" ? (
                        <Banknote className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                        <DollarSign className="h-[1.2rem] w-[1.2rem]" />
                    )}
                    <span className="sr-only">Cambiar moneda</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrency("USD")}>
                    Dólares (USD)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency("BS")}>
                    Bolívares (BS)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
