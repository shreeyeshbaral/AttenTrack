import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AttendanceContext } from './AttendanceContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { setUser } = useContext(AttendanceContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [type, setType] = useState('college'); 
  const [course, setCourse] = useState(''); 
  const [year, setYear] = useState('1st Year');
  const [standard, setStandard] = useState('10th Grade');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const finalBranch = type === 'college' ? course : `${standard}`;
    const finalYear = type === 'college' ? year : 'School Student';

    // 1. Create the user object
    const userData = { 
      name: name, 
      branch: finalBranch || (type === 'college' ? 'College Student' : 'Student'), 
      year: finalYear, 
      isLoggedIn: true 
    };

    // 2. SAVE TO LOCAL STORAGE (Crucial for fixing the loop)
    // Ensure these keys match exactly what your App.js and Context.js check for
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData)); 

    // 3. Save to Context
    setUser(userData);

    // 4. Navigate and Toast
    navigate('/dashboard');
    toast.success(`Welcome, ${name}!`);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '340px', textAlign: 'center' }}>
        
        <div style={{ 
          width: '64px', height: '64px', 
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
          borderRadius: '20px', margin: '0 auto 20px auto', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '32px', fontWeight: '800', color: 'white',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          A
        </div>

        <h1 style={{ 
          fontSize: '28px', fontWeight: '800', color: '#1e293b', 
          marginBottom: '5px', fontFamily: "'Poppins', sans-serif", 
          letterSpacing: '-0.5px'
        }}>
          AttenTrack
        </h1>
        
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px', fontWeight: '500' }}>
          Track your attendance like a pro.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginLeft: '5px', marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. Aryan" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.5)', padding: '5px', borderRadius: '14px', display: 'flex', border: '1px solid rgba(255,255,255,0.6)', marginTop: '5px' }}>
            <button 
              type="button"
              onClick={() => setType('college')}
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: type === 'college' ? 'white' : 'transparent', color: type === 'college' ? '#6366f1' : '#94a3b8', fontWeight: '700', cursor: 'pointer', boxShadow: type === 'college' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
            >
              College
            </button>
            <button 
              type="button"
              onClick={() => setType('school')}
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: type === 'school' ? 'white' : 'transparent', color: type === 'school' ? '#6366f1' : '#94a3b8', fontWeight: '700', cursor: 'pointer', boxShadow: type === 'school' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
            >
              School
            </button>
          </div>

          {type === 'college' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginLeft: '5px', marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>COURSE / BRANCH</label>
                <input 
                  type="text" 
                  placeholder="e.g. B.Tech CSE" 
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginLeft: '5px', marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>YEAR</label>
                <select 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>5th Year</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginLeft: '5px', marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>STANDARD / CLASS</label>
              <select 
                value={standard} 
                onChange={(e) => setStandard(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              >
                <option>8th Grade</option>
                <option>9th Grade</option>
                <option>10th Grade</option>
                <option>11th Grade</option>
                <option>12th Grade</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Enter Dashboard &rarr;
          </button>

        </form>
      </div>
      
      <p style={{ marginTop: '25px', color: '#94a3b8', fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px' }}>
        Designed by Shreeyesh
      </p>
    </div>
  );
};

export default Login;