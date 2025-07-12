import React from "react";
import { Facebook, Instagram, Search, Heart, User, ShoppingCart } from "lucide-react";

const navigationItems = [
  "BELTS",
  "ACCESSORIES",
  "BAGS",
  "FOOTWEAR",
  "APPAREL",
  "HOME",
  "PETS",
  "NEW",
  "COLLABS",
  "Fine Jewelry",
  "CUSTOM",
  "WEDDING COLLECTIONS",
  "WHOLESALE",
];

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-top" style={{ padding: '2px 30px', minHeight: 0, height: 32 }}>
        <div className="social-icons">
          <Facebook size={15} />
          <Instagram size={15} />
          <Search size={15} />
        </div>
        <div className="logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <img src="/logo-beltspot.png" alt="beltspot logo" className="logo-3d-spin" style={{ height: 54, maxHeight: 54, width: 'auto', display: 'block', background: 'none', marginTop: -10 }} />
        </div>
        <div className="user-icons">
          <Heart size={15} />
          <User size={15} />
          <ShoppingCart size={15} />
        </div>
      </div>
      <nav className="navigation" style={{ padding: '0 30px', minHeight: 0, height: 28 }}>
        <ul className="nav-list" style={{ gap: 0 }}>
          {navigationItems.map((item, index) => (
            <li key={index} className="nav-item" style={{ padding: '2px 0' }}>
              <a href="#" className="nav-link" style={{ fontSize: 12, padding: '4px 10px' }}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}; 