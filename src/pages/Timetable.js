import React, { useContext, useState } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import BottomNav from '../components/BottomNav';
import { MdAdd, MdClose, MdKeyboardArrowDown, MdCalendarToday } from 'react-icons/md';
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
    cardBg: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)',
    cardBorder: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
    inputBg: darkMode ? 'rgba(15, 23, 42, 0.3)' : '#f8fafc',
    accent: '#6366f1',
    chipBg: darkMode ? '#334155' : '#e0e7ff',
    chipText: darkMode ? '#e2e8f0' : '#4338ca',
  };

  const handleAdd = () => {
    if (selectedSub && day) {
      addToTimetable(day, selectedSub);
      toast.success(`Added to ${day}!`);
      setSelectedSub(''); // Clear selection after adding
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
    <div className="page-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <style>{`
        .day-pill-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
          scrollbar-width: none;
        }
        .day-pill-container::-webkit-scrollbar { display: none; }
        
        .day-pill {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: ${colors.inputBg};
          color: ${colors.subText};
          border: ${colors.cardBorder};
          white-space: nowrap;
        }
        .day-pill.active {
          background: ${colors.accent};
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          border-color: ${colors.accent};
        }

        .custom-select-container {
          position: relative;
          width: 100%;
        }
        .custom-select {
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          border: ${colors.cardBorder};
          background: ${colors.inputBg};
          color: ${colors.text};
          outline: none;
          appearance: none;
          font-size: 15px;
          transition: border 0.3s ease;
        }
        .custom-select:focus { border-color: ${colors.accent}; }
        
        .select-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: ${colors.subText};
        }

        .btn-add {
          background: ${colors.accent};
          color: white;
          border: none;
          padding: 14px;
          border-radius: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .btn-add:active { transform: scale(0.96); }
      `}</style>

      <h2 style={{ marginBottom: '25px', fontWeight: '800', color: colors.text, fontSize: '26px', letterSpacing: '-0.5px' }}>Weekly Timetable</h2>

      {/* --- 1. PREMIUM ADD SECTION --- */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', background: colors.cardBg, border: colors.cardBorder, borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <MdCalendarToday color={colors.accent} size={18} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: colors.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assign Classes</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Minimalist Day Pills */}
          <div className="day-pill-container">
            {daysOfWeek.map(d => (
              <div 
                key={d} 
                className={`day-pill ${day === d ? 'active' : ''}`}
                onClick={() => setDay(d)}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Subject Select with Custom Chevron */}
          <div className="custom-select-container">
            <select 
              className="custom-select"
              value={selectedSub} 
              onChange={(e) => setSelectedSub(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </select>
            <MdKeyboardArrowDown className="select-icon" size={20} />
          </div>

          <button onClick={handleAdd} disabled={!selectedSub} className="btn-add" style={{ opacity: !selectedSub ? 0.5 : 1 }}>
            <MdAdd size={20} /> Add to {day}
          </button>
        </div>
      </div>

      {/* --- 2. DISPLAY SECTION --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '100px' }}>
        {daysOfWeek.map(dayName => (
          <div key={dayName} className="glass-card" style={{ padding: '16px 20px', borderRadius: '20px', background: colors.cardBg, border: colors.cardBorder }}>
            <h3 style={{ fontSize: '15px', marginBottom: '12px', fontWeight: '700', color: colors.text, opacity: 0.9 }}>{dayName}</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {timetable[dayName] && timetable[dayName].length > 0 ? (
                timetable[dayName].map((subId, index) => {
                  const subjectObj = subjects.find(s => s.id === subId);
                  const displayName = subjectObj ? subjectObj.name : "Unknown";
                  const isActive = activeSubject && activeSubject.day === dayName && activeSubject.index === index;

                  return (
                    <div 
                        key={index} 
                        onClick={() => handleChipClick(dayName, index)} 
                        style={{ 
                            background: isActive ? colors.accent : (darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'), 
                            color: isActive ? 'white' : colors.text, 
                            padding: '8px 14px', 
                            borderRadius: '12px', 
                            fontSize: '13px', 
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: isActive ? 'none' : colors.cardBorder
                        }}
                    >
                      {displayName}
                      {isActive && (
                        <MdClose 
                            size={16} 
                            style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '2px' }} 
                            onClick={(e) => handleRemove(dayName, index, e)}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <span style={{ color: colors.subText, fontSize: '12px', fontWeight: '500' }}>No classes scheduled</span>
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