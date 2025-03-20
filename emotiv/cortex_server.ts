import assert from "assert";
import dotenv from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import http from 'http';

import type { MetricData } from "../frontend/src/recsystem/met";
import Cortex from "./cortex";

dotenv.config();

const { CORTEX_CLIENT_ID, CORTEX_CLIENT_SECRET } = process.env;

console.log("Starting Emotiv WebSocket server on port 8686");
console.log("This server will handle both SuggestionPage and RecSystem connections");

const wss = new WebSocketServer({
    port: 8686,
    host: "localhost"
});

// Track connected clients and metrics
const clients = new Set<WebSocket>();
let isCollecting = false;
const allMetrics: MetricData[][] = [];
let cortexInstance: Cortex | null = null;
let sessionToken: string | null = null;
let sessionId: string | null = null;

wss.on("listening", () => {
    console.log("WebSocket server is listening on port 8686");
});

wss.on("error", (error) => {
    console.error("WebSocket server error:", error.message);
    process.exit(1);
});

wss.on("connection", async (ws) => {
    console.log("Client connected to WebSocket server");
    clients.add(ws);
    
    // Send initial status message
    ws.send(JSON.stringify({
        op: "status",
        status: "connected",
        message: "Connected to Emotiv server"
    }));
    
    // Set up ping-pong for connection health check
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000);

    try {
        assert(CORTEX_CLIENT_ID !== undefined, "CORTEX_CLIENT_ID is not defined in environment");
        assert(
            CORTEX_CLIENT_SECRET !== undefined,
            "CORTEX_CLIENT_SECRET is not defined in environment"
        );

        const user: CortexUser = {
            client_id: CORTEX_CLIENT_ID,
            client_secret: CORTEX_CLIENT_SECRET
        };

        // Handle messages from clients
        ws.on("message", async (message) => {
            try {
                const parsedMessage = JSON.parse(message.toString());
                const opcode = parsedMessage.op;

                switch (opcode) {
                    case "ping":
                        // Respond to ping requests immediately
                        ws.send(JSON.stringify({ op: "pong", timestamp: Date.now() }));
                        break;
                        
                    case "healthCheck":
                        // Respond with server status
                        ws.send(JSON.stringify({
                            op: "healthStatus",
                            isCollecting,
                            clientCount: clients.size,
                            metricsCount: allMetrics.length,
                            cortexConnected: !!cortexInstance
                        }));
                        break;
                        
                    case "start":
                        if (isCollecting) {
                            ws.send(
                                JSON.stringify({
                                    op: "status",
                                    message: "Already collecting data"
                                })
                            );
                            return;
                        }

                        console.log("Starting Emotiv data collection");
                        isCollecting = true;
                        allMetrics.length = 0; // Clear previous metrics

                        // Initialize Cortex API if not already initialized
                        if (!cortexInstance) {
                            cortexInstance = new Cortex(user);
                            
                            ws.send(
                                JSON.stringify({
                                    op: "status",
                                    message: "Initializing Emotiv connection..."
                                })
                            );

                            try {
                                await cortexInstance.epoch();
                                await cortexInstance.requestAccess();

                                ws.send(
                                    JSON.stringify({
                                        op: "status",
                                        message: "Finding Emotiv headset..."
                                    })
                                );

                                const headsetId = await cortexInstance.queryFirstHeadsetID();
                                await cortexInstance.initiateConnectionToHeadset(headsetId);

                                ws.send(
                                    JSON.stringify({
                                        op: "status",
                                        message: `Connected to headset: ${headsetId}`
                                    })
                                );

                                sessionToken = await cortexInstance.authorize();
                                sessionId = await cortexInstance.createSession(sessionToken, headsetId);
                            } catch (error) {
                                console.error("Error setting up Emotiv:", error);
                                ws.send(
                                    JSON.stringify({
                                        op: "error",
                                        error: "Failed to connect to Emotiv headset"
                                    })
                                );
                                cortexInstance = null;
                                isCollecting = false;
                                return;
                            }
                        }

                        if (cortexInstance && sessionToken && sessionId) {
                            ws.send(
                                JSON.stringify({
                                    op: "status",
                                    message: "Session created, collecting data..."
                                })
                            );

                            // Subscribe to the metrics stream
                            cortexInstance.subscribe(sessionToken, sessionId, (metricData) => {
                                try {
                                    // Format raw data for passing to client
                                    const rawDataStr = printRawMetricData(metricData);

                                    const formattedMetric = formatMetric(metricData);
                                    allMetrics.push(formattedMetric);

                                    // Send to all connected clients
                                    broadcast({
                                        op: "data",
                                        metrics: formattedMetric,
                                        rawData: rawDataStr
                                    });

                                    // Only log collection milestones
                                    if (allMetrics.length === 1 || allMetrics.length % 100 === 0) {
                                        console.log(`Metrics collected: ${allMetrics.length}`);
                                    }
                                } catch (error) {
                                    console.error("Error processing metric data:", error);
                                }
                            });
                        }
                        break;

                    case "stop":
                        if (!isCollecting) return;

                        console.log("Stopping data collection by client request");
                        isCollecting = false;

                        if (cortexInstance && sessionToken && sessionId) {
                            cortexInstance.unsubscribe(sessionToken, sessionId);
                        }

                        // Send the metrics collected so far to the client that sent the stop command
                        ws.send(
                            JSON.stringify({
                                op: "end",
                                totalMetrics: allMetrics.length,
                                allData: allMetrics
                            })
                        );

                        // Also broadcast to all other clients
                        broadcast({
                            op: "end",
                            totalMetrics: allMetrics.length,
                            allData: allMetrics
                        }, ws);
                        break;

                    case "data":
                        // Handle incoming data from simple_reader
                        if (parsedMessage.metrics && Array.isArray(parsedMessage.metrics)) {
                            allMetrics.push(parsedMessage.metrics);
                            broadcast({
                                op: "data",
                                metrics: parsedMessage.metrics
                            });
                        }
                        break;
                }
            } catch (error) {
                console.error("Error processing message:", error);
                ws.send(
                    JSON.stringify({
                        op: "error",
                        error: error instanceof Error ? error.message : "Unknown error"
                    })
                );
            }
        });

        ws.on("close", () => {
            console.log("Client disconnected");
            clients.delete(ws);
            clearInterval(pingInterval);
            
            // If all clients disconnect, stop collecting data
            if (clients.size === 0 && isCollecting && cortexInstance && sessionToken && sessionId) {
                console.log("All clients disconnected, stopping data collection");
                cortexInstance.unsubscribe(sessionToken, sessionId);
                isCollecting = false;
            }
        });
        
        ws.on("error", (error) => {
            console.error("WebSocket client error:", error);
            clients.delete(ws);
            clearInterval(pingInterval);
        });
        
    } catch (error) {
        console.error("Error in server setup:", error);
        ws.send(
            JSON.stringify({
                op: "error",
                error: error instanceof Error ? error.message : "Unknown server error"
            })
        );
    }
});

// Create a simple HTTP server to check if the WebSocket server is running
const healthServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        status: 'running',
        clients: clients.size,
        isCollecting
    }));
});

healthServer.listen(8687, 'localhost', () => {
    console.log('Health check server running on port 8687');
});

// Format the metric data from Emotiv format to our MetricData format
function formatMetric(metricData: any[]): MetricData[] {
    if (!Array.isArray(metricData)) {
        return getDefaultMetrics();
    }

    try {
        const formattedMetric: MetricData[] = [];

        // Process focus
        if (metricData[0] !== undefined && metricData[1] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[0]),
                value: Number(metricData[1]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 }); // Default focus
        }

        // Process engagement
        if (metricData[2] !== undefined && metricData[3] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[2]),
                value: Number(metricData[3]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 }); // Default engagement
        }

        if (metricData[4] !== undefined && metricData[5] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[4]),
                value: Number(metricData[5]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 }); // Default excitement
        }

        // Process interest
        if (metricData[7] !== undefined && metricData[8] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[7]),
                value: Number(metricData[8]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 }); // Default interest
        }

        // Process relaxation
        if (metricData[9] !== undefined && metricData[10] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[9]),
                value: Number(metricData[10]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 }); // Default relaxation
        }

        // Process stress
        if (metricData[11] !== undefined && metricData[12] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[11]),
                value: Number(metricData[12]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.4 }); // Default stress
        }

        return formattedMetric;
    } catch (error) {
        return getDefaultMetrics();
    }
}

function getDefaultMetrics(): MetricData[] {
    return [
        { isActive: true, value: 0.5 }, // focus
        { isActive: true, value: 0.5 }, // engagement
        { isActive: true, value: 0.5 }, // excitement
        { isActive: true, value: 0.5 }, // interest
        { isActive: true, value: 0.5 }, // relaxation
        { isActive: true, value: 0.4 } // stress
    ];
}

// Broadcast a message to all connected clients except the sender (if provided)
function broadcast(message: any, excludeClient?: WebSocket): void {
    const jsonMessage = typeof message === "string" ? message : JSON.stringify(message);

    for (const client of clients) {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
            try {
                client.send(jsonMessage);
            } catch (error) {
                console.error("Error sending message to client:", error);
            }
        }
    }
}

function printRawMetricData(metricData: any[]): string {
    return `[ 
    ${metricData[0]}, ${metricData[1]}, 
    ${metricData[2]}, ${metricData[3]}, 
    ${metricData[4]}, ${metricData[5]}, ${metricData[6]}, 
    ${metricData[7]}, ${metricData[8]}, 
    ${metricData[9]}, ${metricData[10]}, 
    ${metricData[11]}, ${metricData[12]} 
]`;
}
