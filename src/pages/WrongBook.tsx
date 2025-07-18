import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WrongEntry {
  missionNumber: number;
  userSQL: string;
  correctSQL: string;
  story: string;
  nova: string;
  userMood?: string;
  timestamp: string;
}

export default function WrongBook() {
  const [entries, setEntries] = useState<WrongEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('wrongBook');
    if (data) {
      setEntries(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">📘 Wrong Book</h1>

      {entries.length === 0 ? (
        <p className="text-gray-400">No saved mistakes yet.</p>
      ) : (
        <ul className="space-y-6">
          {entries.map((entry, idx) => (
            <li key={idx} className="border border-yellow-600 p-4 rounded bg-gray-900">
              <p><strong>Mission:</strong> {entry.missionNumber}</p>
              <p><strong>Story:</strong> {entry.story}</p>
              <p><strong>Nova Prompt:</strong> {entry.nova}</p>
              <p><strong>Your SQL:</strong> <code className="text-cyan-400">{entry.userSQL}</code></p>
              <p><strong>Correct SQL:</strong> <code className="text-green-400">{entry.correctSQL}</code></p>
              {entry.userMood && (
                <p><strong>Your Mood:</strong> <span className="text-pink-400">{entry.userMood}</span></p>
              )}
              <p className="text-xs text-gray-500"><strong>Saved on:</strong> {new Date(entry.timestamp).toLocaleString()}</p>

              {/* Back button */}
              <button
                onClick={() => navigate(`/mission${entry.missionNumber}`)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                🔙 Back to Mission {entry.missionNumber}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
