import { useState } from 'react';
import { AdventureRequest, Adventure, User } from '../types';
import { Button } from './ui/button';
import { Plus, FolderOpen, Users, User as UserIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SwipeableAdventureCard } from './SwipeableAdventureCard';
import { toast } from 'sonner';

interface AdventuresTabProps {
  adventureRequests: AdventureRequest[];
  adventures: Adventure[];
  onCreateNew: () => void;
  onSaveToFolder?: (folderId: string, adventure: Adventure, rating: number) => void;
  onGroupAdventureClick?: (adventureRequest: AdventureRequest) => void;
  user: User | null;
}

interface AdventureFolder {
  id: string;
  name: string;
  mode: 'individual' | 'group';
  members?: { id: string; name: string; avatar?: string }[];
  savedAdventures: Array<{ adventure: Adventure; rating: number; userId?: string }>;
  discardedAdventures: Adventure[];
  createdAt: string;
}

export function AdventuresTab({ 
  adventureRequests, 
  adventures,
  onCreateNew,
  onSaveToFolder,
  onGroupAdventureClick,
  user 
}: AdventuresTabProps) {
  // Create folders from adventure requests
  const [folders, setFolders] = useState<AdventureFolder[]>(
    adventureRequests.map(req => ({
      id: req.id,
      name: req.groupMembers && req.groupMembers.length > 0 
        ? `Trip with ${req.groupMembers.map(m => m.name).join(', ')}`
        : `${req.activities[0] || 'Adventure'} Trip`,
      mode: req.mode,
      members: req.groupMembers,
      savedAdventures: [],
      discardedAdventures: [],
      createdAt: req.createdAt,
    }))
  );

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);

  const handleSwipeInFolder = (
    folderId: string, 
    adventure: Adventure, 
    rating: number, 
    isLike: boolean
  ) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        if (isLike) {
          return {
            ...folder,
            savedAdventures: [
              ...folder.savedAdventures, 
              { adventure, rating, userId: user?.id }
            ],
          };
        } else {
          return {
            ...folder,
            discardedAdventures: [...folder.discardedAdventures, adventure],
          };
        }
      }
      return folder;
    }));

    if (isLike) {
      onSaveToFolder?.(folderId, adventure, rating);
      toast.success('Added to folder! 📁');
    } else {
      toast.info('Passed');
    }

    setTimeout(() => {
      setCurrentFeedIndex(prev => prev + 1);
    }, 300);
  };

  const currentFolder = folders.find(f => f.id === selectedFolder);
  
  // Filter adventures for current folder
  const getFolderAdventures = (folder: AdventureFolder) => {
    const request = adventureRequests.find(r => r.id === folder.id);
    if (!request) return adventures;

    // Filter based on activities
    return adventures.filter(adv => 
      request.activities.some(reqAct =>
        adv.activities.some(advAct =>
          advAct.toLowerCase().includes(reqAct.toLowerCase())
        )
      )
    );
  };

  const visibleAdventures = currentFolder 
    ? getFolderAdventures(currentFolder).filter(
        adv => !currentFolder.savedAdventures.some(s => s.adventure.id === adv.id) &&
               !currentFolder.discardedAdventures.some(d => d.id === adv.id)
      )
    : [];

  // Folder view
  if (!selectedFolder) {
    return (
      <div className="h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="border-b border-black/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-black mb-1">Your Adventures</h1>
              <p className="text-sm text-black/60">
                {folders.length} {folders.length === 1 ? 'folder' : 'folders'}
              </p>
            </div>
            <Button
              onClick={onCreateNew}
              className="bg-black hover:bg-black/80 text-white rounded-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Adventure
            </Button>
          </div>
        </div>

        {/* Folders Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {folders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 mx-auto mb-4 bg-black/5 rounded-full flex items-center justify-center">
                  <FolderOpen className="w-10 h-10 text-black/40" />
                </div>
                <h3 className="text-xl text-black mb-2">No adventures yet</h3>
                <p className="text-black/60 mb-6">
                  Create your first adventure to start planning your perfect trip
                </p>
                <Button
                  onClick={onCreateNew}
                  className="bg-black hover:bg-black/80 text-white rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Adventure
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {folders.map((folder) => {
                const folderAdventures = getFolderAdventures(folder);
                const progress = folderAdventures.length > 0
                  ? (folder.savedAdventures.length / folderAdventures.length) * 100
                  : 0;

                return (
                  <motion.button
                    key={folder.id}
                    onClick={() => {
                      if (folder.mode === 'group' && onGroupAdventureClick) {
                        // Find the adventure request for this folder
                        const adventureRequest = adventureRequests.find(req => req.id === folder.id);
                        if (adventureRequest) {
                          onGroupAdventureClick(adventureRequest);
                        }
                      } else {
                        setSelectedFolder(folder.id);
                        setCurrentFeedIndex(0);
                      }
                    }}
                    className="bg-white border border-black/10 rounded-2xl p-6 text-left hover:border-black/30 transition-all hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center">
                          {folder.mode === 'group' ? (
                            <Users className="w-6 h-6 text-black" />
                          ) : (
                            <UserIcon className="w-6 h-6 text-black" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-black mb-1">{folder.name}</h3>
                          <p className="text-xs text-black/60">
                            {folder.mode === 'group' ? 'Group Adventure' : 'Solo Adventure'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-black/40" />
                    </div>

                    {/* Members (if group) */}
                    {folder.members && folder.members.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex -space-x-2">
                          {folder.members.slice(0, 3).map((member) => (
                            <div
                              key={member.id}
                              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs border-2 border-white"
                            >
                              {member.avatar || member.name[0]}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-black/60">
                          {folder.members.length} {folder.members.length === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                    )}

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-black/60">
                        <span>Progress</span>
                        <span>{folder.savedAdventures.length} saved</span>
                      </div>
                      <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-black/10 text-xs text-black/60">
                      <div>
                        <span className="text-black">{folderAdventures.length}</span> options
                      </div>
                      <div>
                        <span className="text-black">{folder.discardedAdventures.length}</span> passed
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Feed view for selected folder
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-black/10 p-4 flex items-center justify-between">
        <button
          onClick={() => setSelectedFolder(null)}
          className="flex items-center gap-2 text-black hover:text-black/70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Folders</span>
        </button>
        <div className="text-sm text-black/60">
          {currentFolder?.name}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 relative">
        {visibleAdventures.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 bg-black/5 rounded-full flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-black/40" />
              </div>
              <h3 className="text-xl text-black mb-2">All done!</h3>
              <p className="text-black/60 mb-6">
                You've reviewed all adventures for this folder. 
                {currentFolder?.mode === 'group' && ' Share with your group to see their picks!'}
              </p>
              <Button
                onClick={() => setSelectedFolder(null)}
                className="bg-black hover:bg-black/80 text-white rounded-xl"
              >
                Back to Folders
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <div className="relative w-full max-w-lg" style={{ height: '75vh' }}>
              <AnimatePresence>
                {visibleAdventures.length > 0 && currentFeedIndex < visibleAdventures.length && (
                  <SwipeableAdventureCard
                    key={visibleAdventures[currentFeedIndex].id}
                    adventure={visibleAdventures[currentFeedIndex]}
                    onSwipeLeft={(adv) => 
                      handleSwipeInFolder(currentFolder!.id, adv, 0, false)
                    }
                    onSwipeRight={(adv, rating) => 
                      handleSwipeInFolder(currentFolder!.id, adv, rating, true)
                    }
                    onSliderDecision={(adv, rating, isLike) =>
                      handleSwipeInFolder(currentFolder!.id, adv, rating, isLike)
                    }
                    startLocation={user?.location}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-full text-sm">
              {currentFeedIndex + 1} / {visibleAdventures.length}
            </div>

            {/* Group Mode: Show what friends liked */}
            {currentFolder?.mode === 'group' && currentFolder.savedAdventures.length > 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border border-black/10 rounded-xl p-3 shadow-lg max-w-xs">
                <div className="text-xs text-black/60 mb-1">Group Favorites</div>
                <div className="flex items-center gap-2">
                  {currentFolder.savedAdventures.slice(0, 3).map((saved, idx) => (
                    <div key={idx} className="text-xs text-black">
                      {saved.adventure.title.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
