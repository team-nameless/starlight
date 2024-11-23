import Phaser from "phaser";

// game assets

class MainScene extends Phaser.Scene {
    private notes!: Phaser.Physics.Arcade.Group;
    private noteSpeed: number = 100;
    private noteScale: number = 15;
    private timingLine!: Phaser.GameObjects.Rectangle;
    private gameData!: any;

    // note positions
    // 1920 / 10 = 192 per parts
    // layout = 3 parts - 4 parts (we will use this one) - 3 parts
    // 192 * 4 = 768 -> accounting for figma gaps -> 680
    // then +184 each
    private notePositionBase = 680;
    private notePositionGaps = 184;
    private noteOuter1PositionX = this.notePositionBase;
    private noteInner1PositionX = this.notePositionBase + this.notePositionGaps;
    private noteInner2PositionX = this.notePositionBase + this.notePositionGaps * 2;
    private noteOuter2PositionX = this.notePositionBase + this.notePositionGaps * 3;

    // gameplay elements
    private scoreText!: Phaser.GameObjects.Text;
    private comboText!: Phaser.GameObjects.Text;
    private accuracyText!: Phaser.GameObjects.Text;

    private combo!: number;
    private score!: number;

    constructor() {
        super("MainScene");
    }

    init(data: any) {
        this.combo = 0;
        this.score = 0;

        // Propagate game data
        this.gameData = data.gameData;

        // Set up input handling
        this.input.keyboard!.on("keydown", this.handleInput, this);

        // Initialize the notes group
        this.notes = this.physics.add.group();

        // Create the timing line (for event handling)
        this.timingLine = this.add.rectangle(138 * 2 + this.noteOuter1PositionX, 845, 650, 10, 0xff0000, 0.5);
    }

    preload() {
        // Set background image
        const bgImage = this.add.image(0, 0, "background");
        bgImage.setOrigin(0, 0);

        // Dim the background a little bit
        const darkScreen = this.add.rectangle(0, 0, 1920, 1080, 0x000000, 0.7);
        darkScreen.setOrigin(0, 0);

        // Create the timing ring (the real visual)
        this.add.image(this.noteOuter1PositionX, 845, "noteRing");
        this.add.image(this.noteInner1PositionX, 845, "noteRing");
        this.add.image(this.noteInner2PositionX, 845, "noteRing");
        this.add.image(this.noteOuter2PositionX, 845, "noteRing");

        // Setup texts
        this.scoreText = this.add.text(1410, 100, "0000000", {
            fontFamily: "sans-serif",
            color: "#ffffff",
            fontSize: "80px"
        }).setOrigin(0, 0);

        this.comboText = this.add.text(200, 900, "100x", {
            fontFamily: "sans-serif",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.accuracyText = this.add.text(1480, 180, "100.00%", {
            fontFamily: "sans-serif",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        const notes = this.gameData.notes;

        notes.forEach((note: any) => {
            const screenHeight = 845;
            const timeToScroll = (screenHeight / (this.noteSpeed * this.noteScale)) * 1000;
            const spawnTime = Math.max(0, note.time - timeToScroll);

            // Use Phaser's delayedCall to schedule note creation
            this.time.delayedCall(spawnTime, () => {
                this.spawnNote(note.position); // Pass the lane or note properties for positioning
                // console.log(`Adding note to pos ${note.position} at ${spawnTime}`);
            });
        });
    }

    create() {
        let bgMusic = this.sound.add("music");
        bgMusic.play();
    }

    private spawnNote(position: integer) {
        const xPositions = [
            -1, // intentionally left
            this.noteOuter1PositionX,
            this.noteInner1PositionX,
            this.noteInner2PositionX,
            this.noteOuter2PositionX
        ];

        const noteObject = this.add.image(xPositions[position], 0, "noteOuter");
        this.notes.add(noteObject);
        this.notes.setVelocityY(this.noteSpeed * this.noteScale);
    }

    private handleInput(event: KeyboardEvent) {
        // if (event.key === "ArrowDown") {
            // Check for notes near the timing line
            this.notes.getChildren().forEach((note) => {
                const noteY = (note as Phaser.Physics.Arcade.Image).y;
                if (Math.abs(noteY - 845) < 100) {
                    (note as Phaser.Physics.Arcade.Image).destroy();
                    // Trigger score increment here (communicate with React if needed)
                    // console.log("Hit!");
                    ++this.combo;
                    this.score += 300;
                }
            });
        // }
    }

    private handleGameOver() {
        // Redirect to history page
        window.location.href = '/historypage';
    }

    update() {
        this.comboText.setText(`${this.combo}x`);
        this.scoreText.setText(`${this.score}`.padStart(7, "0"));
        if (this.isGameOver()) {
            this.handleGameOver();
        }
    }

    // Add a method to check if the game is over
    private isGameOver(): boolean {
        // Implement your game over logic here
        return false; // Placeholder
    }
}

export default MainScene;