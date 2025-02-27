import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from './components/Header';
import PlayButton from "./components/PlayButton";
import AudioPlayer from "./components/AudioPlayer";

import "./Main_Menu_Style.css";
import "./SuggestionPage.css";

const rootUrl = "http://localhost:5000";

function SuggestionPage() {
    const location = useLocation();
    const currentSongFromLocation = location.state?.currentSong || null;
    const currentSongIndexFromLocation = location.state?.currentSongIndex || 0;
    const [currentSong, setCurrentSong] = useState(currentSongFromLocation);
    const [currentSongIndex, setCurrentSongIndex] = useState(currentSongIndexFromLocation);
    const [setShowPopup] = useState(false);
    const [songs, setSongs] = useState([]);
    const [bestScore, setBestScore] = useState(null);
    const [record, setRecord] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSongListOpen, setIsSongListOpen] = useState(false);

    useEffect(() => {
        setCurrentSong(currentSongFromLocation);
        setCurrentSongIndex(currentSongIndexFromLocation);
    }, [currentSongFromLocation, currentSongIndexFromLocation]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const songsResponse = await axios.get(`${rootUrl}/api/track/all`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                const fetchedSongs = songsResponse.data;
                setSongs(fetchedSongs);
                if (fetchedSongs.length > 0) {
                    setCurrentSongIndex(0);
                    setCurrentSong(fetchedSongs[0]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (currentSongIndex >= songs.length) {
            setCurrentSongIndex(0);
        }
    }, [currentSongIndex, songs.length]);

    useEffect(() => {
        const fetchCurrentSongData = async () => {
            if (currentSong) {
                try {
                    const response = await axios.get(`${rootUrl}/api/track/${currentSong.id}`, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    });
                    if (response.status === 200) {
                        const songData = response.data;
                        setCurrentSong(songData);
                    } else {
                        console.error("Error fetching current song data:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching current song data:", error);
                }
            }
        };

        const fetchBestScore = async () => {
            if (currentSong) {
                try {
                    const response = await axios.get(`${rootUrl}/api/score/${currentSong.id}/best`, {
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
                        setRecord({});
                    } else {
                        console.error("Error fetching best score:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching best score:", error);
                    setBestScore("No record");
                    setRecord({});
                }
            }
        };

        fetchCurrentSongData();
        fetchBestScore();
    }, [currentSong]);

    const handleSongClick = song => {
        const index = songs.findIndex(s => s.id === song.id);
        if (index !== -1) {
            const imgElement = document.querySelector(".page-background-image img");
            if (imgElement) {
                imgElement.classList.add("fade-out");
                imgElement.addEventListener(
                    "transitionend",
                    () => {
                        setCurrentSongIndex(index);
                        setCurrentSong(song);
                        imgElement.classList.remove("fade-out");
                    },
                    { once: true }
                );
            }
        }
    };

    const toggleSongList = () => {
        setIsSongListOpen(!isSongListOpen);
    };

    return (
        <Fragment>
            <Header
                currentSong={currentSong}
                currentSongIndex={currentSongIndex}
                setCurrentSong={setCurrentSong}
                setCurrentSongIndex={setCurrentSongIndex}
                songs={songs}
                handleSongClick={handleSongClick}
                toggleSongList={toggleSongList}
                isSongListOpen={isSongListOpen}
                handleLeaveClick={() => setShowPopup(true)}
            />

            <div className="content-layer">
                <div className="page-background-image">
                    <img
                        src={currentSong && currentSong.backgroundUrl ? `${currentSong.backgroundUrl}` : ""}
                        alt="Background"
                    />
                </div>

                <div className="track-card">
                    <div className="track-card-background">
                        <img
                            src={currentSong?.backgroundUrl || ""}
                            alt="Song Background"
                        />
                        <div className="overlay-top"></div>
                        <div className="overlay-bottom"></div>
                    </div>

                    <div className="content-layer">
                        <div className="track-info">
                            <h2>{currentSong?.title}</h2>
                            <p>{currentSong?.artist}</p>
                            <p>ID: {currentSong?.id}</p>
                            <p>Best Score: {bestScore}</p>
                        </div>

                        <div className="performance-info">
                            <div className="performance-column">
                                <p className="tier-label">Tier</p>
                                <p className="grade">{record.grade}</p>
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

                        {currentSong && (
                            <PlayButton
                                currentSong={currentSong}
                                currentSongIndex={currentSongIndex}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                songs={songs}
                            />
                        )}

                    </div>
                </div>
            </div>
            {currentSong && <AudioPlayer audioUrl={currentSong.audioUrl} />}
        </Fragment>
    );
}

export default SuggestionPage;
