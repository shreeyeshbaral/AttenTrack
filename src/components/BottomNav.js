import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MdHome, MdCalendarMonth, MdViewWeek, MdPerson } from 'react-icons/md';
import { AttendanceContext } from '../AttendanceContext'; // Ensure this path is correct

const BottomNav = () => {
  const { darkMode } = useContext(AttendanceContext);

  const navStyle = {
    position: 'fixed', 
    bottom: 0, 
    left: 0, 
    right: 0,
    // BACKGROUND CHANGE:
    backgroundColor: darkMode ? '#1e293b' : 'white', 
    padding: '12px 30px',
    display: 'flex', 
    justifyContent: 'space-between',
    // SHADOW CHANGE:
    boxShadow: darkMode ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.08)', 
    zIndex: 1000,
    borderTopLeftRadius: '20px', 
    borderTopRightRadius: '20px',
    maxWidth: '480px', 
    margin: '0 auto',
    // BORDER CHANGE:
    borderTop: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
  };

  const linkStyle = ({ isActive }) => ({
    // ICON COLOR CHANGE: 
    // Active is blue, Inactive depends on Dark Mode
    color: isActive ? '#4285F4' : (darkMode ? '#64748b' : '#dadce0'),
    fontSize: '28px',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  });

  return (
    <div style={navStyle}>
      <NavLink to="/dashboard" style={linkStyle}><MdHome /></NavLink>
      <NavLink to="/timetable" style={linkStyle}><MdViewWeek /></NavLink>
      <NavLink to="/calendar" style={linkStyle}><MdCalendarMonth /></NavLink>
      <NavLink to="/profile" style={linkStyle}><MdPerson /></NavLink>
    </div>
  );
};

export default BottomNav;