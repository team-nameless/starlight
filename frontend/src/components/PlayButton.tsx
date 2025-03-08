import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { apiHost } from "../common/site_setting.ts";
import { PlayButtonProps } from "./props";

function PlayButton({ currentSongIndex, isLoading, setIsLoading, songs, variant = 'default' }: PlayButtonProps) {
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

    // Use different class names based on the variant
    const containerClass = variant === 'card' ? 'play-card-button-container' : 'play-button-container';
    const buttonClass = variant === 'card' ? 'play-card-button' : 'play-button';
    const iconContainerClass = variant === 'card' ? 'play-card-icon-container' : 'play-icon-container';
    const iconClass = variant === 'card' ? 'play-card-icon' : 'play-icon';

    return (
        <div className={containerClass}>
            <button className={buttonClass} onClick={handlePlayButtonClick} disabled={isLoading}>
                <div className={iconContainerClass}>
                    <span className={iconClass}>▶</span>
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
