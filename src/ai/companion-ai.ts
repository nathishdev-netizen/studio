import { groq, GROQ_MODELS } from './groq-client';
import { 
  generateContextualPrompt, 
  CONNECTION_SUGGESTION_PROMPT, 
  MOOD_ANALYSIS_PROMPT,
  CONVERSATION_MEMORY_PROMPT,
  type CompanionContext 
} from './companion-prompts';
import type { User, AiChatMessage } from '@/lib/types';

export class CompanionAI {
  private model: string = GROQ_MODELS.LLAMA_70B;
  
  constructor(model?: string) {
    if (model) this.model = model;
  }

  async generateResponse(
    userMessage: string, 
    context: CompanionContext
  ): Promise<string> {
    try {
      const prompt = generateContextualPrompt(context, userMessage);
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false,
      });

      return completion.choices[0]?.message?.content || "I'm here for you. Tell me more about what's on your mind.";
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm having trouble connecting right now, but I'm still here to listen. What's going on?";
    }
  }

  async analyzeForConnections(
    userMessage: string,
    userProfile: User,
    conversationContext: string[]
  ): Promise<{
    suggestConnection: boolean;
    reason?: string;
    connectionType?: string;
    message?: string;
  }> {
    try {
      const contextInfo = `
USER PROFILE: ${JSON.stringify(userProfile)}
RECENT CONVERSATION: ${conversationContext.slice(-3).join('\n')}
CURRENT MESSAGE: ${userMessage}
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: CONNECTION_SUGGESTION_PROMPT
          },
          {
            role: "user",
            content: contextInfo
          }
        ],
        model: this.model,
        temperature: 0.3,
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          return JSON.parse(response);
        } catch {
          return { suggestConnection: false };
        }
      }
      
      return { suggestConnection: false };
    } catch (error) {
      console.error('Error analyzing for connections:', error);
      return { suggestConnection: false };
    }
  }

  async analyzeMood(userMessage: string): Promise<{
    mood: string;
    intensity: number;
    keywords: string[];
    supportNeeded: boolean;
    celebrationWorthy: boolean;
  }> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: MOOD_ANALYSIS_PROMPT
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        model: this.model,
        temperature: 0.2,
        max_tokens: 200,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          return JSON.parse(response);
        } catch {
          return {
            mood: 'neutral',
            intensity: 5,
            keywords: [],
            supportNeeded: false,
            celebrationWorthy: false
          };
        }
      }
      
      return {
        mood: 'neutral',
        intensity: 5,
        keywords: [],
        supportNeeded: false,
        celebrationWorthy: false
      };
    } catch (error) {
      console.error('Error analyzing mood:', error);
      return {
        mood: 'neutral',
        intensity: 5,
        keywords: [],
        supportNeeded: false,
        celebrationWorthy: false
      };
    }
  }

  async extractConversationMemory(
    messages: AiChatMessage[]
  ): Promise<{
    keyEvents: string[];
    interests: string[];
    goals: string[];
    challenges: string[];
    achievements: string[];
    preferences: string[];
    relationshipUpdates: string[];
  }> {
    try {
      const conversationText = messages
        .filter(msg => msg.sender === 'user')
        .map(msg => msg.text)
        .join('\n');

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: CONVERSATION_MEMORY_PROMPT
          },
          {
            role: "user",
            content: conversationText
          }
        ],
        model: this.model,
        temperature: 0.1,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          return JSON.parse(response);
        } catch {
          return {
            keyEvents: [],
            interests: [],
            goals: [],
            challenges: [],
            achievements: [],
            preferences: [],
            relationshipUpdates: []
          };
        }
      }
      
      return {
        keyEvents: [],
        interests: [],
        goals: [],
        challenges: [],
        achievements: [],
        preferences: [],
        relationshipUpdates: []
      };
    } catch (error) {
      console.error('Error extracting conversation memory:', error);
      return {
        keyEvents: [],
        interests: [],
        goals: [],
        challenges: [],
        achievements: [],
        preferences: [],
        relationshipUpdates: []
      };
    }
  }

  async generateConversationStarters(userProfile: User): Promise<string[]> {
    try {
      const prompt = `Generate 3 personalized conversation starters for a user with this profile:
Name: ${userProfile.name}
Interests: ${userProfile.interests?.join(', ') || 'General'}
Personality: ${userProfile.personalityTraits?.join(', ') || 'Friendly'}

Make them engaging, personal, and likely to lead to meaningful conversation. Format as a JSON array of strings.`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a conversation expert. Generate engaging, personalized conversation starters."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.8,
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          const starters = JSON.parse(response);
          return Array.isArray(starters) ? starters : [];
        } catch {
          return [];
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error generating conversation starters:', error);
      return [];
    }
  }
}

// Export singleton instance
export const companionAI = new CompanionAI();
