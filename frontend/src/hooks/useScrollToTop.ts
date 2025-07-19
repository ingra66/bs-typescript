import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hacer scroll hasta arriba cuando cambia la ruta
    const scrollToTop = () => {
      // Usar scrollTo con smooth behavior si está disponible
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback para navegadores que no soportan smooth scroll
        window.scrollTo(0, 0);
      }
    };

    // Pequeño delay para asegurar que el DOM se haya actualizado
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);
}; 