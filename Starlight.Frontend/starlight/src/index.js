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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
