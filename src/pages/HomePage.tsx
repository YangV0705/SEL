import { useNavigate } from 'react-router-dom';
import cyberBg from '../assets/cyberworld.png';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black font-mono text-center p-8">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${cyberBg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-cyan-300 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-300 font-jetbrains">
          ⚠️ WARNING! In a dystopian future where AI hackers threaten digital infrastructure, you are humanity's last line of defense. Solve 10 strategic SQL challenges to trace and stop a rogue Hacker's cyber-attacks.
        </h1>
        <button
          onClick={() => navigate('/intro')}
          className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          Enter
        </button>
      </div>
    </div>
  );
}



