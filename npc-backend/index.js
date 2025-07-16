import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('NPC Backend is running. Use POST /api/npc-feedback to get NPC responses.');
});

app.post('/api/npc-feedback', async (req, res) => {
  const { userSQL, correctSQL } = req.body;

  if (!userSQL || !correctSQL) {
    return res.status(400).json({ error: 'Missing userSQL or correctSQL in request body' });
  }

  const prompt = `
  You are three AI NPCs helping a player learn SQL in a gamified educational mission. Based on the user's SQL input, generate character-specific feedback.
  
  Instructions:
  - Compare user's SQL to the correct SQL (ignoring case and whitespace differences).
  - If it is correct:
    - Return positive feedback from each character.
  - If it is incorrect:
    - Return constructive feedback from each character encouraging improvement.
  - Important: Zen (Emotional Coach) should always provide some feedback when the user's SQL is incorrect, even if there is no syntax error.
  
  Characters:
  1. Cipher (Technical Assistant): Provide technical SQL-specific feedback (syntax, logic).
  2. Zen (Emotional Coach): Provide motivation, encouragement, and emotional support. Always give feedback when the user's SQL is incorrect.
  3. Phoebe (Game Guide): Provide fun, gamified feedback and celebrate progress.
  
  Respond in ONLY this JSON format with all 3 keys ALWAYS present (even if feedback is short). No other text. Example:
  
  {
    "Cipher": "Great use of SELECT and WHERE clauses!",
    "Zen": "You're improving every step! Stay focused!",
    "Phoebe": "Mission complete! You've unlocked the next challenge!"
  }
  
  Now generate your feedback:
  
  User's SQL:
  ${userSQL}
  
  Correct SQL:
  ${correctSQL}
  `;

  try {
    const response = await fetch('https://api.anthropic.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY,
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.9
      }),
    });

    const data = await response.json();

    let rawText = data?.choices?.[0]?.message?.content?.trim() || '';

    console.log('Claude raw content:', rawText);

    if (rawText.startsWith('```') && rawText.endsWith('```')) {
      rawText = rawText.slice(3, -3).trim();
    }

    let npcFeedback;

    try {
      npcFeedback = JSON.parse(rawText);
    } catch (err) {
      console.error('JSON parse error:', err);
      npcFeedback = {
        Cipher: 'Could not parse feedback, please try again.',
        Zen: 'Keep calm, the system had trouble understanding your query.',
        Phoebe: 'Oops! Something went wrong, try again later.'
      };
    }

    npcFeedback.Cipher = npcFeedback.Cipher?.trim() || '';
    npcFeedback.Zen = npcFeedback.Zen?.trim() || '';
    npcFeedback.Phoebe = npcFeedback.Phoebe?.trim() || '';

    return res.status(200).json({ npcFeedback });
  } catch (error) {
    console.error("Error calling LLM API:", error);

    return res.status(500).json({
      npcFeedback: {
        Cipher: '❌ Failed to reach NPC server.',
        Zen: '🧘 Take a deep breath, the system is retrying...',
        Phoebe: '⚠️ Network glitch! Try again soon.',
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ NPC Backend listening on http://localhost:${PORT}`);
});
