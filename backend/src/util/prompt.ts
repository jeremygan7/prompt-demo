import OpenAI from 'openai';

// Init OpenAI connection
const openai = new OpenAI();

/**
 * Utility to safely parse OpenAI JSON, removing code blocks if present.
 */
function parseOpenAIJson(raw: string): { score: number; intent: string } {
  let content = raw.trim();

  // Remove Markdown code block (```json ... ```)
  if (content.startsWith('```json')) {
    content = content.replace(/```json\s*([\s\S]*?)\s*```/, '$1').trim();
  } else if (content.startsWith('```')) {
    content = content.replace(/```([\s\S]*?)```/, '$1').trim();
  }

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to parse OpenAI response as JSON:', content);
    throw new Error('OpenAI did not return valid JSON. Full response: ' + content);
  }
}

export async function LeadScore(
  keywords: string[]
): Promise<{ score: number; intent: string; }> {
  const prompt = `
You are an AI assistant for a sales team. Your job is to evaluate potential customers ("leads") and decide how likely they are to purchase our product.

A lead is a person who has shown interest by interacting with our website, marketing, or sales team.

Given a list of keywords representing the lead's interests or actions, do the following:

1. Assign a "score" from 0 to 100 (higher means more likely to convert to a customer).
2. Classify "intent" as one of: High, Medium, or Low.

Good keywords include things like: pricing, demo, free trial, signup, contact, contact sales, size, colors, warranty, return policy
Bad or neutral keywords include: blog, about us, careers, privacy policy, unsubscribe, terms.

Input:
- Captured Keywords: ${keywords.join(', ')}

Output:
Respond with only a JSON object, for example:
{"score":88,"intent":"High"}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0,
    messages: [
      { role: 'system', content: 'You are an AI assistant that scores sales leads.' },
      { role: 'user', content: prompt }
    ],
  });

  // Always parse safely using the utility
  const content = completion.choices[0].message.content ?? '';
  try {
    const { score, intent } = parseOpenAIJson(content);
    return { score, intent };
  } catch (err) {
    console.error('OpenAI response was not valid JSON:', content);
    throw new Error('OpenAI did not return valid JSON. Full response: ' + content);
  }
}