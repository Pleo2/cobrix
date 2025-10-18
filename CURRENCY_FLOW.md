# Flujo de Re-renderizado de Moneda

## ¿Cómo funciona el sistema?

### 1. El Usuario Hace Click en el Toggle

```
┌─────────────────────┐
│  CurrencyToggle     │
│                     │
│ [$ USD] vs [Bs BS] │
│   (usuario hace     │
│    click aquí)      │
└──────────┬──────────┘
           │
           ▼
```

### 2. Se Ejecuta `setCurrency()`

```
┌────────────────────────────────────┐
│  CurrencyToggle                    │
│                                    │
│  onClick={() =>                   │
│    setCurrency("BS")  ◄────────┐  │
│  }                             │  │
└────────────────────────────────┴──┘
                                   │
                      ┌────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  CurrencyProvider        │
        │  (contexto global)       │
        │                          │
        │  setCurrency("BS")       │
        │  ▼                       │
        │  setCurrencyState("BS")  │
        │  localStorage..., ("BS") │
        └──────────────────────────┘
                      │
                      │
        ┌─────────────┴─────────────┐
        │ Context value actualizada │
        │ { currency: "BS" }        │
        └─────────────┬─────────────┘
                      │
```

### 3. TODOS los Componentes se Re-renderizan

```
        Re-renderizado en cascada:

        ├─ CurrencyToggle
        │  └─ Icono cambia a Billete 🏦
        │
        ├─ SectionCards  ◄─── Aquí ocurre la magia
        │  ├─ Card 1: "Ingresos Totales"
        │  │  ├─ $1,250.00 ──────► Bs. 256,838.75
        │  │  └─ Se re-renderiza
        │  │
        │  ├─ Card 2: "Nuevos Clientes"
        │  │  └─ (sin cambio, sin dinero)
        │  │
        │  ├─ Card 3: "Cuentas Activas"
        │  │  └─ (sin cambio, sin dinero)
        │  │
        │  └─ Card 4: "Tasa de Crecimiento"
        │     └─ (porcentaje, no cambia)
        │
        └─ Otros componentes que usan useCurrency()
```

## Código Detrás del Flujo

### 1. El Provider (Contexto Global)

```tsx
// src/components/currency-provider.tsx

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }) {
    const [currency, setCurrencyState] = useState<Currency>("USD");

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);  // ◄─── Aquí React sabe que cambió
        localStorage.setItem("cobrix-currency", newCurrency);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, ... }}>
            {children}  {/* ◄─── Todos reciben el update */}
        </CurrencyContext.Provider>
    );
}
```

### 2. El Hook (Acceso al Contexto)

```tsx
// src/hooks/use-currency.ts

export function useCurrency() {
    const context = useContext(CurrencyContext);
    return context; // ◄─── Retorna el valor actual del contexto
}
```

### 3. Un Componente que Usa el Hook

```tsx
// src/components/acount/dashboard/section-cards.tsx

export function SectionCards() {
    const { currency, mounted } = useCurrency(); // ◄─── Suscrito al contexto

    if (!mounted) return <div />;

    // Valores en USD
    const totalRevenueUSD = 1250.0;

    // Convertir según la moneda actual
    const totalRevenue =
        currency === "BS"
            ? convertToBS(totalRevenueUSD) // 1250 * 205.67 = 256,838.75
            : totalRevenueUSD; // 1250

    const formatted = formatCurrency(totalRevenue, currency);
    // Resultado: "Bs. 256,838.75" o "$1,250.00"

    return (
        <div>
            {/* Cuando currency cambia, esto se recalcula y re-renderiza */}
            <h3>{formatted}</h3>
        </div>
    );
}
```

## Flujo Temporal Completo

```
TIEMPO 1: Página carga
┌─────────────────────┐
│ CurrencyProvider    │
│ currency = "USD"    │
│ localStorage: null  │
└─────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
SectionCards  CurrencyToggle
"$1,250.00"   [$ USD]


TIEMPO 2: Usuario hace click en toggle y selecciona "BS"
┌─────────────────────┐
│ CurrencyProvider    │
│ currency = "BS"     │ ◄─── CAMBIÓ
│ localStorage: "BS"  │
└─────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
SectionCards  CurrencyToggle
"Bs. 256,838.75"  [Bs BS]
    ↑                ↑
    └────────────────┘
    Ambos se re-renderizaron
    automáticamente!
```

## Ventajas de este Sistema

✅ **Re-renderizado automático**: No necesitas pasar props manualmente
✅ **Contexto global**: Accesible desde cualquier componente
✅ **Persistencia**: Se guarda en localStorage
✅ **Performance**: Solo los componentes que usan el hook se re-renderizan
✅ **Escalable**: Fácil agregar más monedas o lógica
✅ **Sin prop drilling**: No necesitas pasar `currency` através de múltiples niveles

## Ejemplo: Agregar un Nuevo Componente

Si quieres que otro componente también use la moneda:

```tsx
// src/components/my-component.tsx

"use client";

import { useCurrency } from "@/hooks/use-currency";
import { convertToBS, formatCurrency } from "@/lib/utils";

export function MyComponent() {
    const { currency, mounted } = useCurrency();

    if (!mounted) return null;

    const priceUSD = 500;
    const price = currency === "BS" ? convertToBS(priceUSD) : priceUSD;
    const formatted = formatCurrency(price, currency);

    return <div>Precio: {formatted}</div>;
}
```

Cuando se cambia el toggle:

-   `currency` se actualiza en el Provider
-   Este componente detecta el cambio automáticamente
-   Se re-renderiza con el nuevo valor
-   ¡Sin necesidad de hacer nada adicional!

## Depuración

Si necesitas ver qué está pasando, puedes agregar logs:

```tsx
export function SectionCards() {
    const { currency, mounted } = useCurrency();

    console.log("SectionCards re-renderizado con currency:", currency);
    // Verás que se imprime cada vez que cambias el toggle

    // ... resto del código
}
```
