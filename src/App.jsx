import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

// Layout
import MainLayout from './layout/MainLayout';

// Páginas (Alineadas con IEEE 830 RF-001 a RF-010)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Cotizaciones from './pages/Cotizaciones';
import VentasPedidos from './pages/VentasPedidos';
import TallerReparaciones from './pages/TallerReparaciones';
import Asesorias from './pages/Asesorias';
import Reportes from './pages/Reportes';

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta pública de acceso y recuperación de contraseña */}
            <Route path="/login" element={<Login />} />

            {/* Layout Principal con Navbar, Sidebar y Buscador Global */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventario" element={<Inventario />} />
              <Route path="cotizaciones" element={<Cotizaciones />} />
              <Route path="ventas" element={<VentasPedidos />} />
              <Route path="taller" element={<TallerReparaciones />} />
              <Route path="asesorias" element={<Asesorias />} />
              <Route path="reportes" element={<Reportes />} />
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}
