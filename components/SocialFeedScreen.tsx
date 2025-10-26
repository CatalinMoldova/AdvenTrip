import React, { useState, useEffect } from 'react';
import { TripPost, UserPreferences, UserInteraction } from '../types';
import { TripPostCard } from './TripPostCard';
import { RecommendationService } from '../services/recommendationService';
import { Sparkles } from 'lucide-react';

interface SocialFeedScreenProps {
  posts: TripPost[];
  userPreferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
  onSavePost: (postId: string) => void;
  onSharePost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  savedPostIds?: Set<string>;
}

export function SocialFeedScreen({
  posts,
  userPreferences,
  onUpdatePreferences,
  onSavePost,
  onSharePost,
  onRepostPost,
  savedPostIds = new Set(),
}: SocialFeedScreenProps) {
  const [personalizedPosts, setPersonalizedPosts] = useState<TripPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get personalized feed on mount and when posts change
  useEffect(() => {
    const ranked = RecommendationService.rankPosts(posts, userPreferences, true);
    setPersonalizedPosts(ranked);
  }, [posts, userPreferences]);

  const handleSwipeLeft = (postId: string) => {
    const post = personalizedPosts.find(p => p.id === postId);
    if (!post) return;

    const interaction: UserInteraction = {
      id: `swipe_left_${Date.now()}`,
      userId: 'currentUser',
      postId,
      type: 'swipe_left',
      tags: post.tags,
      createdAt: new Date().toISOString(),
    };

    const updatedPreferences = RecommendationService.updatePreferences(
      userPreferences,
      interaction
    );
    onUpdatePreferences(updatedPreferences);

    // Move to next post
    if (currentIndex < personalizedPosts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = (postId: string) => {
    const post = personalizedPosts.find(p => p.id === postId);
    if (!post) return;

    const interaction: UserInteraction = {
      id: `swipe_right_${Date.now()}`,
      userId: 'currentUser',
      postId,
      type: 'swipe_right',
      tags: post.tags,
      createdAt: new Date().toISOString(),
    };

    const updatedPreferences = RecommendationService.updatePreferences(
      userPreferences,
      interaction
    );
    onUpdatePreferences(updatedPreferences);

    onSavePost(postId);

    // Move to next post
    if (currentIndex < personalizedPosts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSave = (postId: string) => {
    const post = personalizedPosts.find(p => p.id === postId);
    if (!post) return;

    const interaction: UserInteraction = {
      id: `save_${Date.now()}`,
      userId: 'currentUser',
      postId,
      type: 'save',
      tags: post.tags,
      createdAt: new Date().toISOString(),
    };

    const updatedPreferences = RecommendationService.updatePreferences(
      userPreferences,
      interaction
    );
    onUpdatePreferences(updatedPreferences);

    onSavePost(postId);
  };

  const handleShare = (postId: string) => {
    const post = personalizedPosts.find(p => p.id === postId);
    if (!post) return;

    const interaction: UserInteraction = {
      id: `share_${Date.now()}`,
      userId: 'currentUser',
      postId,
      type: 'share',
      tags: post.tags,
      createdAt: new Date().toISOString(),
    };

    const updatedPreferences = RecommendationService.updatePreferences(
      userPreferences,
      interaction
    );
    onUpdatePreferences(updatedPreferences);

    onSharePost(postId);
  };

  const handleRepost = (postId: string) => {
    const post = personalizedPosts.find(p => p.id === postId);
    if (!post) return;

    const interaction: UserInteraction = {
      id: `repost_${Date.now()}`,
      userId: 'currentUser',
      postId,
      type: 'repost',
      tags: post.tags,
      createdAt: new Date().toISOString(),
    };

    const updatedPreferences = RecommendationService.updatePreferences(
      userPreferences,
      interaction
    );
    onUpdatePreferences(updatedPreferences);

    onRepostPost(postId);
  };

  if (personalizedPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No trips yet!
          </h2>
          <p className="text-gray-600 mb-6">
            Be the first to share a trip or check back soon for more adventures.
          </p>
        </div>
      </div>
    );
  }

  // Check if we've reached the end
  if (currentIndex >= personalizedPosts.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You've seen them all! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Check back later for more amazing trips
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="font-medium">
                {currentIndex + 1} / {personalizedPosts.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Single Post - Centered */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          <TripPostCard
            post={personalizedPosts[currentIndex]}
            onSave={handleSave}
            onShare={handleShare}
            onRepost={handleRepost}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isSaved={savedPostIds.has(personalizedPosts[currentIndex].id)}
          />
        </div>
      </div>

      {/* Swipe Hints */}
      <div className="pb-24 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-lg">✕</span>
            </div>
            <span>Swipe left to pass</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-lg">❤</span>
            </div>
            <span>Swipe right to save</span>
          </div>
        </div>
      </div>
    </div>
  );
}

