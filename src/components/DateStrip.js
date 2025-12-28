export default function DateStrip({ selectedDate, onChange }) {
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="date-strip">
      {days.map((d) => {
        const iso = d.toISOString().split("T")[0];
        const active = iso === selectedDate;

        return (
          <div
            key={iso}
            className={`date-pill ${active ? "active" : ""}`}
            onClick={() => onChange(iso)}
          >
            <span className="day">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
            <span className="date">{d.getDate()}</span>
          </div>
        );
      })}
    </div>
  );
}
