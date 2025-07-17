import { useNavigate } from 'react-router-dom';

export const useFooterNavigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (url: string) => {
    // Si es una URL externa, abrir en nueva pestaña
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Si es una ruta interna, usar React Router
    if (url.startsWith('/')) {
      // Manejar rutas especiales
      if (url === '/contact') {
        // Aquí puedes implementar lógica para abrir un modal de contacto
        console.log('Abrir modal de contacto');
        return;
      }

      if (url === '/help') {
        navigate('/help');
        return;
      }

      if (url === '/support') {
        navigate('/support');
        return;
      }

      if (url === '/warranty') {
        navigate('/warranty');
        return;
      }

      if (url === '/tracking') {
        navigate('/tracking');
        return;
      }

      if (url === '/about') {
        navigate('/about');
        return;
      }

      if (url === '/mission') {
        navigate('/mission');
        return;
      }

      if (url === '/rewards') {
        navigate('/rewards');
        return;
      }

      if (url === '/affiliates') {
        navigate('/affiliates');
        return;
      }

      if (url === '/press') {
        navigate('/press');
        return;
      }

      if (url === '/privacy') {
        navigate('/privacy');
        return;
      }

      if (url === '/terms') {
        navigate('/terms');
        return;
      }

      if (url === '/accessibility') {
        navigate('/accessibility');
        return;
      }

      // Para otras rutas, navegar normalmente
      navigate(url);
      return;
    }

    // Para otros casos, navegar normalmente
    window.location.href = url;
  };

  return { handleNavigation };
}; 