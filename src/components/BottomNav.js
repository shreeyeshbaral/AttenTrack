import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdHome, MdCalendarMonth, MdViewWeek, MdPerson } from 'react-icons/md';

const BottomNav = () => {
  const navStyle = {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    backgroundColor: 'white', padding: '12px 30px',
    display: 'flex', justifyContent: 'space-between',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 1000,
    borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
    maxWidth: '480px', margin: '0 auto'
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#4285F4' : '#dadce0',
    fontSize: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none'
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