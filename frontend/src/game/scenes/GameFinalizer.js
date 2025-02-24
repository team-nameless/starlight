import axios from "axios";
import Phaser from "phaser";
import { useEffect } from "react";
import useWebSocketConnection from '../../hooks/useWebSocketConnection';
import { EventEmitter } from "../EventEmitter";

class GameFinalizer extends Phaser.Scene {
    collectedGameData;
    trackId;
    sendJsonMessage;

    constructor() {
        super("GameFinalizer");
    }

    init(data) {
        this.collectedGameData = data.collectedData;
        this.trackId = this.collectedGameData?.trackId;
        this.sendJsonMessage = data.sendJsonMessage;
    }

    create() {
        if (!this.trackId) {
            console.error("trackId is undefined");
            return;
        }

        const url = `http://localhost:5000/api/score/${this.trackId}`;
        console.log(this.collectedGameData);

        axios
            .post(url, this.collectedGameData, { withCredentials: true })
            .then(_ => {
                this.sendJsonMessage({ op: "end", trackId: this.trackId });
                EventEmitter.emit("game-finished");
                this.scene.stop("GameFinalizer");
            })
            .catch(error => {
                console.log(error);
            });
    }
}

const GameFinalizerWrapper = ({ game, collectedGameData }) => {
    const { sendJsonMessage } = useWebSocketConnection('wss://localhost:8686');

    useEffect(() => {
        if (!game.scene.keys.GameFinalizer) {
            game.scene.add('GameFinalizer', GameFinalizer, true, { sendJsonMessage, collectedData: collectedGameData });
        }
    }, [game, sendJsonMessage, collectedGameData]);

    return null;
};

export { GameFinalizer, GameFinalizerWrapper };
