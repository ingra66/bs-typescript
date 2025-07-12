import React from "react";

interface Category {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  backgroundColor: "black" | "light";
}

const categories: Category[] = [
  {
    id: 1,
    title: "BELTS",
    subtitle: "ICONIC",
    image: "/placeholder.svg",
    backgroundColor: "black",
  },
  {
    id: 2,
    title: "ACCESSORIES",
    image: "/placeholder.svg",
    backgroundColor: "light",
  },
  {
    id: 3,
    title: "BAGS",
    image: "/placeholder.svg",
    backgroundColor: "black",
  },
  {
    id: 4,
    title: "FOOTWEAR",
    image: "/placeholder.svg",
    backgroundColor: "light",
  },
  {
    id: 5,
    title: "PET",
    image: "/placeholder.svg",
    backgroundColor: "black",
  },
  {
    id: 6,
    title: "APPAREL",
    image: "/placeholder.svg",
    backgroundColor: "light",
  },
];

export const CategoryGrid: React.FC = () => {
  return (
    <section className="product-grid-section">
      <div className="product-grid-container">
        <div className="product-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`product-card ${category.backgroundColor === "black" ? "product-card-black" : "product-card-light"}`}
            >
              <div className="product-image-container">
                <img
                  src={category.image}
                  alt={category.title}
                  className="product-image"
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>
              <div className="product-text">
                {category.subtitle && <span className="product-subtitle">{category.subtitle}</span>}
                <h3 className="product-title">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 