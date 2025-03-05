import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";
import electron from "vite-plugin-electron/simple";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        electron({
            main: {
                entry: "electron/bootstrap.ts"
            }
        }),
        renderer()
    ]
});
