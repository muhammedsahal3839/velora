
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Headphones, X, ArrowRight } from "lucide-react";

import "./HelpButton.css";

function HelpButton() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="help-widget">
      {isOpen && (
        <div className="help-popup">
          <div className="help-popup-header">
            <div className="help-popup-icon">
              <Headphones size={22} />
            </div>

            <button
              type="button"
              className="help-close"
              aria-label="Close help"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <h3>Need Assistance?</h3>

          <p>
            Have a question about your order or our collection?
            We're here to help.
          </p>

          <button
            type="button"
            className="help-contact-button"
            onClick={() => {
              setIsOpen(false);
              navigate("/contact");
            }}
          >
            CONTACT US
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      <button
        type="button"
        className="help-floating-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={19} /> : <MessageCircle size={19} />}
        <span>{isOpen ? "Close" : "Need Help?"}</span>
      </button>
    </div>
  );
}

export default HelpButton;
