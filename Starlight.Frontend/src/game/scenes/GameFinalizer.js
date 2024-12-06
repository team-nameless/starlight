import Phaser from "phaser";
import {EventEmitter} from "../EventEmitter";
import axios from "axios";

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
        const url = `https://cluster1.swyrin.id.vn/api/score/${this.trackId}`;

        axios.post(url, this.collectedGameData, { withCredentials: true })
            .then(response => {
                EventEmitter.emit("game-finished");
                this.scene.stop("GameFinalizer");
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export default GameFinalizer;