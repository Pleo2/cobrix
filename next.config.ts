import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ============ Optimización de Imágenes ============
    images: {
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // ============ Configuración de Compilación ============
    swcMinify: true, // Usa SWC para minificación más rápida
    productionBrowserSourceMaps: false, // Desactiva source maps en producción
    optimizeFonts: true,

    // ============ Configuración de Headers ============
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
        ];
    },

    // ============ Configuración de Redirects ============
    async redirects() {
        return [];
    },

    // ============ Configuración de Rewrites ============
    async rewrites() {
        return {
            beforeFiles: [],
            afterFiles: [],
            fallback: [],
        };
    },

    // ============ Configuración de Webpack ============
    webpack: (config, { dev }) => {
        // Optimizaciones personalizadas de webpack
        if (!dev) {
            config.mode = "production";
        }
        return config;
    },

    // ============ Configuración de TypeScript ============
    typescript: {
        tsconfigPath: "./tsconfig.json",
    },

    // ============ Configuración de ESLint ============
    eslint: {
        dirs: ["src", "pages", "components", "lib", "utils"],
        ignoreDuringBuilds: false,
    },

    // ============ Configuración de Rendimiento ============
    compress: true,
    poweredByHeader: false,
    generateEtags: true,

    // ============ Configuración de React ============
    reactStrictMode: true,

    // ============ Configuración de i18n (si es necesario) ============
    // i18n: {
    //     locales: ["es", "en"],
    //     defaultLocale: "es",
    // },

    // ============ Configuración de Experimental ============
    experimental: {
        // Habilita optimizaciones experimentales de Next.js
        isrMemoryCacheSize: 50 * 1024 * 1024, // 50MB para ISR cache
        optimizePackageImports: {
            "@dnd-kit/core": ["@dnd-kit/core"],
            "@radix-ui/react-avatar": ["@radix-ui/react-avatar"],
            "@radix-ui/react-checkbox": ["@radix-ui/react-checkbox"],
            "@radix-ui/react-dialog": ["@radix-ui/react-dialog"],
            "@radix-ui/react-dropdown-menu": ["@radix-ui/react-dropdown-menu"],
            "@radix-ui/react-label": ["@radix-ui/react-label"],
            "@radix-ui/react-select": ["@radix-ui/react-select"],
            "@radix-ui/react-separator": ["@radix-ui/react-separator"],
            "@radix-ui/react-toggle": ["@radix-ui/react-toggle"],
            "@radix-ui/react-tooltip": ["@radix-ui/react-tooltip"],
            "lucide-react": ["lucide-react"],
            "@tabler/icons-react": ["@tabler/icons-react"],
        },
    },

    // ============ Configuración de Output ============
    output: "standalone", // Optimizado para despliegues en contenedores
};

export default nextConfig;
