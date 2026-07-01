import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import LocationPage from './views/LocationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<LocationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
