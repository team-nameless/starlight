import Phaser from "phaser";

/*
 *  The game.
 */
class Game extends Phaser.Scene {
    // note groups
    notes;

    // timing window in ms
    critWindow = 40;
    perfWindow = 80;
    goodWindow = 120;
    badWindow = 180;

    // gameplay properties
    noteSpeed = 150;
    noteScale = 10;
    gameData;

    // note positions
    notePositionBase = 680;
    notePositionGaps = 184;
    noteOuter1PositionX = this.notePositionBase;
    noteInner1PositionX = this.notePositionBase + this.notePositionGaps;
    noteInner2PositionX = this.notePositionBase + this.notePositionGaps * 2;
    noteOuter2PositionX = this.notePositionBase + this.notePositionGaps * 3;

    // UI elements
    gameStartTime;
    scoreText;
    comboText;
    accuracyText;
    judgementText;
    errorText;

    // buttons
    replayKey;
    pauseKey;
    noteOuter1Key;
    noteInner1Key;
    noteInner2Key;
    noteOuter2Key;

    // random
    duration;
    combo;
    score;
    accuracy;

    // stuffs
    totalNotes;
    totalCrit;
    totalPerf;
    totalGood;
    totalBad;
    totalMiss;

    // partial stats
    collectedGameData;
    partialNotes;
    partialCrit;
    partialPerf;
    partialGood;
    partialBad;
    partialMiss;

    // yes?
    inGameTimeInMs;
    isScenePaused;
    bgMusic;
    pauseDimBg;
    pauseText;
    pauseHint;

    // input lock status
    key1_locked;
    key2_locked;
    key3_locked;
    key4_locked;

    // long note active status
    key1_LN_active;
    key2_LN_active;
    key3_LN_active;
    key4_LN_active;

    constructor() {
        super("Game");
    }

    init(data) {
        this.combo = 0;
        this.score = 0;
        this.totalCrit = 0;
        this.totalPerf = 0;
        this.totalGood = 0;
        this.totalBad = 0;
        this.totalMiss = 0;
        this.partialCrit = 0;
        this.partialPerf = 0;
        this.partialGood = 0;
        this.partialBad = 0;
        this.partialMiss = 0;
        this.inGameTimeInMs = 0;
        this.accuracy = 100;
        this.gameData = data.gameData;
        this.duration = data.gameData["metadata"]["duration"];
        this.totalNotes = data.gameData["notes"].length;
        this.isScenePaused = false;

        // input
        this.noteOuter1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.noteInner1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.noteInner2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.noteOuter2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.replayKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKTICK);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // for firefox only
        // since quote key will enable search
        // this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.QUOTES);

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
            trackId: 0,
            stats: {},
            partial: []
        }

        // notes
        this.notes = this.physics.add.group();

        // pause the game to wait for music
        this.time.paused = true;
        this.scene.pause();
    }

    preload() {
        if (this.gameData["mapId"] !== 0) {
            // Set background image
            const bgImage = this.add.image(0, 0, "background");
            bgImage.setOrigin(0, 0);

            // Dim the background a little bit
            const darkScreen = this.add.rectangle(0, 0, 1920, 1080, 0x000000, 0.4);
            darkScreen.setOrigin(0, 0);
        }

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

        this.gameData["notes"].forEach((note) => {
            this.time.delayedCall(
                this.calculateSpawnTime(note.time),
                () => {
                    this.spawnNote(note);
                }
            );
        });

        this.prepareUIText();
        this.prepareInputEvent();
    }

    create() {
        // partial data collection event
        this.time.addEvent({
            loop: true,
            callbackScope: this,
            callback: () => this.partialDataFinalize(),
            delay: this.duration / 30
        });

        // game end
        this.time.addEvent({
            delay: this.duration,
            callbackScope: this,
            callback: () => this.endGame()
        });

        this.bgMusic = this.gameData["mapId"] !== 0 ? this.sound.get("music") || this.sound.add("music") : null;
        this.scene.resume();
        this.gameStartTime = new Date(Date.now());
        this.time.paused = false;
        this.bgMusic.play();
    }

    calculateSpawnTime(targetTime) {
        const screenHeight = 845;
        const timeToScroll = (screenHeight / (this.noteSpeed * this.noteScale)) * 1000;
        return Math.max(0, targetTime - timeToScroll);
    }

    partialDataFinalize() {
        this.collectedGameData.partial.push({
            totalNotes: this.partialNotes,
            crit: this.partialCrit,
            perf: this.partialPerf,
            bad: this.partialBad,
            good: this.partialGood,
            miss: this.partialMiss,
        });

        this.partialNotes = 0;
        this.partialCrit = 0;
        this.partialPerf = 0;
        this.partialGood = 0;
        this.partialBad = 0;
        this.partialMiss = 0;
    }

    prepareUIText() {
        this.scoreText = this.add.text(1410, 100, "0000000", {
            fontFamily: "Inter",
            color: "#ffffff",
            fontSize: "80px"
        }).setOrigin(0, 0);

        this.comboText = this.add.text(200, 900, "0x", {
            fontFamily: "Inter",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.accuracyText = this.add.text(1480, 180, "100.00%", {
            fontFamily: "Inter",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.judgementText = this.add.text(1500, 500, "", {
            fontFamily: "Inter",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.errorText = this.add.text(1500, 600, "", {
            fontFamily: "Inter",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.pauseText = this.add.text(780, 221, "", {
            fontFamily: "Inter",
            color: "#ffffff",
            fontSize: "100px"
        }).setOrigin(0, 0);

        this.pauseHint = this.add.text(730, 318, "", {
            fontFamily: "Inter",
            color: "#ffffff",
            fontSize: "50px"
        }).setOrigin(0, 0);
    }

    prepareInputEvent() {
        const gameKeys = [
            this.noteOuter1Key,
            this.noteInner1Key,
            this.noteInner2Key,
            this.noteOuter2Key
        ];

        gameKeys.forEach((key, index) => {
            key.on("down", () => {
                this.handleInput(index);
                // this.drawInputIndicator(index);
            });

            key.on("up", () => {
                this.handleInput(index, true);
                this.setLongNoteActivity(index, false);
                this.setInputLockActivity(index, false)
            });
        });

        this.replayKey.on("down", () => this.restartScene());
        this.pauseKey.on("down", () => this.togglePause());
    }

    /*
        End this game session and move to game finalizer.
     */
    endGame() {
        this.collectedGameData.trackId = this.gameData["metadata"]["map_set_id"];

        this.collectedGameData.stats =
            {
                duration: this.duration,
                crit: this.totalCrit,
                perf: this.totalPerf,
                good: this.totalGood,
                bad: this.totalBad,
                miss: this.totalMiss,
                // TODO: rework on score calculation
                score: 0,
                accuracy: this.accuracy / 100,
                // TODO: if/else spam
                grade : "S+"
            };

        this.collectedGameData.partial = this.collectedGameData.partial.slice(0, 30);

        console.log(this.collectedGameData);
    }

    /*
        Spawns the note, isn't that obvious?
     */
    spawnNote(note) {
        const pos = note["position"];
        const xPosition = this.getLanePositionX(pos);

        const noteSelection = [
            "noteOuter",
            "noteInner",
            "noteInner",
            "noteOuter",
        ];

        const colorSelection = [
            0xb4befe,
            0xf2cdcd,
            0xf2cdcd,
            0xb4befe
        ];

        const noteObject = this.add.image(xPosition, 0, noteSelection[pos]);

        noteObject.setData("time", note["time"]);
        noteObject.setData("position", pos);
        noteObject.setData("type", note["type"]);
        noteObject.setData("lastUntil", note["lastUntil"]);
        noteObject.setData("lnBody", false);
        noteObject.setDepth(2);

        // we also draw the body for LN start
        if (note["type"] === 1) {
            const startTime = note["time"];
            const endTime = note["lastUntil"];
            const duration = endTime - startTime;
            const height = Math.max(
                0,
                Math.floor((duration / 1000) * this.noteSpeed * this.noteScale) - 30
            );

            const longNoteBody = this.add.rectangle(noteObject.x, noteObject.y, 50, height, colorSelection[pos]);
            longNoteBody.setOrigin(0.5, 1);
            longNoteBody.setData("lnBody", true);
            longNoteBody.setDepth(1);
            longNoteBody.setAlpha(0.5);

            this.notes.add(longNoteBody);
        }

        this.notes.add(noteObject);
        this.notes.setVelocityY(this.noteSpeed * this.noteScale);
    }

    /*
        Get X coordinate of the lane.
     */
    getLanePositionX(keyPosition) {
        return [
            this.noteOuter1PositionX,
            this.noteInner1PositionX,
            this.noteInner2PositionX,
            this.noteOuter2PositionX
        ][keyPosition];
    }

    /*
        Draw judgement text and set a fade time.
     */
    drawJudgementText(judgement, error) {
        this.judgementText.setText(judgement);
        this.errorText.setText(error);

        this.time.delayedCall(200, () => {
            this.judgementText.setText("");
            this.errorText.setText("");
        }, [], this);
    }

    /*
        Get long note activity
     */
    getLongNoteActivity(keyPosition) {
        return [
            this.key1_LN_active,
            this.key2_LN_active,
            this.key3_LN_active,
            this.key4_LN_active
        ][keyPosition];
    }

    /*
        Set long note activity.
     */
    setLongNoteActivity(keyPosition, isHolding) {
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

    /*
        Get key lock.
     */
    getInputLockActivity(keyPosition) {
        return [
            this.key1_locked,
            this.key2_locked,
            this.key3_locked,
            this.key4_locked,
        ][keyPosition];
    }

    /*
        Set key lock.
     */
    setInputLockActivity(keyPosition, isLocked) {
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

    /*
        Handle game input.
     */
    handleInput(keyPosition, isKeyUp = false) {
        const hitTime = this.inGameTimeInMs;
        const xPosition = this.getLanePositionX(keyPosition);
        const noteList = this.notes.getChildren();

        // filter notes that are in the needed lane
        // and near the judgement box
        let notesAtWantedLanes = noteList
            .filter(note => note.getData("lnBody") === false)
            .filter(note => note.x === xPosition)
            .filter(note => Math.abs(note.y - 845) <= 150);

        if (notesAtWantedLanes.length === 0) return;

        // get notes that lies the furthest,
        // but not exceeding the "judgement bound".
        const theChosenOne = notesAtWantedLanes
            .reduce((previousNote, currentNote) => {
                const judgePoint = 845;
                const judgeRange = 100;

                const upperPoint = judgePoint - judgeRange
                const chokePoint = judgePoint + judgeRange;

                return (upperPoint <= currentNote.y && currentNote.y <= chokePoint) && (currentNote.y < previousNote.y)
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
            this.processNote(noteObj, hitTime, keyPosition, false);
        }
    }

    /*
        Process single note and LN start, they are technically the same.
     */
    processNote(noteObj, hitTime, keyPosition, isLnStart = false) {
        const expectedTime = noteObj.getData("time");

        noteObj.destroy();
        ++this.combo;

        const offset = Math.abs(hitTime - expectedTime);
        const isEarly = hitTime < expectedTime;
        const isLate = hitTime > expectedTime;

        let errTxt = isEarly ? "EARLY" : isLate ? "LATE" : "Nice!";

        if (offset <= this.critWindow) {
            ++this.totalCrit;
            ++this.partialCrit;
            ++this.partialNotes;
            this.drawJudgementText("Nice!", "");
        } else if (this.critWindow < offset && offset <= this.perfWindow) {
            ++this.totalPerf;
            ++this.partialPerf;
            ++this.partialNotes;
            this.drawJudgementText("Perfect", errTxt);
        } else if (this.perfWindow < offset && offset <= this.goodWindow) {
            ++this.totalGood;
            ++this.partialGood;
            ++this.partialNotes;
            this.drawJudgementText("Fine", errTxt);
        } else if (this.goodWindow < offset && offset <= this.badWindow) {
            ++this.totalBad;
            ++this.partialBad;
            ++this.partialNotes;
            this.drawJudgementText("Meh.", errTxt);
        } else {
            this.drawJudgementText("What?", "Edge case!");
        }

        this.setLongNoteActivity(keyPosition, isLnStart);
        this.setInputLockActivity(true);
    }

    /*
        Highlights the key being pressed.
     */
    drawInputIndicator(keyPosition) {
        const xPosition = this.getLanePositionX(keyPosition);

        let indicator = this.add.image(xPosition, 845, "indicator");

        setTimeout((x) => {
            x.destroy();
        }, 20, indicator);
    }

    /*
        Toggle pause status of the game.
     */
    togglePause() {
        this.isScenePaused = !this.isScenePaused;

        if (this.isScenePaused) {
            this.time.paused = true;
            this.physics.pause();
            this.notes.setVelocityY(0);
            this.bgMusic.pause();
            this.pauseDimBg.setAlpha(0.5);
            this.pauseText.setText("PAUSED");
            this.pauseText.setDepth(15);
            this.pauseHint.setText("Press ESC to resume.");
            this.pauseHint.setDepth(15);
        } else {
            this.time.paused = false;
            this.physics.resume();
            this.notes.setVelocityY(this.noteSpeed * this.noteScale);
            this.bgMusic.resume();
            this.pauseDimBg.setAlpha(0);
            this.pauseText.setText("");
            this.pauseHint.setText("");
        }
    }

    /*
        Restart the scene.
     */
    restartScene() {
        this.time.paused = false;
        this.scene.restart();
    }

    update(_, delta) {
        // only do stuffs when the game is not paused
        if (this.isScenePaused) return;

        this.inGameTimeInMs += delta;

        // noinspection PointlessArithmeticExpressionJS
        this.accuracy = (
            350 * (this.totalNotes - this.totalGood - this.totalBad - this.totalMiss) +
            // 300 * this.totalPerf +
            200 * this.totalGood +
            50 * this.totalBad +
            0 * this.totalMiss
        ) / (350.00 * this.totalNotes) * 100.0;

        this.notes.getChildren().forEach((note) => {
            if (note.getData("lnBody")) return;

            // handle MISS judgement
            if (note.y > 845 + 200) {
                note.destroy();
                this.combo = 0;
                ++this.totalMiss;
                ++this.partialMiss;
                ++this.partialNotes;
                this.drawJudgementText("Missed.", "");
                this.setLongNoteActivity(this.getLanePositionX(note.x), false);
            }
        });

        this.comboText.setText(`${this.combo}x`);
        this.scoreText.setText(`${this.score}`.padStart(7, "0"));
        this.accuracyText.setText(`${this.accuracy.toFixed(2)}%`.padStart(7, " "));
    }
}

export default Game;
