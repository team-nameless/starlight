import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  
import './styleoflandingpage.css'; 
import App from './App'; 
import LandingPageApp from './LandingPageApp'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <App />           
      <LandingPageApp /> 
    </div>
  </React.StrictMode>
);

