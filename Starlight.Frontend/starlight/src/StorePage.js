// StorePage.js
import React from 'react';
import './Main_Menu_Style.css';
import logoIcon from './assets/Starlight-logo.png'; // Logo image
import leaveIcon from './assets/Header_Items/Leave-icon.png'; // Leave icon
import songsIcon from './assets/Header_Items/songs-icon.png'; // Songs icon
import historyIcon from './assets/Header_Items/history-icon.png'; // History icon
import eventsIcon from './assets/Header_Items/events-icon.png'; // Events icon
import storeIcon from './assets/Header_Items/store-icon.png'; // Store icon
import song1bg from './assets/SongBG/Dragon-image.png'; // Background image

function StorePage() {
  return (
    <div className="storepage">
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
          <img
            src={leaveIcon}
            alt="Leave"
            className="leave-icon"
            style={{ width: '26px', height: '26px' }}
            onClick={() => window.location.href = '/landing-page'}
          />
        </div>
      </header>

      {/* Background Image */}
      <div className="background-image">
        <img src={currentSong?.backgroundImage || song1bg} alt="Background" />
        <div className="overlay-layer"></div>
      </div>

      {/* Coming Soon Text */}
      <div className="coming-soon-text">
        Coming soon...
      </div>

    </div>
  );
}

export default StorePage;
