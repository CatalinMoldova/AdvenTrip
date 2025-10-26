import { motion } from 'framer-motion';
import { Home, Compass, UserCircle, PlusCircle, MessageCircle } from 'lucide-react';

interface BottomTabNavigationProps {
  activeTab: 'home' | 'adventures' | 'create' | 'chat' | 'profile';
  onTabChange: (tab: 'home' | 'adventures' | 'create' | 'chat' | 'profile') => void;
}

export function BottomTabNavigation({ activeTab, onTabChange }: BottomTabNavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'adventures' as const, label: 'Adventures', icon: Compass },
    { id: 'create' as const, label: 'Create', icon: PlusCircle, isSpecial: true },
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
    { id: 'profile' as const, label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-green-50/95 backdrop-blur-xl border-t border-green-200">
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
                {/* Tab indicator ball - positioned above the icon */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative">
                  <Icon
                    className={`${tab.isSpecial ? 'w-8 h-8' : 'w-6 h-6'} transition-colors ${
                      isActive ? 'text-green-600' : 'text-green-400'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] transition-colors font-medium ${
                    isActive ? 'text-green-600' : 'text-green-400'
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
