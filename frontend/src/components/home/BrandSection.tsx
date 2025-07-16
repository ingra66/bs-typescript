import React from 'react';

export const BrandSection: React.FC = () => {
  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo y nombre de la marca */}
        <div className="mb-4">
          <div className="relative inline-block">
            <img
              src="/logo-beltspot.png"
              alt="BeltSpot"
              className="h-24 md:h-32 w-auto object-contain"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-300 text-lg leading-relaxed font-serif">
            BeltSpot® es una tienda de Salta, Argentina dedicada al hype beast streetwear. 
            Especializada en cinturones de alta calidad y accesorios urbanos, cada pieza está 
            diseñada para hacer una declaración audaz, perfecta para agregar un toque de estilo 
            a cualquier outfit.
          </p>
        </div>
      </div>
    </section>
  );
}; 