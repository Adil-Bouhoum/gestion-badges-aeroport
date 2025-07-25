import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/App.jsx"],
            refresh: true,
        }),
        react({
            include: "**/*.{jsx,tsx}",
        }),
    ],
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
    server: {
        hmr: {
            host: "localhost",
        },
    },
});
