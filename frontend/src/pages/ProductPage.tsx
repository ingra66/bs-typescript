import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
  stock: number;
  sku?: string;
  categories?: string[];
  tags?: string[];
}

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<'desc' | 'info'>('desc');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProduct({
            id: data.data.id,
            name: data.data.name,
            description: data.data.description,
            price: data.data.price,
            image: data.data.main_image || "/placeholder.svg",
            stock: data.data.stock,
            sku: data.data.sku || '',
            categories: data.data.category ? [data.data.category.name] : [],
            tags: data.data.tags || [],
          });
        } else {
          setError("Producto no encontrado");
        }
      })
      .catch(() => setError("Error al cargar el producto"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      const res = await fetch('/api/v1/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        alert('Producto agregado al carrito');
      } else {
        alert(data.message || 'No se pudo agregar al carrito');
      }
    } catch {
      alert('Error al agregar al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 60 }}>Cargando producto...</div>;
  if (error) return <div style={{ color: '#dc3545', textAlign: 'center', marginTop: 60 }}>{error}</div>;
  if (!product) return null;

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', padding: '40px 0 60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 48, maxWidth: 1200, width: '100%', alignItems: 'flex-start', margin: '0 auto' }}>
        {/* Imagen principal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #fff', width: 340, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <img src={product.image} alt={product.name} style={{ maxWidth: 300, maxHeight: 300, objectFit: 'contain', display: 'block' }} />
          </div>
          {/* Miniaturas (placeholder, solo una imagen por ahora) */}
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <div style={{ width: 60, height: 60, background: '#fff', borderRadius: 8, border: '1px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 }}>
              <img src={product.image} alt={product.name} style={{ maxWidth: 48, maxHeight: 48, objectFit: 'contain' }} />
            </div>
          </div>
        </div>
        {/* Panel derecho */}
        <div style={{ flex: 1.2, background: '#181b1e', borderRadius: 18, padding: 32, minWidth: 320, boxShadow: '0 2px 16px 0 rgba(220,53,69,0.10)' }}>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 10 }}>{product.name}</h1>
          <div style={{ color: '#dc3545', fontWeight: 700, fontSize: 24, margin: '8px 0 18px 0' }}>${Number(product.price).toFixed(2)}</div>
          <table style={{ width: '100%', color: '#fff', fontSize: 15, marginBottom: 18, borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ color: '#bbb', fontWeight: 600, padding: '4px 8px 4px 0', width: 90 }}>SKU</td>
                <td style={{ color: '#fff', fontWeight: 400 }}>{product.sku || '-'}</td>
              </tr>
              <tr>
                <td style={{ color: '#bbb', fontWeight: 600, padding: '4px 8px 4px 0' }}>Categorías</td>
                <td style={{ color: '#fff', fontWeight: 400 }}>{product.categories && product.categories.length > 0 ? product.categories.join(', ') : '-'}</td>
              </tr>
              <tr>
                <td style={{ color: '#bbb', fontWeight: 600, padding: '4px 8px 4px 0' }}>Tags</td>
                <td style={{ color: '#fff', fontWeight: 400 }}>{product.tags && product.tags.length > 0 ? product.tags.join(', ') : '-'}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              style={{ width: 56, padding: '8px 6px', borderRadius: 8, border: '1px solid #fff', background: '#23272b', color: '#fff', fontWeight: 600, fontSize: 16, textAlign: 'center' }}
              disabled={product.stock === 0}
            />
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 16, cursor: adding || product.stock === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <ShoppingCart size={20} /> Agregar al carrito
            </button>
          </div>
          <div style={{ color: product.stock > 0 ? '#4caf50' : '#dc3545', fontWeight: 600, fontSize: 15, marginBottom: 10 }}>
            {product.stock > 0 ? `En stock (${product.stock})` : 'Sin stock'}
          </div>
        </div>
      </div>
      {/* Tabs abajo */}
      <div style={{ maxWidth: 900, width: '100%', margin: '40px auto 0 auto', background: '#181b1e', borderRadius: 14, padding: 24 }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #23272b', marginBottom: 18 }}>
          <button
            onClick={() => setTab('desc')}
            style={{ background: 'none', border: 'none', color: tab === 'desc' ? '#dc3545' : '#fff', fontWeight: 700, fontSize: 17, padding: '8px 24px', borderBottom: tab === 'desc' ? '2px solid #dc3545' : '2px solid transparent', cursor: 'pointer', borderRadius: 0 }}
          >
            Descripción
          </button>
          <button
            onClick={() => setTab('info')}
            style={{ background: 'none', border: 'none', color: tab === 'info' ? '#dc3545' : '#fff', fontWeight: 700, fontSize: 17, padding: '8px 24px', borderBottom: tab === 'info' ? '2px solid #dc3545' : '2px solid transparent', cursor: 'pointer', borderRadius: 0 }}
          >
            Información adicional
          </button>
        </div>
        <div style={{ color: '#fff', fontSize: 16, minHeight: 60 }}>
          {tab === 'desc' ? (
            <div>{product.description || 'Sin descripción.'}</div>
          ) : (
            <div>Próximamente información adicional del producto.</div>
          )}
        </div>
      </div>
    </div>
  );
}; 