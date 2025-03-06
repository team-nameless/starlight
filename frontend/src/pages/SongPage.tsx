import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import profilePicPlaceholder from "../assets/images/profile.png";
import { apiHost } from "../common/site_setting.ts";
import AudioPlayer from "../components/AudioPlayer";
import HeaderBar from "../components/HeaderBar.tsx";
import NextPreviousButton from "../components/NextPreviousButton";
import PlayButton from "../components/PlayButton";
import { StarlightSong, StarlightUser } from "../index";
import "../assets/stylesheets/MainPages.css";

function SongPage() {
    const [userProfile, setUserProfile] = useState<StarlightUser>();
    const [currentSong, setCurrentSong] = useState<StarlightSong>();
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [bestScore, setBestScore] = useState<string | number>("");
    const [isLoading, setIsLoading] = useState(false);
    const [songs, setSongs] = useState<StarlightSong[]>([]);
    const [isSongListOpen, setIsSongListOpen] = useState(false);

    //const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const { currentSong, currentSongIndex } = location.state || {};
        setCurrentSong(currentSong || null);
        setCurrentSongIndex(currentSongIndex || 0);
    }, [location.state]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userResponse = await axios.get(`${apiHost}/api/user`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                if (userResponse.status === 200) {
                    const userData = userResponse.data;
                    const profilePic = userData.avatar || profilePicPlaceholder;
                    setUserProfile({
                        id: userData.id || 123456,
                        name: userData.name || "Anonymous",
                        profilePic: profilePic
                    });
                    localStorage.setItem("userProfilePic", profilePic);
                } else {
                    console.error("Error fetching user data:", userResponse.statusText);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedProfilePic = localStorage.getItem("userProfilePic");
            setUserProfile(prevProfile => ({
                ...prevProfile,
                id: prevProfile?.id || 123456,
                name: prevProfile?.name || "Anonymous",
                profilePic: storedProfilePic || profilePicPlaceholder
            }));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const fetchBestScore = async () => {
            if (currentSong) {
                try {
                    const response = await axios.get(`${apiHost}/api/score/${currentSong.id}/best`, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    });
                    if (response.status === 200) {
                        setBestScore(response.data.totalPoints);
                    } else if (response.status === 204) {
                        setBestScore("No record");
                    } else {
                        console.error("Error fetching best score:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching best score:", error);
                    setBestScore("No record");
                }
            }
        };

        fetchBestScore();
    }, [currentSong]);

    useEffect(() => {
        const fetchSongs = async () => {
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
                console.error("Error fetching songs:", error);
            }
        };

        fetchSongs();
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

    const toggleSongList = () => {
        setIsSongListOpen(!isSongListOpen);
    };

    return (
        <Fragment>
            {currentSong && (
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
            )}
            {isLoading && (
                <div className="loader">
                    <div className="one"></div>
                    <div className="two"></div>
                </div>
            )}
            <div className="songpage">
                <div className="content-layer">
                    <div className="background-image">
                        <img
                            src={currentSong && currentSong.backgroundUrl ? `${currentSong.backgroundUrl}` : ""}
                            alt="Background"
                        />
                    </div>

                    <div className="song-content">
                        <div className="user-profile">
                            <table>
                                <tr>
                                    <td>
                                        <div className="user-name">{userProfile?.name}</div>
                                        <div className="user-id">ID: {userProfile?.id}</div>
                                    </td>
                                    <td>
                                        <Link to="/ProfilePage">
                                            <img
                                                src={userProfile?.profilePic || profilePicPlaceholder}
                                                alt="Profile"
                                                className="profile-img-table"
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <NextPreviousButton
                            currentSongIndex={currentSongIndex}
                            setCurrentSongIndex={setCurrentSongIndex}
                            songs={songs}
                            setCurrentSong={setCurrentSong}
                        />

                        <div className="song-container">
                            <div className="song-identity">
                                <div className="difficulty-text">Song level</div>
                                <div className="difficulty-value">{currentSong?.difficulty}</div>
                            </div>
                            <div className="song-info">
                                <div className="song-name">{currentSong?.title}</div>
                                <div className="artist-name">- {currentSong?.artist} -</div>
                                <div className="best-score">{bestScore !== null ? bestScore : "No record"} </div>
                            </div>
                            {currentSong && (
                                <PlayButton
                                    currentSongIndex={currentSongIndex}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    songs={songs}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {currentSong && <AudioPlayer audioUrl={currentSong.audioUrl} />}
        </Fragment>
    );
}

export default SongPage;
