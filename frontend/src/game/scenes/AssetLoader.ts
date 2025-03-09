import Phaser from "phaser";

import { apiHost } from "../../common/site_setting";
import { StarlightMap } from "../../index";
import indicator from "../assets/indicator.png";
import noteRing from "../assets/ring.png";
import noteInner from "../assets/star_note_inner.png";
import noteOuter from "../assets/star_note_outer.png";

/**
 *  Class used for loading all the asset stuffs into the game.
 */
class AssetLoader extends Phaser.Scene {
    private songId: number = 0;
    private songIndex: number = 0;
    private gameData: StarlightMap | null = null;

    constructor() {
        super("AssetLoader");
    }

    init(data: { songId: number; songIndex: number }) {
        this.songId = data.songId;
        this.songIndex = data.songIndex;
    }

    preload() {
        this.gameData = this.cache.json.get("gameData");

        const audioName = this.gameData?.metadata.audio_file;
        const imageName = this.gameData?.metadata.background_file;

        const audioFile = `${apiHost}/static/${this.songId}/${audioName}`;
        const imageUrl = `${apiHost}/static/${this.songId}/${imageName}`;

        this.load.image("noteOuter", noteOuter);
        this.load.image("noteInner", noteInner);
        this.load.image("noteRing", noteRing);
        this.load.image("indicator", indicator);
        this.load.image("background", imageUrl);
        this.load.audio("music", audioFile);
    }

    create() {
        this.scene.switch("Game", {
            gameData: this.gameData,
            songId: this.songId,
            songIndex: this.songIndex
        });
    }
}

export default AssetLoader;
