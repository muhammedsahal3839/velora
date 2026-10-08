
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  ShoppingBag,
  LogOut,
  ArrowRight,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import "./Account.css";

function Account() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.dispatchEvent(new Event("authUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/", { replace: true });
  };

  if (!token) return null;

  return (
    <>
      <Navbar />

      <main className="account-page">
        <div className="account-heading">
          <span>YOUR VELORA ACCOUNT</span>
          <h1>My Account</h1>
          <p>
            Manage your account and explore your
            shopping journey.
          </p>
        </div>

        <div className="account-container">
          <section className="account-profile">
            <div className="account-avatar">
              <UserRound size={32} />
            </div>

            <div className="account-profile-info">
              <span>WELCOME BACK</span>
              <h2>{username || "VELORA Member"}</h2>
              <p>VELORA Member</p>
            </div>
          </section>

          <div className="account-actions">
            <button
              type="button"
              className="account-action-card"
              onClick={() => navigate("/orders")}
            >
              <div className="account-action-icon">
                <ShoppingBag size={24} />
              </div>

              <div className="account-action-text">
                <h3>My Orders</h3>
                <p>
                  View your order history and purchases.
                </p>
              </div>

              <ArrowRight size={20} />
            </button>

            <button
              type="button"
              className="account-action-card account-logout"
              onClick={handleLogout}
            >
              <div className="account-action-icon">
                <LogOut size={24} />
              </div>

              <div className="account-action-text">
                <h3>Logout</h3>
                <p>
                  Securely sign out of your account.
                </p>
              </div>

              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Account;
