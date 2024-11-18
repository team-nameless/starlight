import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePageStyle.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPageApp';
import HistoryPage from './HistoryPage';
import SongPage from './SongPage';
import EventPage from './EventPage';
import StorePage from './StorePage';
import profilePicPlaceholder from './assets/profile.png'; // Placeholder for profile image
import logoIcon from './assets/Starlight-logo.png'; // Logo image
import leaveIcon from './assets/Header_Items/Leave-icon.png'; // Leave icon
import songsIcon from './assets/Header_Items/songs-icon.png'; // Songs icon
import historyIcon from './assets/Header_Items/history-icon.png'; // History icon
import eventsIcon from './assets/Header_Items/events-icon.png'; // Events icon
import storeIcon from './assets/Header_Items/store-icon.png'; // Store icon
import chatimage from './assets/modal-image/chat.png'; // Chat icon

const rootUrl = "https://cluster1.swyrin.id.vn";

function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Eleanor", message: "Hello there!", color: "green", time: "15:30" },
    { id: 2, sender: "Doctor", message: "How's it going?", color: "red", time: "15:35" },
    { id: 3, sender: "Alex", message: "Let's play together!", color: "orange", time: "15:40" },
  ]); // Mẫu danh sách tin nhắn
  const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới nhập vào
  const navigate = useNavigate();

  // Fetch user profile data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfileResponse = await axios.get('/api/user-profile');
        setUserProfile(userProfileResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLeaveClick = () => {
    setShowPopup(true);
  };

  const handleConfirmLeave = () => {
    window.location.href = '/';
  };

  const handleCancelLeave = () => {
    setShowPopup(false);
  };

  // Toggle the sidebar visibility
  const toggleSongList = () => {
    setIsSongListOpen(!isSongListOpen);
  };

  // Handle sending a new chat message
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newChatMessage = {
        id: chatMessages.length + 1,
        sender: "You",
        message: newMessage,
        color: "blue", // Tin nhắn của bạn có khung màu xanh dương
        time: new Date().toLocaleTimeString(),
      };
      setChatMessages([...chatMessages, newChatMessage]);
      setNewMessage(""); // Reset ô nhập tin nhắn
    }
  };

  return (
    <div>
      <Routes>
        <Route path="/SongPage" element={<SongPage />} />
        <Route path="/HistoryPage" element={<HistoryPage />} />
        <Route path="/EventPage" element={<EventPage />} />
        <Route path="/StorePage" element={<StorePage />} />
        <Route path="/Logout" element={<LandingPage />} />
      </Routes>
      <div className="profilepage">
        {/* Header Navigation Bar */}
        <header className="navbar">
          <nav className="nav-links left">
            <Link to="/SongPage">
              <img src={songsIcon} alt="Songs" className="nav-icon" />
              <span>Songs</span>
            </Link>
            <Link to="/HistoryPage">
              <img src={historyIcon} alt="History" className="nav-icon" />
              <span>History</span>
            </Link>
            <Link to="/EventPage">
              <img src={eventsIcon} alt="Events" className="nav-icon" />
              <span>Events</span>
            </Link>
            <Link to="/StorePage">
              <img src={storeIcon} alt="Store" className="nav-icon" />
              <span>Store</span>
            </Link>
          </nav>

          <div className="logo-container">
            <a href="/SongPage" className="logo">
              <span className="star-light">
                <span>STAR</span>         
                  <img src={logoIcon} alt="Logo" className="logo-icon" style={{ verticalAlign: 'middle' }} />
                <span className="light">LIGHT</span>
              </span>
            </a>
          </div>
          <div className="leave-button">
            <img src={leaveIcon} alt="Leave" className="leave-icon" style={{ width: '26px', height: '26px' }} onClick={handleLeaveClick} /> 
        </div>
        </header>

        <div className="container1">
            <div className="containeravt"></div>
            <div className="containerinfo"></div>
       </div>

        {/* User Profile Section */}
        <div className="user-profile">
          <table>
            <tbody>
              <tr>
                <td>
                  <div className="user-name">{userProfile.name || 'Sanraku'}</div>
                  <div className="user-id">ID: #{userProfile.id || '12345'}</div>
                </td>
                <td>
                  <img src={userProfile.profilePic || profilePicPlaceholder} alt="Profile" className="profile-img" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Chat Section */}
        <div className="chat-container">
        <img src={chatimage} alt="Chat" className="chatimage"/>
        <h3>Online Chat</h3>
          <div className="chat-body">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.color}`}>
                <div className="message-sender">{msg.sender}</div>
                <div className="message-content">{msg.message}</div>
                <div className="message-time">{msg.time}</div>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Write a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
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
    </div>
  );
}

export default ProfilePage;
