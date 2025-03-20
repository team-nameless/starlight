/**
 * Utility functions for checking Cortex server status and connections
 */

// Check if the Cortex server is running by querying the health check endpoint
export async function isCortexServerRunning(): Promise<boolean> {
    try {
        const response = await fetch("http://localhost:8687", {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.status === "running";
        }
        return false;
    } catch (error) {
        return false;
    }
}

// Get the server status details
export async function getCortexServerStatus(): Promise<{
    running: boolean;
    clients: number;
    isCollecting: boolean;
}> {
    try {
        const response = await fetch("http://localhost:8687", {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                running: data.status === "running",
                clients: data.clients || 0,
                isCollecting: data.isCollecting || false
            };
        }
        return { running: false, clients: 0, isCollecting: false };
    } catch (error) {
        return { running: false, clients: 0, isCollecting: false };
    }
}

// Trigger data collection - this will communicate with the WebSocket server
export async function startEmotivDataCollection(duration?: number): Promise<boolean> {
    try {
        // Connect to the WebSocket server
        const ws = new WebSocket("ws://localhost:8686");

        return new Promise((resolve) => {
            ws.onopen = () => {
                // Send the command to start data collection
                ws.send(
                    JSON.stringify({
                        op: "start",
                        duration: duration || 30
                    })
                );

                console.log(`Sent command to start data collection for ${duration || 30} seconds`);
                resolve(true);
            };

            ws.onerror = (error) => {
                console.error("Error connecting to Cortex server:", error);
                resolve(false);
            };

            // Set a timeout in case the connection hangs
            setTimeout(() => {
                if (ws.readyState !== WebSocket.OPEN) {
                    console.log("Connection timed out");
                    resolve(false);
                }
            }, 5000);
        });
    } catch (error) {
        console.error("Error starting Emotiv data collection:", error);
        return false;
    }
}

// Stop data collection
export async function stopEmotivDataCollection(): Promise<boolean> {
    try {
        const ws = new WebSocket("ws://localhost:8686");

        return new Promise((resolve) => {
            ws.onopen = () => {
                ws.send(JSON.stringify({ op: "stop" }));
                console.log("Sent command to stop data collection");
                resolve(true);
            };

            ws.onerror = () => {
                resolve(false);
            };

            setTimeout(() => {
                if (ws.readyState !== WebSocket.OPEN) {
                    resolve(false);
                }
            }, 5000);
        });
    } catch (error) {
        console.error("Error stopping Emotiv data collection:", error);
        return false;
    }
}
