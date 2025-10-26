import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { TripPost } from '../types';
import { Copy, Twitter, Facebook, MessageCircle, Link as LinkIcon, Instagram } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: TripPost | null;
}

export function ShareModal({ isOpen, onClose, post }: ShareModalProps) {
  if (!post) return null;

  const shareUrl = `${window.location.origin}/post/${post.id}`;
  const shareText = `Check out this amazing trip: ${post.title} in ${post.destination}!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
    onClose();
  };

  const handleShareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    onClose();
  };

  const handleShareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    onClose();
  };

  const handleShareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleShareToInstagram = () => {
    // Instagram doesn't support direct web sharing
    // Copy link and show instruction
    navigator.clipboard.writeText(shareUrl);
    toast.info('Link copied! Paste it in your Instagram story or bio');
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (error) {
        // User cancelled or error occurred
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Trip</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Post Preview */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-3">
            {post.images[0] && (
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{post.title}</h4>
              <p className="text-xs text-gray-600 truncate">{post.destination}</p>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Copy className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-900">Copy Link</span>
            </button>

            <button
              onClick={handleShareToWhatsApp}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">WhatsApp</span>
            </button>

            <button
              onClick={handleShareToTwitter}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Twitter className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Twitter</span>
            </button>

            <button
              onClick={handleShareToInstagram}
              className="flex flex-col items-center gap-2 p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Instagram</span>
            </button>

            <button
              onClick={handleShareToFacebook}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Facebook</span>
            </button>

            {/* Native Share (Mobile) */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">More</span>
              </button>
            )}
          </div>

          {/* URL Display */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent border-0 text-xs text-gray-600 focus:outline-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

