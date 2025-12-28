export default function StatusCard({ subject, stats, onClose }) {
  if (!subject) return null;

  const color =
    stats.percent >= 75 ? "#2ecc71" : stats.percent >= 60 ? "#f1c40f" : "#e74c3c";

  return (
    <div className="status-overlay" onClick={onClose}>
      <div className="status-card" onClick={(e) => e.stopPropagation()}>
        <div
          className="status-circle"
          style={{
            background: `conic-gradient(${color} ${stats.percent}%, #eee ${stats.percent}% 100%)`,
          }}
        >
          <span>{stats.percent}%</span>
        </div>

        <h2>{subject}</h2>
        <p>Present: {stats.present}</p>
        <p>Absent: {stats.absent}</p>
      </div>
    </div>
  );
}
