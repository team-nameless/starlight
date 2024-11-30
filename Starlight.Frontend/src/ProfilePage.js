import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePageStyle.css';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './LandingPageApp';
import HistoryPage from './HistoryPage';
import SongPage from './SongPage';
import EventPage from './EventPage';
import StorePage from './StorePage';
import profilePicPlaceholder from './assets/profile.png'; 
import logoIcon from './assets/Starlight-logo.png'; 
import leaveIcon from './assets/Header_Items/Leave-icon.png'; 
import songsIcon from './assets/Header_Items/songs-icon.png'; 
import historyIcon from './assets/Header_Items/history-icon.png'; 
import eventsIcon from './assets/Header_Items/events-icon.png'; 
import storeIcon from './assets/Header_Items/store-icon.png'; 
import chatimage from './assets/modal-image/chat.png'; 
import girlImage from './assets/modal-image/girlimage.png'; 
import { useNavigate } from 'react-router-dom';

const rootUrl = "https://cluster1.swyrin.id.vn";

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="level-container">
      <div className="level">
        <span>Level 1</span>
        <span id="progress-text">{`${current}/${total}`}</span>
      </div>
      <div className="level">
        <span>Next Level</span>
        <span>Level 2</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Phong", message: "Ê, đi đá banh k", color: "green", time: "02:02:34 PM", avatar: girlImage },
    { id: 2, sender: "Xích", message: "Meo meo", color: "red", time: "3:35:13 AM", avatar: girlImage },
    { id: 3, sender: "Lan", message: "Cậu ăn cơm chưa", color: "orange", time: "08:07:23 AM", avatar: girlImage },
  ]); 
  const [newMessage, setNewMessage] = useState(""); 
  const [activeTab, setActiveTab] = useState('scoreRecord');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [levelData, setLevelData] = useState({ level: 1, exp: 0, expNeededForNextLevel: 100 });
  const [passwordUpdate, setPasswordUpdate] = useState({ email: '', newPassword: '', confirmNewPassword: '' });
  const [emailUpdate, setEmailUpdate] = useState({ email: '', password: '', newEmail: '' });
  const [popupMessage, setPopupMessage] = useState('');
  const [passwordError, setPasswordError] = useState({ email: '', newPassword: '', confirmNewPassword: '' });
  const [showPopupUpdate, setShowPopupUpdate] = useState(false);
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*]).{8,}$/;

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          setLevelData({
            level: userData.level || 1,
            exp: userData.exp || 0,
            expNeededForNextLevel: userData.expNeededForNextLevel || 100
          });
          setIsLoggedIn(true); 
        } else {
          console.error('Error fetching user data:', userResponse.statusText);
        }
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

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newChatMessage = {
        id: chatMessages.length + 1,
        sender: "You",
        message: newMessage,
        color: "blue", 
        time: new Date().toLocaleTimeString(),
        avatar: userProfile.profilePic || profilePicPlaceholder
      };
      setChatMessages([...chatMessages, newChatMessage]);
      setNewMessage(""); 
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handlePasswordChange = (e) => {
    setPasswordUpdate({ ...passwordUpdate, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmailUpdate({ ...emailUpdate, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async () => {
    setPasswordError({ email: '', newPassword: '', confirmNewPassword: '' });
    if (!passwordUpdate.email) {
      setPasswordError((prev) => ({ ...prev, email: 'The email is not matching' }));
      return;
    }
    if (!passwordRegex.test(passwordUpdate.newPassword)) {
      setPasswordError((prev) => ({ ...prev, newPassword: 'Your passwords should be at least 8 characters in length, uppercase, number, and special characters' }));
      return;
    }
    if (passwordUpdate.newPassword !== passwordUpdate.confirmNewPassword) {
      setPasswordError((prev) => ({ ...prev, confirmNewPassword: 'New Passwords do not match' }));
      return;
    }
    try {
      const response = await axios.patch(`${rootUrl}/api/user/profile`, {
        email: passwordUpdate.email,
        newPassword: passwordUpdate.newPassword,
      });
      if (response.status === 200) {
        setPopupMessage('Password updated successfully');
      } else {
        setPopupMessage('Error updating password');
      }
    } catch (error) {
      setPopupMessage('Error updating password');
    }
    setShowPopupUpdate(true);
  };

  const handleEmailUpdate = async () => {
    try {
      const response = await axios.patch(`${rootUrl}/api/user/profile`, {
        email: emailUpdate.email,
        password: emailUpdate.password,
        newEmail: emailUpdate.newEmail,
      });
      if (response.status === 200) {
        setPopupMessage('Email updated successfully');
      } else {
        setPopupMessage('Error updating email');
      }
    } catch (error) {
      setPopupMessage('Error updating email');
    }
    setShowPopupUpdate(true);
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
      <div className="profile-page">
        <header className="nav3h">
          <nav className="nav3">
            <Link to="/SongPage">
              <img src={songsIcon} alt="Songs" className="nav-iconh" />
              <span>Songs</span>
            </Link>
            <Link to="/HistoryPage">
              <img src={historyIcon} alt="History" className="nav-iconh" />
              <span>History</span>
            </Link>
            <Link to="/EventPage">
              <img src={eventsIcon} alt="Events" className="nav-iconh" />
              <span>Events</span>
            </Link>
            <Link to="/StorePage">
              <img src={storeIcon} alt="Store" className="nav-iconh" />
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

        <div className="profile-container">
          <div className="profile-avatar-container">
            <div className="avatar-indicator"></div> 
            <div className="profile-avatar-section">
              <img src={userProfile.profilePic || profilePicPlaceholder} alt="Profile" className="profile-img-avatar" />
              <div className="profile-username-avatar">{userProfile.name || 'Sanraku'}</div>
              <div className="profile-userid-avatar">ID: #{userProfile.id || '12345'}</div>
            </div>
            <div className="profile-tabs-section">
              <div className="profile-tabs">
                <span className={`profile-tab ${activeTab === 'scoreRecord' ? 'active' : ''}`} onClick={() => handleTabClick('scoreRecord')}>Score Record</span>
                <span className={`profile-tab ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => handleTabClick('achievements')}>Achievements</span>
                <span className={`profile-tab ${activeTab === 'accountSetting' ? 'active' : ''}`} onClick={() => handleTabClick('accountSetting')}>Account Setting</span>
              </div>
              <ProgressBar current={levelData.exp} total={levelData.expNeededForNextLevel} />
            </div>
            <div className="profile-playtime-section">
              <div>Play time:</div>
              <div>Last Played:</div>
            </div>
        
          </div>
            <div className="profile-info-container">
              {activeTab === 'scoreRecord' && (
                <div className="profile-score-record">
                  <div>No</div>
                  <div>Song Name</div>
                  <div>Record</div>
                  <div>Accuracy</div>
                  <div>Max Combo</div>
                  <div>CP</div>
                  <div>P</div>
                  <div>G</div>
                  <div>B</div>
                  <div>M</div>
                  <div>Tier</div>
                </div>
              )}
              {activeTab === 'achievements' && (
                <div className="profile-achievements">
                </div>
              )}
              {activeTab === 'accountSetting' && (
                <div className="profile-account-setting">
                  <div className="update-password">
                    <h2>Update Password</h2>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={passwordUpdate.email}
                      onChange={handlePasswordChange}
                      className="input-field"
                    />
                    {passwordError.email && <div className="error-message">{passwordError.email}</div>}
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={passwordUpdate.newPassword}
                      onChange={handlePasswordChange}
                      className="input-field"
                    />
                    {passwordError.newPassword && <div className="error-message">{passwordError.newPassword}</div>}
                    <input
                      type="password"
                      name="confirmNewPassword"
                      placeholder="Confirm New Password"
                      value={passwordUpdate.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="input-field"
                    />
                    {passwordError.confirmNewPassword && <div className="error-message">{passwordError.confirmNewPassword}</div>}
                    <button onClick={handlePasswordUpdate} className="update-button">Update</button>
                  </div>

                  <div className="update-email">
                    <h2>Update Email Address</h2>
                    <input
                      type="email"
                      name="email"
                      placeholder="Current Email"
                      value={emailUpdate.email}
                      onChange={handleEmailChange}
                      className="input-field"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Current Password"
                      value={emailUpdate.password}
                      onChange={handleEmailChange}
                      className="input-field"
                    />
                    <input
                      type="email"
                      name="newEmail"
                      placeholder="New Email"
                      value={emailUpdate.newEmail}
                      onChange={handleEmailChange}
                      className="input-field"
                    />
                    <button onClick={handleEmailUpdate} className="update-button">Update</button>
                  </div>
                </div>
              )}
            </div>
       </div>

        <div className="userprofile">
          <table>
            <tbody>
              <tr>
                <td>
                  <div className="username">{userProfile.name || 'Sanraku'}</div>
                  <div className="userid">ID: #{userProfile.id || '12345'}</div>
                </td>
                <td>
                  <img src={userProfile.profilePic || profilePicPlaceholder} alt="Profile" className="profileimg" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="chat-container">
        <img src={chatimage} alt="Chat" className="chatimage"/>
        <h3>Online Chat</h3>
          <div className="chat-body">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.color}`}>
                <img src={msg.avatar} alt="Avatar" className="chat-avatar" />
                <div className="chat-message-content">
                  <div className="message-sender">{msg.sender}</div>
                  <div className="message-content">{msg.message}</div>
                </div>
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

        

        {showPopupUpdate && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>{popupMessage.includes('Error') ? 'Error' : 'Success'}</h2>
              <p>{popupMessage}</p>
              <button className="stay-button" onClick={() => setShowPopupUpdate(false)}>Close</button>
            </div>
          </div>
        )}
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
