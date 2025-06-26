import MissionLayout from '../components/MissionLayout';

const Mission7 = () => (
  <MissionLayout
    missionNumber={7}
    story="Anomalies in employee logins suggest credential sharing. Identify employees who logged in from multiple departments."
    nova='Nova: "Check for the same employeeID with different department values."'
    correctSQL="SELECT employeeID, department FROM Employee GROUP BY employeeID, department HAVING COUNT(*) > 1;"
    resultData={[
      { employeeID: 'E401', department: 'R&D' },
      { employeeID: 'E401', department: 'IT' },
    ]}
    successText="<span class='text-blue-400'>Cipher:</span> Multiple department access detected for same employee."
    resultHeaders={['employeeID', 'department']}
    nextMissionRoute="/mission8"
  />
);

export default Mission7;
