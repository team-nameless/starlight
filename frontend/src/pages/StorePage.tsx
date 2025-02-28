import axios from "axios";
import { useEffect, useState } from "react";

// Import Header component

import "./Main_Menu_Style.css";
import Header from "./components/Header";

const rootUrl = "http://localhost:5000";

function StorePage() {
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [songs, setSongs] = useState([]);

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

        await fetchData();
    }, []);

    const handleSongClick = song => {
        const index = songs.findIndex(s => s.id === song.id);
        if (index !== -1) {
            const imgElement = document.querySelector(".background-image img");
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

    return (
        <div className="storepage">
            <Header
                currentSong={currentSong}
                currentSongIndex={currentSongIndex}
                songs={songs}
                handleSongClick={handleSongClick}
            />

            <div className="content-layer">
                <div className="background-image">
                    <img
                        src={currentSong && currentSong.backgroundUrl ? `${currentSong.backgroundUrl}` : ""}
                        alt="Background"
                    />
                </div>

                <div className="store-content">
                    {/* Background Image */}
                    <div className="background-image">
                        <img
                            src={currentSong && currentSong.backgroundUrl ? `${currentSong.backgroundUrl}` : ""}
                            alt="Background"
                        />
                    </div>

                    {/* Overlay Layer */}
                    <div className="overlay-layer" style={{ height: "1000px" }}></div>

                    {/* Coming Soon Text */}
                    <div className="coming-soon-text">Coming soon...</div>
                </div>
            </div>
        </div>
    );
}

export default StorePage;
