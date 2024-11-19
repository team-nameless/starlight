import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './styleoflandingpage.css';
import './Main_Menu_Style.css';
import LandingPageApp from './LandingPageApp';
import SongPage from './SongPage';
import HistoryPage from './HistoryPage';
import StorePage from './StorePage';
import EventPage from './EventPage';
import ProfilePage from './ProfilePage';

function requestFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

window.addEventListener('load', requestFullScreen);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageApp />} />
        <Route path="/songpage" element={<SongPage />} />
        <Route path="/historypage" element={<HistoryPage />} />
        <Route path="/storepage" element={<StorePage />} />
        <Route path="/eventpage" element={<EventPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


