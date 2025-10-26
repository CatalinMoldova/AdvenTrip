import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Adventure } from '../types';
import { 
  MapPin, Clock, DollarSign, Calendar, Hotel as HotelIcon, 
  Plane, Check, Edit2, X as XIcon, ChevronDown, Share2
} from 'lucide-react';
import { ShareModal } from './ShareModal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SwipeableAdventureCardProps {
  adventure: Adventure;
  onSwipeLeft: (adventure: Adventure) => void;
  onSwipeRight: (adventure: Adventure, rating: number) => void;
  onSliderDecision: (adventure: Adventure, rating: number, isLike: boolean) => void;
  startLocation?: string;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_RANGE = 10;

export function SwipeableAdventureCard({
  adventure,
  onSwipeLeft,
  onSwipeRight,
  onSliderDecision,
  startLocation = 'New York',
}: SwipeableAdventureCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(50);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Editable fields
  const [selectedFlight, setSelectedFlight] = useState('economy');
  const [selectedHotel, setSelectedHotel] = useState(adventure.hotel.name);
  const [customBudget, setCustomBudget] = useState(adventure.price);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(adventure.activities);
  const [transportMode, setTransportMode] = useState('flight');

  const x = useMotionValue(0);
  // Make rotation proportional to x position for sync
  const rotate = useTransform(x, (v) => (v / 150) * ROTATION_RANGE);
  // Keep card fully visible at all times - no opacity fade

  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll images on front of card
  useEffect(() => {
    if (!isFlipped) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % adventure.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isFlipped, adventure.images.length]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    
    // Convert offset to percentage (150 is max, so -150 to 150 maps to 0 to 100%)
    const percentage = ((offset + 150) / 300) * 100;
    
    // If released in neutral zone (45-55%), snap back to center
    if (percentage >= 45 && percentage <= 55) {
      setRating(50);
      x.set(0); // Snap back to center
      return;
    }
    
    // If not past threshold, also snap back to center
    if (Math.abs(offset) <= SWIPE_THRESHOLD) {
      setRating(50);
      x.set(0); // Snap back to center
      return;
    }
    
    // Card was swiped past threshold
    if (offset > 0) {
      setTimeout(() => onSwipeRight(adventure, rating), 600);
    } else {
      setTimeout(() => onSwipeLeft(adventure), 600);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newRating = value[0];
    
    // Neutral zone logic: if between 45-55%, snap to 50% and reset card position
    if (newRating >= 45 && newRating <= 55) {
      setRating(50);
      x.set(0); // Reset card position to center
    } else {
      setRating(newRating);
    }
  };

  const handleSliderCommit = () => {
    // Only trigger decision if outside neutral zone (45-55%)
    if (rating < 45 || rating > 55) {
      const isLike = rating > 50;
      setTimeout(() => onSliderDecision(adventure, rating, isLike), 600);
    }
    // If in neutral zone (45-55%), do nothing - card stays
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const flightOptions = [
    { id: 'economy', label: 'Economy', price: Math.round(adventure.price * 0.3) },
    { id: 'premium', label: 'Premium Economy', price: Math.round(adventure.price * 0.45) },
    { id: 'business', label: 'Business Class', price: Math.round(adventure.price * 0.65) },
    { id: 'first', label: 'First Class', price: Math.round(adventure.price * 0.85) },
  ];

  const hotelOptions = [
    { id: 'budget', name: 'Budget Inn', stars: 3, price: adventure.hotel.pricePerNight * 0.6 },
    { id: 'standard', name: adventure.hotel.name, stars: adventure.hotel.rating, price: adventure.hotel.pricePerNight },
    { id: 'luxury', name: 'Luxury Resort', stars: 5, price: adventure.hotel.pricePerNight * 1.5 },
  ];

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
      }}
      drag="x"
      dragConstraints={{ left: -150, right: 150 }}
      onDrag={(event, info) => {
        const offset = info.offset.x;
        // Convert offset to percentage and update rating to sync slider
        const percentage = ((offset + 150) / 300) * 100;
        setRating(Math.round(percentage));
      }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
        {/* Gradient overlays for tilt direction */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-red-500/60 to-transparent rounded-l-3xl"
            style={{ opacity: useTransform(x, [-150, -10, 0], [1, 0.5, 0]) }}
          />
          <motion.div 
            className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-green-500/60 to-transparent rounded-r-3xl"
            style={{ opacity: useTransform(x, [0, 10, 150], [0, 0.5, 1]) }}
          />
        </div>

        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT OF CARD */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-white"
            style={{ 
              backfaceVisibility: 'hidden',
              pointerEvents: isFlipped ? 'none' : 'auto'
            }}
            onClick={() => setIsFlipped(true)}
          >
            {/* Image Carousel */}
            <div className="relative h-full">
              <ImageWithFallback
                src={adventure.images[currentImageIndex] || adventure.images[0]}
                alt={adventure.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Image counter */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                {currentImageIndex + 1} / {adventure.images.length}
              </div>

              {/* Share button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-black/80 transition-colors z-30"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* Content overlay */}
              <div className="absolute bottom-24 left-0 right-0 p-8 text-white z-10">
                <h2 className="text-3xl mb-3">{adventure.title}</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {adventure.destination}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {adventure.duration}
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-4">Tap to see details & customize</p>
              </div>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-white"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              pointerEvents: isFlipped ? 'auto' : 'none'
            }}
          >
            <div className="h-full overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-green-50 border-b border-green-200 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg text-green-800">Customize Your Trip</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <XIcon className="w-4 h-4 text-green-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Destination Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Destination</span>
                  </div>
                  <div className="text-xl text-green-800">{adventure.destination}</div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <div className="text-lg text-green-800">{adventure.duration}</div>
                </div>

                {/* Transportation */}
                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Plane className="w-4 h-4" />
                      <span>Transportation</span>
                    </div>
                    {editMode !== 'transport' && (
                      <button
                        onClick={() => setEditMode('transport')}
                        className="p-1 hover:bg-black/5 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-green-800/40" />
                      </button>
                    )}
                  </div>
                  
                  {editMode === 'transport' ? (
                    <div className="space-y-3 bg-black/5 p-4 rounded-xl">
                      <div>
                        <label className="text-xs text-green-600 mb-2 block">Transport Mode</label>
                        <Select value={transportMode} onValueChange={setTransportMode}>
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flight">Flight</SelectItem>
                            <SelectItem value="train">Train</SelectItem>
                            <SelectItem value="car">Car Rental</SelectItem>
                            <SelectItem value="bus">Bus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {transportMode === 'flight' && (
                        <div>
                          <label className="text-xs text-green-600 mb-2 block">
                            Flight from {startLocation} to {adventure.destination}
                          </label>
                          <div className="space-y-2">
                            {flightOptions.map((option) => (
                              <button
                                key={option.id}
                                onClick={() => setSelectedFlight(option.id)}
                                className={`w-full p-3 rounded-lg border text-left transition-all ${
                                  selectedFlight === option.id
                                    ? 'border-black bg-black text-white'
                                    : 'border-black/20 bg-white text-green-800 hover:border-black/40'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{option.label}</span>
                                  <span className="text-sm">${option.price}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => setEditMode(null)}
                        className="w-full bg-black text-white"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="text-green-800">
                      {transportMode === 'flight' ? 'Flight' : transportMode} • {
                        transportMode === 'flight' 
                          ? flightOptions.find(f => f.id === selectedFlight)?.label 
                          : 'Standard'
                      }
                    </div>
                  )}
                </div>

                {/* Hotel */}
                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <HotelIcon className="w-4 h-4" />
                      <span>Accommodation</span>
                    </div>
                    {editMode !== 'hotel' && (
                      <button
                        onClick={() => setEditMode('hotel')}
                        className="p-1 hover:bg-black/5 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-green-800/40" />
                      </button>
                    )}
                  </div>
                  
                  {editMode === 'hotel' ? (
                    <div className="space-y-3 bg-black/5 p-4 rounded-xl">
                      <label className="text-xs text-green-600">Select Hotel</label>
                      <div className="space-y-2">
                        {hotelOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedHotel(option.name)}
                            className={`w-full p-3 rounded-lg border text-left transition-all ${
                              selectedHotel === option.name
                                ? 'border-black bg-black text-white'
                                : 'border-black/20 bg-white text-green-800 hover:border-black/40'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">{option.name}</span>
                              <span className="text-sm">${option.price}/night</span>
                            </div>
                            <div className="text-xs opacity-70">
                              {'⭐'.repeat(Math.round(option.stars))}
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={() => setEditMode(null)}
                        className="w-full bg-black text-white"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="text-green-800">
                      {selectedHotel} • {
                        hotelOptions.find(h => h.name === selectedHotel)?.stars || adventure.hotel.rating
                      }⭐
                    </div>
                  )}
                </div>

                {/* Activities */}
                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-green-600 text-sm">Activities Included</div>
                    {editMode !== 'activities' && (
                      <button
                        onClick={() => setEditMode('activities')}
                        className="p-1 hover:bg-black/5 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-green-800/40" />
                      </button>
                    )}
                  </div>
                  
                  {editMode === 'activities' ? (
                    <div className="space-y-3 bg-black/5 p-4 rounded-xl">
                      <div className="flex flex-wrap gap-2">
                        {adventure.activities.map((activity) => (
                          <button
                            key={activity}
                            onClick={() => toggleActivity(activity)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              selectedActivities.includes(activity)
                                ? 'bg-black text-white'
                                : 'bg-white text-green-800 border border-black/20'
                            }`}
                          >
                            {activity}
                            {selectedActivities.includes(activity) && (
                              <Check className="w-3 h-3 inline ml-1" />
                            )}
                          </button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={() => setEditMode(null)}
                        className="w-full bg-black text-white"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save Selection
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedActivities.map((activity) => (
                        <Badge key={activity} className="bg-black/10 text-green-800 border-0">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Itinerary */}
                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="text-green-600 text-sm">Day-by-Day Itinerary</div>
                  <div className="space-y-3">
                    {adventure.itinerary.map((day) => (
                      <div key={day.day} className="bg-black/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
                            {day.day}
                          </div>
                          <div className="text-green-800">{day.title}</div>
                        </div>
                        <ul className="space-y-1 ml-10">
                          {day.activities.map((activity, idx) => (
                            <li key={idx} className="text-sm text-green-800/70">
                              • {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>Total Budget</span>
                    </div>
                    {editMode !== 'budget' && (
                      <button
                        onClick={() => setEditMode('budget')}
                        className="p-1 hover:bg-black/5 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-green-800/40" />
                      </button>
                    )}
                  </div>
                  
                  {editMode === 'budget' ? (
                    <div className="space-y-3 bg-black/5 p-4 rounded-xl">
                      <Input
                        type="number"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(Number(e.target.value))}
                        className="bg-white"
                        placeholder="Enter budget"
                      />
                      <div className="text-xs text-green-600">
                        Breakdown: Flight ${flightOptions.find(f => f.id === selectedFlight)?.price}, 
                        Hotel ${hotelOptions.find(h => h.name === selectedHotel)?.price}/night
                      </div>
                      <Button
                        onClick={() => setEditMode(null)}
                        className="w-full bg-black text-white"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="text-2xl text-green-800">${customBudget}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Swipe indicators */}
      <motion.div
        className="absolute -left-6 top-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-full text-xl font-bold"
        style={{ 
          opacity: useTransform(x, [-150, 0], [1, 0]),
          rotate: useTransform(x, [-150, 0], [12, -12])
        }}
      >
        NOPE
      </motion.div>
      <motion.div
        className="absolute -right-6 top-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold"
        style={{ 
          opacity: useTransform(x, [0, 150], [0, 1]),
          rotate: useTransform(x, [0, 150], [-12, 12])
        }}
      >
        LIKE
      </motion.div>

      {/* Bottom Slider - Only visible when front is showing */}
      {!isFlipped && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg z-20">
          <div className="flex items-center justify-between mb-2 text-sm text-green-800/70">
            <motion.span className={rating < 50 ? 'font-bold text-red-500' : ''}>
              {rating < 50 ? `${rating}%` : 'Not interested'}
            </motion.span>
            <motion.span className={rating > 50 ? 'font-bold text-green-600' : ''}>
              {rating > 50 ? `${rating}%` : 'Love it!'}
            </motion.span>
          </div>
          <Slider
            value={[rating]}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            min={0}
            max={100}
            step={1}
            className="mb-2"
          />
          <div className="text-center text-xs text-green-600">
            Slide and release to decide
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        postTitle={adventure.title}
        postUrl={`${window.location.origin}/adventure/${adventure.id}`}
      />
    </motion.div>
  );
}
