import React, { useState } from 'react';
import { TripPost } from '../types';
import { X, Image as ImageIcon, MapPin, Calendar, Star, Hotel, UtensilsCrossed, Plus, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface CreatePostScreenProps {
  onCreatePost: (post: Omit<TripPost, 'id' | 'createdAt' | 'stats' | 'author'>) => void;
  onCancel: () => void;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  currentUserUsername?: string;
}

export function CreatePostScreen({
  onCreatePost,
  onCancel,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  currentUserUsername,
}: CreatePostScreenProps) {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [isBucketList, setIsBucketList] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [activityInput, setActivityInput] = useState('');
  const [hotels, setHotels] = useState<string[]>([]);
  const [hotelInput, setHotelInput] = useState('');
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [restaurantInput, setRestaurantInput] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

  const handleSelectType = (bucketList: boolean) => {
    setIsBucketList(bucketList);
    setStep('details');
  };

  const handleAddImage = () => {
    if (imageInput.trim() && images.length < 8) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      setActivities([...activities, activityInput.trim()]);
      setActivityInput('');
    }
  };

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleAddHotel = () => {
    if (hotelInput.trim()) {
      setHotels([...hotels, hotelInput.trim()]);
      setHotelInput('');
    }
  };

  const handleRemoveHotel = (index: number) => {
    setHotels(hotels.filter((_, i) => i !== index));
  };

  const handleAddRestaurant = () => {
    if (restaurantInput.trim()) {
      setRestaurants([...restaurants, restaurantInput.trim()]);
      setRestaurantInput('');
    }
  };

  const handleRemoveRestaurant = (index: number) => {
    setRestaurants(restaurants.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !destination.trim()) {
      toast.error('Please fill in title and destination');
      return;
    }

    // Extract tags from activities and destination
    const tags = [
      ...activities.map(a => a.toLowerCase()),
      destination.toLowerCase(),
      ...(isBucketList ? ['bucket-list'] : []),
    ];

    const newPost: Omit<TripPost, 'id' | 'createdAt' | 'stats' | 'author'> = {
      userId: currentUserId,
      title,
      description: description || undefined,
      destination,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1080'],
      duration: duration || undefined,
      activities: activities.length > 0 ? activities : undefined,
      hotels: hotels.length > 0 ? hotels : undefined,
      restaurants: restaurants.length > 0 ? restaurants : undefined,
      tags,
      rating: rating,
      isPublic,
      isEditable,
      isBucketList,
      updatedAt: new Date().toISOString(),
    };

    onCreatePost(newPost);
    toast.success('Post created successfully! 🎉');
  };

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <p className="text-gray-600 mb-8 text-center">
            What type of trip would you like to share?
          </p>

          <div className="space-y-4">
            {/* Past Trip */}
            <button
              onClick={() => handleSelectType(false)}
              className="w-full bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Trip I've Taken</h3>
                  <p className="text-sm text-gray-600">
                    Share your experience from a past trip with photos, ratings, and recommendations
                  </p>
                </div>
              </div>
            </button>

            {/* Bucket List */}
            <button
              onClick={() => handleSelectType(true)}
              className="w-full bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Bucket List Trip</h3>
                  <p className="text-sm text-gray-600">
                    Share a trip you want to take or collaborate with friends on planning
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <button onClick={() => setStep('type')} className="text-green-600 font-medium">
              ← Back
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              {isBucketList ? 'Bucket List Trip' : 'Share Your Trip'}
            </h1>
            <Button onClick={handleSubmit} size="sm" className="bg-green-600 hover:bg-green-700">
              Post
            </Button>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-semibold mb-2">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Paradise Found in Bali"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
            />
          </div>

          {/* Destination */}
          <div>
            <Label htmlFor="destination" className="text-base font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Destination *
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Bali, Indonesia"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="text-base"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-semibold mb-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Share your experience or what you're planning..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="text-base resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <Label className="text-base font-semibold mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Photos (up to 8)
            </Label>
            <div className="space-y-3">
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <Input value={img} readOnly className="flex-1 text-sm" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {images.length < 8 && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste image URL"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                  />
                  <Button onClick={handleAddImage} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-base font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Duration
            </Label>
            <Input
              id="duration"
              placeholder="e.g., 7 days"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {/* Activities */}
          <div>
            <Label className="text-base font-semibold mb-2">Activities</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {activities.map((activity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {activity}
                    <button onClick={() => handleRemoveActivity(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Surfing"
                  value={activityInput}
                  onChange={(e) => setActivityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                />
                <Button onClick={handleAddActivity} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hotels */}
          <div>
            <Label className="text-base font-semibold mb-2 flex items-center gap-2">
              <Hotel className="w-4 h-4" />
              Hotels
            </Label>
            <div className="space-y-2">
              {hotels.map((hotel, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={hotel} readOnly className="flex-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHotel(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Hotel name"
                  value={hotelInput}
                  onChange={(e) => setHotelInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHotel()}
                />
                <Button onClick={handleAddHotel} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Restaurants */}
          <div>
            <Label className="text-base font-semibold mb-2 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Restaurants
            </Label>
            <div className="space-y-2">
              {restaurants.map((restaurant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={restaurant} readOnly className="flex-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRestaurant(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Restaurant name"
                  value={restaurantInput}
                  onChange={(e) => setRestaurantInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRestaurant()}
                />
                <Button onClick={handleAddRestaurant} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Rating (only for past trips) */}
          {!isBucketList && (
            <div>
              <Label className="text-base font-semibold mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Your Rating
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating && star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Public Post</p>
                <p className="text-sm text-gray-600">
                  Anyone can see this post on their feed
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Allow Collaboration</p>
                <p className="text-sm text-gray-600">
                  Let others edit this post
                </p>
              </div>
              <Switch checked={isEditable} onCheckedChange={setIsEditable} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

