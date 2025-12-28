export default function ClassCard({ name, percent, onClick }) {
  const color =
    percent >= 75 ? "#2ecc71" : percent >= 60 ? "#f1c40f" : "#e74c3c";

  return (
    <div className="class-card" onClick={onClick}>
      <span className="class-name">{name}</span>

      <div
        className="class-circle"
        style={{
          background: `conic-gradient(${color} ${percent}%, #eee ${percent}% 100%)`,
        }}
      >
        <span>{percent}%</span>
      </div>
    </div>
  );
}
