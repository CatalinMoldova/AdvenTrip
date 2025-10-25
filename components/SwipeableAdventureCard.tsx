import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Adventure } from '../types';
import { 
  MapPin, Clock, DollarSign, Calendar, Hotel as HotelIcon, 
  Plane, Check, Edit2, X as XIcon, ChevronDown
} from 'lucide-react';
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
const ROTATION_RANGE = 30;

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
  
  // Editable fields
  const [selectedFlight, setSelectedFlight] = useState('economy');
  const [selectedHotel, setSelectedHotel] = useState(adventure.hotel.name);
  const [customBudget, setCustomBudget] = useState(adventure.price);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(adventure.activities);
  const [transportMode, setTransportMode] = useState('flight');

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-ROTATION_RANGE, ROTATION_RANGE]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

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
    
    if (Math.abs(offset) > SWIPE_THRESHOLD) {
      if (offset > 0) {
        onSwipeRight(adventure, rating);
      } else {
        onSwipeLeft(adventure);
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    setRating(value[0]);
  };

  const handleSliderCommit = () => {
    const isLike = rating > 50;
    onSliderDecision(adventure, rating, isLike);
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
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT OF CARD */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-white"
            style={{ backfaceVisibility: 'hidden' }}
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

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
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
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="h-full overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-black/10 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg text-black">Customize Your Trip</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center"
                >
                  <XIcon className="w-4 h-4 text-black" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Destination Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/60 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Destination</span>
                  </div>
                  <div className="text-xl text-black">{adventure.destination}</div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <div className="text-lg text-black">{adventure.duration}</div>
                </div>

                {/* Transportation */}
                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-black/60 text-sm">
                      <Plane className="w-4 h-4" />
                      <span>Transportation</span>
                    </div>
                    {editMode !== 'transport' && (
                      <button
                        onClick={() => setEditMode('transport')}
                        className="p-1 hover:bg-black/5 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-black/40" />
                      </button>
                    )}
                  </div>
                  
                  {editMode === 'transport' ? (
                    <div className="space-y-3 bg-black/5 p-4 rounded-xl">
                      <div>
                        <label className="text-xs text-black/60 mb-2 block">Transport Mode</label>
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
                          <label className="text-xs text-black/60 mb-2 block">
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
                                    : 'border-black/20 bg-white text-black hover:border-black/40'
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
                    <div className="text-black">
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
                    <div className="flex items-center gap-2 text-black/60 text-sm">
                      <HotelIcon className="w-4 h-4" />
                      <span>Accommodation</span>
                    </div>
                    {editMode !== 'hotel' && (
                      <button
                        onClick={() => setEditMode('hotel')}
                        className="p-1 hover:bg-black/5 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-black/40" />
                      </button>
                    )}
                  </div>
                  
                  {editMode === 'hotel' ? (
                    <div className="space-y-3 bg-black/5 p-4 rounded-xl">
                      <label className="text-xs text-black/60">Select Hotel</label>
                      <div className="space-y-2">
                        {hotelOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedHotel(option.name)}
                            className={`w-full p-3 rounded-lg border text-left transition-all ${
                              selectedHotel === option.name
                                ? 'border-black bg-black text-white'
                                : 'border-black/20 bg-white text-black hover:border-black/40'
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
                    <div className="text-black">
                      {selectedHotel} • {
                        hotelOptions.find(h => h.name === selectedHotel)?.stars || adventure.hotel.rating
                      }⭐
                    </div>
                  )}
                </div>

                {/* Activities */}
                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-black/60 text-sm">Activities Included</div>
                    {editMode !== 'activities' && (
                      <button
                        onClick={() => setEditMode('activities')}
                        className="p-1 hover:bg-black/5 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-black/40" />
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
                                : 'bg-white text-black border border-black/20'
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
                        <Badge key={activity} className="bg-black/10 text-black border-0">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Itinerary */}
                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="text-black/60 text-sm">Day-by-Day Itinerary</div>
                  <div className="space-y-3">
                    {adventure.itinerary.map((day) => (
                      <div key={day.day} className="bg-black/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
                            {day.day}
                          </div>
                          <div className="text-black">{day.title}</div>
                        </div>
                        <ul className="space-y-1 ml-10">
                          {day.activities.map((activity, idx) => (
                            <li key={idx} className="text-sm text-black/70">
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
                    <div className="flex items-center gap-2 text-black/60 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>Total Budget</span>
                    </div>
                    {editMode !== 'budget' && (
                      <button
                        onClick={() => setEditMode('budget')}
                        className="p-1 hover:bg-black/5 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-black/40" />
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
                      <div className="text-xs text-black/60">
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
                    <div className="text-2xl text-black">${customBudget}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Swipe indicators */}
      <motion.div
        className="absolute -left-4 top-1/2 -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm rotate-12"
        style={{
          opacity: useTransform(x, [-150, 0], [1, 0]),
        }}
      >
        NOPE
      </motion.div>
      <motion.div
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm -rotate-12"
        style={{
          opacity: useTransform(x, [0, 150], [0, 1]),
        }}
      >
        LIKE
      </motion.div>

      {/* Bottom Slider - Only visible when front is showing */}
      {!isFlipped && (
        <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2 text-sm text-black/70">
            <span>Not interested</span>
            <span>Love it!</span>
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
          <div className="text-center text-xs text-black/60">
            Slide and release to decide
          </div>
        </div>
      )}
    </motion.div>
  );
}
