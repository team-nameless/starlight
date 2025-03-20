import { MetricData } from "./met";

/*
export const trackList: SongProperties[] = [
    { id: 1, danceability: 0.585, energy: 0.842, valence: 0.428, tempo: 118.211, loudness: -5.883 },
    { id: 2, danceability: 0.592, energy: 0.741, valence: 0.441, tempo: 90.578, loudness: -8.019 },
    { id: 3, danceability: 0.854, energy: 0.831, valence: 0.651, tempo: 145.911, loudness: -7.211 },
    {
        id: 4,
        danceability: 0.279,
        energy: 0.211,
        valence: 0.0594,
        tempo: 80.954,
        loudness: -20.096
    },
    { id: 5, danceability: 0.819, energy: 0.341, valence: 0.963, tempo: 60.936, loudness: -12.441 },
    {
        id: 6,
        danceability: 0.328,
        energy: 0.166,
        valence: 0.0394,
        tempo: 110.339,
        loudness: -14.85
    },
    { id: 7, danceability: 0.275, energy: 0.309, valence: 0.165, tempo: 100.109, loudness: -9.316 },
    {
        id: 8,
        danceability: 0.418,
        energy: 0.193,
        valence: 0.253,
        tempo: 101.665,
        loudness: -10.096
    },
    {
        id: 9,
        danceability: 0.697,
        energy: 0.346,
        valence: 0.196,
        tempo: 119.824,
        loudness: -12.505
    },
    {
        id: 10,
        danceability: 0.518,
        energy: 0.203,
        valence: 0.406,
        tempo: 66.221,
        loudness: -10.589
    },
    {
        id: 11,
        danceability: 0.389,
        energy: 0.088,
        valence: 0.0731,
        tempo: 92.867,
        loudness: -21.091
    },
    { id: 12, danceability: 0.485, energy: 0.13, valence: 0.721, tempo: 64.678, loudness: -21.508 }
];
*/
export const idealRanges = {
    focus: { low: 0.75, upper: 1 },
    engage: { low: 0.75, upper: 1 },
    excited: { low: 0.75, upper: 1 },
    interest: { low: 0.75, upper: 1 },
    relax: { low: 0.75, upper: 1 },
    stress: { low: 0, upper: 0.3 }
};

export const sampleData: MetricData[][] = [
    //although it sample in 180s, but the PM computer is slow and retrieve 10s per "met"
    [
        { isActive: true, value: 0.61692 }, // foc
        { isActive: true, value: 0.715575 }, // eng
        { isActive: true, value: 0.775358 }, // exc
        { isActive: true, value: 0.614735 }, // int
        { isActive: true, value: 0.831694 }, // rel
        { isActive: true, value: 0.434111 } // str
    ],
    [
        { isActive: true, value: 0.865566 },
        { isActive: true, value: 0.78368 },
        { isActive: true, value: 0.548721 },
        { isActive: true, value: 0.83725 },
        { isActive: true, value: 0.764488 },
        { isActive: true, value: 0.780369 }
    ],
    [
        { isActive: true, value: 0.819565 },
        { isActive: true, value: 0.789427 },
        { isActive: true, value: 0.769631 },
        { isActive: true, value: 0.791657 },
        { isActive: true, value: 0.802753 },
        { isActive: true, value: 0.781882 }
    ],
    [
        { isActive: true, value: 0.820804 },
        { isActive: true, value: 0.846238 },
        { isActive: true, value: 0.783299 },
        { isActive: true, value: 0.735337 },
        { isActive: true, value: 0.818331 },
        { isActive: true, value: 0.805627 }
    ],
    [
        { isActive: true, value: 0.704383 },
        { isActive: true, value: 0.687858 },
        { isActive: true, value: 0.769206 },
        { isActive: true, value: 0.82666 },
        { isActive: true, value: 0.755274 },
        { isActive: true, value: 0.783869 }
    ],
    [
        { isActive: true, value: 0.797928 },
        { isActive: true, value: 0.801127 },
        { isActive: true, value: 0.810663 },
        { isActive: true, value: 0.767019 },
        { isActive: true, value: 0.740127 },
        { isActive: true, value: 0.352348 }
    ],
    [
        { isActive: true, value: 0.80514 },
        { isActive: true, value: 0.797055 },
        { isActive: true, value: 0.733724 },
        { isActive: true, value: 0.730746 },
        { isActive: true, value: 0.826763 },
        { isActive: true, value: 0.774343 }
    ],
    [
        { isActive: true, value: 0.741045 },
        { isActive: true, value: 0.774288 },
        { isActive: true, value: 0.781875 },
        { isActive: true, value: 0.805505 },
        { isActive: true, value: 0.753302 },
        { isActive: true, value: 0.202619 }
    ],
    [
        { isActive: true, value: 0.776106 },
        { isActive: true, value: 0.742114 },
        { isActive: true, value: 0.788243 },
        { isActive: true, value: 0.821269 },
        { isActive: true, value: 0.754312 },
        { isActive: true, value: 0.762384 }
    ],
    [
        { isActive: true, value: 0.846337 },
        { isActive: true, value: 0.857372 },
        { isActive: true, value: 0.825905 },
        { isActive: true, value: 0.736708 },
        { isActive: true, value: 0.836191 },
        { isActive: true, value: 0.582815 }
    ],
    [
        { isActive: true, value: 0.782467 },
        { isActive: true, value: 0.77607 },
        { isActive: true, value: 0.764742 },
        { isActive: true, value: 0.836144 },
        { isActive: true, value: 0.826267 },
        { isActive: true, value: 0.850577 }
    ],
    [
        { isActive: true, value: 0.813467 },
        { isActive: true, value: 0.824077 },
        { isActive: true, value: 0.849195 },
        { isActive: true, value: 0.840657 },
        { isActive: true, value: 0.768145 },
        { isActive: true, value: 0.415177 }
    ],
    [
        { isActive: true, value: 0.842709 },
        { isActive: true, value: 0.828741 },
        { isActive: true, value: 0.840054 },
        { isActive: true, value: 0.807035 },
        { isActive: true, value: 0.865999 },
        { isActive: true, value: 0.795568 }
    ],
    [
        { isActive: true, value: 0.843333 },
        { isActive: true, value: 0.86778 },
        { isActive: true, value: 0.825243 },
        { isActive: true, value: 0.828525 },
        { isActive: true, value: 0.850006 },
        { isActive: true, value: 0.571212 }
    ],
    [
        { isActive: true, value: 0.827101 },
        { isActive: true, value: 0.809708 },
        { isActive: true, value: 0.827456 },
        { isActive: true, value: 0.881717 },
        { isActive: true, value: 0.815265 },
        { isActive: true, value: 0.855227 }
    ],
    [
        { isActive: true, value: 0.862893 },
        { isActive: true, value: 0.867249 },
        { isActive: true, value: 0.894769 },
        { isActive: true, value: 0.829229 },
        { isActive: true, value: 0.850801 },
        { isActive: true, value: 0.505011 }
    ],
    [
        { isActive: true, value: 0.85689 },
        { isActive: true, value: 0.844473 },
        { isActive: true, value: 0.811396 },
        { isActive: true, value: 0.844793 },
        { isActive: true, value: 0.878867 },
        { isActive: true, value: 0.373156 }
    ],
    [
        { isActive: true, value: 0.838412 },
        { isActive: true, value: 0.860031 },
        { isActive: true, value: 0.840151 },
        { isActive: true, value: 0.847057 },
        { isActive: true, value: 0.816775 },
        { isActive: true, value: 0.366497 }
    ]
];
