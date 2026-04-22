export default function EventCard({ event, currentUser, onJoin, onLeave, onDelete }) {
  const isCreator = event.user_id === currentUser?.id;
  const eventDate = new Date(event.date).toLocaleDateString();

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{event.title}</h3>
      <p style={styles.description}>{event.description}</p>
      
      <div style={styles.details}>
        <div>
          <span style={styles.label}>Date:</span> {eventDate}
        </div>
        <div>
          <span style={styles.label}>Capacity:</span> {event.capacity}
        </div>
        {event.cancelled && <div style={styles.cancelled}>Cancelled</div>}
      </div>

      <div style={styles.actions}>
        {isCreator ? (
          <button onClick={onDelete} style={styles.deleteBtn}>Delete</button>
        ) : (
          <>
            <button onClick={onJoin} style={styles.joinBtn}>Join</button>
            <button onClick={onLeave} style={styles.leaveBtn}>Leave</button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0",
    color: "#fff",
  },
  description: {
    fontSize: "14px",
    color: "#ccc",
    margin: "0",
  },
  details: {
    fontSize: "13px",
    color: "#999",
  },
  label: {
    color: "#00a8ff",
    fontWeight: "500",
  },
  cancelled: {
    color: "#ff4444",
    fontWeight: "500",
    marginTop: "5px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  joinBtn: {
    padding: "8px 16px",
    backgroundColor: "#00a8ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    flex: 1,
  },
  leaveBtn: {
    padding: "8px 16px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    flex: 1,
  },
  deleteBtn: {
    padding: "8px 16px",
    backgroundColor: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    flex: 1,
  },
};