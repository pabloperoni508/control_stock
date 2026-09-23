import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["android-chrome-192x192.png"],
            manifest: {
                name: "Control Stock J.P.B.",
                short_name: "Control Stock",
                description: "Gestión de stock y pedidos para J.P.B.",
                theme_color: "#1f291d",
                background_color: "#f7f5ed",
                display: "standalone",
                start_url: "/",
                scope: "/",
                icons: [
                    {
                        src: "/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
    },
});
