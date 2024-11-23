import React, { useState, useEffect, useCallback, Fragment, lazy, Suspense } from 'react';
import axios from 'axios';
import './Main_Menu_Style.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Unity, useUnityContext } from "react-unity-webgl";
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

const LandingPage = lazy(() => import('./LandingPageApp'));
const HistoryPage = lazy(() => import('./HistoryPage'));
const EventPage = lazy(() => import('./EventPage'));
const StorePage = lazy(() => import('./StorePage'));
const ProfilePage = lazy(() => import('./ProfilePage'));
const GameApp = lazy(() => import('./game/GameApp'));

const rootUrl = "https://cluster1.swyrin.id.vn";

function SongPage() {
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [userName, setUserName] = useState();
  const [score, setScore] = useState();


  const { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  const navigate = useNavigate();

  const handleGameOver = useCallback((userName, score) => {
    setIsGameOver(true);
    setUserName(userName);
    setScore(score);
  }, []);

  useEffect(() => {
    addEventListener("GameOver", handleGameOver);
    return () => {
      removeEventListener("GameOver", handleGameOver);
    };
  }, [addEventListener, removeEventListener, handleGameOver]);

  // Fetch user profile and song list data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user ID and username
        const userResponse = await axios.get(`${rootUrl}/api/user`, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        if (userResponse.status === 200) {
          const userData = userResponse.data;
          setUserProfile({
            id: userData.id || 123456,
            name: userData.name || 'Sanraku',
            profilePic: userData.avatar || profilePicPlaceholder
          });
        } else {
          console.error('Error fetching user data:', userResponse.statusText);
        }

        // Fetch all songs data
        const songsResponse = await axios.get(`${rootUrl}/api/track/all`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (songsResponse.status === 200) {
          const fetchedSongs = songsResponse.data;
          setSongs(fetchedSongs);
          if (fetchedSongs.length > 0) {
            setCurrentSongIndex(0);
          }
        } else {
          console.error('Error fetching songs data:', songsResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const toggleSongList = () => {
    setIsSongListOpen(!isSongListOpen);
  };

  const handleNextSong = useCallback(() => {
    const imgElement = document.querySelector('.background-image img');
    if (imgElement) {
      imgElement.classList.add('fade-out');
      imgElement.addEventListener('transitionend', () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
        imgElement.classList.remove('fade-out');
      }, { once: true });
    }
  }, [songs]);

  const handlePreviousSong = useCallback(() => {
    const imgElement = document.querySelector('.background-image img');
    if (imgElement) {
      imgElement.classList.add('fade-out');
      imgElement.addEventListener('transitionend', () => {
        setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
        imgElement.classList.remove('fade-out');
      }, { once: true });
    }
  }, [songs]);

  const handlePlayButtonClick = async () => {
    const currentSong = songs[currentSongIndex];
    if (currentSong) {
      try {
        await axios.post(`${rootUrl}/api/play`, { songId: currentSong.id });
        navigate(`/TestGame`, { state: { songId: currentSong.id } });
      } catch (error) {
        console.error('Error starting game:', error);
      }
    }
  };

  const handleLeaveClick = () => {
    setShowPopup(true);
  };

  const handleConfirmLeave = () => {
    window.location.href = '/';
  };

  const handleCancelLeave = () => {
    setShowPopup(false);
  };

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    let audio;
    const playAudio = () => {
      if (currentSong && currentSong.audioUrl) {
        audio = new Audio(currentSong.audioUrl);
        audio.loop = true; // Set audio to auto-replay
        audio.play().catch(error => console.error('Error playing audio:', error));
      }
    };

    playAudio(); // Play audio immediately on page load

    return () => {
      if (audio) {
        audio.pause();
        audio = null;
      }
    };
  }, [currentSong]);

  useEffect(() => {
    const imgElement = document.querySelector('.background-image img');
    if (imgElement) {
      imgElement.addEventListener('transitionend', () => {
        imgElement.classList.remove('morph');
      });
    }
  }, [currentSong]);

  const triggerButtonHoverEffect = (buttonClass) => {
    const button = document.querySelector(buttonClass);
    if (button) {
      button.classList.add('hover');
      setTimeout(() => {
        button.classList.remove('hover');
      }, 300); // Duration of the hover effect
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 39) { // Right arrow key
        handleNextSong();
        triggerButtonHoverEffect('.next-btn');
      } else if (event.keyCode === 37) { // Left arrow key
        handlePreviousSong();
        triggerButtonHoverEffect('.prev-btn');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextSong, handlePreviousSong]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) { // Esc key
        event.preventDefault(); // Prevent exiting fullscreen
        handleLeaveClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/SongPage" element={<SongPage />} />
          <Route path="/HistoryPage" element={<HistoryPage />} />
          <Route path="/EventPage" element={<EventPage />} />
          <Route path="/StorePage" element={<StorePage />} />
          <Route path="/Logout" element={<LandingPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/TestGame" element={<GameApp songId={currentSong?.id} />} />
        </Routes>
      </Suspense>
      <div className="songpage">
        {/* Header Navigation Bar */}
        <header className="navbar">
          <div id="nav-icon1" className={isSongListOpen ? 'open' : ''} onClick={toggleSongList}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <nav className="nav-links left">
            <Link to="/SongPage">
              <img src={songsIcon} alt="Songs" className="nav-icon" />
              <span>Songs</span>
            </Link>
            <Link to="/HistoryPage" state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}>
              <img src={historyIcon} alt="History" className="nav-icon" />
              <span>History</span>
            </Link>
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
            <Link to="/EventPage" state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}>
              <img src={eventsIcon} alt="Events" className="nav-icon" />
              <span>Events</span>
            </Link>
            <Link to="/StorePage" state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}>
              <img src={storeIcon} alt="Store" className="nav-icon" />
              <span>Store</span>
            </Link>
          </nav>
          
          {/* Song List Sidebar */}
          <div className={`sidebar ${isSongListOpen ? 'open' : ''}`} style={{ backgroundImage: `url(${bgSidebarImage})` }}>
            <div className="sidebar-header">
              Song List
            </div>
            <ul>
              {songs.map((song, index) => (
                <li key={index} className="song-item" onClick={() => setCurrentSongIndex(index)}>
                  <div className="song-info-sidebar">
                    <img src={songSidebarIcon} alt="Song Sidebar Icon" className="song-sidebar-icon" />
                    <span className="sidebar-song">
                      {song.title}
                    </span>
                  </div>
                  <div className="song-bg" style={{ backgroundImage: `url(${song.backgroundUrl})` }}></div>
                  <span className="sidebar-song-title">
                    {song.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="leave-button">
            <img src={leaveIcon} alt="Leave" className="leave-icon" style={{ width: '26p</button>x', height: '26px' }} onClick={handleLeaveClick} /> 
          </div>
        </header>

        {/* Current Page Content */}
        <div className="content-layer">
          {/* Background Image */}
          <div className="background-image">
            <img src={currentSong && currentSong.backgroundUrl ? `${currentSong.backgroundUrl}` : ''} alt="Background" />
          </div>
          
          {/* Content and Buttons */}
          <div className="song-content">
            {/* User Profile */}
            <div className="user-profile">
              <table>
                <tr>
                  <td>
                    <div className="user-name">{userProfile.name }</div>
                    <div className="user-id">ID: {userProfile.id }</div>
                  </td>
                  <td>
                    <Link to="/ProfilePage">
                      <img src={userProfile.profilePic || profilePicPlaceholder} alt="Profile" className="profile-img" />
                    </Link>
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
                <div className="difficulty-text">Song level</div>
                <div className="difficulty-value">{currentSong?.difficulty}</div>
              </div>
              <div className="song-info">
                <div className="song-name">{currentSong?.title }</div>
                <div className="artist-name">- {currentSong?.artist } -</div>
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
      <Unity unityProvider={unityProvider} />
      {isGameOver === true && (
        <p>{`Game Over ${userName}! You've scored ${score} points.`}</p>
      )}
    </Fragment>
  );
}

export default SongPage;
