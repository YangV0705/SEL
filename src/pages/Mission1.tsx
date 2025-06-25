import MissionLayout from '../components/MissionLayout';

const Mission1 = () => {
  const handleSuccess = () => {
    const currentPoints = Number(localStorage.getItem('points')) || 0;
    localStorage.setItem('points', String(currentPoints + 1));
  };

  return (
    <MissionLayout
      missionNumber={1}
      story="Late at night, red warning lights flood the control room. Multiple unauthorized access attempts suggest the Hacker is striking during system maintenance. You must identify these incidents precisely."
      nova='Nova: "83% of breaches occur during patching windows. Find incidents between 2:00-4:30 AM."'
      correctSQL="SELECT incidentID, timestamp FROM Incident WHERE CAST(timestamp AS TIME) BETWEEN '02:00' AND '04:30';"
      resultData={[
        { incidentID: 'INC0023', timestamp: '2023-04-05 02:30:00' },
        { incidentID: 'INC0047', timestamp: '2023-04-06 03:10:00' },
      ]}
      successText="<span class='text-blue-400'>Cipher:</span> Query successful. Here are the results."
      resultHeaders={['incidentID', 'timestamp']}
      nextMissionRoute="/mission2"
    />
  );
};

export default Mission1;

