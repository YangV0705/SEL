import MissionLayout from '../components/MissionLayout';

const Mission6 = () => {
  return (
    <MissionLayout
      missionNumber={6}
      story="Incident reports are piling up. List incidents reported by employees in the Security department."
      nova='Nova: "Filter incidents by reportedBy employees working in Security."'
      correctSQL="SELECT incidentID, desc, timestamp FROM Incident WHERE reportedBy IN (SELECT employeeID FROM Employee WHERE department = 'Security');"
      resultData={[
        { incidentID: 'INC0101', desc: 'Unauthorized access attempt', timestamp: '2023-04-08 14:30:00' },
        { incidentID: 'INC0115', desc: 'Malfunction in robot R332', timestamp: '2023-04-09 09:15:00' },
      ]}
      successText="<span class='text-blue-400'>Cipher:</span> Security incidents identified."
      resultHeaders={['incidentID', 'desc', 'timestamp']}
      nextMissionRoute="/mission7"
    />
  );
};

export default Mission6;
