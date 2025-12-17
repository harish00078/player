import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextSong, setDuration, setCurrentTime } from '../features/playerSlice';

const AudioPlayer = ({ setAnalyser }) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume } = useSelector((state) => state.player);
  
  // Initialize Audio Context and Analyser
  useEffect(() => {
    if (audioRef.current && !audioContextRef.current) {
        // Create AudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        audioContextRef.current = audioCtx;

        // Create Analyser
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; // Balance between detail and performance
        
        // Connect Audio Element to Analyser
        try {
            const source = audioCtx.createMediaElementSource(audioRef.current);
            sourceRef.current = source;
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            // Pass analyser up to parent
            if (setAnalyser) {
                setAnalyser(analyser);
            }
        } catch (e) {
            console.error("Error connecting audio source:", e);
        }
    }
  }, [setAnalyser]);

  // Handle Play/Pause and AudioContext Resume
  useEffect(() => {
    if (isPlaying) {
      // Resume AudioContext if suspended (browser autoplay policy)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.log("Playback error (likely interrupted):", e));
      }
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
        if (isPlaying) {
             if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
             }
             audioRef.current.play().catch(e => console.error("Auto-play error:", e));
        }
    }
  };

  return (
    <audio
      ref={audioRef}
      src={currentSong?.url}
      crossOrigin="anonymous" 
      onTimeUpdate={handleTimeUpdate}
      onLoadedData={handleLoadedData}
      onEnded={() => dispatch(nextSong())}
    />
  );
};

export default AudioPlayer;