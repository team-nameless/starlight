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
import cameraIcon from './assets/camera-icon.png';
import BeatAchieve from './assets/Achievement-icons/Beat_achieve.png';
import CrownAchieve from './assets/Achievement-icons/Crown_achieve.png';
import NonStopAchieve from './assets/Achievement-icons/Non-stop_achieve.png';

import { useNavigate } from 'react-router-dom';

const rootUrl = "https://cluster1.swyrin.id.vn";

const ProgressBar = ({ current, total, level }) => {
  const percentage = Math.floor((current / total) * 10000) / 100;
 
  return (
    <div className="level-container">
      <div className="level">
        <span>Level {level}</span>
        <span id="progress-text">{`${current}/${total}`}</span>
      </div>
      <div className="level">
        <span>Next Level</span>
        <span>Level {level + 1}</span>
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
  const [passwordUpdate, setPasswordUpdate] = useState({ email: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [emailUpdate, setEmailUpdate] = useState({ email: '', password: '', newEmail: '' });
  const [popupMessage, setPopupMessage] = useState('');
  const [passwordError, setPasswordError] = useState({ email: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [emailError, setEmailError] = useState({ email: '', password: '' });
  const [showPopupUpdate, setShowPopupUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scoreRecords, setScoreRecords] = useState([]);
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
          const profilePic = userData.avatar || profilePicPlaceholder;
          setUserProfile({
            id: userData.id || 123456,
            name: userData.name || 'Anonymous',
            profilePic: profilePic
          });
          setLevelData({
            level: userData.level || 1,
            exp: userData.exp || 0,
            expNeededForNextLevel: userData.expNeededForNextLevel || 100
          });
          localStorage.setItem('userProfilePic', profilePic);
          setIsLoggedIn(true); 
          setScoreRecords(userData.topScores || []); 
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
    setPasswordError({ email: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setIsLoading(true);
  
    if (!passwordUpdate.email || !passwordUpdate.newPassword || !passwordUpdate.confirmNewPassword) {
      setPasswordError((prev) => ({
        ...prev,
        email: !passwordUpdate.email ? 'Email is required' : prev.email,
        currentPassword: !passwordUpdate.currentPassword ? 'Current Password is required' : prev.currentPassword,
        newPassword: !passwordUpdate.newPassword ? 'New Password is required' : prev.newPassword,
        confirmNewPassword: !passwordUpdate.confirmNewPassword ? 'Confirm New Password is required' : prev.confirmNewPassword,
      }));
      setIsLoading(false);
      return;
    }
  
    try {
      const userResponse = await axios.get(`${rootUrl}/api/user`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
  
      if (userResponse.status === 200) {
        const userData = userResponse.data;
        if (userData.email !== passwordUpdate.email) {
          setPasswordError((prev) => ({ ...prev, email: 'Entered email does not match your account email' }));
          setIsLoading(false);
          return;
        }
      } else {
        throw new Error('Error fetching user data');
      }
    } catch (error) {
      console.error('API error:', error);
      setPasswordError((prev) => ({ ...prev, email: 'Unable to verify email. Please try again later.' }));
      setIsLoading(false);
      return;
    }
  
    if (!passwordRegex.test(passwordUpdate.newPassword)) {
      setPasswordError((prev) => ({ ...prev, newPassword: 'Password must be 8+ characters with uppercase, number, and special characters' }));
      setIsLoading(false);
      return;
    }
    if (passwordUpdate.newPassword !== passwordUpdate.confirmNewPassword) {
      setPasswordError((prev) => ({ ...prev, confirmNewPassword: 'Passwords do not match' }));
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.patch(`${rootUrl}/api/user/profile`, {
        password: passwordUpdate.currentPassword, 
        newPassword: passwordUpdate.newPassword, 
      }, {
        withCredentials: true
      });
  
      if (response.status === 200) {
        setPopupMessage('Password updated successfully');
        setShowPopupUpdate(true);
      } else {
        setPopupMessage('Error updating password');
        setShowPopupUpdate(true);
      }
    } catch (error) {
      console.error('Update error:', error);
      setPopupMessage('Error updating password. Please try again.');
      setShowPopupUpdate(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailUpdate = async () => {
    setEmailError({ email: '', password: '' });
    setIsLoading(true);
  
    if (!emailUpdate.email || !emailUpdate.password || !emailUpdate.newEmail) {
      setEmailError((prev) => ({
        ...prev,
        email: !emailUpdate.email ? 'Current email is required' : prev.email,
        password: !emailUpdate.password ? 'Password is required' : prev.password,
        newEmail: !emailUpdate.newEmail ? 'New email is required' : prev.newEmail,
      }));
      setIsLoading(false);
      return;
    }
  
    try {
      const userResponse = await axios.get(`${rootUrl}/api/user`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
  
      if (userResponse.status === 200) {
        const userData = userResponse.data;
        if (userData.email !== emailUpdate.email) {
          setEmailError((prev) => ({
            ...prev,
            email: 'Entered email does not match your account email',
          }));
          setIsLoading(false);
          return;
        }
      } else {
        throw new Error('Error fetching user data');
      }
    } catch (error) {
      console.error('API error:', error);
      setEmailError((prev) => ({ ...prev, email: 'Unable to verify email. Please try again later.' }));
      setIsLoading(false);
      return;
    }
  
    try {
      const loginResponse = await axios.post(`${rootUrl}/api/login`, {
        email: emailUpdate.email,
        password: emailUpdate.password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
  
      if (loginResponse.status !== 200) {
        setEmailError((prev) => ({
          ...prev,
          password: 'Wrong password',
        }));
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      setEmailError((prev) => ({ ...prev, password: 'Wrong password' }));
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.patch(`${rootUrl}/api/user/profile`, {
        email: emailUpdate.newEmail,
        password: emailUpdate.password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
  
      if (response.status === 200) {
        setPopupMessage('Email updated successfully');
        setShowPopupUpdate(true);
      } else {
        setPopupMessage('Error updating email');
        setShowPopupUpdate(true);
      }
    } catch (error) {
      console.error('Update error:', error);
      setPopupMessage('Error updating email. Please try again.');
      setShowPopupUpdate(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await axios.put(`${rootUrl}/api/user/profile/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
  
        if (response.status === 200) {
          const updatedImage = URL.createObjectURL(file);
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            profilePic: updatedImage
          }));
          localStorage.setItem('userProfilePic', updatedImage);
          window.dispatchEvent(new Event('storage')); 
        } else {
          console.error('Error updating profile image:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    }
  };
  
  const handleCameraIconClick = () => {
    const inputElement = document.getElementById('profilePicInput');
    if (inputElement) {
      inputElement.click();
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable full-screen mode:', err);
      });
    }
  };

  useEffect(() => {
    const storedProfilePic = localStorage.getItem('userProfilePic');
    if (storedProfilePic) {
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        profilePic: storedProfilePic
      }));
    }
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="loader">
          <div className="one"></div>
          <div className="two"></div>
        </div>
      )}
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
              <input
                type="file"
                id="profilePicInput"
                style={{ display: 'none' }}
                onChange={handleProfilePicChange}
              />
              <img
                src={cameraIcon}
                alt="Change Profile"
                className="camera-icon"
                onClick={handleCameraIconClick}
              />
              <div className="profile-username-avatar">{userProfile.name || 'Anonymous'}</div>
              <div className="profile-userid-avatar">ID: {userProfile.id || '12345'}</div>
            </div>
            <div className="profile-tabs-section">
              <div className="profile-tabs">
                <span className={`profile-tab ${activeTab === 'scoreRecord' ? 'active' : ''}`} onClick={() => handleTabClick('scoreRecord')}>Score Record</span>
                <span className={`profile-tab ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => handleTabClick('achievements')}>Achievements</span>
                <span className={`profile-tab ${activeTab === 'accountSetting' ? 'active' : ''}`} onClick={() => handleTabClick('accountSetting')}>Account Setting</span>
              </div>
              <ProgressBar current={levelData.exp} total={levelData.expNeededForNextLevel} level={levelData.level} />
            </div>
            <div className="profile-playtime-section">
              <div>Play time:24h</div>
              <div>Last Played:3h</div>
            </div>
        
          </div>
            <div className="profile-info-container">
              {activeTab === 'scoreRecord' && (
                <>
                  <div className="profile-score-record">
                    <div>No</div>
                    <div style={{ marginLeft: '20px', marginRight: '-22px' }}>Song Name</div>
                    <div style={{ marginLeft: '40px', marginRight: '-35px' }}>Record</div>
                    <div style={{ marginRight: '225px', marginLeft: '28px' }}>Accuracy</div>
                    <div style={{ marginRight: '200px', marginLeft: '-250px' }}>Max Combo</div>
                    <div style={{ marginLeft: '-215px', marginRight:'-95px' }}>CP</div>
                    <div style={{ marginLeft: '110px', marginRight: '-25px' }}>P</div>
                    <div style={{ marginLeft: '50px', marginRight: '5px' }}>G</div>
                    <div style={{ marginLeft: '15px', marginRight: '10px' }}>B</div>
                    <div style={{ marginLeft: '15px', marginRight: '20px' }}>M</div>
                    <div style={{ marginRight: '20px' }}>Tier</div>
                  </div>
                  <div className="top-scores">
                    {scoreRecords.map((record, index) => (
                      <div key={record.trackId} className="top-score-record">
                        <div>{index + 1}</div>
                        <div style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>{record.trackName}</div>
                        <div>{record.totalPoints}</div>
                        <div>{(record.accuracy * 100).toFixed(2)}%</div>
                        <div>{record.maxCombo}</div>
                        <div>{record.critical}</div>
                        <div>{record.perfect}</div>
                        <div>{record.good}</div>
                        <div>{record.bad}</div>
                        <div>{record.miss}</div>
                        <div>{record.grade}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'achievements' && (
                <div className="profile-achievements">
                  <div className="achievement-row">
                    <img src={BeatAchieve} alt="BeatAchieve" className="achievement-icon" />
                    <img src={CrownAchieve} alt="CrownAchieve" className="achievement-icon" />
                    <img src={NonStopAchieve} alt="NonStopAchieve" className="achievement-icon" />
                  </div>
                  <div className="achievement-row">
                    <img src={BeatAchieve} alt="BeatAchieve" className="achievement-icon" />
                    <img src={CrownAchieve} alt="CrownAchieve" className="achievement-icon" />
                    <img src={NonStopAchieve} alt="NonStopAchieve" className="achievement-icon" />
                  </div>
                  <div className="achievement-row">
                    <img src={BeatAchieve} alt="BeatAchieve" className="achievement-icon" />
                    <img src={CrownAchieve} alt="CrownAchieve" className="achievement-icon" />
                    <img src={NonStopAchieve} alt="NonStopAchieve" className="achievement-icon" />
                  </div>
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
                      name="currentPassword"
                      placeholder="Current Password"
                      value={passwordUpdate.currentPassword}
                      onChange={handlePasswordChange}
                      className="input-field"
                    />
                    {passwordError.currentPassword && <div className="error-message">{passwordError.currentPassword}</div>}
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
                    {emailError.email && <div className="error-message">{emailError.email}</div>}
                    <input
                      type="password"
                      name="password"
                      placeholder="Current Password"
                      value={emailUpdate.password}
                      onChange={handleEmailChange}
                      className="input-field"
                    />
                    {emailError.password && <div className="error-message">{emailError.password}</div>}
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
                  <div className="username">{userProfile.name || 'Anonymous'}</div>
                  <div className="userid">ID: {userProfile.id || '12345'}</div>
                </td>
                <td>
                  <img src={userProfile.profilePic || profilePicPlaceholder} alt="Profile" className="profile-img-table" />
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
