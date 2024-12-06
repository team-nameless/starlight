import Phaser from "phaser";
import {useRef, useEffect} from "react";
import {useLocation} from "react-router-dom";
import Game from "./scenes/Game";
import DataLoader from "./scenes/DataLoader";
import AssetLoader from "./scenes/AssetLoader";
import GameFinalizer from "./scenes/GameFinalizer";
import { EventEmitter } from "./EventEmitter";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function GameApp() {
    const gameRef = useRef(null);
    const location = useLocation();
    const { songId, songIndex } = location.state || { songId: 586954 };
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
            antialias: true,
        });

        game.scene.add("DataLoader", DataLoader, true, { song: songId });
        game.scene.add("AssetLoader", AssetLoader);
        game.scene.add("Game", Game);
        game.scene.add("GameFinalizer", GameFinalizer);

        EventEmitter.on("game-finished", () => {
            const url = `https://cluster1.swyrin.id.vn/api/track/${songId}`;

            axios.get(url, {
                withCredentials: true
            }).then((response) => {
                navigate("/historypage", { state: { currentSong: response.data, currentSongIndex: songIndex } });
            })
        });

        return () => {
            game.destroy(true);
            EventEmitter.removeListener("game-finished");
        };
    }, [songId]);

    return (
        <div
            ref={gameRef}
             style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
        </div>
    );
}

export default GameApp;