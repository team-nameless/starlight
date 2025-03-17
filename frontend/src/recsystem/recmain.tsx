import type { MetricData } from "./met";
import { SongRecommendationModel } from "./modellogic";
import { idealRanges, sampleData } from "./sampledata";

console.log("Starting Song Recommendation System with real-time Emotiv data");

async function processMetrics(metrics: MetricData[][]) {
    console.log(`\nProcessing ${metrics.length} metric data points`);

    if (metrics.length === 0) {
        console.error("No metrics data available for processing");
        return;
    }

    try {
        // Load song data from CSV
        console.log("Loading song data from CSV...");
        const trackList = await model.getSongData();

        // Check if we have song data
        if (!trackList || trackList.length === 0) {
            console.error("No song data available. Cannot process metrics.");
            return;
        }

        console.log(`Successfully loaded ${trackList.length} songs for recommendation`);

        // Step 1: Compute EMA
        console.log("\nStep 1: Compute EMA");
        const ema = model.calculateEWMA(metrics);
        console.log("EMA Values:", ema);

        // Step 2: Compute Target Mental State
        console.log("\nStep 2: Compute Target Mental State");
        const target = model.calculateTargetMentalState();
        console.log("Target State:", target);

        // Step 3: Compute Weight Matrix
        console.log("\nStep 3: Compute Weight Matrix");
        const deltaT = target.map((t, i) => t - ema[i]);
        console.log("ΔT (Difference between Target and EMA):", deltaT);

        const weightMatrix = model.computeWeightMatrix(deltaT, trackList[0]);
        console.log("Weight Matrix (W):", weightMatrix);

        // Step 4: Compute Ideal Song Properties
        console.log("\nStep 4: Compute Ideal Song Properties");
        const idealProps = model.computeIdealSongProps(weightMatrix, deltaT, ema);
        console.log("Ideal Song Properties (V_target):", idealProps);

        // Step 5: Find Best Matching Song (now returns top 6 matches)
        console.log("\nStep 5: Find Best Matching Song (Top 6)");
        const { bestSong, sortedSongIds } = model.findBestMatchingSong(idealProps, trackList);
        console.log("\nBest Recommended Song:", bestSong.title, "(ID:", bestSong.id, ")");
        console.log("\nTop 6 Song IDs by Distance:", sortedSongIds);
    } catch (error) {
        console.error("Error processing metrics:", error);
        console.warn("An error occurred during processing. Check the logs for details.");
    }
}

// Initialize the model and connection variables
const model = new SongRecommendationModel(idealRanges);
let collectedMetrics: MetricData[][] = [];
let retryCount = 0;
const maxRetries = 5;

function connectToServer() {
    console.log(`Connecting to Emotiv server (attempt ${retryCount + 1}/${maxRetries})`);

    try {
        const ws = new WebSocket("ws://localhost:8686");

        ws.onopen = () => {
            console.log("Connected to Emotiv server");
            retryCount = 0;
            ws.send(JSON.stringify({ op: "start" }));
            console.log("Data collection started");
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.op === "status") {
                    // Only display important status messages, not metric count updates
                    if (!message.message.includes("Collected")) {
                        console.log(`Status: ${message.message}`);
                    }
                } else if (message.op === "data" && Array.isArray(message.metrics)) {
                    // Only print raw data in the client for better visibility
                    if (message.rawData) {
                        console.log(`Raw MetricData: ${message.rawData}`);
                    }

                    collectedMetrics.push(message.metrics);
                } else if (message.op === "end") {
                    console.log("Data collection complete");

                    if (message.allData && Array.isArray(message.allData)) {
                        collectedMetrics = message.allData;
                    }

                    console.log(`Processing ${collectedMetrics.length} metrics`);

                    if (collectedMetrics.length === 0) {
                        console.warn("No metrics collected. Using sample data");
                        processMetrics(sampleData);
                    } else {
                        processMetrics(collectedMetrics);
                    }

                    ws.close();
                } else if (message.op === "error") {
                    console.error("Error from server:", message.error);
                    console.warn("Using sample data due to server error");
                    processMetrics(sampleData);
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        };

        ws.onerror = () => {
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Connection failed. Retrying in 2 seconds...`);
                setTimeout(connectToServer, 2000);
            } else {
                console.error(`Failed to connect after ${maxRetries} attempts`);
                console.warn("Using sample data as fallback");
                processMetrics(sampleData);
            }
        };

        ws.onclose = () => {
            console.log("Connection closed");
        };
    } catch (error) {
        console.error("Error creating connection:", error);

        if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(connectToServer, 2000);
        } else {
            console.error(`Failed after ${maxRetries} attempts`);
            processMetrics(sampleData);
        }
    }
}

connectToServer();
