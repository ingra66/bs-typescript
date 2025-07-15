import React from "react";

interface Brand {
  id: number;
  name: string;
  logo: string;
  description?: string;
}

const brands: Brand[] = [
  {
    id: 1,
    name: "Nike",
    logo: "/logo-beltspot.png",
    description: "Just Do It"
  },
  {
    id: 2,
    name: "Adidas",
    logo: "/logo-beltspot.png",
    description: "Impossible Is Nothing"
  },
  {
    id: 3,
    name: "Puma",
    logo: "/logo-beltspot.png",
    description: "Forever Faster"
  },
  {
    id: 4,
    name: "Under Armour",
    logo: "/logo-beltspot.png",
    description: "The Only Way Is Through"
  },
  {
    id: 5,
    name: "New Balance",
    logo: "/logo-beltspot.png",
    description: "Fearlessly Independent"
  },
  {
    id: 6,
    name: "Converse",
    logo: "/logo-beltspot.png",
    description: "Made By You"
  }
];

export const BrandGrid: React.FC = () => {
  return (
    <section className="brand-grid-section bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Nuestras Marcas
          </h2>
          <p className="text-gray-300 text-lg">
            Descubre las mejores marcas en BeltSpot
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="brand-card bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-300 cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-gray-400 text-xs">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 