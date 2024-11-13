import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import './index.css';
import './styleoflandingpage.css';
import './Main_Menu_Style.css';
import LandingPageApp from './LandingPageApp';
import SongPage from './SongPage';  

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageApp />} />
        <Route path="/songpage" element={<SongPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


