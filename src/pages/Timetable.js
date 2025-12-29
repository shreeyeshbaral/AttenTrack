import React, { useContext, useState } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import BottomNav from '../components/BottomNav';
import { MdAdd, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';

const Timetable = () => {
  const { timetable, subjects, addToTimetable, removeFromTimetable, darkMode } = useContext(AttendanceContext);
  
  const [day, setDay] = useState('Monday');
  const [selectedSub, setSelectedSub] = useState('');
  const [activeSubject, setActiveSubject] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const colors = {
    text: darkMode ? '#f1f5f9' : '#1e293b',
    subText: darkMode ? '#94a3b8' : '#64748b',
    cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    cardBorder: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.6)',
    inputBg: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'white',
    inputBorder: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    chipBg: darkMode ? '#334155' : '#e0e7ff',
    chipText: darkMode ? '#e2e8f0' : '#4338ca',
    activeChipBg: '#6366f1',
    activeChipText: 'white'
  };

  const handleAdd = () => {
    if (selectedSub && day) {
      addToTimetable(day, selectedSub);
      toast.success(`Added to ${day}!`);
      setActiveSubject(null); 
    }
  };

  const handleRemove = (dayName, index, e) => {
    e.stopPropagation(); 
    removeFromTimetable(dayName, index);
    toast.success("Removed class");
    setActiveSubject(null); 
  };

  const handleChipClick = (dayName, index) => {
    if (activeSubject && activeSubject.day === dayName && activeSubject.index === index) {
      setActiveSubject(null);
    } else {
      setActiveSubject({ day: dayName, index: index });
    }
  };

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '25px', fontWeight: '800', color: colors.text, fontSize: '28px' }}>Weekly Timetable</h2>

      {/* --- 1. ADD SECTION --- */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', background: colors.cardBg, border: colors.cardBorder }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#6366f1', marginBottom: '15px' }}>Add Class to Schedule</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <select 
            value={day} 
            onChange={(e) => setDay(e.target.value)}
            style={{ padding: '12px', borderRadius: '12px', border: colors.inputBorder, background: colors.inputBg, color: colors.text, outline: 'none' }}
          >
            {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            value={selectedSub} 
            onChange={(e) => setSelectedSub(e.target.value)}
            style={{ padding: '12px', borderRadius: '12px', border: colors.inputBorder, background: colors.inputBg, color: colors.text, outline: 'none' }}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
          </select>

          <button onClick={handleAdd} disabled={!selectedSub} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: !selectedSub ? 0.6 : 1 }}>
            <MdAdd size={20} /> Add to {day}
          </button>
        </div>
      </div>

      {/* --- 2. DISPLAY SECTION (Interactive Chips) --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '100px' }}>
        {daysOfWeek.map(dayName => (
          <div key={dayName} className="glass-card" style={{ padding: '20px', borderRadius: '20px', background: colors.cardBg, border: colors.cardBorder }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: '700', color: colors.text }}>{dayName}</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {timetable[dayName] && timetable[dayName].length > 0 ? (
                timetable[dayName].map((subId, index) => {
                  
                  // --- FIX: LOOKUP SUBJECT NAME BY ID ---
                  const subjectObj = subjects.find(s => s.id === subId);
                  const displayName = subjectObj ? subjectObj.name : "Unknown";

                  const isActive = activeSubject && activeSubject.day === dayName && activeSubject.index === index;

                  return (
                    <div 
                        key={index} 
                        onClick={() => handleChipClick(dayName, index)} 
                        style={{ 
                            background: isActive ? colors.activeChipBg : colors.chipBg, 
                            color: isActive ? colors.activeChipText : colors.chipText, 
                            padding: '8px 14px', 
                            borderRadius: '12px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.4)' : '0 2px 5px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: isActive ? 'none' : `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                        }}
                    >
                      {/* --- SHOW THE NAME, NOT THE ID --- */}
                      {displayName}

                      {isActive && (
                        <MdClose 
                            size={18} 
                            style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '2px' }} 
                            onClick={(e) => handleRemove(dayName, index, e)}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <span style={{ color: colors.subText, fontSize: '13px', fontStyle: 'italic' }}>Free Day</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Timetable;