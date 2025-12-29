import React, { createContext, useState, useEffect } from 'react';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  // SAFETY CHECK
  const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    try {
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`Bad data found for ${key}. Resetting to default.`);
      return defaultValue;
    }
  };

  // State
  const [user, setUser] = useState(getInitialData('user', { 
    name: 'Guest', year: '', branch: '', isLoggedIn: false 
  }));
  const [attendanceCap, setAttendanceCap] = useState(getInitialData('cap', 75));
  const [subjects, setSubjects] = useState(getInitialData('subjects', []));
  const [timetable, setTimetable] = useState(getInitialData('timetable', {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  }));
  
  const [attendanceHistory, setAttendanceHistory] = useState(getInitialData('attendanceHistory', {}));
  const [darkMode, setDarkMode] = useState(getInitialData('darkMode', false));

  // --- ACTIONS ---

  const addNewSubject = (name) => {
    const newSubject = { 
      id: Date.now().toString(), 
      name: name, 
      attended: 0, 
      total: 0 
    };
    setSubjects([...subjects, newSubject]);
  };

  const deleteSubject = (id) => {
    const updatedSubjects = subjects.filter(sub => sub.id !== id);
    setSubjects(updatedSubjects);
    
    const newTimetable = { ...timetable };
    Object.keys(newTimetable).forEach(day => {
      newTimetable[day] = newTimetable[day].filter(subId => subId !== id);
    });
    setTimetable(newTimetable);
  };

  // --- UPDATED LOGOUT FUNCTION ---
  const logout = () => {
    // 1. Remove ONLY the login flag so data stays in localStorage
    localStorage.removeItem('isLoggedIn');
    
    // 2. Update state to reflect logged out status
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    
    // 3. Redirect to login page
    window.location.href = "/"; 
  };

  const addToTimetable = (day, subjectId) => {
    const daySchedule = timetable[day] || [];
    const newSchedule = [...daySchedule, subjectId];
    setTimetable({ ...timetable, [day]: newSchedule });
  };

  const removeFromTimetable = (day, indexToRemove) => {
    const daySchedule = timetable[day] || [];
    const newSchedule = daySchedule.filter((_, index) => index !== indexToRemove);
    setTimetable({ ...timetable, [day]: newSchedule });
  };

  const markAttendance = (subjectId, status, dateKey, instanceId) => {
    const historyKey = `${dateKey}-${instanceId}`;
    const previousStatus = attendanceHistory[historyKey] || 'none';

    if (previousStatus === status) return;

    setSubjects(prevSubjects => prevSubjects.map(sub => {
      if (sub.id === subjectId) {
        let newAttended = sub.attended;
        let newTotal = sub.total;

        if (previousStatus === 'present') {
          newAttended = Math.max(0, newAttended - 1);
          newTotal = Math.max(0, newTotal - 1);
        } else if (previousStatus === 'absent') {
          newTotal = Math.max(0, newTotal - 1);
        }

        if (status === 'present') {
          newAttended += 1;
          newTotal += 1;
        } else if (status === 'absent') {
          newTotal += 1;
        }

        return { ...sub, attended: newAttended, total: newTotal };
      }
      return sub;
    }));

    setAttendanceHistory(prev => ({ ...prev, [historyKey]: status }));
  };

  // Save changes automatically
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('cap', JSON.stringify(attendanceCap));
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('timetable', JSON.stringify(timetable));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));

    if (darkMode) {
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.color = '#f1f5f9';
    } else {
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#1e293b';
    }

    if(user.isLoggedIn) {
        localStorage.setItem('isLoggedIn', 'true');
    }
  }, [subjects, attendanceCap, user, timetable, darkMode, attendanceHistory]);

  return (
    <AttendanceContext.Provider value={{ 
      user, setUser, 
      subjects, setSubjects, 
      addNewSubject,
      deleteSubject,
      logout,
      timetable, setTimetable,
      addToTimetable, removeFromTimetable, 
      markAttendance, 
      attendanceHistory,
      attendanceCap, setAttendanceCap,
      darkMode, setDarkMode 
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};