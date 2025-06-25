# SQL Cyber Missions

An immersive interactive educational game teaching SQL through a cyberpunk storyline.

## 🎮 Project Overview

Players solve a series of SQL-based missions to track down a rogue hacker and protect the digital world. The game combines storytelling, tasks, and dynamic NPC feedback to make learning SQL engaging and immersive.


## Characters
- **Cipher** – Technical assistant offering SQL hints.
- **Zen** – Provides emotional guidance and motivation.
- **Phoebe** – Tracks your progress and gives feedback.

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
4. Configure backend environment variables by creating a .env file in the backend folder:
```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=4000
```
5. Start the backend server:
```bash
node index.js
```
6. Start the game:
```bash
npm run dev
```

##  Game Flow
- Start on the **Home Page** to learn the mission context
- Each mission involves writing an SQL query to solve a problem
- If incorrect:
  - Cipher provides technical hints
  - Zen offers emotional support
  - Phoebe tracks your attempts and gives motivational feedback
- Correct solutions reward points and unlock new missions

## Tech Stack
**Frontend** - React + TypeScript + TailwindCSS + React Router + Framer Motion 
**Backend** - Node.js + Express + Anthropic Claude API

##  In Progress
- complete missions 3 through 10

- emotion recognition to drive NPC feedback

- Mistake review page

## Demo Link
- https://sql-challenge-game.vercel.app/

