import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play, Pause, SkipForward, SkipBack, Volume2, Volume1, VolumeX, Heart, MoreHorizontal, Music2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import AudioPlayer from './components/AudioPlayer';
import ThreeScene from './components/ThreeScene';
import { playPause, nextSong, prevSong, setVolume, setActiveSong } from './features/playerSlice';

function App() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, playlist, currentTime, duration, volume } = useSelector((state) => state.player);
  const [analyser, setAnalyser] = React.useState(null);
  
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
        <ThreeScene isPlaying={isPlaying} analyser={analyser} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] h-[90vh] p-4 lg:p-6 flex gap-4 lg:gap-8">
        
        {/* LEFT PANEL: PLAYER FOCUS */}
        <div className="flex-1 bg-[#0a0a0a]/30 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 lg:p-12 flex flex-col relative overflow-hidden shadow-2xl">
            
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

            {/* Main Visual - Album Art */}
            <div className="relative flex-1 flex flex-col justify-center items-center text-center px-4 min-h-0">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={currentSong?.id}
                    className="relative w-64 h-64 lg:w-[22rem] lg:h-[22rem] mb-8 rounded-2xl shadow-2xl overflow-hidden shrink-0"
                >
                    <img 
                        src={currentSong?.cover || "https://via.placeholder.com/400?text=No+Cover"} 
                        alt="Album Art"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="space-y-3 mb-9">
                    <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight leading-tight">{currentSong?.title || "Synthetic Dreams"}</h1>
                    <p className="text-base lg:text-xl text-gray-400 font-medium">{currentSong?.artist || "Ketsa (FMA Demo)"}</p>
                </div>
            </div>

            {/* Controls Area */}
            <div className="relative mt-8 w-full max-w-3xl mx-auto space-y-8">
                
                {/* Progress Bar */}
                <div className="space-y-3 group/bar">
                    <div className="flex justify-between text-xs font-mono font-medium text-gray-400">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    
                    {/* Interaction Container - Height 4 (1rem/16px) for easier clicking */}
                    <div className="relative w-full h-4 flex items-center cursor-pointer">
                        
                        {/* Visual Track Background */}
                        <div className="absolute w-full h-1.5 bg-white/10 rounded-full group-hover:h-2 transition-all duration-200">
                             {/* Filled Progress */}
                            <div 
                                className="absolute h-full bg-green-500 rounded-full pointer-events-none" 
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            />
                        </div>

                        {/* Hidden Input Range - High Z-index, Full Container Size */}
                        <input 
                            type="range" 
                            min="0" 
                            max={duration || 100} 
                            value={currentTime} 
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                    </div>
                </div>

                {/* Main Buttons Row */}
                <div className="flex items-center justify-between pt-2">
                    
                    {/* Volume Control (Left) */}
                    <div className="flex items-center gap-3 w-32 group/vol">
                        <button 
                            onClick={() => dispatch(setVolume(volume === 0 ? 0.75 : 0))}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {volume === 0 ? (
                                <VolumeX size={20} />
                            ) : volume < 0.5 ? (
                                <Volume1 size={20} />
                            ) : (
                                <Volume2 size={20} />
                            )}
                        </button>
                        
                        <div className="flex items-center gap-2">
                             <button
                                onClick={() => dispatch(setVolume(Math.max(0, volume - 0.1)))}
                                className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition"
                             >
                                <Minus size={16} />
                             </button>
                             
                             <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-500 rounded-full transition-all duration-200" 
                                    style={{ width: `${volume * 100}%` }}
                                />
                             </div>

                             <button
                                onClick={() => dispatch(setVolume(Math.min(1, volume + 0.1)))}
                                className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition"
                             >
                                <Plus size={16} />
                             </button>
                        </div>
                    </div>

                    {/* Playback Controls (Center) */}
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => dispatch(prevSong())} 
                            className="text-gray-400 hover:text-white transition hover:scale-110 active:scale-95"
                        >
                            <SkipBack size={32} strokeWidth={1.5} />
                        </button>
                        
                        <button 
                            onClick={() => dispatch(playPause(!isPlaying))}
                            className="w-16 h-16 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        >
                            {isPlaying ? <Pause size={30} fill="black" /> : <Play size={30} fill="black" className="ml-1" />}
                        </button>

                        <button 
                            onClick={() => dispatch(nextSong())} 
                            className="text-gray-400 hover:text-white transition hover:scale-110 active:scale-95"
                        >
                            <SkipForward size={32} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Favorite Button (Right) */}
                    <div className="w-32 flex justify-end">
                        <button className="text-gray-400 hover:text-green-500 transition hover:scale-110 active:scale-95">
                            <Heart size={22} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT PANEL: PLAYLIST */}
        <div className="w-[420px] bg-[#0a0a0a]/30 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col shrink-0">
            <div className="mb-6">
                <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">Playlist</p>
                <h2 className="text-2xl font-bold text-white mb-2">Your tracks <span className="text-gray-500 font-medium">({playlist.length} slots)</span></h2>
                <p className="text-sm text-gray-400 leading-relaxed">Click a track to play it instantly. Replace audio & cover files with real FMA assets for production.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {playlist.map((song, i) => {
                    const isActive = currentSong?.id === song.id;
                    return (
                        <div 
                            key={song.id}
                            onClick={() => dispatch(setActiveSong(song))}
                            className={`group p-3 rounded-xl flex items-center gap-4 cursor-pointer transition-all border ${
                                isActive 
                                ? 'bg-[#1a2c20] border-green-500/30' 
                                : 'bg-transparent border-transparent hover:bg-white/5'
                            }`}
                        >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                <img src={song.cover} alt="art" className="w-full h-full object-cover" />
                                {isActive && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold text-sm truncate ${isActive ? 'text-green-400' : 'text-gray-200 group-hover:text-white'}`}>
                                    {song.title}
                                </h4>
                                <p className={`text-xs truncate ${isActive ? 'text-green-500/70' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                    {song.artist}
                                </p>
                            </div>

                            <span className={`text-xs font-mono ${isActive ? 'text-green-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                {song.duration || "3:00"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

      </div>

      <AudioPlayer setAnalyser={setAnalyser} />
      
      {/* Global Styles for Scrollbar and Range Input */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        
        /* Reset for range inputs */
        input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
        }
        
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: white;
            margin-top: -6px; /* You need to specify a margin in Chrome, but since we are opacity 0 it matters less visually, but good for hit testing */
        }
        
        input[type=range]:focus { outline: none; }
      `}</style>
    </div>
  );
}

export default App;