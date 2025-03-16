import assert from "assert";
import dotenv from "dotenv";
import { WebSocket, WebSocketServer } from "ws";

import type { MetricData } from "../frontend/src/recsystem/met";
import Cortex from "./cortex";

dotenv.config();

const { CORTEX_CLIENT_ID, CORTEX_CLIENT_SECRET } = process.env;

console.log("Starting Emotiv WebSocket server on port 8686");
const wss = new WebSocketServer({
    port: 8686,
    host: "localhost"
});

// Track connected clients and metrics
const clients = new Set<WebSocket>();
let isCollecting = false;
const allMetrics: MetricData[][] = [];

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

                        // Initialize Cortex API
                        const c = new Cortex(user);

                        ws.send(
                            JSON.stringify({
                                op: "status",
                                message: "Initializing Emotiv connection..."
                            })
                        );

                        await c.epoch();
                        await c.requestAccess();

                        ws.send(
                            JSON.stringify({
                                op: "status",
                                message: "Finding Emotiv headset..."
                            })
                        );

                        const headsetId = await c.queryFirstHeadsetID();
                        await c.initiateConnectionToHeadset(headsetId);

                        ws.send(
                            JSON.stringify({
                                op: "status",
                                message: `Connected to headset: ${headsetId}`
                            })
                        );

                        const token = await c.authorize();
                        const sessionId = await c.createSession(token, headsetId);

                        ws.send(
                            JSON.stringify({
                                op: "status",
                                message: "Session created, collecting data..."
                            })
                        );

                        // Subscribe to the metrics stream
                        c.subscribe(token, sessionId, (metricData) => {
                            try {
                                // Format raw data for passing to client, but don't print it here
                                const rawDataStr = printRawMetricData(metricData);

                                const formattedMetric = formatMetric(metricData);
                                allMetrics.push(formattedMetric);

                                // Send to all connected clients
                                broadcast({
                                    op: "data",
                                    metrics: formattedMetric,
                                    rawData: rawDataStr
                                });

                                // Only log collection milestones instead of every 10 metrics
                                if (allMetrics.length === 1 || allMetrics.length % 100 === 0) {
                                    console.log(`Metrics collected: ${allMetrics.length}`);
                                }
                            } catch (error) {
                                console.error("Error processing metric data:", error);
                            }
                        });

                        // Set timeout to stop collection after 2 minutes
                        ws.send(
                            JSON.stringify({
                                op: "status",
                                message: "Data collection will run for 2 minutes"
                            })
                        );

                        setTimeout(() => {
                            if (!isCollecting) return;

                            console.log("Timeout reached, stopping data collection");
                            c.unsubscribe(token, sessionId);
                            isCollecting = false;

                            // Send the complete metrics data to all clients
                            broadcast({
                                op: "end",
                                totalMetrics: allMetrics.length,
                                allData: allMetrics
                            });
                        }, 120000); // 2 minutes
                        break;

                    case "stop":
                        if (!isCollecting) return;

                        console.log("Stopping data collection by client request");
                        isCollecting = false;

                        // Send the metrics collected so far
                        ws.send(
                            JSON.stringify({
                                op: "end",
                                totalMetrics: allMetrics.length,
                                allData: allMetrics
                            })
                        );
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

// Broadcast a message to all connected clients
function broadcast(message: any): void {
    const jsonMessage = typeof message === "string" ? message : JSON.stringify(message);

    for (const client of clients) {
        try {
            if (client.readyState === 1) {
                // WebSocket.OPEN
                client.send(jsonMessage);
            }
        } catch (error) {
            console.error("Error sending message to client:", error);
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
