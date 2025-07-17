import api from './api';

// Tipos para el footer
export interface FooterLink {
  id: number;
  title: string;
  url: string;
  type: 'support' | 'about' | 'legal' | 'social';
  order: number;
  is_active: boolean;
}

export interface FooterSection {
  id: number;
  title: string;
  links: FooterLink[];
  order: number;
  is_active: boolean;
}

export interface FooterData {
  sections: FooterSection[];
  social_media: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
  };
  company_info: {
    name: string;
    description?: string;
    logo_url?: string;
    copyright_text: string;
  };
}

// Servicio para obtener datos del footer
export const getFooterData = async (): Promise<FooterData> => {
  try {
    const response = await api.get('/footer');
    return response.data.data;
  } catch (error) {
    console.error('Error obteniendo datos del footer:', error);
    // Retornar datos por defecto si el backend no está disponible
    return getDefaultFooterData();
  }
};

// Datos por defecto del footer
export const getDefaultFooterData = (): FooterData => {
  return {
    sections: [
      {
        id: 1,
        title: 'Soporte',
        order: 1,
        is_active: true,
        links: [
          { id: 1, title: 'Help Center', url: '/help', type: 'support', order: 1, is_active: true },
          { id: 2, title: 'Product Support', url: '/support', type: 'support', order: 2, is_active: true },
          { id: 3, title: 'Warranty', url: '/warranty', type: 'support', order: 3, is_active: true },
          { id: 4, title: 'Order Tracking', url: '/tracking', type: 'support', order: 4, is_active: true },
          { id: 5, title: 'Contact Us', url: '/contact', type: 'support', order: 5, is_active: true },
        ]
      },
      {
        id: 2,
        title: 'Acerca de',
        order: 2,
        is_active: true,
        links: [
          { id: 6, title: 'About', url: '/about', type: 'about', order: 1, is_active: true },
          { id: 7, title: 'Music with a Mission', url: '/mission', type: 'about', order: 2, is_active: true },
          { id: 8, title: 'Soundlab Rewards', url: '/rewards', type: 'about', order: 3, is_active: true },
          { id: 9, title: 'Affiliates + Creators', url: '/affiliates', type: 'about', order: 4, is_active: true },
          { id: 10, title: 'Press Releases', url: '/press', type: 'about', order: 5, is_active: true },
        ]
      }
    ],
    social_media: {
      instagram: 'https://instagram.com/beltspot',
      youtube: 'https://youtube.com/beltspot',
      facebook: 'https://facebook.com/beltspot',
      twitter: 'https://twitter.com/beltspot',
    },
    company_info: {
      name: 'BeltSpot',
      description: 'Tu tienda de confianza para cinturones de calidad',
      logo_url: '/logo-beltspot.png',
      copyright_text: '© 2025, BELTSPOT'
    }
  };
};



// Servicio para obtener información de contacto
export const getContactInfo = async () => {
  try {
    const response = await api.get('/contact-info');
    return response.data.data;
  } catch (error) {
    console.error('Error obteniendo información de contacto:', error);
    return {
      email: 'contact@beltspot.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345',
      hours: 'Monday - Friday: 9AM - 6PM'
    };
  }
};

// Servicio para suscribirse al newsletter
export const subscribeToNewsletter = async (email: string) => {
  try {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    console.error('Error suscribiéndose al newsletter:', error);
    throw error;
  }
};

// Servicio para obtener políticas legales
export const getLegalPages = async () => {
  try {
    const response = await api.get('/legal-pages');
    return response.data.data;
  } catch (error) {
    console.error('Error obteniendo páginas legales:', error);
    return [
      { id: 1, title: 'Privacy Policy', url: '/privacy', slug: 'privacy' },
      { id: 2, title: 'Terms of Use', url: '/terms', slug: 'terms' },
      { id: 3, title: 'Accessibility Statement', url: '/accessibility', slug: 'accessibility' },
    ];
  }
}; 