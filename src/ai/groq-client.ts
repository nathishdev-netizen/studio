import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export { groq };

// Available Groq models
export const GROQ_MODELS = {
  LLAMA_70B: 'llama3-70b-8192',
  LLAMA_8B: 'openai/gpt-oss-120b',
  MIXTRAL: 'mixtral-8x7b-32768',
  GEMMA_7B: 'gemma-7b-it',
} as const;

export type GroqModel = typeof GROQ_MODELS[keyof typeof GROQ_MODELS];
