"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface InterestsStepProps {
  onNext: (data: {
    interests: string[];
    personalityTraits: string[];
  }) => void;
  onBack: () => void;
}

const SUGGESTED_INTERESTS = [
  'Reading', 'Movies', 'Music', 'Travel', 'Cooking', 'Fitness', 'Photography', 'Gaming',
  'Art', 'Dancing', 'Hiking', 'Yoga', 'Technology', 'Fashion', 'Sports', 'Writing',
  'Meditation', 'Volunteering', 'Gardening', 'Learning Languages', 'Board Games', 'Cycling'
];

const PERSONALITY_TRAITS = [
  'Adventurous', 'Creative', 'Empathetic', 'Funny', 'Intellectual', 'Spontaneous',
  'Calm', 'Optimistic', 'Ambitious', 'Caring', 'Independent', 'Social',
  'Thoughtful', 'Energetic', 'Patient', 'Curious', 'Loyal', 'Open-minded'
];

export function InterestsStep({ onNext, onBack }: InterestsStepProps) {
  const [interests, setInterests] = useState<string[]>([]);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const togglePersonalityTrait = (trait: string) => {
    setPersonalityTraits(prev => 
      prev.includes(trait) 
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest));
  };

  const handleNext = () => {
    onNext({
      interests,
      personalityTraits
    });
  };

  const isValid = interests.length >= 3 && personalityTraits.length >= 2;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-[#FF7F50]">What Makes You, You?</CardTitle>
        <CardDescription>
          Select your interests and personality traits to help us understand you better
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Interests Section */}
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">Interests & Hobbies</Label>
            <p className="text-sm text-gray-600">Choose at least 3 interests</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_INTERESTS.map((interest) => (
              <Badge
                key={interest}
                variant={interests.includes(interest) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  interests.includes(interest) 
                    ? 'bg-[#FF7F50] hover:bg-[#FF6B35]' 
                    : 'hover:bg-[#FF7F50] hover:text-white'
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add custom interest..."
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addCustomInterest}
              disabled={!customInterest.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {interests.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Interests:</Label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    className="bg-[#C3ACCE] hover:bg-[#B399C7] text-white"
                  >
                    {interest}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeInterest(interest)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Personality Traits Section */}
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">Personality Traits</Label>
            <p className="text-sm text-gray-600">Choose at least 2 traits that describe you</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_TRAITS.map((trait) => (
              <Badge
                key={trait}
                variant={personalityTraits.includes(trait) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  personalityTraits.includes(trait) 
                    ? 'bg-[#C3ACCE] hover:bg-[#B399C7]' 
                    : 'hover:bg-[#C3ACCE] hover:text-white'
                }`}
                onClick={() => togglePersonalityTrait(trait)}
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!isValid}
            className="bg-[#FF7F50] hover:bg-[#FF6B35]"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
