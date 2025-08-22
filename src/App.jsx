import { Routes, Route } from 'react-router-dom';
import BusSchedule from './pages/BusSchedule';
import pkg from '../package.json';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={pkg.homepage} element={<Home />} />
      <Route path={`${pkg.homepage}/:selected`} element={<BusSchedule />} />
    </Routes>
  )
}

export default App
