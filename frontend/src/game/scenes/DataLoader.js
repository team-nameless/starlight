import Phaser from "phaser";

/**
 *  Class used for loading all the meta stuffs into the game.
 */
class DataLoader extends Phaser.Scene {
    mapId;
    mapIndex;

    constructor() {
        super("DataLoader");
    }

    init(data) {
        this.mapId = data["song"];
        this.mapIndex = data["index"];
    }

    preload() {
        const jsonUrl = `https://cluster1.swyrin.id.vn/static/${this.mapId}/${this.mapId}.json`;

        this.load.json("gameData", jsonUrl);
    }

    create() {
        this.scene.switch("AssetLoader", { mapId: this.mapId, mapIndex: this.mapIndex });
    }
}

export default DataLoader;
