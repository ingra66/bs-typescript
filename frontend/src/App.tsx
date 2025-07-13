import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { ProductPage } from '@/pages/ProductPage';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

function App() {
  return (
    <div className="App" style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
