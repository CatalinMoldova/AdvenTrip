import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera, Upload, X, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProfilePicturePickerProps {
  currentAvatar?: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectPicture: (avatarUrl: string) => void;
}

const defaultAvatars = [
  { id: 'avatar1', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', name: 'Professional' },
  { id: 'avatar2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', name: 'Casual' },
  { id: 'avatar3', url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', name: 'Friendly' },
  { id: 'avatar4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', name: 'Adventurous' },
  { id: 'avatar5', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', name: 'Creative' },
  { id: 'avatar6', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', name: 'Outgoing' },
];

export function ProfilePicturePicker({ 
  currentAvatar, 
  userName, 
  isOpen, 
  onClose, 
  onSelectPicture 
}: ProfilePicturePickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setSelectedAvatar(imageUrl);
    }
  };

  const handleSelectDefault = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleSave = () => {
    if (selectedAvatar) {
      onSelectPicture(selectedAvatar);
      onClose();
      toast.success('Profile picture updated! 📸');
    } else {
      toast.error('Please select a profile picture');
    }
  };

  const handleRemovePicture = () => {
    setSelectedAvatar('');
    onSelectPicture('');
    onClose();
    toast.success('Profile picture removed');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Choose Profile Picture
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Selection Preview */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={selectedAvatar} />
                <AvatarFallback className="text-2xl">
                  {selectedAvatar ? '?' : getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              {selectedAvatar && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                  onClick={handleRemovePicture}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {selectedAvatar ? 'Selected picture' : 'No picture selected'}
            </p>
          </div>

          {/* Upload Section */}
          <div className="space-y-3">
            <h3 className="font-medium">Upload Your Own</h3>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose File
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>

          {/* Default Avatars */}
          <div className="space-y-3">
            <h3 className="font-medium">Choose from Defaults</h3>
            <div className="grid grid-cols-3 gap-3">
              {defaultAvatars.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  onClick={() => handleSelectDefault(avatar.url)}
                  className={`relative p-2 rounded-lg border-2 transition-all ${
                    selectedAvatar === avatar.url
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarImage src={avatar.url} />
                    <AvatarFallback>
                      <UserIcon className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    {avatar.name}
                  </p>
                  {selectedAvatar === avatar.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Picture
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
