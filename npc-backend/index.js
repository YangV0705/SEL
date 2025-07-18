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
    return res.status(200).json({
      npcFeedback: {
        Cipher: '❌ Cannot analyze: SQL input is missing.',
        Zen: '🌱 It’s okay to pause. Ready when you are!',
        Phoebe: '🚫 No mission yet. Try typing something first!',
      }
    });
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
  - Use emojis, gaming metaphors (e.g., “mission failed”, “XP unlocked”, “try again hero”), and lighthearted tone.  
  - Avoid repeating Cipher's technical feedback.

  🧪 Instructions:

  - Compare the user's SQL with the correct SQL. Ignore case, whitespace, or formatting differences.
  - If user SQL is correct:
    - Cipher should briefly affirm the technical correctness (e.g., “Correct use of WHERE clause.”).
    - Zen should express gentle emotional pride (e.g., “You're growing stronger every line!”).
    - Phoebe should give a celebratory, fun message (e.g., “Mission complete! XP unlocked! 🎉”).

  - If incorrect:
    - Cipher should clearly point out the issue (e.g., “Missing FROM clause.” or “The condition logic is reversed.”).
    - Zen must give emotional support and not remain silent.
    - Phoebe should be playful and encouraging, but avoid repeating technical details.

  💡 Output strictly in this JSON format:

  {
    "Cipher": "<Cipher's SQL-specific feedback>",
    "Zen": "<Zen's emotional encouragement>",
    "Phoebe": "<Phoebe's game-style comment>"
  }

  Do not include any explanations or extra commentary. Now generate the feedback:

  User SQL:
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
