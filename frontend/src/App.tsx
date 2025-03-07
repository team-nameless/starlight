import { Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import "./assets/stylesheets/Global.css";
// Import global styles first
import "./modalstyle/PopUpModals";
import HistoryPage from "./pages/HistoryPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SongPage from "./pages/SongPage.tsx";
import StorePage from "./pages/StorePage.tsx";
import SuggestionPage from "./pages/SuggestionPage.tsx";

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
