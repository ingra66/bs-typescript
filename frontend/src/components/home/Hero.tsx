import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

// Componente para palabras flotantes aleatorias
const FloatingWord: React.FC<{ word: string; delay: number; onComplete: () => void }> = ({ word, delay, onComplete }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Posición aleatoria
    setPosition({
      x: Math.random() * 80, // 0-80% del ancho
      y: Math.random() * 80, // 0-80% del alto
    });
  }, []);

  return (
    <motion.div
      className="absolute text-white font-bold text-lg md:text-xl lg:text-2xl"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        zIndex: 10,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ 
        duration: 0.5,
        delay: delay
      }}
      onAnimationComplete={() => {
        // Llamar onComplete después de que termine la animación de entrada
        setTimeout(onComplete, 3500); // 3.5 segundos después de aparecer
      }}
    >
      {word}
    </motion.div>
  );
};

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
    image: "/PortadaPagWeb2-1.png",
    title: "STYLE",
    subtitle: "meets",
    brand: "beltspot",
    description: "Estilo y elegancia en cada detalle de nuestros cinturones",
  },
  {
    id: 3,
    image: "/PortadaPagWeb2-2.png",
    title: "EXCLUSIVE",
    subtitle: "design",
    brand: "beltspot",
    description: "Diseños únicos y exclusivos para el hombre distinguido",
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isColorized, setIsColorized] = useState(false);
  const [floatingWords, setFloatingWords] = useState<string[]>([]);
  const slideTimerRef = useRef<number | null>(null);

  const words = ["FUCK FAME", "NO CAP", "TWENIE", "THUG", "G-CODE", "VAMP TALK", "WOK"];

  useEffect(() => {
    // Mostrar el botón después de que la página cargue
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Cambiar slide automáticamente cada 15 segundos
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsColorized(false); // Resetear el efecto de color
      
      // Activar el efecto de color después de 500ms
      setTimeout(() => {
        setIsColorized(true);
      }, 500);
    }, 10000);

    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    // Activar el efecto de color para el primer slide
    const colorTimer = setTimeout(() => {
      setIsColorized(true);
    }, 500);

    return () => clearTimeout(colorTimer);
  }, [currentSlide]);

  useEffect(() => {
    // Generar palabras aleatorias cada 3 segundos
    const wordTimer = setInterval(() => {
      const randomWords = [];
      const numWords = Math.floor(Math.random() * 3) + 1; // 1-3 palabras
      
      for (let i = 0; i < numWords; i++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        randomWords.push(randomWord);
      }
      
      setFloatingWords(randomWords);
    }, 3000);

    return () => clearInterval(wordTimer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsColorized(false);
    setTimeout(() => {
      setIsColorized(true);
    }, 500);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsColorized(false);
    setTimeout(() => {
      setIsColorized(true);
    }, 500);
  };

  const handleVerColeccion = () => {
    // Aquí puedes agregar la navegación a la colección
    console.log('Ver colección clicked');
  };

  return (
    <section className="relative w-screen overflow-hidden" style={{ height: '100vh', minHeight: '100vh' }}>
      <style>
        {`
          @keyframes zoomEffect {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      {/* Full width image */}
      <div className="relative w-full h-full overflow-hidden" style={{ height: '100vh' }}>
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className={`w-full h-full object-cover object-center transition-all duration-8000 ${
                      isColorized ? 'grayscale-0' : 'grayscale'
                    }`}
                    style={{
                      transform: 'scale(1)',
                      animation: 'zoomEffect 8s ease-in-out infinite'
                    }}
                  />
                  
                  {/* Palabras flotantes */}
                  <AnimatePresence>
                    {floatingWords.map((word, index) => (
                      <FloatingWord 
                        key={`${word}-${index}-${Date.now()}`} 
                        word={word} 
                        delay={index * 200}
                        onComplete={() => {
                          // Remover la palabra después de la animación
                          setFloatingWords(prev => prev.filter(w => w !== word));
                        }}
                      />
                    ))}
                  </AnimatePresence>
                
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
              variant="primary"
              size="sm"
              text="Ver Colección"
              iconAfter={<ArrowRight className="w-2.5 h-2.5" />}
            />
          </div>
        )}
      </div>
    </section>
  );
}; 