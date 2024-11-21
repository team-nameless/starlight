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
import previousArrow from './assets/previousArrow.png'; // Previous button arrow
import nextArrow from './assets/nextArrow.png'; // Next button arrow
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import './Heatmap_Style.css'; // Custom styles for the heatmap

const rootUrl = "https://cluster1.swyrin.id.vn";

function HistoryPage() {
  const location = useLocation();
  const currentSongFromLocation = location.state?.currentSong || null;
  const currentSongIndexFromLocation = location.state?.currentSongIndex || 0;
  const [currentSong, setCurrentSong] = useState(currentSongFromLocation);
  const [currentSongIndex, setCurrentSongIndex] = useState(currentSongIndexFromLocation);
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [songs, setSongs] = useState([]);
  const [heatmapLatestData, setHeatmapLatestData] = useState([]);
  const [heatmapBestData, setHeatmapBestData] = useState([]);

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

  const fetchHeatmapData = async (url) => {
    try {
      const response = await axios.get(`${rootUrl}${url}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      return []; // Return empty array on error
    }
  };

  const renderHeatmap = (data, selector) => {
    const container = document.querySelector(selector);
    if (!container) return;
  
    container.innerHTML = "";
  
    const cal = new CalHeatmap();
    const dataMap = {};
  
    data.forEach((d) => {
      const timestamp = `${d.x}-${d.y}`;
      dataMap[timestamp] = d.value;
    });
  
    cal.paint({
      data: { source: dataMap },
      range: 30,
      domain: {
        type: "column",
        label: { text: "Segments", textAlign: "center", position: "top" },
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
      tooltip: {
        enabled: true,
        html: (timestamp) => {
          const cellData = data.find((d) => `${d.x}-${d.y}` === timestamp);
          if (cellData) {
            return `Hits: ${cellData.hits}/${cellData.totalBeats} (${cellData.value}%)`;
          }
          return "No data";
        },
      },
      verticalOrientation: true, // Ensure vertical orientation
      itemName: ["beat", "beats"], // Add itemName to properly render data cells
    });
  };
  
  const renderHeatmapContainer = (title, heatmapId) => (
    <div className="heatmap-container">
      <h3>{title}</h3>
      <div className="heatmap-details">
        <div className="judgement-column">
          <div className="judgement-title">Combo</div>
          <div>CP: {Math.floor(Math.random() * 100)}</div>
          <div>P: {Math.floor(Math.random() * 100)}</div>
          <div>G: {Math.floor(Math.random() * 100)}</div>
          <div>B: {Math.floor(Math.random() * 100)}</div>
          <div>M: {Math.floor(Math.random() * 100)}</div>
        </div>
        <div className="heatmap-column">
          <div className="overall-score">
            ✨{Math.floor(Math.random() * 100000)}✨
          </div>
          <div id={heatmapId}></div>
          <div className="segment-times">
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className="segment-time">{i + 1}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  useEffect(() => {
    const fetchAndSetHeatmapData = async () => {
      const latestData = await fetchHeatmapData('/api/user/score/recent');
      const bestData = await fetchHeatmapData('/api/user/score/all');
      setHeatmapLatestData(latestData);
      setHeatmapBestData(bestData);
    };
  
    fetchAndSetHeatmapData();
  }, []);
  
  useEffect(() => {
    renderHeatmap(heatmapLatestData, "#heatmap-latest-container");
  }, [heatmapLatestData]);
  
  useEffect(() => {
    renderHeatmap(heatmapBestData, "#heatmap-best-container");
  }, [heatmapBestData]);
  

  return (
    <div className="historypage">
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

        {renderHeatmapContainer("Latest Play", "heatmap-latest-container")}
        {renderHeatmapContainer("Best Score", "heatmap-best-container")}
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

export default HistoryPage;
