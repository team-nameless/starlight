import * as math from "mathjs";

import { loadSongData, loadStaticSongData } from "./csvLoader";
import type { IdealRanges, MetricData, SongProperties } from "./met";

export class SongRecommendationModel {
    private alpha: number;
    private idealRanges: IdealRanges;
    private songData: SongProperties[] = [];
    private isDataLoaded: boolean = false;
    private loadingPromise: Promise<SongProperties[]> | null = null;

    constructor(idealRanges: IdealRanges) {
        this.idealRanges = idealRanges;
        this.alpha = 2 / (40 + 1); // EWMA smoothing factor, As the PM why N=40

        // Load song data when the model is initialized
        this.loadSongData();
    }

    /**
     * Load song data from CSV with improved error handling
     */
    private async loadSongData(): Promise<SongProperties[]> {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = new Promise<SongProperties[]>(async (resolve) => {
            try {
                console.log("Loading song data from CSV...");

                // Try to load using primary method
                let songData = await loadSongData();

                // If that fails, try the alternative method
                if (songData.length === 0) {
                    console.log("Primary loading failed, trying alternative method...");
                    songData = await loadStaticSongData();
                }

                if (songData.length === 0) {
                    console.error("Failed to load any song data");
                    this.songData = [];
                    this.isDataLoaded = false;
                    resolve([]);
                    return;
                }

                this.songData = songData;
                this.isDataLoaded = true;
                console.log(`Successfully loaded ${songData.length} songs`);
                resolve(songData);
            } catch (error) {
                console.error("Error loading song data:", error);
                this.isDataLoaded = false;
                resolve([]);
            }
        });

        return this.loadingPromise;
    }

    /**
     * Get the song data, wait for it to load if necessary
     */
    public async getSongData(): Promise<SongProperties[]> {
        if (this.isDataLoaded) {
            return this.songData;
        }

        const data = await this.loadSongData();
        return data;
    }

    /**
     * Step 1: Compute Exponentially Weighted Moving Average (EWMA)
     */
    public calculateEWMA(data: MetricData[][]): number[] {
        const ema: number[] = new Array(6).fill(0);

        data.forEach((metrics, t) => {
            metrics.forEach((metric, index) => {
                if (metric.isActive) {
                    // If metric value is 0, replace with random value between 0.1 and 1.0
                    // This prevents issues in subsequent calculations when EEG quality is low
                    const value = metric.value === 0 ? Math.random() * 0.9 + 0.1 : metric.value;

                    ema[index] =
                        t === 0 ? value : this.alpha * value + (1 - this.alpha) * ema[index];
                }
            });
        });

        return ema;
    }

    /**
     * Step 2: Compute the target mental state (midpoint of ideal ranges)
     */
    public calculateTargetMentalState(): number[] {
        return Object.values(this.idealRanges).map((range) => (range.low + range.upper) / 2);
    }

    /**
     * Step 3: Compute the Weight Matrix (W) using Moore-Penrose Pseudo-inverse
     */
    public computeWeightMatrix(deltaT: number[], songProps: SongProperties): number[][] {
        try {
            const deltaT_matrix = deltaT.map((val) => [val]);

            const songPropsVector = [
                songProps.danceability,
                songProps.energy,
                songProps.valence,
                songProps.tempo,
                songProps.loudness
            ];

            const V_song = math.transpose([songPropsVector]);
            const V_song_pinv = math.pinv(V_song);

            const W = math.multiply(deltaT_matrix, V_song_pinv) as number[][];

            console.log(
                "Matrix dimensions - deltaT:",
                math.size(deltaT_matrix),
                "V_song_pinv:",
                math.size(V_song_pinv)
            );
            return W;
        } catch (error) {
            console.error("Error in weight matrix calculation:", error);
            return Array(6).fill(Array(5).fill(0.001));
        }
    }

    /**
     * Step 4: Compute the Ideal Song Properties with the Penalty Function
     */
    public computeIdealSongProps(
        weightMatrix: number[][],
        deltaT: number[],
        ema: number[]
    ): number[] {
        try {
            const lambda = 0.2;
            const epsilon = 0.05;

            // Compute Penalty Function (Λ)
            const penalty = deltaT.map((value, i) => {
                const metricName = Object.keys(this.idealRanges)[i] as keyof IdealRanges;
                const { low, upper } = this.idealRanges[metricName];

                if (ema[i] >= low && ema[i] <= upper) {
                    return lambda * (1 - Math.abs(value - ema[i]) / epsilon);
                }
                return 1;
            });

            // Apply Penalty Function: ∆𝑇_adjusted = ∆𝑇 * 𝛬
            const deltaT_adjusted = deltaT.map((val, i) => val * penalty[i]);

            const deltaT_column = deltaT_adjusted.map((val) => [val]);
            const W_pinv = math.pinv(weightMatrix);
            const V_target_matrix = math.multiply(W_pinv, deltaT_column) as number[][];

            const V_target = V_target_matrix.map((row) => row[0]);

            return [
                Math.max(0, Math.min(1, V_target[0])),
                Math.max(0, Math.min(1, V_target[1])),
                Math.max(0, Math.min(1, V_target[2])),
                Math.max(0, Math.min(300, V_target[3])),
                Math.max(-50, Math.min(0, V_target[4]))
            ];
        } catch (error) {
            console.error("Error computing ideal song properties:", error);
            return [0.5, 0.5, 0.5, 120, -10];
        }
    }

    /**
     * Step 5: Find the Best Matching Song in Track List using Euclidean Distance
     * Now returns only the top 6 best matching songs
     */
    public findBestMatchingSong(
        idealProps: number[],
        trackList: SongProperties[]
    ): { bestSong: SongProperties; sortedSongIds: string[] } {
        if (!trackList || trackList.length === 0) {
            console.error("No track list available for song matching");
            throw new Error("Empty track list");
        }

        // Calculate distance for each song
        const distances = trackList.map((song) => ({
            id: song.id,
            distance: Math.sqrt(
                Math.pow(idealProps[0] - song.danceability, 2) +
                    Math.pow(idealProps[1] - song.energy, 2) +
                    Math.pow(idealProps[2] - song.valence, 2) +
                    Math.pow(idealProps[3] - song.tempo, 2) +
                    Math.pow(idealProps[4] - song.loudness, 2)
            ),
            song: song
        }));

        // Sort by distance (closest match first)
        distances.sort((a, b) => a.distance - b.distance);

        // Get the best song
        const bestSong = distances[0].song;

        // Return only the top 6 song IDs
        const sortedSongIds = distances.slice(0, 6).map((d) => d.id);

        // Log the top 6 songs with their distances
        console.log("Top 6 recommended songs:");
        distances.slice(0, 6).forEach((d, index) => {
            console.log(
                `${index + 1}. ID: ${d.id}, Distance: ${d.distance.toFixed(4)}, Title: ${d.song.title}`
            );
        });

        return { bestSong, sortedSongIds };
    }
}
