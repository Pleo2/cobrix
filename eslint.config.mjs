import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "dist/**",
            "next-env.d.ts",
            ".git/**",
            ".vscode/**",
            ".idea/**",
            "*.log",
            "*.lock",
        ],
    },
    {
        rules: {
            // ============ React Rules ============
            "react/no-unescaped-entities": "warn",
            "react/display-name": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",

            // ============ TypeScript Rules ============
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],

            // ============ General Rules ============
            "no-console": [
                "warn",
                {
                    allow: ["warn", "error"],
                },
            ],
            "prefer-const": "error",
            "no-var": "error",

            // ============ Next.js Rules ============
            "@next/next/no-html-link-for-pages": "off",
        },
    },
];

export default eslintConfig;
