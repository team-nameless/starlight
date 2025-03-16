import assert from "assert";
import dotenv from "dotenv";
import WebSocket from "ws";

import type { MetricData } from "../frontend/src/recsystem/met";
import Cortex from "./cortex";

dotenv.config();

const { CORTEX_CLIENT_ID, CORTEX_CLIENT_SECRET } = process.env;
const collectedMetrics: MetricData[][] = [];

export async function startEmotivReader(notifyCallback?: (message: string) => void): Promise<void> {
    try {
        assert(CORTEX_CLIENT_ID !== undefined, "CORTEX_CLIENT_ID must be defined in .env");
        assert(CORTEX_CLIENT_SECRET !== undefined, "CORTEX_CLIENT_SECRET must be defined in .env");

        const user: CortexUser = {
            client_id: CORTEX_CLIENT_ID,
            client_secret: CORTEX_CLIENT_SECRET
        };

        const log = (message: string) => {
            console.log(message);
            if (notifyCallback) notifyCallback(message);
        };

        // Create connection to WebSocket server
        let wsClient: WebSocket | null = null;
        try {
            wsClient = new WebSocket("ws://localhost:8686");
            log("Connecting to recommendation system server...");
        } catch (error) {
            log(`Failed to connect to WebSocket server: ${error}`);
        }

        // Wait for WebSocket connection
        if (wsClient) {
            await new Promise<void>((resolve) => {
                wsClient!.on("open", () => {
                    log("Connected to WebSocket server");
                    resolve();
                });

                wsClient!.on("error", (err) => {
                    log(`WebSocket connection error: ${err.message}`);
                    wsClient = null;
                    resolve();
                });
            });
        }

        // Initialize Emotiv connection
        log("Initializing Emotiv connection...");
        const c = new Cortex(user);
        await c.epoch();
        await c.requestAccess();

        const headsetId = await c.queryFirstHeadsetID();
        log(`Found headset with ID: ${headsetId}`);
        await c.initiateConnectionToHeadset(headsetId);

        const token = await c.authorize();
        const sessionId = await c.createSession(token, headsetId);
        log("Session created, starting data collection");

        // Clear any previously collected metrics
        collectedMetrics.length = 0;

        // Subscribe to metrics and handle the data
        c.subscribe(token, sessionId, (metricData) => {
            try {
                // Format raw data for passing to client, but don't print it here
                const rawDataStr = printRawMetricData(metricData);

                const formattedMetric = formatMetric(metricData);
                collectedMetrics.push(formattedMetric);

                if (wsClient && wsClient.readyState === WebSocket.OPEN) {
                    wsClient.send(
                        JSON.stringify({
                            op: "data",
                            metrics: formattedMetric,
                            rawData: rawDataStr
                        })
                    );
                }

                // Only log collection milestones instead of every 10 metrics
                if (collectedMetrics.length === 1 || collectedMetrics.length % 100 === 0) {
                    log(`Metrics collected: ${collectedMetrics.length}`);
                }
            } catch (error) {
                log(`Error processing metric data: ${error}`);
            }
        });

        // Set timeout to stop collection after 2 minutes
        log("Data collection will continue for 2 minutes");
        setTimeout(() => {
            log("3 minutes elapsed, stopping data collection");
            c.unsubscribe(token, sessionId);

            if (wsClient && wsClient.readyState === WebSocket.OPEN) {
                log(`Sending ${collectedMetrics.length} metrics to processing system`);
                wsClient.send(
                    JSON.stringify({
                        op: "end",
                        count: collectedMetrics.length,
                        allData: collectedMetrics
                    })
                );

                setTimeout(() => wsClient?.close(), 2000);
            }
        }, 120000); // 2 minutes
    } catch (error) {
        console.error("Error in Emotiv reader:", error);
    }
}

// Format raw metric data as a readable string in the specific format
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
            formattedMetric.push({ isActive: true, value: 0.5 });
        }

        // Process engagement
        if (metricData[2] !== undefined && metricData[3] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[2]),
                value: Number(metricData[3]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 });
        }

        // Process excitement - ONLY use "exc" value, not "lex"
        if (metricData[4] !== undefined && metricData[5] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[4]),
                value: Number(metricData[5]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 });
        }

        // Process interest
        if (metricData[7] !== undefined && metricData[8] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[7]),
                value: Number(metricData[8]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 });
        }

        // Process relaxation
        if (metricData[9] !== undefined && metricData[10] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[9]),
                value: Number(metricData[10]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.5 });
        }

        // Process stress
        if (metricData[11] !== undefined && metricData[12] !== undefined) {
            formattedMetric.push({
                isActive: Boolean(metricData[11]),
                value: Number(metricData[12]) || 0.5
            });
        } else {
            formattedMetric.push({ isActive: true, value: 0.4 });
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

if (require.main === module) {
    console.log("Starting Emotiv reader standalone");
    startEmotivReader();
}
