import axios from "axios";
import { useEffect, useState } from "react";

import HeaderBar from "../components/HeaderBar";
import { StarlightSong } from "../index";
import { ComingSoonContainer, ComingSoonText, OverlayLayer, PageContainer } from "../modalstyle/HeaderBarStyles";

const rootUrl = "http://localhost:5000";

function StorePage() {
    const [currentSong, setCurrentSong] = useState<any>(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [songs, setSongs] = useState<StarlightSong[]>([]);
    const [isSongListOpen, setIsSongListOpen] = useState(false);

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
            setCurrentSongIndex(index);
            setCurrentSong(song);
        }
    };

    const toggleSongList = () => {
        setIsSongListOpen(!isSongListOpen);
    };

    return (
        <PageContainer>
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

            <ComingSoonContainer>
                <OverlayLayer />
                <ComingSoonText>Coming soon...</ComingSoonText>
            </ComingSoonContainer>
        </PageContainer>
    );
}

export default StorePage;
