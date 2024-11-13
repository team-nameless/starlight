// SongPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Main_Menu_Style.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPageApp'; 
import HistoryPage from './HistoryPage';
import EventPage from './EventPage';
import StorePage from './StorePage';
import profilePicPlaceholder from './assets/profile.png'; // Placeholder for profile image
import logoIcon from './assets/Starlight-logo.png'; // Logo image
import leaveIcon from './assets/Header_Items/Leave-icon.png'; // Leave icon
import songsIcon from './assets/Header_Items/songs-icon.png'; // Songs icon
import historyIcon from './assets/Header_Items/history-icon.png'; // History icon
import eventsIcon from './assets/Header_Items/events-icon.png'; // Events icon
import storeIcon from './assets/Header_Items/store-icon.png'; // Store icon
import previousArrow from './assets/previousArrow.png'; // Previous button arrow
import nextArrow from './assets/nextArrow.png'; // Next button arrow
import bgSidebarImage from './assets/Collapsed_Sidebar/sidebar-bg.png'; // Sidebar background
import songSidebarIcon from './assets/Collapsed_Sidebar/Song-sidebar-icon.png'; // Song icon for sidebar

const rootUrl = "https://cluster1.swyrin.id.vn";

function SongPage() {
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Fetch user profile and song list data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data
        const userProfileResponse = await axios.get('/api/user-profile');
        setUserProfile(userProfileResponse.data);

        // Fetch all songs data
        const songsResponse = await axios.get(`${rootUrl}/api/track/all`);
        setSongs(songsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const toggleSongList = () => {
    setIsSongListOpen(!isSongListOpen);
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePreviousSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const handlePlayButtonClick = async () => {
    const currentSong = songs[currentSongIndex];
    if (currentSong) {
      try {
        await axios.post(`${rootUrl}/api/play`, { songId: currentSong.id });
        window.location.href = `/game/${currentSong.id}`;
      } catch (error) {
        console.error('Error starting game:', error);
      }
    }
  };

  const currentSong = songs[currentSongIndex];

  return (
    <Router>
      <Routes>
        <Route path="/SongPage" element={<SongPage />} />
        <Route path="/HistoryPage" element={<HistoryPage />} />
        <Route path="/EventPage" element={<EventPage />} />
        <Route path="/StorePage" element={<StorePage />} />
        <Route path="/Logout" element={<LandingPage />} />
      </Routes>
      <div className="songpage">
        {/* Header Navigation Bar */}
        <header className="navbar">
          <div id="nav-icon1" className={isSongListOpen ? 'open' : ''} onClick={toggleSongList}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <nav className="nav-links left">
            <a href="/SongPage">
              <img src={songsIcon} alt="Songs" className="nav-icon" />
              <span>Songs</span>
            </a>
            <a href="/HistoryPage">
              <img src={historyIcon} alt="History" className="nav-icon" />
              <span>History</span>
            </a>
          </nav>

          {/* Center Curved Logo */}
          <div className="logo-container">
            <a href="/SongPage" className="logo">
              <span className="star-light">
                <span>STAR</span>         
                  <img src={logoIcon} alt="Logo" className="logo-icon" style={{ verticalAlign: 'middle' }} />
                <span className="light">LIGHT</span>
              </span>
            </a>
          </div>

          <nav className="nav-links right">
            <a href="/EventPage">
              <img src={eventsIcon} alt="Events" className="nav-icon" />
              <span>Events</span>
            </a>
            <a href="/StorePage">
              <img src={storeIcon} alt="Store" className="nav-icon" />
              <span>Store</span>
            </a>
          </nav>
          
          {/* Song List Sidebar */}
          <div className={`sidebar ${isSongListOpen ? 'open' : ''}`} style={{ backgroundImage: `url(${bgSidebarImage})` }}>
            <div className="sidebar-header">
              Song List
            </div>
            <ul>
              {songs.map((song, index) => (
                <li key={index} className="song-item" onClick={() => setCurrentSongIndex(index)}>
                  <div className="song-info">
                    <img src={songSidebarIcon} alt="Song Sidebar Icon" className="song-sidebar-icon" />
                    <span className="sidebar-song">{song.title}</span>
                  </div>
                  <div className="song-bg" style={{ backgroundImage: `url(${rootUrl}${song.backgroundFileLocation})` }}>
                    <span className="sidebar-song"> {song.title} </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="leave-button">
            <img src={leaveIcon} alt="Leave" className="leave-icon" style={{ width: '26px', height: '26px' }} onClick={() => window.location.href = '/landing-page'} /> 
          </div>
        </header>

        {/* Current Page Content */}
        <div className="content-layer">
          {/* Background Image */}
          <div className="background-image">
            <img src={currentSong ? `${rootUrl}${currentSong.backgroundFileLocation}` : ''} alt="Background" />
          </div>
          
          {/* Content and Buttons */}
          <div className="song-content">
            {/* User Profile */}
            <div className="user-profile">
              <table>
                <tr>
                  <td>
                    <div className="user-name">{userProfile.name || 'Sanraku'}</div>
                    <div className="user-id">ID: #{userProfile.id || '12345'}</div>
                  </td>
                  <td>
                    <img src={userProfile.profilePic || profilePicPlaceholder} alt="Profile" className="profile-img" />
                  </td>
                </tr>
              </table>
            </div>

            {/* Next/Previous Buttons */}
            <div className="song-navigation">
              <button className="nav-btn prev-btn" onClick={handlePreviousSong}>
                <img src={previousArrow} alt="Previous" style={{ width: '21px', height: '21px' }} />
              </button>
              <button className="nav-btn next-btn" onClick={handleNextSong}>
                <img src={nextArrow} alt="Next" style={{ width: '21px', height: '21px' }} />
              </button>
            </div>

            {/* Song Container */}
            <div className="song-container">
              <div className="song-identity">
                <div className="publish-date">{currentSong?.difficultyFavorText || 'N/A'}</div>
                <div className="song-number">{currentSongIndex + 1}</div>
              </div>
              <div className="song-info">
                <div className="song-name">{currentSong?.title || 'Song 1'}</div>
                <div className="artist-name">- {currentSong?.artist || 'Artist'} -</div>
                <button className="best-score-btn">Best Score</button>
              </div>
              <div className="play-button-container">
                <button className="play-button" onClick={handlePlayButtonClick}>
                  <div className="play-icon-container">
                    <span className="play-icon">▶</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </Router>
  );
}

export default SongPage;
