import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(email, password);
      
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login" style={styles.linkText}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    padding: "20px",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: "40px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #333",
  },
  title: {
    color: "#fff",
    marginBottom: "30px",
    textAlign: "center",
    fontSize: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    border: "1px solid #333",
    borderRadius: "4px",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#00a8ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  error: {
    color: "#ff4444",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    fontSize: "14px",
  },
  link: {
    color: "#999",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
  },
  linkText: {
    color: "#00a8ff",
    textDecoration: "none",
    cursor: "pointer",
  },
};