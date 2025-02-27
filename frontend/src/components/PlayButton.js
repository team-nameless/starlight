import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { requestFullScreen } from "../utils";

const rootUrl = "http://localhost:5000";

const PlayButton = ({ currentSongIndex, isLoading, setIsLoading, songs }) => {
    const navigate = useNavigate();

    const handlePlayButtonClick = useCallback(async () => {
        setIsLoading(true);
        const currentSong = songs[currentSongIndex];
        if (currentSong) {
            try {
                await axios.post(`${rootUrl}/api/game/start`, { songId: currentSong.id }, { withCredentials: true });
                requestFullScreen();
                navigate(`/TestGame`, { state: { songId: currentSong.id, songIndex: currentSongIndex } });
            } catch (error) {
                console.error("Error starting game:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [currentSongIndex, navigate, setIsLoading, songs]);

    return (
        <div className="play-button-container">
            <button className="play-button" onClick={handlePlayButtonClick} disabled={isLoading}>
                <div className="play-icon-container">
                    <span className="play-icon">▶</span>
                </div>
            </button>
            {isLoading && (
                <div className="loader">
                    <div className="one"></div>
                    <div className="two"></div>
                </div>
            )}
        </div>
    );
};

PlayButton.propTypes = {
    currentSong: PropTypes.object.isRequired,
    currentSongIndex: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    songs: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default PlayButton;
