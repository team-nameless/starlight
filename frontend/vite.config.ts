import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

// Clean directories before build
try {
  fs.rmSync("dist", { recursive: true, force: true });
  fs.rmSync("dist-electron", { recursive: true, force: true });
  fs.rmSync("release", { recursive: true, force: true });
} catch (error) {
  // Ignore errors during cleanup
}

export default defineConfig({
    resolve: {
        alias: {
            "@": path.join(__dirname, "src")
        }
    },
    plugins: [
        react(),
        electron({
            entry: "electron/main.ts",
            vite: {
                build: {
                    outDir: "dist-electron"
                }
            }
        })
    ],
    server: {
        port: 3000
    },
    build: {
        minify: true
    }
});
