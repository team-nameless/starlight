import axios from "axios";
import Phaser from "phaser";

import { apiHost } from "../../common/site_setting";
import { GameScoreStat } from "../../index";
import { EventEmitter } from "../EventEmitter";

class GameFinalizer extends Phaser.Scene {
    private collectedGameData: GameScoreStat | null = null;
    private trackId: number = 0;

    constructor() {
        super("GameFinalizer");
    }

    init(data: { collectedData: GameScoreStat }) {
        this.collectedGameData = data.collectedData;
        this.trackId = this.collectedGameData?.trackId;
    }

    create() {
        const url = `${apiHost}/api/score/${this.trackId}`;
        console.log(this.collectedGameData);

        axios
            .post(url, this.collectedGameData, { withCredentials: true })
            .then(() => {
                EventEmitter.emit("game-finished");
                this.scene.stop("GameFinalizer");
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export default GameFinalizer;
