import * as math from "mathjs";

import type { IdealRanges, MetricData, SongProperties } from "./met";

export class SongRecommendationModel {
    private alpha: number;
    private idealRanges: IdealRanges;

    constructor(idealRanges: IdealRanges) {
        this.idealRanges = idealRanges;
        this.alpha = 2 / (40 + 1); // EWMA smoothing factor, As the PM why N=40
    }

    /**
     * Step 1: Compute Exponentially Weighted Moving Average (EWMA)
     */
    public calculateEWMA(data: MetricData[][]): number[] {
        const ema: number[] = new Array(6).fill(0);

        data.forEach((metrics, t) => {
            metrics.forEach((metric, index) => {
                if (metric.isActive) {
                    ema[index] =
                        t === 0
                            ? metric.value
                            : this.alpha * metric.value + (1 - this.alpha) * ema[index];
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
     */
    public findBestMatchingSong(
        idealProps: number[],
        trackList: SongProperties[]
    ): { bestSong: SongProperties; sortedSongIds: string[] } {
        const distances = trackList.map((song) => ({
            id: song.id,
            distance: Math.sqrt(
                Math.pow(idealProps[0] - song.danceability, 2) +
                    Math.pow(idealProps[1] - song.energy, 2) +
                    Math.pow(idealProps[2] - song.valence, 2) +
                    Math.pow(idealProps[3] - song.tempo, 2) +
                    Math.pow(idealProps[4] - song.loudness, 2)
            )
        }));

        distances.sort((a, b) => a.distance - b.distance);
        const bestSong = trackList.find((song) => song.id === distances[0].id)!;

        return { bestSong, sortedSongIds: distances.map((d) => String(d.id)) };
    }
}
