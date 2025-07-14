import React from 'react';
import { Card } from '@/components/ui/Card';

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
}

interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onClick 
}) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
      onClick={() => onClick?.(category)}
    >
      <div className="relative">
        <div className="aspect-square bg-gray-100">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="text-white">
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-sm text-gray-200 mb-3 line-clamp-2">
              {category.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200">
                {category.productCount} productos
              </span>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                Ver más
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 