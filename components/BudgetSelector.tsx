import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, DollarSign } from 'lucide-react';
import { Input } from './ui/input';

interface BudgetSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const budgetPresets = [
  { label: '$500', value: 500 },
  { label: '$1,000', value: 1000 },
  { label: '$2,000', value: 2000 },
  { label: '$3,000', value: 3000 },
  { label: '$5,000', value: 5000 },
  { label: '$10,000', value: 10000 },
  { label: '$15,000', value: 15000 },
  { label: '$20,000+', value: 20000 },
];

export const BudgetSelector: React.FC<BudgetSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(val);
    const numValue = parseInt(val) || 0;
    onChange(numValue);
  };

  const handlePresetClick = (preset: number) => {
    onChange(preset);
    setInputValue(preset.toString());
    setIsOpen(false);
  };

  const formatValue = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Enter budget"
          className="pl-10 pr-10 text-lg h-12 bg-white border-2 border-gray-200 focus:border-purple-400 transition-colors"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-2 max-h-64 overflow-y-auto">
              <div className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wide">
                Quick Select
              </div>
              {budgetPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handlePresetClick(preset.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                    value === preset.value
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-purple-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{preset.label}</span>
                    {value === preset.value && (
                      <div className="w-2 h-2 rounded-full bg-purple-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {value > 0 && (
        <div className="text-sm text-gray-500 mt-2 text-center">
          {formatValue(value)} USD total budget
        </div>
      )}
    </div>
  );
};
