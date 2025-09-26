import type { User, AiChatMessage } from '@/lib/types';

// Fictional users with detailed profiles and chat histories
export const fictionalUsers: User[] = [
  {
    id: 'user-2',
    name: 'Emma Chen',
    email: 'emma.chen@example.com',
    age: 26,
    profilePic: {
      id: 'profile-2',
      imageUrl: 'https://picsum.photos/seed/emma-chen/400/400',
      imageHint: 'Profile picture of Emma Chen',
      description: 'A creative artist with expressive eyes'
    },
    preferences: {
      interests: ['Art', 'Photography', 'Yoga', 'Sustainable Living'],
      hobbies: ['Painting', 'Meditation', 'Gardening'],
      likesDislikes: 'Loves creative expression, dislikes fast fashion',
      description: 'A passionate artist who finds beauty in everyday moments. Committed to sustainable living and mindful practices.'
    },
    interests: ['Art', 'Photography', 'Yoga', 'Sustainable Living', 'Painting', 'Meditation', 'Gardening'],
    personalityTraits: ['Creative', 'Empathetic', 'Thoughtful', 'Independent'],
    relationshipGoals: 'Friendship and companionship',
    consentToMatch: true,
    profileSummary: 'Mindful artist seeking authentic connections'
  },
  {
    id: 'user-3',
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@example.com',
    age: 30,
    profilePic: {
      id: 'profile-3',
      imageUrl: 'https://picsum.photos/seed/marcus-rodriguez/400/400',
      imageHint: 'Profile picture of Marcus Rodriguez',
      description: 'A fitness enthusiast with a bright smile'
    },
    preferences: {
      interests: ['Fitness', 'Cooking', 'Travel', 'Music Production'],
      hobbies: ['Rock Climbing', 'DJ-ing', 'Food Photography'],
      likesDislikes: 'Loves trying new cuisines, dislikes negative energy',
      description: 'A fitness coach and music producer who believes in living life to the fullest. Always up for new adventures and meeting positive people.'
    },
    interests: ['Fitness', 'Cooking', 'Travel', 'Music Production', 'Rock Climbing', 'DJ-ing', 'Food Photography'],
    personalityTraits: ['Energetic', 'Optimistic', 'Adventurous', 'Social'],
    relationshipGoals: 'Casual dating',
    consentToMatch: true,
    profileSummary: 'Energetic fitness coach and music lover'
  },
  {
    id: 'user-4',
    name: 'Sagar Kim',
    email: 'Sagar.kim@example.com',
    age: 29,
    profilePic: {
      id: 'profile-4',
      imageUrl: 'https://picsum.photos/seed/sagar-kim/400/400',
      imageHint: 'Profile picture of Sagar Kim',
      description: 'A tech professional with kind eyes'
    },
    preferences: {
      interests: ['Technology', 'Gaming', 'Anime', 'Board Games'],
      hobbies: ['Programming', 'Cosplay', 'Streaming'],
      likesDislikes: 'Loves problem-solving, dislikes toxic gaming communities',
      description: 'A software engineer who loves building things and connecting with fellow gamers. Looking for someone who shares her passion for technology and creativity.'
    },
    interests: ['Technology', 'Gaming', 'Anime', 'Board Games', 'Programming', 'Cosplay', 'Streaming'],
    personalityTraits: ['Intellectual', 'Creative', 'Patient', 'Loyal'],
    relationshipGoals: 'Serious relationship',
    consentToMatch: true,
    profileSummary: 'Tech-savvy gamer seeking genuine connections'
  },
  {
    id: 'user-5',
    name: 'David Thompson',
    email: 'david.thompson@example.com',
    age: 32,
    profilePic: {
      id: 'profile-5',
      imageUrl: 'https://picsum.photos/seed/david-thompson/400/400',
      imageHint: 'Profile picture of David Thompson',
      description: 'A nature lover with a calm demeanor'
    },
    preferences: {
      interests: ['Hiking', 'Photography', 'Environmental Science', 'Volunteering'],
      hobbies: ['Bird Watching', 'Camping', 'Writing'],
      likesDislikes: 'Loves nature conservation, dislikes wasteful practices',
      description: 'An environmental scientist who spends weekends in nature. Passionate about conservation and making a positive impact on the world.'
    },
    interests: ['Hiking', 'Photography', 'Environmental Science', 'Volunteering', 'Bird Watching', 'Camping', 'Writing'],
    personalityTraits: ['Thoughtful', 'Caring', 'Patient', 'Ambitious'],
    relationshipGoals: 'Marriage and long-term commitment',
    consentToMatch: true,
    profileSummary: 'Environmental advocate seeking meaningful partnership'
  },
  {
    id: 'user-6',
    name: 'Zoe Martinez',
    email: 'zoe.martinez@example.com',
    age: 25,
    profilePic: {
      id: 'profile-6',
      imageUrl: 'https://picsum.photos/seed/zoe-martinez/400/400',
      imageHint: 'Profile picture of Zoe Martinez',
      description: 'A vibrant entrepreneur with infectious energy'
    },
    preferences: {
      interests: ['Entrepreneurship', 'Dancing', 'Fashion', 'Networking'],
      hobbies: ['Salsa Dancing', 'Fashion Design', 'Podcasting'],
      likesDislikes: 'Loves meeting new people, dislikes pessimistic attitudes',
      description: 'A young entrepreneur building her fashion startup. Loves connecting with ambitious people and believes in the power of positive thinking.'
    },
    interests: ['Entrepreneurship', 'Dancing', 'Fashion', 'Networking', 'Salsa Dancing', 'Fashion Design', 'Podcasting'],
    personalityTraits: ['Ambitious', 'Social', 'Optimistic', 'Creative'],
    relationshipGoals: 'Professional networking',
    consentToMatch: true,
    profileSummary: 'Ambitious entrepreneur building connections'
  }
];

// Mock chat histories for each user showing their personality and challenges
export const userChatHistories: Record<string, AiChatMessage[]> = {
  'user-2': [
    {
      id: 'msg-emma-1',
      sender: 'user',
      text: "I've been feeling really overwhelmed with my art lately. I love creating, but sometimes I doubt if my work is good enough.",
      timestamp: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'msg-emma-2',
      sender: 'ai',
      text: "It sounds like you're experiencing that vulnerable space that many artists know well. The fact that you care so deeply about your work shows how much it means to you. What specific aspect of your art has been challenging you lately?",
      timestamp: new Date('2024-01-15T10:31:00')
    },
    {
      id: 'msg-emma-3',
      sender: 'user',
      text: "I've been working on a series about sustainable living, but I'm not sure if people will connect with the message. Climate anxiety has been really affecting me.",
      timestamp: new Date('2024-01-15T10:35:00')
    }
  ],
  'user-3': [
    {
      id: 'msg-marcus-1',
      sender: 'user',
      text: "Had an amazing workout today! Finally hit my deadlift PR. But I've been struggling to find people who share my passion for fitness and music.",
      timestamp: new Date('2024-01-16T18:20:00')
    },
    {
      id: 'msg-marcus-2',
      sender: 'ai',
      text: "Congratulations on your PR! That's a huge achievement. It sounds like you're looking for people who understand both sides of your passion - the physical and the creative. What kind of music connections are you hoping to make?",
      timestamp: new Date('2024-01-16T18:21:00')
    },
    {
      id: 'msg-marcus-3',
      sender: 'user',
      text: "I'd love to find someone to collaborate with on music production, or even just jam with. Most of my gym buddies aren't into music, and my music friends think I'm too focused on fitness.",
      timestamp: new Date('2024-01-16T18:25:00')
    }
  ],
  'user-4': [
    {
      id: 'msg-Sagar-1',
      sender: 'user',
      text: "Work has been really stressful lately. I'm leading a big project and feeling the pressure. Gaming used to be my escape, but even that feels overwhelming now.",
      timestamp: new Date('2024-01-17T21:15:00')
    },
    {
      id: 'msg-Sagar-2',
      sender: 'ai',
      text: "It sounds like you're carrying a lot right now. When our usual coping mechanisms start feeling like pressure too, it can be really isolating. What aspects of the project are weighing on you most?",
      timestamp: new Date('2024-01-17T21:16:00')
    },
    {
      id: 'msg-Sagar-3',
      sender: 'user',
      text: "I'm worried about letting my team down. I've always been the reliable one, but this project is more complex than anything I've handled before. I could really use someone who understands the tech world pressures.",
      timestamp: new Date('2024-01-17T21:20:00')
    }
  ],
  'user-5': [
    {
      id: 'msg-david-1',
      sender: 'user',
      text: "Spent the weekend camping and it was exactly what I needed. But coming back to the city always makes me feel disconnected from what really matters.",
      timestamp: new Date('2024-01-18T19:45:00')
    },
    {
      id: 'msg-david-2',
      sender: 'ai',
      text: "That contrast between nature and city life can be really jarring. It sounds like those camping trips help you reconnect with your values. What is it about nature that feels so grounding for you?",
      timestamp: new Date('2024-01-18T19:46:00')
    },
    {
      id: 'msg-david-3',
      sender: 'user',
      text: "In nature, everything has purpose and balance. I wish I could find someone who shares that perspective - someone who cares about our planet's future as much as I do.",
      timestamp: new Date('2024-01-18T19:50:00')
    }
  ],
  'user-6': [
    {
      id: 'msg-zoe-1',
      sender: 'user',
      text: "Networking event tonight was incredible! Met so many inspiring people. But sometimes I wonder if I'm building real connections or just professional ones.",
      timestamp: new Date('2024-01-19T22:30:00')
    },
    {
      id: 'msg-zoe-2',
      sender: 'ai',
      text: "That's such an insightful question. It shows you're thinking deeply about the quality of your connections. What would a 'real' connection look like for you beyond the professional realm?",
      timestamp: new Date('2024-01-19T22:31:00')
    },
    {
      id: 'msg-zoe-3',
      sender: 'user',
      text: "I want to find people who get excited about ideas and dreams, not just business opportunities. Someone who would dance salsa with me at 2am just because the music moves them.",
      timestamp: new Date('2024-01-19T22:35:00')
    }
  ]
};

// --- Enhanced matching utilities ---

// Compute a simple compatibility score based on overlapping interests and traits
const computeCompatibility = (candidate: User, baseInterests: string[] = [], baseTraits: string[] = []): number => {
  const ci = (candidate.interests || []).map(i => i.toLowerCase());
  const ct = (candidate.personalityTraits || []).map(t => t.toLowerCase());

  const bi = (baseInterests || []).map(i => i.toLowerCase());
  const bt = (baseTraits || []).map(t => t.toLowerCase());

  const interestOverlap = bi.filter(i => ci.some(x => x.includes(i) || i.includes(x))).length;
  const traitOverlap = bt.filter(t => ct.some(x => x.includes(t) || t.includes(x))).length;

  // Weight interests higher than traits; cap and scale to 60-98
  const raw = interestOverlap * 7 + traitOverlap * 3;
  const score = Math.max(60, Math.min(98, 60 + raw));
  return score;
};

export type SuggestedUser = {
  user: User;
  reason: string;
  compatibility: number;
};

// Detailed similar users with compatibility and reason
export const findSimilarUsersDetailed = (userInterests: string[] = [], userTraits: string[] = [], limit: number = 3): SuggestedUser[] => {
  return fictionalUsers
    .map(user => {
      const compatibility = computeCompatibility(user, userInterests, userTraits);
      const common = (user.interests || []).filter(interest =>
        userInterests.some(i => i.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(i.toLowerCase()))
      );
      const reason = common.length > 0
        ? `You both share interest${common.length > 1 ? 's' : ''} in ${common.slice(0, 3).join(', ')}`
        : `You seem compatible based on overlapping preferences`;
      return { user, reason, compatibility };
    })
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);
};

// Text-driven suggestions (keywords like stress, hiking, cooking)
export const getSuggestionsForText = (text: string, limit: number = 1): SuggestedUser[] => {
  const lower = (text || '').toLowerCase();
  const keywords: string[] = [];
  if (/(stress|stressed|overwhelming|pressure)/.test(lower)) keywords.push('wellness', 'meditation', 'fitness');
  if (/(hiking|hike|outdoors|trail|nature)/.test(lower)) keywords.push('hiking', 'nature', 'outdoors', 'photography');
  if (/(cooking|recipe|kitchen|food)/.test(lower)) keywords.push('cooking', 'food');

  // If stress-like keywords present, prioritize users with similar challenges too
  let pool: User[] = keywords.length > 0 ? findSimilarUsers(keywords, fictionalUsers.length) : fictionalUsers;
  if (/(stress|stressed|overwhelming|pressure)/.test(lower)) {
    const challengeMatches = findUsersWithSimilarChallenges(['stress', 'pressure']);
    const ids = new Set(challengeMatches.map(u => u.id));
    // Boost: put challenge matches first
    pool = [...challengeMatches, ...pool.filter(u => !ids.has(u.id))];
  }

  const scored: SuggestedUser[] = pool
    .map(user => ({
      user,
      compatibility: computeCompatibility(user, keywords, []),
      reason: keywords.length > 0
        ? `You both share interests around ${keywords.slice(0, 3).join(', ')}`
        : 'You seem compatible based on shared interests'
    }))
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);

  return scored;
};

// Function to get a random fictional user
export const getRandomFictionalUser = (): User => {
  const randomIndex = Math.floor(Math.random() * fictionalUsers.length);
  return fictionalUsers[randomIndex];
};

// Function to find users with similar interests
export const findSimilarUsers = (userInterests: string[], limit: number = 3): User[] => {
  return fictionalUsers
    .map(user => ({
      user,
      commonInterests: user.interests?.filter(interest => 
        userInterests.some(userInt => 
          userInt.toLowerCase().includes(interest.toLowerCase()) || 
          interest.toLowerCase().includes(userInt.toLowerCase())
        )
      ).length || 0
    }))
    .filter(item => item.commonInterests > 0)
    .sort((a, b) => b.commonInterests - a.commonInterests)
    .slice(0, limit)
    .map(item => item.user);
};

// Function to find users with similar challenges based on chat analysis
export const findUsersWithSimilarChallenges = (keywords: string[]): User[] => {
  const challengeKeywords = keywords.map(k => k.toLowerCase());
  
  return fictionalUsers.filter(user => {
    const userChatHistory = userChatHistories[user.id] || [];
    const userMessages = userChatHistory
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.text.toLowerCase())
      .join(' ');
    
    return challengeKeywords.some(keyword => userMessages.includes(keyword));
  });
};
