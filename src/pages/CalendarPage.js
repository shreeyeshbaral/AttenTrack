import React, { useState, useContext } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AttendanceContext } from '../AttendanceContext';
import BottomNav from '../components/BottomNav';
import { format } from 'date-fns';
import { MdCheck, MdClose, MdRemove } from 'react-icons/md';

const CalendarPage = () => {
  
  const { timetable, markAttendance, subjects, darkMode } = useContext(AttendanceContext);
  const [date, setDate] = useState(new Date());
  const [selectedDaySubjects, setSelectedDaySubjects] = useState([]);
  const [animatingId, setAnimatingId] = useState(null);

  
  const colors = {
    text: darkMode ? '#f1f5f9' : '#1e293b',
    subText: darkMode ? '#94a3b8' : '#64748b',
    sectionTitle: darkMode ? '#cbd5e1' : '#94a3b8',
    cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    cardBorder: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.6)',
    cardText: darkMode ? '#e2e8f0' : '#334155',
  };

  const onDateChange = (newDate) => {
    setDate(newDate);
    const dayOfWeek = format(newDate, 'EEEE');
    const subjectNames = timetable[dayOfWeek] || [];
    const daySubjects = subjects.filter(s => subjectNames.includes(s.id));
    setSelectedDaySubjects(daySubjects);
  };

  const handleMark = (id, status, type) => {
    setAnimatingId(`${id}-${type}`);
    markAttendance(id, status);
    setTimeout(() => setAnimatingId(null), 200);
  };

  const getBtnStyle = (type, id) => {
    const isAnimating = animatingId === `${id}-${type}`;
    const baseStyle = {
      width: '45px', height: '45px', borderRadius: '14px', border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      transition: 'all 0.2s',
      transform: isAnimating ? 'scale(0.85)' : 'scale(1)',
      fontSize: '20px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    };
    
    if (type === 'present') {
        return { 
            ...baseStyle, 
            background: isAnimating ? '#10b981' : (darkMode ? 'rgba(6, 78, 59, 0.6)' : '#ecfdf5'), 
            color: isAnimating ? 'white' : (darkMode ? '#34d399' : '#10b981') 
        };
    }
    if (type === 'absent') {
        return { 
            ...baseStyle, 
            background: isAnimating ? '#ef4444' : (darkMode ? 'rgba(127, 29, 29, 0.6)' : '#fef2f2'), 
            color: isAnimating ? 'white' : (darkMode ? '#f87171' : '#ef4444') 
        };
    }
    // Cancelled / Default
    return { 
        ...baseStyle, 
        background: isAnimating ? '#64748b' : (darkMode ? '#334155' : '#f1f5f9'), 
        color: isAnimating ? 'white' : (darkMode ? '#94a3b8' : '#64748b') 
    };
  };

  return (
    <div className="page-container">
       {/* --- CSS OVERRIDES FOR DARK MODE --- */}
       {darkMode && (
        <style>{`
          .react-calendar {
            background-color: transparent !important;
            border: none !important;
            color: #f1f5f9 !important;
            font-family: inherit;
            width: 100%;
          }
          .react-calendar__navigation button {
            color: #f1f5f9 !important;
            font-size: 16px;
            font-weight: 700;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: rgba(255,255,255,0.1) !important;
            border-radius: 8px;
          }
          .react-calendar__month-view__days__day {
            color: #cbd5e1 !important;
          }
          .react-calendar__month-view__days__day--weekend {
            color: #ef4444 !important;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: rgba(99, 102, 241, 0.2) !important;
            border-radius: 8px;
            color: #818cf8 !important;
          }
          .react-calendar__tile--now {
            background: rgba(245, 158, 11, 0.2) !important;
            color: #fbbf24 !important;
            border-radius: 8px;
          }
          .react-calendar__tile--active {
            background: #6366f1 !important;
            color: white !important;
            border-radius: 8px;
          }
          .react-calendar__month-view__weekdays__weekday abbr {
             text-decoration: none;
             color: #94a3b8;
             font-weight: 600;
          }
        `}</style>
      )}

      {/* --- STANDARD CSS OVERRIDES (Rounded look) --- */}
      <style>{`
         .react-calendar {
            border: none;
            width: 100%;
            font-family: inherit;
         }
         .react-calendar__tile {
            padding: 15px 0;
            font-weight: 600;
            font-size: 14px;
         }
         .react-calendar__navigation {
            margin-bottom: 20px;
         }
      `}</style>

      <h2 style={{ marginBottom: '20px', fontWeight: '800', color: colors.text }}>Calendar</h2>
      
      {/* Calendar container */}
      <div className="glass-card" style={{ marginBottom: '30px', padding: '20px', background: colors.cardBg, border: colors.cardBorder }}>
        <ReactCalendar onChange={onDateChange} value={date} className={darkMode ? "" : "light-mode-calendar"} />
      </div>

      <h3 style={{ marginBottom: '15px', color: colors.sectionTitle, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>
        Classes for {format(date, 'dd MMM')}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {selectedDaySubjects.length > 0 ? (
          selectedDaySubjects.map(sub => (
            <div key={sub.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: colors.cardBg, border: colors.cardBorder }}>
              <span style={{ fontWeight: '600', fontSize: '16px', color: colors.cardText }}>{sub.name}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleMark(sub.id, 'present', 'present')} style={getBtnStyle('present', sub.id)}><MdCheck /></button>
                <button onClick={() => handleMark(sub.id, 'absent', 'absent')} style={getBtnStyle('absent', sub.id)}><MdClose /></button>
                <button onClick={() => handleMark(sub.id, 'cancelled', 'cancelled')} style={getBtnStyle('cancelled', sub.id)}><MdRemove /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: colors.subText, background: colors.cardBg, border: colors.cardBorder }}>
            <p>No classes scheduled.</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default CalendarPage;