import Phaser from "phaser";

/**
 *  Class used for loading all the meta stuffs into the game.
 */
class DataLoader extends Phaser.Scene {
    private mapId: number = 2211127;

    constructor() {
        super("DataLoader");
    }

    init(data: any) {
        this.mapId = data.songId; // Use songId from data
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