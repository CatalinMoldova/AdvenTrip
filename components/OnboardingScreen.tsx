import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MapPin, Sparkles, ArrowRight, Compass, Plus, X as XIcon } from 'lucide-react';
import { User } from '../types';

interface OnboardingScreenProps {
  onComplete: (user: User) => void;
}

const availableActivities = [
  'Hiking', 'Beach', 'Museums', 'Food Tours', 'Nightlife',
  'Shopping', 'Photography', 'Adventure Sports', 'Wildlife',
  'Cultural Sites', 'Water Sports', 'Mountains', 'Spa & Wellness',
  'Local Markets', 'Art Galleries', 'Theme Parks', 'Skiing',
  'Diving', 'Surfing', 'Camping'
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'location' | 'activities' | 'transition'>('location');
  const [location, setLocation] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [customActivities, setCustomActivities] = useState<string[]>([]);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      setStep('activities');
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const addCustomActivity = () => {
    if (customActivity.trim() && !customActivities.includes(customActivity.trim()) && !selectedActivities.includes(customActivity.trim())) {
      setCustomActivities([...customActivities, customActivity.trim()]);
      setSelectedActivities([...selectedActivities, customActivity.trim()]);
      setCustomActivity('');
    }
  };

  const removeCustomActivity = (activity: string) => {
    setCustomActivities(customActivities.filter(a => a !== activity));
    setSelectedActivities(selectedActivities.filter(a => a !== activity));
  };

  const handleComplete = () => {
    if (selectedActivities.length > 0) {
      setStep('transition');
      setTimeout(() => {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: 'Traveler',
          location: location,
          interests: selectedActivities,
        };
        onComplete(user);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--ios-gray6)] flex items-center justify-center p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'location' && (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 bg-[var(--ios-blue)] rounded-[20px] flex items-center justify-center ios-shadow-lg"
              >
                <Compass className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-3 text-[var(--foreground)]"
              >
                NOMADIQ
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[var(--ios-gray)]"
              >
                Your journey begins here
              </motion.p>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onSubmit={handleLocationSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-2 text-[var(--foreground)]">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Where are you from?
                </label>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city or country"
                  className="h-12 ios-blur-light border-[var(--border)] focus:border-[var(--ios-blue)] rounded-xl"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={!location.trim()}
                className="w-full h-12 bg-[var(--ios-blue)] hover:bg-[#0051D5] active:scale-95 transition-transform rounded-xl ios-shadow"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.form>
          </motion.div>
        )}

        {step === 'activities' && (
          <motion.div
            key="activities"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 mx-auto mb-4 bg-[var(--ios-purple)] rounded-[16px] flex items-center justify-center ios-shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[var(--foreground)] mb-2"
              >
                What interests you?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[var(--ios-gray)]"
              >
                Select activities you'd love to experience
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="ios-blur-light rounded-[20px] p-8 ios-shadow-lg border border-[var(--border)]"
            >
              <div className="flex flex-wrap gap-3 mb-4">
                {availableActivities.map((activity, index) => (
                  <motion.div
                    key={activity}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.02, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Badge
                      onClick={() => toggleActivity(activity)}
                      className={`px-4 py-2 text-sm cursor-pointer transition-all rounded-full ${
                        selectedActivities.includes(activity)
                          ? 'bg-[var(--ios-blue)] text-white ios-shadow'
                          : 'bg-[var(--ios-gray5)] text-[var(--foreground)] hover:bg-[var(--ios-gray4)]'
                      }`}
                    >
                      {activity}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              {/* Custom Activities */}
              <div className="mb-6 space-y-3">
                <label className="text-sm text-[var(--ios-gray)]">Add your own activities</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    placeholder="e.g., Wine Tasting, Rock Climbing"
                    className="ios-blur-light border-[var(--border)] rounded-xl"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomActivity())}
                  />
                  <Button
                    type="button"
                    onClick={addCustomActivity}
                    size="icon"
                    className="bg-[var(--ios-purple)] hover:bg-[#8E44AD] active:scale-95 transition-transform shrink-0 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {customActivities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customActivities.map((activity) => (
                      <Badge
                        key={activity}
                        className="bg-[var(--ios-purple)] text-white pr-1 pl-3 py-2 rounded-full"
                      >
                        {activity}
                        <button
                          onClick={() => removeCustomActivity(activity)}
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleComplete}
                disabled={selectedActivities.length === 0}
                className="w-full h-12 bg-[var(--ios-blue)] hover:bg-[#0051D5] active:scale-95 transition-transform rounded-xl ios-shadow"
              >
                Start Exploring
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              
              {selectedActivities.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-[var(--ios-gray)] mt-3"
                >
                  {selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'} selected
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}

        {step === 'transition' && (
          <motion.div
            key="transition"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 mx-auto bg-[var(--ios-blue)] rounded-[24px] flex items-center justify-center ios-shadow-xl"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-[var(--foreground)]"
            >
              Curating adventures just for you...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};