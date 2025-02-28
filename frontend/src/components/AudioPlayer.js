import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const AudioPlayer = ({ audioUrl }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioUrl) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.loop = true;
            audioRef.current.play().catch(error => console.error("Error playing audio:", error));
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    return null;
};

AudioPlayer.propTypes = {
    audioUrl: PropTypes.string.isRequired
};

export default AudioPlayer;
