import axios from "axios";
import Fuse from "fuse.js";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Route, Routes, useLocation } from "react-router-dom";

import songSidebarIcon from "../assets/images/Collapsed_Sidebar/Song-sidebar-icon.png";
import bgSidebarImage from "../assets/images/Collapsed_Sidebar/sidebar-bg.png";
import leaveIcon from "../assets/images/Header_Items/Leave-icon.png";
import eventsIcon from "../assets/images/Header_Items/events-icon.png";
import historyIcon from "../assets/images/Header_Items/history-icon.png";
import songsIcon from "../assets/images/Header_Items/songs-icon.png";
import storeIcon from "../assets/images/Header_Items/store-icon.png";
import logoIcon from "../assets/images/Starlight-logo.png";
import { apiHost } from "../common/site_setting.ts";
import { StarlightSong } from "../index";
import HistoryPage from "../pages/HistoryPage.tsx";
import LandingPage from "../pages/LandingPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import SongPage from "../pages/SongPage.tsx";
import StorePage from "../pages/StorePage.tsx";
import SuggestionPage from "../pages/SuggestionPage.tsx";
import { HeaderBarProps } from "./props";
import {
    PopupOverlay,
    PopupContent,
    StayButton,
    LeaveButton,
    LogoutButton
} from "../modalstyle/PopUpModals";
import {
    NavbarContainer,
    NavIconToggle,
    NavLinksContainer,
    NavIcon,
    LogoContainer,
    LogoText,
    LogoIconImage,
    LeaveButton as LeaveButtonStyled,
    LeaveIcon,
    SidebarContainer,
    SearchBarContainer,
    ScreenReaderText,
    SongItem,
    StyledLink
} from "../modalstyle/HeaderBarStyles";

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

    const location = useLocation();

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

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <NavbarContainer>
                <NavIconToggle className={isSongListOpen ? "open" : ""} onClick={toggleSongList}>
                    <span></span>
                    <span></span>
                    <span></span>
                </NavIconToggle>

                <NavLinksContainer className="left">
                    <StyledLink 
                        to="/SongPage" 
                        state={{ currentSong, currentSongIndex }}
                        active={isActive('/SongPage')}
                    >
                        <NavIcon src={songsIcon} alt="Songs" />
                        <span>Songs</span>
                    </StyledLink>
                    
                    <StyledLink 
                        to={`/HistoryPage/${currentSong?.id ?? 586954}/${currentSongIndex ?? 0}`}
                        state={{ currentSong, currentSongIndex }}
                        active={isActive('/HistoryPage')}
                    >
                        <NavIcon src={historyIcon} alt="History" />
                        <span>History</span>
                    </StyledLink>
                </NavLinksContainer>

                <LogoContainer>
                    <StyledLink to="/SongPage" state={{ currentSong, currentSongIndex }}>
                        <LogoText>
                            <span>STAR</span>
                            <LogoIconImage src={logoIcon} alt="Logo" />
                            <span className="light">LIGHT</span>
                        </LogoText>
                    </StyledLink>
                </LogoContainer>

                <NavLinksContainer className="right">
                    <StyledLink 
                        to="/SuggestionPage" 
                        state={{ currentSong, currentSongIndex }}
                        active={isActive('/SuggestionPage')}
                    >
                        <NavIcon src={eventsIcon} alt="Events" />
                        <span>Events</span>
                    </StyledLink>
                    
                    <StyledLink 
                        to="/StorePage" 
                        state={{ currentSong, currentSongIndex }}
                        active={isActive('/StorePage')}
                    >
                        <NavIcon src={storeIcon} alt="Store" />
                        <span>Store</span>
                    </StyledLink>
                </NavLinksContainer>

                <LeaveButtonStyled>
                    <LeaveIcon 
                        src={leaveIcon}
                        alt="Leave"
                        onClick={handleLeaveClick}
                    />
                </LeaveButtonStyled>
            </NavbarContainer>

            <SidebarContainer className={isSongListOpen ? "open" : ""} style={{ backgroundImage: `url(${bgSidebarImage})` }}>
                <SearchBarContainer>
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <ScreenReaderText>Search</ScreenReaderText>
                        <input
                            type="search"
                            id="search"
                            placeholder="Search songs..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-field"
                        />
                        <button type="submit" className="search-submit">
                            <FaSearch />
                        </button>
                    </form>
                </SearchBarContainer>
                
                <ul>
                    {filteredSongs.map((song: StarlightSong, index: number) => (
                        <SongItem
                            key={index}
                            onClick={handleSongClick ? handleSongClick(song) : undefined}
                        >
                            <div className="song-info-sidebar">
                                <img src={songSidebarIcon} alt="Song Sidebar Icon" className="song-sidebar-icon" />
                                <span className="sidebar-song">{song.title}</span>
                            </div>
                            <div className="song-bg" style={{ backgroundImage: `url(${song.backgroundUrl})` }}></div>
                            <span className="sidebar-song-title">{song.title}</span>
                        </SongItem>
                    ))}
                </ul>
            </SidebarContainer>

            {showPopup && (
                <PopupOverlay>
                    <PopupContent>
                        <h2>Confirm Leave</h2>
                        <p>Are you sure you want to leave the game?</p>
                        <StayButton onClick={handleCancelLeave}>
                            Stay
                        </StayButton>
                        <LogoutButton onClick={handleLogoutRequest}>
                            Logout
                        </LogoutButton>
                        <LeaveButton onClick={handleConfirmLeave}>
                            Leave
                        </LeaveButton>
                    </PopupContent>
                </PopupOverlay>
            )}

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/SongPage" element={<SongPage />} />
                <Route path="/HistoryPage/:songId/:songIndex" element={<HistoryPage />} />
                <Route path="/SuggestionPage" element={<SuggestionPage />} />
                <Route path="/StorePage" element={<StorePage />} />
                <Route path="/Logout" element={<LandingPage />} />
                <Route path="/ProfilePage" element={<ProfilePage />} />
            </Routes>
        </>
    );
}

export default HeaderBar;
