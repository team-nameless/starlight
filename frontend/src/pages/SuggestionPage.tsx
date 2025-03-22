import Fuse from "fuse.js";
import { useCallback, useEffect, useRef, useState } from "react";

import "../assets/stylesheets/SuggestionPage.css";
import EmotivConnectButton from "../components/EmotivConnectButton";
import SpotifyPlayer from "../components/SpotifyPlayer";
import StartCortexButton from "../components/StartCortexButton";
import SuggestionHeaderBar from "../components/SuggestionHeaderBar";
import { loadSongData } from "../recsystem/csvLoader";
import type { MetricData, SongProperties } from "../recsystem/met";
import { SongRecommendationModel } from "../recsystem/modellogic";
import { idealRanges, sampleData } from "../recsystem/sampledata";
import SpotifyService from "../services/SpotifyService";
import { isCortexServerRunning } from "../utils/CortexServerUtils";

function SuggestionPage() {
    // State for song data and playback
    const [currentSong, setCurrentSong] = useState<SongProperties | null>(null);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
    const [songs, setSongs] = useState<SongProperties[]>([]);
    const [recommendedSongIds, setRecommendedSongIds] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);

    // State for Spotify integration
    const [spotifyError, setSpotifyError] = useState<string | null>(null);

    // State for UI interaction
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSongs, setFilteredSongs] = useState<SongProperties[]>([]);
    const [selectedMood, setSelectedMood] = useState("");
    const [moodDropdownOpen, setMoodDropdownOpen] = useState(false);

    // State for metrics data
    const [emaMetrics, setEmaMetrics] = useState<number[]>([0.5, 0.5, 0.5, 0.5, 0.5, 0.4]);
    const [idealSongProps, setIdealSongProps] = useState<number[]>([0.5, 0.5, 0.5, 120, -10]);
    const [metricsData, setMetricsData] = useState<MetricData[][]>([]);

    // State for cortex server connection
    const [isCortexConnected, setIsCortexConnected] = useState(false);
    const [isCollectingData, setIsCollectingData] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Not connected");
    const [retryCount, setRetryCount] = useState(0);
    const cortexTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Model for recommendation
    const modelRef = useRef<SongRecommendationModel | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Mood options for filtering based on valence ranges
    const moodOptions = [
        { value: "", label: "-- MOOD --" },
        { value: "0.00-0.15", label: "Deeply Melancholic" },
        { value: "0.16-0.30", label: "Sad & Somber" },
        { value: "0.31-0.45", label: "Melancholic & Emotional" },
        { value: "0.46-0.60", label: "Neutral & Chill" },
        { value: "0.61-0.75", label: "Uplifting & Warm" },
        { value: "0.76-0.90", label: "Cheerful & Energetic" },
        { value: "0.91-1.00", label: "Euphoric & Exuberant" }
    ];

    // Initialize recommendation model
    useEffect(() => {
        modelRef.current = new SongRecommendationModel(idealRanges);

        return () => {
            // Clean up any existing connection when component unmounts
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }

            // Clear any pending timeouts
            if (cortexTimeoutRef.current) {
                clearTimeout(cortexTimeoutRef.current);
                cortexTimeoutRef.current = null;
            }
        };
    }, []);

    // Load songs from CSV
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Loading song data from CSV...");
                const result = await loadSongData();
                console.log("CSV data loaded successfully:", result.length, "songs");
                setSongs(result);

                if (result.length > 0) {
                    setCurrentSong(result[0]);
                    setCurrentSongIndex(0);
                    setFilteredSongs(result);
                }

                // No initial sample data processing
            } catch (error) {
                console.error("Failed to load CSV data:", error);
                setSongs([]);
            }
        };

        fetchData();
    }, []);

    // Initialize Spotify when component mounts
    useEffect(() => {
        const tokenData = localStorage.getItem("spotify_token");
        if (tokenData) {
            try {
                const data = JSON.parse(tokenData);
                if (data.expiry > Date.now()) {
                    // Just set the player state change handler, remove isSpotifyReady
                    SpotifyService.onPlayerStateChange((state) => {
                        setIsPlaying(state && !state.paused);
                    });
                }
            } catch (error) {
                console.error("Error parsing stored token:", error);
            }
        }
    }, []);

    // Process metrics data to get recommendations
    const processMetrics = async (metrics: MetricData[][]): Promise<void> => {
        if (!modelRef.current || songs.length === 0) {
            throw new Error("Model or songs not loaded");
        }

        setConnectionStatus(`Processing ${metrics.length} data points`);

        try {
            // Step 1: Compute EMA
            const ema = modelRef.current.calculateEWMA(metrics);
            setEmaMetrics(ema);

            // Step 2: Compute Target Mental State
            const target = modelRef.current.calculateTargetMentalState();

            // Step 3: Compute Weight Matrix
            const deltaT = target.map((t, i) => t - ema[i]);
            const weightMatrix = modelRef.current.computeWeightMatrix(deltaT, songs[0]);

            // Step 4: Compute Ideal Song Properties
            const idealProps = modelRef.current.computeIdealSongProps(weightMatrix, deltaT, ema);
            setIdealSongProps(idealProps);

            // Step 5: Find Best Matching Songs
            const { sortedSongIds } = modelRef.current.findBestMatchingSong(idealProps, songs);
            setRecommendedSongIds(sortedSongIds);

            // Update filtered songs to show recommended ones first
            const recommendedSongs = sortedSongIds
                .map((id) => songs.find((song) => song.id === id))
                .filter((song) => !!song) as SongProperties[];

            const otherSongs = songs.filter((song) => !sortedSongIds.includes(song.id));

            // Explicitly update the filtered songs list with new order
            setFilteredSongs([...recommendedSongs, ...otherSongs]);

            setConnectionStatus(`Analysis complete - recommended ${sortedSongIds.length} songs`);

            // Return a resolved promise (function is now async)
            return Promise.resolve();
        } catch (error) {
            setConnectionStatus("Error processing data");
            return Promise.reject(error);
        }
    };

    // Optimized function to connect to Cortex server and start collecting data
    const startCortexDataCollection = useCallback(async () => {
        // Clear previous metrics data
        setMetricsData([]);
        setConnectionStatus("Connecting to Cortex server...");

        // First, check if the server is even running
        const serverRunning = await isCortexServerRunning();
        if (!serverRunning) {
            setConnectionStatus("Cortex server not running - using sample data");
            processMetrics(sampleData);
            return;
        }

        // Return early if already connected and collecting
        if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN &&
            isCollectingData
        ) {
            return;
        }

        // If connected but not collecting, start collection
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            // Pass current track duration to the server
            const message: any = { op: "start" };
            if (currentSong?.duration) {
                message.duration = currentSong.duration;
            }

            socketRef.current.send(JSON.stringify(message));
            setIsCollectingData(true);
            setConnectionStatus("Collecting data");
            return;
        }

        // Create new WebSocket connection
        try {
            const ws = new WebSocket("ws://localhost:8686");
            socketRef.current = ws;

            // Add connection timeout
            const connectionTimeout = setTimeout(() => {
                if (ws.readyState !== WebSocket.OPEN) {
                    setConnectionStatus("Connection timeout - Cortex server may not be running");
                    processMetrics(sampleData);
                }
            }, 5000);

            ws.onopen = () => {
                clearTimeout(connectionTimeout);
                setIsCortexConnected(true);
                setConnectionStatus("Connected to server");
                setRetryCount(0);

                // Start data collection with current track duration
                const message: any = { op: "start" };
                if (currentSong?.duration) {
                    message.duration = currentSong.duration;
                }

                ws.send(JSON.stringify(message));
                setIsCollectingData(true);
                setConnectionStatus("Collecting data");
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    if (message.op === "status") {
                        setConnectionStatus(message.message);
                    } else if (message.op === "data" && Array.isArray(message.metrics)) {
                        setMetricsData((prev) => [...prev, message.metrics]);
                    } else if (message.op === "end" && message.allData) {
                        setConnectionStatus("Processing data");
                        processMetrics(message.allData)
                            .then(() => {
                                setConnectionStatus("Analysis complete");
                                setIsCollectingData(false);
                                setIsCortexConnected(false);
                            })
                            .catch(() => {
                                setConnectionStatus("Error in analysis");
                            });
                    } else if (message.op === "error") {
                        setConnectionStatus(`Server error: ${message.error}`);
                        processMetrics(sampleData);
                    }
                } catch (error) {
                    // Silent catch to avoid console spam
                }
            };

            ws.onerror = () => {
                clearTimeout(connectionTimeout);
                setIsCortexConnected(false);
                setIsCollectingData(false);
                setConnectionStatus("Connection error - using sample data");

                // Try once to reconnect
                if (retryCount < 1) {
                    setRetryCount((prev) => prev + 1);
                    setConnectionStatus("Connection failed. Retrying...");
                    setTimeout(startCortexDataCollection, 2000);
                } else {
                    // Use sample data if reconnection fails
                    processMetrics(sampleData);
                }
            };

            ws.onclose = () => {
                setIsCortexConnected(false);
                setIsCollectingData(false);
                setConnectionStatus("Disconnected");

                // Process any collected data if connection closes
                if (metricsData.length > 0 && !recommendedSongIds.length) {
                    processMetrics(metricsData);
                }
            };
        } catch (error) {
            setConnectionStatus("Failed to create connection - using sample data");
            processMetrics(sampleData);
        }
    }, [isCollectingData, metricsData, retryCount, currentSong, recommendedSongIds.length]);

    // Function to stop data collection and process results
    const stopCortexDataCollection = useCallback(() => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            // Process any collected data even without active connection
            if (metricsData.length > 0) {
                processMetrics(metricsData);
            }
            return;
        }

        setConnectionStatus("Stopping data collection");

        // Send stop command to server
        socketRef.current.send(JSON.stringify({ op: "stop" }));

        // Fallback if server doesn't respond
        setTimeout(() => {
            if (isCollectingData && metricsData.length > 0) {
                setIsCollectingData(false);
                processMetrics(metricsData);
            }
        }, 3000);
    }, [metricsData, isCollectingData]);

    // Function for handling playback start
    const handlePlaybackStart = useCallback(() => {
        setIsPlaying(true);

        // Start collecting data from Cortex server
        startCortexDataCollection();

        // Set a timeout to stop data collection based on song duration
        if (currentSong && currentSong.duration) {
            // Clear any existing timeout
            if (cortexTimeoutRef.current) {
                clearTimeout(cortexTimeoutRef.current);
            }

            // Convert duration from seconds to milliseconds and add a small buffer
            const durationMs = Math.min(currentSong.duration * 1000, 600000); // Max 10 minutes

            setConnectionStatus(`Will collect for ${Math.round(durationMs / 1000)}s`);

            cortexTimeoutRef.current = setTimeout(() => {
                stopCortexDataCollection();
            }, durationMs);
        }
    }, [currentSong, startCortexDataCollection, stopCortexDataCollection]);

    // Function for handling playback stop/pause
    const handlePlaybackStop = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // Function to update UI when track plays/pauses
    const handlePlaybackChange = useCallback(
        (isPlaying: boolean) => {
            if (isPlaying) {
                handlePlaybackStart();
            } else {
                setIsPlaying(false);
            }
        },
        [handlePlaybackStart, handlePlaybackStop]
    );

    // Function to handle playback errors
    const handlePlaybackError = useCallback(
        (message: string) => {
            setSpotifyError(message);

            // Stop playing and data collection on error
            setIsPlaying(false);
            stopCortexDataCollection();

            // Clear error after 5 seconds
            setTimeout(() => {
                setSpotifyError(null);
            }, 5000);

            // If the error suggests we need Spotify authentication
            if (
                message.includes("No preview available") ||
                message.includes("Could not play audio")
            ) {
                if (!SpotifyService.isAuthenticated()) {
                }
            }
        },
        [stopCortexDataCollection]
    );

    // Handle clicking on a song in the list
    const handleSongItemClick = (index: number) => {
        // Stop current audio and data collection
        if (isPlaying) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }

            // Stop current data collection if switching songs
            stopCortexDataCollection();

            // Clear any existing timeout
            if (cortexTimeoutRef.current) {
                clearTimeout(cortexTimeoutRef.current);
                cortexTimeoutRef.current = null;
            }

            setIsPlaying(false);
        }

        setCurrentSongIndex(index);
        setCurrentSong(filteredSongs[index]);
    };

    // Utility functions needed by the component
    const handleMoodSelect = (value: string, _label: string) => {
        setSelectedMood(value);
        setMoodDropdownOpen(false);
    };

    const getDifficultyColor = (difficulty: number) => {
        const hue = Math.max(0, 120 - difficulty * 12);
        return `hsl(${hue}, 70%, 50%)`;
    };

    // Add cleanup for audio element and WebSocket
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }

            if (socketRef.current) {
                socketRef.current.close();
            }

            if (cortexTimeoutRef.current) {
                clearTimeout(cortexTimeoutRef.current);
            }
        };
    }, []);

    // Ensure audio element exists for playing audio if needed
    useEffect(() => {
        // Create a hidden audio element in the DOM for playback
        if (!document.getElementById("spotify-audio-player")) {
            const audioElement = document.createElement("audio");
            audioElement.id = "spotify-audio-player";
            audioElement.style.display = "none"; // Keep it hidden
            audioElement.setAttribute("playsinline", "true"); // For iOS Safari
            audioElement.setAttribute("webkit-playsinline", "true");
            audioElement.preload = "auto";

            // Provide a valid default src to avoid MEDIA_ELEMENT_ERROR
            audioElement.src =
                "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

            document.body.appendChild(audioElement);
        }
        return () => {};
    }, []);

    // Filter songs based on search query, filters, and recommendations
    useEffect(() => {
        if (songs.length === 0) return;

        let filtered = [...songs];

        // Apply mood filter if selected
        if (selectedMood) {
            const [minValence, maxValence] = selectedMood.split("-").map(Number);
            filtered = filtered.filter(
                (song) => song.valence >= minValence && song.valence <= maxValence
            );
        }

        // Apply search
        if (searchQuery.trim()) {
            const fuseOptions = { keys: ["title", "artists"], threshold: 0.3 };
            const fuse = new Fuse(filtered, fuseOptions);
            filtered = fuse.search(searchQuery).map((result) => result.item);
        }

        // Always prioritize recommended songs at the top if we have recommendations
        if (recommendedSongIds.length > 0) {
            // Use a more explicit approach to ensure proper ordering
            // First get all the recommended songs that match filters
            const recommendedSongs: SongProperties[] = [];

            // Preserve the exact order from recommendedSongIds
            for (const id of recommendedSongIds) {
                const song = filtered.find((s) => s.id === id);
                if (song) recommendedSongs.push(song);
            }

            // Then get all other songs
            const otherSongs = filtered.filter((song) => !recommendedSongIds.includes(song.id));

            // Combine them with recommended songs first
            filtered = [...recommendedSongs, ...otherSongs];
        }

        setFilteredSongs(filtered);
    }, [songs, searchQuery, selectedMood, recommendedSongIds]);

    // Handle Cortex server started event
    const handleCortexServerStarted = useCallback(() => {
        // Automatically attempt to connect if music is playing
        if (isPlaying) {
            startCortexDataCollection();
        }
    }, [isPlaying, startCortexDataCollection]);

    // Function to handle Emotiv connection start
    const handleEmotivConnectStart = useCallback(() => {
        setConnectionStatus("Starting Emotiv data collection...");
        // Clear previous metrics data when starting a new collection
        setMetricsData([]);
    }, []);

    // Function to handle when Emotiv data collection completes
    const handleEmotivDataComplete = useCallback(
        (success: boolean) => {
            if (success) {
                setConnectionStatus("Emotiv data collection complete, processing results...");

                // If we have collected metrics data from the WebSocket during the collection period
                if (metricsData.length > 0) {
                    console.log(
                        `Processing ${metricsData.length} collected metrics after collection completed`
                    );
                    processMetrics(metricsData);
                } else {
                    // If no metrics data was collected, use sample data
                    console.log("No metrics data collected, using sample data");
                    processMetrics(sampleData);
                }
            } else {
                setConnectionStatus("Emotiv data collection stopped manually");
            }
        },
        [metricsData, processMetrics]
    );

    return (
        <>
            <SuggestionHeaderBar />

            <div className="songpage">
                <div className="content-layer">
                    <div className="background-image">
                        <img
                            src={currentSong && currentSong.imgUrl ? currentSong.imgUrl : ""}
                            alt="Background"
                        />
                    </div>
                    <div className="left-column">
                        <div className="track-card">
                            <div className="track-card-background">
                                <img src={currentSong?.imgUrl || ""} alt="Song Image" />
                                <div className="overlay-top"></div>
                                <div className="overlay-bottom"></div>
                            </div>
                            <div className="track-card-content">
                                <div className="track-info">
                                    <h1>{currentSong?.title}</h1>
                                    <p>{currentSong?.artists}</p>
                                    <p>ID: {currentSong?.id}</p>
                                </div>
                                <div className="performance-info">
                                    <div className="performance-column">
                                        <p className="tier-label">Match</p>
                                        <p className="grade-card">
                                            {recommendedSongIds.includes(currentSong?.id || "")
                                                ? "A"
                                                : "C"}
                                        </p>
                                    </div>
                                    <div className="performance-column">
                                        <p>Danceability: {currentSong?.danceability.toFixed(2)}</p>
                                        <p>Energy: {currentSong?.energy.toFixed(2)}</p>
                                        <p>Valence: {currentSong?.valence.toFixed(2)}</p>
                                    </div>
                                    <div className="performance-column">
                                        <p>Tempo: {currentSong?.tempo.toFixed(0)}</p>
                                        <p>Loudness: {currentSong?.loudness.toFixed(2)}</p>
                                        <p>Duration: {Math.floor(currentSong?.duration || 0)}s</p>
                                    </div>
                                </div>

                                {currentSong && currentSong.trackUrl && (
                                    <SpotifyPlayer
                                        trackUrl={currentSong.trackUrl}
                                        onPlaybackChange={handlePlaybackChange}
                                        onError={handlePlaybackError}
                                        duration={currentSong.duration}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="score-panel">
                            <h2 className="score-panel-header">Current Mental State</h2>

                            <div className="stats-grid">
                                <div>
                                    <span>FOCUS</span>
                                    <strong>{(emaMetrics[0] * 100).toFixed(2)}%</strong>
                                </div>
                                <div>
                                    <span>ENGAGEMENT</span>
                                    <strong>{(emaMetrics[1] * 100).toFixed(2)}%</strong>
                                </div>
                                <div>
                                    <span>EXCITEMENT</span>
                                    <strong>{(emaMetrics[2] * 100).toFixed(2)}%</strong>
                                </div>
                                <div>
                                    <span>INTEREST</span>
                                    <strong>{(emaMetrics[3] * 100).toFixed(2)}%</strong>
                                </div>
                                <div>
                                    <span>RELAXATION</span>
                                    <strong>{(emaMetrics[4] * 100).toFixed(2)}%</strong>
                                </div>
                                <div>
                                    <span>STRESS</span>
                                    <strong>{(emaMetrics[5] * 100).toFixed(2)}%</strong>
                                </div>
                            </div>

                            <div className="grade-grid">
                                <div className="critical-perfect">
                                    <span>IDEAL DANCE</span>
                                    <strong>{idealSongProps[0].toFixed(2)}</strong>
                                </div>
                                <div className="perfect">
                                    <span>IDEAL ENERGY</span>
                                    <strong>{idealSongProps[1].toFixed(2)}</strong>
                                </div>
                                <div className="good">
                                    <span>IDEAL VALENCE</span>
                                    <strong>{idealSongProps[2].toFixed(2)}</strong>
                                </div>
                                <div className="bad">
                                    <span>IDEAL TEMPO</span>
                                    <strong>{idealSongProps[3].toFixed(1)}</strong>
                                </div>
                                <div className="miss">
                                    <span>IDEAL LOUD</span>
                                    <strong>{idealSongProps[4].toFixed(1)}</strong>
                                </div>
                            </div>

                            <div className="played-date">
                                {isCollectingData
                                    ? `${connectionStatus}: ${metricsData.length} points collected...`
                                    : isCortexConnected
                                      ? `Connected to Cortex server: ${connectionStatus}`
                                      : recommendedSongIds.length > 0
                                        ? `${recommendedSongIds.length} songs recommended based on your mental state`
                                        : "Use Emotiv Connect to start mental state analysis"}
                            </div>

                            {/* Move the Cortex status below the score panel */}
                            <StartCortexButton onServerStarted={handleCortexServerStarted} />

                            {/* Add the Emotiv Connect button */}
                            <EmotivConnectButton
                                trackDuration={currentSong?.duration}
                                onConnectStart={handleEmotivConnectStart}
                                onDataCollectionComplete={handleEmotivDataComplete}
                                disabled={!isCortexConnected && !isCortexServerRunning}
                            />
                        </div>
                    </div>

                    <div className="suggestion-container">
                        <div className="search-filter-container">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="-- SEARCH ME --"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <i className="search-icon">🔍</i>
                            </div>
                            <div className="filter-selects">
                                <div className="dropdown-container" style={{ width: "100%" }}>
                                    <button
                                        className="dropdown-button mood-dropdown-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMoodDropdownOpen(!moodDropdownOpen);
                                        }}
                                    >
                                        {selectedMood
                                            ? moodOptions.find((o) => o.value === selectedMood)
                                                  ?.label || "-- MOOD --"
                                            : "-- MOOD --"}
                                        <span className="dropdown-arrow">▼</span>
                                    </button>
                                    {moodDropdownOpen && (
                                        <div className="dropdown-menu mood-dropdown">
                                            {moodOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        handleMoodSelect(option.value, option.label)
                                                    }
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="track-list-container">
                            <div className="track-list-header">
                                <h2>NEXT TRACK</h2>
                                <div className="track-header-details">
                                    <span className="header-genre">Danceability</span>
                                    <span className="header-melody">Energy</span>
                                    <span className="header-difficulty">Valence</span>
                                    <span className="header-metric">Tempo</span>
                                </div>
                            </div>

                            <div className="track-list">
                                {filteredSongs && filteredSongs.length > 0 ? (
                                    filteredSongs.map((song, index) => (
                                        <div
                                            key={index}
                                            className={`track-list-item ${
                                                currentSongIndex === index ? "active" : ""
                                            } ${recommendedSongIds.includes(song.id) ? "recommended" : ""}`}
                                            onClick={() => handleSongItemClick(index)}
                                        >
                                            <div className="track-thumbnail">
                                                <img src={song.imgUrl} alt={song.title} />
                                                {recommendedSongIds.includes(song.id) && (
                                                    <div className="recommendation-badge">🧠</div>
                                                )}
                                            </div>
                                            <div className="track-info">
                                                <div className="track-title">
                                                    {song.title || `Song ${index + 1}`}
                                                </div>
                                                <div className="track-artist">
                                                    {song.artists || "Artist name"}
                                                </div>
                                            </div>
                                            <div className="track-details">
                                                <div className="track-genre">
                                                    {song.danceability.toFixed(2)}
                                                </div>
                                                <div className="track-melody">
                                                    {song.energy.toFixed(2)}
                                                </div>
                                                <div
                                                    className="track-difficulty"
                                                    style={{
                                                        color: getDifficultyColor(song.valence * 10)
                                                    }}
                                                >
                                                    {song.valence.toFixed(2)}
                                                </div>
                                                <div className="track-metric">
                                                    {song.tempo.toFixed(0)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-songs">
                                        No songs found matching your criteria
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Spotify error message if present */}
            {spotifyError && (
                <div className="spotify-error-message">
                    <p>{spotifyError}</p>
                    <div className="spotify-error-actions">
                        <button onClick={() => setSpotifyError(null)}>Dismiss</button>
                        {!SpotifyService.isAuthenticated() && (
                            <button
                                className="spotify-retry-button"
                                onClick={() => SpotifyService.authenticate()}
                            >
                                Connect to Spotify
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Add Spotify connection indicator */}
            {!SpotifyService.isAuthenticated() && (
                <div className="spotify-connect-button">
                    <p>Listen to complete songs with your Spotify Premium account</p>
                    <button
                        onClick={() => {
                            SpotifyService.authenticate();
                        }}
                    >
                        Connect to Spotify
                    </button>
                    <p className="note">Don't have Premium? App will use audio previews</p>
                </div>
            )}
        </>
    );
}

export default SuggestionPage;
