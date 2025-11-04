import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Adventure } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface TripCardProps {
  adventure: Adventure;
}

export function TripCard({ adventure }: TripCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full aspect-[3/4] perspective-1000">
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card - Image */}
        <div
          className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden ios-shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <ImageWithFallback
            src={adventure.images[0]}
            alt={adventure.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl mb-2">{adventure.title}</h3>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {adventure.destination}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {adventure.duration}
              </div>
            </div>
          </div>

          {/* Tap indicator */}
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-white text-xs">
            Tap for details
          </div>
        </div>

        {/* Back of card - Details */}
        <div
          className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-white ios-shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="h-full overflow-y-auto p-6">
            <div className="mb-4">
              <h3 className="text-2xl mb-2 text-[var(--ios-label)]">{adventure.title}</h3>
              <div className="flex items-center gap-1 text-sm text-[var(--ios-gray)] mb-4">
                <MapPin className="w-4 h-4" />
                {adventure.destination}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-[var(--ios-gray)] mb-2">Description</h4>
                <p className="text-sm text-[var(--ios-label)] leading-relaxed">{adventure.description}</p>
              </div>

              <div>
                <h4 className="text-sm text-[var(--ios-gray)] mb-2">Things to Do</h4>
                <ul className="space-y-2">
                  {adventure.itinerary.slice(0, 3).map((day) => (
                    <li key={day.day} className="text-sm text-[var(--ios-label)]">
                      <span className="text-[var(--ios-blue)]">Day {day.day}:</span> {day.title}
                      <ul className="ml-4 mt-1 space-y-1">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="text-xs text-[var(--ios-gray)]">• {activity}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-[var(--ios-separator)]">
                <div>
                  <div className="text-xs text-[var(--ios-gray)] mb-1">Duration</div>
                  <div className="text-sm text-[var(--ios-label)]">{adventure.duration}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--ios-gray)] mb-1">From</div>
                  <div className="text-sm text-[var(--ios-label)]">${adventure.price}</div>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm text-[var(--ios-gray)] mb-2">Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {adventure.activities.map((activity) => (
                    <span
                      key={activity}
                      className="px-3 py-1 bg-[var(--ios-gray6)] rounded-full text-xs text-[var(--ios-label)]"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tap to close indicator */}
            <div className="absolute top-6 right-6 bg-[var(--ios-gray5)] rounded-full px-3 py-1 text-[var(--ios-label)] text-xs">
              Tap to close
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
