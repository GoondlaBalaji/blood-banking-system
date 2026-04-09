import SpaceBackground from "./SpaceBackground";

export default function DonorResults({ donors = [], onBack }) {
  return (
    <div style={styles.page}>
      <SpaceBackground />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
          <h2 style={styles.title}>🩸 Available Donors</h2>
          <span style={styles.count}>{donors.length} found</span>
        </div>

        {/* No donors */}
        {donors.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😔</div>
            <p style={{ color: "#ff6b6b", fontSize: "1.1rem" }}>
              No donors available for this blood group.
            </p>
            <p style={{ color: "rgba(237,237,245,0.5)", marginTop: "0.5rem" }}>
              Please try again later or contact the blood bank directly.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {donors.map((d, i) => (
              <div key={d.id || i} style={styles.card}>
                {/* Avatar */}
                <div style={styles.avatar}>
                  {d.name?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Info */}
                <div style={styles.info}>
                  <h3 style={styles.name}>{d.name}</h3>

                  <div style={styles.badge}>{d.blood_group}</div>

                  <div style={styles.row}>
                    <span style={styles.label}>📍 Location</span>
                    <span style={styles.value}>{d.location}</span>
                  </div>
                  <div style={styles.row}>
                    <span style={styles.label}>📞 Phone</span>
                    <span style={styles.value}>{d.phone}</span>
                  </div>
                  <div style={styles.row}>
                    <span style={styles.label}>🩸 Units</span>
                    <span style={styles.value}>{d.units}</span>
                  </div>
                  {d.last_donation && (
                    <div style={styles.row}>
                      <span style={styles.label}>📅 Last Donated</span>
                      <span style={styles.value}>
                        {new Date(d.last_donation).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact button */}
                <a href={`tel:${d.phone}`} style={styles.contactBtn}>
                  📞 Contact Donor
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    paddingTop: "80px",
    paddingBottom: "60px",
    zIndex: 1,
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
    padding: "0 1.5rem",
    position: "relative",
    zIndex: 2,
    animation: "fadeUp 0.5s ease both",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  backBtn: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    padding: "0.5rem 1.2rem",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "0.88rem",
    fontWeight: 600,
    transition: "all 0.2s",
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.2rem",
    color: "white",
    letterSpacing: "3px",
    flex: 1,
  },
  count: {
    background: "rgba(192,57,43,0.18)",
    border: "1px solid rgba(192,57,43,0.4)",
    color: "#ff6b6b",
    padding: "0.3rem 1rem",
    borderRadius: "50px",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "1px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.4rem",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "1.8rem",
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c0392b, #e74c3c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "white",
    boxShadow: "0 0 20px rgba(192,57,43,0.4)",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    flex: 1,
  },
  name: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "white",
    margin: 0,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(192,57,43,0.18)",
    border: "1px solid rgba(192,57,43,0.4)",
    color: "#ff6b6b",
    padding: "0.2rem 0.8rem",
    borderRadius: "50px",
    fontSize: "0.9rem",
    fontWeight: 700,
    letterSpacing: "1px",
    width: "fit-content",
    marginBottom: "0.3rem",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: "0.3rem",
  },
  label: {
    fontSize: "0.78rem",
    color: "rgba(237,237,245,0.5)",
    fontWeight: 500,
  },
  value: {
    fontSize: "0.85rem",
    color: "rgba(237,237,245,0.9)",
    fontWeight: 600,
  },
  contactBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #c0392b, #e74c3c)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "0.75rem",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "none",
    marginTop: "0.4rem",
    boxShadow: "0 0 20px rgba(192,57,43,0.3)",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    backdropFilter: "blur(16px)",
    color: "white",
  },
};