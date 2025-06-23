import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MissionIntro from './pages/MissionIntro';
import Mission1 from './pages/Mission1';
import Mission2 from './pages/Mission2';

export default function App() {
  useEffect(() => {
    localStorage.removeItem('points');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intro" element={<MissionIntro />} />
        <Route path="/mission1" element={<Mission1 />} />
        <Route path="/mission2" element={<Mission2 />} />
      </Routes>
    </Router>
  );
}

