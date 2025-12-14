import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSong: null,
  isPlaying: false,
  volume: 1, 
  currentTime: 0,
  duration: 0,
  playlist: [
    {
      id: 1,
      title: "Night Owl",
      artist: "Broke For Free",
      url: "/songs/track1.mp3", 
      cover: "https://picsum.photos/id/11/300/300",
      duration: "3:10"
    },
    {
      id: 2,
      title: "Lost in the Meadows",
      artist: "Purrple Cat",
      url: "/songs/track2.mp3",
      cover: "https://picsum.photos/id/12/300/300",
      duration: "3:35"
    },
    {
      id: 3,
      title: "For the Love of the Game",
      artist: "Top-Flow",
      url: "/songs/track3.mp3",
      cover: "https://picsum.photos/id/13/300/300",
      duration: "2:54"
    },
    {
      id: 4,
      title: "Electronic Future Beats",
      artist: "QubeSounds",
      url: "/songs/track4.mp3",
      cover: "https://picsum.photos/id/14/300/300",
      duration: "2:15"
    },
    {
      id: 5,
      title: "Lofi Study",
      artist: "FASSounds",
      url: "/songs/track5.mp3",
      cover: "https://picsum.photos/id/15/300/300",
      duration: "2:26"
    },
    {
      id: 6,
      title: "Ambient Piano",
      artist: "Good_B_Music",
      url: "/songs/track6.mp3",
      cover: "https://picsum.photos/id/16/300/300",
      duration: "3:42"
    }
  ],
  currentIndex: 0,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action) => {
      state.currentSong = action.payload;
      state.currentIndex = state.playlist.findIndex((s) => s.id === action.payload.id);
      state.isPlaying = true;
    },
    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },
    nextSong: (state) => {
      if (state.playlist.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.playlist.length;
        state.currentSong = state.playlist[state.currentIndex];
        state.isPlaying = true;
      }
    },
    prevSong: (state) => {
      if (state.playlist.length > 0) {
        state.currentIndex =
          state.currentIndex === 0 ? state.playlist.length - 1 : state.currentIndex - 1;
        state.currentSong = state.playlist[state.currentIndex];
        state.isPlaying = true;
      }
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
  },
});

export const { setActiveSong, playPause, nextSong, prevSong, setVolume, setDuration, setCurrentTime } = playerSlice.actions;
export default playerSlice.reducer;
