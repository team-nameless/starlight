import Phaser from "phaser";

/**
 *  Class used for loading all the asset stuffs into the game.
 */
class AssetLoader extends Phaser.Scene {
    mapId;
    mapIndex;
    gameData;

    constructor() {
        super("AssetLoader");
    }

    init(data) {
        this.mapId = data["mapId"];
        this.mapIndex = data["mapIndex"];
    }

    preload() {
        this.gameData = this.cache.json.get("gameData");

        const audioName = this.gameData["metadata"]["audio_file"];
        const imageName = this.gameData["metadata"]["background_file"];

        const imageUrl = `http://localhost:5000/static/${this.mapId}/${imageName}`;
        const audioFile = `http://localhost:5000/static/${this.mapId}/${audioName}`;

        this.load.image("noteOuter", require("../assets/star_note_outer.png"));
        this.load.image("noteInner", require("../assets/star_note_inner.png"));
        this.load.image("noteRing", require("../assets/ring.png"));
        this.load.image("indicator", require("../assets/indicator.png"));
        this.load.image("background", imageUrl);
        this.load.audio("music", audioFile);
    }

    create() {
        this.scene.switch("Game", { gameData: this.gameData, mapIndex: this.mapIndex });
    }
}

export default AssetLoader;
