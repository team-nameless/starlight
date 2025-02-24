import axios from "axios";
import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { EventEmitter } from "./EventEmitter";
import AssetLoader from "./scenes/AssetLoader";
import DataLoader from "./scenes/DataLoader";
import Game from "./scenes/Game";
import { GameFinalizerWrapper } from "./scenes/GameFinalizer";
import useWebSocketConnection from "../hooks/useWebSocketConnection";

function GameApp() {
    const gameRef = useRef(null);
    const location = useLocation();
    const { songId, songIndex } = location.state || { songId: 586954, songIndex: 0 };
    const navigate = useNavigate();
    const { sendJsonMessage } = useWebSocketConnection("wss://localhost:8686");
    const [game, setGame] = useState(null);
    const [collectedGameData, setCollectedGameData] = useState(null);

    useEffect(() => {
        const newGame = new Phaser.Game({
            type: Phaser.AUTO,
            parent: gameRef.current,
            width: 1920,
            height: 1080,
            powerPreference: "high-performance",
            fps: {
                smoothStep: true,
                target: 144,
                min: 60,
                limit: 360
            },
            physics: {
                default: "arcade"
            },
            autoFocus: true,
            antialias: true
        });

        newGame.scene.add("DataLoader", DataLoader, true, { song: songId, index: songIndex });
        newGame.scene.add("AssetLoader", AssetLoader);
        newGame.scene.add("Game", Game);

        setGame(newGame);

        EventEmitter.on("game-finished", (data) => {
            setCollectedGameData(data);
            sendJsonMessage({ op: "fetch", songId: songId });
            const url = `http://localhost:5000/api/track/${songId}`;

            axios
                .get(url, {
                    withCredentials: true
                })
                .then(response => {
                    navigate(`/historypage/${songId}/${songIndex}`, {
                        state: { currentSong: response.data, currentSongIndex: songIndex }
                    });
                });
        });

        return () => {
            newGame.destroy(true);
            EventEmitter.removeListener("game-finished");
        };
    }, [navigate, sendJsonMessage, songId, songIndex]);

    return (
        <div
            ref={gameRef}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
        >
            {game && <GameFinalizerWrapper game={game} collectedGameData={collectedGameData} />}
        </div>
    );
}

export default GameApp;
