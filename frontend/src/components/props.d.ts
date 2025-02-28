import { MouseEventHandler } from "react";

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
    handleSongClick: (song: StarlightSong) => MouseEventHandler;
    toggleSongList: () => void;
    isSongListOpen: boolean;
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
type PlayButtonProps = {
    currentSongIndex: number;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    songs: StarlightSong[];
};
