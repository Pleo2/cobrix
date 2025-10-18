"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from "react";

type Currency = "USD" | "BS";

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    toggleCurrency: () => void;
    mounted: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
    undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>("USD");
    const [mounted, setMounted] = useState(false);

    // Cargar la moneda guardada al montar el componente
    useEffect(() => {
        const savedCurrency = localStorage.getItem(
            "cobrix-currency"
        ) as Currency | null;
        if (
            savedCurrency &&
            (savedCurrency === "USD" || savedCurrency === "BS")
        ) {
            setCurrencyState(savedCurrency);
        }
        setMounted(true);
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem("cobrix-currency", newCurrency);
    };

    const toggleCurrency = () => {
        const newCurrency = currency === "USD" ? "BS" : "USD";
        setCurrency(newCurrency);
    };

    return (
        <CurrencyContext.Provider
            value={{ currency, setCurrency, toggleCurrency, mounted }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency debe usarse dentro de CurrencyProvider");
    }
    return context;
}
