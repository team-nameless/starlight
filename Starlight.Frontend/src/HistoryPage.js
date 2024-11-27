import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
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
import './Heatmap_Style.css'; // Custom styles for the heatmap
import Fuse from 'fuse.js';
import { FaSearch } from 'react-icons/fa';
import * as d3 from 'd3';
import 'd3-scale-chromatic';

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
  const [searchQuery, setSearchQuery] = useState('');
  const fuse = new Fuse(songs, { keys: ['title'], threshold: 0.3 });

  const filteredSongs = searchQuery ? fuse.search(searchQuery).map(result => result.item) : songs;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

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

  const handleNextSong = useCallback(() => {
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
  }, [songs]);

  const handlePreviousSong = useCallback(() => {
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
  }, [songs]);

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

  const fetchHeatmapData = async (url) => {
    try {
      const response = await axios.get(`${rootUrl}${url}`);
      const data = response.data;
  
      // Validate the response and structure (adjust this as per your API's response format)
      if (Array.isArray(data)) {
        return { data, isRandom: false };
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
  
      // Generate random fallback data
      const randomData = [];
      const groups = ['A', 'B', 'C', 'D', 'E'];
      const variables = ['1', '2', '3', '4', '5'];
  
      for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < variables.length; j++) {
          randomData.push({
            group: groups[i],
            variable: variables[j],
            value: Math.floor(Math.random() * 100),
          });
        }
      }
  
      return { data: randomData, isRandom: true };
    }
  };
  
  const renderHeatmap = useCallback(async (url, selector) => {
    const container = document.querySelector(selector);
    if (!container) {
      console.error(`Container with selector "${selector}" not found.`);
      return;
    }
  
    // Clear existing content
    container.innerHTML = "";
  
    // Fetch data for the heatmap
    const { data, isRandom } = await fetchHeatmapData(url);
  
    // Dimensions and margins
    const margin = { top: 50, right: 25, bottom: 10, left: 10 };
    const width = 170 - margin.left - margin.right;
    const height = 170 - margin.top - margin.bottom;
  
    // Append the SVG
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Scales
    const myGroups = Array.from(new Set(data.map((d) => d.group)));
    const myVars = Array.from(new Set(data.map((d) => d.variable)));
  
    const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
    const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.05);
  
    const myColor = d3.scaleSequential().interpolator(d3.interpolateInferno).domain([0, 100]);
  
    // Add axes
    svg
      .append("g")
      .style("font-size", 15)
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain")
      .remove();
  
    svg
      .append("g")
      .style("font-size", 15)
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain")
      .remove();
  
    // Tooltip
    const tooltip = d3
      .select(container)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");
  
    const mouseover = function (event, d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("stroke", "black").style("opacity", 1);
    };
  
    const mousemove = function (event, d) {
      tooltip
        .html(`Beat Accuracy: ${d.value || 0}%`)
        .style("left", `${event.pageX + 20}px`)
        .style("top", `${event.pageY - 20}px`);
    };
  
    const mouseleave = function () {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none").style("opacity", 0.8);
    };
  
    // Draw rectangles
    svg
      .selectAll()
      .data(data, (d) => `${d.group}:${d.variable}`)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.group))
      .attr("y", (d) => y(d.variable))
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d) => myColor(d.value || 0))
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  
    // Add titles
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -50)
      .attr("text-anchor", "left")
      .style("font-size", "22px")
      .text("A d3.js heatmap");
  
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -20)
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .style("fill", "grey")
      .style("max-width", 400)
      .text(isRandom ? "Randomized data due to fetch error." : "Data fetched successfully.");
  }, []);
  
  const renderHeatmapContainer = useCallback(async (title, heatmapId, url) => {
    const data = await fetchHeatmapData(url);
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
  }, []);
  
  useEffect(() => {
    const renderLatestHeatmap = async () => {
      const heatmapContainer = await renderHeatmapContainer("Latest Play", "heatmap-latest-container", "/api/score/recent");
      setLatestHeatmap(heatmapContainer);
      await renderHeatmap('/api/score/recent', "#heatmap-latest-container");
    };
    renderLatestHeatmap();
  }, [renderHeatmap, renderHeatmapContainer]);
  
  useEffect(() => {
    const renderBestHeatmap = async () => {
      const heatmapContainer = await renderHeatmapContainer("Best Score", "heatmap-best-container", "/api/score/all");
      setBestHeatmap(heatmapContainer);
      await renderHeatmap('/api/score/all', "#heatmap-best-container");
    };
    renderBestHeatmap();
  }, [renderHeatmap, renderHeatmapContainer]);
  

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
            <div className="search-bar-container">
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <label htmlFor="search" className="screen-reader-text">Search</label>
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
              {filteredSongs.map((song, index) => (
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
