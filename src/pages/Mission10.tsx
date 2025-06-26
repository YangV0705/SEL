import MissionLayout from '../components/MissionLayout';

const Mission10 = () => (
  <MissionLayout
    missionNumber={10}
    story="Final mission: Reveal the Hacker's backdoor path. Trace access codes that were used by employees already terminated."
    nova='Nova: "Join AccessCode with Employee where jobTitle = Terminated."'
    correctSQL="SELECT AccessCode.accessCode, Employee.employeeID FROM AccessCode JOIN Employee ON AccessCode.employeeID = Employee.employeeID WHERE Employee.jobTitle = 'Terminated';"
    resultData={[
      { accessCode: 'AC990', employeeID: 'E999' },
    ]}
    successText="<span class='text-blue-400'>Cipher:</span> Hacker's entry point identified. Mission complete!"
    resultHeaders={['accessCode', 'employeeID']}
    nextMissionRoute="/"
  />
);

export default Mission10;
