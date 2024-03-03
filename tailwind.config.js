import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js",
    ],
    theme: {
        extend: {
            backgroundImage: {
                bg: "url('/BG.webp')"
            },
            colors: {
                dark: "var(--dark)",
                light: "var(--light)",
                grey: "var(--grey)",
                accent: "var(--accent)",
                accentFaded: "var(--accentFaded)",
            }
        },
    },
    darkMode: "class",
    plugins: [nextui()],
};
