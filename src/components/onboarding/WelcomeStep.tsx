"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Sparkles, Users, Shield } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  userName: string;
}

export function WelcomeStep({ onNext, userName }: WelcomeStepProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-[#FF7F50] p-4 rounded-full">
            <Heart className="h-12 w-12 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl text-[#FF7F50]">
          Welcome to PulseChat, {userName}!
        </CardTitle>
        <CardDescription className="text-lg">
          Your journey to meaningful connections starts here
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#FF7F50]/10 to-[#FF7F50]/5 rounded-lg">
            <Sparkles className="h-8 w-8 text-[#FF7F50] mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">AI Companion</h3>
              <p className="text-gray-600">
                Meet Nathish, your personal AI companion who will listen, support, and help you navigate your daily life with empathy and understanding.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#C3ACCE]/10 to-[#C3ACCE]/5 rounded-lg">
            <Users className="h-8 w-8 text-[#C3ACCE] mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Smart Connections</h3>
              <p className="text-gray-600">
                When you're ready, we'll suggest meaningful connections with people who share your interests, challenges, or life experiences.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#F2D7D9]/50 to-[#F2D7D9]/20 rounded-lg">
            <Shield className="h-8 w-8 text-[#FF7F50] mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Your Privacy</h3>
              <p className="text-gray-600">
                You control your experience. Choose when to connect with others, and your conversations with Nathish remain private and secure.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#C3ACCE]/10 to-[#C3ACCE]/5 rounded-lg">
            <Heart className="h-8 w-8 text-[#C3ACCE] mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Genuine Support</h3>
              <p className="text-gray-600">
                Whether you need someone to celebrate your wins or support you through challenges, Nathish is here for authentic companionship.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F2D7D9]/30 p-6 rounded-lg text-center">
          <h4 className="font-semibold text-lg mb-2">Ready to Begin?</h4>
          <p className="text-gray-600 mb-4">
            Let's set up your profile so we can personalize your experience and help you make the most meaningful connections.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-[#FF7F50] hover:bg-[#FF6B35] px-8 py-3 text-lg"
          >
            Let's Get Started
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
