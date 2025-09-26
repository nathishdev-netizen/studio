"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { InterestsStep } from "./InterestsStep";
import { ConsentStep } from "./ConsentStep";
import { WelcomeStep } from "./WelcomeStep";
import type { User } from "@/lib/types";

type OnboardingData = {
  age?: number;
  relationshipGoals?: string;
  description?: string;
  interests?: string[];
  personalityTraits?: string[];
  consentToMatch?: boolean;
};

export function OnboardingFlow() {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const steps = [
    { title: "Welcome", component: "welcome" },
    { title: "Personal Info", component: "personal" },
    { title: "Interests", component: "interests" },
    { title: "Preferences", component: "consent" }
  ];

  const handlePersonalInfoNext = (data: {
    age: number;
    relationshipGoals: string;
    description: string;
  }) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleInterestsNext = (data: {
    interests: string[];
    personalityTraits: string[];
  }) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleConsentNext = async (data: { consentToMatch: boolean }) => {
    const finalData = { ...onboardingData, ...data };
    
    // Update user profile with all collected data
    await updateProfile({
      age: finalData.age,
      relationshipGoals: finalData.relationshipGoals,
      interests: finalData.interests,
      personalityTraits: finalData.personalityTraits,
      consentToMatch: finalData.consentToMatch,
      preferences: {
        ...user?.preferences,
        description: finalData.description || user?.preferences?.description || '',
        interests: finalData.interests || user?.preferences?.interests || [],
        hobbies: user?.preferences?.hobbies || [],
        likesDislikes: user?.preferences?.likesDislikes || ''
      }
    });
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2D7D9] via-[#FFE5E7] to-[#E8D5F2] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{steps[currentStep]?.title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <WelcomeStep 
            onNext={() => setCurrentStep(1)}
            userName={user?.name || 'there'}
          />
        )}

        {currentStep === 1 && (
          <PersonalInfoStep 
            onNext={handlePersonalInfoNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 2 && (
          <InterestsStep 
            onNext={handleInterestsNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <ConsentStep 
            onNext={(data) => handleConsentNext(data)}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
