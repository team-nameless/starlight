import Phaser from "phaser";

/**
 *  Class used for loading all the asset stuffs into the game.
 */
class AssetLoader extends Phaser.Scene {
    mapId;
    gameData;

    constructor() {
        super("AssetLoader");
    }

    init(data) {
        this.mapId = data["mapId"];
    }

    preload() {
        this.gameData = this.cache.json.get("gameData");

        const audioName = this.gameData["metadata"]["audio_file"];
        const imageName = this.gameData["metadata"]["background_file"];

        const imageUrl = `https://cluster1.swyrin.id.vn/static/${this.mapId}/${imageName}`;
        const audioFile = `https://cluster1.swyrin.id.vn/static/${this.mapId}/${audioName}`;

        this.load.image("noteOuter", require("../assets/star_note_outer.png"));
        this.load.image("noteRing", require("../assets/ring.png"));
        this.load.image("background", imageUrl);
        this.load.audio("music", audioFile);
    }

    create() {
        this.scene.switch("MainScene", { gameData: this.gameData });
    }
}

export default AssetLoader;