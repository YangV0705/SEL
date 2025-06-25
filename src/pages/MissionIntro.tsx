import { useNavigate } from 'react-router-dom';

export default function MissionIntro() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-green-200 min-h-screen font-mono p-8">
      <div className="max-w-4xl mx-auto text-center">

        {/* Mission Title + Description */}
        <h1 className="text-4xl font-extrabold text-green-400 mb-4">SQL Cyber Missions</h1>
        <p className="text-lg text-cyan-300 mb-6">
          In a dystopian future where AI hackers threaten digital infrastructure,
          <span className="text-white font-bold"> you </span>
          are humanity's last line of defense. Solve 10 strategic SQL challenges to trace and stop a rogue Hacker's cyber-attacks.
        </p >

        {/* Mission Intro Box */}
        <div className="bg-gray-900 rounded-lg shadow-lg border border-cyan-600 p-6 text-left mb-10">
          <h2 className="text-xl text-yellow-300 font-bold mb-2">🎯 Mission</h2>
          <p className="mb-2 text-sm">
            Nova, your mission commander, will brief you on each challenge. SQL queries are your weapon.
          </p >
          <p className="text-sm">
            Failures will be met with support and hints from your AI allies:
          </p >
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li><span className="text-blue-400 font-semibold">Cipher</span>: Offers technical SQL hints.</li>
            <li><span className="text-purple-400 font-semibold">Zen</span>: Reflects on your emotional state and mindset.</li>
            <li><span className="text-pink-400 font-semibold">Phoebe</span>: Tracks your progress and motivates you to continue.</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => navigate('/mission1')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            🔁 I'm Ready. Start Mission 1
          </button>

          <button
            onClick={() => {
              const lastMission = Number(localStorage.getItem('lastMissionNumber')) || 1;
              navigate(`/mission${lastMission}`);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            🚀 Resume Mission {localStorage.getItem('lastMissionNumber') || 1}
          </button>
        </div>

        {/* Phoebe Message */}
        <p className="mt-6 text-sm text-pink-300 italic">
          🧚 Phoebe says: "Your journey begins now. Stay focused, agent!"
        </p >
      </div>
    </div>
  );
}