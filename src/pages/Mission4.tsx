import MissionLayout from '../components/MissionLayout';

const Mission4 = () => {
  return (
    <MissionLayout
      missionNumber={4}
      story="Robots report erratic behavior. Identify robots last updated by employees in the IT department."
      nova='Nova: "Filter robots where lastUpdatedByEmpID matches employees from IT department."'
      correctSQL="SELECT robotID, Model, lastUpdatedByEmpID FROM Robot WHERE lastUpdatedByEmpID IN (SELECT employeeID FROM Employee WHERE department = 'IT');"
      resultData={[
        { robotID: 'R201', Model: 'XJ9', lastUpdatedByEmpID: 'E345' },
        { robotID: 'R332', Model: 'T800', lastUpdatedByEmpID: 'E312' },
      ]}
      successText="<span class='text-blue-400'>Cipher:</span> Robots filtered successfully."
      resultHeaders={['robotID', 'Model', 'lastUpdatedByEmpID']}
      nextMissionRoute="/mission5"
    />
  );
};

export default Mission4;
