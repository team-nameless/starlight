import axios from "axios";
import { useEffect, useState } from "react";

import { apiHost } from "../common/site_setting.ts";
import HeaderBar from "../components/HeaderBar";
import { StarlightSong } from "../index";
import "./assets/stylesheets/MainPages.css";

function StorePage() {
    const [currentSong, setCurrentSong] = useState<any>(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [songs, setSongs] = useState<StarlightSong[]>([]);
    const [isSongListOpen, setIsSongListOpen] = useState(false);

    useEffect(() => {
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
            setCurrentSongIndex(index);
            setCurrentSong(song);
        }
    };

    const toggleSongList = () => {
        setIsSongListOpen(!isSongListOpen);
    };

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
        </>
    );
}

export default StorePage;
