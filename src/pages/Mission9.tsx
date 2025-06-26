import MissionLayout from '../components/MissionLayout';

const Mission9 = () => (
  <MissionLayout
    missionNumber={9}
    story="Cross-checks reveal potential forged incident reports. Locate incidents reported by non-logged-in employees."
    nova='Nova: "Match incident reportedBy with employees whose lastLogin is NULL."'
    correctSQL="SELECT incidentID, reportedBy FROM Incident WHERE reportedBy IN (SELECT employeeID FROM Employee WHERE lastLogin IS NULL);"
    resultData={[
      { incidentID: 'INC0212', reportedBy: 'E789' },
    ]}
    successText="<span class='text-blue-400'>Cipher:</span> Fake report detected."
    resultHeaders={['incidentID', 'reportedBy']}
    nextMissionRoute="/mission10"
  />
);

export default Mission9;
