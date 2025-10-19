import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class", ".dark"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            animation: {
                confetti: "confetti 5s ease-in-out forwards",
            },
            keyframes: {
                confetti: {
                    "0%": {
                        transform: "translateY(0) rotate(0deg)",
                        opacity: "1",
                    },
                    "100%": {
                        transform: "translateY(100vh) rotate(720deg)",
                        opacity: "0",
                    },
                },
            },
        },
    },
} satisfies Config;

export default config;
