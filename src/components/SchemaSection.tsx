
// import { useState } from 'react';
// import { motion } from 'framer-motion';

// export default function SchemaSection() {
//   const [npcResponse, setNpcResponse] = useState('');
//   const [mistakeCount, setMistakeCount] = useState(0);
//   const [userSQL, setUserSQL] = useState('');
//   const [points, setPoints] = useState(2);
//   const [rank, setRank] = useState(10);
//   const [showNextMission, setShowNextMission] = useState(false);
//   const [showQuitConfirm, setShowQuitConfirm] = useState(false);
//   const [resultTable, setResultTable] = useState<JSX.Element | null>(null);

//   const handleExecute = () => {
//     const correctAnswer = "SELECT incidentID, timestamp FROM Incident WHERE CAST(timestamp AS TIME) BETWEEN '02:00' AND '04:30';";
//     const trimmedUserSQL = userSQL.replace(/\s+/g, ' ').trim().toLowerCase();
//     const isCorrect = trimmedUserSQL === correctAnswer.toLowerCase();
//     let response = '';
//     let result = null;

//     if (isCorrect) {
//       setPoints(prev => prev + 1);
//       setRank(prev => Math.max(1, prev - 1));
//       response = '<span class="text-blue-400">Cipher:</span> Query successful. Here are the results.';
//       setMistakeCount(0);
//       setShowNextMission(true);

//       result = (
//         <table className="mt-4 w-full text-sm text-white border border-green-500">
//           <thead className="bg-green-800">
//             <tr>
//               <th className="p-2 border border-green-600">incidentID</th>
//               <th className="p-2 border border-green-600">timestamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="p-2 border border-green-600">INC0023</td>
//               <td className="p-2 border border-green-600">2023-04-05 02:30:00</td>
//             </tr>
//             <tr>
//               <td className="p-2 border border-green-600">INC0047</td>
//               <td className="p-2 border border-green-600">2023-04-06 03:10:00</td>
//             </tr>
//           </tbody>
//         </table>
//       );
//     } else {
//       const nextMistake = mistakeCount + 1;
//       if (userSQL.trim() === '') {
//         response = '<span class="text-pink-400">Phoebe:</span> You didn’t enter anything! Try typing your SQL.';
//       } else if (!userSQL.toLowerCase().includes('select') || !userSQL.toLowerCase().includes('from')) {
//         response = '<span class="text-purple-400">Zen:</span> Make sure you include both SELECT and FROM clauses.';
//       } else if (!userSQL.toLowerCase().includes('where')) {
//         response = '<span class="text-blue-400">Cipher:</span> You’re close. Hint: Use WHERE with CAST.';
//       } else {
//         response = '<span class="text-blue-400">Cipher:</span> Syntax error. Check your time format and CAST usage.';
//       }
//       setMistakeCount(nextMistake);
//       result = null;
//     }

//     setNpcResponse(response);
//     setResultTable(result);
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
//     setResultTable(null);
//   };

//   const npcProfiles = [
//     {
//       name: 'Cipher',
//       color: 'border-blue-400',
//       avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png',
//       description: 'Technical AI Assistant — gives SQL hints'
//     },
//     {
//       name: 'Zen',
//       color: 'border-purple-400',
//       avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712105.png',
//       description: 'Emotional Guide — gives motivational support'
//     },
//     {
//       name: 'Phoebe',
//       color: 'border-pink-400',
//       avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712102.png',
//       description: 'Game Agent — encourages persistence and tracks points'
//     },
//   ];

//   return (
//     <div className="text-green-300 font-mono">
//       <div className="mb-6 p-4 border border-cyan-500 rounded bg-black text-white">
//         <p className="text-sm text-cyan-200">
//           <strong>Story Background:</strong> Late at night, red warning lights flood the control room. Multiple unauthorized access attempts suggest the Hacker is striking during system maintenance. You must identify these incidents precisely.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-3 gap-6 items-start">
//         <div className="md:col-span-2">
//           <label htmlFor="sqlInput" className="block mb-2 text-md font-semibold text-white">
//             📂 Enter your SQL:
//           </label>
//           <textarea
//             id="sqlInput"
//             value={userSQL}
//             onChange={(e) => setUserSQL(e.target.value)}
//             placeholder="Type your SQL here..."
//             className="w-full h-32 p-3 rounded-md border border-green-500 bg-black text-green-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
//           />

//           <div className="my-4 space-x-4">
//             <button onClick={handleExecute} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-md">
//               ▶ Execute
//             </button>
//             <button onClick={handleQuit} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md">
//               ✖ Quit
//             </button>
//             {showQuitConfirm && (
//               <button onClick={confirmQuit} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow-md">
//                 ✅ Yes, Quit
//               </button>
//             )}
//             {showNextMission && (
//               <button onClick={handleNextMission} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md">
//                 🚀 Next Mission
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-3 gap-4 mb-6">
//             {npcProfiles.map(({ name, color, avatar, description }) => (
//               <div className="flex flex-col items-center" key={name}>
//                 <motion.img
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3 }}
//                   src={avatar}
//                   alt={name}
//                   className="w-14 h-14 rounded-full border border-white shadow-lg"
//                 />
//                 <p className="text-xs text-center mt-1 text-gray-300 max-w-[7rem]">
//                   {name}: {description}
//                 </p>
//                 {npcResponse.includes(`${name}:`) && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4 }}
//                     className={`mt-2 p-2 text-sm bg-gray-800 ${color} border rounded text-white`}
//                     dangerouslySetInnerHTML={{ __html: npcResponse }}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="border border-green-500 p-4 rounded">
//           <table className="w-full text-left text-green-400 border-collapse">
//             <thead className="text-lg">
//               <tr>
//                 <th className="border border-green-600 px-4 py-2 bg-black" colSpan={2}>Database Schema</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border border-green-600 px-4 py-2 font-bold">Employee</td>
//                 <td className="border border-green-600 px-4 py-2">employeeID, firstName, lastName, jobTitle, department, lastLogin</td>
//               </tr>
//               <tr>
//                 <td className="border border-green-600 px-4 py-2 font-bold">Robot</td>
//                 <td className="border border-green-600 px-4 py-2">robotID, Model, manufDate, status, lastUpdateOn, lastUpdatedByEmpID</td>
//               </tr>
//               <tr>
//                 <td className="border border-green-600 px-4 py-2 font-bold">Log</td>
//                 <td className="border border-green-600 px-4 py-2">logID, actionDesc, timestamp, robotID, employeeID</td>
//               </tr>
//               <tr>
//                 <td className="border border-green-600 px-4 py-2 font-bold">Incident</td>
//                 <td className="border border-green-600 px-4 py-2">incidentID, desc, timestamp, reportedBy, robotID</td>
//               </tr>
//               <tr>
//                 <td className="border border-green-600 px-4 py-2 font-bold">AccessCode</td>
//                 <td className="border border-green-600 px-4 py-2">accessCode, accessLevel, lastAccess, employeeID</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {resultTable}

//       <div className="text-md text-white space-y-1 mt-6">
//         <p>🌟 <span className="text-yellow-400">Points:</span> {points}</p>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SchemaSection() {
  const [npcResponse, setNpcResponse] = useState({ Cipher: '', Zen: '', Phoebe: '' });
  const [mistakeCount, setMistakeCount] = useState(0);
  const [userSQL, setUserSQL] = useState('');
  const [points, setPoints] = useState(2);
  const [rank, setRank] = useState(10);
  const [showNextMission, setShowNextMission] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [resultTable, setResultTable] = useState<JSX.Element | null>(null);

  const handleExecute = () => {
    const correctAnswer = "SELECT incidentID, timestamp FROM Incident WHERE CAST(timestamp AS TIME) BETWEEN '02:00' AND '04:30';";
    const trimmedUserSQL = userSQL.replace(/\s+/g, ' ').trim().toLowerCase();
    const isCorrect = trimmedUserSQL === correctAnswer.toLowerCase();
    let result = null;

    if (isCorrect) {
      setPoints(prev => prev + 1);
      setRank(prev => Math.max(1, prev - 1));
      setNpcResponse({
        Cipher: '<span class="text-blue-400">Cipher:</span> Query successful. Here are the results.',
        Zen: '',
        Phoebe: ''
      });
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
      setNpcResponse({
        Cipher: '<span class="text-blue-400">Cipher (Hint & Warning):</span> "Your query might be missing some records. Recheck CAST(timestamp AS TIME) and ensure you capture the full 2:00–4:30 range. Accuracy is crucial."',
        Zen: nextMistake % 2 === 0
          ? '<span class="text-purple-400">Zen (SEL Reflection):</span> "Breathe. Mistakes don’t define you; they guide you. Take a step back and verify each condition calmly."'
          : '',
        Phoebe: ''
      });
      setMistakeCount(nextMistake);
      result = null;
    }

    setResultTable(result);
    setShowQuitConfirm(false);
  };

  const handleQuit = () => {
    setNpcResponse({
      Cipher: '',
      Zen: '',
      Phoebe: '<span class="text-pink-400">Phoebe:</span> Don’t give up now—you’re close! Are you sure you want to quit and lose points?'
    });
    setShowQuitConfirm(true);
  };

  const confirmQuit = () => {
    setPoints(prev => Math.max(0, Math.floor(prev / 2)));
    setRank(prev => prev + 1);
    setNpcResponse({
      Cipher: '',
      Zen: '',
      Phoebe: '<span class="text-pink-400">Phoebe:</span> You have chosen to quit. Points deducted. Come back stronger!'
    });
    setShowQuitConfirm(false);
  };

  const handleNextMission = () => {
    setNpcResponse({
      Cipher: '<span class="text-blue-400">Nova:</span> Mission 2 loading...',
      Zen: '',
      Phoebe: ''
    });
    setShowNextMission(false);
    setUserSQL('');
    setResultTable(null);
  };

  const npcProfiles = [
    {
      name: 'Cipher',
      color: 'border-blue-400',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png',
      description: 'Technical AI Assistant — gives SQL hints'
    },
    {
      name: 'Zen',
      color: 'border-purple-400',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712105.png',
      description: 'Emotional Guide — gives motivational support'
    },
    {
      name: 'Phoebe',
      color: 'border-pink-400',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712102.png',
      description: 'Game Agent — encourages persistence and tracks points'
    },
  ];

  return (
    <div className="text-green-300 font-mono">
      <div className="mb-6 p-4 border border-cyan-500 rounded bg-black text-white">
        <p className="text-sm text-cyan-200">
          <strong>Story Background:</strong> Late at night, red warning lights flood the control room. Multiple unauthorized access attempts suggest the Hacker is striking during system maintenance. You must identify these incidents precisely.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
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

          <div className="my-4 space-x-4">
            <button onClick={handleExecute} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-md">
              ▶ Execute
            </button>
            <button onClick={handleQuit} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md">
              ✖ Quit
            </button>
            {showQuitConfirm && (
              <button onClick={confirmQuit} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow-md">
                ✅ Yes, Quit
              </button>
            )}
            {showNextMission && (
              <button onClick={handleNextMission} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md">
                🚀 Next Mission
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {npcProfiles.map(({ name, color, avatar, description }) => (
              <div className="flex flex-col items-center" key={name}>
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={avatar}
                  alt={name}
                  className="w-14 h-14 rounded-full border border-white shadow-lg"
                />
                <p className="text-xs text-center mt-1 text-gray-300 max-w-[7rem]">
                  {name}: {description}
                </p>
                {npcResponse[name] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`mt-2 p-2 text-sm bg-gray-800 ${color} border rounded text-white`}
                    dangerouslySetInnerHTML={{ __html: npcResponse[name] }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-green-500 p-4 rounded">
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
      </div>

      {resultTable}

      <div className="text-md text-white space-y-1 mt-6">
        <p>🌟 <span className="text-yellow-400">Points:</span> {points}</p>
      </div>
    </div>
  );
}
