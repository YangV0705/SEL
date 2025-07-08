import { useEffect, useState } from "react";

export default function RewardStatus() {
  const totalMissions = 10;
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const storedPoints = Number(localStorage.getItem("points")) || 0;
    setPoints(storedPoints);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const updatedPoints = Number(localStorage.getItem("points")) || 0;
        setPoints(updatedPoints);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const badges = Math.floor(points / 2);
  const displayedBadges = Math.min(badges, 5);
  const allCompleted = points >= totalMissions;

  const badgeInfo = [
    {
      name: "Data Seeker",
      description: "basic SELECT queries",
    },
    {
      name: "Filter Master",
      description: "filtering with WHERE and time ranges",
    },
    {
      name: "Join Explorer",
      description: "multi-table JOIN operations",
    },
    {
      name: "Logic Builder",
      description: "using AND / OR / NOT conditions",
    },
    {
      name: "SQL Strategist",
      description: "full-scope SQL problem solving",
    },
  ];

  return (
    <div className="mt-10 p-6 border-t border-cyan-600 text-center text-green-200 font-mono">
      <h2 className="text-2xl font-bold text-yellow-300 mb-2">🎖️ Your Reward Status</h2>
      <p className="text-cyan-300 mb-4">
        You've completed <span className="font-bold text-white">{points}</span> out of {totalMissions} missions.
      </p>

      <div className="bg-[#111827] border border-cyan-600 rounded-lg p-4 mb-4 shadow">
        <h3 className="text-purple-300 font-bold mb-2">🏅 Badges Earned</h3>
        <div className="flex justify-center gap-2">
          {[...Array(displayedBadges)].map((_, i) => (
            <img
              key={`earned-${i}`}
              src="/badge-colored.jpg"
              alt={`Badge ${i + 1}`}
              className="w-10 h-10"
              title={`🏅 Congratulations! You earned the "${badgeInfo[i].name}" badge. This proves you have mastered ${badgeInfo[i].description}.`}
            />
          ))}
          {[...Array(5 - displayedBadges)].map((_, i) => (
            <img
              key={`empty-${i}`}
              src="/badge-grey.png"
              alt="Empty Badge"
              className="w-10 h-10 opacity-30"
              title="Badge not yet unlocked"
            />
          ))}
        </div>
      </div>

      {allCompleted && (
        <div className="bg-green-800 border border-green-400 rounded-lg p-4 mb-4">
          <h3 className="text-green-200 font-bold mb-1">🎉 Congratulations!</h3>
          <p className="text-green-100">You've completed Level 1 of the Hacker Challenge!</p>
        </div>
      )}
    </div>
  );
}
