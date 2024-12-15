import React, { useState, useEffect, lazy, Suspense, useCallback, useRef } from 'react';
import axios from 'axios';
import './Main_Menu_Style.css';
import { Link, useLocation, useParams } from 'react-router-dom';
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
import testHeatmapData from './test_heatmap.json';
import sparkle from './assets/sparkle.png'; // Import the sparkle image

const rootUrl = "https://cluster1.swyrin.id.vn";

const LandingPage = lazy(() => import('./LandingPageApp'));
const EventPage = lazy(() => import('./EventPage'));
const StorePage = lazy(() => import('./StorePage'));
const ProfilePage = lazy(() => import('./ProfilePage'));

function HistoryPage() {
  const { songId, songIndex } = useParams();
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(songIndex);
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
    const fetchSongData = async () => {
      try {
        const response = await axios.get(`${rootUrl}/api/track/${songId}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        setCurrentSong(response.data);
        setCurrentSongIndex(songIndex);
      } catch (error) {
        console.error('Error fetching song data:', error);
      }
    };

    fetchSongData();
  }, [songId, songIndex]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all songs data
        const songsResponse = await axios.get(`${rootUrl}/api/track/all`, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        const fetchedSongs = songsResponse.data;
        setSongs(fetchedSongs);
        const songIndex = fetchedSongs.findIndex(song => song.id === parseInt(songId));
        if (songIndex !== -1) {
          setCurrentSongIndex(songIndex);
          setCurrentSong(fetchedSongs[songIndex]);
          hasRenderedHeatmap1.current = false;
          hasRenderedHeatmap2.current = false;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [songId]);

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

    playAudio(); 

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
      const response = await axios.get(`${rootUrl}${url}`, {
        withCredentials: true
      });

      const data = JSON.parse(response.data["rawJson"]);

      // Validate the response and structure (adjust this as per your API's response format)
      if (data && data.partial && Array.isArray(data.partial)) {
        const durationInSeconds = Math.floor(data.stats.duration / 1000);
        const groups = Array.from({ length: 30 }, (_, i) => (i + 1) * Math.floor(durationInSeconds / 30));
        const variables = ['CP', 'P', 'G', 'B', 'M'];
        const heatmapData = [];
  
        data.partial.forEach((segment, index) => {
          const totalNotes = segment.totalNotes;
          heatmapData.push({
            group: groups[index],
            variable: 'M',
            value: (segment.miss / totalNotes) * 100,
            segment: segment.miss,
            totalNotes: totalNotes
          });
          heatmapData.push({
            group: groups[index],
            variable: 'B',
            value: (segment.bad / totalNotes) * 100,
            segment: segment.bad,
            totalNotes: totalNotes
          });
          heatmapData.push({
            group: groups[index],
            variable: 'G',
            value: (segment.good / totalNotes) * 100,
            segment: segment.good,
            totalNotes: totalNotes
          });
          heatmapData.push({
            group: groups[index],
            variable: 'P',
            value: (segment.bad / totalNotes) * 100,
            segment: segment.bad,
            totalNotes: totalNotes
          });
          heatmapData.push({
            group: groups[index],
            variable: 'CP',
            value: (segment.crit / totalNotes) * 100,
            segment: segment.crit,
            totalNotes: totalNotes
          });
        });
  
        return { data: heatmapData, score: data.stats.score, isFallback: false };
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
  
      // Use test_heatmap.json data
      const data = testHeatmapData;
      const durationInSeconds = Math.floor(data.stats.duration / 1000);
      const groups = Array.from({ length: 30 }, (_, i) => (i + 1) * Math.round(durationInSeconds / 30));
      const heatmapData = [];
  
      data.partial.forEach((segment, index) => {
        const totalNotes = segment.totalNotes;
        heatmapData.push({
          group: groups[index],
          variable: 'M',
          value: (segment.miss / totalNotes) * 100,
          segment: segment.miss,
          totalNotes: totalNotes
        });
        heatmapData.push({
          group: groups[index],
          variable: 'B',
          value: (segment.bad / totalNotes) * 100,
          segment: segment.bad,
          totalNotes: totalNotes
        });
        heatmapData.push({
          group: groups[index],
          variable: 'G',
          value: (segment.good / totalNotes) * 100,
          segment: segment.good,
          totalNotes: totalNotes
        });
        heatmapData.push({
          group: groups[index],
          variable: 'P',
          value: (segment.bad / totalNotes) * 100,
          segment: segment.bad,
          totalNotes: totalNotes
        });
        heatmapData.push({
          group: groups[index],
          variable: 'CP',
          value: (segment.crit / totalNotes) * 100,
          segment: segment.crit,
          totalNotes: totalNotes
        });
      });
  
      return { data: heatmapData, score: data.stats.score, isFallback: true };
    }
  };

  const fetchOverallScore = async (url) => {
    try {
      const response = await axios.get(`${rootUrl}${url}`, {
        withCredentials: true
      });
      const data = JSON.parse(response.data["rawJson"]);
      return data.stats.score || 100000;
    } catch (error) {
      console.error('Error fetching overall score:', error);
      return testHeatmapData.stats.score;
    }
  };
  
  const fetchGrade = async (url) => {
    try {
      const response = await axios.get(`${rootUrl}${url}`, {
        withCredentials: true
      });
      const data = JSON.parse(response.data["rawJson"]);
      return data.stats.grade || 'A'; 
    } catch (error) {
      console.error('Error fetching grade:', error);
      return testHeatmapData.stats.grade;
    }
  };

  const heatmapContainer1Ref = useRef(null);
  const heatmapContainer2Ref = useRef(null);
  const hasRenderedHeatmap1 = useRef(false);
  const hasRenderedHeatmap2 = useRef(false);

  const renderHeatmap = useCallback(async (url, containerRef, scoreUrl, songId) => {
    const container = containerRef.current;
    if (!container) {
      console.error(`Container not found.`);
      return;
    }
  
    // Clear existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  
    // Fetch overall score and grade
    const overallScore = await fetchOverallScore(scoreUrl);
    const grade = await fetchGrade(scoreUrl);
  
    // Add overall score
    const scoreElement = document.createElement('div');
    scoreElement.className = 'overall-score';
    const sparkleLeft = document.createElement('img');
    sparkleLeft.src = sparkle;
    sparkleLeft.style.width = '32px';
    sparkleLeft.style.height = '32px';
    sparkleLeft.style.verticalAlign = 'middle';
    sparkleLeft.style.display = 'inline';
    sparkleLeft.style.marginBottom = '5px';
    const sparkleRight = sparkleLeft.cloneNode();
    scoreElement.appendChild(sparkleLeft);
    scoreElement.appendChild(document.createTextNode(` ${overallScore} `));
    scoreElement.appendChild(sparkleRight);
    container.appendChild(scoreElement);
  
    // Add grade
    const gradeElement = document.createElement('div');
    gradeElement.textContent = `- Grade: ${grade} -`;
    gradeElement.className = 'grade';
    container.appendChild(gradeElement);
  
    // Fetch data for the heatmap
    const { data, isFallback } = await fetchHeatmapData(url);
  
    // Dimensions and margins
    const margin = { top: 0, right: 25, bottom: 50, left: 50 }; // Adjusted margins
    const width = 900 - margin.left - margin.right; // Adjusted width
    const height = 186 - margin.top - margin.bottom; // Adjusted height
  
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
  
    const cellSize = 25;
    const gap = 2;
    const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
    const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.05);
  
    const myColor = d3.scaleLinear().domain([0, 33, 66, 100]).range(['#14432a', '#166b34', '#37a446', '#4dd05a']);
  
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
      
    const mouseover = function (event, d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("stroke", "black").style("opacity", 1);
    };
  
    const mousemove = function (event, d) {
      tooltip
        .html(`BeatperTotal: ${d.segment} / ${d.totalNotes}<br>Beat Accuracy: (${Math.floor(d.value) || 0}%)`)
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
      .attr("x", (d) => x(d.group) + gap / 2)
      .attr("y", (d) => y(d.variable) + gap / 2)
      .attr("width", cellSize - gap)
      .attr("height", cellSize - gap)
      .attr("rx", 4) 
      .attr("ry", 4)
      .style("fill", (d) => myColor(d.value || 0))
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  
    if (isFallback) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "red")
        .text("Data fetched from test_heatmap.json");
    }
  }, []);
  
  useEffect(() => {
    const renderHeatmap1 = async () => {
      if (currentSong) {
        hasRenderedHeatmap1.current = false;
        await renderHeatmap(`/api/score/${currentSong.id}/recent`, heatmapContainer1Ref, `/api/score/${currentSong.id}/recent`, currentSong.id);
      }
    };
    renderHeatmap1();
  }, [renderHeatmap, currentSong]);

  useEffect(() => {
    const renderHeatmap2 = async () => {
      if (currentSong) {
        hasRenderedHeatmap2.current = false;
        await renderHeatmap(`/api/score/${currentSong.id}/best`, heatmapContainer2Ref, `/api/score/${currentSong.id}/best`, currentSong.id);
      }
    };
    renderHeatmap2();
  }, [renderHeatmap, currentSong]);

  useEffect(() => {
    if (currentSong && currentSong.id === parseInt(songId)) {
      hasRenderedHeatmap1.current = false;
      hasRenderedHeatmap2.current = false;
    }
  }, [currentSong, songId]);
  
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
            <Link to= { `/historypage/${songId}/${songIndex}` } >
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
                <li key={index} className="song-item" onClick={() => {
                  const imgElement = document.querySelector('.background-image img');
                  if (imgElement) {
                    imgElement.classList.add('fade-out');
                    imgElement.addEventListener('transitionend', () => {
                      setCurrentSong(song);
                      imgElement.classList.remove('fade-out');
                    }, { once: true });
                  }
                }}>
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

          {/* Song Name and Artist */}
          <div className="song-info-history">
            <div className="song-name-history">{currentSong?.title}</div>
            <div className="artist-name-history">- {currentSong?.artist} -</div>
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
          <h3 className="heatmap-title latest-score-title">Latest Score</h3>
          <div id="heatmap-container-1" className="heatmap-container" ref={heatmapContainer1Ref}></div>
          <h3 className="heatmap-title best-score-title">Best Score</h3>
          <div id="heatmap-container-2" className="heatmap-container" ref={heatmapContainer2Ref}></div>
          
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
