
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../../components/Navbar";

import {
  registerUser,
  clearRegisterStatus,
} from "../../redux/authSlice";

import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    registerLoading,
    registerError,
    registerSuccess,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearRegisterStatus());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (registerLoading || registerSuccess) {
      return;
    }

    dispatch(clearRegisterStatus());

    try {
      await dispatch(registerUser(formData)).unwrap();

      // Existing success message stays visible
      // before navigating to Login.
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="register-page">
        <section className="register-container">

          <div className="register-heading">
            <span>JOIN VELORA</span>

            <h1>Create Your Account</h1>

            <p>
              Create an account to shop your favourites,
              leave reviews and manage your orders.
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="register-form-group">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {registerError && (
              <p className="register-message">
                {registerError}
              </p>
            )}

            {registerSuccess && (
              <p className="register-message">
                Account created successfully.
                Redirecting to login...
              </p>
            )}

            <button
              type="submit"
              className="register-button"
              disabled={registerLoading || registerSuccess}
            >
              {registerLoading
                ? "CREATING ACCOUNT..."
                : registerSuccess
                  ? "ACCOUNT CREATED"
                  : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="register-login">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Sign In
              </Link>
            </p>
          </div>

        </section>
      </main>
    </>
  );
}

export default Register;
