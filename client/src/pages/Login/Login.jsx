import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || data.detail || "Invalid username or password.",
        );
        return;
      }

      const token = data.token || data.access || data.access_token;

      if (!token) {
        console.error("Login response:", data);
        setMessage("Login succeeded, but token was not received.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", formData.username);

      window.dispatchEvent(new Event("authUpdated"));

      setMessage("Login successful.");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setMessage("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="login-page">
        <section className="login-container">
          <div className="login-heading">
            <span>WELCOME BACK</span>

            <h1>Sign In to VELORA</h1>

            <p>Access your account, shopping bag, reviews and orders.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {message && <p className="login-message">{message}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <div className="login-register">
            <p>
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;
