import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";

const SongDataContext = createContext<any>(null);

import { apiHost } from "./common/site_setting";

export const SongDataProvider = ({ children }: { children: ReactNode }) => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

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

    return (
        <SongDataContext.Provider value={{ songs, currentSong, currentSongIndex, setCurrentSong, setCurrentSongIndex }}>
            {children}
        </SongDataContext.Provider>
    );
};

export default SongDataContext;
