import Phaser from "phaser";

import {
    GameHitError,
    GameHitJudgement,
    GameKeyboardPosition,
    GameNote,
    GameScoreStat,
    StarlightMap,
    StarlightNote
} from "../../index";

/*
 *  The game.
 */
class Game extends Phaser.Scene {
    // note groups, to cook with Physics
    private notes: Phaser.Physics.Arcade.Group = this.physics.add.group();

    // timing window in ms
    private criticalWindow = 60;
    private perfWindow = 100;
    private goodWindow = 150;
    private badWindow = 200;

    // gameplay properties
    private noteSpeed = 150;
    private noteScale = 10;
    private gameData: StarlightMap | null = null;

    // note positions
    private notePositionBase = 680;
    private notePositionGaps = 184;
    private noteOuter1PositionX = this.notePositionBase;
    private noteInner1PositionX = this.notePositionBase + this.notePositionGaps;
    private noteInner2PositionX = this.notePositionBase + this.notePositionGaps * 2;
    private noteOuter2PositionX = this.notePositionBase + this.notePositionGaps * 3;

    // UI elements
    private scoreText: Phaser.GameObjects.Text | null = null;
    private comboText: Phaser.GameObjects.Text | null = null;
    private accuracyText: Phaser.GameObjects.Text | null = null;
    private judgementText: Phaser.GameObjects.Text | null = null;
    private errorText: Phaser.GameObjects.Text | null = null;
    private criticalText: Phaser.GameObjects.Text | null = null;
    private perfText: Phaser.GameObjects.Text | null = null;
    private goodText: Phaser.GameObjects.Text | null = null;
    private badText: Phaser.GameObjects.Text | null = null;
    private missText: Phaser.GameObjects.Text | null = null;
    private progressionBar: Phaser.GameObjects.Rectangle | null = null;
    private pauseDimBg: Phaser.GameObjects.Rectangle | null = null;
    private pauseText: Phaser.GameObjects.Text | null = null;
    private pauseHint: Phaser.GameObjects.Text | null = null;

    // buttons.
    private replayKey: Phaser.Input.Keyboard.Key | null = null;
    private pauseKey: Phaser.Input.Keyboard.Key | null = null;
    private noteOuter1Key: Phaser.Input.Keyboard.Key | null = null;
    private noteInner1Key: Phaser.Input.Keyboard.Key | null = null;
    private noteInner2Key: Phaser.Input.Keyboard.Key | null = null;
    private noteOuter2Key: Phaser.Input.Keyboard.Key | null = null;

    // button tooltips.
    private noteOuter1KeyText: Phaser.GameObjects.Text | null = null;
    private noteInner1KeyText: Phaser.GameObjects.Text | null = null;
    private noteInner2KeyText: Phaser.GameObjects.Text | null = null;
    private noteOuter2KeyText: Phaser.GameObjects.Text | null = null;

    // random
    private duration: number = 0;
    private combo: number = 0;
    private score: number = 0;
    private accuracy: number = 0.0;

    // Stat counting
    private totalNotes: number = 0;
    private totalCritical: number = 0;
    private totalPerf: number = 0;
    private totalGood: number = 0;
    private totalBad: number = 0;
    private totalMiss: number = 0;
    private maxCombo: number = 0;

    // partial stats
    private collectedGameData: GameScoreStat | null = null;
    private partialNotes: number = 0;
    private partialCritical: number = 0;
    private partialPerf: number = 0;
    private partialGood: number = 0;
    private partialBad: number = 0;
    private partialMiss: number = 0;

    // game random stats
    private inGameTimeInMs: number = 0;
    private isScenePaused: boolean = false;
    private bgMusic: Phaser.Sound.BaseSound | null = null;
    private trackTitle: string = "";
    private trackAuthor: string = "";

    // input lock status
    private key1_locked: boolean = false;
    private key2_locked: boolean = false;
    private key3_locked: boolean = false;
    private key4_locked: boolean = false;

    // long note active status
    private key1_LN_active: boolean = false;
    private key2_LN_active: boolean = false;
    private key3_LN_active: boolean = false;
    private key4_LN_active: boolean = false;

    // events
    private dataCollectionEvent: Phaser.Time.TimerEvent | null = null;
    private endGameEvent: Phaser.Time.TimerEvent | null = null;

    constructor() {
        super("Game");
    }

    init(data: { gameData: StarlightMap; songId: number; songIndex: number }) {
        this.combo = 0;
        this.score = 0;
        this.totalCritical = 0;
        this.totalPerf = 0;
        this.totalGood = 0;
        this.totalBad = 0;
        this.totalMiss = 0;
        this.partialCritical = 0;
        this.partialPerf = 0;
        this.partialGood = 0;
        this.partialBad = 0;
        this.partialMiss = 0;
        this.partialNotes = 0;
        this.maxCombo = 0;
        this.inGameTimeInMs = 0;
        this.accuracy = 100;
        this.gameData = data.gameData;
        this.duration = data.gameData.metadata.duration;
        this.trackTitle = data.gameData.metadata.title;
        this.trackAuthor = data.gameData.metadata.artist;
        this.totalNotes = data.gameData.notes.length;
        this.isScenePaused = false;

        // input
        this.noteOuter1Key = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.noteInner1Key = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.noteInner2Key = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.noteOuter2Key = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.replayKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.BACKTICK);
        this.pauseKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // long note status
        this.key1_LN_active = false;
        this.key2_LN_active = false;
        this.key3_LN_active = false;
        this.key4_LN_active = false;

        // key lock
        this.key1_locked = false;
        this.key2_locked = false;
        this.key3_locked = false;
        this.key4_locked = false;

        this.collectedGameData = {
            trackId: data.songId,
            trackIndex: data.songIndex,
            partial: [],
            stats: undefined
        };

        // notes
        this.notes = this.physics.add.group();

        // pause the game to wait for music
        // this.time.paused = true;

        // partial data collection event
        this.dataCollectionEvent = this.time.addEvent({
            loop: true,
            callbackScope: this,
            callback: () => this.partialDataFinalize(),
            delay: this.duration / 30
        });

        // game end
        this.endGameEvent = this.time.addEvent({
            delay: this.duration + 1000,
            callbackScope: this,
            callback: () => this.endGame()
        });

        this.dataCollectionEvent.paused = true;
        this.endGameEvent.paused = true;

        // make game faster for testing
        // this.time.timeScale = 10;
    }

    preload() {
        // Set background image
        const bgImage = this.add.image(0, 0, "background");
        bgImage.setOrigin(0, 0);

        // Dim the background a little bit
        const darkScreen = this.add.rectangle(0, 0, 1920, 1080, 0x000000, 0.4);
        darkScreen.setOrigin(0, 0);

        // Create the timing ring (the real visual)
        this.add.image(this.noteOuter1PositionX, 845, "noteRing");
        this.add.image(this.noteInner1PositionX, 845, "noteRing");
        this.add.image(this.noteInner2PositionX, 845, "noteRing");
        this.add.image(this.noteOuter2PositionX, 845, "noteRing");

        // Pause dimmer
        this.pauseDimBg = this.add.rectangle(0, 0, 1920, 1080, 0x110034);
        this.pauseDimBg.setAlpha(0);
        this.pauseDimBg.setOrigin(0, 0);
        this.pauseDimBg.setDepth(10);

        this.gameData?.notes.forEach((note) => {
            this.time.delayedCall(this.calculateSpawnTime(note.time), () => {
                this.spawnNote(note);
            });
        });

        this.prepareUIElements();
        this.prepareInputEvent();
    }

    create() {
        this.bgMusic = this.sound.get("music");
        this.scene.resume();
        // this.gameStartTime = new Date(Date.now());
        this.time.paused = false;
        this.dataCollectionEvent!.paused = false;
        this.endGameEvent!.paused = false;
        this.bgMusic.play();
        this.inGameTimeInMs = 0;
    }

    /**
     * Calculated the button spawn time.
     * @param targetTime The desired time.
     * @remarks Due to spaghetti code, the desired time must be >650.
     */
    calculateSpawnTime(targetTime: number) {
        const screenHeight = 900;
        const timeToScroll = (screenHeight / (this.noteSpeed * this.noteScale)) * 1000;
        return Math.max(0, targetTime - timeToScroll);
    }

    partialDataFinalize() {
        this.collectedGameData?.partial.push({
            totalNotes: this.partialNotes,
            crit: this.partialCritical,
            perf: this.partialPerf,
            bad: this.partialBad,
            good: this.partialGood,
            miss: this.partialMiss
        });

        this.partialNotes = 0;
        this.partialCritical = 0;
        this.partialPerf = 0;
        this.partialGood = 0;
        this.partialBad = 0;
        this.partialMiss = 0;
    }

    prepareUIElements() {
        this.scoreText = this.add
            .text(1410, 100, "0000000", {
                fontFamily: "Inter",
                color: "#ffffff",
                fontSize: "70px"
            })
            .setOrigin(0, 0);

        this.comboText = this.add
            .text(200, 890, "0x", {
                fontFamily: "Inter",
                color: "#ffffff",
                fontSize: "60px"
            })
            .setOrigin(0, 0);

        this.accuracyText = this.add
            .text(1480, 180, "100.00%", {
                fontFamily: "Inter",
                color: "#ffffff",
                fontSize: "60px"
            })
            .setOrigin(0, 0);

        this.judgementText = this.add
            .text(1500, 500, "", {
                fontFamily: "Inter",
                color: "#ffffff",
                fontSize: "60px"
            })
            .setOrigin(0, 0);

        this.errorText = this.add
            .text(1500, 600, "", {
                fontFamily: "Inter",
                color: "#ffffff",
                fontSize: "40px"
            })
            .setOrigin(0, 0);

        this.pauseText = this.add
            .text(780, 221, "", {
                fontFamily: "Inter",
                color: "#ffffff",
                fontSize: "100px"
            })
            .setOrigin(0, 0);

        this.pauseHint = this.add
            .text(730, 318, "", {
                fontFamily: "Inter",
                color: "#ffffff",
                fontSize: "50px"
            })
            .setOrigin(0, 0);

        this.add
            .text(200, 110, `${this.trackTitle}\n${this.trackAuthor}`, {
                fontFamily: "Inter",
                color: "#ffffff",
                fontSize: "30px"
            })
            .setOrigin(0, 0);

        this.criticalText = this.add
            .text(200, 500, "C", {
                fontFamily: "Inter",
                color: "#F9E2AF",
                fontSize: "50px"
            })
            .setOrigin(0, 0);

        this.perfText = this.add
            .text(200, 550, "P", {
                fontFamily: "Inter",
                color: "#FAB387",
                fontSize: "50px"
            })
            .setOrigin(0, 0);

        this.goodText = this.add
            .text(200, 600, "G", {
                fontFamily: "Inter",
                color: "#CBA6F7",
                fontSize: "50px"
            })
            .setOrigin(0, 0);

        this.badText = this.add
            .text(200, 650, "B", {
                fontFamily: "Inter",
                color: "#A6E3A1",
                fontSize: "50px"
            })
            .setOrigin(0, 0);

        this.missText = this.add
            .text(200, 700, "M", {
                fontFamily: "Inter",
                color: "#F38BA8",
                fontSize: "50px"
            })
            .setOrigin(0, 0);

        // progression bar.
        this.add.rectangle(200, 955, 1521, 15, 0x9399b2, 0.5).setOrigin(0, 0);
        this.progressionBar = this.add.rectangle(200, 955, 1521, 15, 0xfff000, 0.7).setOrigin(0, 0);

        this.noteOuter1KeyText = this.add.text(
            this.getLanePositionX(0) - 20,
            845 - 25,
            this.getKeyName(this.noteOuter1Key!),
            {
                fontFamily: "Inter",
                color: "#FFFFFF",
                fontSize: "50px"
            }
        );

        this.noteInner1KeyText = this.add.text(
            this.getLanePositionX(1) - 20,
            845 - 25,
            this.getKeyName(this.noteInner1Key!),
            {
                fontFamily: "Inter",
                color: "#FFFFFF",
                fontSize: "50px"
            }
        );

        this.noteInner2KeyText = this.add.text(
            this.getLanePositionX(2) - 20,
            845 - 25,
            this.getKeyName(this.noteInner2Key!),
            {
                fontFamily: "Inter",
                color: "#FFFFFF",
                fontSize: "50px"
            }
        );

        this.noteOuter2KeyText = this.add.text(
            this.getLanePositionX(3) - 20,
            845 - 25,
            this.getKeyName(this.noteOuter2Key!),
            {
                fontFamily: "Inter",
                color: "#FFFFFF",
                fontSize: "50px"
            }
        );
    }

    /**
     * Setup input events.
     */
    prepareInputEvent() {
        const gameKeys = [
            this.noteOuter1Key,
            this.noteInner1Key,
            this.noteInner2Key,
            this.noteOuter2Key
        ];

        gameKeys.forEach((key, index: number) => {
            key?.on("down", () => {
                this.handleInput(index);
                // this.drawInputIndicator(index);
            });

            key?.on("up", () => {
                this.handleInput(index, true);
                this.setLongNoteActivity(index, false);
                this.setInputLockActivity(index, false);
            });
        });

        this.replayKey?.on("down", () => this.restartScene());
        this.pauseKey?.on("down", () => this.togglePause());
    }

    /*
     * Get the corresponding Phaser key.
     */
    getKeyName(key: Phaser.Input.Keyboard.Key) {
        for (const keyName in Object.values(Phaser.Input.Keyboard.KeyCodes)) {
            if (keyName === key.toString()) {
                return keyName;
            }
        }

        return "Unknown";
    }

    /*
     *    End this game session and move to game finalizer.
     */
    endGame() {
        this.time.paused = true;
        this.dataCollectionEvent!.paused = true;

        // grade calculation
        let grade;
        if (97 <= this.accuracy) grade = "S+";
        else if (95 <= this.accuracy && this.accuracy < 97) grade = "S";
        else if (90 <= this.accuracy && this.accuracy < 95) grade = "A";
        else if (80 <= this.accuracy && this.accuracy < 90) grade = "B";
        else if (65 <= this.accuracy && this.accuracy < 80) grade = "C";
        else grade = "D";

        this.collectedGameData!.trackId = this.gameData!.metadata.map_set_id!;
        this.collectedGameData!.stats = {
            duration: this.duration,
            crit: this.totalCritical,
            perf: this.totalPerf,
            good: this.totalGood,
            bad: this.totalBad,
            miss: this.totalMiss,
            score: this.calculateScore(),
            accuracy: this.accuracy / 100,
            grade: grade,
            maxCombo: this.maxCombo
        };

        this.collectedGameData!.partial = this.collectedGameData!.partial.slice(0, 30);

        this.scene.switch("GameFinalizer", {
            collectedData: this.collectedGameData
        });
    }

    /**
     * Spawns the note, isn't that obvious?
     */
    spawnNote(note: StarlightNote) {
        const pos = note.position;
        const xPosition = this.getLanePositionX(pos);

        const noteSelection = ["noteOuter", "noteInner", "noteInner", "noteOuter"];

        const colorSelection = [0xb4befe, 0xf2cdcd, 0xf2cdcd, 0xb4befe];

        const noteObject = this.add.image(xPosition, 0, noteSelection[pos]);

        noteObject.setData("time", note.time);
        noteObject.setData("position", pos);
        noteObject.setData("type", note.type);
        noteObject.setData("lastUntil", note.lastUntil);
        noteObject.setData("lnBody", false);
        noteObject.setDepth(2);

        // we also draw the body for LN start
        if (note.type === 1) {
            const startTime = note.time;
            const endTime = note.lastUntil;
            const duration = endTime - startTime;
            const height = Math.max(
                0,
                Math.ceil((duration / 1000) * this.noteSpeed * this.noteScale)
            );

            const longNoteBody = this.add.rectangle(
                noteObject.x,
                noteObject.y,
                50,
                height,
                colorSelection[pos]
            );
            longNoteBody.setOrigin(0.5, 1);
            longNoteBody.setData("lnBody", true);
            longNoteBody.setDepth(1);
            longNoteBody.setAlpha(0.5);

            this.notes.add(longNoteBody);
        }

        this.notes.add(noteObject);
        this.notes.setVelocityY(this.noteSpeed * this.noteScale);
    }

    /**
     * Get X coordinate of the lane.
     */
    getLanePositionX(keyPosition: GameKeyboardPosition) {
        return [
            this.noteOuter1PositionX,
            this.noteInner1PositionX,
            this.noteInner2PositionX,
            this.noteOuter2PositionX
        ][keyPosition];
    }

    /**
     * Draw judgement text and set a fade time.
     */
    drawJudgementText(judgement: GameHitJudgement, error: GameHitError) {
        this.judgementText?.setText(judgement);
        this.errorText?.setText(error);

        this.time.delayedCall(
            200,
            () => {
                this.judgementText?.setText("");
                this.errorText?.setText("");
            },
            [],
            this
        );
    }

    /**
     * Get long note activity
     */
    getLongNoteActivity(keyPosition: GameKeyboardPosition) {
        return [this.key1_LN_active, this.key2_LN_active, this.key3_LN_active, this.key4_LN_active][
            keyPosition
        ];
    }

    /**
     * Set long note activity.
     */
    setLongNoteActivity(keyPosition: GameKeyboardPosition, isHolding: boolean) {
        switch (keyPosition) {
            case 0:
                this.key1_LN_active = isHolding;
                break;
            case 1:
                this.key2_LN_active = isHolding;
                break;
            case 2:
                this.key3_LN_active = isHolding;
                break;
            case 3:
                this.key4_LN_active = isHolding;
                break;
            default:
                break;
        }
    }

    /**
     * Get key lock status.
     */
    getInputLockActivity(keyPosition: GameKeyboardPosition) {
        return [this.key1_locked, this.key2_locked, this.key3_locked, this.key4_locked][
            keyPosition
        ];
    }

    /**
     * Set key lock status.
     */
    setInputLockActivity(keyPosition: GameKeyboardPosition, isLocked: boolean) {
        switch (keyPosition) {
            case 0:
                this.key1_locked = isLocked;
                break;
            case 1:
                this.key2_locked = isLocked;
                break;
            case 2:
                this.key3_locked = isLocked;
                break;
            case 3:
                this.key4_locked = isLocked;
                break;
            default:
                break;
        }
    }

    /**
     * Calculate the actual score.
     */
    calculateScore() {
        const n = this.totalNotes;
        const score = this.score;
        return (score / (350 * n + 1.5 * n * (n + 1))) * 1_000_000;
    }

    /**
     * Handle game input.
     */
    handleInput(keyPosition: GameKeyboardPosition, isKeyUp: boolean = false) {
        const hitTime = this.inGameTimeInMs;
        const xPosition = this.getLanePositionX(keyPosition);
        const noteList = this.notes.getChildren();

        // filter notes that are in the needed lane
        // and near the judgement box
        const notesAtWantedLanes = noteList
            .filter((note) => note.getData("lnBody") === false)
            .filter((note) => (note as GameNote).x === xPosition)
            .filter((note) => Math.abs((note as GameNote).y - 845) <= 150);

        if (notesAtWantedLanes.length === 0) return;

        // get notes that lies the furthest,
        // but not exceeding the "judgement bound".
        const theChosenOne = notesAtWantedLanes.reduce((previousNote, currentNote) => {
            const judgePoint = 845;
            const judgeRange = 100;

            const upperPoint = judgePoint - judgeRange;
            const chokePoint = judgePoint + judgeRange;

            return upperPoint <= (currentNote as GameNote).y &&
                (currentNote as GameNote).y <= chokePoint &&
                (currentNote as GameNote).y < (previousNote as GameNote).y
                ? currentNote
                : previousNote;
        });

        // well, no note I guess?
        if (theChosenOne === null) return;

        const noteObj = theChosenOne;
        const noteType = noteObj.getData("type");

        if (noteType === 0) {
            this.processNote(noteObj, hitTime, keyPosition);
        } else if (noteType === 1) {
            this.processNote(noteObj, hitTime, keyPosition, true);
        } else if (isKeyUp && this.getLongNoteActivity(keyPosition) && noteType === 2) {
            // we only process long note end iff we ACK-ed the LN start
            // otherwise the update() will treat it as a BAD.
            this.processNote(noteObj, hitTime, keyPosition, false);
        }
    }

    /*
        Process single note and LN start, they are technically the same.
     */
    processNote(
        noteObj: Phaser.GameObjects.GameObject,
        hitTime: number,
        keyPosition: GameKeyboardPosition,
        isLnStart = false
    ) {
        const expectedTime = noteObj.getData("time");

        noteObj.destroy();
        ++this.combo;

        const offset = Math.abs(hitTime - expectedTime);
        const isEarly = hitTime < expectedTime;
        const isLate = hitTime > expectedTime;

        const errTxt = isEarly ? "EARLY" : isLate ? "LATE" : "Nice!";
        const errColor = isEarly ? "#74C7EC" : isLate ? "#F38BA8" : "#FFFFFF";
        let rawValue = 0;
        let mulValue = 0;

        if (offset <= this.criticalWindow) {
            ++this.totalCritical;
            ++this.partialCritical;
            ++this.partialNotes;
            rawValue = 350;
            mulValue = 3;
            this.judgementText?.setColor("#F9E2AF");
            this.drawJudgementText("Nice!", "");
        } else if (this.criticalWindow < offset && offset <= this.perfWindow) {
            ++this.totalPerf;
            ++this.partialPerf;
            ++this.partialNotes;
            rawValue = 300;
            mulValue = 2;
            this.judgementText?.setColor("#FAB387");
            this.errorText?.setColor(errColor);
            this.drawJudgementText("Perfect", errTxt);
        } else if (this.perfWindow < offset && offset <= this.goodWindow) {
            ++this.totalGood;
            ++this.partialGood;
            ++this.partialNotes;
            rawValue = 200;
            mulValue = 1.5;
            this.judgementText?.setColor("#CBA6F7");
            this.errorText?.setColor(errColor);
            this.drawJudgementText("Fine", errTxt);
        } else if (this.goodWindow < offset && offset <= this.badWindow) {
            ++this.totalBad;
            ++this.partialBad;
            ++this.partialNotes;
            rawValue = 50;
            mulValue = 1.05;
            this.judgementText?.setColor("#A6E3A1");
            this.errorText?.setColor(errColor);
            this.drawJudgementText("Meh.", errTxt);
        } else {
            this.drawJudgementText("What?", "Edge case!");
            rawValue = 0;
            mulValue = 0;
        }

        this.score += rawValue + mulValue * this.combo;

        this.setLongNoteActivity(keyPosition, isLnStart);
        this.setInputLockActivity(keyPosition, true);
    }

    /*
        Highlights the key being pressed.
     */
    drawInputIndicator(keyPosition: GameKeyboardPosition) {
        const texts = [
            this.noteOuter1KeyText,
            this.noteInner1KeyText,
            this.noteInner2KeyText,
            this.noteOuter2KeyText
        ];
        const xPosition = this.getLanePositionX(keyPosition);
        const indicator = this.add.image(xPosition, 845, "indicator");

        texts[keyPosition]?.setDepth(1000);
        texts[keyPosition]?.setColor("#1F1E33");

        setTimeout(
            (x) => {
                x.destroy();
                texts[keyPosition]?.setColor("#FFFFFF");
            },
            20,
            indicator,
            texts,
            keyPosition
        );
    }

    /**
     * Toggle pause status of the game.
     */
    togglePause() {
        this.isScenePaused = !this.isScenePaused;

        if (this.isScenePaused) {
            this.time.paused = true;
            this.physics.pause();
            this.notes.setVelocityY(0);
            this.bgMusic?.pause();
            this.pauseDimBg?.setAlpha(0.5);
            this.pauseText?.setText("PAUSED");
            this.pauseText?.setDepth(15);
            this.pauseHint?.setText("Press ESC to resume.");
            this.pauseHint?.setDepth(15);
        } else {
            this.time.paused = false;
            this.physics.resume();
            this.notes.setVelocityY(this.noteSpeed * this.noteScale);
            this.bgMusic?.resume();
            this.pauseDimBg?.setAlpha(0);
            this.pauseText?.setText("");
            this.pauseHint?.setText("");
        }
    }

    /**
     * Restart the scene.
     */
    restartScene() {
        this.time.paused = false;
        this.scene.restart();
    }

    update(_time: number, delta: number) {
        // only do stuffs when the game is not paused
        if (this.isScenePaused) return;

        // draw input indicator
        if (this.noteOuter1Key?.isDown) {
            this.drawInputIndicator(0);
        }
        if (this.noteInner1Key?.isDown) {
            this.drawInputIndicator(1);
        }
        if (this.noteInner2Key?.isDown) {
            this.drawInputIndicator(2);
        }
        if (this.noteOuter2Key?.isDown) {
            this.drawInputIndicator(3);
        }

        this.inGameTimeInMs += delta;

        // noinspection PointlessArithmeticExpressionJS
        this.accuracy =
            ((350 * (this.totalNotes - this.totalGood - this.totalBad - this.totalMiss) +
                200 * this.totalGood +
                50 * this.totalBad +
                0 * this.totalMiss) /
                (350.0 * this.totalNotes)) *
            100.0;

        this.notes.getChildren().forEach((note) => {
            if (note.getData("lnBody")) return;

            const pos = parseInt(note.getData("position"));

            if ((note as GameNote).y > 845 + 200) {
                // if we have no active long note, that means we are probably handling a single note.
                // so that equals a MISS.
                if (!this.getInputLockActivity(pos)) {
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.combo = 0;
                    ++this.totalMiss;
                    ++this.partialMiss;
                    ++this.partialNotes;
                    this.judgementText?.setColor("#F38BA8");
                    this.drawJudgementText("Missed.", "");
                    this.setLongNoteActivity(this.getLanePositionX((note as GameNote).x), false);
                } else {
                    const rawValue = 50;
                    const mulValue = 1;

                    // else it's a BAD.
                    ++this.totalBad;
                    ++this.partialBad;
                    ++this.partialNotes;
                    this.drawJudgementText("Meh.", "LATE");
                    this.score += rawValue + mulValue * this.combo;
                }

                note.destroy();
            }
        });

        this.comboText?.setText(`${this.combo}x`);
        this.scoreText?.setText(`${this.calculateScore()}`.padStart(7, "0"));
        this.accuracyText?.setText(`${this.accuracy.toFixed(2)}%`.padStart(7, " "));

        this.criticalText?.setText(`C ${this.totalCritical}`);
        this.perfText?.setText(`P ${this.totalPerf}`);
        this.goodText?.setText(`G ${this.totalGood}`);
        this.badText?.setText(`B ${this.totalBad}`);
        this.missText?.setText(`M ${this.totalMiss}`);

        const passedPercentage = this.inGameTimeInMs / this.duration;
        const progressionBarLength = 1521 * passedPercentage;

        this.progressionBar?.setSize(progressionBarLength, 15);
    }
}

export default Game;
