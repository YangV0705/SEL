import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RewardPage() {
  const navigate = useNavigate();
  const totalMissions = 10;

  const [points, setPoints] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState('Phoebe');

  const encouragements = {
    Phoebe: "You're doing amazing. Keep going, agent!",
    Zen: "Breathe in... breathe out... You’ve come far. Stay steady.",
    Cipher: "You cracked the logic—stay sharp and finish strong!",
  };

  useEffect(() => {
    const storedPoints = Number(localStorage.getItem('points')) || 0;
    setPoints(storedPoints);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const updatedPoints = Number(localStorage.getItem('points')) || 0;
        setPoints(updatedPoints);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const badges = Math.floor(points / 2);
  const displayedBadges = Math.min(badges, 5);
  const allCompleted = points >= totalMissions;

  return (
    <div className="bg-black text-green-200 min-h-screen font-mono p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-yellow-300 mb-4">🎖️ Your Reward Status</h1>

        <p className="text-lg text-cyan-300 mb-6">
          You've completed <span className="font-bold text-white">{points}</span> out of {totalMissions} missions.
        </p>

        <div className="bg-gray-900 border border-cyan-600 rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl text-purple-300 font-bold mb-2">🏅 Badges Earned</h2>
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(displayedBadges)].map((_, i) => (
              <img
                key={`earned-${i}`}
                src="/badge-colored.jpg"
                alt="Earned Badge"
                className="w-10 h-10"
              />
            ))}
            {[...Array(5 - displayedBadges)].map((_, i) => (
              <img
                key={`empty-${i}`}
                src="/badge-grey.png"
                alt="Empty Badge"
                className="w-10 h-10 opacity-30"
              />
            ))}
          </div>
        </div>

        {allCompleted && (
          <div className="bg-green-800 border border-green-400 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-green-200 mb-2">🎉 Congratulations!</h2>
            <p className="text-green-100">You've completed Level 1 of the Hacker Challenge!</p>
            <p className="text-green-100">Get ready for the next 10 missions in Level 2.</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-white mb-1">Choose your supporter:</label>
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md"
          >
            <option value="Phoebe">Phoebe (Motivation)</option>
            <option value="Zen">Zen (Emotional Resilience)</option>
            <option value="Cipher">Cipher (Tech Encouragement)</option>
          </select>
        </div>

        <p className="italic text-sm text-pink-300 mt-4">
          🧚 {selectedCharacter} says: "{encouragements[selectedCharacter]}"
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md"
          >
            ⬅️ Back to Home
          </button>
          <button
            onClick={() => {
                const lastMission = Number(localStorage.getItem('lastMissionNumber')) || 1;
                const nextMission = Math.min(lastMission + 1, totalMissions);
                navigate(`/mission${nextMission}`);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full shadow-md"
            >
            🚀 Continue Mission
            </button>
        </div>
      </div>
    </div>
  );
}
