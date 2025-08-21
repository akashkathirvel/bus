import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BusSchedule from './pages/BusSchedule'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bus" element={<Home />} />
      <Route path="/bus/:selected" element={<BusSchedule />} />
    </Routes>
  )
}

export default App
