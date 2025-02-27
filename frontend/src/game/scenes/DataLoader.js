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
        const jsonUrl = `http://localhost:5000/static/${this.mapId}/${this.mapId}.json`;

        this.load.json("gameData", jsonUrl);
    }

    create() {
        this.cache.json.add("gameData", this.cache.json.get("gameData"));
        this.scene.switch("AssetLoader", { mapId: this.mapId, mapIndex: this.mapIndex });
    }
}

export default DataLoader;