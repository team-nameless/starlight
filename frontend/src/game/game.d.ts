type Metadata = {
    duration: number;
    title: string;
    artist: string;
    source: string;
    difficulty: number;
    difficulty_name: string;
    note_designer: string;
    audio_file: string;
    background_file: string;
    map_set_id: number;
};

type TimingPoint = {
    time: number;
    bpm: number;
    climax: boolean;
    speed_mul: number;
    volume: number;
};

type StarlightNote = {
    time: number;
    position: number;
    type: number;
    lastUntil: number;
};

export type StarlightMap = {
    metadata: Metadata;
    timing_points: TimingPoint[];
    notes: StarlightNote[];
};

export type GameKeyboardPosition = number | 0 | 1 | 2 | 3;
export type GameHitError = "Nice!" | "EARLY" | "LATE" | "Edge case!" | "";
export type GameHitJudgement = "Nice!" | "Perfect" | "Fine" | "Meh." | "Missed." | "What?";
export type GameNote = Phaser.GameObjects.Image;

type PartialScoreStatistics = {
    crit: number;
    perf: number;
    good: number;
    bad: number;
    miss: number;
};

type ScoreStatistics = PartialScoreStatistics & {
    score: number;
    accuracy: number;
    duration: number;
    maxCombo: number;
    grade: string;
};

type PartitionedScoreStatistics = PartialScoreStatistics & {
    totalNotes: number;
};

export type GameScoreStat = {
    trackId: number;
    trackIndex: number;
    stats?: ScoreStatistics;
    partial: PartitionedScoreStatistics[];
};
