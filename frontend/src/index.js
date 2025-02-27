import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./Main_Menu_Style.css";
import "./ProfilePageStyle.css";
import "./index.css";
import "./styleoflandingpage.css";

const LandingPageApp = lazy(() => import("./LandingPageApp"));
const SongPage = lazy(() => import("./SongPage"));
const HistoryPage = lazy(() => import("./HistoryPage"));
const StorePage = lazy(() => import("./StorePage"));
const SuggestionPage = lazy(() => import("./SuggestionPage"));
const ProfilePage = lazy(() => import("./ProfilePage"));
const GameApp = lazy(() => import("./game/GameApp"));

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<LandingPageApp />} />
                <Route path="/songpage" element={<SongPage />} />
                <Route path="/historypage/:songId/:songIndex" element={<HistoryPage />} />
                <Route path="/storepage" element={<StorePage />} />
                <Route path="/SuggestionPage" element={<SuggestionPage />} />
                <Route path="/ProfilePage" element={<ProfilePage />} />
                <Route path="/TestGame" element={<GameApp />} />
            </Routes>
        </Suspense>
    </BrowserRouter>
);
