import { Routes, Route } from 'react-router-dom';
import BusSchedule from './pages/busschedule';
import pkg from '../package.json';
import Home from './pages/home';

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
