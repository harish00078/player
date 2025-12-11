import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, MoreHorizontal, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioPlayer from './components/AudioPlayer';
import ThreeScene from './components/ThreeScene';
import { playPause, nextSong, prevSong, setVolume, setActiveSong } from './features/playerSlice';

function App() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, playlist, currentTime, duration, volume } = useSelector((state) => state.player);
  
  useEffect(() => {
    if (!currentSong && playlist.length > 0) {
      dispatch(setActiveSong(playlist[0]));
    }
  }, [playlist, dispatch, currentSong]);

  const handleSeek = (e) => {
    const audio = document.querySelector('audio');
    if(audio) audio.currentTime = e.target.value;
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white flex items-center justify-center font-sans selection:bg-green-500/30 overflow-hidden">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <ThreeScene isPlaying={isPlaying} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] h-[90vh] p-4 lg:p-6 flex gap-4 lg:gap-6">
        
        {/* LEFT PANEL: PLAYER FOCUS */}
        <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[2rem] border border-white/5 p-8 lg:p-10 flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="relative flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-green-500 uppercase">
                    <Music2 size={14} />
                    <span>Now Playing</span>
                </div>
                <button className="text-gray-400 hover:text-white transition">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Main Visual - Album Art / Empty State */}
            <div className="relative flex-1 flex flex-col justify-center items-center text-center px-4">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={currentSong?.id}
                    className="relative w-64 h-64 lg:w-80 lg:h-80 mb-8 rounded-xl shadow-2xl overflow-hidden"
                >
                    <img 
                        src={currentSong?.cover || "https://via.placeholder.com/400?text=No+Cover"} 
                        alt="Album Art"
                        className="w-full h-full object-cover"
                    />
                    {/* Subtle pulse effect on album art when playing */}
                    {isPlaying && (
                        <motion.div 
                            animate={{ opacity: [0.3, 0.1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 bg-green-400/20 rounded-xl"
                        />
                    )}
                </motion.div>

                <div className="space-y-2">
                    <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">{currentSong?.title || "Synthetic Dreams"}</h1>
                    <p className="text-base lg:text-lg text-gray-400 font-medium">{currentSong?.artist || "Ketsa (FMA Demo)"}</p>
                </div>
            </div>

            {/* Controls Area */}
            <div className="relative mt-auto w-full max-w-2xl mx-auto space-y-6">
                
                {/* Progress Bar */}
                <div className="space-y-2 group/bar">
                    <div className="flex justify-between text-xs font-mono font-medium text-gray-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div className="relative h-1.5 w-full bg-gray-800 rounded-full cursor-pointer">
                        <div 
                            className="absolute h-full bg-green-500 rounded-full transition-all duration-100 ease-out" 
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        />
                        <input 
                            type="range" 
                            min="0" 
                            max={duration || 100} 
                            value={currentTime} 
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Main Buttons and Volume */}
                <div className="flex items-center justify-between">
                    
                    {/* Volume Control */}
                    <div className="flex items-center gap-2 group/vol">
                        <button onClick={() => dispatch(setVolume(volume === 0 ? 0.75 : 0))}>
                            <Volume2 size={20} className="text-gray-400 hover:text-white transition-colors" />
                        </button>
                        <input 
                            type="range" 
                            min="0" max="1" step="0.01" 
                            value={volume}
                            onChange={(e) => dispatch(setVolume(e.target.value))}
                            className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                    </div>

                    {/* Playback Controls (Center) */}
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => dispatch(prevSong())} 
                            className="text-gray-400 hover:text-white transition hover:scale-110 active:scale-95"
                        >
                            <SkipBack size={28} />
                        </button>
                        
                        <button 
                            onClick={() => dispatch(playPause(!isPlaying))}
                            className="w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                        >
                            {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                        </button>

                        <button 
                            onClick={() => dispatch(nextSong())} 
                            className="text-gray-400 hover:text-white transition hover:scale-110 active:scale-95"
                        >
                            <SkipForward size={28} />
                        </button>
                    </div>

                    {/* Favorite Button (Right aligned) */}
                    <div className="w-32 flex justify-end">
                        <button className="text-gray-400 hover:text-green-500 transition">
                            <Heart size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT PANEL: PLAYLIST */}
        <div className="w-[28rem] bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[2rem] border border-white/5 p-8 flex flex-col">
            <div className="mb-8">
                <p className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">Playlist</p>
                <h2 className="text-2xl font-bold text-white mb-2">Your tracks <span className="text-gray-500 font-normal">({playlist.length} slots)</span></h2>
                <p className="text-sm text-gray-500">Click a track to play it instantly. Replace audio & cover files with real FMA assets for production.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {playlist.map((song, i) => {
                    const isActive = currentSong?.id === song.id;
                    return (
                        <div 
                            key={song.id}
                            onClick={() => dispatch(setActiveSong(song))}
                            className={`group p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border ${
                                isActive 
                                ? 'bg-[#1a2c20] border-green-700' 
                                : 'bg-transparent border-transparent hover:bg-white/5'
                            }`}
                        >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                <img src={song.cover} alt="art" className="w-full h-full object-cover" />
                                {isActive && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#86efac]" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold text-sm truncate ${isActive ? 'text-green-300' : 'text-gray-200 group-hover:text-white'}`}>
                                    {song.title}
                                </h4>
                                <p className={`text-xs truncate ${isActive ? 'text-green-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                    {song.artist}
                                </p>
                            </div>

                            <span className={`text-xs font-mono ${isActive ? 'text-green-300' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                {song.duration || "3:00"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

      </div>

      <AudioPlayer />
      
      {/* Global Styles for Scrollbar and Range Input */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
        
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #ffffff;
            margin-top: -5px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            cursor: grab;
        }
        input[type=range]::-webkit-slider-runnable-track {
            height: 2px;
            background: #262626; /* neutral-800 */
            border-radius: 9999px;
        }
        input[type=range]::-webkit-slider-thumb:active {
            cursor: grabbing;
        }
      `}</style>
    </div>
  );
}

export default App;