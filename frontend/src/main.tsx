import './App.css';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import './global.css';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { AuthInitializer } from './components/auth/AuthInitializer';
import { setNavigate } from './stores/authStore';

function NavigationSetter() {
  const navigate = useNavigate();
  setNavigate(navigate);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NavigationSetter />
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </BrowserRouter>
  </StrictMode>
);
