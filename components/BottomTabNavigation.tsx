import { motion } from 'framer-motion';
import { Home, Compass, UserCircle } from 'lucide-react';

interface BottomTabNavigationProps {
  activeTab: 'feed' | 'adventures' | 'profile';
  onTabChange: (tab: 'feed' | 'adventures' | 'profile') => void;
}

export function BottomTabNavigation({ activeTab, onTabChange }: BottomTabNavigationProps) {
  const tabs = [
    { id: 'feed' as const, label: 'Feed', icon: Home },
    { id: 'adventures' as const, label: 'Adventures', icon: Compass },
    { id: 'profile' as const, label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-black/10">
      <div className="max-w-lg mx-auto px-2 pb-safe">
        <div className="flex items-center justify-around h-20">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2 relative transition-transform active:scale-95"
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-black' : 'text-black/40'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] transition-colors ${
                    isActive ? 'text-black' : 'text-black/40'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
