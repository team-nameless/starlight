import { SongProperties } from "./met";

/**
 * Check if code is running in browser environment
 */
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

// For Node.js environment only
let fs: any = null;
let path: any = null;
if (!isBrowser) {
    try {
        fs = require('fs');
        path = require('path');
    } catch (e) {
        console.warn("Node.js modules not available.");
    }
}

/**
 * Parses a CSV string and returns an array of song properties
 */
export const parseCSV = (csvString: string): SongProperties[] => {
    try {
        const lines = csvString.split("\n");
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
            song.danceability = parseFloat(values[5]) || 0.5;
            song.energy = parseFloat(values[6]) || 0.5;
            song.valence = parseFloat(values[7]) || 0.5;
            song.tempo = parseFloat(values[8]) || 120;
            song.loudness = parseFloat(values[9]) || -8;
            song.duration = parseFloat(values[10]) || 180;

            songData.push(song as SongProperties);
        }

        return songData;
    } catch (error) {
        console.error("Error parsing CSV:", error);
        return [];
    }
};

/**
 * Loads song data from the dataset CSV file
 */
export const loadSongData = async (): Promise<SongProperties[]> => {
    try {
        // Try MANY possible paths
        const possiblePaths = [
            "/dataset_filled.csv",  // From the public directory root
            "./dataset_filled.csv",
            "../dataset_filled.csv",
            "/public/dataset_filled.csv",
            "public/dataset_filled.csv",
            "../public/dataset_filled.csv",
            "./public/dataset_filled.csv",
            "/assets/dataset_filled.csv",
            "./assets/dataset_filled.csv"
        ];
        
        if (isBrowser) {
            console.log("Browser environment detected, trying fetch...");
            
            // First try the base URL with no path
            try {
                const baseURL = window.location.origin;
                console.log(`Attempting to load from base URL: ${baseURL}/dataset_filled.csv`);
                const response = await fetch(`${baseURL}/dataset_filled.csv`);
                if (response.ok) {
                    console.log(`Successfully loaded CSV from base URL`);
                    const csvText = await response.text();
                    return parseCSV(csvText);
                }
            } catch (error) {
                console.log(`Failed to load from base URL: ${error}`);
            }
            
            // Try each path in sequence
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load CSV from: ${path}`);
                    const response = await fetch(path);
                    if (response.ok) {
                        console.log(`Successfully loaded CSV from: ${path}`);
                        const csvText = await response.text();
                        return parseCSV(csvText);
                    }
                } catch (error) {
                    console.log(`Failed to load from ${path}: ${error}`);
                }
            }
            
            console.warn("All path attempts failed to load CSV, using fallback data");
            return useFallbackData();
        } else if (fs && path) {
            // Node.js environment, use fs
            console.log("Node.js environment detected, trying fs.readFileSync...");
            
            const appRoot = process.env.APP_ROOT || process.cwd();
            console.log(`APP_ROOT is: ${appRoot}`);
            
            // Try various paths
            const nodePaths = [
                path.join(appRoot, 'public', 'dataset_filled.csv'),
                path.join(appRoot, 'dist', 'dataset_filled.csv'),
                path.join(appRoot, 'src', 'dataset', 'dataset_filled.csv'),
                path.join(appRoot, 'dataset_filled.csv')
            ];
            
            for (const filePath of nodePaths) {
                if (fs.existsSync(filePath)) {
                    console.log(`Found dataset at: ${filePath}`);
                    const csvData = fs.readFileSync(filePath, "utf8");
                    const songs = parseCSV(csvData);
                    console.log(`Successfully loaded ${songs.length} songs from: ${filePath}`);
                    return songs;
                }
            }
            
            console.warn("No dataset file found in Node.js environment");
            return useFallbackData();
        }
        
        console.warn("Couldn't determine environment, using fallback data");
        return useFallbackData();
    } catch (error) {
        console.error("Error in loadSongData:", error);
        return useFallbackData(); 
    }
};

/**
 * Create a sample dataset with enough songs as a fallback
 */
export const useFallbackData = (): SongProperties[] => {
    console.warn("Using fallback sample data");
    return [
        {
            title: "Sample Song 1",
            id: "sample1",
            trackUrl: "https://example.com/track1.mp3",
            imgUrl: "https://example.com/image1.jpg",
            artists: "Sample Artist",
            danceability: 0.65,
            energy: 0.73,
            valence: 0.52,
            tempo: 128,
            loudness: -6.5,
            duration: 180
        },
        {
            title: "Sample Song 2",
            id: "sample2",
            trackUrl: "https://example.com/track2.mp3",
            imgUrl: "https://example.com/image2.jpg",
            artists: "Another Artist",
            danceability: 0.75,
            energy: 0.68,
            valence: 0.42,
            tempo: 120,
            loudness: -7.2,
            duration: 210
        },
        {
            title: "Sample Song 3",
            id: "sample3",
            trackUrl: "https://example.com/track3.mp3",
            imgUrl: "https://example.com/image3.jpg",
            artists: "Third Artist",
            danceability: 0.55,
            energy: 0.85,
            valence: 0.62,
            tempo: 130,
            loudness: -5.5,
            duration: 195
        }
    ];
};

/**
 * Alternative loader method (just returns fallback data now)
 */
export async function loadStaticSongData(): Promise<SongProperties[]> {
    return useFallbackData();
}
