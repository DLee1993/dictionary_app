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
                bg: "url('/BG.webp')",
            },
            colors: {
                dark: "rgb(36, 35, 32)",
                light: "rgb(255, 255, 255)",
                grey: "rgb(36, 35, 32)",
                accent: "rgb(242, 67, 51)",
            },
        },
    },
    darkMode: "class",
    plugins: [nextui()],
};
