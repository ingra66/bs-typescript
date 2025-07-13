import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/PortadaPagWeb2.png",
    title: "WORLDWIDE",
    subtitle: "wearing",
    brand: "beltspot",
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      className="hero-section"
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundImage: `url(${slides[currentSlide].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div className="hero-container" style={{ width: '100vw', height: '100vh', maxWidth: '100vw', margin: 0, padding: 0, position: 'relative', zIndex: 1 }}>
        <button
          className="nav-arrow nav-arrow-left"
          onClick={prevSlide}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            position: 'absolute',
            top: '50%',
            left: 20,
            transform: 'translateY(-50%)',
            zIndex: 10,
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={48} color="#fff" />
        </button>
        <div className="hero-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <div className="hero-text" style={{ marginLeft: '3rem' }}>
            <h1 className="hero-title" style={{ fontWeight: 700, fontSize: '3.2rem', lineHeight: 1, margin: 0, padding: 0 }}>
              <span
                className="title-main"
                style={{
                  color: '#fff',
                  fontFamily: 'UnifrakturCook, cursive',
                  display: 'block',
                  margin: 0,
                  padding: 0,
                  lineHeight: 1,
                  transform: 'rotate(-10deg)',
                }}
              >
                {slides[currentSlide].title}
              </span>
              <span
                className="title-meets"
                style={{
                  color: '#fff',
                  fontFamily: 'Great Vibes, cursive',
                  display: 'block',
                  margin: 0,
                  padding: 0,
                  marginTop: '-1.2rem',
                  marginBottom: '-0.5rem',
                  marginLeft: '1.2rem',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  position: 'relative',
                  zIndex: 2,
                  transform: 'rotate(-10deg)',
                }}
              >
                {slides[currentSlide].subtitle}
              </span>
              <span
                className="title-brand"
                style={{
                  color: '#fff',
                  textTransform: 'lowercase',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  display: 'block',
                  margin: 0,
                  padding: 0,
                  lineHeight: 1,
                  transform: 'rotate(-10deg)',
                }}
              >
                {slides[currentSlide].brand}
              </span>
            </h1>
          </div>
        </div>
        <button
          className="nav-arrow nav-arrow-right"
          onClick={nextSlide}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            position: 'absolute',
            top: '50%',
            right: 20,
            transform: 'translateY(-50%)',
            zIndex: 10,
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <ChevronRight size={48} color="#fff" />
        </button>
      </div>
    </section>
  );
}; 