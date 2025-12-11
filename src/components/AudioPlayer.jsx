import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextSong, setDuration, setCurrentTime } from '../features/playerSlice';

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume } = useSelector((state) => state.player);
  
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((e) => console.log("Playback error:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
        dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  const handleLoadedData = () => {
    if (audioRef.current) {
        dispatch(setDuration(audioRef.current.duration));
        if (isPlaying) audioRef.current.play();
    }
  };

  return (
    <audio
      ref={audioRef}
      src={currentSong?.url}
      onTimeUpdate={handleTimeUpdate}
      onLoadedData={handleLoadedData}
      onEnded={() => dispatch(nextSong())}
    />
  );
};

export default AudioPlayer;
