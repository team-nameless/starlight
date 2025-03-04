export interface StarlightSong {
    id: number;
    title: string;
    artist: string;
    difficulty: number;
    tempo: number;
    genre: string;
    melody: string;
    audioUrl: string;
    backgroundUrl: string;
    chartUrl: string;
    coverUrl: string;
}

type StarlightUser = {
    id: number;
    name: string;
    profilePic: string;
};

export interface ScoreRecord {
    trackId: number;
    trackName: string;
    totalPoints: number;
    accuracy: number;
    maxCombo: number;
    critical: number;
    perfect: number;
    good: number;
    bad: number;
    miss: number;
    grade: string;
}