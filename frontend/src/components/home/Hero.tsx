import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

const slides = [
  {
    id: 1,
    image: "/PortadaPagWeb2.png",
    title: "CELEBRITIES",
    subtitle: "meets",
    brand: "beltspot",
    description: "Descubre nuestra colección exclusiva de cinturones de alta calidad",
  },
  {
    id: 2,
    image: "/PortadaPagWeb.png",
    title: "PREMIUM",
    subtitle: "quality",
    brand: "beltspot",
    description: "Cinturones de la más alta calidad para el hombre moderno",
  },
  {
    id: 3,
    image: "/3.png",
    title: "STYLE",
    subtitle: "meets",
    brand: "beltspot",
    description: "Estilo y elegancia en cada detalle de nuestros cinturones",
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Mostrar el botón después de que la página cargue
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleVerColeccion = () => {
    // Aquí puedes agregar la navegación a la colección
    console.log('Ver colección clicked');
  };

  return (
    <section className="relative w-screen overflow-hidden" style={{ height: '100vh', marginTop: '-54px', paddingTop: '54px' }}>
      {/* Full width image */}
      <div className="relative w-full h-full">
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
          className="w-full h-full object-cover object-center animate-zoom transition-opacity duration-500"
                  />
                
        {/* Left navigation button */}
                  <Button
                    onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
                  >
          <ChevronLeft size={32} />
                  </Button>

        {/* Right navigation button */}
                  <Button
                    onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
        >
          <ChevronRight size={32} />
        </Button>



        {/* Red Square Button */}
        {showButton && (
          <div className="absolute bottom-20 left-8 animate-slide-up">
            <Button 
              onClick={handleVerColeccion}
              className="bg-[#FF0000] hover:bg-black text-white px-2 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 border border-white"
                  >
              <span className="flex items-center gap-1">
                Ver Colección
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
                  </Button>
                </div>
        )}
      </div>
    </section>
  );
}; 