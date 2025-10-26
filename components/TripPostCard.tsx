import React, { useState, useEffect } from 'react';
import { TripPost } from '../types';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, Share2, Bookmark, MoreHorizontal, MapPin, Calendar, Star, Hotel, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';

interface TripPostCardProps {
  post: TripPost;
  onSave?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onSwipeLeft?: (postId: string) => void;
  onSwipeRight?: (postId: string) => void;
  isSaved?: boolean;
}

export function TripPostCard({
  post,
  onSave,
  onShare,
  onRepost,
  onSwipeLeft,
  onSwipeRight,
  isSaved = false,
}: TripPostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSavedState, setIsSavedState] = useState(isSaved);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Sync saved state with prop
  useEffect(() => {
    setIsSavedState(isSaved);
  }, [isSaved]);

  // Auto-advance carousel
  useEffect(() => {
    if (!isFlipped && post.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isFlipped, post.images.length]);

  const handleSave = () => {
    setIsSavedState(!isSavedState);
    onSave?.(post.id);
    toast.success(isSavedState ? 'Removed from saved' : 'Saved to your profile!');
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleRepost = () => {
    onRepost?.(post.id);
    toast.success('Reposted to your profile!');
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      // Swipe right - save/like
      setIsSavedState(true);
      onSwipeRight?.(post.id);
      toast.success('Saved to your profile!');
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left - pass
      onSwipeLeft?.(post.id);
      toast('Passed on this trip');
    }
    
    setDragX(0);
    
    // Delay to prevent click after drag
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleFlipCard = () => {
    // Don't flip if user is dragging
    if (!isDragging) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDrag={(event, info) => setDragX(info.offset.x)}
      onDragEnd={handleDragEnd}
      className="relative w-full max-w-lg mx-auto"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Swipe Indicators */}
      <AnimatePresence>
        {dragX > 50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 left-8 z-20 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
          >
            ❤️ SAVE
          </motion.div>
        )}
        {dragX < -50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 right-8 z-20 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
          >
            ✕ PASS
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="rounded-3xl shadow-lg mb-4 relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
          transition: 'transform 0.6s',
          minHeight: '600px',
        }}
      >
        {/* Front of Card - Images */}
        <div 
          className="bg-white rounded-3xl overflow-hidden absolute inset-0"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-white">
            <div className="flex items-center gap-3">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                  <span className="text-green-700 font-semibold">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                {post.author.username && (
                  <p className="text-xs text-gray-500">@{post.author.username}</p>
                )}
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Image Carousel */}
          <div className="relative aspect-[4/5] bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={post.images[currentImageIndex]}
                alt={`${post.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Image Indicators */}
            {post.images.length > 1 && (
              <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4">
                {post.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 w-1.5'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Tap to Flip Hint */}
            <button
              onClick={handleFlipCard}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                Tap for details →
              </div>
            </button>

            {/* Location Badge */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {post.destination}
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
            {post.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.description}</p>
            )}

            {/* Quick Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              {post.duration && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.duration}
                </span>
              )}
              {post.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {post.rating}/5
                </span>
              )}
              {post.isBucketList && (
                <span className="text-blue-600 font-medium">🎯 Bucket List</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Bookmark
                  className={`w-5 h-5 ${isSavedState ? 'fill-green-600 text-green-600' : 'text-gray-600'}`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {post.stats.saves}
                </span>
              </button>

              <button
                onClick={handleRepost}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {post.stats.reposts}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {post.stats.shares}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Back of Card - Details */}
        <div
          className="bg-white rounded-3xl overflow-hidden absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-gray-900">Trip Details</h3>
              <button
                onClick={handleFlipCard}
                className="text-green-600 font-medium text-sm"
              >
                ← Back
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  {post.destination}
                </div>
                {post.description && (
                  <p className="text-gray-700 leading-relaxed">{post.description}</p>
                )}
              </div>

              {/* Activities */}
              {post.activities && post.activities.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Activities</h5>
                  <div className="flex flex-wrap gap-2">
                    {post.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels */}
              {post.hotels && post.hotels.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Hotel className="w-4 h-4" />
                    Hotels
                  </h5>
                  <ul className="space-y-1">
                    {post.hotels.map((hotel, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        • {hotel}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Restaurants */}
              {post.restaurants && post.restaurants.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    Restaurants
                  </h5>
                  <ul className="space-y-1">
                    {post.restaurants.map((restaurant, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        • {restaurant}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rating */}
              {post.rating && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {post.rating}/5 Rating
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {post.author.name}'s experience
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

