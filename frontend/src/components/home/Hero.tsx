import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/PortadaPagWeb2.png",
    title: "CELEBRITIES",
    subtitle: "meets",
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
    <section className="hero-section" style={{ width: '100vw', marginLeft: 0, marginRight: 0, padding: 0 }}>
      <div className="hero-container" style={{ width: '100vw', maxWidth: '100vw', margin: 0 }}>
        <button className="nav-arrow nav-arrow-left" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </button>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-main">{slides[currentSlide].title}</span>
              <span className="title-meets">{slides[currentSlide].subtitle}</span>
              <span className="title-brand">{slides[currentSlide].brand}</span>
            </h1>
          </div>
          <div className="hero-image" style={{ width: '100vw', left: 0, right: 0 }}>
            <img
              src={slides[currentSlide].image}
              alt="Celebrities with beltspot"
              style={{ objectFit: "cover", width: "100vw", height: "100%" }}
            />
          </div>
        </div>
        <button className="nav-arrow nav-arrow-right" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}; 