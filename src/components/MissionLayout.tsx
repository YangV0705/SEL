import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Props {
  missionNumber: number;
  story: string;
  nova: string;
  correctSQL: string;
  resultHeaders: string[];
  resultData: Record<string, string>[];
  successText: string;
  nextMissionRoute: string;
}

export default function MissionLayout({
  missionNumber,
  story,
  nova,
  correctSQL,
  resultHeaders,
  resultData,
  successText,
  nextMissionRoute,
}: Props) {
  const [npcResponse, setNpcResponse] = useState({ Cipher: '', Zen: '', Phoebe: '' });
  const [mistakeCount, setMistakeCount] = useState(0);
  const [userSQL, setUserSQL] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [resultTable, setResultTable] = useState<JSX.Element | null>(null);
  const [points, setPoints] = useState(() => Number(localStorage.getItem('points')) || 0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const navigate = useNavigate();
  const missionKey = `mission_${missionNumber}_completed`;
  const missionAlreadyDone = !!localStorage.getItem(missionKey);

  useEffect(() => {
    const syncPoints = () => {
      setPoints(Number(localStorage.getItem('points')) || 0);
    };

    syncPoints();
    window.addEventListener('focus', syncPoints);
    window.addEventListener('storage', syncPoints);

    return () => {
      window.removeEventListener('focus', syncPoints);
      window.removeEventListener('storage', syncPoints);
    };
  }, []);

  const handleExecute = async () => {
    const normalizeSQL = (sql: string) => sql.replace(/\s+/g, ' ').trim().toLowerCase();
    const isCorrect = normalizeSQL(userSQL) === normalizeSQL(correctSQL);

    if (isCorrect) {
      setMistakeCount(0);
      setShowNext(true);

      localStorage.setItem('lastMissionNumber', String(missionNumber));

      if (!localStorage.getItem(missionKey)) {
        const updatedPoints = points + 1;
        localStorage.setItem('points', String(updatedPoints));
        localStorage.setItem(missionKey, 'true');
        setPoints(updatedPoints);
      }

      setNpcResponse({
        Cipher: `<span class='text-blue-400'>Cipher (Hint & Warning):</span> ${
          localStorage.getItem(missionKey)
            ? 'You‘ve already completed this mission. No extra points awarded.'
            : successText
        }`,
        Zen: '',
        Phoebe: '',
      });

      setResultTable(
        <table className="mt-4 w-full text-sm text-white border border-green-500">
          <thead className="bg-green-800">
            <tr>
              {resultHeaders.map((header) => (
                <th key={header} className="p-2 border border-green-600">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resultData.map((row, idx) => (
              <tr key={idx}>
                {resultHeaders.map((key) => (
                  <td key={key} className="p-2 border border-green-600">{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      const nextMistake = mistakeCount + 1;
      setMistakeCount(nextMistake);

      try {
        const response = await fetch('http://localhost:4000/api/npc-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userSQL }),
        });

        const data = await response.json();

        const npcData = data.npcFeedback || {};
        const newNpcResponse = {
          Cipher: npcData.Cipher
            ? `<span class='text-blue-400'>Cipher (Hint & Warning):</span> ${npcData.Cipher}`
            : '',
          Zen: npcData.Zen
            ? `<span class='text-purple-400'>Zen (SEL Reflection):</span> ${npcData.Zen}`
            : '',
          Phoebe: npcData.Phoebe
            ? `<span class='text-pink-400'>Phoebe (Game Feedback):</span> ${npcData.Phoebe}`
            : '',
        };

        setNpcResponse(newNpcResponse);
        setResultTable(null);
      } catch (err) {
        setNpcResponse({
          Cipher: '',
          Zen: '',
          Phoebe: `<span class='text-pink-400'>Phoebe (Game Feedback):</span> Claude API not responding.`,
        });
      }
    }

    setShowQuitConfirm(false);
  };

  const handleQuit = () => {
    setNpcResponse({
      Cipher: '',
      Zen: '',
      Phoebe: `<span class='text-pink-400'>Phoebe (Game Feedback):</span> I understand this is tough. Confirm quit and we’ll save your progress.`,
    });
    setShowQuitConfirm(true);
  };

  const confirmQuit = () => {
    const updated = Math.max(0, points - 1);
    localStorage.setItem('points', String(updated));
    setPoints(updated);
    setNpcResponse({
      Cipher: '',
      Zen: '',
      Phoebe: `<span class='text-pink-400'>Phoebe (Game Feedback):</span> You've stepped away. Come back when you're ready.`,
    });
    setShowNext(false);
    setShowQuitConfirm(false);
    setResultTable(null);
  };

  return (
    <div className="text-green-300 font-mono px-6 py-4 bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-green-400 mb-2">Mission {missionNumber}</h1>

      <div className="mb-4 border border-cyan-500 p-4 rounded">
        <p className="text-sm text-cyan-200"><strong>Story Background:</strong> {story}</p>
        <p className="mt-2 text-sm text-yellow-300 font-semibold">{nova}</p>
        {missionAlreadyDone && (
          <p className="mt-1 text-yellow-400 text-sm">✅ You've already completed this mission.</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <label htmlFor="sqlInput" className="text-white font-semibold">📂 Enter your SQL:</label>
          <textarea
            id="sqlInput"
            value={userSQL}
            onChange={(e) => setUserSQL(e.target.value)}
            placeholder="Type your SQL here..."
            className="w-full h-24 p-3 rounded-md border border-green-500 bg-black text-green-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <div className="space-x-2">
            <button onClick={handleExecute} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-md">▶ Execute</button>
            {showNext && (
              <button onClick={() => navigate(nextMissionRoute)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md">➡ Next</button>
            )}
            <button onClick={handleQuit} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md">✖ Quit</button>
            {showQuitConfirm && (
              <button onClick={confirmQuit} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow-md">✅ Confirm Quit</button>
            )}
            <button onClick={() => navigate('/reward')} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow-md">⭐ Reward</button>
            <button onClick={() => navigate('/')} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded shadow-md">🏠 Home</button>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-gray-700 text-white px-3 py-2 rounded">🧹 Reset All Progress</button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {['Cipher', 'Zen', 'Phoebe'].map(name => (
              <div className="flex flex-col items-center" key={name}>
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={`https://cdn-icons-png.flaticon.com/512/4712/47121${name === 'Cipher' ? '00' : name === 'Zen' ? '05' : '02'}.png`}
                  alt={name}
                  className="w-14 h-14 rounded-full border border-white shadow-lg"
                />
                <p className="text-xs text-center mt-1 text-gray-300 max-w-[7rem]">{name}</p>
                {npcResponse[name] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-2 p-2 text-sm bg-gray-800 border rounded text-white"
                    dangerouslySetInnerHTML={{ __html: npcResponse[name] }}
                  />
                )}
              </div>
            ))}
          </div>

          {resultTable}

          <p className="text-md text-white mt-6">🌟 <span className="text-yellow-400">Points:</span> {points}</p>
        </div>

        <div className="border border-green-500 p-4 rounded overflow-auto max-h-[30rem]">
          <h2 className="text-lg font-bold text-green-400 mb-2">📊 Database Schema</h2>
          <table className="w-full text-left text-green-400 border-collapse text-sm">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="border border-green-600 px-2 py-1">Table</th>
                <th className="border border-green-600 px-2 py-1">Fields</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Employee', fields: 'employeeID, firstName, lastName, jobTitle, department, lastLogin' },
                { name: 'Robot', fields: 'robotID, Model, manufDate, status, lastUpdateOn, lastUpdatedByEmpID' },
                { name: 'Log', fields: 'logID, actionDesc, timestamp, robotID, employeeID' },
                { name: 'Incident', fields: 'incidentID, desc, timestamp, reportedBy, robotID' },
                { name: 'AccessCode', fields: 'accessCode, accessLevel, lastAccess, employeeID' },
              ].map((row) => (
                <tr key={row.name}>
                  <td className="border border-green-600 px-2 py-1 font-bold">{row.name}</td>
                  <td className="border border-green-600 px-2 py-1">{row.fields}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
