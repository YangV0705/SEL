import { useEffect, useState } from 'react';

interface WrongEntry {
  missionNumber: number;
  userSQL: string;
  mood?: string;
  timestamp: string;
}

export default function WrongBook() {
  const [entries, setEntries] = useState<WrongEntry[]>([]);

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
        <ul className="space-y-4">
          {entries.map((entry, idx) => (
            <li key={idx} className="border border-yellow-600 p-4 rounded bg-gray-900">
              <p><strong>Mission:</strong> {entry.missionNumber}</p>
              <p><strong>SQL:</strong> <code className="text-cyan-400">{entry.userSQL}</code></p>
              {entry.mood && <p><strong>Mood:</strong> {entry.mood}</p>}
              <p className="text-xs text-gray-500"><strong>Saved on:</strong> {entry.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
