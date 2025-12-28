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

  // --- NEW: Dark Mode State ---
  const [darkMode, setDarkMode] = useState(getInitialData('darkMode', false));

  // --- ACTIONS ---

  const addNewSubject = (name) => {
    const newSubject = { id: name, name: name, attended: 0, total: 0 };
    setSubjects([...subjects, newSubject]);
  };

  const addToTimetable = (day, subjectId) => {
    const daySchedule = timetable[day] || [];
    const newSchedule = [...daySchedule, subjectId];
    setTimetable({ ...timetable, [day]: newSchedule });
  };

  // Removes a subject from a specific day by its index
  const removeFromTimetable = (day, indexToRemove) => {
    const daySchedule = timetable[day] || [];
    const newSchedule = daySchedule.filter((_, index) => index !== indexToRemove);
    setTimetable({ ...timetable, [day]: newSchedule });
  };

  const markAttendance = (subjectId, status) => {
    const updatedSubjects = subjects.map(sub => {
      if (sub.id === subjectId) {
        const newTotal = status === 'cancelled' ? sub.total : sub.total + 1;
        const newAttended = status === 'present' ? sub.attended + 1 : sub.attended;
        return { ...sub, total: newTotal, attended: newAttended };
      }
      return sub;
    });
    setSubjects(updatedSubjects);
  };

  // Save changes automatically & Handle Body Styling
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('cap', JSON.stringify(attendanceCap));
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('timetable', JSON.stringify(timetable));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));

    // --- APPLY DARK/LIGHT THEME TO BODY ---
    if (darkMode) {
        document.body.style.backgroundColor = '#0f172a'; // Dark Slate
        document.body.style.color = '#f1f5f9'; // Light Text
    } else {
        document.body.style.backgroundColor = '#f8fafc'; // Light Gray
        document.body.style.color = '#1e293b'; // Dark Text
    }

  }, [subjects, attendanceCap, user, timetable, darkMode]);

  return (
    <AttendanceContext.Provider value={{ 
      user, setUser, 
      subjects, setSubjects, 
      addNewSubject,
      timetable, setTimetable,
      addToTimetable, removeFromTimetable, 
      markAttendance, 
      attendanceCap, setAttendanceCap,
      darkMode, setDarkMode // <--- Exporting Dark Mode to the app
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};