import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { AttendanceContext } from '../AttendanceContext';
import BottomNav from '../components/BottomNav';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MdClose, MdChevronRight, MdAdd, MdDeleteOutline } from 'react-icons/md'; // Added MdDeleteOutline

const Dashboard = () => {
  // Added 'deleteSubject' to the destructuring from context
  const { user, subjects, attendanceCap, addNewSubject, deleteSubject, darkMode } = useContext(AttendanceContext);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubName, setNewSubName] = useState("");

  const colors = {
    text: darkMode ? '#f1f5f9' : '#312e81',
    subText: darkMode ? '#94a3b8' : '#64748b',
    headerBg: darkMode ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)',
    cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    modalBg: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    inputBg: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.5)',
    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.6)',
    cardText: darkMode ? '#e2e8f0' : '#334155',
    sectionTitle: darkMode ? '#cbd5e1' : '#94a3b8'
  };

  const getColor = (percent) => {
    if (percent >= attendanceCap) return '#10b981';
    return '#ef4444';
  };

  const getPrediction = (sub) => {
    if (sub.total === 0) {
      return (
        <div style={{ marginTop: '20px', padding: '15px', background: darkMode ? '#1e293b' : '#f1f5f9', borderRadius: '12px', border: darkMode ? '1px solid #334155' : '1px solid #cbd5e1', color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '13px', lineHeight: '1.5' }}>
          <strong>No Data Yet 🤷‍♂️</strong><br/>
          Mark attendance in the timetable to see your calculation.
        </div>
      );
    }

    const currentPercent = (sub.attended / sub.total) * 100;
    
    if (currentPercent >= attendanceCap) {
      const bunkable = Math.floor((100 * sub.attended - attendanceCap * sub.total) / attendanceCap);
      return (
        <div style={{ marginTop: '20px', padding: '15px', background: darkMode ? 'rgba(6, 78, 59, 0.4)' : '#ecfdf5', borderRadius: '12px', border: '1px solid #10b981', color: darkMode ? '#d1fae5' : '#065f46', fontSize: '13px', lineHeight: '1.5' }}>
          <strong>On Track! 🌴</strong><br/>
          You can skip the next <strong>{bunkable > 0 ? bunkable : 0}</strong> classes and stay safe.
        </div>
      );
    } else {
      const numerator = (attendanceCap * sub.total) - (100 * sub.attended);
      const denominator = 100 - attendanceCap;
      const needed = Math.ceil(numerator / denominator);
      
      return (
        <div style={{ marginTop: '20px', padding: '15px', background: darkMode ? 'rgba(127, 29, 29, 0.4)' : '#fef2f2', borderRadius: '12px', border: '1px solid #ef4444', color: darkMode ? '#fecaca' : '#991b1b', fontSize: '13px', lineHeight: '1.5' }}>
          <strong>Action Required 🚨</strong><br/>
          You need to attend <strong>{needed > 0 ? needed : 0}</strong> more classes to reach {attendanceCap}%.
        </div>
      );
    }
  };

  const handleAddSubject = () => {
    if (newSubName.trim()) {
      addNewSubject(newSubName);
      toast.success('Subject Added Successfully!');
      setNewSubName("");
      setIsAdding(false);
    }
  };

  // NEW: Handle Delete with Confirmation
  const handleDeleteClick = (e, id) => {
    e.stopPropagation(); // Prevents the modal from opening when clicking delete
    if (window.confirm("Delete this subject and all its data?")) {
      deleteSubject(id);
      toast.success('Subject Removed');
    }
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <header style={{ marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', borderRadius: '24px', background: colors.headerBg, border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: colors.text, fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
            Hi, {user.name} 👋
          </h1>
          <p style={{ color: darkMode ? '#818cf8' : '#6366f1', marginTop: '6px', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {user.branch}
          </p>
        </div>
        <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)', borderRadius: '18px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '24px', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.4)', border: '2px solid rgba(255,255,255,0.2)' }}>
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </header>

      {/* CONTROLS */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px', padding: '0 10px'}}>
        <h3 style={{ color: colors.sectionTitle, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>Your Subjects</h3>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} style={{background: darkMode ? '#1e293b' : 'white', border: colors.border, padding: '8px 16px', borderRadius:'30px', color:'#6366f1', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
            <MdAdd size={20}/> Add New
          </button>
        )}
      </div>

      {/* INPUT FORM */}
      {isAdding && (
        <div className="glass-card" style={{marginBottom: '20px', padding: '15px', display:'flex', gap:'10px', background: colors.cardBg, border: colors.border}}>
          <input autoFocus type="text" placeholder="Subject Name..." value={newSubName} onChange={(e) => setNewSubName(e.target.value)} style={{flex:1, background: colors.inputBg, color: colors.text, border: 'none', borderRadius: '8px', padding: '10px'}} />
          <button onClick={handleAddSubject} className="btn-primary" style={{width:'auto', padding: '0 20px'}}>Save</button>
          <button onClick={() => setIsAdding(false)} style={{background:'transparent', border:'none', color:'#ef4444', fontWeight:'600', cursor:'pointer'}}>Cancel</button>
        </div>
      )}
      
      {/* EMPTY STATE */}
      {subjects.length === 0 && !isAdding && (
        <div className="glass-card" style={{textAlign:'center', padding:'40px', color: colors.subText, background: colors.cardBg, border: colors.border}}>
          <p>No subjects yet. Click "Add New" to start!</p>
        </div>
      )}

      {/* SUBJECT LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {subjects.map(sub => {
          const percent = Math.round((sub.attended / sub.total) * 100) || 0;
          return (
            <div key={sub.id} className="glass-card glass-card-hover" onClick={() => setSelectedSubject(sub)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: colors.cardBg, border: colors.border, position: 'relative' }}>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px', fontWeight: '600', color: colors.cardText }}>{sub.name}</h3>
                <p style={{ fontSize: '13px', color: colors.subText }}>{sub.attended}/{sub.total} Classes</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: getColor(percent), fontWeight: '700', fontSize: '16px' }}>{percent}%</span>
                
                {/* DELETE BUTTON - Individual trash icon */}
                <div 
                  onClick={(e) => handleDeleteClick(e, sub.id)} 
                  style={{ cursor: 'pointer', padding: '4px', color: darkMode ? '#f87171' : '#ef4444' }}
                >
                  <MdDeleteOutline size={22} />
                </div>

                <MdChevronRight size={24} color={darkMode ? '#475569' : '#cbd5e1'} />
              </div>
            </div>
          );
        })}
      </div>

      {/* --- POPUP MODAL --- */}
      {selectedSubject && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)' }} onClick={() => setSelectedSubject(null)}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '320px', padding: '30px', textAlign: 'center', position: 'relative', background: colors.modalBg, border: colors.border }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedSubject(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: darkMode ? '#334155' : '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <MdClose size={18} color={darkMode ? '#cbd5e1' : '#64748b'}/>
            </button>
            <h2 style={{ fontSize: '20px', marginBottom: '5px', fontWeight: '700', color: colors.text }}>{selectedSubject.name}</h2>
            
            <div style={{ width: '160px', height: '160px', margin: '30px auto' }}>
              <CircularProgressbar
                value={selectedSubject.total === 0 ? 0 : (selectedSubject.attended / selectedSubject.total) * 100}
                text={selectedSubject.total === 0 ? 'N/A' : `${Math.round((selectedSubject.attended / selectedSubject.total) * 100)}%`}
                styles={buildStyles({
                  pathColor: getColor(selectedSubject.total === 0 ? 0 : (selectedSubject.attended / selectedSubject.total) * 100),
                  textColor: colors.text,
                  trailColor: darkMode ? '#334155' : '#f1f5f9',
                  textSize: '24px',
                  fontWeight: 'bold'
                })}
              />
            </div>
            
            <div style={{marginTop: '10px', fontSize: '14px', color: colors.subText}}>
                Status: {selectedSubject.total === 0 ? (
                   <strong style={{ color: colors.text }}>New</strong>
                ) : (
                  <strong style={{color: getColor((selectedSubject.attended / selectedSubject.total) * 100)}}>{(selectedSubject.attended / selectedSubject.total) * 100 >= attendanceCap ? 'Safe Zone' : 'Danger Zone'}</strong>
                )}
            </div>

            {getPrediction(selectedSubject)}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Dashboard;