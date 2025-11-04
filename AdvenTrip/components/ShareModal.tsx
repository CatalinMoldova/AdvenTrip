import React, { useState } from 'react';
import { X, Link as LinkIcon, MessageCircle, Send, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  postUrl: string;
}

export function ShareModal({ isOpen, onClose, postTitle, postUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      action: () => toast.info('WhatsApp share coming soon!'),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      action: () => toast.info('Instagram share coming soon!'),
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-400',
      action: () => toast.info('Twitter share coming soon!'),
    },
    {
      id: 'message',
      name: 'Message',
      icon: '💌',
      color: 'bg-blue-500',
      action: () => toast.info('Direct message coming soon!'),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share Trip</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Title */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{postTitle}</p>
          </div>

          {/* Copy Link */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Share Link</label>
            <div className="flex gap-2">
              <Input
                value={postUrl}
                readOnly
                className="flex-1 bg-gray-50 text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant={copied ? 'default' : 'outline'}
                className={copied ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <LinkIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Share to Platform */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Share to</label>
            <div className="grid grid-cols-4 gap-4">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.action}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${option.color} flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-md`}
                  >
                    {option.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Send to Friends */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Send to Friends
            </label>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Select friends from your chats to share this trip
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                <Send className="w-4 h-4 mr-2" />
                Select Friends
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


