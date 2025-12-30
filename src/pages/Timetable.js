import React, { useContext, useState } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import BottomNav from '../components/BottomNav';
import { MdAdd, MdClose, MdKeyboardArrowDown, MdCalendarToday, MdCheckCircleOutline, MdRadioButtonUnchecked } from 'react-icons/md';
import toast from 'react-hot-toast';

const Timetable = () => {
  const { timetable, subjects, addToTimetable, removeFromTimetable, darkMode } = useContext(AttendanceContext);
  
  const [day, setDay] = useState('Monday');
  const [selectedSubs, setSelectedSubs] = useState([]); 
  const [showMultiSelect, setShowMultiSelect] = useState(false); 
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

  const toggleSubject = (id) => {
    if (selectedSubs.includes(id)) {
      setSelectedSubs(selectedSubs.filter(subId => subId !== id));
    } else {
      setSelectedSubs([...selectedSubs, id]);
    }
  };

  const handleAdd = () => {
    if (selectedSubs.length > 0 && day) {
      selectedSubs.forEach(subId => {
        addToTimetable(day, subId);
      });
      toast.success(`Added ${selectedSubs.length} classes to ${day}!`);
      setSelectedSubs([]); 
      setShowMultiSelect(false); 
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
    <div className="page-container" style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
      <style>{`
        .day-pill-container { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
        .day-pill-container::-webkit-scrollbar { display: none; }
        .day-pill { padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; background: ${colors.inputBg}; color: ${colors.subText}; border: ${colors.cardBorder}; white-space: nowrap; }
        .day-pill.active { background: ${colors.accent}; color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); border-color: ${colors.accent}; }
        
        .fake-select-trigger { 
          width: 100%; 
          padding: 12px 16px; 
          border-radius: 14px; 
          border: ${colors.cardBorder}; 
          background: ${colors.inputBg}; 
          color: ${selectedSubs.length > 0 ? colors.text : colors.subText}; 
          font-size: 15px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          cursor: pointer;
          transition: border 0.3s ease;
        }
        
        /* FIX: High z-index to ensure dropdown stays on top of cards below */
        .multi-dropdown-list { 
          border-radius: 14px; 
          background: ${darkMode ? '#1e293b' : '#fff'}; 
          border: ${colors.cardBorder}; 
          margin-top: 8px; 
          max-height: 200px; 
          overflow-y: auto; 
          padding: 8px; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.2); 
          position: absolute;
          width: 100%;
          z-index: 1000; 
        }

        .subject-item { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 10px 14px; 
          border-radius: 10px; 
          margin-bottom: 4px; 
          cursor: pointer; 
          color: ${colors.text}; 
          transition: background 0.2s ease;
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
          width: 100%;
        }
        .btn-add:active { transform: scale(0.96); }
      `}</style>

      <h2 style={{ marginBottom: '25px', fontWeight: '800', color: colors.text, fontSize: '26px', letterSpacing: '-0.5px' }}>Weekly Timetable</h2>

      {/* FIX: Parent card needs relative positioning and z-index to manage children depth */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', background: colors.cardBg, border: colors.cardBorder, borderRadius: '24px', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <MdCalendarToday color={colors.accent} size={18} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: colors.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assign Classes</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div className="day-pill-container">
            {daysOfWeek.map(d => (
              <div key={d} className={`day-pill ${day === d ? 'active' : ''}`} onClick={() => setDay(d)}>{d}</div>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <div className="fake-select-trigger" onClick={() => setShowMultiSelect(!showMultiSelect)}>
              <span>
                {selectedSubs.length > 0 
                  ? `${selectedSubs.length} Subjects Selected` 
                  : 'Select Subjects'}
              </span>
              <MdKeyboardArrowDown 
                size={22} 
                style={{ 
                  transform: showMultiSelect ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: '0.3s',
                  color: colors.subText 
                }} 
              />
            </div>

            {showMultiSelect && (
              <div className="multi-dropdown-list">
                {subjects.length > 0 ? (
                  subjects.map(sub => (
                    <div 
                      key={sub.id} 
                      className="subject-item" 
                      onClick={() => toggleSubject(sub.id)} 
                      style={{ background: selectedSubs.includes(sub.id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}
                    >
                      <span style={{ fontSize: '14px' }}>{sub.name}</span>
                      {selectedSubs.includes(sub.id) ? (
                        <MdCheckCircleOutline color={colors.accent} size={20} />
                      ) : (
                        <MdRadioButtonUnchecked color={colors.subText} size={20} />
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '15px', textAlign: 'center', color: colors.subText, fontSize: '13px' }}>
                    Add subjects in the subjects page first.
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={handleAdd} 
            disabled={selectedSubs.length === 0} 
            className="btn-add" 
            style={{ opacity: selectedSubs.length === 0 ? 0.5 : 1 }}
          >
            <MdAdd size={20} /> Add to {day}
          </button>
        </div>
      </div>

      {/* FIX: Ensure the display list below has a lower z-index than the dropdown above */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '100px', position: 'relative', zIndex: 1 }}>
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