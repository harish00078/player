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
      artist: "Broke For Free (FMA Demo)",
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3", 
      cover: "https://picsum.photos/id/11/300/300",
      duration: "3:10"
    },
    {
      id: 2,
      title: "Synthetic Dreams",
      artist: "Ketsa (FMA Demo)",
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_01_-_Synthetic_Dreams.mp3",
      cover: "https://picsum.photos/id/12/300/300",
      duration: "3:11"
    },
    {
      id: 3,
      title: "Lo-Fi Gateway",
      artist: "Komiku (FMA Demo)",
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Komiku/Captain_Glouglou/Komiku_-_02_-_Lo-Fi_Gateway.mp3",
      cover: "https://picsum.photos/id/13/300/300",
      duration: "3:12"
    },
    {
      id: 4,
      title: "Neon City",
      artist: "Scott Holmes (FMA Demo)",
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Synthwave_Vol_1/Scott_Holmes_-_05_-_Neon_City.mp3",
      cover: "https://picsum.photos/id/14/300/300",
      duration: "3:13"
    },
    {
      id: 5,
      title: "Midnight Drive",
      artist: "Loyalty Freak Music (FMA Demo)",
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Loyalty_Freak_Music/TO_CHILL_AND_KILL/Loyalty_Freak_Music_-_04_-_Midnight_Drive.mp3",
      cover: "https://picsum.photos/id/15/300/300",
      duration: "3:14"
    },
    {
      id: 6,
      title: "Ocean Echoes",
      artist: "Audiobinger (FMA Demo)",
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Audiobinger/The_Garden_State/Audiobinger_-_03_-_Ocean_Echoes.mp3",
      cover: "https://picsum.photos/id/16/300/300",
      duration: "3:15"
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
