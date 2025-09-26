import { NextResponse } from 'next/server';
import { groq, GROQ_MODELS } from '@/ai/groq-client';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, user, conversationHistory } = body || {};

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid request: message is required' }, { status: 400 });
    }

    // Fallback if GROQ_API_KEY is not configured
    if (!process.env.GROQ_API_KEY) {
      const fallback = `I don't have access to the AI service right now, but I'm here with you. You said: "${message}". Want to tell me a bit more about how you're feeling?`;
      return NextResponse.json({ response: fallback, conversationStarters: [
        "How has your day been treating you?",
        "What's something that made you smile recently?",
        "Tell me about something you're excited about lately."
      ] });
    }

    // Prepare messages for the model
    const systemPrompt = `You are Nathish, a warm, supportive AI companion in a dating app named PulseChat.
- Be empathetic, concise, and non-judgmental.
- Offer gentle follow-up questions.
- If user mentions stress, loneliness, or specific interests, acknowledge and suggest helpful next steps.
- Never make medical claims. Avoid prescriptive therapy language.
- Keep replies under 120 words unless user asks for details.`;

    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        if (!msg || typeof msg !== 'object') continue;
        const role = msg.sender === 'ai' ? 'assistant' : 'user';
        if (typeof msg.text === 'string' && msg.text.trim().length > 0) {
          chatMessages.push({ role, content: msg.text });
        }
      }
    }

    chatMessages.push({ role: 'user', content: message });

    let text = "";
    try {
      const completion = await groq.chat.completions.create({
        model: GROQ_MODELS.LLAMA_8B,
        messages: chatMessages,
        temperature: 0.6,
        max_tokens: 512,
      });
      text = completion?.choices?.[0]?.message?.content?.trim() || "";
    } catch (modelErr) {
      console.error('GROQ call failed:', modelErr);
      text = "I can't reach the AI service right now, but I'm here with you. Want to tell me a bit more?";
    }

    if (!text) {
      text = "I'm here and listening. Tell me more about what's on your mind.";
    }

    return NextResponse.json({
      response: text,
      conversationStarters: [
        "How has your day been treating you?",
        "What's something that made you smile recently?",
        "Tell me about something you're excited about lately."
      ],
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    const fallback = "I'm having a little trouble, but I'm here and listening. Could you share a bit more about that?";
    return NextResponse.json({ response: fallback, conversationStarters: [
      "How has your day been treating you?",
      "What's something that made you smile recently?",
      "Tell me about something you're excited about lately."
    ]});
  }
}
