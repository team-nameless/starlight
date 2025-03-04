import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";

const SongDataContext = createContext<any>(null);

const rootUrl = "http://localhost:5000";

export const SongDataProvider = ({ children }: { children: ReactNode }) => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

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

    return (
        <SongDataContext.Provider value={{ songs, currentSong, currentSongIndex, setCurrentSong, setCurrentSongIndex }}>
            {children}
        </SongDataContext.Provider>
    );
};

export default SongDataContext;
