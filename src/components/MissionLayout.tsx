import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RewardStatus from './RewardStatus';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import WrongBook from '../pages/WrongBook';

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
  const [userSQL, setUserSQL] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [resultTable, setResultTable] = useState<JSX.Element | null>(null);
  const [points, setPoints] = useState(() => Number(localStorage.getItem('points')) || 0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [hasTriggeredBackspaceFeedback, setHasTriggeredBackspaceFeedback] = useState(false);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [userMood, setUserMood] = useState('');


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

  useEffect(() => {
    setStartTime(Date.now());
    setElapsedTime(0);
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [missionNumber]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!showNext) {
      timer = setTimeout(() => {
        setNpcResponse(prev => ({
          ...prev,
          Zen: "<span class='text-purple-400'>Zen (SEL Reflection):</span> You've been quiet for a while. Remember, it's okay to take breaks. ✨"
        }));
      }, 60000);
    }
    return () => clearTimeout(timer);
  }, [showNext]);

  const normalizeSQL = (sql: string) => sql.replace(/\s+/g, ' ').trim().toLowerCase();

  const hasSyntaxError = (sql: string): boolean => {
    const lower = sql.toLowerCase();
    return !(lower.includes('select') && sql.trim().endsWith(';'));
  };

  const handleExecute = async () => {
    const isCorrect = normalizeSQL(userSQL) === normalizeSQL(correctSQL);
    const duration = (Date.now() - startTime) / 1000;
    let npcFeedback = { Cipher: '', Zen: '', Phoebe: '' };

    try {
      const response = await fetch('http://localhost:4000/api/npc-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSQL, correctSQL }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const data = await response.json();

      npcFeedback = {
        Cipher: data?.npcFeedback?.Cipher || 'No Cipher feedback.',
        Zen: data?.npcFeedback?.Zen || 'No Zen feedback.',
        Phoebe: data?.npcFeedback?.Phoebe || 'No Phoebe feedback.',
      };
    } catch (error) {
      console.error('LLM fetch error:', error);
      npcFeedback = {
        Cipher: '⚠️ Claude API not responding.',
        Zen: '',
        Phoebe: ''
      };
    }

    if (isCorrect) {
      setShowNext(true);
      localStorage.setItem('lastMissionNumber', String(missionNumber));

      if (!localStorage.getItem(missionKey)) {
        const updatedPoints = points + 1;
        localStorage.setItem('points', String(updatedPoints));
        localStorage.setItem(missionKey, 'true');
        setPoints(updatedPoints);
      }

      if (duration <= 35) {
        setNpcResponse({
          Cipher: '',
          Zen: '',
          Phoebe: `<span class='text-pink-400'>Phoebe (Game Feedback):</span> ${npcFeedback.Phoebe}`,
        });
      } else {
        setNpcResponse({
          Cipher: `<span class='text-blue-400'>Cipher (Hint & Warning):</span> ${npcFeedback.Cipher}`,
          Zen: '',
          Phoebe: '',
        });
      }

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
      const isSyntax = hasSyntaxError(userSQL);
      const cipherFeedback = `<span class='text-blue-400'>Cipher (Hint & Warning):</span> ${npcFeedback.Cipher}`;
      const zenFeedback = `<span class='text-purple-400'>Zen (SEL Reflection):</span> ${npcFeedback.Zen || "Keep going, you're making progress!"}`;

      if (isSyntax) {
        setNpcResponse({ Cipher: cipherFeedback, Zen: '', Phoebe: '' });
      } else {
        setNpcResponse({ Cipher: '', Zen: zenFeedback, Phoebe: '' });
      }

      setResultTable(null);
      setShowWrongModal(true);
    }

    setShowQuitConfirm(false);
  };

  const handleQuit = () => {
    setNpcResponse({
      Cipher: '',
      Zen: '',
      Phoebe: `<span class='text-pink-400'>Phoebe (Game Feedback):</span> I understand this is tough. Confirm quit and we'll save your progress.`,
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

  const handleSaveWrong = () => {
    const prev = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    const newEntry = {
      missionNumber,
      userSQL,
      correctSQL,
      story,
      nova,
      userMood,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('wrongBook', JSON.stringify([...prev, newEntry]));
    setUserMood('');
    setShowWrongModal(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      setBackspaceCount(prev => {
        const newCount = prev + 1;

        if (newCount > 15 && !hasTriggeredBackspaceFeedback) {
          setNpcResponse(prev => ({
            ...prev,
            Zen: "<span class='text-purple-400'>Zen (SEL Reflection):</span> Looks like you're feeling stuck. Take a deep breath - you're doing your best! 🌸"
          }));

          setHasTriggeredBackspaceFeedback(true);

          setTimeout(() => {
            setHasTriggeredBackspaceFeedback(false);
          }, 15000);
        }

        return newCount;
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
    <div className="text-green-300 font-mono px-6 py-4 bg-black min-h-screen relative">
      <div
        className="absolute top-4 right-4 bg-green-900 bg-opacity-70 text-green-200 px-3 py-1 rounded font-mono text-sm select-none"
        aria-label="Elapsed time"
      >
        ⏱ Time: {formatTime(elapsedTime)}
      </div>

      <h1 className="text-2xl font-bold text-green-400 mb-2">Mission {missionNumber}</h1>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <div className="border border-cyan-500 p-4 rounded">
            <p className="text-sm text-cyan-200">
              <strong>Story Background:</strong> {story}
            </p>
            <p className="mt-2 text-sm text-yellow-300 font-semibold">{nova}</p>
            {missionAlreadyDone && (
              <p className="mt-1 text-yellow-400 text-sm">
                ✅ You've already completed this mission.
              </p>
            )}
          </div>

          <label htmlFor="sqlInput" className="text-white font-semibold">📂 Enter your SQL:</label>
          <textarea
            id="sqlInput"
            value={userSQL}
            onChange={(e) => setUserSQL(e.target.value)}
            onKeyDown={handleKeyDown}
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
              <button onClick={confirmQuit} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow-md">✓ Confirm Quit</button>
            )}
            <button onClick={() => navigate('/')} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded shadow-md">⇱ Home</button>
            <button onClick={() => navigate('/wrongbook')} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow-md">✎ WrongBook</button>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-gray-700 text-white px-3 py-2 rounded">↺ Reset All Progress</button>
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

          <RewardStatus />
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
    <Dialog open={showWrongModal} onClose={() => setShowWrongModal(false)}>
    <DialogTitle>Save to Mistake Journal</DialogTitle>
    <DialogContent>
    <TextField
      label="Your mood or notes (optional)"
      multiline
      fullWidth
      minRows={3}
      value={userMood}
      onChange={(e) => setUserMood(e.target.value)}
      variant="outlined"
      margin="dense"
    />
    </DialogContent>
    <DialogActions>
    <Button onClick={() => setShowWrongModal(false)} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleSaveWrong} variant="contained" color="primary">
      Save
    </Button>
    </DialogActions>
    </Dialog>
    </>
  );
}
