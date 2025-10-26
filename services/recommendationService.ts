import { TripPost, UserInteraction, UserPreferences } from '../types';

/**
 * Recommendation Algorithm Service
 * 
 * This service implements a tag-based recommendation system that learns
 * user preferences based on their interactions with trip posts.
 * 
 * How it works:
 * - Each post has tags (activities, destinations, etc.)
 * - User interactions (swipe right/save = positive, swipe left = negative)
 * - Algorithm tracks tag scores and adjusts based on interactions
 * - Posts are ranked based on user's tag preference scores
 */

const POSITIVE_WEIGHT = 1.5; // Weight for positive interactions
const NEGATIVE_WEIGHT = -0.8; // Weight for negative interactions
const VIEW_WEIGHT = 0.1; // Small weight for just viewing
const SHARE_WEIGHT = 2.0; // High weight for sharing
const REPOST_WEIGHT = 2.5; // Highest weight for reposting

export class RecommendationService {
  /**
   * Update user preferences based on an interaction
   */
  static updatePreferences(
    currentPreferences: UserPreferences,
    interaction: UserInteraction
  ): UserPreferences {
    const tagScores = { ...currentPreferences.tagScores };
    
    // Determine weight based on interaction type
    let weight = 0;
    switch (interaction.type) {
      case 'save':
      case 'swipe_right':
        weight = POSITIVE_WEIGHT;
        break;
      case 'swipe_left':
        weight = NEGATIVE_WEIGHT;
        break;
      case 'view':
        weight = VIEW_WEIGHT;
        break;
      case 'share':
        weight = SHARE_WEIGHT;
        break;
      case 'repost':
        weight = REPOST_WEIGHT;
        break;
    }

    // Update scores for each tag
    interaction.tags.forEach(tag => {
      const currentScore = tagScores[tag] || 0;
      tagScores[tag] = currentScore + weight;
    });

    return {
      tagScores,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Calculate relevance score for a post based on user preferences
   */
  static calculatePostScore(
    post: TripPost,
    preferences: UserPreferences
  ): number {
    let score = 0;
    let tagCount = 0;

    post.tags.forEach(tag => {
      const tagScore = preferences.tagScores[tag] || 0;
      score += tagScore;
      tagCount++;
    });

    // Average score across all tags
    return tagCount > 0 ? score / tagCount : 0;
  }

  /**
   * Rank posts based on user preferences
   */
  static rankPosts(
    posts: TripPost[],
    preferences: UserPreferences,
    includeRandomness: boolean = true
  ): TripPost[] {
    const scoredPosts = posts.map(post => ({
      post,
      score: this.calculatePostScore(post, preferences),
    }));

    // Add some randomness to avoid echo chamber
    if (includeRandomness) {
      scoredPosts.forEach(item => {
        item.score += Math.random() * 0.3; // Add up to 30% randomness
      });
    }

    // Sort by score (highest first)
    scoredPosts.sort((a, b) => b.score - a.score);

    return scoredPosts.map(item => item.post);
  }

  /**
   * Get personalized feed for a user
   */
  static getPersonalizedFeed(
    allPosts: TripPost[],
    preferences: UserPreferences,
    viewedPostIds: Set<string>,
    limit: number = 20
  ): TripPost[] {
    // Filter out already viewed posts
    const unseenPosts = allPosts.filter(post => !viewedPostIds.has(post.id));

    // Rank remaining posts
    const rankedPosts = this.rankPosts(unseenPosts, preferences);

    // Return limited number
    return rankedPosts.slice(0, limit);
  }

  /**
   * Get initial preferences for new users
   */
  static getInitialPreferences(selectedInterests: string[]): UserPreferences {
    const tagScores: Record<string, number> = {};
    
    // Give initial positive scores to selected interests
    selectedInterests.forEach(interest => {
      tagScores[interest] = 1.0;
    });

    return {
      tagScores,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Extract tags from a trip post
   * This combines various attributes into searchable tags
   */
  static extractTags(post: Partial<TripPost>): string[] {
    const tags = new Set<string>();

    // Add activities
    post.activities?.forEach(activity => tags.add(activity.toLowerCase()));

    // Add destination as a tag
    if (post.destination) {
      tags.add(post.destination.toLowerCase());
    }

    // Add explicit tags
    post.tags?.forEach(tag => tags.add(tag.toLowerCase()));

    return Array.from(tags);
  }

  /**
   * Get trending posts (high engagement)
   */
  static getTrendingPosts(posts: TripPost[], limit: number = 10): TripPost[] {
    return [...posts]
      .sort((a, b) => {
        const scoreA = (a.stats.saves * 2) + (a.stats.reposts * 3) + a.stats.shares;
        const scoreB = (b.stats.saves * 2) + (b.stats.reposts * 3) + b.stats.shares;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Get similar posts based on tags
   */
  static getSimilarPosts(
    post: TripPost,
    allPosts: TripPost[],
    limit: number = 5
  ): TripPost[] {
    const postTags = new Set(post.tags);
    
    const scoredPosts = allPosts
      .filter(p => p.id !== post.id)
      .map(p => {
        // Count overlapping tags
        const overlap = p.tags.filter(tag => postTags.has(tag)).length;
        return { post: p, score: overlap };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredPosts.slice(0, limit).map(item => item.post);
  }
}

export default RecommendationService;

