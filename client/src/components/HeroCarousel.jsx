import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./HeroCarousel.css";

import slide1 from "../assets/images/hero-slide-1.png";
import slide2 from "../assets/images/hero-slide-2.png";
import slide3 from "../assets/images/hero-slide-3.png";

const slides = [
  {
    image: slide1,
    label: "NEW COLLECTION",
    title: "Elevate Your Everyday",
    description: "Discover refined essentials designed for modern living.",
    button: "SHOP NOW",
  },
  {
    image: slide2,
    label: "TIMELESS ESSENTIALS",
    title: "Designed for Every Moment",
    description:
      "Effortless pieces created with comfort, style and timeless appeal.",
    button: "EXPLORE COLLECTION",
  },
  {
    image: slide3,
    label: "NEW SEASON",
    title: "Refined Style. Made for You.",
    description:
      "Step into the season with elevated silhouettes and modern essentials.",
    button: "DISCOVER NOW",
  },
];

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-carousel">
      {slides.map((slide, index) => (
        <div
          className={`hero-slide ${index === currentSlide ? "active" : ""}`}
          key={index}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`hero-image hero-image-${index + 1}`}
          />
          
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <p className="hero-brand">VELORA</p>

            <span className="hero-label">{slide.label}</span>

            <h1>{slide.title}</h1>

            <p className="hero-description">{slide.description}</p>

            <button className="hero-shop-button">{slide.button}</button>
          </div>
        </div>
      ))}

      <button
        className="hero-arrow hero-arrow-left"
        onClick={previousSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={26} />
      </button>

      <button
        className="hero-arrow hero-arrow-right"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={26} />
      </button>

      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;
