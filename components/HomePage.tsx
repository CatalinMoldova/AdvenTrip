import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, MapPin, Users, Calendar, Sparkles } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Main Hero Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Get your trips out of the{' '}
              <span className="text-primary">group chat</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plan, organize, and discover amazing adventures with your friends. 
              No more endless group chats and scattered plans.
            </p>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Free to use • No signup required
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Planning</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered suggestions based on your interests and location
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Group Coordination</h3>
              <p className="text-sm text-muted-foreground">
                Keep everyone in the loop with shared itineraries and updates
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Find the perfect dates that work for everyone in your group
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-6 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ready to start planning?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of travelers who've simplified their trip planning
            </p>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="px-8"
            >
              Start Planning Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
