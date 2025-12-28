import React, { useContext, useState, useEffect } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import BottomNav from '../components/BottomNav';
import toast from 'react-hot-toast';
import { MdSettings, MdDelete, MdRefresh, MdLogout, MdSchool, MdClass, MdEdit, MdCheck, MdClose, MdDarkMode, MdLightMode } from 'react-icons/md';

const Profile = () => {
  
  const { user, setUser, attendanceCap, setAttendanceCap, setSubjects, setTimetable, darkMode, setDarkMode } = useContext(AttendanceContext);

  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    branch: user.branch,
    year: user.year
  });

  
  useEffect(() => {
    setFormData({ name: user.name, branch: user.branch, year: user.year });
  }, [user]);

 
  const handleSaveProfile = () => {
    if (!formData.name.trim()) return toast.error("Name cannot be empty");
    setUser({ ...user, ...formData });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setFormData({ name: user.name, branch: user.branch, year: user.year });
    setIsEditing(false);
  };

  
  const handleResetSubjects = () => {
    if (window.confirm("Are you sure you want to delete ALL subjects? This cannot be undone.")) {
      setSubjects([]);
      setTimetable({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
      toast.success("All subjects cleared!");
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm("⚠️ WARNING: This will delete EVERYTHING (Name, Data, Subjects). The app will restart. Are you sure?")) {
      localStorage.clear();
      window.location.reload(); 
    }
  };

  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false });
    toast.success("Logged out successfully");
  };

  
  const colors = {
    text: darkMode ? '#f1f5f9' : '#1e293b',
    subText: darkMode ? '#94a3b8' : '#64748b',
    cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    cardBorder: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.6)',
    inputBg: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255,255,255,0.5)',
    resetBg: darkMode ? 'rgba(69, 10, 10, 0.4)' : 'rgba(254, 242, 242, 0.6)',
    buttonBg: darkMode ? '#1e293b' : 'white'
  };

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '25px', fontWeight: '800', color: colors.text, fontSize: '28px' }}>My Profile</h2>

      {/* --- 1. USER DETAILS CARD --- */}
      <div className="glass-card" style={{ padding: '30px', marginBottom: '20px', textAlign: 'center', position: 'relative', background: colors.cardBg, border: colors.cardBorder }}>
        
        {/* EDIT BUTTONS */}
        {!isEditing ? (
            <button onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6366f1', padding: '5px' }}>
                <MdEdit size={22} />
            </button>
        ) : (
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                <button onClick={handleSaveProfile} style={{ background: '#10b981', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><MdCheck size={18}/></button>
                <button onClick={handleCancelEdit} style={{ background: '#ef4444', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><MdClose size={18}/></button>
            </div>
        )}
        
        {/* Avatar */}
        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '24px', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: 'white', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)' }}>
          {formData.name?.charAt(0).toUpperCase()}
        </div>
        
        {/* Name Field */}
        {isEditing ? (
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ textAlign: 'center', fontSize: '18px', fontWeight: '700', marginBottom: '5px', width: '80%', padding: '8px', background: colors.inputBg, color: colors.text, border: 'none', borderRadius: '8px' }} autoFocus />
        ) : (
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: colors.text, marginBottom: '5px' }}>{user.name}</h2>
        )}

        <p style={{ color: colors.subText, fontSize: '14px', fontWeight: '500', marginBottom: '25px' }}>Student Profile</p>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
            <div style={{ background: colors.inputBg, padding: '15px', borderRadius: '16px', border: colors.cardBorder }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'#6366f1', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', marginBottom:'6px', letterSpacing: '0.5px' }}><MdSchool size={16} /> Course</div>
                {isEditing ? (
                    <input type="text" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} style={{ padding: '6px', fontSize: '13px', fontWeight: '600', width: '100%', background: 'transparent', color: colors.text, border: '1px solid #6366f1', borderRadius: '6px' }} />
                ) : (
                    <div style={{ color: colors.text, fontWeight: '600', fontSize: '15px' }}>{user.branch || 'Not Set'}</div>
                )}
            </div>

            <div style={{ background: colors.inputBg, padding: '15px', borderRadius: '16px', border: colors.cardBorder }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'#6366f1', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', marginBottom:'6px', letterSpacing: '0.5px' }}><MdClass size={16} /> Year</div>
                {isEditing ? (
                    <input type="text" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} style={{ padding: '6px', fontSize: '13px', fontWeight: '600', width: '100%', background: 'transparent', color: colors.text, border: '1px solid #6366f1', borderRadius: '6px' }} />
                ) : (
                    <div style={{ color: colors.text, fontWeight: '600', fontSize: '15px' }}>{user.year || 'Not Set'}</div>
                )}
            </div>
        </div>
      </div>

      {/* --- 2. SETTINGS CARD --- */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '20px', background: colors.cardBg, border: colors.cardBorder }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.text, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdSettings color="#64748b"/> App Settings
        </h3>
        
        {/* Attendance Slider */}
        <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: colors.subText, fontWeight: '500' }}>Target Percentage</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1' }}>{attendanceCap}%</span>
            </div>
            <input type="range" min="0" max="100" value={attendanceCap} onChange={(e) => setAttendanceCap(Number(e.target.value))} style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer', margin: 0 }} />
        </div>

        {/* --- DARK MODE TOGGLE --- */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {darkMode ? <MdDarkMode color="#6366f1" size={20} /> : <MdLightMode color="#f59e0b" size={20} />}
                <span style={{ fontSize: '14px', color: colors.text, fontWeight: '500' }}>Dark Mode</span>
            </div>
            
            {/* Toggle Switch */}
            <div 
                onClick={() => setDarkMode(!darkMode)}
                style={{ 
                    width: '46px', height: '24px', 
                    background: darkMode ? '#6366f1' : '#cbd5e1', 
                    borderRadius: '30px', position: 'relative', cursor: 'pointer', transition: '0.3s' 
                }}
            >
                <div style={{ 
                    width: '18px', height: '18px', background: 'white', borderRadius: '50%', 
                    position: 'absolute', top: '3px', left: darkMode ? '25px' : '3px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
                }} />
            </div>
        </div>
      </div>

      {/* --- 3. RESET ZONE --- */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', border: '1px solid #fecaca', background: colors.resetBg }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Reset
        </h3>
        <button onClick={handleResetSubjects} style={{ width: '100%', padding: '12px', background: colors.buttonBg, color: '#e11d48', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', transition: '0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <MdDelete size={18} /> Reset Subjects Only
        </button>
        <button onClick={handleFactoryReset} style={{ width: '100%', padding: '12px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.2s', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.2)' }}>
            <MdRefresh size={18} /> Reset Entire App
        </button>
      </div>

      {/* CREDITS */}
      <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '12px', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Designed by Shreeyesh
      </p>

      {/* Logout Button */}
      <button onClick={handleLogout} style={{ width: '100%', padding: '15px', background: colors.buttonBg, color: colors.subText, border: colors.cardBorder, borderRadius: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <MdLogout size={20} /> Log Out
      </button>

      <BottomNav />
    </div>
  );
};

export default Profile;