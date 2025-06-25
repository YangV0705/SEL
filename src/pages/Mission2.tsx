import MissionLayout from '../components/MissionLayout';

const Mission2 = () => (
  <MissionLayout
    missionNumber={2}
    story="Investigations reveal a suspicious batch of robots. Logs indicate hidden killswitches in NX-4500 models. You suspect the Hacker's infiltration extends into physical devices."
    nova='Nova: "NX-4500 models have hidden killswitches. List the last 3 manufactured."'
    correctSQL="SELECT TOP 3 robotID, manufDate FROM Robot WHERE Model = 'NX-4500' ORDER BY manufDate DESC;"
    resultData={[
      { robotID: 'NX-4500-8812', manufDate: '2024-04-05' },
      { robotID: 'NX-4500-8801', manufDate: '2024-04-03' },
      { robotID: 'NX-4500-8798', manufDate: '2024-04-01' },
    ]}
    successText="<span class='text-blue-400'>Cipher:</span> NX-4500 #8812 was deployed yesterday. It's already in a hospital."
    resultHeaders={['robotID', 'manufDate']}
    nextMissionRoute="/mission3"
  />
);

export default Mission2;
