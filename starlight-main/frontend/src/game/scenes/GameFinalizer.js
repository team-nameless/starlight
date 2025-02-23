import axios from "axios";
import Phaser from "phaser";

import { EventEmitter } from "../EventEmitter";

class GameFinalizer extends Phaser.Scene {
    collectedGameData;
    trackId;

    constructor() {
        super("GameFinalizer");
    }

    init(data) {
        this.collectedGameData = data.collectedData;
        this.trackId = this.collectedGameData.trackId;
    }

    create() {
        const url = `http://localhost:5000/api/score/${this.trackId}`;
        console.log(this.collectedGameData);

        axios
            .post(url, this.collectedGameData, { withCredentials: true })
            .then(_ => {
                EventEmitter.emit("game-finished");
                this.scene.stop("GameFinalizer");
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export default GameFinalizer;
