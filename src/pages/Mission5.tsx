import MissionLayout from '../components/MissionLayout';

const Mission5 = () => {
  return (
    <MissionLayout
      missionNumber={5}
      story="Several logs are missing timestamps. Find all logs where timestamp is NULL."
      nova='Nova: "Search for logs with missing timestamp values."'
      correctSQL="SELECT logID, actionDesc FROM Log WHERE timestamp IS NULL;"
      resultData={[
        { logID: 'L998', actionDesc: 'System reboot initiated' },
        { logID: 'L1001', actionDesc: 'Error reported: Sensor failure' },
      ]}
      successText="<span class='text-blue-400'>Cipher:</span> Null timestamp logs found."
      resultHeaders={['logID', 'actionDesc']}
      nextMissionRoute="/mission6"
    />
  );
};

export default Mission5;
