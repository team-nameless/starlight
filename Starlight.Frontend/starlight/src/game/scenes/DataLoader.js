import Phaser from "phaser";

/**
 *  Class used for loading all the meta stuffs into the game.
 */
class DataLoader extends Phaser.Scene {
    mapId;

    constructor() {
        super("DataLoader");
    }

    init(data) {
        // fallback to the arya song if we launch this standalone?
        this.mapId = data["song"] || 2212131;
    }

    preload() {
        const jsonUrl = `https://cluster1.swyrin.id.vn/static/${this.mapId}/${this.mapId}.json`;

        this.load.json("gameData", jsonUrl);
    }

    create() {
        this.scene.switch("AssetLoader", { mapId: this.mapId });
    }
}

export default DataLoader;