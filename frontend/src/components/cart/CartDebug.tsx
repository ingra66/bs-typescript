import React from 'react';
import { useCartStore } from '../../stores/cartStore';

const CartDebug: React.FC = () => {
  const { items, getTotalItems, getTotalPrice, forceUpdate } = useCartStore();

  const handleForceUpdate = () => {
    forceUpdate();
  };

  const handleAddTestItem = () => {
    console.log('=== CartDebug: Add Test Item INICIO ===');
    const testItem = {
      id: 999,
      name: 'Producto de prueba',
      price: 10.99,
      image: 'https://via.placeholder.com/150',
      quantity: 1,
      stock: 10
    };
    console.log('CartDebug: Test item a agregar:', testItem);
    
    const { addItem } = useCartStore.getState();
    console.log('CartDebug: Función addItem obtenida:', typeof addItem);
    
    addItem(testItem);
    
    console.log('CartDebug: Test item agregado');
    console.log('=== CartDebug: Add Test Item FIN ===');
  };

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 p-4 rounded-lg text-white text-sm z-50">
      <h3 className="font-bold mb-2">Debug Carrito</h3>
      <div className="space-y-1">
        <div>Items: {items.length}</div>
        <div>Total items: {getTotalItems()}</div>
        <div>Total price: ${getTotalPrice().toFixed(2)}</div>
        <div className="text-xs text-gray-400">
          Items: {JSON.stringify(items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity })))}
        </div>
      </div>
      <div className="mt-2 space-x-2">
        <button 
          onClick={handleForceUpdate}
                      className="bg-red-600 px-2 py-1 rounded text-xs"
        >
          Force Update
        </button>
        <button 
          onClick={handleAddTestItem}
          className="bg-green-600 px-2 py-1 rounded text-xs"
        >
          Add Test Item
        </button>
      </div>
    </div>
  );
};

export default CartDebug; 