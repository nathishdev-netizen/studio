"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalInfoStepProps {
  onNext: (data: {
    age: number;
    relationshipGoals: string;
    description: string;
  }) => void;
  onBack: () => void;
}

export function PersonalInfoStep({ onNext, onBack }: PersonalInfoStepProps) {
  const [age, setAge] = useState<string>('');
  const [relationshipGoals, setRelationshipGoals] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleNext = () => {
    if (age && relationshipGoals && description) {
      onNext({
        age: parseInt(age),
        relationshipGoals,
        description
      });
    }
  };

  const isValid = age && relationshipGoals && description.length >= 20;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-[#FF7F50]">Tell Us About Yourself</CardTitle>
        <CardDescription>
          Help us personalize your experience and find meaningful connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="18"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">What are you looking for?</Label>
          <Select value={relationshipGoals} onValueChange={setRelationshipGoals}>
            <SelectTrigger>
              <SelectValue placeholder="Select your relationship goals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendship">Friendship and companionship</SelectItem>
              <SelectItem value="dating">Casual dating</SelectItem>
              <SelectItem value="serious">Serious relationship</SelectItem>
              <SelectItem value="marriage">Marriage and long-term commitment</SelectItem>
              <SelectItem value="networking">Professional networking</SelectItem>
              <SelectItem value="support">Emotional support and understanding</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Tell us about yourself</Label>
          <Textarea
            id="description"
            placeholder="Share what makes you unique, your passions, what you're looking for in connections, or anything else you'd like others to know about you..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="text-sm text-gray-500 text-right">
            {description.length}/200 characters (minimum 20)
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
