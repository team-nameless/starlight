import { Suspense, useEffect } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

import "./assets/stylesheets/Global.css";
import GamePlay from "./game/GameApp";
// Import global styles first
import "./modalstyle/PopUpModals";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import SongPage from "./pages/SongPage";
import StorePage from "./pages/StorePage";
import SuggestionPage from "./pages/SuggestionPage";
import SpotifyService from "./services/SpotifyService";

function App() {
    // Check for Spotify access token in URL when app loads
    useEffect(() => {
        if (window.location.hash && window.location.hash.includes('access_token=')) {
            console.log('Found access_token in URL, processing...');
            try {
                const success = SpotifyService.processCallback();
                
                if (success) {
                    console.log('Successfully processed Spotify callback, redirecting...');
                    // Redirect to main app with a slight delay to ensure token is saved
                    setTimeout(() => {
                        window.location.href = "/#/SuggestionPage";
                    }, 100);
                } else {
                    console.error('Failed to process Spotify callback');
                }
            } catch (error) {
                console.error('Error processing Spotify callback:', error);
            }
        }
    }, []);

    return (
        <HashRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/StorePage" element={<StorePage />} />
                    <Route path="/SuggestionPage" element={<SuggestionPage />} />
                    <Route path="/SongPage" element={<SongPage />} />
                    <Route path="/HistoryPage/:songId/:songIndex" element={<HistoryPage />} />
                    <Route path="/ProfilePage" element={<ProfilePage />} />
                    <Route path="/GamePlay" element={<GamePlay />} />
                    
                    {/* Handle Spotify callback in hash router */}
                    <Route path="/callback" element={<Navigate to="/SuggestionPage" replace />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

export default App;
