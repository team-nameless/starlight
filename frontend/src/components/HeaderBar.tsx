import axios from "axios";
import Fuse from "fuse.js";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, Route, Routes } from "react-router-dom";
import songSidebarIcon from "starlight-web/src/assets/Collapsed_Sidebar/Song-sidebar-icon.png";
import bgSidebarImage from "starlight-web/src/assets/Collapsed_Sidebar/sidebar-bg.png";
import leaveIcon from "starlight-web/src/assets/Header_Items/Leave-icon.png";
import eventsIcon from "starlight-web/src/assets/Header_Items/events-icon.png";
import historyIcon from "starlight-web/src/assets/Header_Items/history-icon.png";
import songsIcon from "starlight-web/src/assets/Header_Items/songs-icon.png";
import storeIcon from "starlight-web/src/assets/Header_Items/store-icon.png";
import logoIcon from "starlight-web/src/assets/Starlight-logo.png";

import { apiHost } from "../common/site_setting.ts";
import GameApp from "../game/GameApp.tsx";
import { StarlightSong } from "../index";
import HistoryPage from "../pages/HistoryPage.tsx";
import LandingPage from "../pages/LandingPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import SongPage from "../pages/SongPage.tsx";
import StorePage from "../pages/StorePage.tsx";
import SuggestionPage from "../pages/SuggestionPage.tsx";
import { HeaderBarProps } from "./props";

function HeaderBar({
    currentSong,
    currentSongIndex,
    songs,
    handleSongClick,
    toggleSongList,
    isSongListOpen
}: HeaderBarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSongs, setFilteredSongs] = useState(songs);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fuse = new Fuse(songs, { keys: ["title"], threshold: 0.3 });
        setFilteredSongs(searchQuery ? fuse.search(searchQuery).map(result => result.item) : songs);
    }, [searchQuery, songs]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
    };

    const handleLeaveClick = () => {
        setShowPopup(true);
    };

    const handleConfirmLeave = () => {
        window.location.href = "/";
    };

    const handleCancelLeave = () => {
        setShowPopup(false);
    };

    const handleLogoutRequest = () => {
        axios.get(`${apiHost}/api/logout`, { withCredentials: true }).finally(() => {
            localStorage.removeItem("login");
            window.location.href = "/";
        });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                event.preventDefault();
                setShowPopup(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <header className="navbar">
                <div id="nav-icon1" className={isSongListOpen ? "open" : ""} onClick={toggleSongList}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <nav className="nav-links left">
                    <Link to="/SongPage" state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}>
                        <img src={songsIcon} alt="Songs" className="nav-icon" />
                        <span>Songs</span>
                    </Link>
                    <Link
                        to={`/HistoryPage/${currentSong?.id ?? 586954}/${currentSongIndex ?? 0}`}
                        state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}
                    >
                        <img src={historyIcon} alt="History" className="nav-icon" />
                        <span>History</span>
                    </Link>
                </nav>

                <div className="logo-container">
                    <Link
                        to="/SongPage"
                        className="logo"
                        state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}
                    >
                        <span className="star-light">
                            <span>STAR</span>
                            <img src={logoIcon} alt="Logo" className="logo-icon" style={{ verticalAlign: "middle" }} />
                            <span className="light">LIGHT</span>
                        </span>
                    </Link>
                </div>

                <nav className="nav-links right">
                    <Link to="/SuggestionPage" state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}>
                        <img src={eventsIcon} alt="Events" className="nav-icon" />
                        <span>Events</span>
                    </Link>
                    <Link to="/StorePage" state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}>
                        <img src={storeIcon} alt="Store" className="nav-icon" />
                        <span>Store</span>
                    </Link>
                </nav>

                <div className="leave-button">
                    <img
                        src={leaveIcon}
                        alt="Leave"
                        className="leave-icon"
                        style={{ width: "26px", height: "26px" }}
                        onClick={handleLeaveClick}
                    />
                </div>
            </header>

            <div
                className={`sidebar ${isSongListOpen ? "open" : ""}`}
                style={{ backgroundImage: `url(${bgSidebarImage})` }}
            >
                <div className="search-bar-container">
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <label htmlFor="search" className="screen-reader-text">
                            Search
                        </label>
                        <input
                            type="search"
                            id="search"
                            placeholder="Search songs..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-field"
                        />
                        <button type="submit" className="search-submit">
                            <FaSearch className="search-bar-icon" />
                        </button>
                    </form>
                </div>
                <ul>
                    {filteredSongs.map((song: StarlightSong, index: number) => (
                        <li
                            key={index}
                            className="song-item"
                            onClick={handleSongClick ? handleSongClick(song) : undefined}
                        >
                            <div className="song-info-sidebar">
                                <img src={songSidebarIcon} alt="Song Sidebar Icon" className="song-sidebar-icon" />
                                <span className="sidebar-song">{song.title}</span>
                            </div>
                            <div className="song-bg" style={{ backgroundImage: `url(${song.backgroundUrl})` }}></div>
                            <span className="sidebar-song-title">{song.title}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Confirm Leave</h2>
                        <p>Are you sure you want to leave the game?</p>
                        <button className="stay-button" onClick={handleCancelLeave}>
                            Stay
                        </button>
                        <button className="logout-button" onClick={handleLogoutRequest}>
                            Logout
                        </button>
                        <button className="leave-button" onClick={handleConfirmLeave}>
                            Leave
                        </button>
                    </div>
                </div>
            )}

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/SongPage" element={<SongPage />} />
                <Route path="/HistoryPage" element={<HistoryPage />} />
                <Route path="/SuggestionPage" element={<SuggestionPage />} />
                <Route path="/StorePage" element={<StorePage />} />
                <Route path="/Logout" element={<LandingPage />} />
                <Route path="/ProfilePage" element={<ProfilePage />} />
                <Route path="/TestGame" element={<GameApp />} />
            </Routes>
        </>
    );
}

export default HeaderBar;
