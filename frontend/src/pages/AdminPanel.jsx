import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents, deleteEvent } from "../utils/api";

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== "admin") {
      alert("Admin access required");
      navigate("/dashboard");
      return;
    }
    
    setCurrentUser(userData);
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(eventId);
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalEvents = events.length;
  const cancelledEvents = events.filter(e => e.cancelled).length;
  const activeEvents = totalEvents - cancelledEvents;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>Admin: {currentUser?.email}</span>
          <button onClick={() => navigate("/dashboard")} style={styles.dashboardBtn}>
            Back to Events
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalEvents}</div>
          <div style={styles.statLabel}>Total Events</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{activeEvents}</div>
          <div style={styles.statLabel}>Active Events</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{cancelledEvents}</div>
          <div style={styles.statLabel}>Cancelled Events</div>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Events Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.tableTitle}>All Events</h2>
        {loading ? (
          <p style={styles.loading}>Loading events...</p>
        ) : events.length === 0 ? (
          <p style={styles.noEvents}>No events yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Creator</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Capacity</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} style={styles.row}>
                  <td style={styles.td}>{event.title}</td>
                  <td style={styles.td}>User #{event.user_id}</td>
                  <td style={styles.td}>{new Date(event.date).toLocaleDateString()}</td>
                  <td style={styles.td}>{event.capacity}</td>
                  <td style={styles.td}>
                    {event.cancelled ? (
                      <span style={styles.cancelled}>Cancelled</span>
                    ) : (
                      <span style={styles.active}>Active</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    borderBottom: "1px solid #333",
    paddingBottom: "20px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "600",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  userEmail: {
    fontSize: "14px",
    color: "#999",
  },
  dashboardBtn: {
    padding: "8px 16px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  statCard: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #333",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "600",
    color: "#00a8ff",
    marginBottom: "10px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#999",
  },
  error: {
    color: "#ff4444",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  tableContainer: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #333",
    overflowX: "auto",
  },
  tableTitle: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerRow: {
    borderBottom: "2px solid #333",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    fontSize: "13px",
    color: "#00a8ff",
    fontWeight: "600",
  },
  row: {
    borderBottom: "1px solid #333",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
  },
  active: {
    color: "#4caf50",
    fontWeight: "500",
  },
  cancelled: {
    color: "#ff4444",
    fontWeight: "500",
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  loading: {
    textAlign: "center",
    color: "#999",
  },
  noEvents: {
    textAlign: "center",
    color: "#999",
  },
};