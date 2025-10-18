import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import currencyConfig from "@/config/currency.json";

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Configuración de monedas
export const CURRENCY_CONFIG = {
    USD_TO_BS: currencyConfig.exchangeRates.USD_TO_BS
};

// Funciones de conversión de monedas
export function convertToBS(usdAmount: number): number {
    return usdAmount * CURRENCY_CONFIG.USD_TO_BS;
}

export function convertToUSD(bsAmount: number): number {
    return bsAmount / CURRENCY_CONFIG.USD_TO_BS;
}

export function formatCurrency(amount: number, currency: "USD" | "BS"): string {
    if (currency === "USD") {
        return `$${amount.toFixed(2)}`;
    } else {
        return `Bs. ${amount.toFixed(2)}`;
    }
}
