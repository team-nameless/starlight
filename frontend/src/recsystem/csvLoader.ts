import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { SongProperties } from "./met";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parses a CSV string and returns an array of song properties
 * @param csvString The CSV content as a string
 * @returns Array of SongProperties objects
 */
export const parseCSV = (csvString: string): SongProperties[] => {
    try {
        const lines = csvString.split("\n");

        //const headers = lines[0].split(',');

        // Process each data line
        const songData: SongProperties[] = [];

        const dataLines = lines.slice(1).filter((line) => line.trim().length > 0);

        for (const line of dataLines) {
            const values: string[] = [];
            let currentValue = "";
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
                    inQuotes = !inQuotes;
                } else if (char === "," && !inQuotes) {
                    values.push(currentValue);
                    currentValue = "";
                } else {
                    currentValue += char;
                }
            }

            values.push(currentValue);

            const song: Partial<SongProperties> = {};

            song.title = values[0];
            song.id = values[1];
            song.trackUrl = values[2];
            song.imgUrl = values[3];
            song.artists = values[4];
            song.danceability = parseFloat(values[5]);
            song.energy = parseFloat(values[6]);
            song.valence = parseFloat(values[7]);
            song.tempo = parseFloat(values[8]);
            song.loudness = parseFloat(values[9]);

            songData.push(song as SongProperties);
        }

        return songData;
    } catch (error) {
        console.error("Error parsing CSV:", error);
        return [];
    }
};

/**
 * Check if code is running in browser environment
 */
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

/**
 * Loads song data from the dataset CSV file
 * @returns Promise that resolves to an array of SongProperties
 */
export const loadSongData = async (): Promise<SongProperties[]> => {
    try {
        const csvPath = "../dataset/dataset_filled.csv";
        console.log(`Loading CSV from: ${csvPath}`);

        if (isBrowser) {
            const response = await fetch(csvPath);
            if (!response.ok) {
                throw new Error(
                    `Failed to load CSV file: ${response.statusText} (status: ${response.status})`
                );
            }

            console.log(`Successfully loaded CSV from: ${csvPath}`);
            const csvText = await response.text();
            return parseCSV(csvText);
        } else {
            try {
                const nodeFilePath = path.resolve(__dirname, csvPath);
                console.log(`Resolved file path: ${nodeFilePath}`);

                if (fs.existsSync(nodeFilePath)) {
                    const csvData = fs.readFileSync(nodeFilePath, "utf8");
                    const songs = parseCSV(csvData);
                    console.log(`Successfully loaded ${songs.length} songs from: ${nodeFilePath}`);
                    return songs;
                } else {
                    throw new Error(`CSV file not found at: ${nodeFilePath}`);
                }
            } catch (fsError) {
                console.error("Error reading file:", fsError);
                throw fsError;
            }
        }
    } catch (error) {
        console.error("Error loading song data:", error);
        return [];
    }
};

/**
 * Alternative loader method as a backup
 */
export const loadStaticSongData = async (): Promise<SongProperties[]> => {
    try {
        console.log("Attempting to load using alternative method");

        if (isBrowser) {
            const response = await fetch(`/src/dataset/dataset_filled.csv`);
            if (response.ok) {
                const csvText = await response.text();
                return parseCSV(csvText);
            }
        } else {
            const absolutePath = path.resolve(
                process.cwd(),
                "frontend/src/dataset/dataset_filled.csv"
            );
            console.log(`Trying alternative absolute path: ${absolutePath}`);

            if (fs.existsSync(absolutePath)) {
                const csvData = fs.readFileSync(absolutePath, "utf8");
                return parseCSV(csvData);
            }
        }

        throw new Error("Could not load CSV file using alternative method");
    } catch (error) {
        console.error("Alternative loading failed:", error);
        return [];
    }
};

/**
 * Required function to maintain API compatibility, but returns empty array
 */
export const useFallbackData = (): SongProperties[] => {
    console.error("Warning: useFallbackData() called but no fallback data is available");
    return [];
};
