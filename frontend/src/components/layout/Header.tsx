import React, { useEffect, useState } from "react";
import { Facebook, Instagram, Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/v1/categories/navigation')
      .then(res => res.json())
      .then(data => {
        setCategories(data.data || []);
      })
      .catch(() => setCategories([]));
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Header Top */}
        <div className="header-top">
          {/* Social Icons */}
          <div className="social-icons">
            <Facebook size={15} />
            <Instagram size={15} />
            <Search size={15} />
          </div>

          {/* Logo */}
          <div className="logo">
            <img 
              src="/logo-beltspot.png" 
              alt="beltspot logo" 
              className="logo-3d-spin" 
            />
          </div>

          {/* User Icons */}
          <div className="user-icons">
            <Heart size={15} />
            <User size={15} />
            <ShoppingCart size={15} />
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-button">
            {isMobileMenuOpen ? (
              <X size={20} onClick={toggleMobileMenu} />
            ) : (
              <Menu size={20} onClick={toggleMobileMenu} />
            )}
          </div>
        </div>
      </div>
      {/* Navigation fuera del header-inner para ancho completo */}
      <nav className="navigation">
        <ul className="nav-list">
          {categories.map((cat) => (
            <li key={cat.id} className="nav-item">
              <a 
                href={`/category/${cat.slug}`} 
                className="nav-link"
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-close">
            <X size={30} onClick={toggleMobileMenu} />
          </div>
          <div className="mobile-menu-categories">
            {categories.map((cat) => (
              <a 
                key={cat.id}
                href={`/category/${cat.slug}`} 
                onClick={toggleMobileMenu}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}; 