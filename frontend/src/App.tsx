import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./assets/stylesheets/index.filtered.css";
// import HistoryPage from "./pages/HistoryPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";

// import ProfilePage from "./pages/ProfilePage.tsx";
// import SongPage from "./pages/SongPage.tsx";
// import StorePage from "./pages/StorePage.tsx";
// import SuggestionPage from "./pages/SuggestionPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route path="/suggestion" element={<SuggestionPage />} />
                    <Route path="/song" element={<SongPage />} />
                    <Route path="/history/:songId/:songIndex" element={<HistoryPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
