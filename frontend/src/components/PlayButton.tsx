import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { apiHost } from "../common/site_setting.ts";
import { PlayButtonProps } from "./props";

function PlayButton({ currentSongIndex, isLoading, setIsLoading, songs }: PlayButtonProps) {
    const navigate = useNavigate();

    const handlePlayButtonClick = useCallback(async () => {
        setIsLoading?.(true);
        if (!songs || typeof currentSongIndex !== "number") {
            setIsLoading?.(false);
            return;
        }
        const currentSong = songs[currentSongIndex];
        if (currentSong) {
            try {
                await axios.post(`${apiHost}/api/game/start`, { songId: currentSong.id }, { withCredentials: true });
                navigate(`/GamePlay`, { state: { songId: currentSong.id, songIndex: currentSongIndex } });
            } catch (error) {
                console.error("Error starting game:", error);
            } finally {
                setIsLoading?.(false);
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
}

export default PlayButton;
