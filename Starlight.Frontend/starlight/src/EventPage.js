import React, { useState, useEffect } from 'react';
import './Main_Menu_Style.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './LandingPageApp'; 
import HistoryPage from './HistoryPage';
import StorePage from './StorePage';
import SongPage from './SongPage';
import logoIcon from './assets/Starlight-logo.png'; // Logo image
import leaveIcon from './assets/Header_Items/Leave-icon.png'; // Leave icon
import songsIcon from './assets/Header_Items/songs-icon.png'; // Songs icon
import historyIcon from './assets/Header_Items/history-icon.png'; // History icon
import eventsIcon from './assets/Header_Items/events-icon.png'; // Events icon
import storeIcon from './assets/Header_Items/store-icon.png'; // Store icon
import axios from 'axios';

const rootUrl = "https://cluster1.swyrin.id.vn";

function EventPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const fetchCurrentSong = async () => {
      try {
        const response = await axios.get(`${rootUrl}/api/track/current`);
        setCurrentSong(response.data);
      } catch (error) {
        console.error('Error fetching current song:', error);
      }
    };

    fetchCurrentSong();
  }, []);

  const handleLeaveClick = () => {
    setShowPopup(true);
  };

  const handleConfirmLeave = () => {
    window.location.href = '/LandingPageApp';
  };

  const handleCancelLeave = () => {
    setShowPopup(false);
  };

  return (
    <Router>
    <div className="eventpage">
      {/* Header Navigation Bar */}
      <header className="navbar">
        <div id="nav-icon1">
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

        <div className="leave-button">
            <img src={leaveIcon} alt="Leave" className="leave-icon" style={{ width: '26px', height: '26px' }} onClick={handleLeaveClick} />
        </div>
      </header>

      {/* Background Image */}
      <div className="background-image">
        <img src={currentSong && currentSong.backgroundFileLocation ? `${rootUrl}${currentSong.backgroundFileLocation}` : ''} alt="Background" />
        <div className="overlay-layer"></div>
      </div>

      {/* Coming Soon Text */}
      <div className="coming-soon-text">
        Coming soon...
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Confirm Leave</h2>
            <p>Are you sure you want to leave the game?</p>
            <button className="stay-button" onClick={handleCancelLeave}>Stay</button>
            <button className="leave-button" onClick={handleConfirmLeave}>Leave</button>
          </div>
        </div>
      )}
    </div>
  
      <Routes>
        <Route path="/SongPage" element={<SongPage />} />
        <Route path="/HistoryPage" element={<HistoryPage />} />
        <Route path="/EventPage" element={<EventPage />} />
        <Route path="/StorePage" element={<StorePage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>   
    );
}

export default EventPage;
