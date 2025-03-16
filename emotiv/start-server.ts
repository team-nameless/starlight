/**
 * Helper script to start the Emotiv WebSocket server
 */
import { spawn } from "child_process";
import path from "path";

console.log("Starting Emotiv WebSocket server...");

// Define the path to the server script
const serverPath = path.join(__dirname, "cortex_server.ts");

// Start the server using tsx
const server = spawn("npx", ["tsx", serverPath], {
    stdio: "inherit",
    shell: true
});

server.on("error", (error) => {
    console.error("Error starting Emotiv server:", error);
    process.exit(1);
});

// Handle termination signals
process.on("SIGINT", () => {
    console.log("Terminating Emotiv server...");
    server.kill("SIGINT");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("Terminating Emotiv server...");
    server.kill("SIGTERM");
    process.exit(0);
});
