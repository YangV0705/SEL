import MissionLayout from '../components/MissionLayout';

const Mission3 = () => {
  return (
    <MissionLayout
      missionNumber={3}
      story="A suspicious surge in access logs hints at unauthorized entry attempts. Pinpoint the employees with access codes used after hours."
      nova='Nova: "Check accessCode and lastAccess time. Focus on entries between 9 PM and 5 AM."'
      correctSQL="SELECT employeeID, accessCode, lastAccess FROM AccessCode WHERE CAST(lastAccess AS TIME) BETWEEN '21:00' AND '23:59' OR CAST(lastAccess AS TIME) BETWEEN '00:00' AND '05:00';"
      resultData={[
        { employeeID: 'E123', accessCode: 'AC045', lastAccess: '2023-04-07 22:15:00' },
        { employeeID: 'E098', accessCode: 'AC012', lastAccess: '2023-04-08 02:40:00' },
      ]}
      successText="<span class='text-blue-400'>Cipher:</span> Access logs queried successfully."
      resultHeaders={['employeeID', 'accessCode', 'lastAccess']}
      nextMissionRoute="/mission4"
    />
  );
};

export default Mission3;
