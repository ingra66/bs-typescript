import React from "react";

export interface CategoryGridCategory {
  id: number;
  name?: string; // Para compatibilidad con backend
  title?: string; // Para compatibilidad con mock
  subtitle?: string;
  image?: string | null;
  backgroundColor?: "black" | "light";
  productCount?: number;
  slug?: string;
  description?: string;
}

interface CategoryGridProps {
  categories: CategoryGridCategory[];
  loading?: boolean;
  onCategoryClick?: (category: CategoryGridCategory) => void;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  loading = false,
  onCategoryClick
}) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Cargando categorías...</div>;
  }
  if (!categories || categories.length === 0) {
    return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>No hay categorías para mostrar</div>;
  }
  return (
    <section className="product-grid-section" style={{ margin: 0, padding: 0 }}>
      <div className="product-grid-container" style={{ margin: 0, padding: 0 }}>
        <div className="product-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`product-card ${category.backgroundColor === "black" ? "product-card-black" : "product-card-light"}`}
              onClick={() => onCategoryClick?.(category)}
              style={{ cursor: onCategoryClick ? 'pointer' : undefined }}
            >
              <div className="product-image-container">
                <img
                  src={category.image || PLACEHOLDER_IMAGE}
                  alt={category.name || category.title || ''}
                  className="product-image"
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>
              <div className="product-text">
                {(category.subtitle || category.description) && <span className="product-subtitle">{category.subtitle || category.description}</span>}
                <h3 className="product-title">{category.name || category.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 