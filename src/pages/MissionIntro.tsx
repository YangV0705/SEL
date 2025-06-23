import { useNavigate } from 'react-router-dom';

export default function MissionIntro() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-green-200 min-h-screen font-mono p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gray-900 rounded-lg shadow-lg border border-cyan-600 p-6 text-left mb-10">
          <h2 className="text-xl text-yellow-300 font-bold mb-2">🎯 Mission</h2>
          <p className="mb-2 text-sm">
            Nova, your mission commander, will brief you on each challenge. SQL queries are your weapon.
          </p>
          <p className="text-sm">
            Failures will be met with support and hints from your AI allies:
          </p>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li><span className="text-blue-400 font-semibold">Cipher</span>: Offers technical SQL hints.</li>
            <li><span className="text-purple-400 font-semibold">Zen</span>: Reflects on your emotional state and mindset.</li>
            <li><span className="text-pink-400 font-semibold">Phoebe</span>: Tracks your progress and motivates you to continue.</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/mission1')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          I'm Ready. Start Mission 1
        </button>
      </div>
    </div>
  );
}
