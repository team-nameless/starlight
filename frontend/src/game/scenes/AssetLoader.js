import Phaser from "phaser";
import noteOuter from "../assets/star_note_outer.png";
import noteInner from "../assets/star_note_inner.png";
import noteRing from "../assets/ring.png";
import indicator from "../assets/indicator.png";

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

        this.load.image("noteOuter", noteOuter);
        this.load.image("noteInner", noteInner);
        this.load.image("noteRing", noteRing);
        this.load.image("indicator", indicator);
        this.load.image("background", imageUrl);
        this.load.audio("music", audioFile);
    }

    create() {
        this.scene.switch("Game", { gameData: this.gameData, mapIndex: this.mapIndex });
    }
}

export default AssetLoader;