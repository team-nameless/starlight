import Phaser from "phaser";

/*
 *  The game.
 */
class MainScene extends Phaser.Scene {
    // note groups
    notes;
    rawNoteList;

    // gameplay properties
    noteSpeed = 100;
    noteScale = 15;
    gameData;

    // note positions
    notePositionBase = 680;
    notePositionGaps = 184;
    noteOuter1PositionX = this.notePositionBase;
    noteInner1PositionX = this.notePositionBase + this.notePositionGaps;
    noteInner2PositionX = this.notePositionBase + this.notePositionGaps * 2;
    noteOuter2PositionX = this.notePositionBase + this.notePositionGaps * 3;

    // gameplay elements
    judgementPrintX = 1500;
    judgementPrintY = 500;
    errorPrintX = 1500;
    errorPrintY = 600;
    gameStartTime;
    scoreText;
    comboText;
    accuracyText;
    judgementText;
    errorText;

    // buttons
    noteOuter1Key;
    noteInner1Key;
    noteInner2Key;
    noteOuter2Key;

    // random
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
    inGameTimeInMs;

    constructor() {
        super("MainScene");
    }

    init(data) {
        this.combo = 0;
        this.score = 0;
        this.totalCrit = 0;
        this.totalPerf = 0;
        this.totalGood = 0;
        this.totalBad = 0;
        this.totalMiss = 0;
        this.inGameTimeInMs = 0;
        this.accuracy = 100;
        this.gameData = data.gameData;
        this.rawNoteList = this.gameData.notes;
        this.gameStartTime = new Date(Date.now());

        // input
        this.noteOuter1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.noteInner1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.noteInner2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEMICOLON);
        this.noteOuter2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.QUOTES);

        // notes
        this.notes = this.physics.add.group();

        // pause the game to wait for music
        this.scene.pause();
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

        this.comboText = this.add.text(200, 900, "0x", {
            fontFamily: "sans-serif",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.accuracyText = this.add.text(1480, 180, "100.00%", {
            fontFamily: "sans-serif",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.judgementText = this.add.text(this.judgementPrintX, this.judgementPrintY, ".", {
            fontFamily: "sans-serif",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.errorText = this.add.text(this.errorPrintX, this.errorPrintY, ".", {
            fontFamily: "sans-serif",
            color: "#ffffff",
            fontSize: "60px"
        }).setOrigin(0, 0);

        this.totalNotes = this.rawNoteList.length;

        this.rawNoteList.forEach((note) => {
            const screenHeight = 845;
            const timeToScroll = (screenHeight / (this.noteSpeed * this.noteScale)) * 1000;
            const spawnTime = Math.max(0, note.time - timeToScroll);

            this.time.delayedCall(spawnTime, () => { this.spawnNote(note); });
        });
    }

    create() {
        let bgMusic = this.sound.add("music");
        this.scene.resume();
        this.gameStartTime = new Date(Date.now());
        bgMusic.play();
    }

    spawnNote(note) {
        // I sleep
        let pos = note.position -= 1;

        const xPositions = [
            this.noteOuter1PositionX,
            this.noteInner1PositionX,
            this.noteInner2PositionX,
            this.noteOuter2PositionX
        ];

        const noteObject = this.add.image(xPositions[pos], 0, "noteOuter");

        noteObject.setData("time", note.time);
        noteObject.setData("position", pos);
        noteObject.setData("type", note.type);

        this.notes.add(noteObject);
        this.notes.setVelocityY(this.noteSpeed * this.noteScale);
    }

    handleInput(keyPosition) {
        const now = this.inGameTimeInMs;

        // I sleep again.
        keyPosition -= 1;

        const xPositions = [
            this.noteOuter1PositionX,
            this.noteInner1PositionX,
            this.noteInner2PositionX,
            this.noteOuter2PositionX
        ];

        const noteList = this.notes.getChildren();

        // filter notes that are in the needed lane
        // and near the judgement box
        let notesAtWantedLanes = noteList
            .filter(note => note.x === xPositions[keyPosition])
            .filter(note => Math.abs(note.y - 845) <= 150);

        if (notesAtWantedLanes.length === 0) return;

        // get notes that lies the furthest,
        // but not exceeding the "judgement bound".
        const theChosenOne = notesAtWantedLanes
            .reduce((previousValue, currentValue) => {
                const judgePoint = 845;
                const judgeRange = 100;

                const upperPoint = judgePoint - judgeRange
                const chokePoint = judgePoint + judgeRange;

                const currentNoteObj = currentValue;
                const lastNoteObj = previousValue;

                const acceptedNote =
                    (upperPoint <= currentNoteObj.y && currentNoteObj.y <= chokePoint) && (currentNoteObj.y < lastNoteObj.y)
                        ? currentValue
                        : previousValue;

                return acceptedNote;
            });

        // welp, no note I guess?
        if (theChosenOne === null) return;

        const noteObj = theChosenOne;

        const hitTime = now;
        const expectedTime = noteObj.getData("time");

        noteObj.destroy();
        ++this.combo;

        const phaserError = 30;
        const offset = Math.abs(hitTime - expectedTime - phaserError);
        const isEarly = hitTime < expectedTime;
        const isLate = hitTime > expectedTime;

        console.log(`Current time: ${now}, Hit time: ${hitTime}, Expected: ${expectedTime}`);
        console.log(offset);

        let errTxt = isEarly ? "EARLY" : isLate ? "LATE" : "Nice!";

        if (offset <= 10) {
            ++this.totalCrit;
            this.judgementText.setText("Nice!");
            this.errorText.setText("");
        }
        else if (10 < offset && offset <= 25) {
            ++this.totalPerf;
            this.judgementText.setText("Perfect");
            this.errorText.setText(errTxt);
        }
        else if (25 < offset && offset <= 50) {
            ++this.totalGood;
            this.judgementText.setText("Fine");
            this.errorText.setText(errTxt);
        }
        else if (50 < offset && offset <= 80) {
            ++this.totalBad;
            this.judgementText.setText("Meh.");
            this.errorText.setText(errTxt);
        } else {
            this.judgementText.setText("Missed");
            this.errorText.setText("");
        }
    }

    update(time, delta) {
        this.inGameTimeInMs += delta;

        if (this.noteOuter1Key.isDown) this.handleInput(1);
        if (this.noteInner1Key.isDown) this.handleInput(2);
        if (this.noteInner2Key.isDown) this.handleInput(3);
        if (this.noteOuter2Key.isDown) this.handleInput(4);

        // noinspection PointlessArithmeticExpressionJS
        this.accuracy = (
                350 * (this.totalNotes - this.totalGood - this.totalBad - this.totalMiss) +
                // 300 * this.totalPerf +
                200 * this.totalGood +
                 50 * this.totalBad  +
                  0 * this.totalMiss
            ) / (350.00 * this.totalNotes) * 100.0;

        this.comboText.setText(`${this.combo}x`);
        this.scoreText.setText(`${this.score}`.padStart(7, "0"));
        this.accuracyText.setText(`${this.accuracy.toFixed(2)}%`.padStart(7, " "));

        // handle MISS judgement
        this.notes.getChildren().forEach((note) => {
            const noteObj = note;
            const noteY = noteObj.y;

            if (noteY > 845 + 200) {
                noteObj.destroy();
                this.combo = 0;
                ++this.totalMiss;
            }
        });
    }
}

export default MainScene;
