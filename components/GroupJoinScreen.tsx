import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Users, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface GroupJoinScreenProps {
  inviteId: string;
  onJoin: (name: string) => void;
}

export function GroupJoinScreen({ inviteId, onJoin }: GroupJoinScreenProps) {
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoin = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    onJoin(name.trim());
    setHasJoined(true);
    toast.success('You\'ve joined the group! 🎉');
  };

  if (hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 ios-shadow-xl text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-[var(--ios-label)] mb-3">You're in!</h1>
          <p className="text-[var(--ios-gray)] mb-6">
            You've successfully joined the group adventure. All members will be notified once everyone has joined.
          </p>

          <div className="bg-[var(--ios-gray6)] rounded-2xl p-4">
            <p className="text-xs text-[var(--ios-gray)] mb-1">YOUR NAME</p>
            <p className="text-[var(--ios-label)]">{name}</p>
          </div>

          <p className="text-xs text-[var(--ios-gray)] mt-6">
            You can close this page now
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 ios-shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FF2D55] to-[#FF9500] rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-[var(--ios-label)] mb-2">Join Group Adventure</h1>
          <p className="text-sm text-[var(--ios-gray)]">
            You've been invited to plan an adventure together
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs text-[var(--ios-gray)] mb-2 block">YOUR NAME</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="text-center text-lg border-0 bg-[var(--ios-gray6)] rounded-xl px-6 py-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleJoin();
                }
              }}
            />
          </div>

          <Button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] hover:opacity-90 text-white rounded-xl h-14 ios-shadow"
          >
            Join Adventure
          </Button>
        </div>

        <p className="text-xs text-[var(--ios-gray)] text-center mt-6">
          Once all members join, you'll be able to start planning together
        </p>
      </motion.div>
    </div>
  );
}
