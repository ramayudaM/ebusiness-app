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
            } else {
                mediaRef.current.play();
            }
            setIsPlaying(!isPlaying);
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
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-orange-900 uppercase tracking-widest">Pratinjau Studio</h3>
                {media.title && <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">{media.title}</span>}
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={togglePlay}
                    className="w-12 h-12 flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
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
                                    className={`flex-1 rounded-t-sm transition-all duration-300 ${isActive ? 'bg-orange-500' : 'bg-orange-200'}`}
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
                            className="hidden" // hide video visually, just play audio, or build full video player if needed
                            onTimeUpdate={handleTimeUpdate}
                        />
                    )}
                </div>

                <button onClick={toggleMute} className="text-orange-600 hover:text-orange-800">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>
        </div>
    );
};
