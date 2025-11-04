import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { YouTubeVideo, formatDuration, formatViewCount } from '../services/youtubeService';

interface VideoPlayerProps {
  video: YouTubeVideo;
  autoPlay?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  autoPlay = true,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  const togglePlay = () => {
    if (iframeRef.current) {
      const message = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"${message}","args":""}`,
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current) {
      const message = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"${message}","args":""}`,
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      className={`relative w-full h-full bg-black overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* YouTube iframe */}
      <iframe
        ref={iframeRef}
        src={`${video.embedUrl}&enablejsapi=1`}
        title={video.title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: 'none' }}
      />

      {/* Video overlay with controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top info */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">
                {video.title}
              </h3>
              <p className="text-white/80 text-xs mt-1 drop-shadow-lg">
                {video.channelTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Center play/pause button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" fill="white" />
            ) : (
              <Play className="w-8 h-8 ml-1" fill="white" />
            )}
          </Button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white text-xs drop-shadow-lg">
                {formatViewCount(video.viewCount)}
              </span>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-white text-xs drop-shadow-lg">
                {formatDuration(video.duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tap to show controls overlay */}
      {!showControls && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setShowControls(true)}
        />
      )}
    </div>
  );
};

export default VideoPlayer;

