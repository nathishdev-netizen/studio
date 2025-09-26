import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { GROQ_MODELS } from './groq-client';
import { fictionalUsers, findSimilarUsers, findUsersWithSimilarChallenges, userChatHistories } from '@/lib/fictional-users';
import type { User } from '@/lib/types';

// Initialize LangChain with Groq
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: GROQ_MODELS.LLAMA_70B,
  temperature: 0.7,
});

// Companion response flow
const companionPrompt = PromptTemplate.fromTemplate(`
You are Nathish, a warm and empathetic AI companion for PulseChat. You're having a conversation with {userName}.

USER PROFILE:
- Name: {userName}
- Age: {userAge}
- Interests: {userInterests}
- Personality: {userPersonality}
- Relationship Goals: {relationshipGoals}
- Recent Context: {recentContext}

CONVERSATION HISTORY:
{conversationHistory}

USER'S CURRENT MESSAGE: {userMessage}

AVAILABLE CONNECTIONS: {availableConnections}

Respond as Nathish with warmth, empathy, and genuine interest. When the user shares challenges, interests, or experiences, naturally mention if you know someone who might relate. Use phrases like:
- "Actually, I know someone who's been through something similar..."
- "There's someone I think you might connect with about this..."
- "I have a friend who shares your passion for..."

Make it conversational and natural, not pushy. Let them decide if they want to know more.

Response:
`);

const companionChain = RunnableSequence.from([
  companionPrompt,
  llm,
  new StringOutputParser(),
]);

// Connection analysis flow
const connectionAnalysisPrompt = PromptTemplate.fromTemplate(`
Analyze this conversation to determine if the user might benefit from connecting with someone who has similar experiences or interests.

USER PROFILE:
- Interests: {userInterests}
- Current challenges/topics: {currentTopics}

USER'S MESSAGE: {userMessage}
CONVERSATION CONTEXT: {conversationContext}

AVAILABLE USERS TO POTENTIALLY MATCH:
{availableUsers}

Determine if there's a meaningful connection opportunity. Look for:
1. Shared challenges or struggles
2. Common interests or passions
3. Similar life experiences
4. Complementary goals or perspectives

Respond with JSON:
{{
  "shouldSuggestConnection": boolean,
  "matchedUserId": "user-id" or null,
  "matchReason": "explanation of why this connection makes sense",
  "connectionType": "shared_challenge" | "common_interest" | "life_experience" | "complementary_goals",
  "suggestionMessage": "friendly message to present to the user"
}}
`);

const connectionAnalysisChain = RunnableSequence.from([
  connectionAnalysisPrompt,
  llm,
  new StringOutputParser(),
]);

// Mood and topic extraction flow
const moodAnalysisPrompt = PromptTemplate.fromTemplate(`
Analyze the user's message for emotional state and key topics.

USER MESSAGE: {userMessage}

Extract:
1. Current mood/emotional state
2. Key topics or themes mentioned
3. Any challenges or struggles
4. Positive experiences or achievements
5. Interests or activities mentioned

Respond with JSON:
{{
  "mood": "happy|sad|excited|stressed|anxious|content|frustrated|lonely|confident|overwhelmed|neutral",
  "intensity": 1-10,
  "keyTopics": ["array", "of", "topics"],
  "challenges": ["any", "challenges", "mentioned"],
  "achievements": ["positive", "experiences"],
  "interests": ["interests", "mentioned"],
  "needsSupport": boolean,
  "celebrationWorthy": boolean
}}
`);

const moodAnalysisChain = RunnableSequence.from([
  moodAnalysisPrompt,
  llm,
  new StringOutputParser(),
]);

// Main LangChain flow orchestrator
export class CompanionFlowOrchestrator {
  async processUserMessage(
    userMessage: string,
    currentUser: User,
    conversationHistory: string[]
  ) {
    try {
      // Step 1: Analyze mood and extract topics
      const moodAnalysisResult = await moodAnalysisChain.invoke({
        userMessage
      });

      let moodData;
      try {
        moodData = JSON.parse(moodAnalysisResult);
      } catch {
        moodData = {
          mood: 'neutral',
          intensity: 5,
          keyTopics: [],
          challenges: [],
          achievements: [],
          interests: [],
          needsSupport: false,
          celebrationWorthy: false
        };
      }

      // Step 2: Generate companion response
      const companionResponse = await companionChain.invoke({
        userName: currentUser.name,
        userAge: currentUser.age || 'not specified',
        userInterests: currentUser.interests?.join(', ') || 'not specified',
        userPersonality: currentUser.personalityTraits?.join(', ') || 'not specified',
        relationshipGoals: currentUser.relationshipGoals || 'not specified',
        recentContext: moodData.keyTopics.join(', '),
        conversationHistory: conversationHistory.slice(-5).join('\n'),
        userMessage
      });

      // Step 3: Analyze for potential connections (only if user consents)
      let connectionSuggestion: any = null;
      console.log('User consent to match:', currentUser.consentToMatch);
      
      // Force connection suggestion for testing - trigger on keywords
      const triggerWords = ['stress', 'work', 'lonely', 'hobby', 'interest', 'challenge', 'help'];
      const shouldTrigger = triggerWords.some(word => userMessage.toLowerCase().includes(word));
      
      if (currentUser.consentToMatch && (shouldTrigger || Math.random() > 0.7)) {
        // Find potential matches based on interests and challenges
        const interestMatches = findSimilarUsers(currentUser.interests || [], 3);
        const challengeMatches = findUsersWithSimilarChallenges(moodData.challenges);
        
        const allPotentialMatches = [...interestMatches, ...challengeMatches]
          .filter((user, index, self) => 
            index === self.findIndex(u => u.id === user.id)
          )
          .slice(0, 3);

        if (allPotentialMatches.length > 0) {
          // For testing, create a simple connection suggestion
          const randomMatch = allPotentialMatches[Math.floor(Math.random() * allPotentialMatches.length)];
          
          connectionSuggestion = {
            shouldSuggestConnection: true,
            matchedUserId: randomMatch.id,
            matchedUser: randomMatch,
            reason: `You both share interests in ${randomMatch.interests?.slice(0, 2).join(' and ')}`,
            compatibilityScore: Math.floor(Math.random() * 30) + 70,
            message: `I found someone who might relate to what you're sharing!`
          };
          
          console.log('Created connection suggestion:', connectionSuggestion);
        } else {
          console.log('No potential matches found');
        }
      }

      return {
        response: companionResponse,
        moodAnalysis: moodData,
        connectionSuggestion,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in companion flow:', error);
      return {
        response: "I'm here for you, though I'm having some technical difficulties right now. What's on your mind?",
        moodAnalysis: {
          mood: 'neutral',
          intensity: 5,
          keyTopics: [],
          challenges: [],
          achievements: [],
          interests: [],
          needsSupport: false,
          celebrationWorthy: false
        },
        connectionSuggestion: null,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Generate personalized conversation starters
  async generateConversationStarters(user: User): Promise<string[]> {
    const starterPrompt = PromptTemplate.fromTemplate(`
Generate 3 personalized conversation starters for {userName} based on their profile:

Interests: {userInterests}
Personality: {userPersonality}
Relationship Goals: {relationshipGoals}

Make them engaging, personal, and likely to lead to meaningful conversation about their interests or current life experiences.

Respond with JSON array: ["starter1", "starter2", "starter3"]
    `);

    const starterChain = RunnableSequence.from([
      starterPrompt,
      llm,
      new StringOutputParser(),
    ]);

    try {
      const result = await starterChain.invoke({
        userName: user.name,
        userInterests: user.interests?.join(', ') || 'general topics',
        userPersonality: user.personalityTraits?.join(', ') || 'friendly',
        relationshipGoals: user.relationshipGoals || 'meaningful connections'
      });

      const starters = JSON.parse(result);
      return Array.isArray(starters) ? starters : [];
    } catch (error) {
      console.error('Error generating conversation starters:', error);
      return [
        "How has your day been treating you?",
        "What's something that made you smile recently?",
        "Tell me about something you're excited about lately."
      ];
    }
  }
}

// Export singleton instance
export const companionFlow = new CompanionFlowOrchestrator();
