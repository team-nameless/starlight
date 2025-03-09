import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import nextArrow from "../assets/images/nextArrow.png";
import previousArrow from "../assets/images/previousArrow.png";
import { NextPrevButtonProps } from "./props";

function NextPreviousButton({ currentSongIndex, setCurrentSongIndex, songs, setCurrentSong }: NextPrevButtonProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const isHistoryPage = location.pathname.includes("/HistoryPage");
    const [isDisabled, setIsDisabled] = useState(false);

    // Keep track of the current index
    const indexRef = useRef(currentSongIndex);
    const songsRef = useRef(songs);

    // Update refs when props change
    useEffect(() => {
        indexRef.current = currentSongIndex;
        if (songs && songs.length > 0) {
            songsRef.current = songs;
        }
        setIsDisabled(!songs || songs.length <= 1);
    }, [currentSongIndex, songs]);

    const handleNextSong = useCallback(() => {
        if (!songsRef.current || songsRef.current.length <= 1) {
            console.warn("Cannot navigate: no songs or only one song available");
            return;
        }

        const currentIndex = indexRef.current;
        const songList = songsRef.current;
        const newIndex = (currentIndex + 1) % songList.length;
        const nextSong = songList[newIndex];

        console.log(`Next song: ${newIndex} out of ${songList.length}`);

        // Update background image
        const imgElement = document.querySelector(".background-image img");
        if (imgElement && nextSong && nextSong.backgroundUrl) {
            imgElement.classList.add("fade-out");

            // Handle transition
            const onTransitionEnd = () => {
                // Update state
                setCurrentSongIndex(newIndex);
                setCurrentSong(nextSong);
                indexRef.current = newIndex;

                // Update image source
                (imgElement as HTMLImageElement).src = nextSong.backgroundUrl;
                imgElement.classList.remove("fade-out");

                // Navigate if on history page
                if (isHistoryPage) {
                    navigate(`/HistoryPage/${nextSong.id}/${newIndex}`, {
                        state: {
                            currentSong: nextSong,
                            currentSongIndex: newIndex,
                            songs: songList
                        },
                        replace: true
                    });
                }
            };

            imgElement.addEventListener("transitionend", onTransitionEnd, { once: true });

            // Fallback timer in case transition event doesn't fire
            setTimeout(() => {
                if (imgElement.classList.contains("fade-out")) {
                    imgElement.removeEventListener("transitionend", onTransitionEnd);
                    onTransitionEnd();
                }
            }, 500);
        } else {
            // No image element or no background URL, just update state
            setCurrentSongIndex(newIndex);
            setCurrentSong(nextSong);
            indexRef.current = newIndex;

            // Navigate if on history page
            if (isHistoryPage && nextSong) {
                navigate(`/HistoryPage/${nextSong.id}/${newIndex}`, {
                    state: {
                        currentSong: nextSong,
                        currentSongIndex: newIndex,
                        songs: songList
                    },
                    replace: true
                });
            }
        }
    }, [setCurrentSongIndex, setCurrentSong, isHistoryPage, navigate]);

    const handlePreviousSong = useCallback(() => {
        if (!songsRef.current || songsRef.current.length <= 1) {
            console.warn("Cannot navigate: no songs or only one song available");
            return;
        }

        const currentIndex = indexRef.current;
        const songList = songsRef.current;
        const newIndex = (currentIndex - 1 + songList.length) % songList.length;
        const prevSong = songList[newIndex];

        console.log(`Previous song: ${newIndex} out of ${songList.length}`);

        // Update background image
        const imgElement = document.querySelector(".background-image img");
        if (imgElement && prevSong && prevSong.backgroundUrl) {
            imgElement.classList.add("fade-out");

            // Handle transition
            const onTransitionEnd = () => {
                // Update state
                setCurrentSongIndex(newIndex);
                setCurrentSong(prevSong);
                indexRef.current = newIndex;

                // Update image source
                (imgElement as HTMLImageElement).src = prevSong.backgroundUrl;
                imgElement.classList.remove("fade-out");

                // Navigate if on history page
                if (isHistoryPage) {
                    navigate(`/HistoryPage/${prevSong.id}/${newIndex}`, {
                        state: {
                            currentSong: prevSong,
                            currentSongIndex: newIndex,
                            songs: songList
                        },
                        replace: true
                    });
                }
            };

            imgElement.addEventListener("transitionend", onTransitionEnd, { once: true });

            // Fallback timer in case transition event doesn't fire
            setTimeout(() => {
                if (imgElement.classList.contains("fade-out")) {
                    imgElement.removeEventListener("transitionend", onTransitionEnd);
                    onTransitionEnd();
                }
            }, 500);
        } else {
            // No image element or no background URL, just update state
            setCurrentSongIndex(newIndex);
            setCurrentSong(prevSong);
            indexRef.current = newIndex;

            // Navigate if on history page
            if (isHistoryPage && prevSong) {
                navigate(`/HistoryPage/${prevSong.id}/${newIndex}`, {
                    state: {
                        currentSong: prevSong,
                        currentSongIndex: newIndex,
                        songs: songList
                    },
                    replace: true
                });
            }
        }
    }, [setCurrentSongIndex, setCurrentSong, isHistoryPage, navigate]);

    // UI visual feedback effect
    const triggerButtonHoverEffect = useCallback((selector: string) => {
        const button = document.querySelector(selector);
        if (button) {
            button.classList.add("hover");
            setTimeout(() => {
                button.classList.remove("hover");
            }, 300);
        }
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.keyCode === 39) {
                // Right arrow key
                handleNextSong();
                triggerButtonHoverEffect(".next-btn");
            } else if (event.keyCode === 37) {
                // Left arrow key
                handlePreviousSong();
                triggerButtonHoverEffect(".prev-btn");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleNextSong, handlePreviousSong, triggerButtonHoverEffect]);

    return (
        <div className="song-navigation">
            <button
                className="nav-btn prev-btn"
                onClick={handlePreviousSong}
                disabled={isDisabled}
                aria-label="Previous song"
            >
                <img
                    src={previousArrow}
                    alt="Previous"
                    style={{
                        width: "21px",
                        height: "21px",
                        transition: "transform 0.3s",
                        opacity: isDisabled ? 0.5 : 1
                    }}
                />
            </button>
            <button className="nav-btn next-btn" onClick={handleNextSong} disabled={isDisabled} aria-label="Next song">
                <img
                    src={nextArrow}
                    alt="Next"
                    style={{
                        width: "21px",
                        height: "21px",
                        transition: "transform 0.3s",
                        opacity: isDisabled ? 0.5 : 1
                    }}
                />
            </button>
        </div>
    );
}

export default NextPreviousButton;
