import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Main_Menu_Style.css';
import { Link, useLocation } from 'react-router-dom';
import logoIcon from './assets/Starlight-logo.png'; // Logo image
import leaveIcon from './assets/Header_Items/Leave-icon.png'; // Leave icon
import songsIcon from './assets/Header_Items/songs-icon.png'; // Songs icon
import historyIcon from './assets/Header_Items/history-icon.png'; // History icon
import eventsIcon from './assets/Header_Items/events-icon.png'; // Events icon
import storeIcon from './assets/Header_Items/store-icon.png'; // Store icon
import bgSidebarImage from './assets/Collapsed_Sidebar/sidebar-bg.png'; // Sidebar background
import songSidebarIcon from './assets/Collapsed_Sidebar/Song-sidebar-icon.png'; // Song icon for sidebar
//import axios from 'axios';

const rootUrl = "https://cluster1.swyrin.id.vn";

function EventPage() {
  const location = useLocation();
  const currentSongFromLocation = location.state?.currentSong || null;
  const currentSongIndexFromLocation = location.state?.currentSongIndex || 0;
  const [currentSong, setCurrentSong] = useState(currentSongFromLocation);
  const [currentSongIndex, setCurrentSongIndex] = useState(currentSongIndexFromLocation);
  let audio; // Define audio variable
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [songs, setSongs] = useState([]);
  //const navigate = useNavigate();

  useEffect(() => {
    setCurrentSong(currentSongFromLocation);
    setCurrentSongIndex(currentSongIndexFromLocation);
  }, [currentSongFromLocation, currentSongIndexFromLocation]);

  useEffect(() => {
    setCurrentSong(currentSongFromLocation);
  }, [currentSongFromLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all songs data
        const songsResponse = await axios.get(`${rootUrl}/api/track/all`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const fetchedSongs = songsResponse.data;
        setSongs(fetchedSongs);
        if (fetchedSongs.length > 0) {
          setCurrentSongIndex(0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentSongIndex >= songs.length) {
      setCurrentSongIndex(0);
    }
  }, [currentSongIndex, songs.length]);

  const toggleSongList = () => {
    setIsSongListOpen(!isSongListOpen);
  };

  const handleLeaveClick = () => {
    setShowPopup(true);
  };

  const handleConfirmLeave = () => {
    if (audio) {
      audio.pause();
      audio = null;
    }
    window.location.href = '/';
  };

  const handleCancelLeave = () => {
    setShowPopup(false);
  };

  return (
    <div className="eventpage">
      {/* Header Navigation Bar */}
      <header className="navbar">
        <div id="nav-icon1" className={isSongListOpen ? 'open' : ''} onClick={toggleSongList}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className="nav-links left">
          <Link to="/songpage">
            <img src={songsIcon} alt="Songs" className="nav-icon" />
            <span>Songs</span>
          </Link>
          <Link to="/historypage">
            <img src={historyIcon} alt="History" className="nav-icon" />
            <span>History</span>
          </Link>
        </nav>

        {/* Center Curved Logo */}
        <div className="logo-container">
          <Link to="/songpage" className="logo">
            <span className="star-light">
              <span>STAR</span>
              <img src={logoIcon} alt="Logo" className="logo-icon" style={{ verticalAlign: 'middle' }} />
              <span className="light">LIGHT</span>
            </span>
          </Link>
        </div>

        <nav className="nav-links right">
          <Link to="/eventpage">
            <img src={eventsIcon} alt="Events" className="nav-icon" />
            <span>Events</span>
          </Link>
          <Link to="/storepage">
            <img src={storeIcon} alt="Store" className="nav-icon" />
            <span>Store</span>
          </Link>
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

      {/* Song List Sidebar */}
      <div className={`sidebar ${isSongListOpen ? 'open' : ''}`} style={{ backgroundImage: `url(${bgSidebarImage})` }}>
        <div className="sidebar-header">
          Song List
        </div>
        <ul>
          {songs.map((song, index) => (
            <li key={index} className="song-item" onClick={() => setCurrentSong(song)}>
              <div className="song-info-sidebar">
                <img src={songSidebarIcon} alt="Song Sidebar Icon" className="song-sidebar-icon" />
                <span className="sidebar-song">
                  {song.title}
                </span>
              </div>
              <div className="song-bg" style={{ backgroundImage: `url(${rootUrl}${song.backgroundFileLocation})` }}></div>
              <span className="sidebar-song-title">
                {song.title}
              </span>
            </li>
          ))}
        </ul>
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
  );
}

export default EventPage;
