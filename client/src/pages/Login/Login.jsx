
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../../components/Navbar";
import { loginUser, clearAuthError } from "../../redux/authSlice";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

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
    dispatch(clearAuthError());

    try {
      await dispatch(loginUser(formData)).unwrap();

      setMessage("Login successful.");
      navigate("/");
    } catch (errorMessage) {
      setMessage(
        typeof errorMessage === "string"
          ? errorMessage
          : "Unable to login. Please try again."
      );
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

            {(message || error) && (
              <p className="login-message">{message || error}</p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <div className="login-register">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create Account</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;
