import { Dispatch, MouseEventHandler, SetStateAction } from "react";

import { StarlightSong } from "../index";

/**
 * components/AudioPlayer.tsx props.
 */
type AudioPlayerProps = {
    audioUrl: string;
};

/**
 * components/HeaderBar.tsx props.
 */
type HeaderBarProps = {
    currentSong: StarlightSong;
    currentSongIndex: number;
    songs: StarlightSong[];
    setCurrentSong: Dispatch<SetStateAction<StarlightSong | undefined>>;
    setCurrentSongIndex: Dispatch<SetStateAction<number>>;
    handleSongClick?: (song: StarlightSong) => MouseEventHandler;
    toggleSongList?: () => void;
    isSongListOpen?: boolean;
};

/**
 * components/NextPreviousButton.tsx props.
 */
type NextPrevButtonProps = {
    currentSongIndex: number;
    setCurrentSongIndex: (index: number) => void;
    songs: StarlightSong[];
    setCurrentSong: (song: StarlightSong) => void;
};

/**
 * components/PlayButton.tsx props.
 */
export interface PlayButtonProps {
    currentSong?: StarlightSong | null;
    currentSongIndex?: number;
    isLoading?: boolean;
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    songs?: StarlightSong[];
}
