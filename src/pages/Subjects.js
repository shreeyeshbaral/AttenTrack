import { useState, useContext } from "react";
import { AttendanceContext } from "../AttendanceContext";
import ClassCard from "../components/ClassCard";
import StatusCard from "../components/StatusCard";
import DateStrip from "../components/DateStrip";
import BottomNav from "../components/BottomNav";
import "../styles/subjects.css";

export default function Subjects() {
  const { state, dispatch } = useContext(AttendanceContext);

  const [name, setName] = useState("");
  const [activeSubject, setActiveSubject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const getSubjectStats = (id) => {
    let present = 0;
    let absent = 0;

    Object.values(state.attendance).forEach((day) => {
      if (day[id] === "present") present++;
      if (day[id] === "absent") absent++;
    });

    const total = present + absent;
    const percent = total === 0 ? 0 : Math.round((present / total) * 100);

    return { present, absent, percent };
  };

  const add = () => {
    if (!name.trim()) return;

    dispatch({
      type: "ADD_SUBJECT",
      payload: {
        id: Date.now(),
        name: name.trim(),
      },
    });

    setName("");
  };

  return (
    <>
      <div className="subjects-page">
        <h2 className="welcome">Welcome back 👋</h2>
        <p className="subtitle">Ready to track today’s classes?</p>

        {/* DATE STRIP */}
        <DateStrip
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />

        {/* ADD SUBJECT */}
        <div className="add-subject">
          <input
            type="text"
            placeholder="Add subject"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={add}>Add</button>
        </div>

        {/* SUBJECT LIST */}
        <div className="subjects-list">
          {state.subjects.map((subj) => {
            const stats = getSubjectStats(subj.id);

            return (
              <ClassCard
                key={subj.id}
                name={subj.name}
                percent={stats.percent}
                onClick={() =>
                  setActiveSubject({ name: subj.name, stats })
                }
              />
            );
          })}
        </div>
      </div>

      {/* BIG CIRCLE */}
      <StatusCard
        subject={activeSubject?.name}
        stats={activeSubject?.stats}
        onClose={() => setActiveSubject(null)}
      />

      <BottomNav />
    </>
  );
}
