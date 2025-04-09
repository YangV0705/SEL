
// import { useState } from 'react';

// export default function SchemaSection() {
//   const [showSchema, setShowSchema] = useState(false);
//   const [npcResponse, setNpcResponse] = useState('');
//   const [mistakeCount, setMistakeCount] = useState(0);
//   const [userSQL, setUserSQL] = useState('');
//   const [points, setPoints] = useState(2);
//   const [rank, setRank] = useState(10);
//   const [showQuitConfirm, setShowQuitConfirm] = useState(false);
//   const [showNextMission, setShowNextMission] = useState(false);

//   const handleExecute = () => {
//     const correctAnswer = "SELECT incidentID, timestamp FROM Incident WHERE CAST(timestamp AS TIME) BETWEEN '02:00' AND '04:30';";
//     const trimmedUserSQL = userSQL.replace(/\s+/g, ' ').trim().toLowerCase();
//     const isCorrect = trimmedUserSQL === correctAnswer.toLowerCase();
//     let response = '';

//     if (isCorrect) {
//       setPoints(prev => prev * 2);
//       setRank(prev => Math.max(1, prev - 1));
//       response = '<span class="text-blue-400">Cipher:</span> Congratulations! Your answer is correct. Do you want to go to the next mission?';
//       setMistakeCount(0);
//       setShowNextMission(true);
//     } else {
//       const nextMistake = mistakeCount + 1;
//       if (nextMistake % 3 === 0) {
//         response = '<span class="text-purple-400">Zen:</span> It’s okay—debugging takes practice.';
//       } else {
//         response = '<span class="text-blue-400">Cipher:</span> Check your join condition.';
//       }
//       setMistakeCount(nextMistake);
//     }

//     setNpcResponse(response);
//     setShowQuitConfirm(false);
//   };

//   const handleQuit = () => {
//     setNpcResponse('<span class="text-pink-400">Phoebe:</span> Don’t give up now—you’re close! Are you sure you want to quit and lose points?');
//     setShowQuitConfirm(true);
//   };

//   const confirmQuit = () => {
//     setPoints(prev => Math.max(0, Math.floor(prev / 2)));
//     setRank(prev => prev + 1);
//     setNpcResponse('<span class="text-pink-400">Phoebe:</span> You have chosen to quit. Points deducted. Come back stronger!');
//     setShowQuitConfirm(false);
//   };

//   const handleNextMission = () => {
//     setNpcResponse('<span class="text-blue-400">Nova:</span> Mission 2 loading...');
//     setShowNextMission(false);
//     setUserSQL('');
//   };

//   return (
//     <div className="text-green-300 font-mono">
//       <button
//         onClick={() => setShowSchema(prev => !prev)}
//         className={`px-4 py-2 mb-6 rounded-md border border-cyan-400 hover:bg-cyan-700 transition duration-300 ${showSchema ? 'bg-cyan-600 text-white' : 'text-cyan-300'}`}
//       >
//         {showSchema ? 'Hide Schema' : '🔍 View Schema'}
//       </button>

//       {showSchema && (
//         <div className="mb-6 border border-cyan-500 p-4 rounded">
//           <p className="text-sm text-white">
//             <strong>Incident</strong>: incidentID, timestamp, reportedBy<br />
//           </p>
//         </div>
//       )}

//       <div className="mb-6">
//         <label htmlFor="sqlInput" className="block mb-2 text-md font-semibold text-white">
//           💾 Enter your SQL:
//         </label>
//         <textarea
//           id="sqlInput"
//           value={userSQL}
//           onChange={(e) => setUserSQL(e.target.value)}
//           placeholder="Type your SQL here..."
//           className="w-full h-32 p-3 rounded-md border border-green-500 bg-black text-green-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
//         />
//       </div>

//       <div className="mb-6 space-x-4">
//         <button onClick={handleExecute} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-md">
//           ▶ Execute
//         </button>
//         <button onClick={handleQuit} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md">
//           ✖ Quit
//         </button>
//         {showQuitConfirm && (
//           <button onClick={confirmQuit} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow-md">
//             ✅ Yes, Quit
//           </button>
//         )}
//         {showNextMission && (
//           <button onClick={handleNextMission} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md">
//             🚀 Next Mission
//           </button>
//         )}
//       </div>

//       {npcResponse && (
//         <div
//           className="mb-6 p-4 bg-gray-900 border-l-4 border-yellow-400 rounded shadow"
//           dangerouslySetInnerHTML={{ __html: npcResponse }}
//         />
//       )}

//       <div className="text-md text-white space-y-1">
//         <p>🌟 <span className="text-yellow-400">Points:</span> {points}</p>
//         <p>🏆 <span className="text-yellow-400">Leaderboard Rank:</span> #{rank}</p>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';

export default function SchemaSection() {
  const [npcResponse, setNpcResponse] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);
  const [userSQL, setUserSQL] = useState('');
  const [points, setPoints] = useState(2);
  const [rank, setRank] = useState(10);
  const [showNextMission, setShowNextMission] = useState(false);
  const [resultTable, setResultTable] = useState<JSX.Element | null>(null);

  const handleExecute = () => {
    const correctAnswer = "SELECT incidentID, timestamp FROM Incident WHERE CAST(timestamp AS TIME) BETWEEN '02:00' AND '04:30';";
    const trimmedUserSQL = userSQL.replace(/\s+/g, ' ').trim().toLowerCase();
    const isCorrect = trimmedUserSQL === correctAnswer.toLowerCase();
    let response = '';
    let result = null;

    if (isCorrect) {
      setPoints(prev => prev * 2);
      setRank(prev => Math.max(1, prev - 1));
      response = '<span class="text-blue-400">Cipher:</span> Query successful. Here are the results.';
      setMistakeCount(0);
      setShowNextMission(true);

      result = (
        <table className="mt-4 w-full text-sm text-white border border-green-500">
          <thead className="bg-green-800">
            <tr>
              <th className="p-2 border border-green-600">incidentID</th>
              <th className="p-2 border border-green-600">timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-green-600">INC0023</td>
              <td className="p-2 border border-green-600">2023-04-05 02:30:00</td>
            </tr>
            <tr>
              <td className="p-2 border border-green-600">INC0047</td>
              <td className="p-2 border border-green-600">2023-04-06 03:10:00</td>
            </tr>
          </tbody>
        </table>
      );

    } else {
      const nextMistake = mistakeCount + 1;
      if (userSQL.trim() === '') {
        response = '<span class="text-pink-400">Phoebe:</span> You didn’t enter anything! Try typing your SQL.';
      } else if (!userSQL.toLowerCase().includes('select') || !userSQL.toLowerCase().includes('from')) {
        response = '<span class="text-purple-400">Zen:</span> Make sure you include both SELECT and FROM clauses.';
      } else if (!userSQL.toLowerCase().includes('where')) {
        response = '<span class="text-blue-400">Cipher:</span> You’re close. Hint: Use WHERE with CAST.';
      } else {
        response = '<span class="text-blue-400">Cipher:</span> Syntax error. Check your time format and CAST usage.';
      }
      setMistakeCount(nextMistake);
      result = null;
    }

    setNpcResponse(response);
    setResultTable(result);
  };

  const handleNextMission = () => {
    setNpcResponse('<span class="text-blue-400">Nova:</span> Mission 2 loading...');
    setShowNextMission(false);
    setUserSQL('');
    setResultTable(null);
  };

  return (
    <div className="text-green-300 font-mono">
      {/* Updated: Always show full schema table */}
      <div className="mb-6 border border-green-500 p-4 rounded">
        <table className="w-full text-left text-green-400 border-collapse">
          <thead className="text-lg">
            <tr>
              <th className="border border-green-600 px-4 py-2 bg-black" colSpan={2}>Database Schema</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-green-600 px-4 py-2 font-bold">Employee</td>
              <td className="border border-green-600 px-4 py-2">employeeID, firstName, lastName, jobTitle, department, lastLogin</td>
            </tr>
            <tr>
              <td className="border border-green-600 px-4 py-2 font-bold">Robot</td>
              <td className="border border-green-600 px-4 py-2">robotID, Model, manufDate, status, lastUpdateOn, lastUpdatedByEmpID</td>
            </tr>
            <tr>
              <td className="border border-green-600 px-4 py-2 font-bold">Log</td>
              <td className="border border-green-600 px-4 py-2">logID, actionDesc, timestamp, robotID, employeeID</td>
            </tr>
            <tr>
              <td className="border border-green-600 px-4 py-2 font-bold">Incident</td>
              <td className="border border-green-600 px-4 py-2">incidentID, desc, timestamp, reportedBy, robotID</td>
            </tr>
            <tr>
              <td className="border border-green-600 px-4 py-2 font-bold">AccessCode</td>
              <td className="border border-green-600 px-4 py-2">accessCode, accessLevel, lastAccess, employeeID</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SQL Input */}
      <div className="mb-6">
        <label htmlFor="sqlInput" className="block mb-2 text-md font-semibold text-white">
          📂 Enter your SQL:
        </label>
        <textarea
          id="sqlInput"
          value={userSQL}
          onChange={(e) => setUserSQL(e.target.value)}
          placeholder="Type your SQL here..."
          className="w-full h-32 p-3 rounded-md border border-green-500 bg-black text-green-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Buttons */}
      <div className="mb-6 space-x-4">
        <button onClick={handleExecute} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-md">
          ▶ Execute
        </button>
        {showNextMission && (
          <button onClick={handleNextMission} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md">
            🚀 Next Mission
          </button>
        )}
      </div>

      {/* NPC Dialog Box */}
      {npcResponse && (
        <div className="relative flex items-start gap-4 p-4 mb-6 bg-gray-900 border border-yellow-400 rounded shadow">
          <img src="https://i.imgur.com/Q9qFt3m.png" alt="NPC" className="w-12 h-12 rounded-full border border-white" />
          <div dangerouslySetInnerHTML={{ __html: npcResponse }} className="text-sm text-white" />
        </div>
      )}

      {/* SQL Result Table */}
      {resultTable}

      {/* Score Info */}
      <div className="text-md text-white space-y-1 mt-6">
        <p>🌟 <span className="text-yellow-400">Points:</span> {points}</p>
        <p>🏆 <span className="text-yellow-400">Leaderboard Rank:</span> #{rank}</p>
      </div>
    </div>
  );
}
