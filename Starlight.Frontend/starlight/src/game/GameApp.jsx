import Phaser from "phaser";
import { useRef, useEffect } from "react";
import MainScene from "./scenes/MainScene.js";
import DataLoader from "./scenes/DataLoader.js";
import AssetLoader from "./scenes/AssetLoader.js";

function GameApp() {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            parent: gameRef.current,
            width: 1920,
            height: 1080,
            scene: [
                DataLoader,
                AssetLoader,
                MainScene,
            ],
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
            },
        };

        const game = new Phaser.Game(config);
        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <div
            ref={gameRef}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
        >
        </div>
    );
}

export default GameApp;