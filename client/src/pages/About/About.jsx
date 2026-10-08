import {
  Gem,
  Sparkles,
  Heart,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import "./About.css";

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* HERO */}
        <section className="about-hero">
          <span>OUR STORY</span>

          <h1>
            Timeless Style, Thoughtfully Curated.
          </h1>

          <p>
            VELORA is built around refined design,
            effortless elegance, and pieces made to
            become part of your everyday story.
          </p>
        </section>

        {/* BRAND STORY */}
        <section className="about-story">

          <div className="about-story-title">
            <span>THE VELORA WAY</span>

            <h2>More Than Fashion</h2>
          </div>

          <div className="about-story-content">
            <p>
              At VELORA, we believe great style should
              feel effortless. Our collections bring
              together modern silhouettes, timeless
              details, and versatile pieces designed
              for everyday life.
            </p>

            <p>
              From refined essentials to statement
              accessories, every VELORA piece is
              selected with a focus on simplicity,
              comfort, and lasting style.
            </p>
          </div>

        </section>

        {/* VALUES */}
        <section className="about-values">

          <div className="about-values-heading">
            <span>WHAT DEFINES US</span>

            <h2>The VELORA Philosophy</h2>
          </div>

          <div className="about-values-grid">

            <div className="about-value-card">
              <Gem size={27} />

              <h3>Refined Quality</h3>

              <p>
                Thoughtfully selected pieces with
                attention to material, detail, and
                everyday comfort.
              </p>
            </div>

            <div className="about-value-card">
              <Sparkles size={27} />

              <h3>Timeless Design</h3>

              <p>
                Clean silhouettes and versatile styles
                that move beyond short-lived trends.
              </p>
            </div>

            <div className="about-value-card">
              <Heart size={27} />

              <h3>Made for You</h3>

              <p>
                Fashion designed to feel personal,
                confident, and effortless in every
                moment.
              </p>
            </div>

          </div>
        </section>

        {/* SOCIAL MEDIA */}
        <section className="about-social">

          <span>STAY CONNECTED</span>

          <h2>Follow VELORA</h2>

          <p>
            Discover new collections, styling
            inspiration, and the latest from VELORA.
          </p>

          <div className="social-links">

            <a
              href="#"
              className="social-link"
              aria-label="Instagram"
            >
              <span className="social-symbol">
                IG
              </span>

              <span>Instagram</span>
            </a>

            <a
              href="#"
              className="social-link"
              aria-label="X"
            >
              <span className="social-symbol">
                X
              </span>

              <span>Twitter</span>
            </a>

            <a
              href="#"
              className="social-link"
              aria-label="YouTube"
            >
              <span className="social-symbol">
                YT
              </span>

              <span>YouTube</span>
            </a>

          </div>

        </section>

      </main>
    </>
  );
}

export default About;