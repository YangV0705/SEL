
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MissionIntro from './pages/MissionIntro';
import Mission1 from './pages/Mission1';
import Mission2 from './pages/Mission2';
import Mission3 from './pages/Mission3';
import Mission4 from './pages/Mission4';
import Mission5 from './pages/Mission5';
import Mission6 from './pages/Mission6';
import Mission7 from './pages/Mission7';
import Mission8 from './pages/Mission8';
import Mission9 from './pages/Mission9';
import Mission10 from './pages/Mission10';
import WrongBook from './pages/WrongBook';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intro" element={<MissionIntro />} />
        <Route path="/mission1" element={<Mission1 />} />
        <Route path="/mission2" element={<Mission2 />} />
        <Route path="/mission3" element={<Mission3 />} />
        <Route path="/mission4" element={<Mission4 />} />
        <Route path="/mission5" element={<Mission5 />} />
        <Route path="/mission6" element={<Mission6 />} />
        <Route path="/mission7" element={<Mission7 />} />
        <Route path="/mission8" element={<Mission8 />} />
        <Route path="/mission9" element={<Mission9 />} />
        <Route path="/mission10" element={<Mission10 />} />
        <Route path="/wrongbook" element={<WrongBook />} />
      </Routes>
    </Router>
  );
}
