import Fuse from "fuse.js";
import { useCallback, useEffect, useState, useRef } from "react";
//import "../assets/stylesheets/MainPages.css";
import "../assets/stylesheets/SuggestionPage.css";
// Import the specialized header instead of the regular one
import SuggestionHeaderBar from "../components/SuggestionHeaderBar";
import type { MetricData, SongProperties } from "../recsystem/met";
import { loadSongData } from "../recsystem/csvLoader";
import { SongRecommendationModel } from "../recsystem/modellogic";
import { idealRanges, sampleData } from "../recsystem/sampledata";
import SpotifyService from "../services/SpotifyService";
import SpotifyPlayer from "../components/SpotifyPlayer";

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
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedMood, setSelectedMood] = useState("");
    const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
    const [moodDropdownOpen, setMoodDropdownOpen] = useState(false);
    
    // State for metrics data
    const [emaMetrics, setEmaMetrics] = useState<number[]>([0.5, 0.5, 0.5, 0.5, 0.5, 0.4]);
    const [idealSongProps, setIdealSongProps] = useState<number[]>([0.5, 0.5, 0.5, 120, -10]);
    const [metricsData, setMetricsData] = useState<MetricData[][]>([]);
    
    // Model for recommendation
    const modelRef = useRef<SongRecommendationModel | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Genre and mood options for filtering
    const genreOptions = [
        { value: "", label: "-- GENRE --" },
        { value: "Electrical Dance", label: "Electrical Dance" },
        { value: "Pop", label: "Pop" },
        { value: "Rock", label: "Rock" },
        { value: "Hip Hop", label: "Hip Hop" },
        { value: "Jazz", label: "Jazz" }
    ];

    const moodOptions = [
        { value: "", label: "-- MOOD --" },
        { value: "Relaxation", label: "Relaxation" },
        { value: "Focus", label: "Focus" },
        { value: "Excitement", label: "Excitement" },
        { value: "Engagement", label: "Engagement" },
        { value: "Interest", label: "Interest" }
    ];

    // Initialize recommendation model and websocket connection
    useEffect(() => {
        modelRef.current = new SongRecommendationModel(idealRanges);
        
        // Connect to Emotiv server
        const ws = new WebSocket("ws://localhost:8686");
        socketRef.current = ws;
        
        ws.onopen = () => {
            console.log("Connected to Emotiv server");
            ws.send(JSON.stringify({ op: "start" }));
        };
        
        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                
                if (message.op === "data" && Array.isArray(message.metrics)) {
                    setMetricsData(prev => [...prev, message.metrics]);
                } else if (message.op === "end" && message.allData) {
                    processMetrics(message.allData);
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        };
        
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            // Use sample data if connection fails
            processMetrics(sampleData);
        };
        
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
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
                
                // Process sample data for initial recommendations
                if (modelRef.current) {
                    processMetrics(sampleData);
                }
            } catch (error) {
                console.error("Failed to load CSV data:", error);
                setSongs([]);
            }
        };
        
        fetchData();
    }, []);

    // Initialize Spotify when component mounts
    useEffect(() => {
        const tokenData = localStorage.getItem('spotify_token');
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
                console.error('Error parsing stored token:', error);
            }
        }
    }, []);

    // Process metrics data to get recommendations
    const processMetrics = async (metrics: MetricData[][]) => {
        if (!modelRef.current || songs.length === 0) return;
        
        console.log(`Processing ${metrics.length} metric data points`);
        
        try {
            // Step 1: Compute EMA
            const ema = modelRef.current.calculateEWMA(metrics);
            setEmaMetrics(ema);
            console.log("EMA Values:", ema);
            
            // Step 2: Compute Target Mental State
            const target = modelRef.current.calculateTargetMentalState();
            console.log("Target State:", target);
            
            // Step 3: Compute Weight Matrix
            const deltaT = target.map((t, i) => t - ema[i]);
            const weightMatrix = modelRef.current.computeWeightMatrix(deltaT, songs[0]);
            
            // Step 4: Compute Ideal Song Properties
            const idealProps = modelRef.current.computeIdealSongProps(weightMatrix, deltaT, ema);
            setIdealSongProps(idealProps);
            console.log("Ideal Song Properties:", idealProps);
            
            // Step 5: Find Best Matching Songs
            const { sortedSongIds } = modelRef.current.findBestMatchingSong(idealProps, songs);
            setRecommendedSongIds(sortedSongIds);
            
            // Update filtered songs to show recommended ones first
            const recommendedSongs = sortedSongIds
                .map(id => songs.find(song => song.id === id))
                .filter(song => !!song) as SongProperties[];
                
            const otherSongs = songs.filter(song => !sortedSongIds.includes(song.id));
            setFilteredSongs([...recommendedSongs, ...otherSongs]);
            
            // Set the first recommended song as current
            if (recommendedSongs.length > 0) {
                setCurrentSong(recommendedSongs[0]);
                setCurrentSongIndex(0);
            }
        } catch (error) {
            console.error("Error processing metrics:", error);
        }
    };

    // Filter songs based on search query and filters
    useEffect(() => {
        if (songs.length === 0) return;
        
        let filtered = [...songs];
        
        // Apply filters if selected
        if (selectedGenre) {
            // This is a mock filter since our data doesn't have genre
            filtered = filtered.filter(() => 
                Math.random() > 0.5); // Mock filter based on selected genre
        }
        
        if (selectedMood) {
            // Another mock filter
            filtered = filtered.filter(() => 
                Math.random() > 0.5); // Mock filter based on selected mood
        }
        
        // Apply search
        if (searchQuery.trim()) {
            const fuseOptions = { keys: ["title", "artists"], threshold: 0.3 };
            const fuse = new Fuse(filtered, fuseOptions);
            filtered = fuse.search(searchQuery).map(result => result.item);
        }
        
        // Always prioritize recommended songs at the top if we have recommendations
        if (recommendedSongIds.length > 0) {
            const recommendedSongs = recommendedSongIds
                .map(id => filtered.find(song => song.id === id))
                .filter(song => !!song) as SongProperties[];
                
            const otherSongs = filtered.filter(song => !recommendedSongIds.includes(song.id));
            filtered = [...recommendedSongs, ...otherSongs];
        }
        
        setFilteredSongs(filtered);
    }, [songs, searchQuery, selectedGenre, selectedMood, recommendedSongIds]);

    // Handle clicking on a song in the list
    const handleSongItemClick = (index: number) => {
        setCurrentSongIndex(index);
        setCurrentSong(filteredSongs[index]);
        // Stop current audio if playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            setIsPlaying(false);
        }
    };

    // Function to update UI when track plays/pauses
    const handlePlaybackChange = useCallback((isPlaying: boolean) => {
        console.log('Playback state changed:', isPlaying);
        setIsPlaying(isPlaying);
    }, []);
    
    // Function to handle playback errors
    const handlePlaybackError = useCallback((message: string) => {
        console.error('Playback error:', message);
        setSpotifyError(message);
        
        // Clear error after 5 seconds
        setTimeout(() => {
            setSpotifyError(null);
        }, 5000);
        
        // If the error suggests we need Spotify authentication
        if (
            message.includes('No preview available') || 
            message.includes('Could not play audio')
        ) {
            if (!SpotifyService.isAuthenticated()) {
                // Show authenticate button in error message
                // (Button is already in the error display)
            }
        }
    }, []);

    // Utility functions needed by the component
    const handleGenreSelect = (value: string, _label: string) => {
        setSelectedGenre(value);
        setGenreDropdownOpen(false);
    };

    const handleMoodSelect = (value: string, _label: string) => {
        setSelectedMood(value);
        setMoodDropdownOpen(false);
    };

    const getDifficultyColor = (difficulty: number) => {
        const hue = Math.max(0, 120 - difficulty * 12);
        return `hsl(${hue}, 70%, 50%)`;
    };

    // Calculate mental state description based on EMA values
    const getMentalStateDescription = () => {
        const [focus, engagement, excitement, interest, relaxation, stress] = emaMetrics;
        
        if (relaxation > 0.7) return "Deep Relax";
        if (focus > 0.7) return "Highly Focused";
        if (excitement > 0.7) return "Excited";
        if (engagement > 0.7) return "Engaged";
        if (interest > 0.7) return "Interested";
        if (stress > 0.7) return "Stressed";
        
        return "Balanced";
    };

    // Add cleanup for audio element
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Ensure audio element exists for playing audio if needed
    useEffect(() => {
        // Create a hidden audio element in the DOM for playback
        if (!document.getElementById('spotify-audio-player')) {
            const audioElement = document.createElement('audio');
            audioElement.id = 'spotify-audio-player';
            audioElement.style.display = 'none'; // Keep it hidden
            audioElement.setAttribute('playsinline', 'true'); // For iOS Safari
            audioElement.setAttribute('webkit-playsinline', 'true');
            audioElement.preload = 'auto';
            
            // Provide a valid default src to avoid MEDIA_ELEMENT_ERROR
            audioElement.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            
            document.body.appendChild(audioElement);
            console.log('Added audio element to DOM');
        }
        return () => {
        };
    }, []);

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
                                            {recommendedSongIds.includes(currentSong?.id || "") ? "A" : "C"}
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
                                        duration={currentSong.duration} // This should be in seconds from your CSV
                                    />
                                )}
                            </div>
                        </div>
                    
                        <div className="score-panel">
                            <h2 className="score-panel-header">Current Mental State</h2>

                            <div className="score-rank">{getMentalStateDescription()}</div>
                            <div className="score-value">
                                <span>★</span> Emotiv EEG Analysis <span>★</span>
                            </div>

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
                                    <span>MENTAL TENDENCY</span>
                                    <strong className="mental-tendency">{getMentalStateDescription()}</strong>
                                </div>
                                <div className="suggestion-rate-container">
                                    <span>EXCITEMENT</span>
                                    <strong>{(emaMetrics[2] * 100).toFixed(2)}%</strong>

                                    <div className="stats-indicators">
                                        <div>Focus: {(emaMetrics[0] * 10).toFixed(2)}</div>
                                        <div>Engagement: {(emaMetrics[1] * 10).toFixed(2)}</div>
                                        <div>Excitement: {(emaMetrics[2] * 10).toFixed(2)}</div>
                                        <div>Interest: {(emaMetrics[3] * 10).toFixed(2)}</div>
                                        <div>Relaxation: {(emaMetrics[4] * 10).toFixed(2)}</div>
                                        <div>Stress: {(emaMetrics[5] * 10).toFixed(2)}</div>
                                    </div>
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
                                {recommendedSongIds.length > 0 
                                    ? `${recommendedSongIds.length} songs recommended based on your mental state` 
                                    : 'Waiting for EEG data to make recommendations...'}
                            </div>
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
                                <div className="dropdown-container">
                                    <button
                                        className="dropdown-button genre-dropdown-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGenreDropdownOpen(!genreDropdownOpen);
                                            setMoodDropdownOpen(false);
                                        }}
                                    >
                                        {selectedGenre || "-- GENRE --"}
                                        <span className="dropdown-arrow">▼</span>
                                    </button>
                                    {genreDropdownOpen && (
                                        <div className="dropdown-menu genre-dropdown">
                                            {genreOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        handleGenreSelect(
                                                            option.value,
                                                            option.label
                                                        )
                                                    }
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="dropdown-container">
                                    <button
                                        className="dropdown-button mood-dropdown-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMoodDropdownOpen(!moodDropdownOpen);
                                            setGenreDropdownOpen(false);
                                        }}
                                    >
                                        {selectedMood || "-- MOOD --"}
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
                                                {recommendedSongIds.includes(song.id) && 
                                                    <div className="recommendation-badge">🧠</div>
                                                }
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
                                                    style={{ color: getDifficultyColor(song.valence * 10) }}
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
                    <button onClick={() => {
                        console.log('Connecting to Spotify...');
                        SpotifyService.authenticate();
                    }}>
                        Connect to Spotify
                    </button>
                    <p className="note">Don't have Premium? App will use audio previews</p>
                </div>
            )}
        </>
    );
}

export default SuggestionPage;
