import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import previousArrow from './assets/previousArrow.png'; // Previous button arrow
import nextArrow from './assets/nextArrow.png'; // Next button arrow
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import './Heatmap_Style.css'; // Custom styles for the heatmap

const rootUrl = "https://cluster1.swyrin.id.vn";

const LandingPage = lazy(() => import('./LandingPageApp'));
const EventPage = lazy(() => import('./EventPage'));
const StorePage = lazy(() => import('./StorePage'));
const ProfilePage = lazy(() => import('./ProfilePage'));

function HistoryPage() {
  const location = useLocation();
  const currentSongFromLocation = location.state?.currentSong || null;
  const currentSongIndexFromLocation = location.state?.currentSongIndex || 0;
  const [currentSong, setCurrentSong] = useState(currentSongFromLocation);
  const [currentSongIndex, setCurrentSongIndex] = useState(currentSongIndexFromLocation);
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [songs, setSongs] = useState([]);
  const [latestHeatmap, setLatestHeatmap] = useState(null);
  const [bestHeatmap, setBestHeatmap] = useState(null);

  useEffect(() => {
    setCurrentSong(currentSongFromLocation);
    setCurrentSongIndex(currentSongIndexFromLocation);
  }, [currentSongFromLocation, currentSongIndexFromLocation]);

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
          setCurrentSong(fetchedSongs[0]);
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

  const handleNextSong = () => {
    const imgElement = document.querySelector('.background-image img');
    if (imgElement) {
      imgElement.classList.add('fade-out');
      imgElement.addEventListener('transitionend', () => {
        setCurrentSongIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % songs.length;
          setCurrentSong(songs[newIndex]);
          return newIndex;
        });
        imgElement.classList.remove('fade-out');
      }, { once: true });
    }
  };

  const handlePreviousSong = () => {
    const imgElement = document.querySelector('.background-image img');
    if (imgElement) {
      imgElement.classList.add('fade-out');
      imgElement.addEventListener('transitionend', () => {
        setCurrentSongIndex((prevIndex) => {
          const newIndex = (prevIndex - 1 + songs.length) % songs.length;
          setCurrentSong(songs[newIndex]);
          return newIndex;
        });
        imgElement.classList.remove('fade-out');
      }, { once: true });
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

  const fetchHeatmapData = async (url, dataType) => {
    try {
      const response = await axios.get(`${rootUrl}${url}`, {
        headers: {
          'Content-Type': dataType === 'csv' ? 'json' : 'application/json'
        }
      });
      return dataType === 'csv' ? response.data : response.data;
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      return []; // Return empty array on error
    }
  };

  const renderHeatmap = async (url, selector, dataType = "json") => {
    const container = document.querySelector(selector);
    if (!container) return;

    container.innerHTML = "";

    const data = await fetchHeatmapData(url, dataType);

    const cal = new CalHeatmap();
    cal.paint({
      data: {
        source: data,
        type: dataType,
        x: "x",
        y: "y",
        value: "value"
      },
      range: 30,
      domain: {
        type: "column",
        label: {
          text: (timestamp) => `${Math.floor(timestamp / 1000)}s`,
          textAlign: "center",
          position: "top"
        },
      },
      subDomain: {
        type: "row",
        label: { text: "Accuracy", textAlign: "start", position: "start" },
        width: 20,
        height: 20,
        gutter: 5,
      },
      scale: {
        color: {
          type: "threshold",
          range: ["#14432a", "#166b34", "#37a446", "#4dd05a"],
          domain: [25, 50, 75, 100],
        },
      },
      itemSelector: selector,
      legend: {
        show: true,
        position: "bottom",
      },
      verticalOrientation: true,
      itemName: ["beat", "beats"],
    });

    return cal;
  };

  const renderHeatmapContainer = async (title, heatmapId, url, dataType = "json") => {
    const data = await fetchHeatmapData(url, dataType);
    const judgmentData = data.judgment || {};
    const overallScore = data.overallScore || 0;

    return (
      <div className="heatmap-container">
        <h3>{title}</h3>
        <div className="heatmap-details">
          <div className="judgement-column">
            <div className="judgement-title">Combo</div>
            <div>CP: {judgmentData.cp || 1000}</div>
            <div>P: {judgmentData.p || 1000}</div>
            <div>G: {judgmentData.g || 1000}</div>
            <div>B: {judgmentData.b || 1000}</div>
            <div>M: {judgmentData.m || 1000}</div>
          </div>
          <div className="heatmap-column">
            <div className="overall-score">
              ✨{overallScore || 100000}✨
            </div>
            <div id={heatmapId}></div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const renderLatestHeatmap = async () => {
      const cal = await renderHeatmap('/api/user/score/recent', "#heatmap-latest-container", "json");
      const heatmapContainer = await renderHeatmapContainer("Latest Play", "heatmap-latest-container", "/api/user/score/recent", "json");
      setLatestHeatmap(heatmapContainer);
      setInterval(async () => {
        const data = await fetchHeatmapData('/api/user/score/recent', "json");
        cal.fill({ source: data });
      }, 60000); // Update every 60 seconds
    };
    renderLatestHeatmap();
  }, []);

  useEffect(() => {
    const renderBestHeatmap = async () => {
      const cal = await renderHeatmap('/api/user/score/all', "#heatmap-best-container", "json");
      const heatmapContainer = await renderHeatmapContainer("Best Score", "heatmap-best-container", "/api/user/score/all", "json");
      setBestHeatmap(heatmapContainer);
      setInterval(async () => {
        const data = await fetchHeatmapData('/api/user/score/all', "json");
        cal.fill({ source: data });
      }, 60000); // Update every 60 seconds
    };
    renderBestHeatmap();
  }, []);

  return (
    <div className="historypage">
      <Suspense fallback={<div>Loading...</div>}>
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
            <Link to="/eventpage" state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}>
              <img src={eventsIcon} alt="Events" className="nav-icon" />
              <span>Events</span>
            </Link>
            <Link to="/storepage" state={{ currentSong: currentSong, currentSongIndex: currentSongIndex }}>
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
                <li key={index} className="song-item" onClick={() => setCurrentSong(song)}>
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
            <img src={leaveIcon} alt="Leave" className="leave-icon" style={{ width: '26px', height: '26px' }} onClick={handleLeaveClick} />
          </div>
        </header>

        {/* Current Page Content */}
        <div className="content-layer">
          {/* Background Image */}
          <div className="background-image">
            <img src={currentSong && currentSong.backgroundUrl ? `${currentSong.backgroundUrl}` : ''} alt="Background" />
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

          {/* Render Heatmaps */}
          {latestHeatmap}
          {bestHeatmap}
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
      </Suspense>
    </div>
  );
}

export default HistoryPage;
