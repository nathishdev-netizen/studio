import type { User, Match, AiChatMessage } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  if (!img) {
    throw new Error(`Placeholder image with id "${id}" not found.`);
  }
  return img;
};

export const currentUser: User = {
  id: 'user-alex',
  name: 'Alex',
  email: 'alex.doe@example.com',
  profilePic: findImage('user-alex'),
  preferences: {
    interests: ['Artificial Intelligence', 'Sci-Fi Movies', 'Jazz Music'],
    hobbies: ['Hiking', 'Photography', 'Cooking'],
    likesDislikes: 'Loves spicy food and thunderstorms. Dislikes crowded places.',
    description:
      'Curious explorer of technology and nature. I find joy in capturing moments through my camera lens and experimenting with new recipes. Always down for a good conversation about the future of AI or the best hiking trails.',
  },
  consentToMatch: true,
};

export const otherUsers: User[] = [
  {
    id: 'user-sam',
    name: 'Sam',
    email: 'sam@example.com',
    profilePic: findImage('user-sam'),
    preferences: {
      interests: ['Documentaries', 'Indie Rock', 'Yoga'],
      hobbies: ['Painting', 'Gardening', 'Volunteering'],
      likesDislikes: 'Loves cats and old book smell. Dislikes reality TV.',
      description: 'Creative soul with a love for quiet mornings and a good cup of tea. My perfect weekend involves getting my hands dirty in the garden or with a new painting.',
    },
    consentToMatch: true,
    profileSummary: 'Sam is a creative and caring person who enjoys artistic pursuits and giving back to the community.',
  },
  {
    id: 'user-jordan',
    name: 'Jordan',
    email: 'jordan@example.com',
    profilePic: findImage('user-jordan'),
    preferences: {
      interests: ['Sci-Fi Movies', 'Video Games', 'Podcasts'],
      hobbies: ['Coding', 'Building PCs', '3D Printing'],
      likesDislikes: 'Loves tinkering with electronics. Dislikes slow internet.',
      description: 'Tech enthusiast who speaks fluent code. When I\'m not building something new on my computer, I\'m probably lost in a virtual world or listening to a tech podcast.',
    },
    consentToMatch: true,
    profileSummary: 'Jordan is a tech-savvy individual passionate about all things digital, from coding to gaming.',
  },
  {
    id: 'user-casey',
    name: 'Casey',
    email: 'casey@example.com',
    profilePic: findImage('user-casey'),
    preferences: {
      interests: ['Jazz Music', 'Stand-up Comedy', 'Traveling'],
      hobbies: ['Playing the saxophone', 'Trying new restaurants', 'Blogging'],
      likesDislikes: 'Loves live music and spontaneous road trips. Dislikes mornings.',
      description: 'Life is a grand adventure, and I want to experience it all. I\'m equally happy exploring a new city or finding a hidden gem of a restaurant in my own.',
    },
    consentToMatch: true,
    profileSummary: 'Casey is an adventurous spirit with a passion for music, travel, and discovering new experiences.',
  },
    {
    id: 'user-taylor',
    name: 'Taylor',
    email: 'taylor@example.com',
    profilePic: findImage('user-taylor'),
    preferences: {
      interests: ['Artificial Intelligence', 'Modern Art', 'Fitness'],
      hobbies: ['Running marathons', 'Visiting art galleries', 'Meditation'],
      likesDislikes: 'Loves a good challenge and minimalist design.',
      description: 'Driven and disciplined, but with a deep appreciation for art and aesthetics. I balance my time between training for the next race and getting lost in a gallery.',
    },
    consentToMatch: true,
    profileSummary: 'Taylor is a disciplined and art-loving individual who is passionate about fitness and AI.',
  },
];

export const matches: Match[] = [
  {
    id: 'match-1',
    user: otherUsers.find(u => u.id === 'user-jordan')!,
    status: 'pending',
    sharedInterests: ['Sci-Fi Movies'],
  },
  {
    id: 'match-2',
    user: otherUsers.find(u => u.id === 'user-casey')!,
    status: 'pending',
    sharedInterests: ['Jazz Music'],
  },
  {
    id: 'match-3',
    user: otherUsers.find(u => u.id === 'user-taylor')!,
    status: 'accepted',
    sharedInterests: ['Artificial Intelligence'],
  },
];

export const aiChatHistory: AiChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Hello Alex! I'm your AI companion. What's on your mind today?",
    timestamp: new Date(new Date().getTime() - 1000 * 60 * 5),
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Hey! Just thinking about what to cook for dinner tonight. Any ideas?',
    timestamp: new Date(new Date().getTime() - 1000 * 60 * 4),
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: "Since you love spicy food, how about trying a new Thai green curry recipe? I can find one for you if you'd like.",
    timestamp: new Date(new Date().getTime() - 1000 * 60 * 3),
  },
];

export const aiCompanion = {
    name: 'Synergy',
    profilePic: findImage('ai-companion')
}
