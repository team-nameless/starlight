import axios from "axios";
import Fuse from "fuse.js";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "../assets/stylesheets/MainPages.css";
import "../assets/stylesheets/SuggestionPage.css";
import { apiHost } from "../common/site_setting";
//import AudioPlayer from "../components/AudioPlayer";
import HeaderBar from "../components/HeaderBar";
import PlayButton from "../components/PlayButton";
import { ScoreRecord, StarlightSong } from "../index";

function SuggestionPage() {
    const location = useLocation();
    const currentSongFromLocation = location.state?.currentSong || null;
    const currentSongIndexFromLocation = location.state?.currentSongIndex || 0;
    const [currentSong, setCurrentSong] = useState(currentSongFromLocation);
    const [currentSongIndex, setCurrentSongIndex] = useState(currentSongIndexFromLocation);
    const [songs, setSongs] = useState<StarlightSong[]>([]);
    const [bestScore, setBestScore] = useState<number | string | null>(null);
    const [record, setRecord] = useState<ScoreRecord>({
        trackId: 0,
        trackName: "",
        totalPoints: 0,
        accuracy: 0,
        maxCombo: 0,
        critical: 0,
        perfect: 0,
        good: 0,
        bad: 0,
        miss: 0,
        grade: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSongListOpen, setIsSongListOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSongs, setFilteredSongs] = useState<StarlightSong[]>([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedMood, setSelectedMood] = useState("");
    const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
    const [moodDropdownOpen, setMoodDropdownOpen] = useState(false);

    // Genre options
    const genreOptions = [
        { value: "", label: "-- GENRE --" },
        { value: "Electrical Dance", label: "Electrical Dance" },
        { value: "Pop", label: "Pop" },
        { value: "Rock", label: "Rock" },
        { value: "Hip Hop", label: "Hip Hop" },
        { value: "Jazz", label: "Jazz" }
    ];

    // Mood options
    const moodOptions = [
        { value: "", label: "-- MOOD --" },
        { value: "Relaxation", label: "Relaxation" },
        { value: "Focus", label: "Focus" },
        { value: "Excitement", label: "Excitement" },
        { value: "Engagement", label: "Engagement" },
        { value: "Interest", label: "Interest" }
    ];

    // Update current song from location on navigation
    useEffect(() => {
        if (currentSongFromLocation) {
            setCurrentSong(currentSongFromLocation);
            setCurrentSongIndex(currentSongIndexFromLocation);
        }
    }, [currentSongFromLocation, currentSongIndexFromLocation]);

    // Fetch all songs only once on initial load
    useEffect(() => {
        if (isInitialLoad) {
            const fetchData = async () => {
                try {
                    const songsResponse = await axios.get(`${apiHost}/api/track/all`, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    });
                    const fetchedSongs = songsResponse.data;
                    setSongs(fetchedSongs);

                    // Only set current song if not already set from location
                    if (!currentSong && fetchedSongs.length > 0) {
                        setCurrentSongIndex(0);
                        setCurrentSong(fetchedSongs[0]);
                    }
                    setIsInitialLoad(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setIsInitialLoad(false);
                }
            };

            fetchData();
        }
    }, [isInitialLoad, currentSong]);

    useEffect(() => {
        if (currentSongIndex >= songs.length) {
            setCurrentSongIndex(0);
        }
    }, [currentSongIndex, songs.length]);

    // Fetch best score whenever current song changes
    const fetchBestScore = useCallback(async (songId: number) => {
        try {
            const response = await axios.get(`${apiHost}/api/score/${songId}/best`, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (response.status === 200) {
                setBestScore(response.data.totalPoints);
                setRecord(response.data);
            } else if (response.status === 204) {
                setBestScore("No record");
                setRecord({
                    trackId: 0,
                    trackName: "",
                    totalPoints: 0,
                    accuracy: 0,
                    maxCombo: 0,
                    critical: 0,
                    perfect: 0,
                    good: 0,
                    bad: 0,
                    miss: 0,
                    grade: "E"
                });
            }
        } catch (error) {
            console.error("Error fetching best score:", error);
            setBestScore("No record");
            setRecord({
                trackId: 0,
                trackName: "",
                totalPoints: 0,
                accuracy: 0,
                maxCombo: 0,
                critical: 0,
                perfect: 0,
                good: 0,
                bad: 0,
                miss: 0,
                grade: "E"
            });
        }
    }, []);

    // Update score whenever current song changes
    useEffect(() => {
        if (currentSong?.id) {
            fetchBestScore(currentSong.id);
        }
    }, [currentSong, fetchBestScore]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".genre-dropdown") && !target.closest(".genre-dropdown-button")) {
                setGenreDropdownOpen(false);
            }
            if (!target.closest(".mood-dropdown") && !target.closest(".mood-dropdown-button")) {
                setMoodDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Update filtered songs whenever search query or filter selections change
    useEffect(() => {
        if (!songs) return;

        let filtered = [...songs];

        // Apply genre filter if selected
        if (selectedGenre) {
            filtered = filtered.filter(song => song.genre === selectedGenre);
        }

        // Apply mood filter if selected
        if (selectedMood) {
            filtered = filtered.filter(song => song.metric === selectedMood);
        }

        // Apply search query if exists
        if (searchQuery.trim()) {
            const fuseOptions = {
                keys: ["title", "artist"],
                threshold: 0.3
            };
            const fuse = new Fuse(filtered, fuseOptions);
            filtered = fuse.search(searchQuery).map(result => result.item);
        }

        setFilteredSongs(filtered);
    }, [songs, searchQuery, selectedGenre, selectedMood]);

    const handleSongItemClick = (index: number) => {
        setCurrentSongIndex(index);
        setCurrentSong(filteredSongs[index]);
    };

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

    const handleSongClick = useCallback(
        (song: StarlightSong) => () => {
            const index = songs.findIndex(s => s.id === song.id);
            if (index !== -1) {
                // Find the background image - look for both selectors
                const imgElement = document.querySelector(".background-image img");
                if (imgElement && song.backgroundUrl) {
                    imgElement.classList.add("fade-out");

                    imgElement.addEventListener(
                        "transitionend",
                        () => {
                            setCurrentSongIndex(index);
                            setCurrentSong(song);
                            // Update image src directly to ensure it changes
                            (imgElement as HTMLImageElement).src = song.backgroundUrl;
                            imgElement.classList.remove("fade-out");
                        },
                        { once: true }
                    );
                } else {
                    // If no image element is found, just update the state
                    setCurrentSongIndex(index);
                    setCurrentSong(song);
                }
            }
        },
        [songs]
    );

    const toggleSongList = useCallback(() => {
        setIsSongListOpen(!isSongListOpen);
    }, [isSongListOpen]);

    return (
        <>
            <HeaderBar
                currentSong={currentSong}
                currentSongIndex={currentSongIndex}
                setCurrentSong={setCurrentSong}
                setCurrentSongIndex={setCurrentSongIndex}
                songs={songs}
                handleSongClick={handleSongClick}
                toggleSongList={toggleSongList}
                isSongListOpen={isSongListOpen}
            />

            <div className="songpage">
                <div className="content-layer">
                    <div className="background-image">
                        <img
                            src={currentSong && currentSong.backgroundUrl ? `${currentSong.backgroundUrl}` : ""}
                            alt="Background"
                        />
                    </div>

                    <div className="left-column">
                        <div className="track-card">
                            <div className="track-card-background">
                                <img src={currentSong?.backgroundUrl || ""} alt="Song Background" />
                                <div className="overlay-top"></div>
                                <div className="overlay-bottom"></div>
                            </div>

                            <div className="track-card-content">
                                <div className="track-info">
                                    <h1>{currentSong?.title}</h1>
                                    <p>{currentSong?.artist}</p>
                                    <p>ID: {currentSong?.id}</p>
                                </div>

                                <div className="best-score-container">
                                    <div className="best-score-label">Best Score:</div>
                                    <div className="best-score-value">{bestScore}</div>
                                </div>

                                <div className="performance-info">
                                    <div className="performance-column">
                                        <p className="tier-label">Tier</p>
                                        <p className="grade-card">{record.grade}</p>
                                    </div>
                                    <div className="performance-column">
                                        <p>Difficulty: {currentSong?.difficulty}</p>
                                        <p>Rate: {(record.accuracy * 100).toFixed(2)}%</p>
                                        <p>Max Combo: {record.maxCombo}</p>
                                    </div>
                                    <div className="performance-column">
                                        <p>Tempo: {currentSong?.tempo}</p>
                                        <p>Genre: {currentSong?.genre}</p>
                                        <p>Melody: {currentSong?.melody}</p>
                                    </div>
                                </div>

                                {currentSong && songs.length > 0 && (
                                    <PlayButton
                                        currentSongIndex={currentSongIndex}
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading}
                                        songs={songs}
                                        variant="card"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="score-panel">
                            <h2 className="score-panel-header">Latest Play</h2>

                            <div className="score-rank">{record.grade}</div>
                            <div className="score-value">
                                <span>★</span> {record.totalPoints} <span>★</span>
                            </div>

                            <div className="stats-grid">
                                <div>
                                    <span>ACCURACY</span>
                                    <strong>{(record.accuracy * 100).toFixed(2)}%</strong>
                                </div>
                                <div>
                                    <span>MAX COMBO</span>
                                    <strong>{record.maxCombo}</strong>
                                </div>
                                <div>
                                    <span>MENTAL TENDENCY</span>
                                    <strong className="mental-tendency">Deep Relax</strong>
                                </div>
                                <div className="suggestion-rate-container">
                                    <span>SUGGESTION RATE</span>
                                    <strong>0.169</strong>

                                    {/* Tooltip that shows on hover */}
                                    <div className="stats-indicators">
                                        <div>Focus: 4.32</div>
                                        <div>Relaxation: 2.78</div>
                                        <div>Engagement: 0.12</div>
                                        <div>Excitement: 4.32</div>
                                        <div>Stress: 0.12</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grade-grid">
                                <div className="critical-perfect">
                                    <span>CRITICAL PERFECT</span>
                                    <strong>{record.critical}</strong>
                                </div>
                                <div className="perfect">
                                    <span>PERFECT</span>
                                    <strong>{record.perfect}</strong>
                                </div>
                                <div className="good">
                                    <span>GOOD</span>
                                    <strong>{record.good}</strong>
                                </div>
                                <div className="bad">
                                    <span>BAD</span>
                                    <strong>{record.bad}</strong>
                                </div>
                                <div className="miss">
                                    <span>MISS</span>
                                    <strong>{record.miss}</strong>
                                </div>
                            </div>

                            <div className="played-date">Played on 25 February 2025 8:08 AM</div>
                        </div>
                    </div>

                    <div className="suggestion-container">
                        <div className="search-filter-container">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="-- SEARCH ME --"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                <i className="search-icon">🔍</i>
                            </div>
                            <div className="filter-selects">
                                {/* Custom Genre Dropdown */}
                                <div className="dropdown-container">
                                    <button
                                        className="dropdown-button genre-dropdown-button"
                                        onClick={e => {
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
                                            {genreOptions.map(option => (
                                                <div
                                                    key={option.value}
                                                    className="dropdown-item"
                                                    onClick={() => handleGenreSelect(option.value, option.label)}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Custom Mood Dropdown */}
                                <div className="dropdown-container">
                                    <button
                                        className="dropdown-button mood-dropdown-button"
                                        onClick={e => {
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
                                            {moodOptions.map(option => (
                                                <div
                                                    key={option.value}
                                                    className="dropdown-item"
                                                    onClick={() => handleMoodSelect(option.value, option.label)}
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
                                    <span className="header-genre">Genre</span>
                                    <span className="header-melody">Melody Type</span>
                                    <span className="header-difficulty">Difficulty</span>
                                    <span className="header-metric">Metric</span>
                                </div>
                            </div>

                            <div className="track-list">
                                {filteredSongs && filteredSongs.length > 0 ? (
                                    filteredSongs.map((song, index) => (
                                        <div
                                            key={index}
                                            className={`track-list-item ${currentSongIndex === index ? "active" : ""}`}
                                            onClick={() => handleSongItemClick(index)}
                                        >
                                            <div className="track-thumbnail">
                                                <img 
                                                    src={song.thumbnail || song.backgroundUrl } 
                                                    alt={song.title} 
                                                />
                                            </div>
                                            <div className="track-info">
                                                <div className="track-title">{song.title || `Song ${index + 1}`}</div>
                                                <div className="track-artist">{song.artist || "Artist name"}</div>
                                            </div>
                                            <div className="track-details">
                                                <div className="track-genre">{song.genre || "Electrical Dance"}</div>
                                                <div className="track-melody">{song.melodyType || "Energetic"}</div>
                                                <div
                                                    className="track-difficulty"
                                                    style={{ color: getDifficultyColor(song.difficulty || 5.2) }}
                                                >
                                                    {song.difficulty?.toFixed(1) || "5.2"}
                                                </div>
                                                <div className="track-metric">{song.metric || "Relaxation"}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-songs">No songs found matching your criteria</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*{currentSong && <AudioPlayer audioUrl={currentSong.audioUrl} />}*/}
        </>
    );
}

export default SuggestionPage;
