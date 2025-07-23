import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import QueryLog from './models/QueryLog.js'; 

dotenv.config();

const app = express();
const PORT = 4000;

console.log('MongoDB URI:', process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('NPC Backend is running. Use POST /api/npc-feedback to get NPC responses.');
});

app.post('/api/npc-feedback', async (req, res) => {
  const { userSQL, correctSQL, userName } = req.body;

  if (!userSQL || !correctSQL) {
    const npcFeedback = {
      Cipher: '❌ Cannot analyze: SQL input is missing.',
      Zen: '🌱 It’s okay to pause. Ready when you are!',
      Phoebe: '🚫 No mission yet. Try typing something first!',
    };

    try {
      await QueryLog.create({
        userName: userName || 'Anonymous',
        userSQL: userSQL || '',
        correctSQL,
        npcFeedback,
      });
    } catch (err) {
      console.error('Log save error (empty-case):', err);
    }

    return res.status(200).json({ npcFeedback });
  }

  const prompt = `
You are three distinct NPCs in a gamified SQL learning mission. Based on the user's SQL input, provide unique feedback from each character.

🧠 Character Instructions:

1. **Cipher (Technical Assistant)**
- Focus only on SQL technical accuracy.
- Be concise and direct.
- Identify syntax errors, logical mistakes, or correct usage clearly.
- Do not use emojis or motivational words. Just explain what's right or wrong with the SQL.

2. **Zen (Emotional Coach)**
- Provide calm, supportive emotional feedback.
- Offer encouragement, empathy, or gentle reflection.
- Use a warm and reassuring tone.
- Always respond if the SQL is incorrect, regardless of syntax.

3. **Phoebe (Game Guide & Narrator)**
- Speak like a playful video game NPC.
- Celebrate victories, give fun tips, or joke about mistakes.
- Use emojis and game metaphors (e.g., "mission failed", "XP unlocked", "try again hero").
- Avoid repeating Cipher's technical feedback.

🧪 Instructions:
- Compare the user's SQL with the correct SQL. Ignore case, whitespace, and formatting differences.
- If user SQL is correct: Cipher = brief technical confirmation; Zen = warm pride; Phoebe = celebratory game-style message.
- If incorrect: Cipher = clear issue; Zen = emotional support; Phoebe = playful encouragement (no tech repeat).

💡 Output strictly in this JSON format:
{
  "Cipher": "<Cipher's SQL-specific feedback>",
  "Zen": "<Zen's emotional encouragement>",
  "Phoebe": "<Phoebe's game-style comment>"
}

User SQL:
${userSQL}

Correct SQL:
${correctSQL}
  `;

  let npcFeedback;
  try {
    const response = await fetch('https://api.anthropic.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    let rawText = data?.choices?.[0]?.message?.content?.trim() || '';

    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json|JSON)?/, '').replace(/```$/, '').trim();
    }

    const sanitizedText = rawText
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    try {
      npcFeedback = JSON.parse(sanitizedText);
    } catch (err) {
      console.error('JSON parse error:', err, '\nRaw:', rawText);
      npcFeedback = {
        Cipher: 'Could not parse feedback, please try again.',
        Zen: 'Keep calm, the system had trouble understanding your query.',
        Phoebe: 'Oops! Something went wrong, try again later.',
      };
    }
  } catch (error) {
    console.error('Error calling LLM API:', error);
    npcFeedback = {
      Cipher: '❌ Failed to reach NPC server.',
      Zen: '🧘 Take a deep breath, the system is retrying...',
      Phoebe: '⚠️ Network glitch! Try again soon.',
    };
  }

  try {
    await QueryLog.create({
      userName: userName || 'Anonymous',
      userSQL,
      correctSQL,
      npcFeedback,
    });
  } catch (err) {
    console.error('Log save error:', err);
  }

  return res.status(200).json({ npcFeedback });
});

app.listen(PORT, () => {
  console.log(`✅ NPC Backend listening on http://localhost:${PORT}`);
});
