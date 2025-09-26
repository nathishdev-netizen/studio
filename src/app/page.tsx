"use client";

import { useAuth } from '@/context/AuthContext';
import { LoginPage } from '@/components/auth/LoginPage';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { AiChatView } from '@/components/dashboard/ai-chat-view';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const viewParam = (searchParams?.get('view') || 'chat') as 'chat' | 'matches' | 'profile' | 'settings';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2D7D9] via-[#FFE5E7] to-[#E8D5F2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F50]"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Check if user needs onboarding - more comprehensive check
  const needsOnboarding = !user.age || !user.interests || !user.personalityTraits || !user.relationshipGoals;

  if (needsOnboarding) {
    return <OnboardingFlow />;
  }

  // User is authenticated and onboarded, show main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2D7D9] via-[#FFE5E7] to-[#E8D5F2]">
      <div className="">
        <AiChatView initialView={viewParam} />
      </div>
    </div>
  );
}
