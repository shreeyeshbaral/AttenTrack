// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- IMPORT THIS
import { AttendanceProvider } from './AttendanceContext';
// ... keep your other imports ...
import Login from './Login';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage'; 
import Timetable from './pages/Timetable';
import Profile from './pages/Profile';
import './styles/global.css';

function App() {
  return (
    <AttendanceProvider>
      <Router>
        {/* Add this line to enable popups */}
        <Toaster position="top-center" reverseOrder={false} /> 
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AttendanceProvider>
  );
}

export default App;