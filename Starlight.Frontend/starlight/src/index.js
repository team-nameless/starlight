import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SongPage from './SongPage';
import StorePage from './StorePage';
import EventPage from './EventPage';
import HistoryPage from './HistoryPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SongPage />
    <StorePage />
    <EventPage />
    <HistoryPage />
  </React.StrictMode>
);
