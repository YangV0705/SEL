import MissionLayout from '../components/MissionLayout';

const Mission1 = () => (
  <MissionLayout
    missionNumber={1}
    story="Late at night, red warning lights flood the control room. Multiple unauthorized access attempts suggest the Hacker is striking during system maintenance. You must identify these incidents precisely."
    nova='Nova: "83% of breaches occur during patching windows. Find incidents between 2:00–4:30 AM."'
    correctSQL="SELECT incidentID, timestamp FROM Incident WHERE CAST(timestamp AS TIME) BETWEEN '02:00' AND '04:30';"
    resultData={[
      { incidentID: 'INC0023', timestamp: '2023-04-05 02:30:00' },
      { incidentID: 'INC0047', timestamp: '2023-04-06 03:10:00' },
    ]}
    cipherHint="Your query might be missing some records. Recheck CAST(timestamp AS TIME) and ensure you capture the full 2:00–4:30 range. Accuracy is crucial."
    zenHint="Breathe. Mistakes don’t define you; they guide you. Take a step back and verify each condition calmly."
    phoebeHint="Your leaderboard rank remains unchanged, but you missed a chance to earn bonus points. Refine your approach to climb the standings!"
    successText="<span class='text-blue-400'>Cipher:</span> Query successful. Here are the results."
    resultHeaders={['incidentID', 'timestamp']}
    nextMissionRoute="/mission2"
  />
);

export default Mission1;
