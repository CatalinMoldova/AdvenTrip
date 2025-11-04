import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface NumberWheelProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const NumberWheel: React.FC<NumberWheelProps> = ({
  value,
  onChange,
  min = 1,
  max = 30,
  label = 'days',
}) => {
  const handlePrevious = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleNext = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const itemWidth = 80;
  const visibleItems = 5;
  const centerIndex = numbers.indexOf(value);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        disabled={value === min}
        className="shrink-0 hover:bg-purple-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-inner">
        <div 
          className="flex items-center h-16"
          style={{ width: `${visibleItems * itemWidth}px` }}
        >
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none" />
          
          {/* Selection indicator */}
          <div className="absolute left-1/2 top-0 bottom-0 w-20 -translate-x-1/2 border-x-2 border-purple-400 bg-purple-50/50 z-0 pointer-events-none" />

          {/* Numbers */}
          <motion.div
            className="flex items-center absolute left-0 h-full"
            animate={{
              x: `calc(50% - ${centerIndex * itemWidth + itemWidth / 2}px)`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {numbers.map((num) => {
              const offset = Math.abs(num - value);
              const opacity = offset === 0 ? 1 : offset === 1 ? 0.6 : offset === 2 ? 0.3 : 0.15;
              const scale = offset === 0 ? 1 : offset === 1 ? 0.85 : 0.7;
              
              return (
                <div
                  key={num}
                  className="flex items-center justify-center transition-all shrink-0"
                  style={{
                    width: itemWidth,
                    opacity,
                    transform: `scale(${scale})`,
                  }}
                >
                  <div className="text-center">
                    <div className={`text-3xl ${offset === 0 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent' : 'text-gray-600'}`}>
                      {num}
                    </div>
                    {offset === 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {num === 1 ? 'day' : 'days'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleNext}
        disabled={value === max}
        className="shrink-0 hover:bg-purple-50"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
