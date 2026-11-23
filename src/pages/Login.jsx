import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  HardHat,
  CheckCircle2,
  Truck,
  Users,
  KeyRound,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { MACHINERY_IMAGES } from '../data/mockData';

export default function Login() {
  const navigate = useNavigate();
  const { login, availableUsers } = useAuth();
  const { showToast, logAudit } = useAppData();

  // 'login' | 'recover' | 'recover_sent'
  const [viewMode, setViewMode] = useState('login');
  const [selectedUserId, setSelectedUserId] = useState('USR-01');
  const [selectedRole, setSelectedRole] = useState('Administrador');
  const [email, setEmail] = useState('juan.posada@centroserviciosje.com');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para Pantalla 1B: Recuperar Contraseña
  const [recoveryEmail, setRecoveryEmail] = useState('juan.posada@centroserviciosje.com');

  const rolesConfig = [
    { role: 'Administrador', userId: 'USR-01', label: 'Administrador', sub: 'Juan F. Posada', icon: ShieldCheck },
    { role: 'Técnico', userId: 'USR-03', label: 'Técnico', sub: 'Yarlei S. Posada', icon: HardHat },
    { role: 'Cliente', userId: 'USR-04', label: 'Cliente', sub: 'Finca Los Naranjos', icon: Users },
    { role: 'Proveedor', userId: 'USR-05', label: 'Proveedor', sub: 'STIHL Colombia', icon: Truck }
  ];

  const handleSelectRole = (item) => {
    setSelectedRole(item.role);
    setSelectedUserId(item.userId);
    const user = availableUsers.find((u) => u.id === item.userId) || availableUsers.find((u) => u.rol === item.role);
    if (user) {
      setEmail(user.email);
      setRecoveryEmail(user.email);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const logged = login(selectedRole, email, '', selectedUserId);
      logAudit('Seguridad (RNF-002)', `Inicio de sesión exitoso: ${logged.nombre} (${logged.rol})`, logged.nombre, logged.rol);
      showToast('Bienvenido a Centro de Servicios J&E', `Sesión autenticada como ${logged.nombre} (${logged.rol})`);
      navigate('/dashboard');
    }, 400);
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setViewMode('recover_sent');
      logAudit('Seguridad (RNF-002)', `Solicitud de restablecimiento de contraseña para ${recoveryEmail}`);
      showToast('Enlace Enviado', `Instrucciones enviadas a ${recoveryEmail}`, 'info');
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-surface-bg">
      {/* Lado Izquierdo: Identidad Institucional SENA & Taller J&E */}
      <div className="relative md:w-1/2 lg:w-5/12 min-h-[300px] md:min-h-screen flex flex-col justify-between p-8 text-white overflow-hidden">
        <img
          src={MACHINERY_IMAGES.tallerLogin}
          alt="Taller de maquinaria STIHL y Husqvarna"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-agri-deep via-agri-dark/92 to-agri-deep/80 backdrop-blur-[2px]" />

        {/* Header Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-base shadow-inner">
              J&E
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 block">
                SENA • ADSO Ficha 3386122 • IEEE 830
              </span>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Centro de Servicios J&E
              </h1>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-200 max-w-sm font-normal leading-relaxed">
            Sistema de Información para la gestión centralizada de ventas, inventario automático, cotizaciones, pedidos, historial de reparaciones, asesorías y facturación electrónica <strong>DIAN</strong>.
          </p>
        </div>

        {/* Lista de Cumplimiento Normativo IEEE 830 */}
        <div className="relative z-10 my-6 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Especialistas en <strong>STIHL, Husqvarna y Royal Cóndor</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Facturación Electrónica DIAN con validación previa y CUFE</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Control de acceso por roles (Administrador, Técnico, Cliente, Proveedor)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Trazabilidad de Kardex, Devoluciones y Asesorías Técnicas</span>
          </div>
        </div>

        {/* Footer Institucional con Equipo ADSO */}
        <div className="relative z-10 text-[11px] text-slate-300 border-t border-white/15 pt-3 space-y-1">
          <div className="flex justify-between font-semibold text-emerald-200">
            <span>Equipo ADSO Ficha 3386122</span>
            <span>SRS Rev. 1.0 • 2026</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            Camilo Espinosa • Yarlei Stiven Posada • Daniel Salazar • Álvaro Ríos • Juan Fernando Castañeda
          </p>
        </div>
      </div>

      {/* Lado Derecho: Pantalla 1 (Login) y Pantalla 1B (Recuperar Contraseña) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md bg-white p-7 rounded-xl border border-surface-border shadow-sm space-y-6">
          {viewMode === 'login' && (
            <>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-agri text-[11px] font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Autenticación Segura RNF-002</span>
                </div>
                <h2 className="text-2xl font-bold text-surface-dark tracking-tight">
                  Ingreso al Sistema
                </h2>
                <p className="text-xs text-surface-muted mt-1">
                  Seleccione el perfil de usuario según la especificación IEEE 830
                </p>
              </div>

              {/* Selector de los 4 Roles del IEEE 830 (Sección 2.3 y 3.1.1) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Rol de Usuario (IEEE 830 - Sección 2.3)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {rolesConfig.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => handleSelectRole(item)}
                        className={`py-2 px-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'border-agri bg-emerald-50/90 text-agri font-bold ring-1 ring-agri'
                            : 'border-surface-border bg-slate-50/60 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-agri' : 'text-slate-400'}`} />
                        <span className="text-xs leading-tight">{item.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal truncate max-w-full">
                          {item.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector rápido de stakeholder cuando es Administrador */}
              {selectedRole === 'Administrador' && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-surface-border flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-600">Stakeholder Admin:</span>
                  <div className="flex gap-1.5">
                    {availableUsers
                      .filter((u) => u.rol === 'Administrador')
                      .map((adminUser) => (
                        <button
                          key={adminUser.id}
                          type="button"
                          onClick={() => {
                            setSelectedUserId(adminUser.id);
                            setEmail(adminUser.email);
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                            selectedUserId === adminUser.id
                              ? 'bg-agri text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {adminUser.nombre.split(' ')[0]} {adminUser.nombre.split(' ')[1]}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Formulario de Acceso */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Usuario / Correo Electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-surface-border rounded-lg text-xs text-surface-dark focus:outline-none focus:ring-2 focus:ring-agri transition-all"
                      placeholder="usuario@centroserviciosje.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Contraseña *
                    </label>
                    <button
                      type="button"
                      onClick={() => setViewMode('recover')}
                      className="text-[11px] font-semibold text-agri hover:underline cursor-pointer"
                    >
                      ¿Olvidó su contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 bg-white border border-surface-border rounded-lg text-xs text-surface-dark focus:outline-none focus:ring-2 focus:ring-agri transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white font-bold text-xs bg-agri hover:bg-agri-hover active:scale-[0.99] transition-all cursor-pointer shadow-sm disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Iniciar Sesión en J&E</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Pantalla 1B: Recuperar Contraseña (Stitch Design) */}
          {viewMode === 'recover' && (
            <div className="space-y-5">
              <div>
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-agri mb-3 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al inicio de sesión</span>
                </button>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-agri flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-surface-dark tracking-tight">
                  Recuperar Contraseña
                </h2>
                <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                  Ingrese el correo electrónico asociado a su cuenta en el <strong>Centro de Servicios J&E</strong> para recibir el enlace de restablecimiento seguro.
                </p>
              </div>

              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo Electrónico Registrado *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-surface-border rounded-lg text-xs text-surface-dark focus:outline-none focus:ring-2 focus:ring-agri"
                      placeholder="correo@centroserviciosje.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-lg text-white font-bold text-xs bg-agri hover:bg-agri-hover transition-all cursor-pointer shadow-sm"
                  >
                    {isLoading ? 'Procesando solicitud...' : 'Enviar Instrucciones de Recuperación'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('login')}
                    className="w-full py-2 px-4 rounded-lg text-slate-600 font-semibold text-xs bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {viewMode === 'recover_sent' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ¡Solicitud de Recuperación Enviada!
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Hemos enviado un enlace temporal con protocolo seguro HTTPS/TLS al correo <strong className="text-slate-900">{recoveryEmail}</strong>.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-surface-border text-[11px] text-slate-500 text-left">
                Si es Técnico o Cliente y requiere asistencia inmediata, comuníquese con el Administrador Principal <strong>Juan Fernando Posada (313 642 2685)</strong>.
              </div>
              <button
                type="button"
                onClick={() => setViewMode('login')}
                className="w-full py-2.5 px-4 rounded-lg text-white font-bold text-xs bg-agri hover:bg-agri-hover transition-all cursor-pointer"
              >
                Regresar al Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
