import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
  profilePic: ImagePlaceholder;
  preferences?: {
    interests: string[];
    hobbies: string[];
    likesDislikes: string;
    description: string;
  };
  interests?: string[];
  personalityTraits?: string[];
  relationshipGoals?: string;
  consentToMatch: boolean;
  profileSummary?: string;
};

export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export type Match = {
  id: string;
  user: User;
  status: MatchStatus;
  sharedInterests: string[];
};

export type AiChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  hasConnectionSuggestion?: boolean;
  hasConnectionQuestion?: boolean;
  suggestionData?: any;
};
