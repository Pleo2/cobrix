# Sistema de Tema Oscuro/Claro - Documentación

## Descripción General

Tu aplicación ahora cuenta con un sistema completo de soporte para modo oscuro y modo claro utilizando:

- **next-themes**: Librería de Next.js para manejar temas
- **Tailwind CSS**: Con soporte para selector `dark:`
- **Variables CSS (OKLCH)**: Definidas en `globals.css`

## Componentes Disponibles

### 1. `ThemeToggle` - Menú Dropdown
```tsx
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

**Características:**
- Menú dropdown con 3 opciones: Claro, Oscuro, Sistema
- Icono dinámico (Sol para claro, Luna para oscuro)
- Accesibilidad incluida

### 2. `ThemeToggleSimple` - Toggle Simple
```tsx
import { ThemeToggleSimple } from '@/components/theme-toggle-simple';

export default function Footer() {
  return (
    <div>
      <ThemeToggleSimple />
    </div>
  );
}
```

**Características:**
- Botón simple que alterna entre claro y oscuro
- Más compacto que el dropdown
- Ideal para espacios reducidos

## Uso de Tema en Componentes

### En Componentes Client
```tsx
'use client';

import { useTheme } from 'next-themes';

export function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      Tema actual: {theme}
      <button onClick={() => setTheme('dark')}>
        Cambiar a Oscuro
      </button>
    </div>
  );
}
```

### Con Tailwind CSS
```tsx
// En HTML
<div className="bg-background dark:bg-background">
  {/* El color se adapta automáticamente */}
</div>

// Colores disponibles
- background / foreground
- card / card-foreground
- primary / primary-foreground
- secondary / secondary-foreground
- muted / muted-foreground
- accent / accent-foreground
- destructive / destructive-foreground
- border, input, ring
- sidebar y sus variantes
- chart-1 a chart-5
```

## Estructura Implementada

### 1. Layout Raíz (`src/app/layout.tsx`)
- Envuelve la app con `ThemeProvider`
- Incluye `ThemeScript` en el `<head>` para prevenir flash de tema
- Atributo `suppressHydrationWarning` en `<html>`

### 2. Theme Provider (`src/components/theme-provider.tsx`)
- Proveedor de Next Themes
- Configuración:
  - Atributo: `class` (aplica clase "dark" al HTML)
  - Tema por defecto: `system` (sigue preferencias del SO)
  - Clave de almacenamiento: `cobrix-theme`

### 3. Theme Script (`src/components/theme-script.tsx`)
- Script que se ejecuta antes de renderizar la página
- Previene el "flash" de tema incorrecto
- Lee del localStorage y preferencias del sistema

### 4. Variables CSS (`src/styles/globals.css`)
- Colores definidos en OKLCH (espacio de color moderno)
- Dos conjuntos: uno para `:root` (claro) y otro para `.dark`
- Facilita cambio de tema sin recargar

## Almacenamiento

El tema seleccionado se guarda en `localStorage` bajo la clave `cobrix-theme`:
- `'light'` - Modo claro
- `'dark'` - Modo oscuro  
- `'system'` - Sigue preferencias del sistema operativo

## Personalización

### Cambiar colores del tema
Edita `/src/styles/globals.css`:
```css
:root {
  --primary: oklch(0.6713 0.1827 248.4507); /* Cambia este valor */
}

.dark {
  --primary: oklch(0.867 0.2902 142.9971); /* Y este para modo oscuro */
}
```

### Cambiar clave de almacenamiento
En `src/components/theme-provider.tsx`:
```tsx
storageKey="tu-nueva-clave"
```

### Cambiar tema por defecto
En `src/components/theme-provider.tsx`:
```tsx
defaultTheme="dark" // o "light"
```

## Ejemplo Completo

```tsx
// src/components/my-component.tsx
'use client';

import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/theme-toggle';

export function MyComponent() {
  const { theme } = useTheme();

  return (
    <div className="p-4 bg-background text-foreground rounded-lg border border-border">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tema actual: {theme}</h2>
        <ThemeToggle />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-2 bg-primary text-primary-foreground rounded">Primary</div>
        <div className="p-2 bg-secondary text-secondary-foreground rounded">Secondary</div>
        <div className="p-2 bg-accent text-accent-foreground rounded">Accent</div>
        <div className="p-2 bg-destructive text-destructive-foreground rounded">Destructive</div>
      </div>
    </div>
  );
}
```

## Características Técnicas

✅ **Prevención de Flash**: Script en `<head>` evita cambios de tema visibles  
✅ **Hidratación Segura**: Uso correcto de `useEffect` en componentes client  
✅ **Soporte Sistema**: Respeta preferencias de dark mode del SO  
✅ **Persistencia**: Guarda selección en localStorage  
✅ **Accesibilidad**: Labels y atributos ARIA incluidos  
✅ **Performance**: Colores usando variables CSS  
✅ **Tailwind Integrado**: Funciona seamlessly con `dark:` utilities  

## Próximos Pasos

1. ✅ Sistema base instalado
2. 📍 Agregar toggle a todas las páginas (usa `ThemeToggle` en headers)
3. 📍 Testear en diferentes navegadores
4. 📍 Agregar más opciones de tema si lo deseas (ej: más colores, más temas)
