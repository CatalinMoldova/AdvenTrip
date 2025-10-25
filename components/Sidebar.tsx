import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Bookmark,
  Users,
  MapPin,
  Sparkles,
  X as XIcon,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Compass,
  Home,
  Heart,
} from 'lucide-react';
import { Adventure } from '../types';

interface SidebarProps {
  savedAdventures: Array<{ adventure: Adventure; rating: number }>;
  discardedAdventures: Array<{ adventure: Adventure; rating: number }>;
  groupAdventures: Adventure[];
  activeTab: 'home' | 'adventure' | 'my-adventures' | 'saved' | 'group' | 'discarded';
  onTabChange: (tab: 'home' | 'adventure' | 'my-adventures' | 'saved' | 'group' | 'discarded') => void;
  onAdventureClick: (adventure: Adventure) => void;
  onRemoveAdventure?: (adventureId: string) => void;
  onCreateGroup: () => void;
  hasCreatedAdventures: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  savedAdventures,
  discardedAdventures,
  groupAdventures,
  activeTab,
  onTabChange,
  onAdventureClick,
  onRemoveAdventure,
  onCreateGroup,
  hasCreatedAdventures,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Toggle Button - iOS Style */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 left-0 z-50 -translate-y-1/2 bg-[var(--ios-blue)] text-white ios-shadow-lg hover:bg-[#0051D5] active:scale-95 transition-all"
        style={{
          borderRadius: '0 12px 12px 0',
          padding: '16px 8px',
        }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </motion.button>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - iOS Style */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -384,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 40, mass: 0.8 }}
        className="w-96 ios-blur-light border-r border-[var(--border)] flex flex-col ios-shadow-xl fixed inset-y-0 left-0 z-40"
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-white/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[var(--ios-blue)] rounded-[14px] flex items-center justify-center ios-shadow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[var(--foreground)]">
                NOMADIQ
              </h2>
              <p className="text-xs text-[var(--ios-gray)]">Your collection</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - iOS Style */}
        <div className="border-b border-[var(--border)] bg-[var(--ios-gray6)]">
          <button
            onClick={() => {
              onTabChange('home');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-4 text-sm transition-all flex items-center gap-3 ${
              activeTab === 'home'
                ? 'bg-white/90 border-l-4 border-[var(--ios-blue)] text-[var(--ios-blue)]'
                : 'text-[var(--foreground)] hover:bg-white/50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home Feed</span>
          </button>
          <button
            onClick={() => {
              onTabChange('adventure');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-4 text-sm transition-all flex items-center gap-3 ${
              activeTab === 'adventure'
                ? 'bg-white/90 border-l-4 border-[var(--ios-purple)] text-[var(--ios-purple)]'
                : 'text-[var(--foreground)] hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>Your Adventure</span>
            {hasCreatedAdventures && (
              <Badge className="bg-[var(--ios-purple)] text-white text-xs px-2 ml-auto rounded-full">
                New
              </Badge>
            )}
          </button>
          <button
            onClick={() => {
              onTabChange('my-adventures');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-4 text-sm transition-all flex items-center gap-3 ${
              activeTab === 'my-adventures'
                ? 'bg-white/90 border-l-4 border-[var(--ios-pink)] text-[var(--ios-pink)]'
                : 'text-[var(--foreground)] hover:bg-white/50'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>My Adventures</span>
            {savedAdventures.length > 0 && (
              <Badge className="bg-[var(--ios-pink)] text-white text-xs px-2 ml-auto rounded-full">
                {savedAdventures.length}
              </Badge>
            )}
          </button>
        </div>

        {/* Collection Tabs - iOS Segmented Control Style */}
        <div className="flex border-b border-[var(--border)] bg-[var(--ios-gray6)] p-2 gap-1">
          <button
            onClick={() => onTabChange('saved')}
            className={`flex-1 px-3 py-2 text-xs transition-all rounded-lg ${
              activeTab === 'saved'
                ? 'bg-white ios-shadow text-[var(--ios-blue)]'
                : 'text-[var(--ios-gray)] hover:text-[var(--foreground)]'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
              {savedAdventures.length > 0 && activeTab !== 'saved' && (
                <div className="w-1.5 h-1.5 bg-[var(--ios-blue)] rounded-full"></div>
              )}
            </div>
          </button>
          <button
            onClick={() => onTabChange('group')}
            className={`flex-1 px-3 py-2 text-xs transition-all rounded-lg ${
              activeTab === 'group'
                ? 'bg-white ios-shadow text-[var(--ios-purple)]'
                : 'text-[var(--ios-gray)] hover:text-[var(--foreground)]'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Groups</span>
              {groupAdventures.length > 0 && activeTab !== 'group' && (
                <div className="w-1.5 h-1.5 bg-[var(--ios-purple)] rounded-full"></div>
              )}
            </div>
          </button>
          <button
            onClick={() => onTabChange('discarded')}
            className={`flex-1 px-3 py-2 text-xs transition-all rounded-lg ${
              activeTab === 'discarded'
                ? 'bg-white ios-shadow text-[var(--ios-gray)]'
                : 'text-[var(--ios-gray)] hover:text-[var(--foreground)]'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <XIcon className="w-4 h-4" />
              <span>Passed</span>
              {discardedAdventures.length > 0 && activeTab !== 'discarded' && (
                <div className="w-1.5 h-1.5 bg-[var(--ios-gray)] rounded-full"></div>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {(activeTab === 'home' || activeTab === 'adventure' || activeTab === 'my-adventures') && (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--ios-gray5)] rounded-[16px] flex items-center justify-center">
                  {activeTab === 'home' ? (
                    <Compass className="w-8 h-8 text-[var(--ios-blue)]" />
                  ) : activeTab === 'adventure' ? (
                    <Sparkles className="w-8 h-8 text-[var(--ios-purple)]" />
                  ) : (
                    <Heart className="w-8 h-8 text-[var(--ios-pink)]" />
                  )}
                </div>
                <h3 className="text-[var(--foreground)] mb-2">
                  {activeTab === 'home' ? 'Browse & Discover' : activeTab === 'adventure' ? 'Plan Your Adventure' : 'Your Saved Adventures'}
                </h3>
                <p className="text-sm text-[var(--ios-gray)]">
                  {activeTab === 'home' 
                    ? 'Explore adventures and save your favorites' 
                    : activeTab === 'adventure'
                    ? 'Create a new adventure to get personalized recommendations'
                    : 'View and manage your saved adventures'}
                </p>
              </div>
            )}
            {activeTab === 'saved' && (
              <>
                {savedAdventures.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--ios-gray5)] rounded-[16px] flex items-center justify-center">
                      <Bookmark className="w-8 h-8 text-[var(--ios-blue)]" />
                    </div>
                    <h3 className="text-[var(--foreground)] mb-2">No saved adventures yet</h3>
                    <p className="text-sm text-[var(--ios-gray)]">
                      Save adventures from the feed to view them here!
                    </p>
                  </div>
                ) : (
                  savedAdventures.map(({ adventure, rating }) => (
                    <Card
                      key={adventure.id}
                      className="overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group border-[var(--border)] ios-blur-light ios-shadow rounded-[16px]"
                      onClick={() => {
                        onAdventureClick(adventure);
                        setIsOpen(false);
                      }}
                    >
                      <div className="relative h-32 overflow-hidden">
                        <ImageWithFallback
                          src={adventure.images[0]}
                          alt={adventure.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-2">
                          <div className="text-xs text-white bg-black/40 backdrop-blur px-2 py-1 rounded-full">
                            {rating}% match
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white/70">
                        <h4 className="text-[var(--foreground)] text-sm mb-1 line-clamp-1">{adventure.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-[var(--ios-gray)]">
                          <MapPin className="w-3 h-3" />
                          {adventure.destination}
                        </div>
                        {onRemoveAdventure && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2 text-xs hover:bg-[var(--ios-red)]/10 hover:text-[var(--ios-red)] rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveAdventure(adventure.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </>
            )}

            {activeTab === 'group' && (
              <>
                {groupAdventures.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--ios-gray5)] rounded-[16px] flex items-center justify-center">
                      <Users className="w-8 h-8 text-[var(--ios-purple)]" />
                    </div>
                    <h3 className="text-[var(--foreground)] mb-2">No group adventures</h3>
                    <p className="text-sm text-[var(--ios-gray)] mb-4">
                      Create a group adventure to plan with friends!
                    </p>
                    <Button
                      onClick={onCreateGroup}
                      className="bg-[var(--ios-blue)] hover:bg-[#0051D5] active:scale-95 transition-transform ios-shadow rounded-xl"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Create Group
                    </Button>
                  </div>
                ) : (
                  groupAdventures.map((adventure) => (
                    <Card
                      key={adventure.id}
                      className="overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group border-[var(--border)] ios-blur-light ios-shadow rounded-[16px]"
                      onClick={() => {
                        onAdventureClick(adventure);
                        setIsOpen(false);
                      }}
                    >
                      <div className="relative h-32 overflow-hidden">
                        <ImageWithFallback
                          src={adventure.images[0]}
                          alt={adventure.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-2 right-2 bg-[var(--ios-purple)] text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 ios-shadow">
                          <Users className="w-3 h-3" />
                          Group
                        </div>
                      </div>
                      <div className="p-3 bg-white/70">
                        <h4 className="text-[var(--foreground)] text-sm mb-1 line-clamp-1">{adventure.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-[var(--ios-gray)]">
                          <MapPin className="w-3 h-3" />
                          {adventure.destination}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </>
            )}

            {activeTab === 'discarded' && (
              <>
                {discardedAdventures.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--ios-gray5)] rounded-[16px] flex items-center justify-center">
                      <XIcon className="w-8 h-8 text-[var(--ios-gray)]" />
                    </div>
                    <h3 className="text-[var(--foreground)] mb-2">No passed adventures</h3>
                    <p className="text-sm text-[var(--ios-gray)]">
                      Adventures you pass on will appear here
                    </p>
                  </div>
                ) : (
                  discardedAdventures.map(({ adventure, rating }) => (
                    <Card
                      key={adventure.id}
                      className="overflow-hidden opacity-60 hover:opacity-100 transition-all group border-[var(--border)] ios-blur-light rounded-[16px]"
                    >
                      <div className="relative h-32 overflow-hidden">
                        <ImageWithFallback
                          src={adventure.images[0]}
                          alt={adventure.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-2">
                          <div className="text-xs text-white bg-black/40 backdrop-blur px-2 py-1 rounded-full">
                            {rating}% match
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white/70">
                        <h4 className="text-[var(--foreground)] text-sm mb-1 line-clamp-1">{adventure.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-[var(--ios-gray)]">
                          <MapPin className="w-3 h-3" />
                          {adventure.destination}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </>
  );
};