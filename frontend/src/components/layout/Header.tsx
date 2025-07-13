import React, { useEffect, useState } from "react";
import { Facebook, Instagram, Search, Heart, User, ShoppingCart } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/v1/categories/navigation')
      .then(res => res.json())
      .then(data => {
        setCategories(data.data || []);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <header className="header" style={{ margin: 0, padding: 0, borderBottom: 'none', boxShadow: 'none', background: '#000' }}>
      <div className="header-top" style={{ padding: '2px 30px', minHeight: 0, height: 32, margin: 0, borderBottom: 'none', boxShadow: 'none', background: 'transparent' }}>
        <div className="social-icons">
          <Facebook size={15} />
          <Instagram size={15} />
          <Search size={15} />
        </div>
        <div className="logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', paddingTop: 24, paddingBottom: 24 }}>
          <img src="/logo-beltspot.png" alt="beltspot logo" className="logo-3d-spin" style={{ height: 80, maxHeight: 80, width: 'auto', display: 'block', background: 'none', marginTop: 10 }} />
        </div>
        <div className="user-icons">
          <Heart size={15} />
          <User size={15} />
          <ShoppingCart size={15} />
        </div>
      </div>
      <nav className="navigation" style={{ padding: '0 30px', minHeight: 0, height: 28, margin: 0, borderBottom: 'none', boxShadow: 'none', background: 'transparent' }}>
        <ul className="nav-list" style={{ gap: 0 }}>
          {categories.map((cat) => (
            <li key={cat.id} className="nav-item" style={{ padding: '2px 0' }}>
              <a href={`/category/${cat.slug}`} className="nav-link" style={{ fontSize: 12, padding: '4px 10px' }}>
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}; 