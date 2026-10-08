import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setStatusMessage("");

    try {
      const response = await fetch(
        "https://velora-hjso.onrender.com/contact/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to send message");
      }

      setStatusMessage(
        "Thank you. Your message has been sent successfully."
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setStatusMessage(
        "Unable to send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-header">
          <span>GET IN TOUCH</span>
          <h1>Contact VELORA</h1>

          <p>
            Have a question about our collection, your order,
            or anything else? Our team is here to help.
          </p>
        </section>

        <section className="contact-container">
          <div className="contact-info">
            <span className="contact-label">
              CUSTOMER CARE
            </span>

            <h2>We'd Love to Hear From You</h2>

            <p className="contact-description">
              Whether you need help with a product, an order,
              or simply want to know more about VELORA,
              send us a message.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <Mail size={20} />

                <div>
                  <h3>Email</h3>
                  <p>support@velora.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <Phone size={20} />

                <div>
                  <h3>Phone</h3>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-info-item">
                <MapPin size={20} />

                <div>
                  <h3>Location</h3>
                  <p>Kerala, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="contact-form-group">
                <label htmlFor="name">Name</label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject">Subject</label>

                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Message</label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {statusMessage && (
                <p className="contact-status">
                  {statusMessage}
                </p>
              )}

              <button
                type="submit"
                className="contact-submit"
                disabled={submitting}
              >
                <Send size={16} />

                {submitting
                  ? "SENDING..."
                  : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contact;