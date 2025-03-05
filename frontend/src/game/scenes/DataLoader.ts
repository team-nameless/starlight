import Phaser from "phaser";

import { apiHost } from "../../common/site_setting.ts";

/**
 *  Class used for loading all the meta stuffs into the game.
 */
class DataLoader extends Phaser.Scene {
    private songId: number = 0;
    private songIndex: number = 0;

    constructor() {
        super("DataLoader");
    }

    init(data: { songId: number; songIndex: number }) {
        this.songId = data.songId;
        this.songIndex = data.songIndex;
    }

    preload() {
        const jsonUrl = `${apiHost}/static/${this.songId}/${this.songId}.json`;

        this.load.json("gameData", jsonUrl);
    }

    create() {
        this.cache.json.add("gameData", this.cache.json.get("gameData"));
        this.scene.switch("AssetLoader", { songId: this.songId, songIndex: this.songIndex });
    }
}

export default DataLoader;
