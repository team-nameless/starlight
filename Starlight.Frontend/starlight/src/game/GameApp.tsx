import Phaser from "phaser";
import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainScene from "./scenes/MainScene.ts";
import DataLoader from "./scenes/DataLoader.ts";
import AssetLoader from "./scenes/AssetLoader.ts";

function GameApp() {
    const gameRef = useRef(null);
    const { songId } = useParams(); // Get songId from route params

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
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
                forceSetTimeOut: true
            },
            physics: {
                default: "arcade",
                arcade: {
                    debug: false,
                },
            },
        };

        const game = new Phaser.Game(config);
        game.scene.start('DataLoader', { songId }); // Pass songId to DataLoader scene

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