import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_API_KEY,
});

function cleanResponse(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-R1:novita', // version exacte ici
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = completion.choices[0]?.message?.content ?? "Réponse vide";
    const text = cleanResponse(rawText);

    res.status(200).json({ text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Erreur Hugging Face Router' });
  }
}
