import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Mission1 from './pages/Mission1';
import Mission2 from './pages/Mission2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mission1 />} />
        <Route path="/mission2" element={<Mission2 />} />
      </Routes>
    </Router>
  );
}

export default App;
