import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import History from './pages/History';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}