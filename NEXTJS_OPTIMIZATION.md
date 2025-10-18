# Configuración Óptima de Next.js - Cobrix

Este documento describe todas las optimizaciones y configuraciones implementadas para desarrollo profesional de Next.js.

## 📋 Tabla de Contenidos

1. [Editor Configuration](#editor-configuration)
2. [Next.js Config](#nextjs-config)
3. [TypeScript Configuration](#typescript-configuration)
4. [ESLint Configuration](#eslint-configuration)
5. [Best Practices](#best-practices)
6. [Performance](#performance)

---

## 🎨 Editor Configuration (`.editorconfig`)

### Características Principales

- **Charset UTF-8**: Garantiza compatibilidad internacional
- **LF (Line Feed)**: Consistencia en sistemas Unix/Linux/macOS
- **Trim Trailing Whitespace**: Elimina espacios innecesarios
- **Insert Final Newline**: Agrega nueva línea al final de archivos

### Configuraciones Específicas por Tipo de Archivo

#### JavaScript/TypeScript
- **Indent Size**: 4 espacios
- **Max Line Length**: 120 caracteres (100 para TSX/JSX)

#### JSON/YAML/Config
- **Indent Size**: 2 espacios

#### CSS/SCSS/HTML
- **Indent Size**: 2 espacios

#### Markdown
- **Sin trim**: Preserva espacios en blanco finales
- **Sin max line length**: Permite líneas largas en documentación

---

## ⚙️ Next.js Config (`next.config.ts`)

### 1. Optimización de Imágenes

```typescript
images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año
}
```

**Beneficios:**
- Formatos modernos (AVIF, WebP) para mejor compresión
- Caché de 1 año para imágenes optimizadas
- Múltiples tamaños para responsive design

### 2. Seguridad (Headers)

```typescript
async headers() {
    return [
        {
            source: "/:path*",
            headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "X-XSS-Protection", value: "1; mode=block" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            ],
        },
    ];
}
```

**Protecciones:**
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME type sniffing

### 3. Compilación Optimizada

- **SWC Minify**: Minificación más rápida que Terser
- **Source Maps Deshabilitados**: Reduce tamaño de build en producción
- **Font Optimization**: Optimización automática de fuentes

### 4. TypeScript Strict

```typescript
typescript: {
    tsconfigPath: "./tsconfig.json",
}
```

Integración automática con configuración TypeScript.

### 5. ESLint Integration

```typescript
eslint: {
    dirs: ["src", "pages", "components", "lib", "utils"],
    ignoreDuringBuilds: false,
}
```

Ejecuta ESLint durante el build para detectar errores temprano.

### 6. Output Standalone

```typescript
output: "standalone"
```

**Ventajas:**
- Ideal para despliegues en Docker
- Reduce tamaño del output
- Mejor para entornos Serverless

### 7. Optimizaciones Experimentales

```typescript
experimental: {
    isrMemoryCacheSize: 50 * 1024 * 1024,
    optimizePackageImports: {
        "@dnd-kit/core": ["@dnd-kit/core"],
        "@radix-ui/react-avatar": ["@radix-ui/react-avatar"],
        // ...más paquetes
    }
}
```

**Beneficios:**
- Mejor caché para ISR (Incremental Static Regeneration)
- Tree-shaking optimizado para librerías UI
- Reduce tamaño del bundle

---

## 🔷 TypeScript Configuration (`tsconfig.json`)

### Versión de Target

```typescript
"target": "ES2020"
```

Soporte para características modernas de JavaScript.

### Modo Strict Completo

```typescript
"strict": true,
"noImplicitAny": true,
"strictNullChecks": true,
"strictFunctionTypes": true,
"strictPropertyInitialization": true,
"noImplicitThis": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noImplicitReturns": true,
"noFallthroughCasesInSwitch": true,
```

**Beneficios:**
- Detecta errores en tiempo de compilación
- Previene bugs comunes
- Mejora la calidad del código

### Path Mapping

```typescript
"paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/styles/*": ["./src/styles/*"],
    "@/config/*": ["./src/config/*"],
    "@/utils/*": ["./src/utils/*"],
    "@/types/*": ["./src/types/*"]
}
```

**Ventajas:**
- Imports más limpios y legibles
- Refactoring más fácil
- Evita imports relativos complejos

### Exclude Completo

```typescript
"exclude": [
    "node_modules",
    ".next",
    "out",
    "build",
    ".git"
]
```

Reduce tiempo de compilación excluyendo directorios innecesarios.

---

## 🔍 ESLint Configuration (`eslint.config.mjs`)

### Reglas de React

```javascript
"react/no-unescaped-entities": "warn",
"react/display-name": "off",
"react/react-in-jsx-scope": "off",
```

Configuración moderna para React 17+.

### Reglas de TypeScript

```javascript
"@typescript-eslint/no-unused-vars": [
    "error",
    {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
    }
]
```

Permite variables prefijadas con `_` para propósito explícito.

### Reglas Generales

```javascript
"no-console": ["warn", { allow: ["warn", "error"] }],
"prefer-const": "error",
"no-var": "error",
```

Promueve mejores prácticas de código.

---

## 📚 Best Practices

### 1. Importación de Componentes

✅ **Correcto:**
```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
```

❌ **Incorrecto:**
```typescript
import { Button } from "../../../components/ui/button";
import { useAuth } from "../hooks/use-auth";
```

### 2. Tipado Explícito

✅ **Correcto:**
```typescript
interface Props {
    title: string;
    count: number;
}

export function Component({ title, count }: Props) {
    return <div>{title}: {count}</div>;
}
```

### 3. Modo Cliente

✅ **Correcto para State/Events:**
```typescript
"use client";

import { useState } from "react";

export function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 4. Error Handling

✅ **Correcto:**
```typescript
try {
    const data = await fetchData();
} catch (error) {
    console.error("Error fetching data:", error);
    // Manejo del error
}
```

---

## ⚡ Performance

### Métricas Clave

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Optimizaciones Implementadas

1. **Image Optimization**: AVIF + WebP
2. **Code Splitting**: Automático en Next.js
3. **Tree Shaking**: Vía ESLint y experimentalOptimizePackageImports
4. **Font Optimization**: Automática
5. **Bundle Analysis**: Usando `next/bundle-analyzer`

### Comandos Útiles

```bash
# Desarrollo con Turbopack
npm run dev

# Build optimizado
npm run build

# Análisis de bundle
npm run analyze  # (requiere @next/bundle-analyzer)

# Linting
npm run lint
```

---

## 🚀 Despliegue

### Docker

La configuración `output: "standalone"` optimiza para Docker:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Vercel

Automatiza deployment con:

```bash
npx vercel
```

---

## 📝 Checklist de Configuración

- [x] `.editorconfig` - Consistencia de editor
- [x] `next.config.ts` - Optimizaciones y seguridad
- [x] `tsconfig.json` - TypeScript strict
- [x] `eslint.config.mjs` - Linting moderno
- [x] `package.json` - Scripts optimizados
- [x] Turbopack en dev y build
- [x] Standalone output para Docker

---

## 🔗 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [EditorConfig](https://editorconfig.org/)
- [Web Vitals](https://web.dev/vitals/)

---

**Última actualización**: Octubre 2025
