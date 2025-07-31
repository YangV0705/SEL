# SQL Cyber Missions

A gamified SQL learning platform with emotionally responsive NPCs powered by Claude 3 Haiku and SEL principles.

## 🎮 Project Overview

SQL Cyber Missions is an interactive educational game that teaches SQL through a hacker-themed storyline.  
Learners solve a series of SQL-based missions to track down a rogue hacker and protect digital infrastructure.
The platform integrates **Social and Emotional Learning (SEL)** to reduce frustration and increase engagement.  
Learners receive personalized support from three emotionally intelligent NPCs, powered by Claude 3 Haiku.



## Characters
- **Cipher** – Offers SQL syntax and logic hints when an incorrect query is submitted.
- **Zen** – Provides emotional support when frustration is detected (e.g., repeated deletions or long task time).
- **Phoebe** – Offers praise and encouragement when effort is detected or after a blank/halted attempt.

## How to Play
1. Clone the repository:
```bash
git clone https://github.com/Astrid-weiwei/sql-challenge-game.git
cd sql-challenge-game
```
2. Install frontend dependencies:
```bash
npm install
```
3. Install backend dependencies:
```bash
cd ../npc_backend
npm install
```
4. Create a `.env` file inside `npc_backend`:
```bash
PORT=4000
MONGODB_URI=your_mongo_uri_here
ANTHROPIC_API_KEY=your_claude_api_key_here
```
5. Start the backend server:
```bash
node index.js
```
6. Start the game:
```bash
npm run dev
```

## 🧠 Game Flow  
- Start at the Home Page and begin the narrative
- Complete 10 missions by solving SQL challenges
- Real-time NPC feedback responds to your progress:
  - Incorrect query → Cipher offers help
  - Signs of confusion/frustration → Zen offers support
  - Blank queries or demotivation → Phoebe offers encouragement
- Save mistakes + emotional reflections in the **WrongBook**
- Use the **WrongBook** to review past mistakes and see the correct SQL solution for each mission.
- Earn badges to unlock story progression

## Tech Stack
**Frontend**: React, TypeScript, TailwindCSS, React Router, Framer Motion  
**Backend**: Node.js, Express  
**Database**: MongoDB Atlas  
**LLM Integration**: Claude 3 Haiku (Anthropic API)

## 📦 Features  

- Emotionally supportive feedback from 3 NPCs  
- Claude LLM-powered dialogue generation  
- Real-time learner state detection (delay, blank, repeat)  
- **WrongBook** mistake review + emotion logging  
- Persistent progress storage across devices

## 🧭 Future Work  

- Add facial emotion recognition for more adaptive NPC support  
- Instructor dashboard for tracking class-wide progress  
- Expand to other domains (e.g., Python, Data Science)

## Demo Link
- https://sql-challenge-game.netlify.app/

