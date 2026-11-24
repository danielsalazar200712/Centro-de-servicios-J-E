import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../components/common/ToastContainer';
import GlobalSearchModal from '../components/common/GlobalSearchModal';

export default function MainLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-60 flex flex-col flex-1 min-h-screen">
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="no-print py-3 px-6 border-t border-surface-border bg-white/90 text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Centro de Servicios J&E</strong> • Taller Especializado STIHL, Husqvarna & Royal Cóndor
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Gestión de Taller, Repuestos y Facturación Electrónica
          </span>
        </footer>
      </div>

      {/* Buscador Global Ctrl+K y Notificaciones Toast */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
}
