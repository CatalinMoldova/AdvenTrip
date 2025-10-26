import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import {
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  X as XIcon,
  Video,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { Adventure } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { searchTravelVideos, YouTubeVideo } from '../services/youtubeService';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdventureVideoCardProps {
  adventure: Adventure;
  onSave: () => void;
  onPass: () => void;
  preferVideo?: boolean; // Toggle between video and image mode
}

export const AdventureVideoCard: React.FC<AdventureVideoCardProps> = ({
  adventure,
  onSave,
  onPass,
  preferVideo = true,
}) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [showVideo, setShowVideo] = useState(preferVideo);
  const [hasVideos, setHasVideos] = useState(false);

  // Fetch videos when component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      if (!preferVideo) return;
      
      setIsLoadingVideos(true);
      try {
        // Extract destination from adventure title or use first location
        const destination = adventure.title.split(' ')[0] || adventure.destination;
        const fetchedVideos = await searchTravelVideos(destination, 3);
        
        if (fetchedVideos.length > 0) {
          setVideos(fetchedVideos);
          setHasVideos(true);
          setShowVideo(true);
        } else {
          setHasVideos(false);
          setShowVideo(false);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setHasVideos(false);
        setShowVideo(false);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    fetchVideos();
  }, [adventure.title, adventure.destination, preferVideo]);

  // Auto-scroll images when in image mode
  useEffect(() => {
    if (showVideo || adventure.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % adventure.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [adventure.images.length, showVideo]);

  const toggleMediaType = () => {
    if (hasVideos) {
      setShowVideo(!showVideo);
    }
  };

  const nextVideo = () => {
    if (videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  };

  const previousVideo = () => {
    if (videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    }
  };

  return (
    <Card className="relative w-full max-w-sm h-[600px] overflow-hidden shadow-xl">
      {/* Media Container */}
      <div className="relative w-full h-[400px] bg-gray-900">
        {isLoadingVideos ? (
          // Loading state
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
              <p className="text-white text-sm">Loading travel videos...</p>
            </div>
          </div>
        ) : showVideo && videos.length > 0 ? (
          // Video mode
          <>
            <VideoPlayer
              video={videos[currentVideoIndex]}
              autoPlay={true}
              className="w-full h-full"
            />
            
            {/* Video navigation dots */}
            {videos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentVideoIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // Image mode (fallback)
          <>
            <ImageWithFallback
              src={adventure.images[currentImageIndex]}
              alt={adventure.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image navigation dots */}
            {adventure.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {adventure.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Media type toggle button */}
        {hasVideos && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMediaType}
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            {showVideo ? (
              <ImageIcon className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
          </Button>
        )}

        {/* Video badge */}
        {showVideo && videos.length > 0 && (
          <Badge className="absolute top-4 left-4 z-20 bg-red-600 text-white">
            <Video className="w-3 h-3 mr-1" />
            Video {currentVideoIndex + 1}/{videos.length}
          </Badge>
        )}
      </div>

      {/* Adventure Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {adventure.title}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{adventure.destination}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{adventure.duration} days</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>${adventure.estimatedCost}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onPass}
            className="flex-1"
          >
            <XIcon className="w-5 h-5 mr-2" />
            Pass
          </Button>
          <Button
            size="lg"
            onClick={onSave}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Bookmark className="w-5 h-5 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdventureVideoCard;

