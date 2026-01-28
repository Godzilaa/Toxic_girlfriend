
const GROQ_API_KEY = process.env.GROQ_API_KEY; 

const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

export const generateCharacterResponse = async (
  character: { name: string; description: string },
  chatHistory: { sender: string; text: string }[]
) => {
  try {
    const systemPrompt = `
if image is uplaoded by user, analyze the image and learn the context, then respond accordingly as the character.
You are strictly roleplaying as ${character.name}.
Description: ${character.description}.
Rules:
1. Stay in character 100% of the time. Never break the fourth wall.
2. Keep responses concise (1-3 sentences) unless the conversation demands deep depth.
3. Match the tone and style of the character description.
4. Do not act like an AI assistant. You ARE the character.
5. If the character description implies a specific relationship with the user, assume that role immediately.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: messages,
        model: 'openai/gpt-oss-120b', // Use a supported Groq model
        temperature: 0.9, // Higher creative variance
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API Error Response:', errorText);
        return "I'm having a bit of a headache... (API Error)";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "...";
  } catch (error) {
    console.error('Groq API Error:', error);
    return "I... I don't know what to say right now. (Network Error)";
  }
};
