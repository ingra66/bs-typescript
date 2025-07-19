import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";
import type { Product, ProductVariant } from "../services/productService";
import { useCartStore } from "../stores/cartStore";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { ProductCarousel, type ProductCarouselProduct } from "../components/products/ProductCarousel";
import AlertModal from '../components/ui/AlertModal';
import AutoCloseAlertModal from '../components/ui/AutoCloseAlertModal';
import WishlistButton from '../components/ui/WishlistButton';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<ProductCarouselProduct[]>([]);
  const { addItem } = useCartStore();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : (import.meta.env.VITE_API_URL || 'http://localhost:8000');
    return `${baseUrl}/storage/${imagePath}`;
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    
    fetch(`http://localhost:8000/api/v1/products/${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(response => {
        console.log('ProductPage: Respuesta del servidor:', response);
        if (response.success && response.data) {
          setProduct(response.data);
          if (response.data.variants && response.data.variants.length > 0) {
            const activeVariant = response.data.variants.find((v: ProductVariant) => v.is_active);
            setSelectedVariant(activeVariant || response.data.variants[0]);
          }
        } else {
          console.error('ProductPage: Producto no encontrado en la respuesta:', response);
          setError("Producto no encontrado");
        }
      })
      .catch((error) => {
        console.error('ProductPage: Error cargando producto:', error);
        setError("Error al cargar el producto");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Scroll hacia arriba cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cargar productos relacionados
  useEffect(() => {
    if (!product?.category?.slug) return;
    
    fetch(`http://localhost:8000/api/v1/categories/${product.category.slug}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Filtrar para excluir el producto actual
          const filtered = data.data
            .filter((p: any) => p.id !== product.id)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image: getImageUrl(p.main_image || p.images?.[0]),
              brand: p.brand || ''
            }));
          setRelatedProducts(filtered);
        }
      })
      .catch(error => {
        console.error('Error cargando productos relacionados:', error);
      });
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      const item = {
        id: product.id,
        name: product.name,
        price: selectedVariant ? Number(product.price) + Number(selectedVariant.price_adjustment) : Number(product.price),
        image: getImageUrl(product.main_image || product.images?.[0]),
        quantity: quantity,
        stock: selectedVariant ? selectedVariant.stock : product.stock,
        variant: selectedVariant
      };
      addItem(item);
      setShowSuccessAlert(true);
    } catch {
      setShowErrorAlert(true);
    } finally {
      setAdding(false);
    }
  };

  const productImages = product ? [
    ...(product.main_image ? [getImageUrl(product.main_image)] : []),
    ...(product.images ? product.images.map(getImageUrl).filter(url => url !== '/placeholder.svg') : [])
  ].filter((url, index, arr) => arr.indexOf(url) === index) : [];

  const finalPrice = selectedVariant && product ? 
    (Number(product.price) + Number(selectedVariant.price_adjustment)) : 
    Number(product?.price) || 0;
  const discountPercentage = product?.discount_percentage || 0;
  const hasDiscount = product?.compare_price && product.compare_price > finalPrice;

  const renderStars = (rating: number) => (
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={i < rating ? "text-brand-red fill-current" : "text-gray-300"} />
    ))
  );

  if (loading || error) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-[54px] min-h-screen flex items-center justify-center">
          <div className={`text-xl ${error ? 'text-brand-red' : 'text-white'}`}>
            {error || 'Cargando producto...'}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-[54px] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6 w-full">
          {/* Botón de volver */}
          <div className="mb-6">
            <Button
              onClick={() => navigate('/products')}
              variant="ghost"
              iconBefore={<ArrowLeft size={20} />}
              text="Volver a productos"
            />
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8">
            {/* Imagen del producto */}
            <div className="flex flex-col items-center space-y-3 w-full lg:w-1/2">
              <div className="relative w-full max-w-sm">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center">
                  <img src={productImages[selectedImage] || '/placeholder.svg'} alt={product.name} className="w-full max-h-[350px] object-contain" />
                </div>
                {hasDiscount && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-brand-red text-white px-2 py-1 rounded font-bold text-xs rotate-12 shadow-lg">
                      {discountPercentage}% OFF
                    </div>
                  </div>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="flex space-x-2 justify-center">
                  {productImages.map((image, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      variant="outline"
                      size="sm"
                      className={`w-12 h-12 md:w-14 md:h-14 p-0 overflow-hidden ${selectedImage === index ? 'border-brand-red' : 'border-gray-300'}`}
                    >
                      <img src={image} alt={`${product.name} vista ${index + 1}`} className="w-full h-full object-cover" />
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="flex flex-col space-y-4 w-full lg:w-1/2 max-w-md">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">{product.name}</h1>
                {product.average_rating && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">{renderStars(product.average_rating)}</div>
                    <span className="text-sm text-gray-400">({product.reviews_count || 0} reseñas)</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="text-xl lg:text-2xl font-bold text-white">${finalPrice.toFixed(2)}</div>
                  {hasDiscount && <div className="text-base text-gray-400 line-through">${Number(product.compare_price).toFixed(2)}</div>}
                </div>
              </div>

              <div className="space-y-1 text-sm">
                {product.sku && <div className="flex justify-between"><span className="text-gray-400">SKU:</span><span className="text-white font-medium">{product.sku}</span></div>}
                {product.category?.name && <div className="flex justify-between"><span className="text-gray-400">Categoría:</span><span className="text-white font-medium">{product.category.name}</span></div>}
                <div className="flex justify-between"><span className="text-gray-400">Stock:</span><span className="text-white font-medium">{selectedVariant ? selectedVariant.stock : product.stock} unidades</span></div>
                {product.is_featured && <div className="flex justify-between"><span className="text-gray-400">Estado:</span><span className="text-brand-red font-medium">Destacado</span></div>}
              </div>

              {product.variants && product.variants.some(v => v.is_active) && (
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">Variantes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.filter(v => v.is_active).map(variant => (
                      <Button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        variant={selectedVariant?.id === variant.id ? "primary" : "secondary"}
                        size="sm"
                        className="text-xs"
                      >
                        {variant.name}: {variant.value}
                        {variant.price_adjustment > 0 && <span className="block text-xs">+${Number(variant.price_adjustment).toFixed(2)}</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-3">
                <div className="flex items-center border-2 border-gray-600 rounded px-2 w-32 bg-gray-800">
                  <Button onClick={() => setQuantity(Math.max(1, quantity - 1))} variant="ghost" size="sm" className="px-2 py-1 text-gray-400 hover:text-white">-</Button>
                  <input
                    type="number"
                    min={1}
                    max={selectedVariant ? selectedVariant.stock : product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(selectedVariant ? selectedVariant.stock : product.stock, Number(e.target.value))))}
                    className="w-12 text-center border-none focus:outline-none bg-transparent text-white"
                  />
                  <Button onClick={() => setQuantity(Math.min(selectedVariant ? selectedVariant.stock : product.stock, quantity + 1))} variant="ghost" size="sm" className="px-2 py-1 text-gray-400 hover:text-white">+</Button>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={selectedVariant ? selectedVariant.stock === 0 : product.stock === 0}
                    isLoading={adding}
                    className="flex-1"
                    iconBefore={<ShoppingCart size={18} />}
                    text={(selectedVariant ? selectedVariant.stock === 0 : product.stock === 0) ? 'Sin stock' : 'Agregar al carrito'}
                  />
                  
                  <WishlistButton
                    productId={product.id}
                    productName={product.name}
                    size="lg"
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductCarousel 
              products={relatedProducts} 
              title="También podría interesarte" 
            />
          </div>
        )}
      </div>
      
      <AutoCloseAlertModal
        isOpen={showSuccessAlert}
        title="Producto agregado"
        message="El producto ha sido agregado al carrito exitosamente"
        onClose={() => setShowSuccessAlert(false)}
      />
      
      <AlertModal
        isOpen={showErrorAlert}
        title="Error"
        message="Error al agregar el producto al carrito"
        confirmText="Aceptar"
        onConfirm={() => setShowErrorAlert(false)}
        onCancel={() => setShowErrorAlert(false)}
      />
    </div>
  );
}; 