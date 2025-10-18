# Sistema de Conversión de Monedas

Este documento describe cómo está configurado el sistema de conversión entre Dólares (USD) y Bolívares (BS) en la aplicación.

## Arquitectura

El sistema utiliza **React Context API** para compartir el estado de la moneda globalmente. Todos los componentes que necesiten acceso a la moneda actual pueden usar el hook `useCurrency()` sin importar dónde se encuentren en el árbol de componentes.

```
RootLayout
  └── CurrencyProvider (contexto global)
      └── ThemeProvider
          └── Resto de la aplicación
              ├── CurrencyToggle (cambia la moneda)
              ├── SectionCards (usa la moneda)
              └── ... otros componentes
```

## Configuración

La tasa de cambio se encuentra en `/src/config/currency.json`:

```json
{
    "exchangeRates": {
        "USD_TO_BS": 205.67,
        "description": "Tasa de cambio 1 USD = 205.67 Bs"
    },
    "currencies": {
        "USD": {
            "symbol": "$",
            "name": "Dólares Estadounidenses",
            "code": "USD"
        },
        "BS": {
            "symbol": "Bs.",
            "name": "Bolívares",
            "code": "BS"
        }
    }
}
```

### Cambiar la tasa de cambio

Para actualizar la tasa de cambio, simplemente modifica el valor en `src/config/currency.json`:

```json
"USD_TO_BS": 205.67  // Cambia este valor
```

## Instalación

El `CurrencyProvider` ya está configurado en `/src/app/layout.tsx`:

```tsx
<ThemeProvider>
    <CurrencyProvider>{children}</CurrencyProvider>
</ThemeProvider>
```

No necesitas hacer nada adicional para que funcione.

## Uso

### Hook personalizado `useCurrency`

Todos los componentes pueden acceder al estado global de la moneda usando el hook `useCurrency()`:

```tsx
import { useCurrency } from "@/hooks/use-currency";

export function MyComponent() {
    const { currency, setCurrency, toggleCurrency, mounted } = useCurrency();

    if (!mounted) return null;

    return (
        <div>
            <p>Moneda actual: {currency}</p>
            <button onClick={() => setCurrency("USD")}>USD</button>
            <button onClick={() => setCurrency("BS")}>BS</button>
            <button onClick={toggleCurrency}>Cambiar moneda</button>
        </div>
    );
}
```

**Parámetros devueltos:**

-   `currency`: "USD" | "BS" - La moneda actualmente seleccionada
-   `setCurrency`: (currency: "USD" | "BS") => void - Cambiar la moneda
-   `toggleCurrency`: () => void - Alternar entre USD y BS
-   `mounted`: boolean - Indica si el componente se ha montado (importante para SSR)

### Re-renderizado automático

Cuando cambias la moneda en un componente (ej: CurrencyToggle), **TODOS los componentes que usan `useCurrency()` se re-renderizan automáticamente** con la nueva moneda.

```tsx
// En CurrencyToggle
onClick={() => setCurrency("BS")}  // Cambia la moneda

// En SectionCards y cualquier otro componente
const { currency } = useCurrency();  // Se actualiza automáticamente
// El componente se re-renderiza con la nueva moneda
```

### Funciones de utilidad

En `src/lib/utils.ts` están disponibles las siguientes funciones:

#### `convertToBS(usdAmount: number): number`

Convierte una cantidad en dólares a bolívares:

```tsx
import { convertToBS } from "@/lib/utils";

const usdAmount = 100;
const bsAmount = convertToBS(usdAmount); // 20567
```

#### `convertToUSD(bsAmount: number): number`

Convierte una cantidad en bolívares a dólares:

```tsx
import { convertToUSD } from "@/lib/utils";

const bsAmount = 20567;
const usdAmount = convertToUSD(bsAmount); // 100
```

#### `formatCurrency(amount: number, currency: "USD" | "BS"): string`

Formatea una cantidad con el símbolo de moneda apropiado:

```tsx
import { formatCurrency } from "@/lib/utils";

const formatted1 = formatCurrency(1250.0, "USD"); // "$1250.00"
const formatted2 = formatCurrency(256838.75, "BS"); // "Bs. 256838.75"
```

## Componente Toggle

El toggle de moneda está disponible en `src/components/currency-toggle.tsx`:

```tsx
import { CurrencyToggle } from "@/components/currency-toggle";

export function Header() {
    return (
        <header>
            <CurrencyToggle />
        </header>
    );
}
```

Este componente:

-   Muestra un ícono de dólar o billete según la moneda seleccionada
-   Permite cambiar entre USD y BS
-   Guarda la preferencia en localStorage bajo la clave `cobrix-currency`

## Ejemplo completo

```tsx
"use client";

import { useCurrency } from "@/hooks/use-currency";
import { convertToBS, formatCurrency } from "@/lib/utils";

export function PriceCard() {
    const { currency, mounted } = useCurrency();

    if (!mounted) return null;

    const priceUSD = 100;
    const price = currency === "BS" ? convertToBS(priceUSD) : priceUSD;
    const formatted = formatCurrency(price, currency);

    return (
        <div>
            <p>Precio: {formatted}</p>
        </div>
    );
}
```

Cuando el usuario cambio el toggle de moneda, `currency` se actualiza automáticamente y el componente se re-renderiza con el nuevo valor.

## Almacenamiento

La preferencia de moneda se guarda en localStorage bajo la clave `cobrix-currency` y persiste entre sesiones del usuario.

## Archivos del sistema

-   **`src/components/currency-provider.tsx`** - Provider del contexto global
-   **`src/hooks/use-currency.ts`** - Hook que re-exporta desde el provider
-   **`src/components/currency-toggle.tsx`** - Componente toggle de moneda
-   **`src/config/currency.json`** - Configuración de tasas de cambio
-   **`src/lib/utils.ts`** - Funciones de utilidad para conversión

## Notas importantes

1. **Contexto Global**: Todos los componentes en la aplicación comparten el mismo estado de moneda gracias al Context Provider.

2. **Re-renderizado automático**: Cuando se cambia la moneda, todos los componentes que usan `useCurrency()` se re-renderizan automáticamente sin necesidad de pasar props.

3. **Hidratación (SSR)**: El hook `useCurrency` verifica el estado `mounted` para evitar mismatch entre servidor y cliente en aplicaciones Next.js.

4. **Persistencia**: La moneda seleccionada se guarda automáticamente en localStorage y se recupera al recargar la página.

5. **Valores por defecto**: Si no hay una preferencia guardada, la aplicación usa USD como moneda por defecto.

6. **Error handling**: Si intentas usar `useCurrency()` fuera de `CurrencyProvider`, obtendrás un error claro indicando dónde está el problema.
