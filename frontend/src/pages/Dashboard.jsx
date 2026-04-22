import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents, createEvent, joinEvent, leaveEvent, deleteEvent } from "../utils/api";
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    capacity: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    setCurrentUser(JSON.parse(user));
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

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent(
        formData.title,
        formData.description,
        formData.date,
        parseInt(formData.capacity)
      );
      setFormData({ title: "", description: "", date: "", capacity: "" });
      setShowCreateForm(false);
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await joinEvent(eventId);
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      await leaveEvent(eventId);
      fetchEvents();
    } catch (err) {
      alert(err.message);
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Events</h1>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{currentUser?.email}</span>
          <button onClick={() => setShowCreateForm(!showCreateForm)} style={styles.createBtn}>
            + Create Event
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
          {currentUser?.role === "admin" && (
  <button onClick={() => navigate("/admin")} style={styles.adminBtn}>
    Admin Panel
  </button>
)}
        </div>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div style={styles.formContainer}>
          <form onSubmit={handleCreateEvent} style={styles.form}>
            <h2 style={styles.formTitle}>Create New Event</h2>
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={styles.input}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              style={{ ...styles.input, minHeight: "100px" }}
            />
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
              style={styles.input}
            />
            <div style={styles.formButtons}>
              <button type="submit" style={styles.submitBtn}>Create</button>
              <button type="button" onClick={() => setShowCreateForm(false)} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <p style={styles.loading}>Loading events...</p>
      ) : events.length === 0 ? (
        <p style={styles.noEvents}>No events yet. Create one!</p>
      ) : (
        <div style={styles.eventsGrid}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUser={currentUser}
              onJoin={() => handleJoinEvent(event.id)}
              onLeave={() => handleLeaveEvent(event.id)}
              onDelete={() => handleDeleteEvent(event.id)}
            />
          ))}
        </div>
      )}
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
  createBtn: {
    padding: "8px 16px",
    backgroundColor: "#00a8ff",
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
  formContainer: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    border: "1px solid #333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formTitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    border: "1px solid #333",
    borderRadius: "4px",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    fontSize: "14px",
  },
  formButtons: {
    display: "flex",
    gap: "10px",
  },
  submitBtn: {
    padding: "10px 20px",
    backgroundColor: "#00a8ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  error: {
    color: "#ff4444",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  loading: {
    textAlign: "center",
    color: "#999",
  },
  noEvents: {
    textAlign: "center",
    color: "#999",
  },
  eventsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  adminBtn: {
  padding: "8px 16px",
  backgroundColor: "#ff9800",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
},
};