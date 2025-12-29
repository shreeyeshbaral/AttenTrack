import React, { useState, useContext, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AttendanceContext } from '../AttendanceContext';
import BottomNav from '../components/BottomNav';
import { format } from 'date-fns';
import { MdCheck, MdClose, MdRemove } from 'react-icons/md';

const CalendarPage = () => {
  const { timetable, markAttendance, subjects, darkMode, attendanceHistory } = useContext(AttendanceContext);
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

  useEffect(() => {
    const dayOfWeek = format(date, 'EEEE');
    const scheduledIds = timetable[dayOfWeek] || [];
    
    const dayClasses = scheduledIds.map((id, index) => {
      const subjectData = subjects.find(s => s.id === id);
      return subjectData ? { ...subjectData, instanceId: `${id}-${index}` } : null;
    }).filter(Boolean);

    setSelectedDaySubjects(dayClasses);
  }, [date, timetable, subjects]);

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleMark = (id, status, type, instanceId) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setAnimatingId(`${instanceId}-${type}`);
    markAttendance(id, status, dateKey, instanceId);
    setTimeout(() => setAnimatingId(null), 200);
  };

  const getBtnStyle = (type, instanceId) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const historyKey = `${dateKey}-${instanceId}`;
    const currentStatus = attendanceHistory[historyKey] || 'none';
    
    const isActive = currentStatus === type;
    const isAnimating = animatingId === `${instanceId}-${type}`;

    const baseStyle = {
      width: '45px', height: '45px', borderRadius: '14px', border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      transition: 'all 0.2s',
      transform: isAnimating ? 'scale(0.85)' : 'scale(1)',
      fontSize: '20px',
      boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 10px rgba(0,0,0,0.05)',
      fontWeight: isActive ? '900' : '400'
    };
    
    if (type === 'present') {
        return { 
            ...baseStyle, 
            background: isActive || isAnimating ? '#10b981' : (darkMode ? 'rgba(6, 78, 59, 0.4)' : '#ecfdf5'), 
            color: isActive || isAnimating ? 'white' : (darkMode ? '#34d399' : '#10b981'),
            border: isActive ? 'none' : `1px solid ${darkMode ? '#065f46' : '#a7f3d0'}`,
            opacity: isActive ? 1 : 0.8
        };
    }
    if (type === 'absent') {
        return { 
            ...baseStyle, 
            background: isActive || isAnimating ? '#ef4444' : (darkMode ? 'rgba(127, 29, 29, 0.4)' : '#fef2f2'), 
            color: isActive || isAnimating ? 'white' : (darkMode ? '#f87171' : '#ef4444'),
            border: isActive ? 'none' : `1px solid ${darkMode ? '#7f1d1d' : '#fecaca'}`,
            opacity: isActive ? 1 : 0.8
        };
    }
    
    return { 
        ...baseStyle, 
        background: isActive || isAnimating ? '#64748b' : (darkMode ? '#334155' : '#f1f5f9'), 
        color: isActive || isAnimating ? 'white' : (darkMode ? '#94a3b8' : '#64748b'),
        border: isActive ? 'none' : `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
        opacity: isActive ? 1 : 0.8
    };
  };

  return (
    <div className="page-container">
       {darkMode && (
        <style>{`
          .react-calendar { background-color: transparent !important; border: none !important; color: #f1f5f9 !important; font-family: inherit; width: 100%; }
          .react-calendar__navigation button { color: #f1f5f9 !important; font-size: 16px; font-weight: 700; }
          .react-calendar__month-view__days__day { color: #cbd5e1 !important; }
          .react-calendar__month-view__days__day--weekend { color: #ef4444 !important; }
          
          /* FIX: Visibility for current date (now) in Dark Mode */
          .react-calendar__tile--now { 
            background: rgba(99, 102, 241, 0.25) !important; 
            color: #ffffff !important; 
            border: 1px solid #6366f1 !important;
            border-radius: 8px;
          }
          
          .react-calendar__tile--active { background: #6366f1 !important; color: white !important; border-radius: 8px; }
          .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; color: #94a3b8; font-weight: 600; }
        `}</style>
      )}

      <style>{`
          .react-calendar { border: none; width: 100%; font-family: inherit; }
          .react-calendar__tile { padding: 15px 0; font-weight: 600; font-size: 14px; }
          .react-calendar__navigation { margin-bottom: 20px; }
      `}</style>

      <h2 style={{ marginBottom: '20px', fontWeight: '800', color: colors.text }}>Calendar</h2>
      
      <div className="glass-card" style={{ marginBottom: '30px', padding: '20px', background: colors.cardBg, border: colors.cardBorder }}>
        <ReactCalendar onChange={onDateChange} value={date} />
      </div>

      <h3 style={{ marginBottom: '15px', color: colors.sectionTitle, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>
        Classes for {format(date, 'dd MMM')}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '100px' }}>
        {selectedDaySubjects.length > 0 ? (
          selectedDaySubjects.map((sub) => (
            <div key={sub.instanceId} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: colors.cardBg, border: colors.cardBorder }}>
              <span style={{ fontWeight: '600', fontSize: '16px', color: colors.cardText }}>{sub.name}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleMark(sub.id, 'present', 'present', sub.instanceId)} 
                  style={getBtnStyle('present', sub.instanceId)}
                >
                  <MdCheck />
                </button>
                <button 
                  onClick={() => handleMark(sub.id, 'absent', 'absent', sub.instanceId)} 
                  style={getBtnStyle('absent', sub.instanceId)}
                >
                  <MdClose />
                </button>
                <button 
                  onClick={() => handleMark(sub.id, 'cancelled', 'cancelled', sub.instanceId)} 
                  style={getBtnStyle('cancelled', sub.instanceId)}
                >
                  <MdRemove />
                </button>
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