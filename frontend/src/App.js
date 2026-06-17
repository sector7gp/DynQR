import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QRDisplay from './QRDisplay';
import Reservations from './Reservations';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRDisplay />} />
        <Route path="/reservations" element={<Reservations />} />
      </Routes>
    </Router>
  );
}

export default App;
