import axios from "axios";
import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { apiHost } from "../common/site_setting.ts";
import { EventEmitter } from "./EventEmitter";
import AssetLoader from "./scenes/AssetLoader.ts";
import DataLoader from "./scenes/DataLoader.ts";
import Game from "./scenes/Game.ts";
import GameFinalizer from "./scenes/GameFinalizer.ts";

function GameApp() {
    const gameRef = useRef(null);
    const location = useLocation();
    const { songId, songIndex } = location.state || { songId: 586954, songIndex: 0 };
    const navigate = useNavigate();

    useEffect(() => {
        const game = new Phaser.Game({
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

        game.scene.add("DataLoader", DataLoader, true, { songId: songId, songIndex: songIndex });
        game.scene.add("AssetLoader", AssetLoader);
        game.scene.add("Game", Game);
        game.scene.add("GameFinalizer", GameFinalizer);

        EventEmitter.on("game-finished", () => {
            const url = `${apiHost}/api/track/${songId}`;

            axios
                .get(url, {
                    withCredentials: true
                })
                .then(response => {
                    navigate(`/history/${songId}/${songIndex}`, {
                        state: { currentSong: response.data, currentSongIndex: songIndex }
                    });
                });
        });

        return () => {
            game.destroy(true);
            EventEmitter.removeListener("game-finished");
        };
    }, [songId, songIndex, navigate]);

    return (
        <div
            ref={gameRef}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
        ></div>
    );
}

export default GameApp;
