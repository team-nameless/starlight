import axios from "axios";
import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { apiHost } from "../common/site_setting";
import { EventEmitter } from "./EventEmitter";
import AssetLoader from "./scenes/AssetLoader";
import DataLoader from "./scenes/DataLoader";
import Game from "./scenes/Game";
import GameFinalizer from "./scenes/GameFinalizer";

function GameApp() {
    const gameRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Add logging to verify the data is received correctly
    console.log("GameApp received location state:", location.state);

    const { songId, songIndex, song } = location.state || {
        songId: 586954,
        songIndex: 0,
        song: null
    };

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

        // Debug game creation
        console.log("Phaser game instance created:", game);

        try {
            // Add scenes with more complete data
            game.scene.add("DataLoader", DataLoader, true, {
                songId: songId,
                songIndex: songIndex,
                songData: song // Pass complete song data
            });
            game.scene.add("AssetLoader", AssetLoader);
            game.scene.add("Game", Game);
            game.scene.add("GameFinalizer", GameFinalizer);

            console.log("Game scenes added successfully");
        } catch (error) {
            console.error("Error setting up game scenes:", error);
        }

        EventEmitter.on("game-finished", () => {
            const url = `${apiHost}/api/track/${songId}`;

            axios
                .get(url, {
                    withCredentials: true
                })
                .then((response) => {
                    navigate(`/HistoryPage/${songId}/${songIndex}`, {
                        state: {
                            currentSong: response.data,
                            currentSongIndex: songIndex
                        }
                    });
                });
        });

        return () => {
            game.destroy(true);
            EventEmitter.removeListener("game-finished");
        };
    }, [songId, songIndex, song, navigate]);

    return (
        <div
            ref={gameRef}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}
        ></div>
    );
}

export default GameApp;
