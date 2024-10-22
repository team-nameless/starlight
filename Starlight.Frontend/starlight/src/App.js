// App.js
import React, { useState } from 'react';
import './App.css';
import profilePic from './assets/profile.png'; // Profile image
import logoIcon from './assets/Starlight-logo.png'; // Logo image
import leaveIcon from './assets/Header_Items/Leave-icon.png'; // Leave icon
import dragonImage from './assets/SongBG/Dragon-image.png'; // Dragon background
import songsIcon from './assets/Header_Items/songs-icon.png'; // Songs icon
import historyIcon from './assets/Header_Items/history-icon.png'; // History icon
import eventsIcon from './assets/Header_Items/events-icon.png'; // Events icon
import storeIcon from './assets/Header_Items/store-icon.png'; // Store icon
import bgSidebarImage from './assets/Collapsed_Sidebar/sidebar-bg.png'; // Sidebar background

function App() {
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(1);

  const toggleSongList = () => {
    setIsSongListOpen(!isSongListOpen);
  };

  const handleNextSong = () => {
    setCurrentSong((prevSong) => prevSong + 1); // Simple increment logic for now
  };

  const handlePreviousSong = () => {
    setCurrentSong((prevSong) => Math.max(prevSong - 1, 1)); // Prevent going below 1
  };

  return (
    <div className="app">
      {/* Header Navigation Bar */}
      <header className="navbar">
        <div id="nav-icon1" className={isSongListOpen ? 'open' : ''} onClick={toggleSongList}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <nav className="nav-links left">
          <a href="#songs">
            <img src={songsIcon} alt="Songs" className="nav-icon" />
            <span>Songs</span>
          </a>
          <a href="#history">
            <img src={historyIcon} alt="History" className="nav-icon" />
            <span>History</span>
          </a>
        </nav>

        {/* Center Curved Logo */}
        <div className="logo-container">
          <a href="#current-page" className="logo">
            <span className="star-light">
              <span>STAR</span>         
                <img src={logoIcon} alt="Logo" className="logo-icon" style={{ verticalAlign: 'middle' }} />
              <span className="light">LIGHT</span>
            </span>
          </a>
        </div>

        <nav className="nav-links right">
          <a href="#events">
            <img src={eventsIcon} alt="Events" className="nav-icon" />
            <span>Events</span>
          </a>
          <a href="#store">
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
              <li className="song-item">
                <div className="song-info">
                  <img src={songsIcon} alt="Song Icon" className="song-icon" />
                  <span className="song-name">Song name</span>
                </div>
                <div className="song-bg" style={{ backgroundImage: `url(${bgSidebarImage})` }}>
                  <span className="song-name">Song name</span>
                </div>
              </li>
              {/* Additional song items can be added here */}
            </ul>
        </div>
        

        <div className="leave-button">
          <img src={leaveIcon} alt="Leave" className="leave-icon" onClick={() => window.location.href = '/landing-page'} />
        </div>
      </header>

      {/* Current Page Content */}
      <div className="content-layer">
        {/* Background Image */}
        <div className="background-image">
          <img src={dragonImage} alt="Background" />
        </div>
        {/* Content and Buttons */}
        <div className="song-content">
          {/* User Profile */}
          <div className="user-profile">
            <img src={profilePic} alt="Profile" className="profile-img" />
            <div className="user-id">
              Sanraku<br />ID: #123456
            </div>
          </div>

          {/* Next/Previous Buttons */}
          <div className="song-navigation">
            <button className="nav-btn prev-btn" onClick={handlePreviousSong}>←</button>
            <button className="nav-btn next-btn" onClick={handleNextSong}>→</button>
          </div>

          {/* Song Container */}
          <div className="song-container">
            <div className="song-name">Song {currentSong}</div>
            <div className="artist-name">Artist {currentSong}</div>
            <div className="publish-date">Oct 01, 2024</div>
            <button className="best-score-btn">Best Score</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
