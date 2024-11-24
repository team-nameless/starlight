import Phaser from "phaser";
import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainScene from "./scenes/MainScene.js";
import DataLoader from "./scenes/DataLoader.js";
import AssetLoader from "./scenes/AssetLoader.js";

function GameApp() {
    const gameRef = useRef(null);
    const location = useLocation();
    const { songId } = location.state || {};

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            parent: gameRef.current,
            width: 1920,
            height: 1080,
            /*
            scene: [
                DataLoader,
                AssetLoader,
                MainScene,
            ],
             */
            powerPreference: "high-performance",
            fps: {
                smoothStep: true,
                target: 120,
                min: 60,
                limit: 360
            },
            physics: {
                default: "arcade",
                arcade: {
                    debug: false,
                },
            }
        };

        const game = new Phaser.Game(config);

        game.scene.add("DataLoader", DataLoader, true, { song: songId });
        game.scene.add("AssetLoader", AssetLoader);
        game.scene.add("MainScene", MainScene);

        return () => {
            game.destroy(true);
        };
    }, [songId]);

    return (
        <div
            ref={gameRef}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
        >
        </div>
    );
}

export default GameApp;