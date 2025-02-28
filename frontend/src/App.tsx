import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import HistoryPage from "./pages/HistoryPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SongPage from "./pages/SongPage.tsx";
import StorePage from "./pages/StorePage.tsx";
import SuggestionPage from "./pages/SuggestionPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/storepage" element={<StorePage />} />
                    <Route path="/SuggestionPage" element={<SuggestionPage />} />
                    <Route path="/songpage" element={<SongPage />} />
                    <Route path="/historypage/:songId/:songIndex" element={<HistoryPage />} />
                    <Route path="/ProfilePage" element={<ProfilePage />} />
                    {/*
                    Rest in peace.
                    <Route path="/TestGame" element={<GameApp />} />
                  */}
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
