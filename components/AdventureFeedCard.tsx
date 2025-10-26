import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  X as XIcon,
  Info,
  Map,
  RotateCcw,
  Plane,
  Hotel,
} from 'lucide-react';
import { Adventure } from '../types';
import { HotelSearchBack } from './HotelSearchBack';

interface AdventureFeedCardProps {
  adventure: Adventure;
  onRate: (rating: number) => void;
  onSave: () => void;
  onPass: () => void;
  onViewDetails: () => void;
  onViewMap: () => void;
}

export const AdventureFeedCard: React.FC<AdventureFeedCardProps> = ({
  adventure,
  onRate,
  onSave,
  onPass,
  onViewDetails,
  onViewMap,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(adventure.userRating || 50);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Motion values for swipe - natural card movement
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transforms for natural card physics
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform(
    x,
    [-300, -150, 0, 150, 300],
    [0, 1, 1, 1, 0]
  );
  
  // Scale effect when dragging
  const scale = useTransform(
    x,
    [-300, -150, 0, 150, 300],
    [0.9, 0.95, 1, 0.95, 0.9]
  );

  // Indicator opacity based on drag direction
  const passOpacity = useTransform(x, [-200, -80, 0], [1, 0.6, 0]);
  const passScale = useTransform(x, [-200, -80, 0], [1.3, 1, 0.8]);
  
  const saveOpacity = useTransform(x, [0, 80, 200], [0, 0.6, 1]);
  const saveScale = useTransform(x, [0, 80, 200], [0.8, 1, 1.3]);

  // Auto-scroll images
  useEffect(() => {
    if (adventure.images.length <= 1 || isFlipped || isDragging) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % adventure.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [adventure.images.length, isFlipped, isDragging]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePassAnimation();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSaveAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRatingChange = (value: number[]) => {
    setRating(value[0]);
    onRate(value[0]);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = 120;
    const swipeVelocity = 500;
    
    // Check velocity for quick flicks
    const isQuickSwipe = Math.abs(info.velocity.x) > swipeVelocity;
    
    if (info.offset.x > swipeThreshold || (isQuickSwipe && info.velocity.x > 0)) {
      // Swipe right - Save
      handleSaveAnimation();
    } else if (info.offset.x < -swipeThreshold || (isQuickSwipe && info.velocity.x < 0)) {
      // Swipe left - Pass
      handlePassAnimation();
    } else {
      // Snap back to center with spring animation
      controls.start({
        x: 0,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 30,
        },
      });
    }
  };

  const handleSaveAnimation = async () => {
    // Animate out to the right with natural physics
    await controls.start({
      x: 400,
      y: -50,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    });
    onSave();
    // Reset position immediately (will be replaced by next card)
    x.set(0);
    y.set(0);
  };

  const handlePassAnimation = async () => {
    // Animate out to the left with natural physics
    await controls.start({
      x: -400,
      y: -50,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    });
    onPass();
    // Reset position immediately (will be replaced by next card)
    x.set(0);
    y.set(0);
  };

  const handleHeaderClick = () => {
    if (!isDragging) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative touch-none"
    >
      {/* Swipe Indicators - Fixed position */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Pass Indicator (Left) */}
        <motion.div
          className="absolute top-8 left-8 bg-[var(--ios-red)] text-white px-6 py-3 rounded-full ios-shadow-xl border-4 border-white"
          style={{ 
            opacity: passOpacity,
            scale: passScale,
          }}
        >
          <div className="flex items-center gap-2">
            <XIcon className="w-6 h-6 stroke-[3]" />
            <span className="text-lg">PASS</span>
          </div>
        </motion.div>

        {/* Save Indicator (Right) */}
        <motion.div
          className="absolute top-8 right-8 bg-[var(--ios-green)] text-white px-6 py-3 rounded-full ios-shadow-xl border-4 border-white"
          style={{
            opacity: saveOpacity,
            scale: saveScale,
          }}
        >
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 stroke-[3]" />
            <span className="text-lg">SAVE</span>
          </div>
        </motion.div>
      </div>

      {/* Draggable Card Container */}
      <motion.div
        style={{ 
          x, 
          y, 
          rotate,
          scale,
          opacity,
        }}
        drag={!isFlipped}
        dragElastic={0.1}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        className={`relative ${!isFlipped ? 'cursor-grab active:cursor-grabbing' : ''}`}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* Card with Flip Animation */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <Card className="overflow-hidden ios-blur-light border-[var(--border)] ios-shadow-lg rounded-[20px]">
            {/* Front Side */}
            <motion.div
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Image Carousel - Clickable Header */}
              <div 
                className="relative h-80 overflow-hidden rounded-t-[20px] cursor-pointer select-none"
                onClick={handleHeaderClick}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full">
                  {adventure.images.map((image, index) => {
                    const isActive = index === currentImageIndex;
                    const isPrev = index === (currentImageIndex - 1 + adventure.images.length) % adventure.images.length;
                    const isNext = index === (currentImageIndex + 1) % adventure.images.length;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          scale: isActive ? 1 : 0.95,
                          x: isActive ? 0 : isPrev ? '-3%' : isNext ? '3%' : 0,
                        }}
                        transition={{ 
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="absolute inset-0"
                      >
                        <ImageWithFallback
                          src={image}
                          alt={`${adventure.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay on non-active */}
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: isActive ? 0 : 0.4,
                          }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 bg-black"
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Gradient Overlay - iOS style */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Flip Hint */}
                <motion.div 
                  className="absolute top-14 left-1/2 -translate-x-1/2 text-white/80 text-xs bg-black/30 backdrop-blur px-3 py-1 rounded-full pointer-events-none"
                  animate={{ opacity: isDragging ? 0 : 1 }}
                >
                  Tap to see hotels
                </motion.div>

                {/* Image Indicators - iOS style */}
                {adventure.images.length > 1 && (
                  <div className="absolute top-4 right-4 flex gap-1.5 pointer-events-none">
                    {adventure.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'w-6 bg-white'
                            : 'w-1 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Price Badge - iOS style */}
                <div className="absolute top-4 left-4 pointer-events-none">
                  <Badge className="bg-[var(--ios-green)] text-white px-3 py-1.5 ios-shadow rounded-full">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {adventure.price}
                  </Badge>
                </div>

                {/* Hotel Prices Hint */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
                  <Badge className="bg-[var(--ios-blue)]/90 backdrop-blur-sm text-white px-3 py-1.5 ios-shadow rounded-full text-xs">
                    Hotels from $24/night
                  </Badge>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                  <h3 className="text-white mb-2">{adventure.title}</h3>
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {adventure.destination}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {adventure.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 bg-white/70">
                {/* Description */}
                <p className="text-[var(--foreground)] text-sm line-clamp-2">
                  {adventure.description}
                </p>

                {/* Activities */}
                <div className="flex flex-wrap gap-2">
                  {adventure.activities.slice(0, 5).map((activity) => (
                    <Badge key={activity} className="text-xs bg-[var(--ios-gray5)] text-[var(--foreground)] rounded-full">
                      {activity}
                    </Badge>
                  ))}
                  {adventure.activities.length > 5 && (
                    <Badge className="text-xs bg-[var(--ios-gray5)] text-[var(--foreground)] rounded-full">
                      +{adventure.activities.length - 5} more
                    </Badge>
                  )}
                </div>

                {/* Rating Slider - iOS style */}
                <div className="space-y-2 pt-2" onPointerDown={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[var(--foreground)]">How interested are you?</label>
                    <span className="text-sm text-[var(--ios-blue)]">
                      {rating}%
                    </span>
                  </div>
                  <Slider
                    value={[rating]}
                    onValueChange={handleRatingChange}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[var(--ios-gray)]">
                    <span>Not Interested</span>
                    <span>Very Interested</span>
                  </div>
                </div>

                {/* Booking Links - iOS style */}
                <div className="grid grid-cols-2 gap-2 pt-2" onPointerDown={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const flightUrl = `https://www.google.com/flights?q=flights+to+${encodeURIComponent(adventure.destination)}&departure_date=anytime`;
                      window.open(flightUrl, '_blank');
                    }}
                    className="hover:bg-[var(--ios-blue)]/10 hover:text-[var(--ios-blue)] hover:border-[var(--ios-blue)]/30 rounded-xl border-[var(--border)]"
                  >
                    <Plane className="w-4 h-4 mr-2" />
                    Book Flight
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const hotelUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(adventure.destination)}`;
                      window.open(hotelUrl, '_blank');
                    }}
                    className="hover:bg-[var(--ios-green)]/10 hover:text-[var(--ios-green)] hover:border-[var(--ios-green)]/30 rounded-xl border-[var(--border)]"
                  >
                    <Hotel className="w-4 h-4 mr-2" />
                    Book Hotel
                  </Button>
                </div>

                {/* Actions - iOS style */}
                <div className="flex gap-2 pt-2" onPointerDown={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    onClick={handlePassAnimation}
                    className="flex-1 hover:bg-[var(--ios-red)]/10 hover:text-[var(--ios-red)] hover:border-[var(--ios-red)]/30 rounded-xl border-[var(--border)]"
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Pass
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onViewDetails}
                    className="hover:bg-[var(--ios-purple)]/10 hover:border-[var(--ios-purple)]/30 rounded-xl border-[var(--border)]"
                    size="icon"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onViewMap}
                    className="hover:bg-[var(--ios-teal)]/10 hover:border-[var(--ios-teal)]/30 rounded-xl border-[var(--border)]"
                    size="icon"
                  >
                    <Map className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSaveAnimation}
                    className="flex-1 bg-[var(--ios-blue)] hover:bg-[#0051D5] active:scale-95 transition-transform rounded-xl"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>

                {/* Swipe Hint */}
                <motion.div 
                  className="text-center text-xs text-[var(--ios-gray)] pt-2"
                  animate={{ opacity: isDragging ? 0.3 : 1 }}
                >
                  Swipe or drag to pass/save • Use arrow keys
                </motion.div>
              </div>
            </motion.div>

            {/* Back Side - Hotel Search */}
            <motion.div
              className="absolute inset-0 bg-white/90 backdrop-blur-lg rounded-[20px] p-6 overflow-y-auto"
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <HotelSearchBack 
                destination={adventure.destination}
                onFlipBack={handleHeaderClick}
              />
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};