import axios from "axios";
import { useEffect, useState } from "react";

import Header from "../components/HeaderBar";
import { StarlightSong } from "../index";
// Import Header component

import "../stylesheets/Main_Menu_Style.css";

const rootUrl = "http://localhost:5000";

function StorePage() {
    const [currentSong, setCurrentSong] = useState<any>(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [songs, setSongs] = useState<StarlightSong[]>([]);

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

    const handleSongClick = (song: StarlightSong) => () => {
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
                setCurrentSong={setCurrentSong}
                setCurrentSongIndex={setCurrentSongIndex}
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
