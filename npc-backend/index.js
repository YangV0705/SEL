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
  const { userSQL } = req.body;

  if (!userSQL) {
    return res.status(400).json({ error: 'Missing userSQL in request body' });
  }

  const prompt = `
You are three AI assistants helping a user learn SQL in a game. The user submitted this SQL query:

${userSQL}

Please respond as three distinct characters:

1. Cipher (Technical Assistant): Provide detailed feedback on the SQL syntax and logic.
2. Zen (Emotional Coach): Provide emotional support and encouragement.
3. Phoebe (Game Guide): Provide progress feedback and motivating words.

Respond in a JSON format like this:

{
  "Cipher": "Your feedback here",
  "Zen": "Your feedback here",
  "Phoebe": "Your feedback here"
}
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
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens_to_sample: 300,
        temperature: 0.7
      }),
    });

    const data = await response.json();

    // Anthropic Chat API returns data.choices[0].message.content
    const text = data.choices?.[0]?.message?.content || "";

    let npcFeedback;
    try {
      npcFeedback = JSON.parse(text);
    } catch (err) {
      npcFeedback = { error: "Failed to parse LLM response as JSON", rawResponse: text };
    }

    res.json({ npcFeedback });
  } catch (error) {
    console.error("Error calling LLM API:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
