// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="text-green-300 font-mono p-6">
      <div className="border border-cyan-500 bg-black p-6 rounded">
        <h1 className="text-2xl font-bold text-cyan-400 mb-4">🧠 Welcome, Agent</h1>
        <p className="mb-2">
          In this <span className="text-pink-400">dystopian future</span>, a rogue <span className="text-red-400">Hacker</span> is sabotaging digital systems.
          Complete <span className="text-yellow-400">10 SQL missions</span> to trace their actions and restore security.
        </p>
        <p className="mb-4">
          Nova will guide you, assisted by Cipher (blue), Zen (purple), and Phoebe (pink).
        </p>
        <button
          onClick={() => navigate('/mission1')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ✅ I’m Ready – Start Mission 1
        </button>
      </div>
    </div>
  );
}
