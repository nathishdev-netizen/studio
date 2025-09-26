"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Users, Shield, Heart, CheckCircle } from 'lucide-react';

interface ConsentStepProps {
  onNext: (data: { consentToMatch: boolean }) => Promise<void>;
  onBack: () => void;
}

export function ConsentStep({ onNext, onBack }: ConsentStepProps) {
  const [consentToMatch, setConsentToMatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      await onNext({ consentToMatch });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-[#FF7F50]">Your Connection Preferences</CardTitle>
        <CardDescription>
          Choose how you'd like to use PulseChat - you can always change this later
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* AI Companion Section */}
        <div className="bg-gradient-to-r from-[#FF7F50]/10 to-[#FF7F50]/5 p-6 rounded-lg">
          <div className="flex items-center space-x-4 mb-4">
            <Heart className="h-8 w-8 text-[#FF7F50]" />
            <div>
              <h3 className="text-xl font-semibold">AI Companion Mode</h3>
              <p className="text-gray-600">Always available regardless of your choice below</p>
            </div>
          </div>
          <div className="space-y-2 ml-12">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Chat with Nathish, your personal AI companion</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Share your daily experiences and get support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Receive personalized conversation and advice</span>
            </div>
          </div>
        </div>

        {/* Matching Consent Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 border rounded-lg">
            <div className="flex items-start space-x-4">
              <Users className="h-8 w-8 text-[#C3ACCE] mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Connect with Others</h3>
                <p className="text-gray-600 mb-4">
                  Allow Nathish to suggest connections with people who share similar interests, 
                  challenges, or experiences when relevant opportunities arise.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>You control when and if you connect</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Your conversations with Nathish remain private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>You can change this setting anytime</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="consent-matching"
                checked={consentToMatch}
                onCheckedChange={setConsentToMatch}
              />
              <Label htmlFor="consent-matching" className="sr-only">
                Enable connection suggestions
              </Label>
            </div>
          </div>

          {consentToMatch && (
            <div className="bg-[#C3ACCE]/10 p-4 rounded-lg">
              <h4 className="font-semibold text-[#C3ACCE] mb-2">Great choice! 🎉</h4>
              <p className="text-sm text-gray-600">
                Nathish will occasionally suggest connections when you share experiences that 
                others might relate to. You'll always have the choice to connect or not.
              </p>
            </div>
          )}

          {!consentToMatch && (
            <div className="bg-[#FF7F50]/10 p-4 rounded-lg">
              <h4 className="font-semibold text-[#FF7F50] mb-2">No problem! 💙</h4>
              <p className="text-sm text-gray-600">
                You can focus on building a relationship with Nathish, your AI companion. 
                You can always enable connections later in your settings.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-[#FF7F50] hover:bg-[#FF6B35]"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Completing Setup...</span>
              </div>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
