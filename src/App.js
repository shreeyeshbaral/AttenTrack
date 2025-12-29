import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AttendanceProvider } from './AttendanceContext';

// Imports
import Login from './Login';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage'; 
import Timetable from './pages/Timetable';
import Profile from './pages/Profile';
import './styles/global.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Use null to check "loading" state

  useEffect(() => {
    // Check if the user has already "logged in"
    const status = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(status === 'true');
  }, []);

  // Loading state to prevent "flicker" while checking localStorage
  if (isLoggedIn === null) return null;

  return (
    <AttendanceProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} /> 
        
        <Routes>
          {/* If logged in, don't show Login page, redirect to Dashboard */}
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} 
          />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Catch-all: redirect any unknown path to / */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AttendanceProvider>
  );
}

export default App;