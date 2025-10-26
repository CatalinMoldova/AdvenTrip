import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, MapPin, Users, Calendar, Sparkles } from 'lucide-react';
import { AdvenTripLogo } from './ui/AdvenTripLogo';

interface HomePageProps {
  onGetStarted: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const travelImages = [
    'https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/1708063049157-NMFAB7KBRBY2IG2BWP4E/the+golden+gate+bridge+san+francisco.jpg',
    'https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/v1/shutterstock_329662223_ss_non-editorial_3_csm8lw?_a=BAVAZGE70',
    'https://idsb.tmgrup.com.tr/ly/uploads/images/2025/03/12/372657.jpg',
    'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742',
    'https://plus.unsplash.com/premium_photo-1661962958462-9e52fda9954d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === travelImages.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0); // Reset progress when image changes
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [travelImages.length]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / 40); // 100% over 40 intervals (4 seconds * 10 intervals per second)
        return newProgress >= 100 ? 0 : newProgress;
      });
    }, 100); // Update progress every 100ms

    return () => clearInterval(progressInterval);
  }, [currentImageIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section with Background Images */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {travelImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Travel destination ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
              />
            ))}
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {travelImages.map((_, index) => (
              <div
                key={index}
                className="w-12 h-1 bg-green-100/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-green-100 transition-all duration-100 ${
                    index === currentImageIndex
                      ? 'w-full'
                      : index < currentImageIndex
                      ? 'w-full'
                      : 'w-0'
                  }`}
                  style={{
                    width: index === currentImageIndex ? `${progress}%` : undefined,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center justify-center relative z-10">
          <div className="text-center space-y-12 max-w-5xl mx-auto">
            {/* Main Hero Content */}
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src="/AdvenTrip Logo transparent.png" 
                  alt="AdvenTrip Logo" 
                  className="w-48 h-48 object-contain drop-shadow-2xl"
                  style={{filter: 'drop-shadow(3px 3px 8px rgba(0,0,0,0.8))'}}
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-green-100 drop-shadow-2xl leading-tight" style={{textShadow: '3px 3px 8px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,1)'}}>
                Get Trips Out of the Group Chat
              </h1>
              <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto drop-shadow-xl leading-relaxed" style={{textShadow: '2px 2px 6px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,1)'}}>
                Discover, share, and plan your next adventure with a community of travelers.
                Find inspiration, save trips, and connect with fellow explorers.
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-6">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="px-8 py-3 text-base font-semibold bg-green-100 text-black hover:bg-green-200 shadow-xl hover:shadow-2xl transition-all duration-300"
                style={{boxShadow: '0 4px 6px rgba(0,0,0,0.3)'}}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-sm text-green-100 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,1)'}}>
                Free to use • No signup required
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
                Your social travel companion
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Discover amazing trips from real travelers, save your favorites, and share your own
                  adventures. Whether you're planning your next getaway or daydreaming about bucket list
                  destinations, AdvenTrip makes it easy to find and plan the perfect trip.
                </p>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Swipe through personalized trip recommendations, create adventure boards with friends,
                  and get inspired by a community of explorers just like you.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="px-6 py-3 text-base font-semibold bg-green-600 text-white hover:bg-green-700 shadow-lg"
                style={{boxShadow: '0 4px 6px rgba(0,0,0,0.3)'}}
              >
                Start Planning Your Trip
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Takes 2 minutes • No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
                Everything you need to discover and plan trips
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From inspiration to execution, all in one place
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Find Trip Inspiration</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Swipe through personalized trip recommendations from real travelers.
                    Save the ones you love, pass on the rest.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Share Your Adventures</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Post your trips with photos, ratings, and recommendations.
                    Help others discover amazing destinations.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Plan Your Next Trip</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create adventure boards, collaborate with friends, and organize
                    your bucket list destinations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                Ready to find your next adventure?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join travelers from around the world discovering, sharing, and planning
                amazing trips together.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="px-8 py-3 text-base font-semibold bg-green-600 text-white hover:bg-green-700 shadow-lg"
                style={{boxShadow: '0 4px 6px rgba(0,0,0,0.3)'}}
              >
                Let's Do This
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Start planning in under 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
