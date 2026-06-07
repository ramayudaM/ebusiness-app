import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const ProductMedia = ({ mediaItems }) => {
    if (!mediaItems || mediaItems.length === 0) return null;

    // Only showing the first media for now, typically an audio preview
    const media = mediaItems[0];
    const isAudio = media.media_type === 'audio';

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const mediaRef = useRef(null);

    const togglePlay = () => {
        if (mediaRef.current) {
            if (isPlaying) {
                mediaRef.current.pause();
                setIsPlaying(false);
            } else {
                const playPromise = mediaRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch(error => {
                            console.error("Playback was interrupted:", error);
                            setIsPlaying(false);
                        });
                }
            }
        }
    };

    const handleTimeUpdate = () => {
        if (mediaRef.current) {
            const current = mediaRef.current.currentTime;
            const duration = mediaRef.current.duration || 1;
            setProgress((current / duration) * 100);
        }
    };

    const toggleMute = () => {
        if (mediaRef.current) {
            mediaRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    useEffect(() => {
        const audioEl = mediaRef.current;
        if (audioEl) {
            audioEl.addEventListener('ended', () => setIsPlaying(false));
            return () => {
                audioEl.removeEventListener('ended', () => setIsPlaying(false));
            }
        }
    }, []);

    return (
        <div className="relative group rounded-[2rem] p-[1px] overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900/10 mt-8">
            <div className="relative h-full bg-[#0A0A0A] rounded-[calc(2rem-1px)] p-6 flex flex-col z-10 overflow-hidden">
                {/* Glow decor */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-600/10 blur-[40px] group-hover:bg-orange-500/20 transition-colors duration-500"></div>

                <div className="flex justify-between items-center mb-5 relative z-10">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Pratinjau Suara</h3>
                    {media.title && (
                        <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 rounded-full">
                            {media.title}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <button 
                        onClick={togglePlay}
                        className="w-12 h-12 flex-shrink-0 bg-orange-600 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-105"
                    >
                        {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
                    </button>
                    
                    <div className="flex-1">
                        {/* Visualizer fake lines */}
                        <div className="flex items-end gap-1 h-8 mb-2">
                            {Array.from({ length: 30 }).map((_, i) => {
                                const height = Math.random() * 100;
                                const isActive = (i / 30) * 100 <= progress;
                                return (
                                    <div 
                                        key={i} 
                                        className={`flex-1 rounded-t-sm transition-all duration-300 ${isActive ? 'bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.4)]' : 'bg-zinc-800'}`}
                                        style={{ height: `${Math.max(20, height)}%` }}
                                    />
                                );
                            })}
                        </div>
                        
                        {isAudio ? (
                            <audio 
                                ref={mediaRef} 
                                src={media.media_url} 
                                onTimeUpdate={handleTimeUpdate}
                            />
                        ) : (
                            <video 
                                ref={mediaRef} 
                                src={media.media_url} 
                                className="hidden" 
                                onTimeUpdate={handleTimeUpdate}
                            />
                        )}
                    </div>

                    <button onClick={toggleMute} className="text-zinc-400 hover:text-orange-500 transition-colors">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
