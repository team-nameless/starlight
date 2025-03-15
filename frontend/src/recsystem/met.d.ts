export interface MetricData {
    isActive: boolean;
    value: number;
}

export interface SongProperties {
    id: number;
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    loudness: number;
}

export interface IdealRange {
    low: number;
    upper: number;
}

export interface IdealRanges {
    focus: IdealRange;
    engage: IdealRange;
    excited: IdealRange;
    interest: IdealRange;
    relax: IdealRange;
    stress: IdealRange;
}
