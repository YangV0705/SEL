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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
 
  const navigate = useNavigate();
  const [npcResponse, setNpcResponse] = useState({ Cipher: '', Zen: '', Phoebe: '' });
  const [userSQL, setUserSQL] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [resultTable, setResultTable] = useState<JSX.Element | null>(null);
  const [points, setPoints] = useState(() => Number(localStorage.getItem('points')) || 0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [userMood, setUserMood] = useState('');
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [hasTriggeredBackspaceFeedback, setHasTriggeredBackspaceFeedback] = useState(false);
  const [lastInputTime, setLastInputTime] = useState(Date.now());
 
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
    if (!userSQL) return;

    const idleTimer = setTimeout(() => {
      setNpcResponse(prev => ({
        ...prev,
        Zen: "<span class='text-purple-400'>Zen (SEL Reflection):</span> You've been idle for a while. Take a deep breath and refocus! 🌼"
      }));
    }, 60000);

    return () => clearTimeout(idleTimer);
  }, [userSQL]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastInputTime;
  
      if (idleTime >= 60000) {
        setNpcResponse(prev => ({
          ...prev,
          Zen: "<span class='text-purple-400'>Zen (SEL Reflection):</span> You've been idle for a while. Take a deep breath and refocus! 🌼"
        }));
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, [lastInputTime]);
  
 
  const normalizeSQL = (sql: string) => {
    return sql
      .replace(/\s+/g, ' ')
      .replace(/[`"']/g, '')
      .replace(/\s*;\s*$/, '')
      .trim()
      .toLowerCase();
  };
 
  const areSQLSemanticallyEquivalent = (user: string, correct: string) => {
    return normalizeSQL(user) === normalizeSQL(correct);
  };
 
  const hasSyntaxError = (sql: string): boolean => {
    const lower = sql.toLowerCase();
    return !(lower.includes('select') && sql.trim().endsWith(';'));
  };
 
  const handleExecute = async () => {
    const isCorrect = areSQLSemanticallyEquivalent(userSQL, correctSQL);
    const duration = (Date.now() - startTime) / 1000;
    let npcFeedback = { Cipher: '', Zen: '', Phoebe: '' };
 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/npc-feedback`, {
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
 
      let feedbackToShow: { Cipher: string; Zen: string; Phoebe: string } = { Cipher: '', Zen: '', Phoebe: '' };
 
      if (duration <= 45) {
        feedbackToShow.Phoebe = `<span class='text-pink-400'>Phoebe (Game Feedback):</span> ${npcFeedback.Phoebe}`;
      } else {
        feedbackToShow.Cipher = `<span class='text-blue-400'>Cipher (Hint & Warning):</span> ${npcFeedback.Cipher}`;
      }
    
      setNpcResponse(feedbackToShow);
 
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
 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      const newCount = backspaceCount + 1;
      setBackspaceCount(newCount);
 
      if (newCount >= 5 && !hasTriggeredBackspaceFeedback) {
        setHasTriggeredBackspaceFeedback(true);
        setNpcResponse(prev => ({
          ...prev,
          Zen: "<span class='text-purple-400'>Zen (SEL Reflection):</span> Seems like you're editing a lot. Remember to take breaks. 🌱"
        }));
      }
    }
  };
 
  const handleQuit = () => {
    setShowQuitConfirm(true);
  };
 
  const confirmQuit = () => {
    navigate('/');
  };
  const handleSaveWrong = () => {
    const wrongLog = {
      missionNumber,
      userSQL,
      correctSQL,
      story,
      nova,
      userMood,
      timestamp: new Date().toISOString()
    };
  
    const prevLogs = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    localStorage.setItem('wrongBook', JSON.stringify([...prevLogs, wrongLog]));
    setShowWrongModal(false);
    setUserMood('');
  };
 
  return (
    <>
      <div className="text-green-300 font-mono px-6 py-4 bg-black min-h-screen relative">
        <div className="absolute top-4 right-4 bg-green-900 bg-opacity-70 text-green-200 px-3 py-1 rounded font-mono text-sm select-none">
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
            onChange={(e) => {
              setUserSQL(e.target.value);
              setLastInputTime(Date.now());
            }}
            onKeyDown={(e) => {
              handleKeyDown(e);
              setLastInputTime(Date.now());
            }}
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
 
        {/* RIGHT COLUMN: Schema + Badge Rule */}
        <div className="flex flex-col gap-4">
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
  
            {/* Badge Rule Box */}
            <div className="border border-green-500 p-4 rounded text-green-300 font-mono text-sm leading-relaxed">
              <h4 className="text-md font-bold text-yellow-300 mb-2">🔓 How to Earn Badges</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>✔️ Complete 2 missions to earn 1 badge.</li>
                <li>✔️ Each badge shows a SQL skill you've mastered.</li>
                <li>🏁 Earn all 5 badges to unlock the next chapter!</li>
              </ul>
            </div>
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
