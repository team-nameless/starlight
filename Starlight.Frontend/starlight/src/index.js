import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import './styleoflandingpage.css'; 
import './Main_Menu_Style.css';
import LandingPageApp from './LandingPageApp'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LandingPageApp /> 
  </React.StrictMode>
);