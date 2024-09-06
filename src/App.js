import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import HallDetails from './components/HallDetails/HallDetails';
import Booking from './components/Booking/Booking';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/halls/:id" element={<HallDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
      </Routes>
    </div>
  );
}

export default App;
