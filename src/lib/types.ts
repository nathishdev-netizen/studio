import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type User = {
  id: string;
  name: string;
  email: string;
  profilePic: ImagePlaceholder;
  preferences: {
    interests: string[];
    hobbies: string[];
    likesDislikes: string;
    description: string;
  };
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
};
