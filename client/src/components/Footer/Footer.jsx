
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="velora-footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>VELORA</h2>
          <h3>Why VELORA?</h3>
          <p>
            Because style is more than what you wear.
            At VELORA, we believe in timeless designs,
            effortless elegance, and the confidence
            to be yourself.
          </p>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
            <span>Instagram</span>
          </a>

          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
            <span>Facebook</span>
          </a>

          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
            <span>YouTube</span>
          </a>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>
            <FaMapMarkerAlt />
            <span>Kerala, India</span>
          </p>

          <p>
            <FaEnvelope />
            <span>contact@velora.com</span>
          </p>

          <Link to="/contact" className="footer-contact-link">
            Get in Touch →
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 VELORA. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
