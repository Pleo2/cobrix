import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class", ".dark"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ]
} satisfies Config;

export default config;
