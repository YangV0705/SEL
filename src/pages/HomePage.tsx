import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import cyberBg from '../assets/cyberworld.png';

export default function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleEnter = () => {
    if (userName.trim()) {
      localStorage.setItem('userName', userName.trim());
      navigate('/intro');
    } else {
      alert('Please enter your name before entering the game.');
    }
  };

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
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-300 font-jetbrains mb-6">
          ⚠️ WARNING! In a dystopian future where AI hackers threaten digital infrastructure, you are humanity's last line of defense. Solve 10 strategic SQL challenges to trace and stop a rogue Hacker's cyber-attacks.
        </h1>

        {/* User name input */}
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="mb-4 p-3 rounded w-64 text-black text-lg"
        />

        <button
          onClick={handleEnter}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
