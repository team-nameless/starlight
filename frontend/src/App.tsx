import { Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import "./assets/stylesheets/Global.css";
// Import global styles first
import "./modalstyle/PopUpModals";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import SongPage from "./pages/SongPage";
import StorePage from "./pages/StorePage";
import SuggestionPage from "./pages/SuggestionPage";

function App() {
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
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

export default App;
