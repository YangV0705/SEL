import MissionLayout from '../components/MissionLayout';

const Mission8 = () => (
  <MissionLayout
    missionNumber={8}
    story="Unusual patterns in robot model updates were flagged. Spot robots with outdated status but recent updates."
    nova='Nova: "Find robots where status is Inactive but lastUpdateOn is recent (after 2024-01-01)."'
    correctSQL="SELECT robotID, status, lastUpdateOn FROM Robot WHERE status = 'Inactive' AND lastUpdateOn > '2024-01-01';"
    resultData={[
      { robotID: 'RX782', status: 'Inactive', lastUpdateOn: '2024-05-22' },
    ]}
    successText="<span class='text-blue-400'>Cipher:</span> Anomaly found in update logs."
    resultHeaders={['robotID', 'status', 'lastUpdateOn']}
    nextMissionRoute="/mission9"
  />
);

export default Mission8;
